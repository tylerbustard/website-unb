import { useRef, type CSSProperties, type ReactNode, type RefObject } from "react";
import {
  RoleSpotlight,
  SpotlightCountUp,
  SpotlightReveal,
  useSpotlightInView,
} from "@/components/role-spotlight";
import { cn } from "@/lib/utils";

/*
 * "Inside the role" panel for the Grant Thornton experience card, in Doane Grant
 * Thornton's branding: white and warm sand pages with bold black headings, Grant
 * Thornton purple and violet, red buttons with small corners, and round-cornered cards.
 * Sources:
 * - doanegrantthornton.ca about us (Nov 2026): founded in Halifax more than 85 years ago,
 *   renamed Doane Grant Thornton in 2024, part of the Grant Thornton International network,
 *   3,000+ colleagues, 70+ offices across Canada, a Great Place to Work for 19 years
 * - doanegrantthornton.ca locations: six New Brunswick offices, including Saint John
 * - doanegrantthornton.ca tax services: planning and compliance, indirect tax, SR&ED and incentives
 */

const GT_URL = "https://www.doanegrantthornton.ca/";

const returnLines = ["Client records", "Income", "Deductions", "Review"];

const company = [
  { to: 3000, suffix: "+", label: "colleagues" },
  { to: 70, suffix: "+", label: "offices across Canada" },
  { to: 85, suffix: "+", label: "years since the firm was founded in Halifax" },
  { to: 19, label: "years and counting as a Great Place to Work™" },
];

const workflow = [
  {
    title: "Organize",
    body: "I streamlined client financial data so each return started from clean records, boosting accuracy by 10%.",
  },
  {
    title: "Prepare",
    body: "I improved how we prepared tax returns, which cut filing errors by 15%.",
  },
  {
    title: "Submit",
    body: "With cleaner client data, 100+ tax returns were submitted on time.",
  },
];

const results = [
  { to: 100, suffix: "+", label: "tax returns submitted on time" },
  { to: 10, prefix: "+", suffix: "%", label: "accuracy in client financial data" },
  { to: 15, prefix: "−", suffix: "%", label: "filing errors after I improved preparation" },
];

const services = [
  {
    category: "Compliance",
    title: "Tax planning and compliance",
    body: "Integrated planning that helps private and public organizations meet their compliance obligations.",
  },
  {
    category: "GST/HST",
    title: "Indirect tax",
    body: "GST/HST compliance, sales tax planning, audit support and recoveries.",
  },
  {
    category: "Incentives",
    title: "SR&ED and business tax incentives",
    body: "Tax credits, government funding and grants, with support through CRA audits.",
  },
];

const toolkit = ["Tax Preparation", "Financial Analysis", "Data Management", "Client Service"];

function Eyebrow({ children, id, light = false }: { children: ReactNode; id?: string; light?: boolean }) {
  return (
    <p id={id} className={cn("gt-eyebrow", light && "is-light")}>
      {children}
    </p>
  );
}

function Check() {
  return (
    <svg viewBox="0 0 16 16" focusable="false">
      <path d="M3.5 8.5l3 3 6-7" />
    </svg>
  );
}

/** A stack of client returns being checked and filed. Decorative. */
function ReturnsVisual() {
  return (
    <div className="gt-stage" aria-hidden="true">
      <span className="gt-orb" />
      <svg className="gt-curve" viewBox="0 0 400 380" preserveAspectRatio="none">
        <path d="M 6 372 C 40 190, 170 46, 396 22" pathLength={1} />
      </svg>
      <span className="gt-metric">
        <span className="gt-metric-label">Data accuracy</span>
        <span className="gt-metric-value">+10%</span>
      </span>
      <div className="gt-stack">
        <span className="gt-sheet gt-sheet-ghost is-back" />
        <span className="gt-sheet gt-sheet-ghost is-mid" />
        <div className="gt-sheet gt-sheet-front">
          <span className="gt-sheet-head">
            <span className="gt-pill">Tax return</span>
            <span className="gt-status">
              <Check />
              Filed
            </span>
          </span>
          <span className="gt-lines">
            {returnLines.map((label, index) => (
              <span key={label} className="gt-line" style={{ "--i": index } as CSSProperties}>
                <span className="gt-line-label">{label}</span>
                <span className="gt-line-track">
                  <i />
                </span>
                <span className="gt-line-check">
                  <Check />
                </span>
              </span>
            ))}
          </span>
          <span className="gt-sheet-foot">
            <span>Filing errors</span>
            <strong>&minus;15%</strong>
          </span>
        </div>
      </div>
      <span className="gt-tag">
        <span className="gt-tag-value">100+ returns</span>
        <span className="gt-tag-note">submitted on time</span>
      </span>
    </div>
  );
}

