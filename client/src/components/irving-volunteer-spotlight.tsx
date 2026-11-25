import { useRef, type CSSProperties, type ReactNode, type RefObject } from "react";
import {
  RoleSpotlight,
  SpotlightCountUp,
  SpotlightReveal,
  useSpotlightInView,
} from "@/components/role-spotlight";
import { IRVING_URL, company } from "@/components/irving-spotlight";
import { cn } from "@/lib/utils";
import { spotlightTriggers } from "@/components/spotlight-triggers";
import "@/styles/spotlights/irving-volunteer.css";

/*
 * "Inside the role" panel for the Irving Oil volunteer card in Community, in the same
 * Irving branding as the Irving Oil experience panel (white pages, slate headings, Irving
 * red pill buttons, the blue and red of the logo, a deep navy band).
 * Sources:
 * - irvingoil.com (Nov 2026): company facts, as in the experience panel; Fuel the Care,
 *   started in 2002, fuel cards for families travelling for a child's medical care, now
 *   across Atlantic Canada, Quebec, New England and Ireland; Good Energy in Action, its
 *   workplace giving and volunteering program
 * - Canada's Top 100 Employers review of Irving Oil: a paid day each year to volunteer
 * - New Brunswick Community College (2025): Irving Oil's gift and the Irving Oil Energy Lab
 * - My community card: volunteer staff in Saint John in 2018; activities for over 100
 *   children; a safe, enjoyable event; working with fellow volunteers
 */

const workflow = [
  {
    title: "Coordinate",
    body: "I worked with fellow volunteers so every activity was covered and the event ran smoothly.",
  },
  {
    title: "Run",
    body: "I ran activities for more than 100 children over the course of the event.",
  },
  {
    title: "Keep it safe",
    body: "Throughout, I kept things safe and enjoyable for every child taking part.",
  },
];

const community = [
  {
    title: "Fuel the Care",
    body: "Since 2002, fuel cards for families travelling for a child’s medical care, across Atlantic Canada, Quebec, New England and Ireland.",
  },
  {
    title: "Good Energy in Action",
    body: "Irving’s workplace giving and volunteering program, with a paid day each year for employees to volunteer.",
  },
  {
    title: "Education",
    body: "A 2025 gift to New Brunswick Community College, where a power lab became the Irving Oil Energy Lab.",
  },
];

const toolkit = ["Youth Engagement", "Event Coordination", "Team Collaboration", "Community Relations", "Safety Management"];

/** 100 children, then the plus, then the volunteer team. Decorative. */
function EventVisual() {
  const { ref, active } = useSpotlightInView();

  return (
    <div ref={ref} className={cn("irv-event", active && "is-active")} aria-hidden="true">
      <div className="irv-event-head">
        <span className="irv-event-title">The event</span>
        <span className="irv-event-chip">Saint John · 2018</span>
      </div>
      <div className="irv-event-grid">
        {Array.from({ length: 100 }, (_, index) => (
          <i key={index} style={{ "--i": index } as CSSProperties} />
        ))}
      </div>
      <div className="irv-event-count">
        <span className="irv-event-value">
          100<b>+</b>
        </span>
        <span className="irv-event-label">children at the activities I ran</span>
      </div>
      <div className="irv-event-team">
        <span className="irv-event-avatars">
          {Array.from({ length: 5 }, (_, index) => (
            <span key={index} style={{ "--i": index } as CSSProperties} />
          ))}
        </span>
        <span className="irv-event-team-label">With fellow volunteers</span>
      </div>
    </div>
  );
}

