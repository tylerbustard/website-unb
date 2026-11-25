import { useRef, type CSSProperties, type ReactNode, type RefObject } from "react";
import {
  RoleSpotlight,
  SpotlightCountUp,
  SpotlightReveal,
  useSpotlightInView,
} from "@/components/role-spotlight";
import { cn } from "@/lib/utils";

/*
 * "Inside the credential" panel for the Canadian Securities Course card, in the
 * Canadian Securities Institute's branding: white pages with light grey type, CSI red
 * accents, uppercase buttons with small rounded corners, and a light grey band.
 * Sources:
 * - csi.ca CSC pages (Nov 2026): what the course covers, 135 to 200 hours of study, a
 *   one-year enrolment, two proctored exams of 100 multiple-choice questions in 2 hours,
 *   60% to pass each, topic weights, mutual fund proficiency, the new CSC with an AI
 *   learning coach, and CIRO's new proficiency rules from January 1, 2026
 * - csi.ca home and about pages: since 1970, 500,000 learners, 250 companies trained,
 *   200+ courses and credentials, 15,000 designated professionals, recognized by CIRO,
 *   the CSA and insurance regulators, part of Fitch Learning since 2025
 * - My CSC certificate: completed May 31, 2021
 */

const CSI_URL = "https://www.csi.ca/en/learning/courses/csc";

/** A 28-point rosette for the gold seal, as a CSS polygon. */
const SEAL_SHAPE = `polygon(${Array.from({ length: 56 }, (_, index) => {
  const angle = (index / 56) * Math.PI * 2;
  const radius = index % 2 === 0 ? 50 : 45;
  return `${(50 + radius * Math.cos(angle)).toFixed(2)}% ${(50 + radius * Math.sin(angle)).toFixed(2)}%`;
}).join(", ")})`;

const institute = [
  { to: 500000, label: "learners", icon: "learners" },
  { to: 250, label: "companies trained", icon: "companies" },
  { to: 200, suffix: "+", label: "courses and credentials", icon: "courses" },
  { to: 15000, label: "designated professionals", icon: "designations" },
] as const;

const workflow = [
  {
    title: "Study",
    body: "CSI suggests 135 to 200 hours of study for the course, within a one-year enrolment.",
  },
  {
    title: "Exam one",
    body: "Canada’s investment marketplace and economy, fixed income, equities, derivatives and corporate finance.",
  },
  {
    title: "Exam two",
    body: "Investment and portfolio analysis, mutual funds and ETFs, managed products, taxation and working with clients.",
  },
];

const examFacts = [
  { to: 100, label: "multiple-choice questions on each exam" },
  { to: 2, suffix: " hrs", label: "to write each exam" },
  { to: 60, suffix: "%", label: "needed to pass each exam" },
];

const exams = [
  {
    title: "Exam one",
    topics: [
      { name: "The Canadian Investment Marketplace", weight: 15 },
      { name: "The Economy", weight: 13 },
      { name: "Common and Preferred Shares", weight: 13 },
      { name: "Features and Types of Fixed-Income Securities", weight: 12 },
      { name: "Pricing and Trading of Fixed-Income Securities", weight: 11 },
      { name: "Equity Transactions", weight: 10 },
      { name: "Derivatives", weight: 10 },
      { name: "Corporations and Their Financial Statements", weight: 8 },
      { name: "Financing and Listing Securities", weight: 8 },
    ],
  },
  {
    title: "Exam two",
    topics: [
      { name: "Investment Analysis", weight: 18 },
      { name: "Portfolio Analysis", weight: 18 },
      { name: "Alternative Investments, Other Managed and Structured Products", weight: 16 },
      { name: "Mutual Funds", weight: 14 },
      { name: "Exchange-Traded Funds", weight: 10 },
      { name: "Working with the Institutional Client", weight: 10 },
      { name: "Fee-Based Accounts and Working with the Retail Client", weight: 8 },
      { name: "Canadian Taxation", weight: 6 },
    ],
  },
];

const MOST_WEIGHT = 18;

const today = [
  { title: "Mutual funds", body: "The CSC still meets the proficiency requirement to deal in mutual funds." },
  { title: "A new CSC", body: "CSI has reimagined the course with an AI learning coach and updated content." },
  {
    title: "New CIRO rules",
    body: "Since January 1, 2026, approval with an investment dealer follows CIRO’s new proficiency rules.",
  },
];

function Eyebrow({ children, id }: { children: ReactNode; id?: string }) {
  return (
    <p id={id} className="csi-eyebrow">
      {children}
    </p>
  );
}

