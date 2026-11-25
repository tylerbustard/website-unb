import { useRef, type CSSProperties, type ReactNode, type RefObject } from "react";
import {
  RoleSpotlight,
  SpotlightCountUp,
  SpotlightReveal,
  useSpotlightInView,
} from "@/components/role-spotlight";
import { cn } from "@/lib/utils";
import { spotlightTriggers } from "@/components/spotlight-triggers";
import "@/styles/spotlights/td.css";

/*
 * "Inside the role" panel for the TD Canada Trust experience card, in TD's
 * branding: TD green with white type in a solid promo block, dark green
 * headings, square buttons and cards, light green bands and "›" links.
 * Sources:
 * - td.com personal banking (Nov 2026): product lineup and "Digital first. Human always."
 * - TD corporate information: sixth largest bank in North America by assets, 28.1 million
 *   clients, $2.1 trillion in assets on Jan 31 2026
 * - TD 2025 Annual Report: 2,151 retail locations in North America
 * - Ipsos 2025 Financial Service Excellence Awards (Big 5 banks, shared)
 * - TD Stories, Jun 2026: J.D. Power #1 in customer satisfaction with mobile banking apps (2026)
 */

const TD_URL = "https://www.td.com/ca/en/personal-banking";

type ProductIcon = "chequing" | "card" | "home" | "loan" | "invest" | "advice";

const products: { icon: ProductIcon; title: string; body: string }[] = [
  { icon: "chequing", title: "Chequing and savings", body: "Accounts for daily spending, bill payments and growing savings." },
  { icon: "card", title: "Credit cards", body: "Cards with benefits matched to how a client spends." },
  { icon: "home", title: "Mortgages", body: "Specialized advice for the home ownership journey." },
  { icon: "loan", title: "Loans and lines of credit", body: "Borrowing options that fit a client’s life." },
  { icon: "invest", title: "Personal investing", body: "Registered plans and investments toward a client’s goals." },
  { icon: "advice", title: "Wealth advice", body: "Goals-based planning with a TD Wealth advisor." },
];

type Figure = {
  label: string;
  to?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  text?: string;
  mine?: boolean;
};

const figures: Figure[] = [
  { to: 2.1, decimals: 1, prefix: "$", suffix: "T", label: "in assets at TD Bank Group (January 2026)" },
  { text: "6th", label: "largest bank in North America by assets" },
  { to: 28.1, decimals: 1, suffix: "M", label: "clients across TD’s businesses" },
  { to: 2151, label: "retail locations in North America" },
  { to: 11, prefix: "+", suffix: "%", label: "increase in my sales", mine: true },
  { to: 15, prefix: "Top ", suffix: "%", label: "performance ranking in the district", mine: true },
];

const workflow = [
  {
    step: "1",
    tag: "Discovery",
    title: "Understand",
    body: "I assessed each client’s individual financial needs, one conversation at a time.",
  },
  {
    step: "2",
    tag: "Advice",
    title: "Recommend",
    body: "Relationships built on those needs lifted my sales by 11%.",
  },
  {
    step: "3",
    tag: "Results",
    title: "Deliver",
    body: "I exceeded my sales targets and ranked in the top 15% of the district.",
  },
];

const awards = [
  { title: "Branch Service Excellence", source: "Ipsos Financial Service Excellence Awards 2025 · Big 5 banks, shared" },
  { title: "Customer Service Excellence", source: "Ipsos Financial Service Excellence Awards 2025 · Big 5 banks, shared" },
  { title: "#1 in customer satisfaction with mobile banking apps", source: "J.D. Power, 2026" },
];

const toolkit = ["Financial Planning", "Sales", "Client Advisory", "Product Knowledge"];

const needs = ["Everyday banking", "Saving goals", "Borrowing", "Investing"];

function Eyebrow({ children, id }: { children: ReactNode; id?: string }) {
  return (
    <p id={id} className="td-eyebrow">
      {children}
    </p>
  );
}