function Workflow() {
  const { ref, active } = useSpotlightInView();

  return (
    <div ref={ref} className={cn("irv-flow", active && "is-active")}>
      <div className="irv-flow-track" aria-hidden="true">
        <span className="irv-flow-fill" />
      </div>
      <ol className="irv-flow-steps">
        {workflow.map((step, index) => (
          <li key={step.title} className="irv-flow-step" style={{ "--step-index": index } as CSSProperties}>
            <span className="irv-flow-node" aria-hidden="true">
              {index + 1}
            </span>
            <div className="irv-flow-card">
              <h4 className="irv-flow-title">{step.title}</h4>
              <p className="irv-flow-body">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function Eyebrow({ children, id, light = false }: { children: ReactNode; id?: string; light?: boolean }) {
  return (
    <p id={id} className={cn("irv-eyebrow", light && "is-light")}>
      {children}
    </p>
  );
}

interface IrvingVolunteerSpotlightProps {
  originRef: RefObject<HTMLElement>;
  logoSrc: string;
}

export default function IrvingVolunteerSpotlight({ originRef, logoSrc }: IrvingVolunteerSpotlightProps) {
  const roleRef = useRef<HTMLElement>(null);

  const showRole = () => {
    const reduce = typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    roleRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };

  return (
    <RoleSpotlight
      originRef={originRef}
      logoSrc={logoSrc}
      logoAlt="Irving Oil logo"
      title="Volunteer Staff"
      meta="Irving Oil Limited · Saint John, NB · 2018"
      triggerLabel={spotlightTriggers["irving-volunteer"].label}
      triggerHint={spotlightTriggers["irving-volunteer"].hint}
      className="role-spotlight--irving"
    >
      <section className="irv-hero">
        <div className="irv-hero-copy">
          <SpotlightReveal delay={0}>
            <Eyebrow>Inside the role</Eyebrow>
          </SpotlightReveal>
          <SpotlightReveal delay={70}>
            <h3 className="irv-display">A safe, fun event for more than 100 kids.</h3>
          </SpotlightReveal>
          <SpotlightReveal delay={150}>
            <p className="irv-lede">
              Irving Oil has served customers across Eastern Canada and New England since 1924, and gives back in the
              communities it serves. As volunteer staff at an Irving Oil event in Saint John, I ran activities for more
              than 100 children, kept the event safe and enjoyable, and worked with fellow volunteers to keep it
              running smoothly.
            </p>
          </SpotlightReveal>
          <SpotlightReveal delay={220}>
            <div className="irv-actions">
              <button type="button" className="irv-button" onClick={showRole}>
                See my role
              </button>
              <a href={IRVING_URL} target="_blank" rel="noopener noreferrer" className="irv-button irv-button-outline">
                Visit Irving Oil
              </a>
            </div>
          </SpotlightReveal>
        </div>
        <SpotlightReveal delay={140} className="irv-hero-visual">
          <EventVisual />
        </SpotlightReveal>
      </section>

      <section className="irv-band" aria-labelledby="irv-vol-company-title">
        <div className="irv-band-inner">
          <SpotlightReveal>
            <Eyebrow light>Irving Oil</Eyebrow>
            <h3 id="irv-vol-company-title" className="irv-heading is-light">
              Canada&rsquo;s largest refinery, run from Saint John.
            </h3>
          </SpotlightReveal>
          <dl className="irv-stats">
            {company.map((item, index) => (
              <SpotlightReveal key={item.label} delay={60 + index * 70} className="irv-stat">
                <dt className="irv-stat-label">{item.label}</dt>
                <dd className="irv-stat-value">
                  {item.text ?? <SpotlightCountUp to={item.to ?? 0} suffix={item.suffix} delay={120 + index * 70} />}
                </dd>
              </SpotlightReveal>
            ))}
          </dl>
          <SpotlightReveal delay={140}>
            <p className="irv-band-note">
              Through Good Energy in Action, Irving employees each get a paid day every year to volunteer, alongside
              company-led volunteer opportunities.
            </p>
          </SpotlightReveal>
        </div>
      </section>

      <section ref={roleRef} className="irv-section irv-role" aria-labelledby="irv-vol-role-title">
        <SpotlightReveal>
          <Eyebrow>My role</Eyebrow>
          <h3 id="irv-vol-role-title" className="irv-heading">
            Many hands, one smooth event.
          </h3>
        </SpotlightReveal>
        <SpotlightReveal delay={80}>
          <Workflow />
        </SpotlightReveal>
        <dl className="irv-results">
          <SpotlightReveal delay={80} className="irv-result">
            <dt className="irv-result-label">children took part in the activities I ran</dt>
            <dd className="irv-result-value">
              <SpotlightCountUp to={100} suffix="+" delay={160} />
            </dd>
          </SpotlightReveal>
          <SpotlightReveal delay={170} className="irv-result">
            <dt className="irv-result-label">the season I volunteered, in Saint John</dt>
            <dd className="irv-result-value">2018</dd>
          </SpotlightReveal>
        </dl>
      </section>

      <section className="irv-section" aria-labelledby="irv-vol-community-title">
        <SpotlightReveal>
          <Eyebrow>Irving in the community, 2026</Eyebrow>
          <h3 id="irv-vol-community-title" className="irv-heading">
            How Irving gives back.
          </h3>
          <p className="irv-section-lede">
            Irving gives back in other ways too. These are some of them.
          </p>
        </SpotlightReveal>
        <ul className="irv-programs">
          {community.map((program, index) => (
            <li key={program.title}>
              <SpotlightReveal delay={60 + index * 70} className="irv-program">
                <span className="irv-program-title">{program.title}</span>
                <span className="irv-program-body">{program.body}</span>
              </SpotlightReveal>
            </li>
          ))}
        </ul>
      </section>

      <section className="irv-section irv-toolkit" aria-labelledby="irv-vol-toolkit-title">
        <SpotlightReveal>
          <Eyebrow id="irv-vol-toolkit-title">Toolkit</Eyebrow>
          <ul className="irv-chips">
            {toolkit.map((item) => (
              <li key={item} className="irv-chip">
                {item}
              </li>
            ))}
          </ul>
        </SpotlightReveal>
      </section>

      <SpotlightReveal>
        <footer className="irv-footer">
          <p>
            Company and community facts come from irvingoil.com and New Brunswick Community College (2026). The role
            details are my own, from 2018.
          </p>
          <a href={IRVING_URL} target="_blank" rel="noopener noreferrer" className="irv-link">
            Visit Irving Oil
            <span aria-hidden="true"> ›</span>
          </a>
        </footer>
      </SpotlightReveal>
    </RoleSpotlight>
  );
}
