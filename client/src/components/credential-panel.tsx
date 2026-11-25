import { useCallback, type CSSProperties, type ReactNode, type RefObject } from "react";
import { SpotlightCountUp, SpotlightReveal, useSpotlightInView } from "@/components/role-spotlight";
import { cn } from "@/lib/utils";
import "@/styles/spotlights/cred.css";

/*
 * Shared parts for the newer "Inside the credential" panels (GRE, AI Fluency and the
 * certification category cards). Each panel's theme sets the --cred-* colours on its
 * .role-spotlight--* class, and adds its own hero visual and sections.
 */

export interface CredStep {
  title: string;
  body: string;
}

/** A number that counts up, or a fixed value such as a year or a range. */
export interface CredFigure {
  label: string;
  to?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  value?: string;
}

export interface CredCard {
  title: string;
  body: string;
}

export function CredEyebrow({ children, id }: { children: ReactNode; id?: string }) {
  return (
    <p id={id} className="cred-eyebrow">
      {children}
    </p>
  );
}

/** Scrolls a section to the top of the panel, without smooth scrolling under reduced motion. */
export function useShowSection(ref: RefObject<HTMLElement>) {
  return useCallback(() => {
    const reduce = typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    ref.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }, [ref]);
}

function FigureValue({ figure, delay }: { figure: CredFigure; delay: number }) {
  if (figure.value !== undefined || figure.to === undefined) return <>{figure.value}</>;
  return (
    <SpotlightCountUp
      to={figure.to}
      prefix={figure.prefix}
      suffix={figure.suffix}
      decimals={figure.decimals}
      delay={delay}
    />
  );
}

/** Three steps on a line that fills in as it scrolls into view. */
export function CredWorkflow({ steps }: { steps: CredStep[] }) {
  const { ref, active } = useSpotlightInView();

  return (
    <div ref={ref} className={cn("cred-flow", active && "is-active")}>
      <div className="cred-flow-track" aria-hidden="true">
        <span className="cred-flow-fill" />
      </div>
      <ol className="cred-flow-steps">
        {steps.map((step, index) => (
          <li key={step.title} className="cred-flow-step" style={{ "--step-index": index } as CSSProperties}>
            <span className="cred-flow-node" aria-hidden="true">
              {index + 1}
            </span>
            <div className="cred-flow-card">
              <h4 className="cred-flow-title">{step.title}</h4>
              <p className="cred-flow-body">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** Large figures: rows on phones, three columns from 640px. */
export function CredResults({ figures }: { figures: CredFigure[] }) {
  return (
    <dl className="cred-results">
      {figures.map((figure, index) => (
        <SpotlightReveal key={figure.label} delay={80 + index * 90} className="cred-result">
          <dt className="cred-result-label">{figure.label}</dt>
          <dd className="cred-result-value">
            <FigureValue figure={figure} delay={160 + index * 90} />
          </dd>
        </SpotlightReveal>
      ))}
    </dl>
  );
}

/** The full-bleed band's stat tiles: two columns on phones, four from 900px. */
export function CredStats({ figures }: { figures: CredFigure[] }) {
  return (
    <dl className="cred-stats">
      {figures.map((figure, index) => (
        <SpotlightReveal key={figure.label} delay={60 + index * 70} className="cred-stat">
          <dt className="cred-stat-label">{figure.label}</dt>
          <dd className="cred-stat-value">
            <FigureValue figure={figure} delay={120 + index * 70} />
          </dd>
        </SpotlightReveal>
      ))}
    </dl>
  );
}

export function CredDone({ children }: { children: ReactNode }) {
  return (
    <SpotlightReveal delay={120}>
      <p className="cred-done">
        <span className="cred-done-check" aria-hidden="true">
          ✓
        </span>
        <span>{children}</span>
      </p>
    </SpotlightReveal>
  );
}

export function CredCards({ cards }: { cards: CredCard[] }) {
  return (
    <ul className="cred-cards">
      {cards.map((card, index) => (
        <li key={card.title}>
          <SpotlightReveal delay={60 + index * 70} className="cred-card">
            <span className="cred-card-title">{card.title}</span>
            <span className="cred-card-body">{card.body}</span>
          </SpotlightReveal>
        </li>
      ))}
    </ul>
  );
}

export function CredFooter({ note, href, linkLabel }: { note: string; href?: string; linkLabel?: string }) {
  return (
    <SpotlightReveal>
      <footer className="cred-footer">
        <p>{note}</p>
        {href && linkLabel ? (
          <a href={href} target="_blank" rel="noopener noreferrer" className="cred-link">
            {linkLabel}
            <span aria-hidden="true"> ›</span>
          </a>
        ) : null}
      </footer>
    </SpotlightReveal>
  );
}