function ProductGlyph({ icon }: { icon: ProductIcon }) {
  const paths: Record<ProductIcon, ReactNode> = {
    chequing: (
      <>
        <rect x="3.5" y="6" width="17" height="12" rx="1.5" />
        <path d="M3.5 10h17M7 14.5h4" />
      </>
    ),
    card: (
      <>
        <rect x="3.5" y="5.5" width="17" height="13" rx="1.5" />
        <path d="M3.5 9.5h17M15 15h3" />
      </>
    ),
    home: <path d="M4 11.5L12 5l8 6.5M6 10v9h12v-9M10 19v-5h4v5" />,
    loan: (
      <>
        <circle cx="12" cy="12" r="8" />
        <path d="M12 7.5v9M14.5 9.5c-.4-.9-1.3-1.4-2.5-1.4-1.4 0-2.4.8-2.4 1.9 0 2.5 5 1.4 5 4 0 1.1-1.1 1.9-2.6 1.9-1.3 0-2.3-.6-2.7-1.6" />
      </>
    ),
    invest: (
      <>
        <path d="M4 19.5h16" />
        <path d="M6.5 16v-3M10.5 16V9.5M14.5 16v-5M18.5 16V6.5" />
      </>
    ),
    advice: (
      <>
        <path d="M5 6.5h14v9H11l-4 3v-3H5v-9z" />
        <path d="M8.5 10h7M8.5 12.5h4.5" />
      </>
    ),
  };
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {paths[icon]}
    </svg>
  );
}

/** A needs review that ticks itself off, plus the two results. Decorative. */
function NeedsVisual() {
  return (
    <div className="td-stage" aria-hidden="true">
      <div className="td-card">
        <div className="td-card-head">
          <span className="td-card-title">Client needs review</span>
          <span className="td-card-step">Step 2 of 3</span>
        </div>
        <ul className="td-needs">
          {needs.map((need, index) => (
            <li key={need} style={{ "--i": index } as CSSProperties}>
              <span className="td-tick">
                <svg viewBox="0 0 12 12">
                  <path d="M2.5 6.2l2.2 2.2 4.8-4.9" />
                </svg>
              </span>
              {need}
            </li>
          ))}
        </ul>
        <div className="td-card-foot">
          <span className="td-card-cta">Recommendations ready</span>
          <span className="td-card-link">Review ›</span>
        </div>
      </div>
      <div className="td-stat td-stat-sales">
        <span className="td-stat-label">Sales</span>
        <span className="td-stat-value">+11%</span>
        <span className="td-bars">
          {[38, 52, 46, 64, 72, 88].map((height, index) => (
            <i key={index} style={{ "--h": `${height}%`, "--i": index } as CSSProperties} />
          ))}
        </span>
      </div>
      <div className="td-stat td-stat-rank">
        <span className="td-stat-label">District ranking</span>
        <span className="td-stat-value">Top 15%</span>
      </div>
    </div>
  );
}

