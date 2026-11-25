import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

/*
 * RoleSpotlight
 * An Apple-style "+" trigger that morphs an experience card into an immersive
 * overlay. The card's shape grows into the panel (clip-path), its logo and
 * title fly into the panel header (FLIP), the surface shifts from white to
 * the theme's surface colour, and the content cascades in as it scrolls into
 * view.
 */

type Phase = "closed" | "opening" | "open" | "closing";

const OPEN_MS = 820;
const CLOSE_MS = 600;
const EASE = "cubic-bezier(0.32, 0.72, 0, 1)";
const SOURCE_HIDDEN_CLASS = "role-spotlight-source-hidden";

interface SpotlightContextValue {
  revealed: boolean;
  scrollRoot: HTMLElement | null;
  reducedMotion: boolean;
}

const SpotlightContext = createContext<SpotlightContextValue>({
  revealed: true,
  scrollRoot: null,
  reducedMotion: true,
});

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() =>
    typeof window !== "undefined" && typeof window.matchMedia === "function"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false,
  );

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(query.matches);
    query.addEventListener?.("change", onChange);
    return () => query.removeEventListener?.("change", onChange);
  }, []);

  return reduced;
}

function useInView(active: boolean, root: HTMLElement | null) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!active || inView) return;
    const element = ref.current;
    if (!element) return;
    if (!root || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setInView(true);
          observer.disconnect();
        }
      },
      { root, threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [active, inView, root]);

  return { ref, inView };
}

interface SpotlightRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  style?: CSSProperties;
}

