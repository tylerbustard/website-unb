import { useRef, type CSSProperties, type ReactNode, type RefObject } from "react";
import {
  RoleSpotlight,
  SpotlightCountUp,
  SpotlightReveal,
  useSpotlightInView,
} from "@/components/role-spotlight";
import { cn } from "@/lib/utils";

/*
 * "Inside the role" panels for the two RBC experience cards and the RBC student
 * ambassador community card, in RBC's
 * branding: an RBC blue gradient header and hero with white type and RBC
 * yellow highlights, yellow primary buttons, then white and light grey
 * sections with RBC blue headings.
 * Sources:
 * - rbcroyalbank.com personal banking (Nov 2026): product lineup
 * - RBC 2025 Sustainability Report: Canada's biggest bank by market capitalization,
 *   100,000+ employees, 19+ million clients, 29 countries
 * - Euromoney Awards for Excellence 2026: North America's best bank
 * - RBC history: founded in Halifax in 1864
 */

const RBC_URL = "https://www.rbcroyalbank.com/personal.html";

export type RbcRole = "advisor" | "intern" | "ambassador";

type Figure = { to: number; prefix?: string; suffix?: string; label: string };
type Step = { title: string; body: string };
type Focus = { title: string; body: string };

const roles: Record<
  RbcRole,
  {
    title: string;
    meta: string;
    hint: string;
    headline: ReactNode;
    lede: string;
    figures: Figure[];
    steps: Step[];
    focusTitle: string;
    focusLede: string;
    focus: Focus[];
    toolkit: string[];
    roleTitle: string;
    visual: { title: string; chip: string; items: string[] };
  }
