import { useRef, type CSSProperties, type ReactNode, type RefObject } from "react";
import {
  RoleSpotlight,
  SpotlightCountUp,
  SpotlightReveal,
  useSpotlightInView,
} from "@/components/role-spotlight";
import { cn } from "@/lib/utils";
import openAiMark from "@assets/openai_mark.png";
import { spotlightTriggers } from "@/components/spotlight-triggers";
import "@/styles/spotlights/roi.css";

/*
 * "Inside the role" panel for the ROI experience card, styled after Roi's
 * consumer app: near-black surfaces, rounded cards and the spectrum from the
 * Roi logo.
 * Sources:
 * - Fortune, Jul 2023: $3.6M round led by Spark Capital with 35V, Gradient Ventures and Balaji
 *   Srinivasan; founders Sujith Vishwajith and Chip Davis; alternative assets such as collectibles
 * - Crunchbase and Wellfound: stocks, retirement, crypto, NFTs and collectibles; founders ex-Airbnb
 * - Roi App Store listing: AI financial companion, 100,000+ investors
 * - TechCrunch, Oct 3 2025: OpenAI acquires Roi; stocks, crypto, DeFi, real estate and NFTs in one app
 * - Built In, Oct 6 2025 and PYMNTS: app shut down Oct 15 2025; Vishwajith's announcement
 * - exchange4media, Oct 2025: fee-free trading across Robinhood, Coinbase, TD Ameritrade and Webull
 */

const ACQUISITION_URL =
  "https://techcrunch.com/2025/10/03/with-its-latest-acqui-hire-openai-is-doubling-down-on-personalized-consumer-ai/";

type Tone = "blue" | "azure" | "teal" | "green" | "yellow" | "orange" | "coral" | "magenta";
type AssetIcon = "stocks" | "retirement" | "crypto" | "defi" | "nfts" | "home" | "collectibles" | "trade";

const assets: { icon: AssetIcon; title: string; note: string; tone: Tone }[] = [
  { icon: "stocks", title: "Stocks", note: "Brokerage accounts in one view", tone: "blue" },
  { icon: "retirement", title: "Retirement", note: "Retirement accounts beside everything else", tone: "azure" },
  { icon: "crypto", title: "Crypto", note: "Wallets and exchanges, synced", tone: "teal" },
  { icon: "defi", title: "DeFi", note: "On-chain positions tracked", tone: "green" },
  { icon: "nfts", title: "NFTs", note: "Live floor prices", tone: "yellow" },
  { icon: "home", title: "Real estate", note: "Property next to the portfolio", tone: "orange" },
  { icon: "collectibles", title: "Collectibles", note: "Sneakers and other alternatives", tone: "coral" },
  { icon: "trade", title: "Fee-free trading", note: "Across Robinhood, Coinbase, TD Ameritrade and Webull", tone: "magenta" },
];

const figures = [
  { to: 3.6, decimals: 1, prefix: "$", suffix: "M", label: "seed round led by Spark Capital in 2023", mine: false },
  { to: 100, suffix: "K+", label: "investors on Roi, per its App Store listing", mine: false },
  { to: 13, suffix: "%", label: "faster reporting turnaround", mine: true },
  { to: 12, suffix: "%", label: "higher adoption of AI-driven data features", mine: true },
];

const workflow = [
  {
    step: "01",
    title: "Research",
    body: "I analyzed and compiled public-company financial statements, cutting reporting turnaround by 13%.",
    mine: true,
  },
  {
    step: "02",
    title: "Build",
    body: "I worked with product and engineering to implement AI-driven data features, lifting adoption by 12%.",
    mine: true,
  },
  {
    step: "03",
    title: "Answer",
    body: "Roi’s AI companion answered investors’ questions in plain language, using their own portfolios and market data.",
    mine: false,
  },
];

const founders = [
  { name: "Sujith Vishwajith", role: "Co-founder and CEO · ex-Airbnb, Google, Microsoft" },
  { name: "Chip Davis", role: "Co-founder and CPO · ex-Airbnb" },
];
const backers = ["Spark Capital (lead)", "Gradient Ventures", "35V", "Balaji Srinivasan"];

const timeline = [
  { date: "2022", title: "Founded", body: "Two former Airbnb builders start Roi in New York to put every asset in one app." },
  { date: "Jul 2023", title: "$3.6M seed round", body: "Led by Spark Capital, with Gradient Ventures, 35V and Balaji Srinivasan." },
  {
    date: "Oct 3, 2025",
    title: "Acquired by OpenAI",
    body: "Co-founder and CEO Sujith Vishwajith joined OpenAI as it pushed into personalized consumer AI.",
    openai: true,
  },
  { date: "Oct 15, 2025", title: "App winds down", body: "Roi closed its app and services to customers." },
];

