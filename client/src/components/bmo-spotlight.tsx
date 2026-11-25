import { useEffect, useRef, type CSSProperties, type ReactNode, type RefObject } from "react";
import {
  RoleSpotlight,
  SpotlightCountUp,
  SpotlightReveal,
  useSpotlightInView,
} from "@/components/role-spotlight";
import { cn } from "@/lib/utils";

/*
 * "Inside the role" panel for the BMO Private Wealth experience card, in BMO's
 * branding: Heebo light headings, deep navy text, BMO blue pill buttons, warm
 * cream and white sections, and white cards with hairline dividers.
 * Sources:
 * - bmo.com/privatewealth (Nov 2026): services, who it serves, and BMO Nesbitt Burns, BMO Private
 *   Investment Counsel, BMO Bank of Montreal and BMO Trust Company working as one team
 * - BMO newsroom, Jun 23 2025: Best Private Bank in Canada, World Finance, 15th consecutive year
 * - BMO newsroom, Mar 28 2025: Euromoney Global Private Banking Awards 2025 (UHNW; philanthropic
 *   advisory); eighth largest bank in North America by assets, $1.5 trillion as of Jan 31 2025
 */

const PRIVATE_WEALTH_URL = "https://www.bmo.com/en-ca/main/privatewealth/";

type ServiceIcon = "plan" | "bank" | "growth" | "trust";

const services: { icon: ServiceIcon; title: string; body: string }[] = [
  {
    icon: "plan",
    title: "Wealth planning",
    body: "A living plan covering retirement, tax, business succession, estate and legacy.",
  },
  {
    icon: "bank",
    title: "Private banking",
    body: "A dedicated private banker for accounts, lending, cards and cash management.",
  },
  {
    icon: "growth",
    title: "Investment management",
    body: "Portfolios built and managed by investment professionals around each family’s goals.",
  },
  {
    icon: "trust",
    title: "Trust and estate",
    body: "Trust, estate and legacy services through BMO Trust Company.",
  },
];

const firms = ["BMO Nesbitt Burns", "BMO Private Investment Counsel", "BMO Bank of Montreal", "BMO Trust Company"];
const audiences = ["Individuals and families", "Business owners and entrepreneurs", "Professionals and executives"];

type Figure = {
  label: string;
  to?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  /** Shown as-is, without counting (e.g. ordinals). */
  text?: string;
};

const bmoFigures: Figure[] = [
  { to: 1.5, decimals: 1, prefix: "$", suffix: "T", label: "in total assets at BMO Financial Group (January 2025)" },
  { text: "8th", label: "largest bank in North America by assets" },
  { to: 15, label: "years in a row as Best Private Bank in Canada (World Finance)" },
];

const roleFigures: Figure[] = [
  { to: 100, prefix: "$", suffix: "M+", label: "in portfolios managed by the two Investment Counsellors I advised" },
  { to: 12, suffix: "%", label: "less preparation time" },
  { to: 9, suffix: "%", label: "higher client response rates" },
];

const workflow = [
  {
    step: "1",
    title: "Prepare",
    body: "I advised two Investment Counsellors managing portfolios over $100M and cut preparation time by 12%.",
    mine: true,
  },
  {
    step: "2",
    title: "Follow up",
    body: "I strengthened client communication workflows, lifting response rates by 9%.",
    mine: true,
  },
  {
    step: "3",
    title: "Advise",
    body: "The Investment Counsellors met with each family to review their portfolio and plan.",
    mine: false,
  },
];

const awards = [
  { title: "Best Private Bank in Canada", source: "World Finance, 2025 · 15th consecutive year" },
  { title: "Canada’s Best Private Bank for Ultra-High-Net-Worth Clients", source: "Euromoney Global Private Banking Awards 2025" },
  { title: "Canada’s Best Private Bank for Philanthropic Advisory", source: "Euromoney Global Private Banking Awards 2025" },
];

const toolkit = ["Portfolio Management", "Client Relations", "Financial Analysis", "Excel"];

