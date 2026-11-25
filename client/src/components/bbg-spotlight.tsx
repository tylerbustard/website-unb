import { useRef, type CSSProperties, type ReactNode, type RefObject } from "react";
import {
  RoleSpotlight,
  SpotlightCountUp,
  SpotlightReveal,
  useSpotlightInView,
} from "@/components/role-spotlight";
import { cn } from "@/lib/utils";
import { spotlightTriggers } from "@/components/spotlight-triggers";
import "@/styles/spotlights/bbg.css";

/*
 * "Inside the credential" panel for the Bloomberg Market Concepts card, after the
 * Bloomberg Terminal and my BMC certificate: black screens, amber monospace type,
 * the green GO key, bold white headings, and the certificate's gold light and dotted
 * course badges.
 * Sources:
 * - Bloomberg for Education (spotlight.bloomberg.com, Nov 2026): BMC teaches the markets
 *   through the Terminal and highlights more than 100 Terminal functions; more than 900
 *   universities integrate Bloomberg into their curricula through BMC; more than 20 years
 *   of Bloomberg for Education
 * - Bloomberg press releases: the Terminal is used by more than 325,000 professionals;
 *   certificates open to students of any major with Terminals on campus (Feb 2025); ASKB,
 *   a conversational AI interface for research, in beta (2026)
 * - bloomberg.com certificate courses page: BMC beside Bloomberg Finance Fundamentals,
 *   all content CPD accredited
 * - University library guides (NYU, Vanderbilt, Columbia, Rowan, BYU, Brock, Cranfield)
 *   and a Bloomberg BMC presentation (via Drexel LeBow): the four Core Concepts modules,
 *   their lessons and hours, short quizzes between the videos, the certificate after the
 *   core, the optional modules, functions used in the course, BMC <GO>, free on a Terminal
 * - Wikipedia: the Terminal's first release, December 1982
 * - My BMC certificate: Core Concepts and Portfolio Management completed July 1, 2019;
 *   Getting Started on the Terminal completed July 8, 2019
 */

const BLOOMBERG_URL = "https://www.bloomberg.com/professional/product/certificate-courses/";

const coreModules = [
  {
    title: "Economic Indicators",
    hours: 1,
    lessons: ["The primacy of GDP", "Monitoring GDP", "Forecasting GDP"],
  },
  {
    title: "Currencies",
    hours: 1,
    lessons: ["Currency market mechanics", "Currency valuation", "Central banks and currencies", "Currency risk"],
  },
  {
    title: "Fixed Income",
    hours: 3,
    lessons: [
      "The roots of the bond market",
      "Bond valuation drivers",
      "Central bankers and interest rates",
      "The yield curve and why it matters",
      "Movements in the yield curve",
    ],
  },
  {
    title: "Equities",
    hours: 3,
    lessons: [
      "Introducing the stock market",
      "The nature of equities",
      "Equity research",
      "Absolute valuation",
      "Relative valuation",
    ],
  },
];

const TOTAL_HOURS = coreModules.reduce((sum, module) => sum + module.hours, 0);

/** Terminal functions the course works with, from Bloomberg's BMC presentation. */
const functions = ["ECST", "ECOW", "WECO", "ECFC", "ECSU", "ESNP", "FXFX", "FXCA", "FXFM", "WIRA", "WBG", "PEG"];

const education = [
  { to: 325000, suffix: "+", label: "professionals use the Terminal" },
  { to: 900, suffix: "+", label: "universities teach with BMC" },
  { to: 20, suffix: "+", label: "years of Bloomberg for Education" },
];

const workflow = [
  {
    title: "Watch",
    body: "Short videos teach each market with Bloomberg’s own data, news and analytics.",
  },
  {
    title: "Practice",
    body: "Quick quizzes sit between the videos, so each lesson is checked as you go.",
  },
  {
    title: "Certify",
    body: "Finishing the four Core Concepts modules earns Bloomberg’s Certificate of Completion.",
  },
];

const courseFacts = [
  { to: 4, label: "Core Concepts modules for the certificate" },
  { to: TOTAL_HOURS, suffix: " hrs", label: "or so to finish the core, at your own pace" },
  { to: 100, suffix: "+", label: "Terminal functions along the way" },
];