const toolkit = ["Financial Analysis", "AI Integration", "Data Analytics", "Python", "SQL"];

// Illustrative week of net worth for the phone mock-up.
const SPARK_PATH =
  "M0 50 C14 47 22 52 36 45 S60 38 74 41 S98 30 114 33 S140 22 156 25 S184 13 200 15 S214 9 220 8";

// Illustrative allocation for the phone mock-up.
const allocation: { weight: number; tone: Tone }[] = [
  { weight: 42, tone: "blue" },
  { weight: 18, tone: "teal" },
  { weight: 24, tone: "orange" },
  { weight: 9, tone: "magenta" },
  { weight: 7, tone: "yellow" },
];

function Label({ children, id }: { children: ReactNode; id?: string }) {
  return (
    <p id={id} className="roi-label">
      <span className="roi-label-dot" aria-hidden="true" />
      {children}
    </p>
  );
}

function AssetGlyph({ icon }: { icon: AssetIcon }) {
  const paths: Record<AssetIcon, ReactNode> = {
    stocks: <path d="M3 16.5l5-5 3.5 3.5L18 8.5M13.5 8.5H18V13" />,
    retirement: (
      <>
        <path d="M11 3.5l6.5 2.6v4.6c0 4-2.8 6.9-6.5 8-3.7-1.1-6.5-4-6.5-8V6.1L11 3.5z" />
        <path d="M8.2 11l2 2 3.6-3.8" />
      </>
    ),
    crypto: (
      <>
        <circle cx="11" cy="11" r="7.5" />
        <path d="M9 7.5h3.2a1.8 1.8 0 010 3.5H9h3.6a1.9 1.9 0 010 3.8H9V7.5zM10.5 6v1.5M10.5 14.8v1.5" />
      </>
    ),
    defi: (
      <>
        <circle cx="5.5" cy="11" r="2.2" />
        <circle cx="16.5" cy="5.8" r="2.2" />
        <circle cx="16.5" cy="16.2" r="2.2" />
        <path d="M7.5 10l7-3.3M7.5 12l7 3.3" />
      </>
    ),
    nfts: (
      <>
        <rect x="3.5" y="3.5" width="15" height="15" rx="3" />
        <path d="M3.5 15l4.5-4.5 3.5 3.5 2.5-2.5 4.5 4.5" />
        <circle cx="14" cy="8" r="1.4" />
      </>
    ),
    home: <path d="M3.5 10.2L11 4l7.5 6.2M5.5 8.6v9h11v-9M9 17.6v-4.6h4v4.6" />,
    collectibles: <path d="M11 3.5l2.2 4.6 5 .7-3.6 3.5.9 5-4.5-2.4-4.5 2.4.9-5-3.6-3.5 5-.7L11 3.5z" />,
    trade: <path d="M4 8h12.5l-3-3M18 14H5.5l3 3" />,
  };
  return (
    <svg viewBox="0 0 22 22" aria-hidden="true">
      {paths[icon]}
    </svg>
  );
}