/** Fades and lifts its content in once the panel is open and it scrolls into view. */
export function SpotlightReveal({ children, className, delay = 0, style }: SpotlightRevealProps) {
  const { revealed, scrollRoot } = useContext(SpotlightContext);
  const { ref, inView } = useInView(revealed, scrollRoot);
  const shown = revealed && inView;

  return (
    <div
      ref={ref}
      className={cn("role-spotlight-reveal", shown && "is-shown", className)}
      style={{ ...style, "--reveal-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
}

interface SpotlightCountUpProps {
  to: number;
  prefix?: string;
  suffix?: string;
  delay?: number;
  duration?: number;
}

/** Counts up to `to` the first time it is revealed. */
export function SpotlightCountUp({ to, prefix = "", suffix = "", delay = 0, duration = 1500 }: SpotlightCountUpProps) {
  const { revealed, scrollRoot, reducedMotion } = useContext(SpotlightContext);
  const { ref, inView } = useInView(revealed, scrollRoot);
  const [value, setValue] = useState(reducedMotion ? to : 0);

  useEffect(() => {
    if (!revealed || !inView) return;
    if (reducedMotion) {
      setValue(to);
      return;
    }

    let frame = 0;
    const startAt = performance.now() + delay;
    const tick = (now: number) => {
      const elapsed = now - startAt;
      if (elapsed < 0) {
        frame = requestAnimationFrame(tick);
        return;
      }
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setValue(Math.round(to * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [delay, duration, inView, reducedMotion, revealed, to]);

  return (
    <span ref={ref as unknown as RefObject<HTMLSpanElement>} className="role-spotlight-count">
      <span aria-hidden="true">
        {prefix}
        {value}
        {suffix}
      </span>
      <span className="sr-only">
        {prefix}
        {to}
        {suffix}
      </span>
    </span>
  );
}

/** True while the spotlight panel is revealed (used for line-draw effects). */
export function useSpotlightInView() {
  const { revealed, scrollRoot } = useContext(SpotlightContext);
  const { ref, inView } = useInView(revealed, scrollRoot);
  return { ref, active: revealed && inView };
}

interface RoleSpotlightProps {
  /** The card the panel grows out of and shrinks back into. */
  originRef: RefObject<HTMLElement>;
  logoSrc: string;
  logoAlt: string;
  title: string;
  meta: string;
  triggerLabel: string;
  triggerHint: string;
  /**
   * Theme class for the overlay. A theme can set --role-spotlight-surface,
   * --role-spotlight-tile, --role-spotlight-logo-filter and
   * --role-spotlight-title-color on .role-spotlight-panel; the morph animates
   * from the card's look to those values.
   */
  className?: string;
  children: ReactNode;
}

function getFocusable(container: HTMLElement) {
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  ).filter((element) => !element.hasAttribute("disabled") && element.offsetParent !== null);
}

export function RoleSpotlight({
  originRef,
  logoSrc,
  logoAlt,
  title,
  meta,
  triggerLabel,
  triggerHint,
  className,
  children,
}: RoleSpotlightProps) {
  const [phase, setPhase] = useState<Phase>("closed");
  const [revealed, setRevealed] = useState(false);
  const [scrollRoot, setScrollRoot] = useState<HTMLDivElement | null>(null);
  const reducedMotion = usePrefersReducedMotion();
  const titleId = useId();
  const panelId = useId();

  const triggerRef = useRef<HTMLButtonElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const animationsRef = useRef<Animation[]>([]);
  const timersRef = useRef<number[]>([]);

  const stopAnimations = useCallback(() => {
    animationsRef.current.forEach((animation) => animation.cancel());
    animationsRef.current = [];
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current = [];
  }, []);

  const isOpen = phase !== "closed";

  const openSpotlight = useCallback(() => {
    setPhase((current) => (current === "closed" ? "opening" : current));
  }, []);

  const closeSpotlight = useCallback(() => {
    setPhase((current) => (current === "open" || current === "opening" ? "closing" : current));
  }, []);

  // Lock page scroll while the panel is up.
  useEffect(() => {
    if (!isOpen) return;
    const root = document.documentElement;
    const scrollbarWidth = Math.max(0, window.innerWidth - root.clientWidth);
    root.style.setProperty("--role-spotlight-scrollbar", `${scrollbarWidth}px`);
    root.classList.add("role-spotlight-open");
    return () => {
      root.classList.remove("role-spotlight-open");
      root.style.removeProperty("--role-spotlight-scrollbar");
    };
  }, [isOpen]);

  // Escape closes; Tab stays inside the panel.
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeSpotlight();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;
      const focusable = getFocusable(panelRef.current);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [closeSpotlight, isOpen]);

  const morph = useCallback(
    (direction: "open" | "close") => {
      const panel = panelRef.current;
      const backdrop = backdropRef.current;
      const origin = originRef.current;
      if (!panel || !backdrop || !origin) return [] as Animation[];

      const duration = direction === "open" ? OPEN_MS : CLOSE_MS;
      const options: KeyframeAnimationOptions = { duration, easing: EASE, fill: "both" };
      const originRect = origin.getBoundingClientRect();
      const panelRect = panel.getBoundingClientRect();
      const panelStyle = getComputedStyle(panel);
      const themeValue = (name: string, fallback: string) => panelStyle.getPropertyValue(name).trim() || fallback;
      const originRadius = Number.parseFloat(getComputedStyle(origin).borderTopLeftRadius) || 18;
      const panelRadius = Number.parseFloat(panelStyle.getPropertyValue("--role-spotlight-radius")) || 0;
      const surface = themeValue("--role-spotlight-surface", "rgb(0, 0, 0)");
      const tileColor = themeValue("--role-spotlight-tile", "rgb(255, 255, 255)");
      const logoFilter = themeValue("--role-spotlight-logo-filter", "none");
      const titleColor = themeValue("--role-spotlight-title-color", "rgb(245, 245, 247)");

      const cardShape = `inset(${originRect.top - panelRect.top}px ${panelRect.right - originRect.right}px ${
        panelRect.bottom - originRect.bottom
      }px ${originRect.left - panelRect.left}px round ${originRadius}px)`;
      const panelShape = `inset(0px 0px 0px 0px round ${panelRadius}px)`;

      const shapeFrames: Keyframe[] = [
        { offset: 0, clipPath: cardShape, backgroundColor: "rgba(255, 255, 255, 0)" },
        { offset: 0.12, backgroundColor: "rgb(255, 255, 255)" },
        { offset: 0.4, backgroundColor: "rgb(255, 255, 255)" },
        { offset: 1, clipPath: panelShape, backgroundColor: surface },
      ];
      const backdropFrames: Keyframe[] = [{ opacity: 0 }, { opacity: 1 }];

      // Size of the image actually drawn inside an object-fit: contain box.
      const drawnBox = (element: Element) => {
        const rect = element.getBoundingClientRect();
        let width = rect.width;
        let height = rect.height;
        if (element instanceof HTMLImageElement && element.naturalWidth > 0 && element.naturalHeight > 0) {
          const ratio = element.naturalWidth / element.naturalHeight;
          if (width / height > ratio) width = height * ratio;
          else height = width / ratio;
        }
        return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, width, height };
      };

      // The logo flies centre-to-centre so the drawn mark lines up exactly.
      const flyFrames = (source: Element | null, target: HTMLElement | null) => {
        if (!source || !target) return null;
        const from = drawnBox(source);
        const to = drawnBox(target);
        if (from.width === 0 || to.width === 0) return null;
        // A theme can recolour the mark as it lands (e.g. the brand colour turning white).
        const filters = logoFilter !== "none" ? [{ filter: "none" }, { filter: logoFilter }] : [{}, {}];
        return [
          {
            transform: `translate(${from.x - to.x}px, ${from.y - to.y}px) scale(${from.width / to.width})`,
            ...filters[0],
          },
          { transform: "translate(0px, 0px) scale(1)", ...filters[1] },
        ] as Keyframe[];
      };

      const logoSource = origin.querySelector('[data-spotlight-source="logo"]');
      const titleSource = origin.querySelector('[data-spotlight-source="title"]');
      // The title is measured by font size so wrapping differences don't distort it.
      let titleFrames: Keyframe[] | null = null;
      if (titleSource && titleRef.current) {
        const from = titleSource.getBoundingClientRect();
        const to = titleRef.current.getBoundingClientRect();
        const fromSize = Number.parseFloat(getComputedStyle(titleSource).fontSize) || 18;
        const toSize = Number.parseFloat(getComputedStyle(titleRef.current).fontSize) || 28;
        titleFrames = [
          {
            transform: `translate(${from.left - to.left}px, ${from.top - to.top}px) scale(${fromSize / toSize})`,
            color: getComputedStyle(titleSource).color,
          },
          { transform: "translate(0px, 0px) scale(1)", color: titleColor },
        ];
      }
      const logoFrames = flyFrames(logoSource, logoRef.current);
      const tile = logoRef.current?.parentElement ?? null;

      const ordered = <T,>(frames: T[]) => (direction === "open" ? frames : [...frames].reverse());
      const reverseOffsets = (frames: Keyframe[]) =>
        direction === "open"
          ? frames
          : [...frames].reverse().map((frame) => ({
              ...frame,
              ...(typeof frame.offset === "number" ? { offset: 1 - frame.offset } : {}),
            }));

      const animations: Animation[] = [
        panel.animate(reverseOffsets(shapeFrames), options),
        backdrop.animate(ordered(backdropFrames), {
          ...options,
          duration: direction === "open" ? duration * 0.7 : duration,
          easing: "ease-out",
        }),
      ];
      if (logoFrames && logoRef.current) animations.push(logoRef.current.animate(ordered(logoFrames), options));
      if (tile && logoFrames) {
        animations.push(
          tile.animate(ordered([{ backgroundColor: "rgba(255, 255, 255, 0)" }, { backgroundColor: tileColor }]), options),
        );
      }
      if (titleFrames && titleRef.current) animations.push(titleRef.current.animate(ordered(titleFrames), options));
      return animations;
    },
    [originRef],
  );

  // Opening: grow from the card.
  useLayoutEffect(() => {
    if (phase !== "opening") return;
    const panel = panelRef.current;
    const backdrop = backdropRef.current;
    const origin = originRef.current;
    closeRef.current?.focus({ preventScroll: true });

    if (!panel || !backdrop || !origin || reducedMotion || typeof panel.animate !== "function") {
      setRevealed(true);
      setPhase("open");
      return;
    }

    stopAnimations();
    origin.classList.add(SOURCE_HIDDEN_CLASS);
    const animations = morph("open");
    animationsRef.current = animations;
    timersRef.current.push(window.setTimeout(() => setRevealed(true), OPEN_MS * 0.3));

    const main = animations[0];
    if (main) {
      main.finished
        .then(() => setPhase((current) => (current === "opening" ? "open" : current)))
        .catch(() => undefined);
    } else {
      setPhase("open");
    }
  }, [morph, originRef, phase, reducedMotion, stopAnimations]);

  // Closing: content fades, then the panel folds back into the card.
  useLayoutEffect(() => {
    if (phase !== "closing") return;
    const panel = panelRef.current;
    const origin = originRef.current;
    setRevealed(false);

    const finish = () => {
      stopAnimations();
      origin?.classList.remove(SOURCE_HIDDEN_CLASS);
      setPhase("closed");
      window.requestAnimationFrame(() => triggerRef.current?.focus({ preventScroll: true }));
    };

    if (!panel || !origin || reducedMotion || typeof panel.animate !== "function") {
      finish();
      return;
    }

    // If the reader scrolled deep into the panel, glide back to the header first.
    const scroller = scrollRoot;
    const scrolled = scroller ? scroller.scrollTop : 0;
    if (scroller && scrolled > 0) {
      scroller.scrollTo({ top: 0, behavior: "auto" });
    }

    animationsRef.current.forEach((animation) => animation.cancel());
    const animations = morph("close");
    animationsRef.current = animations;
    const main = animations[0];
    if (main) {
      main.finished.then(finish).catch(() => undefined);
    } else {
      finish();
    }
  }, [morph, originRef, phase, reducedMotion, scrollRoot, stopAnimations]);

  useEffect(() => () => stopAnimations(), [stopAnimations]);

  const portal =
    isOpen && typeof document !== "undefined"
      ? createPortal(
          <SpotlightContext.Provider value={{ revealed, scrollRoot, reducedMotion }}>
            <div className={cn("role-spotlight", className, revealed && "is-revealed", `is-${phase}`)}>
              <div ref={backdropRef} className="role-spotlight-backdrop" onClick={closeSpotlight} aria-hidden="true" />
              <div
                ref={panelRef}
                id={panelId}
                className="role-spotlight-panel"
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
              >
                <button
                  ref={closeRef}
                  type="button"
                  className="role-spotlight-close"
                  onClick={closeSpotlight}
                  aria-label="Close"
                >
                  <svg viewBox="0 0 20 20" aria-hidden="true">
                    <path d="M5.5 5.5l9 9M14.5 5.5l-9 9" />
                  </svg>
                </button>

                <div ref={setScrollRoot} className="role-spotlight-scroll">
                  <div className="role-spotlight-inner">
                    <header className="role-spotlight-header">
                      <div className="role-spotlight-logo-tile">
                        <img ref={logoRef} src={logoSrc} alt={logoAlt} className="role-spotlight-logo" />
                      </div>
                      <div className="role-spotlight-heading">
                        <h2 ref={titleRef} id={titleId} className="role-spotlight-title">
                          {title}
                        </h2>
                        <SpotlightReveal delay={40}>
                          <p className="role-spotlight-meta">{meta}</p>
                        </SpotlightReveal>
                      </div>
                    </header>
                    {children}
                  </div>
                </div>
              </div>
            </div>
          </SpotlightContext.Provider>,
          document.body,
        )
      : null;

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="role-spotlight-trigger"
        onClick={openSpotlight}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls={isOpen ? panelId : undefined}
      >
        <span className="role-spotlight-trigger-copy">
          <span className="role-spotlight-trigger-label">{triggerLabel}</span>
          <span className="role-spotlight-trigger-hint">{triggerHint}</span>
        </span>
        <span className="role-spotlight-trigger-icon" aria-hidden="true">
          <svg viewBox="0 0 20 20">
            <path d="M10 4.5v11M4.5 10h11" />
          </svg>
        </span>
      </button>
      {portal}
    </>
  );
}