> = {
  advisor: {
    title: "Banking Advisor",
    meta: "Royal Bank of Canada · Kingston, ON · 2020–2021",
    hint: "The bank, the clients and my results",
    headline: (
      <>
        Needs-based advice that kept clients <span className="rbc-highlight">coming back.</span>
      </>
    ),
    lede:
      "RBC is Canada’s biggest bank, serving more than 19 million clients. As a banking advisor at a Kingston branch, I advised clients on personalized solutions, lifting repeat transactions by 13% and adoption of GICs, mutual funds and TFSAs by 8%.",
    figures: [
      { to: 13, prefix: "+", suffix: "%", label: "repeat transactions" },
      { to: 8, prefix: "+", suffix: "%", label: "adoption of GICs, mutual funds and TFSAs" },
    ],
    steps: [
      { title: "Understand", body: "I used needs-based advising to learn what each client wanted their money to do." },
      { title: "Recommend", body: "I advised on core products like GICs, mutual funds and TFSAs, lifting their adoption by 8%." },
      { title: "Strengthen", body: "Personalized solutions built lasting relationships, increasing repeat transactions by 13%." },
    ],
    focusTitle: "The core products I advised on.",
    focusLede: "Everyday savers asked how to make their money work harder. These were the answers I explained most.",
    focus: [
      { title: "GICs", body: "Guaranteed investment certificates: a set term and rate, with the principal protected." },
      { title: "Mutual funds", body: "Professionally managed portfolios matched to a client’s goals and comfort with risk." },
      { title: "TFSAs", body: "Tax-free savings accounts, where eligible growth and withdrawals aren’t taxed." },
    ],
    toolkit: ["Banking Products", "Financial Advisory", "Client Relationship Management", "Digital Banking"],
    roleTitle: "From the first question to the result.",
    visual: {
      title: "Client goals",
      chip: "Needs review",
      items: ["Emergency savings", "Saving for a home", "Long-term investing"],
    },
  },
  intern: {
    title: "Client Advisor Intern",
    meta: "Royal Bank of Canada · Fredericton, NB · 2019–2020",
    hint: "The branch, the clients and my results",
    headline: (
      <>
        Solving client problems, and bringing banking <span className="rbc-highlight">online.</span>
      </>
    ),
    lede:
      "RBC is Canada’s biggest bank, serving more than 19 million clients. As a client advisor intern at a Fredericton branch, I resolved complex client issues, lifting the branch’s positive feedback scores by 15%, and helped clients start using RBC’s online and mobile banking, raising adoption by 10%.",
    figures: [
      { to: 15, prefix: "+", suffix: "%", label: "positive feedback scores for the branch" },
      { to: 10, prefix: "+", suffix: "%", label: "online and mobile banking adoption" },
    ],
    steps: [
      { title: "Listen", body: "Clients came in with problems that didn’t fit a script. I started by understanding the whole issue." },
      { title: "Resolve", body: "I resolved complex client issues, lifting the branch’s positive feedback scores by 15%." },
      { title: "Go digital", body: "I showed clients RBC’s digital banking tools, raising online and mobile adoption by 10%." },
    ],
    focusTitle: "Where I helped clients most.",
    focusLede: "Most visits came down to one of three things: a problem to fix, a question to answer, or a better way to bank.",
    focus: [
      { title: "Problem resolution", body: "Untangling complex account issues until the client left with an answer." },
      { title: "Client service", body: "Everyday questions handled quickly, kindly and correctly." },
      { title: "Digital banking", body: "Getting clients set up with RBC Online Banking and the RBC Mobile app." },
    ],
    toolkit: ["Client Service", "Digital Banking", "Problem Resolution", "Customer Support"],
    roleTitle: "From the first question to the result.",
    visual: {
      title: "Client visit",
      chip: "Resolved",
      items: ["Account issue fixed", "Online Banking set up", "RBC Mobile app installed"],
    },
  },
  ambassador: {
    title: "Student Ambassador",
    meta: "Royal Bank of Canada · Fredericton, NB · 2019–2020",
    hint: "The campus, the events and my results",
    headline: (
      <>
        Bringing RBC to campus, and students <span className="rbc-highlight">to RBC.</span>
      </>
    ),
    lede:
      "RBC is Canada’s biggest bank, serving more than 19 million clients. As a student ambassador in Fredericton, I organized campus-wide events that raised student engagement and awareness by 25%, and built targeted outreach that lifted student participation in RBC events by 30%.",
    figures: [
      { to: 25, prefix: "+", suffix: "%", label: "student engagement and awareness" },
      { to: 30, prefix: "+", suffix: "%", label: "student participation in RBC events" },
    ],
    steps: [
      { title: "Plan", body: "I organized campus-wide events that brought RBC to where students already were." },
      { title: "Reach", body: "Targeted outreach brought the right students in, lifting participation in RBC events by 30%." },
      { title: "Engage", body: "Together, the events and outreach raised student engagement and awareness by 25%." },
    ],
    focusTitle: "Where I spent my time on campus.",
    focusLede: "The role came down to three things: events worth showing up for, outreach that found the right students, and representing RBC well.",
    focus: [
      { title: "Campus events", body: "Campus-wide events that put RBC in front of students." },
      { title: "Targeted outreach", body: "Outreach aimed at the students most likely to take part." },
      { title: "Brand promotion", body: "Representing RBC on campus as the bank’s face to students." },
    ],
    toolkit: ["Event Management", "Strategic Outreach", "Campus Relations", "Brand Promotion", "Student Engagement"],
    roleTitle: "From planning to participation.",
    visual: {
      title: "Campus event",
      chip: "On campus",
      items: ["Event planned", "Students invited", "RBC team on site"],
    },
  },
};

const bank: Figure[] = [
  { to: 19, suffix: "M+", label: "clients in Canada, the U.S. and 27 other countries" },
  { to: 100000, suffix: "+", label: "employees" },
  { to: 29, label: "countries" },
  { to: 1864, label: "founded in Halifax" },
];

const products = ["Accounts", "Credit cards", "Mortgages", "Loans", "Investments", "Rewards", "Advice"];

function Eyebrow({ children, id }: { children: ReactNode; id?: string }) {
  return (
    <p id={id} className="rbc-eyebrow">
      {children}
    </p>
  );
}