/** Simple line icons for the CSI stats row. */
function StatIcon({ name }: { name: (typeof institute)[number]["icon"] }) {
  return (
    <svg className="csi-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {name === "learners" ? (
        <>
          <path d="M2.5 9 12 5l9.5 4L12 13z" />
          <path d="M6.5 11v4.2c0 1.6 2.5 3 5.5 3s5.5-1.4 5.5-3V11" />
        </>
      ) : name === "companies" ? (
        <>
          <path d="M5 20V5.5A1.5 1.5 0 0 1 6.5 4h7A1.5 1.5 0 0 1 15 5.5V20" />
          <path d="M15 9h3.5A1.5 1.5 0 0 1 20 10.5V20M3 20h18M8.5 8h3M8.5 11.5h3M8.5 15h3" />
        </>
      ) : name === "courses" ? (
        <>
          <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H11v15.5H5.5A1.5 1.5 0 0 1 4 18z" />
          <path d="M20 5.5A1.5 1.5 0 0 0 18.5 4H13v15.5h5.5A1.5 1.5 0 0 0 20 18z" />
        </>
      ) : (
        <>
          <circle cx="12" cy="9" r="5" />
          <path d="m9.2 13.3-1.2 7 4-2.1 4 2.1-1.2-7" />
        </>
      )}
    </svg>
  );
}

/** The two exams as cards with a 60% pass line, and a gold completion seal. Decorative. */
function ExamsVisual() {
  return (
    <div className="csi-stage" aria-hidden="true">
      {[
        { title: "Exam one", focus: "The marketplace, fixed income and equities" },
        { title: "Exam two", focus: "Analysis, portfolios and managed products" },
      ].map((exam, index) => (
        <span key={exam.title} className={cn("csi-exam", index === 1 && "is-two")} style={{ "--i": index } as CSSProperties}>
          <span className="csi-exam-head">
            <span className="csi-exam-kicker">{exam.title}</span>
            <span className="csi-exam-passed">Passed</span>
          </span>
          <span className="csi-exam-focus">{exam.focus}</span>
          <span className="csi-exam-meta">100 questions · 2 hours</span>
          <span className="csi-exam-track">
            <span className="csi-exam-mark" />
          </span>
          <span className="csi-exam-mark-label">60% to pass</span>
        </span>
      ))}
      <span className="csi-seal">
        <span className="csi-seal-shape" style={{ clipPath: SEAL_SHAPE }} />
        <span className="csi-seal-ring">
          <span className="csi-seal-name">CSC</span>
          <span className="csi-seal-date">May 2021</span>
        </span>
      </span>
    </div>
  );
}

