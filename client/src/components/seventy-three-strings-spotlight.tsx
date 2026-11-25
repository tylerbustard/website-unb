import { useRef, type CSSProperties, type ReactNode, type RefObject } from "react";
import {
  RoleSpotlight,
  SpotlightCountUp,
  SpotlightReveal,
  useSpotlightInView,
} from "@/components/role-spotlight";
import { cn } from "@/lib/utils";
import alvarezMarsalLogo from "@assets/73strings-clients/alvarez-marsal.png";
import baldertonLogo from "@assets/73strings-clients/balderton.png";
import berkshirePartnersLogo from "@assets/73strings-clients/berkshire-partners.png";
import blackstoneLogo from "@assets/73strings-clients/blackstone.png";
import bridgepointLogo from "@assets/73strings-clients/bridgepoint.png";
import bsqLogo from "@assets/73strings-clients/bsq.png";
import cohnReznickLogo from "@assets/73strings-clients/cohnreznick.png";
import eurazeoLogo from "@assets/73strings-clients/eurazeo.png";
import gblLogo from "@assets/73strings-clients/gbl.png";
import hamiltonLaneLogo from "@assets/73strings-clients/hamilton-lane.png";
import investecLogo from "@assets/73strings-clients/investec.png";
import sofinaLogo from "@assets/73strings-clients/sofina.png";
import waystoneLogo from "@assets/73strings-clients/waystone.png";
import { spotlightTriggers } from "@/components/spotlight-triggers";
import "@/styles/spotlights/s73.css";

/*
 * "Inside the role" panel for the 73 Strings experience card, styled after
 * 73strings.com (navy surfaces, light headings, square accents).
 * Sources:
 * - 73strings.com homepage, Nov 2026: client logos, $20T+ combined client AUM, awards
 * - Series A release, Jul 2023 (client base: pension funds, sovereign wealth funds, LPs, GPs)
 * - Series B release, Feb 2025 (Goldman Sachs Alternatives, Blackstone, Golub Capital, Hamilton Lane)
 * - IT Brief, Nov 2026 (private equity, private credit, growth equity, venture capital and infrastructure)
 * Client logos are the official files from 73strings.com, recoloured white.
 */

const clientLogos = [
  { name: "Blackstone", src: blackstoneLogo, width: 95, height: 16 },
  { name: "Hamilton Lane", src: hamiltonLaneLogo, width: 86, height: 24 },
  { name: "Eurazeo", src: eurazeoLogo, width: 72, height: 14 },
  { name: "Sofina", src: sofinaLogo, width: 88, height: 13 },
  { name: "Investec", src: investecLogo, width: 98, height: 21 },
  { name: "Bridgepoint", src: bridgepointLogo, width: 80, height: 17 },
  { name: "GBL", src: gblLogo, width: 49, height: 21 },
  { name: "Balderton Capital", src: baldertonLogo, width: 84, height: 25 },
  { name: "Berkshire Partners", src: berkshirePartnersLogo, width: 71, height: 30 },
  { name: "Waystone", src: waystoneLogo, width: 94, height: 18 },
  { name: "Alvarez & Marsal", src: alvarezMarsalLogo, width: 36, height: 28 },
  { name: "CohnReznick", src: cohnReznickLogo, width: 89, height: 21 },
  { name: "BSQ", src: bsqLogo, width: 45, height: 17 },
];

const figures = [
  { to: 20, prefix: "$", suffix: "T+", label: "combined AUM of 73 Strings clients", mine: false },
  { to: 5, label: "private-market strategies on the platform", mine: false },
  { to: 15, suffix: "+", label: "portfolios I validated every day", mine: true },
  { to: 18, suffix: "%", label: "faster exception resolution", mine: true },
];

const awards = [
  { title: "Technology Provider of the Year 2026", org: "Real Deals Private Equity" },
  { title: "Portfolio Management Service of the Year 2026", org: "The Drawdown Awards" },
  { title: "Valuation Technology of the Year 2025", org: "The Drawdown Awards" },
  { title: "Best Integrated Middle-Office Platform 2025", org: "The Drawdown Awards" },
  { title: "Portfolio Management Service of the Year", org: "Private Equity Wire US Awards 2025" },
  { title: "Data Management Solution of the Year 2025", org: "Private Equity Wire" },
];