const extras = [
  {
    code: "GS",
    title: "Getting Started on the Terminal",
    body: "Using the Terminal, analyzing the market, exploring the equity and fixed income markets, and building an equity portfolio.",
    date: "July 8, 2019",
  },
  {
    code: "PM",
    title: "Portfolio Management",
    body: "What a portfolio manager does, generating ideas, building and analyzing an equity portfolio, and assessing its risk.",
    date: "July 1, 2019",
  },
];

const today = [
  {
    title: "Open to any major",
    body: "Students with Terminals on campus can earn the certificate, whatever they study.",
  },
  {
    title: "A family of certificates",
    body: "BMC sits beside Bloomberg Finance Fundamentals and an ESG certificate, all CPD accredited.",
  },
  {
    title: "AI on the Terminal",
    body: "ASKB, Bloomberg’s conversational AI interface for research, is in beta on the Terminal in 2026.",
  },
];

function Eyebrow({ children, id }: { children: ReactNode; id?: string }) {
  return (
    <p id={id} className="bbg-eyebrow">
      {children}
    </p>
  );
}

/**
 * A Terminal screen: BMC typed on the command line, the GO key pressed, the four Core
 * Concepts modules filling to 100%, then the certificate. Plays once in view. Decorative.
 */
function TerminalVisual() {
  const { ref, active } = useSpotlightInView();

  return (
    <div ref={ref} className={cn("bbg-stage", active && "is-active")} aria-hidden="true">
      <div className="bbg-screen">
        <div className="bbg-cmd">
          <span className="bbg-cmd-text">BMC</span>
          <span className="bbg-caret" />
          <span className="bbg-go">GO</span>
        </div>
        <div className="bbg-screen-head">
          <span>Core Concepts</span>
          <span>{coreModules.length} modules</span>
        </div>
        <ol className="bbg-menu">
          {coreModules.map((module, index) => (
            <li key={module.title} className="bbg-menu-row" style={{ "--i": index } as CSSProperties}>
              <span className="bbg-menu-num">{index + 1})</span>
              <span className="bbg-menu-name">{module.title}</span>
              <span className="bbg-menu-state">100%</span>
              <span className="bbg-menu-bar">
                <i />
              </span>
            </li>
          ))}
        </ol>
        <div className="bbg-status">Certificate · 01 Jul 2019</div>
      </div>
      <span className="bbg-badge">
        <span className="bbg-badge-kicker">BMC</span>
        <span className="bbg-badge-name">
          Core
          <br />
          Concepts
        </span>
        <span className="bbg-badge-date">Jul 2019</span>
      </span>
    </div>
  );
}

/** Function codes from the course, typed out across the top of the band. Decorative. */
function FunctionStrip() {
  const { ref, active } = useSpotlightInView();

  return (
    <div ref={ref} className={cn("bbg-strip", active && "is-active")} aria-hidden="true">
      {functions.map((code, index) => (
        <span key={code} style={{ "--i": index } as CSSProperties}>
          {code} <i>&lt;GO&gt;</i>
        </span>
      ))}
    </div>
  );
}

