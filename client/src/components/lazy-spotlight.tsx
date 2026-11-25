import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ComponentType } from "react";
import { SpotlightTrigger } from "@/components/spotlight-trigger";
import type { SpotlightTriggerText } from "@/components/spotlight-triggers";

/*
 * LazySpotlight
 * Shows a panel's "+" button straight away and loads the panel's code and styles
 * only when the button is about to scroll into view, is hovered or focused, or is
 * pressed. A press that lands before the panel has loaded opens it once it has.
 * If the panel's files can no longer be fetched, a press reloads the page once.
 */

interface LazySpotlightProps<P extends object> {
  /** Imports the panel. Pass a stable function (declared outside the component). */
  load: () => Promise<{ default: ComponentType<P> }>;
  props: P;
  trigger: SpotlightTriggerText;
}

const RELOAD_KEY = "spotlight-reloaded-at";

/** True when online and this tab has not already reloaded for a missing panel in the last minute. */
function canReloadOnce() {
  if (typeof navigator !== "undefined" && navigator.onLine === false) return false;
  try {
    const last = Number(window.sessionStorage.getItem(RELOAD_KEY) ?? 0);
    if (Date.now() - last < 60_000) return false;
    window.sessionStorage.setItem(RELOAD_KEY, String(Date.now()));
    return true;
  } catch {
    return false;
  }
}

export function LazySpotlight<P extends object>({ load, props, trigger }: LazySpotlightProps<P>) {
  const [Panel, setPanel] = useState<ComponentType<P> | null>(null);
  const placeholderRef = useRef<HTMLButtonElement>(null);
  const parentRef = useRef<HTMLElement | null>(null);
  const requested = useRef(false);
  const mounted = useRef(true);
  const handoff = useRef({ open: false, focus: false });

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const request = useCallback(() => {
    if (requested.current) return;
    requested.current = true;
    load()
      .then((module) => {
        if (!mounted.current) return;
        const placeholder = placeholderRef.current;
        parentRef.current = placeholder?.parentElement ?? null;
        handoff.current.focus = placeholder !== null && document.activeElement === placeholder;
        setPanel(() => module.default);
      })
      .catch(() => {
        requested.current = false;
        const pressed = handoff.current.open;
        handoff.current.open = false;
        // The panel's files are gone, most likely replaced by a newer version of the
        // site. If the reader pressed the button, fetch the current page (once).
        if (pressed && canReloadOnce()) window.location.reload();
      });
  }, [load]);

  // Load shortly before the button scrolls into view.
  useEffect(() => {
    if (Panel) return;
    const placeholder = placeholderRef.current;
    if (!placeholder) return;
    if (typeof IntersectionObserver === "undefined") {
      request();
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          request();
        }
      },
      { rootMargin: "400px 0px" },
    );
    observer.observe(placeholder);
    return () => observer.disconnect();
  }, [Panel, request]);

  // Hand focus, and a press made while loading, over to the panel's own button.
  useLayoutEffect(() => {
    if (!Panel) return;
    const { open, focus } = handoff.current;
    handoff.current = { open: false, focus: false };
    const button = parentRef.current?.querySelector<HTMLButtonElement>(".role-spotlight-trigger");
    if (!button) return;
    if (focus) button.focus({ preventScroll: true });
    if (open) button.click();
  }, [Panel]);

  if (Panel) return <Panel {...props} />;

  return (
    <SpotlightTrigger
      ref={placeholderRef}
      label={trigger.label}
      hint={trigger.hint}
      aria-expanded={false}
      onPointerEnter={request}
      onFocus={request}
      onClick={() => {
        handoff.current.open = true;
        request();
      }}
    />
  );
}