function Workflow() {
  const { ref, active } = useSpotlightInView();

  return (
    <div ref={ref} className={cn("td-flow", active && "is-active")}>
      <div className="td-flow-track" aria-hidden="true">
        <span className="td-flow-fill" />
      </div>
      <ol className="td-flow-steps">
        {workflow.map((item, index) => (
          <li key={item.step} className="td-flow-step" style={{ "--step-index": index } as CSSProperties}>
            <span className="td-flow-node" aria-hidden="true">
              {item.step}
            </span>
            <div className="td-flow-card">
              <span className="td-flow-tag">{item.tag}</span>
              <h4 className="td-flow-title">{item.title}</h4>
              <p className="td-flow-body">{item.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

interface TdSpotlightProps {
  originRef: RefObject<HTMLElement>;
  logoSrc: string;
}

export default function TdSpotlight({ originRef, logoSrc }: TdSpotlightProps) {
  const roleRef = useRef<HTMLElement>(null);

  const showRole = () => {
    const reduce = typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    roleRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };

  return (
    <RoleSpotlight
      originRef={originRef}
      logoSrc={logoSrc}
      logoAlt="TD logo"
      title="Financial Advisor"
      meta="TD Canada Trust · Kingston, ON · 2021–2022"
      triggerLabel={spotlightTriggers.td.label}
      triggerHint={spotlightTriggers.td.hint}
      className="role-spotlight--td"
    >
      <section className="td-hero">
        <div className="td-hero-copy">
          <SpotlightReveal delay={0} className="td-promo">
            <p className="td-promo-overline">Inside the role</p>
            <h3 className="td-promo-title">Banking advice that starts with the client&rsquo;s needs.</h3>
          </SpotlightReveal>
          <SpotlightReveal delay={150}>
            <p className="td-lede">
              TD Canada Trust is TD&rsquo;s Canadian personal and small business bank. As a financial advisor at a Kingston
              branch, I assessed each client&rsquo;s financial needs and matched them with the right TD solutions,
              lifting my sales by 11% and ranking in the top 15% of the district.
            </p>
          </SpotlightReveal>
          <SpotlightReveal delay={220}>
            <div className="td-actions">
              <button type="button" className="td-button" onClick={showRole}>
                See my role
              </button>
              <a href={TD_URL} target="_blank" rel="noopener noreferrer" className="td-button td-button-outline">
                Visit TD Canada Trust
              </a>
            </div>
          </SpotlightReveal>
        </div>
        <SpotlightReveal delay={140} className="td-hero-visual">
          <NeedsVisual />
        </SpotlightReveal>
      </section>

      <section className="td-band" aria-labelledby="td-products-title">
        <div className="td-band-inner">
          <SpotlightReveal>
            <Eyebrow>TD Canada Trust</Eyebrow>
            <h3 id="td-products-title" className="td-heading">
              &ldquo;Digital first. Human always.&rdquo;
            </h3>
            <p className="td-section-lede">
              That&rsquo;s how TD describes its banking. In the branch, I was the human side of it: one conversation
              about a client&rsquo;s needs could touch any part of TD&rsquo;s personal banking.
            </p>
          </SpotlightReveal>
          <ul className="td-products">
            {products.map((product, index) => (
              <li key={product.title}>
                <SpotlightReveal delay={50 + index * 60} className="td-product">
                  <span className="td-product-icon">
                    <ProductGlyph icon={product.icon} />
                  </span>
                  <span className="td-product-title">{product.title}</span>
                  <span className="td-product-body">{product.body}</span>
                </SpotlightReveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="td-section" aria-labelledby="td-numbers-title">
        <SpotlightReveal>
          <Eyebrow>By the numbers</Eyebrow>
          <h3 id="td-numbers-title" className="td-heading">
            One of North America&rsquo;s largest banks, one branch at a time.
          </h3>
        </SpotlightReveal>
        <dl className="td-figures">
          {figures.map((figure, index) => (
            <SpotlightReveal
              key={figure.label}
              delay={60 + index * 60}
              className={cn("td-figure", figure.mine && "is-mine")}
            >
              <dt className="td-figure-label">
                {figure.mine ? <span className="td-figure-tag">My role</span> : null}
                {figure.label}
              </dt>
              <dd className="td-figure-value">
                {figure.text ?? (
                  <SpotlightCountUp
                    to={figure.to ?? 0}
                    prefix={figure.prefix}
                    suffix={figure.suffix}
                    decimals={figure.decimals}
                    delay={120 + index * 70}
                  />
                )}
              </dd>
            </SpotlightReveal>
          ))}
        </dl>
      </section>

      <section ref={roleRef} className="td-band td-role" aria-labelledby="td-role-title">
        <div className="td-band-inner">
          <SpotlightReveal>
            <Eyebrow>My role</Eyebrow>
            <h3 id="td-role-title" className="td-heading">
              Every recommendation started with a conversation.
            </h3>
          </SpotlightReveal>
          <SpotlightReveal delay={80}>
            <Workflow />
          </SpotlightReveal>
        </div>
      </section>

      <section className="td-section" aria-labelledby="td-awards-title">
        <SpotlightReveal>
          <Eyebrow>Recognition</Eyebrow>
          <h3 id="td-awards-title" className="td-heading">
            Service clients notice.
          </h3>
        </SpotlightReveal>
        <ul className="td-awards">
          {awards.map((award, index) => (
            <li key={award.title}>
              <SpotlightReveal delay={60 + index * 80} className="td-award">
                <span className="td-award-title">{award.title}</span>
                <span className="td-award-source">{award.source}</span>
              </SpotlightReveal>
            </li>
          ))}
        </ul>
      </section>

      <section className="td-section td-toolkit" aria-labelledby="td-toolkit-title">
        <SpotlightReveal>
          <Eyebrow id="td-toolkit-title">Toolkit</Eyebrow>
          <ul className="td-chips">
            {toolkit.map((item) => (
              <li key={item} className="td-chip">
                {item}
              </li>
            ))}
          </ul>
        </SpotlightReveal>
      </section>

      <SpotlightReveal>
        <footer className="td-footer">
          <p>
            Company facts come from td.com, TD&rsquo;s 2025 annual report and its awards pages; awards from Ipsos (2025)
            and J.D. Power (2026). Role figures are my own.
          </p>
          <a href={TD_URL} target="_blank" rel="noopener noreferrer" className="td-link">
            Visit TD Canada Trust
            <span aria-hidden="true"> ›</span>
          </a>
        </footer>
      </SpotlightReveal>
    </RoleSpotlight>
  );
}