// Illustrative allocation for the client review mock-up.
const allocation = [
  { label: "Equities", share: 55, tone: "var(--bmo-blue)" },
  { label: "Fixed income", share: 30, tone: "var(--bmo-navy)" },
  { label: "Alternatives", share: 10, tone: "var(--bmo-sky)" },
  { label: "Cash", share: 5, tone: "var(--bmo-sand)" },
];

function Eyebrow({ children, id }: { children: ReactNode; id?: string }) {
  return (
    <p id={id} className="bmo-eyebrow">
      {children}
    </p>
  );
}

function ServiceGlyph({ icon }: { icon: ServiceIcon }) {
  const paths: Record<ServiceIcon, ReactNode> = {
    plan: (
      <>
        <rect x="5" y="3.5" width="14" height="17" rx="2" />
        <path d="M8.5 8h7M8.5 11.5h7M8.5 15h4" />
      </>
    ),
    bank: <path d="M3.5 9.5L12 4l8.5 5.5M5.5 10v7M10 10v7M14 10v7M18.5 10v7M3.5 20h17" />,
    growth: (
      <>
        <path d="M4 19.5h16" />
        <path d="M5 15.5l4.5-4.5 3.5 3 6-6.5M14.5 7.5H19V12" />
      </>
    ),
    trust: (
      <>
        <path d="M12 3.5l7 3v5c0 4.4-3 7.7-7 9-4-1.3-7-4.6-7-9v-5l7-3z" />
        <path d="M9 12l2.2 2.2L15.5 10" />
      </>
    ),
  };
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {paths[icon]}
    </svg>
  );
}

