import type { CSSProperties, RefObject } from "react";
import {
  RoleSpotlight,
  SpotlightCountUp,
  SpotlightReveal,
  useSpotlightInView,
} from "@/components/role-spotlight";
import { cn } from "@/lib/utils";

/*
 * "Inside the role" panel for the 73 Strings experience card.
 * Company facts come from 73 Strings' public announcements:
 * - Series A release, Jul 2023 (client base: pension funds, sovereign wealth funds, LPs, GPs)
 * - Series B release, Feb 2025 (Goldman Sachs Alternatives, Blackstone, Golub Capital, Hamilton Lane;
 *   Blackstone uses 73 Strings across the majority of its businesses)
 * - CEO Q&A (Eurazeo and Sofina as named clients)
 * - IT Brief, Nov 2026 (founded in France in 2020, New York HQ, clients managing $20T+ in assets;
 *   private equity, private credit, growth equity, venture capital and infrastructure)
 * - WatersTechnology Buy-Side Technology Awards 2025 (best middle-office platform)
 */

const stats = [
  { to: 20, prefix: "$", suffix: "T+", label: "in assets managed by 73 Strings clients" },
  { to: 5, label: "private-market strategies on the platform" },
  { to: 15, suffix: "+", label: "portfolios validated every day" },
  { to: 18, suffix: "%", label: "faster exception resolution" },
];

const generalPartners = ["Private equity", "Growth equity", "Venture capital", "Infrastructure", "Private credit"];
const limitedPartners = ["Pension funds", "Sovereign wealth funds", "Fund investors (LPs)"];
const namedClients = ["Blackstone", "Eurazeo", "Sofina"];
const backers = ["Goldman Sachs Alternatives", "Blackstone", "Golub Capital", "Hamilton Lane"];

const workflow = [
  {
    step: "01",
    title: "Extract",
    body: "Portfolio-company financials and fund documents are pulled into the platform by 73 Extract.",
    mine: false,
  },
  {
    step: "02",
    title: "Validate",
    body: "I validated daily NAV inputs, holdings and cash flows across 15+ portfolios before they reached a valuation.",
    mine: true,
  },
  {
    step: "03",
    title: "Reconcile",
    body: "I traced reconciliation exceptions with operations, risk and portfolio managers, resolving them 18% faster.",
    mine: true,
  },
  {
    step: "04",
    title: "Value",
    body: "Clean, reconciled data feeds 73 Monitor dashboards and 73 Value valuation workflows.",
    mine: false,
  },
];

const toolkit = ["Portfolio Monitoring", "NAV Validation", "Reconciliation", "Cash-Flow Review", "SQL", "Excel"];