function Workflow() {
  const { ref, active } = useSpotlightInView();

  return (
    <div ref={ref} className={cn("csi-flow", active && "is-active")}>
      <div className="csi-flow-track" aria-hidden="true">
        <span className="csi-flow-fill" />
      </div>
      <ol className="csi-flow-steps">
        {workflow.map((step, index) => (
          <li key={step.title} className="csi-flow-step" style={{ "--step-index": index } as CSSProperties}>
            <span className="csi-flow-node" aria-hidden="true">
              {index + 1}
            </span>
            <div className="csi-flow-card">
              <h4 className="csi-flow-title">{step.title}</h4>
              <p className="csi-flow-body">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** Each exam's topics by weight, with bars that grow in. */
function ExamWeights() {
  const { ref, active } = useSpotlightInView();

  return (
    <div ref={ref} className={cn("csi-weights", active && "is-active")}>
      {exams.map((exam, examIndex) => (
        <div key={exam.title} className="csi-weight-card">
          <p className="csi-weight-title">
            {exam.title} <span>· {exam.topics.length} topics</span>
          </p>
          <ul className="csi-weight-list">
            {exam.topics.map((topic, index) => (
              <li
                key={topic.name}
                className="csi-weight"
                style={
                  {
                    "--w": `${(topic.weight / MOST_WEIGHT) * 100}%`,
                    "--i": examIndex * 9 + index,
                  } as CSSProperties
                }
              >
                <span className="csi-weight-name">{topic.name}</span>
                <span className="csi-weight-value">{topic.weight}%</span>
                <span className="csi-weight-track" aria-hidden="true">
                  <i />
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

interface CsiSpotlightProps {
  originRef: RefObject<HTMLElement>;
  logoSrc: string;
}

export default function CsiSpotlight({ originRef, logoSrc }: CsiSpotlightProps) {
  const pathRef = useRef<HTMLElement>(null);

  const showPath = () => {
    const reduce = typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    pathRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };

  return (
    <RoleSpotlight
      originRef={originRef}
      logoSrc={logoSrc}
      logoAlt="Canadian Securities Institute logo"
      title="Canadian Securities Course"
      meta="Canadian Securities Institute · Completed May 2021"
      triggerLabel="Inside the credential"
      triggerHint="The institute, the exams and my result"
      className="role-spotlight--csi"
    >
      <section className="csi-hero">
        <div className="csi-hero-copy">
          <SpotlightReveal delay={0}>
            <Eyebrow>Inside the credential</Eyebrow>
          </SpotlightReveal>
          <SpotlightReveal delay={70}>
            <h3 className="csi-display">The foundation for a career in financial services.</h3>
          </SpotlightReveal>
          <SpotlightReveal delay={150}>
            <p className="csi-lede">
              I completed the Canadian Securities Course on May 31, 2021. Across two exams, the CSC covers how
              Canada&rsquo;s investment marketplace works, from the economy and fixed income to equities, derivatives,
              portfolio analysis, mutual funds and taxation.
            </p>
          </SpotlightReveal>
          <SpotlightReveal delay={220}>
            <div className="csi-actions">
              <button type="button" className="csi-button" onClick={showPath}>
                See the two exams
              </button>
              <a href={CSI_URL} target="_blank" rel="noopener noreferrer" className="csi-button csi-button-outline">
                Visit CSI
              </a>
            </div>
          </SpotlightReveal>
        </div>
        <SpotlightReveal delay={140} className="csi-hero-visual">
          <ExamsVisual />
        </SpotlightReveal>
      </section>

      <section className="csi-band" aria-labelledby="csi-institute-title">
        <div className="csi-band-inner">
          <SpotlightReveal>
            <Eyebrow>Canadian Securities Institute</Eyebrow>
            <h3 id="csi-institute-title" className="csi-heading">
              Training Canada&rsquo;s financial industry since 1970.
            </h3>
          </SpotlightReveal>
          <dl className="csi-stats">
            {institute.map((item, index) => (
              <SpotlightReveal key={item.label} delay={60 + index * 70} className="csi-stat">
                <dt className="csi-stat-label">
                  <StatIcon name={item.icon} />
                  {item.label}
                </dt>
                <dd className="csi-stat-value">
                  <SpotlightCountUp
                    to={item.to}
                    suffix={"suffix" in item ? item.suffix : undefined}
                    delay={120 + index * 70}
                  />
                </dd>
              </SpotlightReveal>
            ))}
          </dl>
          <SpotlightReveal delay={140}>
            <p className="csi-band-note">
              CSI&rsquo;s programs are recognized by CIRO, the provincial securities regulators and Canada&rsquo;s
              insurance regulators. In 2025 it became part of Fitch Learning.
            </p>
          </SpotlightReveal>
        </div>
      </section>

      <section ref={pathRef} className="csi-section csi-path" aria-labelledby="csi-path-title">
        <SpotlightReveal>
          <Eyebrow>The course</Eyebrow>
          <h3 id="csi-path-title" className="csi-heading">
            Two exams, 100 questions each.
          </h3>
        </SpotlightReveal>
        <SpotlightReveal delay={80}>
          <Workflow />
        </SpotlightReveal>
        <dl className="csi-results">
          {examFacts.map((fact, index) => (
            <SpotlightReveal key={fact.label} delay={80 + index * 90} className="csi-result">
              <dt className="csi-result-label">{fact.label}</dt>
              <dd className="csi-result-value">
                <SpotlightCountUp to={fact.to} suffix={fact.suffix} delay={160 + index * 90} />
              </dd>
            </SpotlightReveal>
          ))}
        </dl>
        <SpotlightReveal delay={120}>
          <p className="csi-done">
            <span className="csi-done-check" aria-hidden="true">
              ✓
            </span>
            I passed both exams and completed the course on May 31, 2021.
          </p>
        </SpotlightReveal>
      </section>

      <section className="csi-section" aria-labelledby="csi-weights-title">
        <SpotlightReveal>
          <Eyebrow>What each exam covers</Eyebrow>
          <h3 id="csi-weights-title" className="csi-heading">
            Seventeen topics, weighted.
          </h3>
          <p className="csi-section-lede">How CSI weights each exam today, from the course&rsquo;s exam outline.</p>
        </SpotlightReveal>
        <SpotlightReveal delay={80}>
          <ExamWeights />
        </SpotlightReveal>
      </section>

      <section className="csi-section" aria-labelledby="csi-today-title">
        <SpotlightReveal>
          <Eyebrow>The CSC today</Eyebrow>
          <h3 id="csi-today-title" className="csi-heading">
            Where the course stands now.
          </h3>
        </SpotlightReveal>
        <ul className="csi-cards">
          {today.map((card, index) => (
            <li key={card.title}>
              <SpotlightReveal delay={60 + index * 70} className="csi-card">
                <span className="csi-card-title">{card.title}</span>
                <span className="csi-card-body">{card.body}</span>
              </SpotlightReveal>
            </li>
          ))}
        </ul>
      </section>

      <SpotlightReveal>
        <footer className="csi-footer">
          <p>
            Course and institute facts come from csi.ca (2026). My completion date is from my CSC certificate.
          </p>
          <a href={CSI_URL} target="_blank" rel="noopener noreferrer" className="csi-link">
            Visit CSI
            <span aria-hidden="true"> ›</span>
          </a>
        </footer>
      </SpotlightReveal>
    </RoleSpotlight>
  );
}
