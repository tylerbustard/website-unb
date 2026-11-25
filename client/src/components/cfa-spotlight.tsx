import { useRef, type CSSProperties, type ReactNode, type RefObject } from "react";
import {
  RoleSpotlight,
  SpotlightCountUp,
  SpotlightReveal,
  useSpotlightInView,
} from "@/components/role-spotlight";
import { cn } from "@/lib/utils";

/*
 * "Inside the credential" panel for the CFA Level I card, in CFA Institute's
 * branding: white and warm cream pages with regular-weight headings, CFA blue pill
 * buttons, outlined pills, and a deep indigo band.
 * Sources:
 * - cfainstitute.org CFA Program overview (Nov 2026): 200,000+ chartered financial analysts,
 *   three exams, 4,000 hours of work experience for the charter, employers including RBC and TD
 * - cfainstitute.org curriculum and Level I exam pages: learn and describe / analyze and
 *   evaluate / integrate and apply, 10 topics, 180 questions in two 135-minute sessions,
 *   300+ hours of study per level, results in 5 to 7 weeks, 2026 topic weights
 * - My CFA Institute status letter (July 2026): Level I registered, 2026; successful candidates
 *   average 1,000 hours of study across all three levels
 */

const CFA_URL = "https://www.cfainstitute.org/programs/cfa-program";

const steps = [
  { level: "Level I", skill: "Learn and describe", current: true },
  { level: "Level II", skill: "Analyze and evaluate" },
  { level: "Level III", skill: "Integrate and apply" },
  { level: "The charter", skill: "4,000 hours of experience", charter: true },
];

const program = [
  { to: 200000, suffix: "+", label: "chartered financial analysts worldwide" },
  { to: 3, label: "exams: Levels I, II and III" },
  { to: 4000, label: "hours of investment work experience to earn the charter" },
  { to: 1000, label: "hours of study, on average, across all three levels" },
];

const workflow = [
  {
    title: "Register",
    body: "I registered for Level I of the CFA Program in 2026, as my CFA Institute status letter confirms.",
  },
  {
    title: "Prepare",
    body: "Ten topics, from ethics and quantitative methods to portfolio management, plus a Practical Skills Module.",
  },
  {
    title: "Sit the exam",
    body: "180 multiple-choice questions over two sessions, with a pass or fail result in about 5 to 7 weeks.",
  },
];

const examFacts = [
  { to: 180, label: "multiple-choice questions" },
  { to: 135, label: "minutes in each of two sessions" },
  { to: 300, suffix: "+", label: "hours of study per level, as successful candidates report" },
];

const sessions = [
  {
    title: "Session 1",
    topics: [
      { name: "Ethical and Professional Standards", min: 15, max: 20 },
      { name: "Quantitative Methods", min: 6, max: 9 },
      { name: "Economics", min: 6, max: 9 },
      { name: "Financial Statement Analysis", min: 11, max: 14 },
      { name: "Corporate Issuers", min: 6, max: 9 },
    ],
  },
  {
    title: "Session 2",
    topics: [
      { name: "Equity Investments", min: 11, max: 14 },
      { name: "Fixed Income", min: 11, max: 14 },
      { name: "Derivatives", min: 5, max: 8 },
      { name: "Alternative Investments", min: 7, max: 10 },
      { name: "Portfolio Management", min: 8, max: 12 },
    ],
  },
];

const WEIGHT_SCALE = 20;

const levels = [
  {
    level: "Level I",
    title: "Learn and describe",
    body: "Multiple-choice questions on the key terms, concepts and formulas of the investment industry.",
    mine: true,
  },
  {
    level: "Level II",
    title: "Analyze and evaluate",
    body: "Vignettes with multiple-choice questions that test how you analyze situations and find solutions.",
  },
  {
    level: "Level III",
    title: "Integrate and apply",
    body: "Item sets and constructed responses that apply the curriculum to real-world scenarios.",
  },
];

function Eyebrow({ children, id, light = false }: { children: ReactNode; id?: string; light?: boolean }) {
  return (
    <p id={id} className={cn("cfa-eyebrow", light && "is-light")}>
      {children}
    </p>
  );
}