function Workflow() {
  const { ref, active } = useSpotlightInView();

  return (
    <div ref={ref} className={cn("rs-flow", active && "is-active")}>
      <div className="rs-flow-track" aria-hidden="true">
        <span className="rs-flow-fill" />
      </div>
      <ol className="rs-flow-steps">
        {workflow.map((item, index) => (
          <li
            key={item.step}
            className={cn("rs-flow-step", item.mine && "is-mine")}
            style={{ "--step-index": index } as CSSProperties}
          >
            <span className="rs-flow-node" aria-hidden="true" />
            <div className="rs-flow-meta">
              <span className="rs-flow-number">{item.step}</span>
              {item.mine ? <span className="rs-flow-badge">My focus</span> : null}
            </div>
            <h4 className="rs-flow-title">{item.title}</h4>
            <p className="rs-flow-body">{item.body}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

interface SeventyThreeStringsSpotlightProps {
  originRef: RefObject<HTMLElement>;
  logoSrc: string;
}

export default function SeventyThreeStringsSpotlight({ originRef, logoSrc }: SeventyThreeStringsSpotlightProps) {
  return (
    <RoleSpotlight
      originRef={originRef}
      logoSrc={logoSrc}
      logoAlt="73 Strings logo"
      title="Senior Associate, Portfolio Monitoring"
      meta="73 Strings · Toronto, ON · 2025–2026"
      triggerLabel="Inside the role"
      triggerHint="Clients, platform and day-to-day"
    >
      <section className="rs-hero">
        <SpotlightReveal delay={0}>
          <p className="rs-eyebrow">Inside the role</p>
        </SpotlightReveal>
        <SpotlightReveal delay={70}>
          <h3 className="rs-headline">
            Private markets.
            <span className="rs-gradient">Monitored daily.</span>
          </h3>
        </SpotlightReveal>
        <SpotlightReveal delay={150}>
          <p className="rs-lede">
            73 Strings is an AI-native valuation and portfolio-monitoring platform for alternative asset
            managers. Its 73 Extract, 73 Monitor and 73 Value modules turn portfolio-company documents into the
            data behind fund valuations. On the portfolio monitoring team, I kept that data accurate for the
            funds that relied on it.
          </p>
        </SpotlightReveal>
      </section>

      <section className="rs-stats" aria-label="Role at a glance">
        {stats.map((stat, index) => (
          <SpotlightReveal key={stat.label} delay={230 + index * 80} className="rs-tile rs-stat">
            <span className="rs-stat-value">
              <SpotlightCountUp to={stat.to} prefix={stat.prefix} suffix={stat.suffix} delay={330 + index * 80} />
            </span>
            <span className="rs-stat-label">{stat.label}</span>
          </SpotlightReveal>
        ))}
      </section>

      <section className="rs-section" aria-labelledby="rs-clients-title">
        <SpotlightReveal>
          <p className="rs-kicker">The client base</p>
          <h3 id="rs-clients-title" className="rs-section-title">
            Trusted by the largest names in private markets.
          </h3>
          <p className="rs-section-lede">
            73 Strings works with general partners and fund investors worldwide, from multi-strategy managers
            to pension and sovereign wealth funds.
          </p>
        </SpotlightReveal>

        <div className="rs-bento">
          <SpotlightReveal className="rs-tile rs-tile-wide">
            <p className="rs-tile-kicker">General partners</p>
            <p className="rs-tile-title">Managers across five strategies</p>
            <ul className="rs-chips">
              {generalPartners.map((item) => (
                <li key={item} className="rs-chip">
                  {item}
                </li>
              ))}
            </ul>
          </SpotlightReveal>

          <SpotlightReveal className="rs-tile" delay={90}>
            <p className="rs-tile-kicker">Limited partners</p>
            <p className="rs-tile-title">Institutional capital</p>
            <ul className="rs-chips">
              {limitedPartners.map((item) => (
                <li key={item} className="rs-chip">
                  {item}
                </li>
              ))}
            </ul>
          </SpotlightReveal>

          <SpotlightReveal className="rs-tile rs-tile-accent" delay={60}>
            <p className="rs-tile-kicker">Publicly named clients</p>
            <p className="rs-names">{namedClients.join(" · ")}</p>
            <p className="rs-tile-note">
              Blackstone says 73 Strings supports its valuation and portfolio monitoring across most of its
              businesses.
            </p>
          </SpotlightReveal>

          <SpotlightReveal className="rs-tile" delay={150}>
            <p className="rs-tile-kicker">Backed by</p>
            <ul className="rs-backers">
              {backers.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </SpotlightReveal>
        </div>
      </section>

      <section className="rs-section" aria-labelledby="rs-role-title">
        <SpotlightReveal>
          <p className="rs-kicker">My role</p>
          <h3 id="rs-role-title" className="rs-section-title">
            From source document to final mark.
          </h3>
          <p className="rs-section-lede">
            Where I sat in the data flow behind every valuation cycle.
          </p>
        </SpotlightReveal>
        <SpotlightReveal delay={80}>
          <Workflow />
        </SpotlightReveal>
      </section>

      <section className="rs-section rs-split">
        <SpotlightReveal className="rs-tile">
          <p className="rs-tile-kicker">Toolkit</p>
          <ul className="rs-chips">
            {toolkit.map((item) => (
              <li key={item} className="rs-chip">
                {item}
              </li>
            ))}
          </ul>
        </SpotlightReveal>
        <SpotlightReveal className="rs-tile rs-award" delay={90}>
          <p className="rs-tile-kicker">Recognition</p>
          <p className="rs-tile-title">Best middle-office platform</p>
          <p className="rs-tile-note">73 Strings · Buy-Side Technology Awards 2025</p>
        </SpotlightReveal>
      </section>

      <SpotlightReveal>
        <footer className="rs-footer">
          <p>
            Company facts and client names come from 73 Strings&rsquo; public announcements (2023&ndash;2026).
          </p>
          <a href="https://www.73strings.com/" target="_blank" rel="noopener noreferrer" className="rs-link">
            Visit 73strings.com
            <span aria-hidden="true"> ↗</span>
          </a>
        </footer>
      </SpotlightReveal>
    </RoleSpotlight>
  );
}