/** A client conversation card with the two results. Decorative. */
function BranchVisual({ role }: { role: RbcRole }) {
  const data = roles[role];
  return (
    <div className="rbc-stage" aria-hidden="true">
      <div className="rbc-card">
        <div className="rbc-card-head">
          <span className="rbc-card-title">{data.visual.title}</span>
          <span className="rbc-card-chip">{data.visual.chip}</span>
        </div>
        <ul className="rbc-card-list">
          {data.visual.items.map((item, index) => (
            <li key={item} style={{ "--i": index } as CSSProperties}>
              <span className="rbc-check">
                <svg viewBox="0 0 12 12">
                  <path d="M2.5 6.2l2.2 2.2 4.8-4.9" />
                </svg>
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>
      {data.figures.map((figure, index) => (
        <div key={figure.label} className={cn("rbc-float", index === 0 ? "rbc-float-a" : "rbc-float-b")}>
          <span className="rbc-float-value">
            {figure.prefix}
            {figure.to}
            {figure.suffix}
          </span>
          <span className="rbc-float-label">{figure.label}</span>
        </div>
      ))}
    </div>
  );
}

function Workflow({ steps }: { steps: Step[] }) {
  const { ref, active } = useSpotlightInView();

  return (
    <div ref={ref} className={cn("rbc-flow", active && "is-active")}>
      <div className="rbc-flow-track" aria-hidden="true">
        <span className="rbc-flow-fill" />
      </div>
      <ol className="rbc-flow-steps">
        {steps.map((step, index) => (
          <li key={step.title} className="rbc-flow-step" style={{ "--step-index": index } as CSSProperties}>
            <span className="rbc-flow-node" aria-hidden="true">
              {index + 1}
            </span>
            <div className="rbc-flow-card">
              <h4 className="rbc-flow-title">{step.title}</h4>
              <p className="rbc-flow-body">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

interface RbcSpotlightProps {
  originRef: RefObject<HTMLElement>;
  logoSrc: string;
  role: RbcRole;
}

export default function RbcSpotlight({ originRef, logoSrc, role }: RbcSpotlightProps) {
  const data = roles[role];
  const roleRef = useRef<HTMLElement>(null);
  const id = (name: string) => `rbc-${role}-${name}`;

  const showRole = () => {
    const reduce = typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    roleRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };

  return (
    <RoleSpotlight
      originRef={originRef}
      logoSrc={logoSrc}
      logoAlt="RBC logo"
      title={data.title}
      meta={data.meta}
      triggerLabel="Inside the role"
      triggerHint={data.hint}
      className="role-spotlight--rbc"
    >
      <section className="rbc-hero">
        <div className="rbc-hero-copy">
          <SpotlightReveal delay={0}>
            <p className="rbc-tag">Inside the role</p>
          </SpotlightReveal>
          <SpotlightReveal delay={70}>
            <h3 className="rbc-display">{data.headline}</h3>
          </SpotlightReveal>
          <SpotlightReveal delay={150}>
            <p className="rbc-lede">{data.lede}</p>
          </SpotlightReveal>
          <SpotlightReveal delay={220}>
            <div className="rbc-actions">
              <button type="button" className="rbc-button" onClick={showRole}>
                See my role
              </button>
              <a href={RBC_URL} target="_blank" rel="noopener noreferrer" className="rbc-button rbc-button-ghost">
                Visit RBC Royal Bank
              </a>
            </div>
          </SpotlightReveal>
        </div>
        <SpotlightReveal delay={140} className="rbc-hero-visual">
          <BranchVisual role={role} />
        </SpotlightReveal>
      </section>

      <div className="rbc-body">
        <div className="rbc-body-inner">
          <section className="rbc-section rbc-section-first" aria-labelledby={id("focus-title")}>
            <SpotlightReveal>
              <Eyebrow>My focus</Eyebrow>
              <h3 id={id("focus-title")} className="rbc-heading">
                {data.focusTitle}
              </h3>
              <p className="rbc-section-lede">{data.focusLede}</p>
            </SpotlightReveal>
            <ul className="rbc-focus">
              {data.focus.map((item, index) => (
                <li key={item.title}>
                  <SpotlightReveal delay={60 + index * 70} className="rbc-focus-card">
                    <span className="rbc-focus-title">{item.title}</span>
                    <span className="rbc-focus-body">{item.body}</span>
                  </SpotlightReveal>
                </li>
              ))}
            </ul>
          </section>

          <section ref={roleRef} className="rbc-section rbc-role" aria-labelledby={id("role-title")}>
            <SpotlightReveal>
              <Eyebrow>My role</Eyebrow>
              <h3 id={id("role-title")} className="rbc-heading">
                {data.roleTitle}
              </h3>
            </SpotlightReveal>
            <SpotlightReveal delay={80}>
              <Workflow steps={data.steps} />
            </SpotlightReveal>
            <dl className="rbc-results">
              {data.figures.map((figure, index) => (
                <SpotlightReveal key={figure.label} delay={80 + index * 90} className="rbc-result">
                  <dt className="rbc-result-label">{figure.label}</dt>
                  <dd className="rbc-result-value">
                    <SpotlightCountUp to={figure.to} prefix={figure.prefix} suffix={figure.suffix} delay={160 + index * 90} />
                  </dd>
                </SpotlightReveal>
              ))}
            </dl>
          </section>

          <section className="rbc-band" aria-labelledby={id("bank-title")}>
            <div className="rbc-band-inner">
              <SpotlightReveal>
                <Eyebrow>Royal Bank of Canada</Eyebrow>
                <h3 id={id("bank-title")} className="rbc-heading">
                  Canada&rsquo;s biggest bank.
                </h3>
              </SpotlightReveal>
              <dl className="rbc-stats">
                {bank.map((figure, index) => (
                  <SpotlightReveal key={figure.label} delay={60 + index * 70} className="rbc-stat">
                    <dt className="rbc-stat-label">{figure.label}</dt>
                    <dd className="rbc-stat-value">
                      {figure.to === 1864 ? (
                        "1864"
                      ) : (
                        <SpotlightCountUp to={figure.to} suffix={figure.suffix} delay={120 + index * 70} />
                      )}
                    </dd>
                  </SpotlightReveal>
                ))}
              </dl>
              <SpotlightReveal delay={120}>
                <div className="rbc-award">
                  <span className="rbc-award-mark" aria-hidden="true">
                    <svg viewBox="0 0 24 24">
                      <circle cx="12" cy="9" r="5.5" />
                      <path d="M8.8 13.6L7.5 21l4.5-2.4 4.5 2.4-1.3-7.4" />
                    </svg>
                  </span>
                  <span>
                    <span className="rbc-award-title">North America&rsquo;s best bank</span>
                    <span className="rbc-award-source">Euromoney Awards for Excellence 2026</span>
                  </span>
                </div>
              </SpotlightReveal>
              <SpotlightReveal delay={160}>
                <div className="rbc-products">
                  <span className="rbc-products-label">Personal banking</span>
                  <ul>
                    {products.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </SpotlightReveal>
            </div>
          </section>

          <section className="rbc-section rbc-toolkit" aria-labelledby={id("toolkit-title")}>
            <SpotlightReveal>
              <Eyebrow id={id("toolkit-title")}>Toolkit</Eyebrow>
              <ul className="rbc-chips">
                {data.toolkit.map((item) => (
                  <li key={item} className="rbc-chip">
                    {item}
                  </li>
                ))}
              </ul>
            </SpotlightReveal>
          </section>

          <SpotlightReveal>
            <footer className="rbc-footer">
              <p>
                Company facts come from rbcroyalbank.com, RBC&rsquo;s 2025 Sustainability Report and Euromoney (2026).
                Role figures are my own.
              </p>
              <a href={RBC_URL} target="_blank" rel="noopener noreferrer" className="rbc-link">
                Visit RBC Royal Bank
                <span aria-hidden="true"> ›</span>
              </a>
            </footer>
          </SpotlightReveal>
        </div>
      </div>
    </RoleSpotlight>
  );
}
