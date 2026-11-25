import { useRef, type CSSProperties, type ReactNode, type RefObject } from "react";
import {
  RoleSpotlight,
  SpotlightCountUp,
  SpotlightReveal,
  useSpotlightInView,
} from "@/components/role-spotlight";
import { cn } from "@/lib/utils";
import { spotlightTriggers } from "@/components/spotlight-triggers";
import "@/styles/spotlights/tts.css";

/*
 * "Inside the credential" panel for the Training The Street DCF card, in Training
 * The Street's branding: white and light grey pages with bold headings, TTS green
 * buttons with small rounded corners, a charcoal band and the green of the TTS logo.
 * Sources:
 * - trainingthestreet.com (Nov 2026): 50,000+ students a year, 30+ countries, 10,000+
 *   corporate clients, 4.8 on CourseCheck from 2,411 reviews; corporate, public, self-study
 *   and academic training
 * - trainingthestreet.com history and on-campus pages: founded by an investment banker,
 *   teaching since 1999, offices in New York, Charlotte, London, Hong Kong and Toronto
 * - My certificate of completion: Discounted Cash Flow Analysis and Modeling, granted
 *   9 November 2024, 1.0 day attended
 */

const TTS_URL = "https://trainingthestreet.com/";

/** Illustrative bars for the hero model (no values shown): projected cash flow and its present value. */
const columns = [
  { label: "Y1", fcf: 36, pv: 33 },
  { label: "Y2", fcf: 42, pv: 35 },
  { label: "Y3", fcf: 48, pv: 36 },
  { label: "Y4", fcf: 54, pv: 37 },
  { label: "Y5", fcf: 60, pv: 37 },
  { label: "TV", fcf: 92, pv: 57, terminal: true },
];

const firm = [
  { to: 50000, suffix: "+", label: "students trained a year" },
  { to: 30, suffix: "+", label: "countries reached" },
  { to: 10000, suffix: "+", label: "corporate clients" },
];

const workflow = [
  {
    title: "Forecast",
    body: "Project the unlevered free cash flow the business will generate over the forecast years.",
  },
  {
    title: "Discount",
    body: "Bring each year’s cash flow back to today at the weighted average cost of capital, or WACC.",
  },
  {
    title: "Value",
    body: "Add a terminal value for the years beyond, then bridge from enterprise value to equity value.",
  },
];

const formats = [
  { title: "Corporate training", body: "Courses for banks and firms, tailored to each team’s needs." },
  { title: "Public courses", body: "Open enrolment, in person and virtual, taught by experienced instructors." },
  { title: "Self-study", body: "Online courses for learning modeling and valuation at your own pace." },
  { title: "Academic workshops", body: "On-campus training for students since 1999, from valuation to modeling boot camps." },
];

function Eyebrow({ children, id, light = false }: { children: ReactNode; id?: string; light?: boolean }) {
  return (
    <p id={id} className={cn("tts-eyebrow", light && "is-light")}>
      {children}
    </p>
  );
}

/** A DCF model as a spreadsheet card: cash flows rise, then shrink to present value. Decorative. */
function ModelVisual() {
  return (
    <div className="tts-stage" aria-hidden="true">
      <div className="tts-model">
        <div className="tts-model-bar">
          <span className="tts-model-dots">
            <i />
            <i />
            <i />
          </span>
          <span className="tts-model-name">DCF model</span>
        </div>
        <div className="tts-formula">
          <span className="tts-fx">fx</span>
          <code>=NPV(WACC, C5:G5) + G6/(1+WACC)^5</code>
        </div>
        <div className="tts-chart">
          {columns.map((column, index) => (
            <span
              key={column.label}
              className={cn("tts-col", column.terminal && "is-terminal")}
              style={{ "--fcf": `${column.fcf}%`, "--pv": `${column.pv}%`, "--i": index } as CSSProperties}
            >
              <span className="tts-col-plot">
                <span className="tts-col-fcf" />
                <span className="tts-col-pv" />
              </span>
              <span className="tts-col-label">{column.label}</span>
            </span>
          ))}
          <span className="tts-col is-ev" style={{ "--i": columns.length } as CSSProperties}>
            <span className="tts-col-plot">
              <span className="tts-col-ev" />
            </span>
            <span className="tts-col-label">EV</span>
          </span>
        </div>
        <div className="tts-legend">
          <span>
            <i className="is-fcf" />
            Projected cash flow
          </span>
          <span>
            <i className="is-pv" />
            Present value
          </span>
        </div>
      </div>
      <span className="tts-badge">
        <span className="tts-badge-kicker">Certificate of completion</span>
        <span className="tts-badge-value">November 2024</span>
      </span>
    </div>
  );
}