/** The three exams and the charter as a staircase, with Level I as the current step. Decorative. */
function StepsVisual() {
  return (
    <div className="cfa-stage" aria-hidden="true">
      {steps.map((step, index) => (
        <span
          key={step.level}
          className={cn("cfa-step", step.current && "is-current", step.charter && "is-charter")}
          style={{ "--i": index } as CSSProperties}
        >
          <span className="cfa-step-level">{step.level}</span>
          <span className="cfa-step-skill">{step.skill}</span>
          {step.current ? <span className="cfa-step-badge">Registered · 2026</span> : null}
        </span>
      ))}
    </div>
  );
}

function Workflow() {
  const { ref, active } = useSpotlightInView();

  return (
    <div ref={ref} className={cn("cfa-flow", active && "is-active")}>
      <div className="cfa-flow-track" aria-hidden="true">
        <span className="cfa-flow-fill" />
      </div>
      <ol className="cfa-flow-steps">
        {workflow.map((step, index) => (
          <li key={step.title} className="cfa-flow-step" style={{ "--step-index": index } as CSSProperties}>
            <span className="cfa-flow-node" aria-hidden="true">
              {index + 1}
            </span>
            <div className="cfa-flow-card">
              <h4 className="cfa-flow-title">{step.title}</h4>
              <p className="cfa-flow-body">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** Each topic's weight range on a 0 to 20% scale, drawn in once in view. */
function TopicWeights() {
  const { ref, active } = useSpotlightInView();

  return (
    <div ref={ref} className={cn("cfa-weights", active && "is-active")}>
      {sessions.map((session, sessionIndex) => (
        <div key={session.title} className="cfa-session">
          <p className="cfa-session-title">{session.title}</p>
          <ul className="cfa-weight-list">
            {session.topics.map((topic, index) => (
              <li
                key={topic.name}
                className={cn("cfa-weight", topic.min === 15 && "is-top")}
                style={
                  {
                    "--from": `${(topic.min / WEIGHT_SCALE) * 100}%`,
                    "--to": `${(topic.max / WEIGHT_SCALE) * 100}%`,
                    "--i": sessionIndex * 5 + index,
                  } as CSSProperties
                }
              >
                <span className="cfa-weight-name">{topic.name}</span>
                <span className="cfa-weight-track" aria-hidden="true">
                  <i />
                </span>
                <span className="cfa-weight-value">
                  <span aria-hidden="true">
                    {topic.min}–{topic.max}%
                  </span>
                  <span className="sr-only">
                    {topic.min} to {topic.max} percent
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

interface CfaSpotlightProps {
  originRef: RefObject<HTMLElement>;
  logoSrc: string;
}

export default function CfaSpotlight({ originRef, logoSrc }: CfaSpotlightProps) {
  const pathRef = useRef<HTMLElement>(null);

  const showPath = () => {
    const reduce = typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    pathRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };

  return (
    <RoleSpotlight
      originRef={originRef}
      logoSrc={logoSrc}
      logoAlt="CFA Institute logo"
      title="CFA Level I Candidate"
      meta="CFA Institute · CFA Program · 2026"
      triggerLabel="Inside the credential"
      triggerHint="The program, the exam and my status"
      className="role-spotlight--cfa"
    >
      <section className="cfa-hero">
        <div className="cfa-hero-copy">
          <SpotlightReveal delay={0}>
            <Eyebrow>Inside the credential</Eyebrow>
          </SpotlightReveal>
          <SpotlightReveal delay={70}>
            <h3 className="cfa-display">Step one toward the CFA charter.</h3>
          </SpotlightReveal>
          <SpotlightReveal delay={150}>
            <p className="cfa-lede">
              I&rsquo;m registered for Level I of the CFA Program in 2026, the first of three exams toward the
              Chartered Financial Analyst charter. Level I tests the key terms, concepts and formulas of the investment
              industry across 10 topics.
            </p>
          </SpotlightReveal>
          <SpotlightReveal delay={220}>
            <div className="cfa-actions">
              <button type="button" className="cfa-button" onClick={showPath}>
                See the Level I path
              </button>
              <a href={CFA_URL} target="_blank" rel="noopener noreferrer" className="cfa-button cfa-button-outline">
                Visit CFA Institute
              </a>
            </div>
          </SpotlightReveal>
        </div>
        <SpotlightReveal delay={140} className="cfa-hero-visual">
          <StepsVisual />
        </SpotlightReveal>
      </section>

      <section className="cfa-band" aria-labelledby="cfa-program-title">
        <div className="cfa-band-inner">
          <SpotlightReveal>
            <Eyebrow light>CFA Institute</Eyebrow>
            <h3 id="cfa-program-title" className="cfa-heading is-light">
              Three exams, then the charter.
            </h3>
          </SpotlightReveal>
          <dl className="cfa-stats">
            {program.map((item, index) => (
              <SpotlightReveal key={item.label} delay={60 + index * 70} className="cfa-stat">
                <dt className="cfa-stat-label">{item.label}</dt>
                <dd className="cfa-stat-value">
                  <SpotlightCountUp to={item.to} suffix={item.suffix} delay={120 + index * 70} />
                </dd>
              </SpotlightReveal>
            ))}
          </dl>
          <SpotlightReveal delay={140}>
            <p className="cfa-band-note">
              CFA Institute lists RBC and TD, two of my past employers, among the major firms where charterholders work.
            </p>
          </SpotlightReveal>
        </div>
      </section>

      <section ref={pathRef} className="cfa-section cfa-path" aria-labelledby="cfa-path-title">
        <SpotlightReveal>
          <Eyebrow>My path</Eyebrow>
          <h3 id="cfa-path-title" className="cfa-heading">
            From registration to results.
          </h3>
        </SpotlightReveal>
        <SpotlightReveal delay={80}>
          <Workflow />
        </SpotlightReveal>
        <dl className="cfa-results">
          {examFacts.map((fact, index) => (
            <SpotlightReveal key={fact.label} delay={80 + index * 90} className="cfa-result">
              <dt className="cfa-result-label">{fact.label}</dt>
              <dd className="cfa-result-value">
                <SpotlightCountUp to={fact.to} suffix={fact.suffix} delay={160 + index * 90} />
              </dd>
            </SpotlightReveal>
          ))}
        </dl>
      </section>

      <section className="cfa-curriculum" aria-labelledby="cfa-curriculum-title">
        <div className="cfa-curriculum-inner">
          <SpotlightReveal>
            <Eyebrow>Level I curriculum</Eyebrow>
            <h3 id="cfa-curriculum-title" className="cfa-heading">
              Ten topics, two sessions.
            </h3>
            <p className="cfa-section-lede">
              How the 2026 Level I exam is weighted, from CFA Institute&rsquo;s exam outline. Ethics carries the most
              weight.
            </p>
          </SpotlightReveal>
          <SpotlightReveal delay={80}>
            <TopicWeights />
          </SpotlightReveal>
        </div>
      </section>

      <section className="cfa-section" aria-labelledby="cfa-levels-title">
        <SpotlightReveal>
          <Eyebrow>The three levels</Eyebrow>
          <h3 id="cfa-levels-title" className="cfa-heading">
            Each level builds on the last.
          </h3>
        </SpotlightReveal>
        <ul className="cfa-levels">
          {levels.map((level, index) => (
            <li key={level.level}>
              <SpotlightReveal delay={60 + index * 70} className={cn("cfa-level", level.mine && "is-mine")}>
                <span className="cfa-level-head">
                  <span className="cfa-level-name">{level.level}</span>
                  {level.mine ? <span className="cfa-level-chip">My level · 2026</span> : null}
                </span>
                <span className="cfa-level-title">{level.title}</span>
                <span className="cfa-level-body">{level.body}</span>
              </SpotlightReveal>
            </li>
          ))}
        </ul>
      </section>

      <SpotlightReveal>
        <footer className="cfa-footer">
          <p>
            Program facts come from cfainstitute.org (2026). My Level I registration is from my CFA Institute status
            letter, dated July 2026.
          </p>
          <a href={CFA_URL} target="_blank" rel="noopener noreferrer" className="cfa-link">
            Visit CFA Institute
            <span aria-hidden="true"> ›</span>
          </a>
        </footer>
      </SpotlightReveal>
    </RoleSpotlight>
  );
}