function Workflow() {
  const { ref, active } = useSpotlightInView();

  return (
    <div ref={ref} className={cn("gt-flow", active && "is-active")}>
      <div className="gt-flow-track" aria-hidden="true">
        <span className="gt-flow-fill" />
      </div>
      <ol className="gt-flow-steps">
        {workflow.map((step, index) => (
          <li key={step.title} className="gt-flow-step" style={{ "--step-index": index } as CSSProperties}>
            <span className="gt-flow-node" aria-hidden="true">
              {index + 1}
            </span>
            <div className="gt-flow-card">
              <h4 className="gt-flow-title">{step.title}</h4>
              <p className="gt-flow-body">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

interface GrantThorntonSpotlightProps {
  originRef: RefObject<HTMLElement>;
  logoSrc: string;
}

export default function GrantThorntonSpotlight({ originRef, logoSrc }: GrantThorntonSpotlightProps) {
  const roleRef = useRef<HTMLElement>(null);

  const showRole = () => {
    const reduce = typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    roleRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };

  return (
    <RoleSpotlight
      originRef={originRef}
      logoSrc={logoSrc}
      logoAlt="Grant Thornton logo"
      title="Tax Return Intern"
      meta="Grant Thornton LLP · Saint John, NB · 2018"
      triggerLabel="Inside the role"
      triggerHint="The firm, the returns and my results"
      className="role-spotlight--gt"
    >
      <section className="gt-hero">
        <div className="gt-hero-copy">
          <SpotlightReveal delay={0}>
            <Eyebrow>Inside the role</Eyebrow>
          </SpotlightReveal>
          <SpotlightReveal delay={70}>
            <h3 className="gt-display">Accurate returns start with clean data.</h3>
          </SpotlightReveal>
          <SpotlightReveal delay={150}>
            <p className="gt-lede">
              Grant Thornton LLP, now Doane Grant Thornton, is a leading Canadian accounting and advisory firm. As a
              tax return intern in Saint John, I made client financial data 10% more accurate, helped get 100+ tax
              returns submitted on time and cut filing errors by 15%.
            </p>
          </SpotlightReveal>
          <SpotlightReveal delay={220}>
            <div className="gt-actions">
              <button type="button" className="gt-button" onClick={showRole}>
                See my role
              </button>
              <a href={GT_URL} target="_blank" rel="noopener noreferrer" className="gt-button gt-button-outline">
                Visit Doane Grant Thornton
              </a>
            </div>
          </SpotlightReveal>
        </div>
        <SpotlightReveal delay={140} className="gt-hero-visual">
          <ReturnsVisual />
        </SpotlightReveal>
      </section>

      <section className="gt-band" aria-labelledby="gt-company-title">
        <div className="gt-band-inner">
          <SpotlightReveal>
            <Eyebrow light>Doane Grant Thornton</Eyebrow>
            <h3 id="gt-company-title" className="gt-heading is-light">
              Founded in Halifax. Now coast to coast.
            </h3>
          </SpotlightReveal>
          <dl className="gt-stats">
            {company.map((item, index) => (
              <SpotlightReveal key={item.label} delay={60 + index * 70} className="gt-stat">
                <dt className="gt-stat-label">{item.label}</dt>
                <dd className="gt-stat-value">
                  <SpotlightCountUp to={item.to} suffix={item.suffix} delay={120 + index * 70} />
                </dd>
              </SpotlightReveal>
            ))}
          </dl>
          <SpotlightReveal delay={140}>
            <p className="gt-band-note">
              In 2024 the firm took the Doane Grant Thornton name, honouring its Canadian legacy while staying part of
              the Grant Thornton International network. Six of its offices are in New Brunswick, including Saint John.
            </p>
          </SpotlightReveal>
        </div>
      </section>

      <section ref={roleRef} className="gt-section gt-role" aria-labelledby="gt-role-title">
        <SpotlightReveal>
          <Eyebrow>My role</Eyebrow>
          <h3 id="gt-role-title" className="gt-heading">
            From client records to filed returns.
          </h3>
        </SpotlightReveal>
        <SpotlightReveal delay={80}>
          <Workflow />
        </SpotlightReveal>
        <dl className="gt-results">
          {results.map((figure, index) => (
            <SpotlightReveal key={figure.label} delay={80 + index * 90} className="gt-result">
              <dt className="gt-result-label">{figure.label}</dt>
              <dd className="gt-result-value">
                <SpotlightCountUp
                  to={figure.to}
                  prefix={figure.prefix}
                  suffix={figure.suffix}
                  delay={160 + index * 90}
                />
              </dd>
            </SpotlightReveal>
          ))}
        </dl>
      </section>

      <section className="gt-services" aria-labelledby="gt-services-title">
        <div className="gt-services-inner">
          <SpotlightReveal>
            <Eyebrow>Tax at Doane Grant Thornton today</Eyebrow>
            <h3 id="gt-services-title" className="gt-heading">
              Compliance today, planning for tomorrow.
            </h3>
            <p className="gt-section-lede">
              The firm&rsquo;s tax team works with everyone from owner-managed businesses to large private and public
              corporations.
            </p>
          </SpotlightReveal>
          <ul className="gt-cards">
            {services.map((service, index) => (
              <li key={service.title}>
                <SpotlightReveal delay={60 + index * 70} className="gt-card">
                  <span className="gt-card-category">{service.category}</span>
                  <span className="gt-card-title">{service.title}</span>
                  <span className="gt-card-body">{service.body}</span>
                </SpotlightReveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="gt-section gt-toolkit" aria-labelledby="gt-toolkit-title">
        <SpotlightReveal>
          <Eyebrow id="gt-toolkit-title">Toolkit</Eyebrow>
          <ul className="gt-chips">
            {toolkit.map((item) => (
              <li key={item} className="gt-chip">
                {item}
              </li>
            ))}
          </ul>
        </SpotlightReveal>
      </section>

      <SpotlightReveal>
        <footer className="gt-footer">
          <p>
            Company facts and services come from doanegrantthornton.ca (2026). Role figures are my own, from my 2018
            internship.
          </p>
          <a href={GT_URL} target="_blank" rel="noopener noreferrer" className="gt-link">
            Visit Doane Grant Thornton
            <span aria-hidden="true"> ›</span>
          </a>
        </footer>
      </SpotlightReveal>
    </RoleSpotlight>
  );
}