function Workflow() {
  const { ref, active } = useSpotlightInView();

  return (
    <div ref={ref} className={cn("tts-flow", active && "is-active")}>
      <div className="tts-flow-track" aria-hidden="true">
        <span className="tts-flow-fill" />
      </div>
      <ol className="tts-flow-steps">
        {workflow.map((step, index) => (
          <li key={step.title} className="tts-flow-step" style={{ "--step-index": index } as CSSProperties}>
            <span className="tts-flow-node" aria-hidden="true">
              {index + 1}
            </span>
            <div className="tts-flow-card">
              <h4 className="tts-flow-title">{step.title}</h4>
              <p className="tts-flow-body">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

interface TtsSpotlightProps {
  originRef: RefObject<HTMLElement>;
  logoSrc: string;
}

export default function TtsSpotlight({ originRef, logoSrc }: TtsSpotlightProps) {
  const modelRef = useRef<HTMLElement>(null);

  const showModel = () => {
    const reduce = typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    modelRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };

  return (
    <RoleSpotlight
      originRef={originRef}
      logoSrc={logoSrc}
      logoAlt="Training The Street logo"
      title="Discounted Cash Flow Analysis and Modeling"
      meta="Training The Street · 1-day course · 2024"
      triggerLabel={spotlightTriggers.tts.label}
      triggerHint={spotlightTriggers.tts.hint}
      className="role-spotlight--tts"
    >
      <section className="tts-hero">
        <div className="tts-hero-copy">
          <SpotlightReveal delay={0}>
            <Eyebrow>Inside the credential</Eyebrow>
          </SpotlightReveal>
          <SpotlightReveal delay={70}>
            <h3 className="tts-display">A company&rsquo;s worth, built from its cash flows.</h3>
          </SpotlightReveal>
          <SpotlightReveal delay={150}>
            <p className="tts-lede">
              In November 2024 I completed Training The Street&rsquo;s one-day course in discounted cash flow analysis
              and modeling. A DCF values a business by forecasting the cash it will generate and discounting it back to
              today, one of the core ways analysts value a company.
            </p>
          </SpotlightReveal>
          <SpotlightReveal delay={220}>
            <div className="tts-actions">
              <button type="button" className="tts-button" onClick={showModel}>
                See how a DCF works
              </button>
              <a href={TTS_URL} target="_blank" rel="noopener noreferrer" className="tts-button tts-button-outline">
                Visit Training The Street
              </a>
            </div>
          </SpotlightReveal>
        </div>
        <SpotlightReveal delay={140} className="tts-hero-visual">
          <ModelVisual />
        </SpotlightReveal>
      </section>

      <section className="tts-band" aria-labelledby="tts-firm-title">
        <div className="tts-band-inner">
          <SpotlightReveal>
            <Eyebrow light>Training The Street</Eyebrow>
            <h3 id="tts-firm-title" className="tts-heading is-light">
              Bankers teaching finance since 1999.
            </h3>
          </SpotlightReveal>
          <dl className="tts-stats">
            <SpotlightReveal delay={60} className="tts-stat">
              <dt className="tts-stat-label">the year it began teaching, founded by an investment banker</dt>
              <dd className="tts-stat-value">1999</dd>
            </SpotlightReveal>
            {firm.map((item, index) => (
              <SpotlightReveal key={item.label} delay={130 + index * 70} className="tts-stat">
                <dt className="tts-stat-label">{item.label}</dt>
                <dd className="tts-stat-value">
                  <SpotlightCountUp to={item.to} suffix={item.suffix} delay={190 + index * 70} />
                </dd>
              </SpotlightReveal>
            ))}
          </dl>
          <SpotlightReveal delay={140}>
            <div className="tts-band-foot">
              <p className="tts-band-note">
                It teaches accounting, corporate finance, financial modeling and valuation, from offices in New York,
                Charlotte, London, Hong Kong and Toronto.
              </p>
              <p className="tts-rating">
                <span className="tts-stars" aria-hidden="true">
                  ★★★★★
                </span>
                <span>4.8 on CourseCheck, from 2,411 reviews</span>
              </p>
            </div>
          </SpotlightReveal>
        </div>
      </section>

      <section ref={modelRef} className="tts-section tts-model-section" aria-labelledby="tts-model-title">
        <SpotlightReveal>
          <Eyebrow>The model</Eyebrow>
          <h3 id="tts-model-title" className="tts-heading">
            How a discounted cash flow works.
          </h3>
        </SpotlightReveal>
        <SpotlightReveal delay={80}>
          <Workflow />
        </SpotlightReveal>
        <SpotlightReveal delay={120}>
          <div className="tts-cert" role="group" aria-label="My certificate of completion">
            <span className="tts-cert-kicker">Certificate of completion</span>
            <span className="tts-cert-name">Tyler Bustard</span>
            <span className="tts-cert-course">Discounted Cash Flow Analysis and Modeling</span>
            <dl className="tts-cert-meta">
              <div>
                <dt>Granted on</dt>
                <dd>9 November 2024</dd>
              </div>
              <div>
                <dt>Days attended</dt>
                <dd>1.0</dd>
              </div>
              <div>
                <dt>Signed by</dt>
                <dd>Scott Rostan, CEO</dd>
              </div>
            </dl>
          </div>
        </SpotlightReveal>
      </section>

      <section className="tts-formats" aria-labelledby="tts-formats-title">
        <div className="tts-formats-inner">
          <SpotlightReveal>
            <Eyebrow>How Training The Street teaches</Eyebrow>
            <h3 id="tts-formats-title" className="tts-heading">
              Hands-on, in four formats.
            </h3>
            <p className="tts-section-lede">
              Its courses mix hands-on instruction, computer-based exercises, mini-lectures and group projects.
            </p>
          </SpotlightReveal>
          <ul className="tts-cards">
            {formats.map((format, index) => (
              <li key={format.title}>
                <SpotlightReveal delay={60 + index * 70} className="tts-card">
                  <span className="tts-card-title">{format.title}</span>
                  <span className="tts-card-body">{format.body}</span>
                </SpotlightReveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <SpotlightReveal>
        <footer className="tts-footer">
          <p>
            Firm facts come from trainingthestreet.com (2026). My course details are from my certificate of
            completion, granted 9 November 2024.
          </p>
          <a href={TTS_URL} target="_blank" rel="noopener noreferrer" className="tts-link">
            Visit Training The Street
            <span aria-hidden="true"> ›</span>
          </a>
        </footer>
      </SpotlightReveal>
    </RoleSpotlight>
  );
}