const workflow = [
  {
    step: "01",
    tag: "73 Extract",
    title: "Extract",
    body: "Portfolio-company financials and fund documents are captured and structured by the platform.",
    mine: false,
  },
  {
    step: "02",
    tag: "Monitoring",
    title: "Validate",
    body: "I validated daily NAV inputs, holdings and cash flows across 15+ portfolios before they reached a valuation.",
    mine: true,
  },
  {
    step: "03",
    tag: "Monitoring",
    title: "Reconcile",
    body: "I traced reconciliation exceptions with operations, risk and portfolio managers, resolving them 18% faster.",
    mine: true,
  },
  {
    step: "04",
    tag: "73 Value",
    title: "Value",
    body: "Clean, reconciled data feeds 73 Monitor dashboards and the valuations clients report on.",
    mine: false,
  },
];

const generalPartners = ["Private equity", "Growth equity", "Venture capital", "Infrastructure", "Private credit"];
const limitedPartners = ["Pension funds", "Sovereign wealth funds", "Fund investors (LPs)"];
const backers = ["Goldman Sachs Alternatives", "Blackstone", "Golub Capital", "Hamilton Lane"];
const toolkit = ["Portfolio Monitoring", "NAV Validation", "Reconciliation", "Cash-Flow Review", "SQL", "Excel"];

// Seeded (Park-Miller) so the light field looks organic but renders identically every time.
const MODULUS = 2 ** 31 - 1;
function seededRandom(seed: number) {
  let state = seed;
  return () => {
    state = (state * 16807) % MODULUS;
    return (state - 1) / (MODULUS - 1);
  };
}

const random = seededRandom(73);
const STREAK_COUNT = 46;
const streaks = Array.from({ length: STREAK_COUNT }, (_, index) => {
  const position = (index + 0.5) / STREAK_COUNT;
  const centre = 1 - Math.min(1, Math.abs(position - 0.5) * 1.7);
  const roll = random();
  return {
    x: position * 100 + (random() - 0.5) * 1.4,
    width: roll > 0.8 ? 3 : roll > 0.35 ? 2 : 1,
    length: 16 + random() * 24 + centre * 22,
    duration: 2.2 + random() * 2.8,
    delay: -random() * 6,
    alpha: 0.22 + centre * 0.7 + random() * 0.18,
  };
});
const pixels = Array.from({ length: 16 }, () => ({
  x: 6 + random() * 88,
  y: 8 + random() * 84,
  duration: 1.8 + random() * 2.6,
  delay: -random() * 4,
}));
const documents = ["PDF", "XLSX", "CSV", "PDF", "XLSX"];

function Label({ children, id, className }: { children: ReactNode; id?: string; className?: string }) {
  return (
    <p id={id} className={cn("rs-label", className)}>
      <span className="rs-label-mark" aria-hidden="true" />
      {children}
    </p>
  );
}

/** Documents rise as light into validated, reconciled numbers. Decorative. */
function SignalVisual() {
  return (
    <div className="rs-visual" aria-hidden="true">
      <div className="rs-visual-glow" />
      <div className="rs-rain">
        {streaks.map((streak, index) => (
          <span
            key={index}
            className="rs-streak"
            style={
              {
                "--x": `${streak.x.toFixed(2)}%`,
                "--w": `${streak.width}px`,
                "--len": streak.length.toFixed(1),
                "--dur": `${streak.duration.toFixed(2)}s`,
                "--delay": `${streak.delay.toFixed(2)}s`,
                "--alpha": Math.min(1, streak.alpha).toFixed(2),
              } as CSSProperties
            }
          />
        ))}
        {pixels.map((pixel, index) => (
          <span
            key={`p${index}`}
            className="rs-pixel"
            style={
              {
                "--x": `${pixel.x.toFixed(1)}%`,
                "--y": `${pixel.y.toFixed(1)}%`,
                "--dur": `${pixel.duration.toFixed(2)}s`,
                "--delay": `${pixel.delay.toFixed(2)}s`,
              } as CSSProperties
            }
          />
        ))}
      </div>

      <div className="rs-ui rs-ui-back">
        <span className="rs-ui-name">Daily NAV check</span>
        <span className="rs-ui-status">
          <span className="rs-ui-dot" />
          Validated
        </span>
      </div>
      <div className="rs-ui rs-ui-front">
        <span className="rs-ui-caption">Exceptions resolved</span>
        <span className="rs-ui-value">18% faster</span>
        <span className="rs-ui-row">
          <span className="rs-ui-check">
            <svg viewBox="0 0 12 12">
              <path d="M2.5 6.2l2.2 2.2 4.8-4.9" />
            </svg>
            Reconciled
          </span>
          <span className="rs-ui-team">Ops · Risk · PMs</span>
        </span>
      </div>

      <div className="rs-docs">
        {documents.map((type, index) => (
          <span key={index} className="rs-doc" style={{ "--i": index } as CSSProperties}>
            {type}
          </span>
        ))}
      </div>
    </div>
  );
}