/** A client review pack: allocation, checklist and the two numbers I moved. Decorative. */
function ReviewVisual() {
  let offset = 0;
  return (
    <div className="bmo-stage" aria-hidden="true">
      <div className="bmo-doc">
        <div className="bmo-doc-head">
          <span className="bmo-doc-title">Client review</span>
          <span className="bmo-doc-tag">Quarterly</span>
        </div>
        <div className="bmo-doc-body">
          <svg className="bmo-donut" viewBox="0 0 120 120">
            <circle className="bmo-donut-track" cx="60" cy="60" r="44" />
            {allocation.map((slice, index) => {
              const dash = slice.share - 1.2;
              const element = (
                <circle
                  key={slice.label}
                  className="bmo-donut-slice"
                  cx="60"
                  cy="60"
                  r="44"
                  pathLength={100}
                  style={
                    {
                      "--dash": dash,
                      "--offset": -offset,
                      "--i": index,
                      stroke: slice.tone,
                    } as CSSProperties
                  }
                />
              );
              offset += slice.share;
              return element;
            })}
          </svg>
          <ul className="bmo-legend">
            {allocation.map((slice) => (
              <li key={slice.label} style={{ "--tone": slice.tone } as CSSProperties}>
                <span>{slice.label}</span>
                <span className="bmo-legend-share">{slice.share}%</span>
              </li>
            ))}
          </ul>
        </div>
        <ul className="bmo-checklist">
          {["Performance summary", "Holdings and allocation", "Planning notes"].map((item, index) => (
            <li key={item} style={{ "--i": index } as CSSProperties}>
              <span className="bmo-check">
                <svg viewBox="0 0 12 12">
                  <path d="M2.5 6.2l2.2 2.2 4.8-4.9" />
                </svg>
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div className="bmo-float bmo-float-a">
        <span className="bmo-float-label">Preparation time</span>
        <span className="bmo-float-value">−12%</span>
      </div>
      <div className="bmo-float bmo-float-b">
        <span className="bmo-float-label">Client responses</span>
        <span className="bmo-float-value">+9%</span>
      </div>
    </div>
  );
}

function FigureCard({ title, figures, mine = false }: { title: string; figures: Figure[]; mine?: boolean }) {
  return (
    <div className={cn("bmo-pillars", mine && "is-mine")}>
      <p className="bmo-pillars-title">{title}</p>
      <dl className="bmo-pillars-grid">
        {figures.map((figure, index) => (
          <div key={figure.label} className="bmo-pillar">
            <dt className="bmo-pillar-label">{figure.label}</dt>
            <dd className="bmo-pillar-value">
              {figure.text ?? (
                <SpotlightCountUp
                  to={figure.to ?? 0}
                  prefix={figure.prefix}
                  suffix={figure.suffix}
                  decimals={figure.decimals}
                  delay={120 + index * 90}
                />
              )}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function Workflow() {
  const { ref, active } = useSpotlightInView();

  return (
    <div ref={ref} className={cn("bmo-flow", active && "is-active")}>
      <div className="bmo-flow-track" aria-hidden="true">
        <span className="bmo-flow-fill" />
      </div>
      <ol className="bmo-flow-steps">
        {workflow.map((item, index) => (
          <li
            key={item.step}
            className={cn("bmo-flow-step", item.mine && "is-mine")}
            style={{ "--step-index": index } as CSSProperties}
          >
            <span className="bmo-flow-node" aria-hidden="true">
              {item.step}
            </span>
            <div className="bmo-flow-card">
              <span className="bmo-flow-tag">{item.mine ? "My focus" : "Investment Counsellors"}</span>
              <h4 className="bmo-flow-title">{item.title}</h4>
              <p className="bmo-flow-body">{item.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

interface BmoSpotlightProps {
  originRef: RefObject<HTMLElement>;
  logoSrc: string;
}

export default function BmoSpotlight({ originRef, logoSrc }: BmoSpotlightProps) {
  const roleRef = useRef<HTMLElement>(null);

  // Fetch BMO's typeface once the card is near the viewport so the panel opens in it.
  useEffect(() => {
    const card = originRef.current;
    if (!card || typeof IntersectionObserver === "undefined" || !document.fonts?.load) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          void document.fonts.load('300 1em "Heebo"').catch(() => undefined);
          observer.disconnect();
        }
      },
      { rootMargin: "600px 0px" },
    );
    observer.observe(card);
    return () => observer.disconnect();
  }, [originRef]);

  const showRole = () => {
    const reduce = typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    roleRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };

  return (
    <RoleSpotlight
      originRef={originRef}
      logoSrc={logoSrc}
      logoAlt="BMO logo"
      title="Portfolio Assistant"
      meta="BMO Private Wealth · Toronto, ON · 2022–2023"
      triggerLabel="Inside the role"
      triggerHint="The team, the clients and my work"
      className="role-spotlight--bmo"
    >
      <section className="bmo-hero">
        <div className="bmo-hero-copy">
          <SpotlightReveal delay={0}>
            <p className="bmo-overline">Inside the role</p>
          </SpotlightReveal>
          <SpotlightReveal delay={70}>
            <h3 className="bmo-display">Ready for every client conversation.</h3>
          </SpotlightReveal>
          <SpotlightReveal delay={150}>
            <p className="bmo-lede">
              BMO Private Wealth brings investment management, private banking, wealth planning and trust services
              together for families and business owners. As a portfolio assistant, I advised two Investment Counsellors
              managing portfolios over $100M, cutting preparation time by 12% and lifting client response rates by 9%.
            </p>
          </SpotlightReveal>
          <SpotlightReveal delay={220}>
            <div className="bmo-actions">
              <button type="button" className="bmo-button" onClick={showRole}>
                See my role
              </button>
              <a href={PRIVATE_WEALTH_URL} target="_blank" rel="noopener noreferrer" className="bmo-button bmo-button-ghost">
                Visit BMO Private Wealth
              </a>
            </div>
          </SpotlightReveal>
        </div>
        <SpotlightReveal delay={140} className="bmo-hero-visual">
          <ReviewVisual />
        </SpotlightReveal>
      </section>

      <section className="bmo-band" aria-labelledby="bmo-services-title">
        <div className="bmo-band-inner">
          <SpotlightReveal>
            <Eyebrow>BMO Private Wealth</Eyebrow>
            <h3 id="bmo-services-title" className="bmo-heading">
              One team for every part of a family&rsquo;s wealth.
            </h3>
            <p className="bmo-section-lede">
              Professionals from {firms.slice(0, -1).join(", ")} and {firms[firms.length - 1]} work together as one team
              for each client.
            </p>
          </SpotlightReveal>
          <ul className="bmo-services">
            {services.map((service, index) => (
              <li key={service.title}>
                <SpotlightReveal delay={60 + index * 70} className="bmo-service">
                  <span className="bmo-service-icon">
                    <ServiceGlyph icon={service.icon} />
                  </span>
                  <span className="bmo-service-title">{service.title}</span>
                  <span className="bmo-service-body">{service.body}</span>
                </SpotlightReveal>
              </li>
            ))}
          </ul>
          <SpotlightReveal delay={120}>
            <div className="bmo-audiences">
              <span className="bmo-audiences-label">Who it serves</span>
              <ul>
                {audiences.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </SpotlightReveal>
        </div>
      </section>

      <section className="bmo-section bmo-numbers" aria-labelledby="bmo-numbers-title">
        <SpotlightReveal>
          <h3 id="bmo-numbers-title" className="bmo-heading bmo-heading-center">
            Canada&rsquo;s best private bank, at North American scale.
          </h3>
        </SpotlightReveal>
        <SpotlightReveal delay={80}>
          <FigureCard title="BMO" figures={bmoFigures} />
        </SpotlightReveal>
        <SpotlightReveal delay={140}>
          <FigureCard title="My role" figures={roleFigures} mine />
        </SpotlightReveal>
      </section>

      <section ref={roleRef} className="bmo-band bmo-role" aria-labelledby="bmo-role-title">
        <div className="bmo-band-inner">
          <SpotlightReveal>
            <Eyebrow>My role</Eyebrow>
            <h3 id="bmo-role-title" className="bmo-heading">
              Where I fit on the team.
            </h3>
            <p className="bmo-section-lede">
              Investment Counsellors run the portfolios and the client relationships. I helped them prepare faster and
              keep clients in the loop.
            </p>
          </SpotlightReveal>
          <SpotlightReveal delay={80}>
            <Workflow />
          </SpotlightReveal>
        </div>
      </section>

      <section className="bmo-section" aria-labelledby="bmo-awards-title">
        <SpotlightReveal>
          <Eyebrow>Recognition</Eyebrow>
          <h3 id="bmo-awards-title" className="bmo-heading">
            Recognized year after year.
          </h3>
        </SpotlightReveal>
        <ul className="bmo-awards">
          {awards.map((award, index) => (
            <li key={award.title}>
              <SpotlightReveal delay={60 + index * 80} className="bmo-award">
                <span className="bmo-award-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <circle cx="12" cy="9" r="5.5" />
                    <path d="M8.8 13.6L7.5 21l4.5-2.4 4.5 2.4-1.3-7.4" />
                  </svg>
                </span>
                <span className="bmo-award-title">{award.title}</span>
                <span className="bmo-award-source">{award.source}</span>
              </SpotlightReveal>
            </li>
          ))}
        </ul>
      </section>

      <section className="bmo-section bmo-toolkit" aria-labelledby="bmo-toolkit-title">
        <SpotlightReveal>
          <Eyebrow id="bmo-toolkit-title">Toolkit</Eyebrow>
          <ul className="bmo-chips">
            {toolkit.map((item) => (
              <li key={item} className="bmo-chip">
                {item}
              </li>
            ))}
          </ul>
        </SpotlightReveal>
      </section>

      <SpotlightReveal>
        <footer className="bmo-footer">
          <p>
            Company facts and awards come from bmo.com and BMO news releases (2025). Role figures are my own.
          </p>
          <a href={PRIVATE_WEALTH_URL} target="_blank" rel="noopener noreferrer" className="bmo-link">
            Visit BMO Private Wealth
            <span aria-hidden="true"> ›</span>
          </a>
        </footer>
      </SpotlightReveal>
    </RoleSpotlight>
  );
}