/** A Roi-style phone: net worth, allocation and a chat with the AI companion. Decorative. */
function CompanionPhone({ logoSrc }: { logoSrc: string }) {
  return (
    <div className="roi-stage" aria-hidden="true">
      <div className="roi-aurora" />
      <div className="roi-phone">
        <div className="roi-screen">
          <div className="roi-status">
            <span>9:41</span>
            <span className="roi-status-pill" />
          </div>
          <div className="roi-app-head">
            <img src={logoSrc} alt="" className="roi-app-logo" />
            <span>Net worth</span>
          </div>
          <p className="roi-worth">$248,310</p>
          <p className="roi-change">▲ 2.4% this week</p>
          <div className="roi-alloc">
            {allocation.map((slice, index) => (
              <i
                key={slice.tone}
                style={{ "--w": slice.weight, "--i": index, "--tone": `var(--roi-${slice.tone})` } as CSSProperties}
              />
            ))}
          </div>
          <div className="roi-legend">
            <span>Stocks</span>
            <span>Crypto</span>
            <span>Real estate</span>
            <span>Other</span>
          </div>
          <svg className="roi-spark" viewBox="0 0 220 64">
            <defs>
              <linearGradient id="roi-spark-stroke" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0" style={{ stopColor: "var(--roi-blue)" }} />
                <stop offset="0.45" style={{ stopColor: "var(--roi-teal)" }} />
                <stop offset="0.75" style={{ stopColor: "var(--roi-yellow)" }} />
                <stop offset="1" style={{ stopColor: "var(--roi-magenta)" }} />
              </linearGradient>
              <linearGradient id="roi-spark-fill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor="rgb(120, 90, 255)" stopOpacity="0.32" />
                <stop offset="1" stopColor="rgb(120, 90, 255)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path className="roi-spark-area" d={`${SPARK_PATH} L220 64 L0 64 Z`} fill="url(#roi-spark-fill)" />
            <path className="roi-spark-line" d={SPARK_PATH} pathLength={1} stroke="url(#roi-spark-stroke)" />
          </svg>
          <div className="roi-chat">
            <div className="roi-bubble roi-bubble-me">How did my portfolio do this week?</div>
            <div className="roi-reply">
              <span className="roi-bubble roi-bubble-ai roi-typing">
                <i />
                <i />
                <i />
              </span>
              <span className="roi-bubble roi-bubble-ai roi-answer">
                Up 2.4%. Your three largest stocks all beat earnings estimates, and crypto added another 0.6%.
              </span>
            </div>
          </div>
          <div className="roi-ask">
            <span>Ask anything about your money</span>
            <span className="roi-send" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Workflow() {
  const { ref, active } = useSpotlightInView();

  return (
    <div ref={ref} className={cn("roi-flow", active && "is-active")}>
      <div className="roi-flow-track" aria-hidden="true">
        <span className="roi-flow-fill" />
      </div>
      <ol className="roi-flow-steps">
        {workflow.map((item, index) => (
          <li
            key={item.step}
            className={cn("roi-flow-step", item.mine && "is-mine")}
            style={{ "--step-index": index } as CSSProperties}
          >
            <span className="roi-flow-node" aria-hidden="true">
              {item.step}
            </span>
            <div className="roi-flow-card">
              <span className={cn("roi-tag", item.mine && "is-mine")}>{item.mine ? "My focus" : "In the app"}</span>
              <h4 className="roi-flow-title">{item.title}</h4>
              <p className="roi-flow-body">{item.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

interface RoiSpotlightProps {
  originRef: RefObject<HTMLElement>;
  logoSrc: string;
}

export default function RoiSpotlight({ originRef, logoSrc }: RoiSpotlightProps) {
  const roleRef = useRef<HTMLElement>(null);

  const showRole = () => {
    const reduce = typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    roleRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };

  return (
    <RoleSpotlight
      originRef={originRef}
      logoSrc={logoSrc}
      logoAlt="Roi logo"
      title="Equity Analyst"
      meta="Roi · Toronto, ON · 2023–2025"
      triggerLabel={spotlightTriggers.roi.label}
      triggerHint={spotlightTriggers.roi.hint}
      className="role-spotlight--roi"
    >
      <section className="roi-hero">
        <div className="roi-hero-copy">
          <SpotlightReveal delay={0}>
            <a href={ACQUISITION_URL} target="_blank" rel="noopener noreferrer" className="roi-pill">
              <img src={openAiMark} alt="" className="roi-pill-mark" />
              Acquired by OpenAI · October 2025
              <span aria-hidden="true" className="roi-pill-arrow">
                →
              </span>
            </a>
          </SpotlightReveal>
          <SpotlightReveal delay={70}>
            <h3 className="roi-display">
              The research behind an AI that <span className="roi-spectrum-text">knew your portfolio.</span>
            </h3>
          </SpotlightReveal>
          <SpotlightReveal delay={150}>
            <p className="roi-lede">
              Roi put stocks, crypto, real estate and more in one app, with an AI financial companion that answered
              questions about your own money. As an equity analyst, I analyzed and compiled public-company financial
              statements and worked with product and engineering on AI-driven data features.
            </p>
          </SpotlightReveal>
          <SpotlightReveal delay={220}>
            <div className="roi-actions">
              <button type="button" className="roi-button" onClick={showRole}>
                See my role
              </button>
              <a href={ACQUISITION_URL} target="_blank" rel="noopener noreferrer" className="roi-text-link">
                The OpenAI deal
                <span aria-hidden="true"> ↗</span>
              </a>
            </div>
          </SpotlightReveal>
        </div>
        <SpotlightReveal delay={140} className="roi-hero-visual">
          <CompanionPhone logoSrc={logoSrc} />
        </SpotlightReveal>
      </section>

      <section className="roi-section" aria-labelledby="roi-assets-title">
        <SpotlightReveal>
          <Label>The product</Label>
          <h3 id="roi-assets-title" className="roi-heading">
            Every asset. One app. One companion.
          </h3>
          <p className="roi-section-lede">
            Roi connected brokerages, wallets and accounts so investors could see everything they owned in one place,
            then ask its AI about any of it.
          </p>
        </SpotlightReveal>
        <ul className="roi-assets">
          {assets.map((asset, index) => (
            <li key={asset.title}>
              <SpotlightReveal delay={40 + index * 50} className="roi-asset-reveal">
                <div className="roi-asset" style={{ "--tone": `var(--roi-${asset.tone})` } as CSSProperties}>
                  <span className="roi-asset-icon">
                    <AssetGlyph icon={asset.icon} />
                  </span>
                  <span className="roi-asset-title">{asset.title}</span>
                  <span className="roi-asset-note">{asset.note}</span>
                </div>
              </SpotlightReveal>
            </li>
          ))}
        </ul>
      </section>

      <section className="roi-section" aria-labelledby="roi-numbers-title">
        <SpotlightReveal>
          <Label>By the numbers</Label>
          <h3 id="roi-numbers-title" className="roi-heading">
            A small team with a big audience.
          </h3>
        </SpotlightReveal>
        <dl className="roi-figures">
          {figures.map((figure, index) => (
            <SpotlightReveal key={figure.label} delay={60 + index * 80} className="roi-figure">
              <dt className="roi-figure-label">
                <span className={cn("roi-tag", figure.mine && "is-mine")}>{figure.mine ? "My role" : "Roi"}</span>
                {figure.label}
              </dt>
              <dd className="roi-figure-value">
                <SpotlightCountUp
                  to={figure.to}
                  decimals={figure.decimals}
                  prefix={figure.prefix}
                  suffix={figure.suffix}
                  delay={140 + index * 80}
                />
              </dd>
            </SpotlightReveal>
          ))}
        </dl>
      </section>

      <section ref={roleRef} className="roi-section roi-role" aria-labelledby="roi-role-title">
        <SpotlightReveal>
          <Label>My role</Label>
          <h3 id="roi-role-title" className="roi-heading">
            From the filing to the answer.
          </h3>
          <p className="roi-section-lede">
            Investors asked Roi about their money in plain language. My work sat upstream of those answers.
          </p>
        </SpotlightReveal>
        <SpotlightReveal delay={80}>
          <Workflow />
        </SpotlightReveal>
      </section>

      <section className="roi-section" aria-labelledby="roi-company-title">
        <SpotlightReveal>
          <Label>The company</Label>
          <h3 id="roi-company-title" className="roi-heading">
            Founded by Airbnb alumni. Backed by Spark Capital.
          </h3>
        </SpotlightReveal>
        <div className="roi-cards">
          <SpotlightReveal className="roi-card" delay={60}>
            <p className="roi-card-kicker">Founded 2022 · New York</p>
            <ul className="roi-people">
              {founders.map((person) => (
                <li key={person.name}>
                  <span className="roi-person-name">{person.name}</span>
                  <span className="roi-person-role">{person.role}</span>
                </li>
              ))}
            </ul>
          </SpotlightReveal>
          <SpotlightReveal className="roi-card roi-card-glow" delay={120}>
            <p className="roi-card-kicker">Backed by</p>
            <ul className="roi-backers">
              {backers.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </SpotlightReveal>
        </div>
      </section>

      <section className="roi-section" aria-labelledby="roi-openai-title">
        <SpotlightReveal>
          <Label>The OpenAI chapter</Label>
          <h3 id="roi-openai-title" className="roi-heading">
            From a finance app to the future of software.
          </h3>
        </SpotlightReveal>
        <ol className="roi-timeline">
          {timeline.map((item, index) => (
            <li key={item.date}>
              <SpotlightReveal delay={60 + index * 90} className={cn("roi-moment", item.openai && "is-openai")}>
                <span className="roi-moment-date">
                  {item.openai ? <img src={openAiMark} alt="" className="roi-moment-mark" /> : null}
                  {item.date}
                </span>
                <span className="roi-moment-title">{item.title}</span>
                <span className="roi-moment-body">{item.body}</span>
              </SpotlightReveal>
            </li>
          ))}
        </ol>
        <SpotlightReveal delay={120}>
          <figure className="roi-quote">
            <blockquote>
              <p>&ldquo;Personalization isn&rsquo;t just the future of finance. It&rsquo;s the future of software.&rdquo;</p>
            </blockquote>
            <figcaption>Sujith Vishwajith, Roi co-founder and CEO, announcing the acquisition</figcaption>
          </figure>
        </SpotlightReveal>
      </section>

      <section className="roi-section roi-toolkit" aria-labelledby="roi-toolkit-title">
        <SpotlightReveal>
          <Label id="roi-toolkit-title">Toolkit</Label>
          <ul className="roi-chips">
            {toolkit.map((item) => (
              <li key={item} className="roi-chip">
                {item}
              </li>
            ))}
          </ul>
        </SpotlightReveal>
      </section>

      <SpotlightReveal>
        <footer className="roi-footer">
          <p>
            Company facts come from Roi&rsquo;s App Store listing and coverage of its 2023 seed round and 2025
            acquisition (Fortune, TechCrunch, Built In). Roi shut down its app on October 15, 2025. Role figures are my
            own.
          </p>
          <a href={ACQUISITION_URL} target="_blank" rel="noopener noreferrer" className="roi-text-link">
            Read about the acquisition
            <span aria-hidden="true"> ↗</span>
          </a>
        </footer>
      </SpotlightReveal>
    </RoleSpotlight>
  );
}