function LogoMarquee() {
  const loop = [...clientLogos, ...clientLogos];
  return (
    <div className="rs-marquee">
      <ul className="rs-marquee-track" aria-labelledby="rs-trusted-title">
        {loop.map((logo, index) => {
          const duplicate = index >= clientLogos.length;
          return (
            <li key={`${logo.name}-${index}`} className="rs-marquee-item" aria-hidden={duplicate || undefined}>
              <img
                src={logo.src}
                alt={duplicate ? "" : logo.name}
                width={logo.width}
                height={logo.height}
                decoding="async"
                draggable={false}
                className="rs-logo"
                style={{ "--logo-h": `${logo.height}px` } as CSSProperties}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/** A plain laurel sprig used to frame each award. */
function Laurel({ flipped = false }: { flipped?: boolean }) {
  return (
    <svg className={cn("rs-laurel", flipped && "is-flipped")} viewBox="0 0 20 40" aria-hidden="true">
      <path className="rs-laurel-stem" d="M14 38C6.5 31 4.5 19 9.5 3" />
      <ellipse cx="6.6" cy="31.5" rx="1.9" ry="4.2" transform="rotate(-42 6.6 31.5)" />
      <ellipse cx="13.1" cy="28.2" rx="1.6" ry="3.6" transform="rotate(48 13.1 28.2)" />
      <ellipse cx="4.6" cy="23.4" rx="1.9" ry="4.2" transform="rotate(-24 4.6 23.4)" />
      <ellipse cx="10.4" cy="19.8" rx="1.6" ry="3.6" transform="rotate(38 10.4 19.8)" />
      <ellipse cx="4.8" cy="14.6" rx="1.8" ry="4" transform="rotate(-10 4.8 14.6)" />
      <ellipse cx="10.2" cy="11.2" rx="1.5" ry="3.4" transform="rotate(30 10.2 11.2)" />
      <ellipse cx="7.4" cy="5.6" rx="1.6" ry="3.6" transform="rotate(8 7.4 5.6)" />
    </svg>
  );
}

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
            <div className="rs-flow-card">
              <div className="rs-flow-meta">
                <span className="rs-flow-tag">{item.tag}</span>
                {item.mine ? <span className="rs-flow-badge">My focus</span> : null}
              </div>
              <h4 className="rs-flow-title">
                <span className="rs-flow-number">{item.step}</span>
                {item.title}
              </h4>
              <p className="rs-flow-body">{item.body}</p>
            </div>
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
  const roleRef = useRef<HTMLElement>(null);

  const showRole = () => {
    const reduce = typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    roleRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };

  return (
    <RoleSpotlight
      originRef={originRef}
      logoSrc={logoSrc}
      logoAlt="73 Strings logo"
      title="Senior Associate, Portfolio Monitoring"
      meta="73 Strings · Toronto, ON · 2025–2026"
      triggerLabel={spotlightTriggers["73-strings"].label}
      triggerHint={spotlightTriggers["73-strings"].hint}
      className="role-spotlight--73"
    >
      <section className="rs-hero">
        <div className="rs-hero-copy">
          <SpotlightReveal delay={0}>
            <button type="button" className="rs-pill" onClick={showRole}>
              Where I fit in the valuation workflow
              <svg className="rs-pill-chevron" viewBox="0 0 16 16" aria-hidden="true">
                <path d="M4 4l4 4-4 4M8.5 4l4 4-4 4" />
              </svg>
            </button>
          </SpotlightReveal>
          <SpotlightReveal delay={70}>
            <h3 className="rs-display">Private-market data, validated before it becomes a valuation.</h3>
          </SpotlightReveal>
          <SpotlightReveal delay={150}>
            <p className="rs-lede">
              73 Strings builds AI-native software that turns portfolio-company documents into the monitoring data
              and valuations alternative asset managers report on. On its portfolio monitoring team, I kept that
              data accurate, every day.
            </p>
          </SpotlightReveal>
          <SpotlightReveal delay={220}>
            <a href="https://www.73strings.com/" target="_blank" rel="noopener noreferrer" className="rs-button">
              Visit 73strings.com
              <span aria-hidden="true">↗</span>
            </a>
          </SpotlightReveal>
        </div>
        <SpotlightReveal delay={140} className="rs-hero-visual">
          <SignalVisual />
        </SpotlightReveal>
      </section>

      <section className="rs-trusted" aria-labelledby="rs-trusted-title">
        <SpotlightReveal>
          <Label id="rs-trusted-title">Trusted by leading private-market firms</Label>
        </SpotlightReveal>
        <SpotlightReveal delay={80}>
          <LogoMarquee />
        </SpotlightReveal>
        <SpotlightReveal delay={120}>
          <p className="rs-trusted-note">Selected 73 Strings clients, as shown on 73strings.com.</p>
        </SpotlightReveal>
      </section>

      <section className="rs-band" aria-labelledby="rs-numbers-title">
        <div className="rs-band-inner">
          <div className="rs-band-grid">
            <SpotlightReveal className="rs-band-intro">
              <Label className="rs-label--ink">By the numbers</Label>
              <h3 id="rs-numbers-title" className="rs-heading">
                Institutional scale, checked every day.
              </h3>
              <p className="rs-band-note">
                Platform figures are published by 73 Strings. Role figures come from my work on the portfolio
                monitoring team.
              </p>
            </SpotlightReveal>
            <dl className="rs-figures">
              {figures.map((figure, index) => (
                <SpotlightReveal key={figure.label} delay={80 + index * 80} className="rs-figure">
                  <dt className="rs-figure-label">
                    <span className={cn("rs-figure-tag", figure.mine && "is-mine")}>
                      {figure.mine ? "My role" : "Platform"}
                    </span>
                    {figure.label}
                  </dt>
                  <dd className="rs-figure-value">
                    <SpotlightCountUp
                      to={figure.to}
                      prefix={figure.prefix}
                      suffix={figure.suffix}
                      delay={160 + index * 80}
                    />
                  </dd>
                </SpotlightReveal>
              ))}
            </dl>
          </div>

          <div className="rs-awards-block">
            <SpotlightReveal>
              <Label className="rs-label--ink">Recognition</Label>
            </SpotlightReveal>
            <ul className="rs-awards">
              {awards.map((award, index) => (
                <li key={award.title}>
                  <SpotlightReveal delay={60 + index * 60} className="rs-award">
                    <Laurel />
                    <span className="rs-award-copy">
                      <span className="rs-award-title">{award.title}</span>
                      <span className="rs-award-org">{award.org}</span>
                    </span>
                    <Laurel flipped />
                  </SpotlightReveal>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section ref={roleRef} className="rs-section rs-role" aria-labelledby="rs-role-title">
        <SpotlightReveal>
          <Label>My role on the platform</Label>
          <h3 id="rs-role-title" className="rs-heading">
            Where I sat in the valuation workflow.
          </h3>
          <p className="rs-section-lede">
            Documents come in and valuations go out. My job was the middle: making sure every number in between
            could be trusted.
          </p>
        </SpotlightReveal>
        <SpotlightReveal delay={80}>
          <Workflow />
        </SpotlightReveal>
      </section>

      <section className="rs-section rs-serves" aria-labelledby="rs-serves-title">
        <SpotlightReveal className="rs-serves-intro">
          <Label>Who the platform serves</Label>
          <h3 id="rs-serves-title" className="rs-heading">
            General partners, and the institutions behind them.
          </h3>
        </SpotlightReveal>
        <div className="rs-cards">
          <SpotlightReveal className="rs-card" delay={60}>
            <p className="rs-card-kicker">General partners</p>
            <p className="rs-card-title">Managers across five strategies</p>
            <ul className="rs-chips">
              {generalPartners.map((item) => (
                <li key={item} className="rs-chip">
                  {item}
                </li>
              ))}
            </ul>
          </SpotlightReveal>
          <SpotlightReveal className="rs-card" delay={120}>
            <p className="rs-card-kicker">Limited partners</p>
            <p className="rs-card-title">Institutional capital</p>
            <ul className="rs-chips">
              {limitedPartners.map((item) => (
                <li key={item} className="rs-chip">
                  {item}
                </li>
              ))}
            </ul>
          </SpotlightReveal>
          <SpotlightReveal className="rs-card rs-card-accent" delay={180}>
            <p className="rs-card-kicker">Backed by</p>
            <ul className="rs-backers">
              {backers.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </SpotlightReveal>
        </div>
      </section>

      <section className="rs-section rs-toolkit" aria-labelledby="rs-toolkit-title">
        <SpotlightReveal>
          <Label id="rs-toolkit-title">Toolkit</Label>
          <ul className="rs-chips rs-chips-lg">
            {toolkit.map((item) => (
              <li key={item} className="rs-chip">
                {item}
              </li>
            ))}
          </ul>
        </SpotlightReveal>
      </section>

      <SpotlightReveal>
        <footer className="rs-footer">
          <p>
            Company facts, client logos and awards come from 73strings.com and 73 Strings&rsquo; public
            announcements (2023&ndash;2026). Role figures are my own.
          </p>
          <a href="https://www.73strings.com/" target="_blank" rel="noopener noreferrer" className="rs-link">
            73strings.com
            <span aria-hidden="true"> ↗</span>
          </a>
        </footer>
      </SpotlightReveal>
    </RoleSpotlight>
  );
}