function Workflow() {
  const { ref, active } = useSpotlightInView();

  return (
    <div ref={ref} className={cn("bbg-flow", active && "is-active")}>
      <div className="bbg-flow-track" aria-hidden="true">
        <span className="bbg-flow-fill" />
      </div>
      <ol className="bbg-flow-steps">
        {workflow.map((step, index) => (
          <li key={step.title} className="bbg-flow-step" style={{ "--step-index": index } as CSSProperties}>
            <span className="bbg-flow-node" aria-hidden="true">
              {index + 1}
            </span>
            <div className="bbg-flow-card">
              <h4 className="bbg-flow-title">{step.title}</h4>
              <p className="bbg-flow-body">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** How the core's eight hours split across the modules, as a ruler. Decorative: the cards list the hours. */
function TimeSplit() {
  const { ref, active } = useSpotlightInView();
  const ticks = coreModules.reduce<number[]>((marks, module) => [...marks, marks[marks.length - 1] + module.hours], [0]);

  return (
    <div ref={ref} className={cn("bbg-split", active && "is-active")} aria-hidden="true">
      <div className="bbg-split-bar">
        {coreModules.map((module, index) => (
          <span
            key={module.title}
            className="bbg-split-seg"
            style={{ "--h": module.hours, "--i": index } as CSSProperties}
          >
            {index + 1}
          </span>
        ))}
      </div>
      <div className="bbg-split-ticks">
        {ticks.map((hour) => (
          <span key={hour} style={{ "--at": `${(hour / TOTAL_HOURS) * 100}%` } as CSSProperties}>
            {hour === TOTAL_HOURS ? `${hour} hrs` : hour}
          </span>
        ))}
      </div>
    </div>
  );
}

interface BbgSpotlightProps {
  originRef: RefObject<HTMLElement>;
  logoSrc: string;
}

export default function BbgSpotlight({ originRef, logoSrc }: BbgSpotlightProps) {
  const modulesRef = useRef<HTMLElement>(null);

  const showModules = () => {
    const reduce = typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    modulesRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };

  return (
    <RoleSpotlight
      originRef={originRef}
      logoSrc={logoSrc}
      logoAlt="Bloomberg logo"
      title="Bloomberg Market Concepts"
      meta="Bloomberg · Completed July 2019"
      triggerLabel={spotlightTriggers.bbg.label}
      triggerHint={spotlightTriggers.bbg.hint}
      className="role-spotlight--bbg"
    >
      <section className="bbg-hero">
        <div className="bbg-hero-copy">
          <SpotlightReveal delay={0}>
            <Eyebrow>Inside the credential</Eyebrow>
          </SpotlightReveal>
          <SpotlightReveal delay={70}>
            <h3 className="bbg-display">Learning the markets on the Terminal.</h3>
          </SpotlightReveal>
          <SpotlightReveal delay={150}>
            <p className="bbg-lede">
              I completed Bloomberg Market Concepts on July 1, 2019. BMC is Bloomberg&rsquo;s self-paced
              introduction to the financial markets, from economic indicators and currencies to fixed income and
              equities, taught with the same data, news and functions professionals use on the Terminal.
            </p>
          </SpotlightReveal>
          <SpotlightReveal delay={220}>
            <div className="bbg-actions">
              <button type="button" className="bbg-button" onClick={showModules}>
                See the four modules
              </button>
              <a href={BLOOMBERG_URL} target="_blank" rel="noopener noreferrer" className="bbg-button bbg-button-outline">
                Visit Bloomberg
              </a>
            </div>
          </SpotlightReveal>
        </div>
        <SpotlightReveal delay={140} className="bbg-hero-visual">
          <TerminalVisual />
        </SpotlightReveal>
      </section>

      <section className="bbg-band" aria-labelledby="bbg-education-title">
        <FunctionStrip />
        <div className="bbg-band-inner">
          <SpotlightReveal>
            <Eyebrow>Bloomberg for Education</Eyebrow>
            <h3 id="bbg-education-title" className="bbg-heading">
              The Terminal, brought into the classroom.
            </h3>
          </SpotlightReveal>
          <dl className="bbg-stats">
            <SpotlightReveal delay={60} className="bbg-stat">
              <dt className="bbg-stat-label">the Terminal&rsquo;s first release</dt>
              <dd className="bbg-stat-value">1982</dd>
            </SpotlightReveal>
            {education.map((item, index) => (
              <SpotlightReveal key={item.label} delay={130 + index * 70} className="bbg-stat">
                <dt className="bbg-stat-label">{item.label}</dt>
                <dd className="bbg-stat-value">
                  <SpotlightCountUp to={item.to} suffix={item.suffix} delay={190 + index * 70} />
                </dd>
              </SpotlightReveal>
            ))}
          </dl>
          <SpotlightReveal delay={140}>
            <p className="bbg-band-note">
              On a Terminal, the course is free and one command away: type BMC and press the green GO key.
            </p>
          </SpotlightReveal>
        </div>
      </section>

      <section className="bbg-section" aria-labelledby="bbg-course-title">
        <SpotlightReveal>
          <Eyebrow>The course</Eyebrow>
          <h3 id="bbg-course-title" className="bbg-heading">
            Four modules, about eight hours.
          </h3>
        </SpotlightReveal>
        <SpotlightReveal delay={80}>
          <Workflow />
        </SpotlightReveal>
        <dl className="bbg-results">
          {courseFacts.map((fact, index) => (
            <SpotlightReveal key={fact.label} delay={80 + index * 90} className="bbg-result">
              <dt className="bbg-result-label">{fact.label}</dt>
              <dd className="bbg-result-value">
                <SpotlightCountUp to={fact.to} suffix={fact.suffix} delay={160 + index * 90} />
              </dd>
            </SpotlightReveal>
          ))}
        </dl>
        <SpotlightReveal delay={120}>
          <p className="bbg-done">
            <span className="bbg-done-check" aria-hidden="true">
              ✓
            </span>
            I completed Core Concepts and Portfolio Management on July 1, 2019, then Getting Started on the Terminal on
            July 8.
          </p>
        </SpotlightReveal>
      </section>

      <section ref={modulesRef} className="bbg-section bbg-modules-section" aria-labelledby="bbg-modules-title">
        <SpotlightReveal>
          <Eyebrow>What the core covers</Eyebrow>
          <h3 id="bbg-modules-title" className="bbg-heading">
            From GDP to valuation.
          </h3>
          <p className="bbg-section-lede">
            How the core&rsquo;s eight hours split across its four modules, with the lessons in each.
          </p>
        </SpotlightReveal>
        <SpotlightReveal delay={80}>
          <TimeSplit />
        </SpotlightReveal>
        <ol className="bbg-modules">
          {coreModules.map((module, index) => (
            <li key={module.title}>
              <SpotlightReveal delay={60 + index * 70} className="bbg-module">
                <span className="bbg-module-head">
                  <span className="bbg-module-num">Module {index + 1}</span>
                  <span className="bbg-module-hours">
                    About {module.hours} {module.hours === 1 ? "hour" : "hours"}
                  </span>
                </span>
                <h4 className="bbg-module-title">{module.title}</h4>
                <ul className="bbg-module-lessons">
                  {module.lessons.map((lesson) => (
                    <li key={lesson}>{lesson}</li>
                  ))}
                </ul>
              </SpotlightReveal>
            </li>
          ))}
        </ol>
      </section>

      <section className="bbg-section" aria-labelledby="bbg-extras-title">
        <SpotlightReveal>
          <Eyebrow>Beyond the core</Eyebrow>
          <h3 id="bbg-extras-title" className="bbg-heading">
            Two optional modules, the same month.
          </h3>
        </SpotlightReveal>
        <ul className="bbg-extras">
          {extras.map((extra, index) => (
            <li key={extra.code}>
              <SpotlightReveal delay={60 + index * 80} className="bbg-extra">
                <span className="bbg-ring" aria-hidden="true">
                  <span className="bbg-ring-kicker">BMC</span>
                  <span className="bbg-ring-code">{extra.code}</span>
                </span>
                <span className="bbg-extra-copy">
                  <span className="bbg-extra-title">{extra.title}</span>
                  <span className="bbg-extra-body">{extra.body}</span>
                  <span className="bbg-extra-date">Completed {extra.date}</span>
                </span>
              </SpotlightReveal>
            </li>
          ))}
        </ul>
        <SpotlightReveal delay={120}>
          <p className="bbg-extras-note">BMC also offers optional modules on equity options and commodities.</p>
        </SpotlightReveal>
      </section>

      <section className="bbg-section" aria-labelledby="bbg-today-title">
        <SpotlightReveal>
          <Eyebrow>BMC in 2026</Eyebrow>
          <h3 id="bbg-today-title" className="bbg-heading">
            Where the course stands.
          </h3>
        </SpotlightReveal>
        <ul className="bbg-cards">
          {today.map((card, index) => (
            <li key={card.title}>
              <SpotlightReveal delay={60 + index * 70} className="bbg-card">
                <span className="bbg-card-title">{card.title}</span>
                <span className="bbg-card-body">{card.body}</span>
              </SpotlightReveal>
            </li>
          ))}
        </ul>
      </section>

      <SpotlightReveal>
        <footer className="bbg-footer">
          <p>
            Course facts come from Bloomberg&rsquo;s education pages and press releases and from university library
            guides (2026). My completion dates are from my BMC certificate.
          </p>
          <a href={BLOOMBERG_URL} target="_blank" rel="noopener noreferrer" className="bbg-link">
            Visit Bloomberg
            <span aria-hidden="true"> ›</span>
          </a>
        </footer>
      </SpotlightReveal>
    </RoleSpotlight>
  );
}
