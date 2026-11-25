import { useRef, type CSSProperties, type ReactNode, type RefObject } from "react";
import {
  RoleSpotlight,
  SpotlightCountUp,
  SpotlightReveal,
  useSpotlightInView,
} from "@/components/role-spotlight";
import { cn } from "@/lib/utils";
import { spotlightTriggers } from "@/components/spotlight-triggers";
import "@/styles/spotlights/irving.css";

/*
 * "Inside the role" panel for the Irving Oil experience card, in Irving's
 * branding: white pages with slate headings, Irving red pill buttons, the
 * blue and red of the Irving logo, and a deep navy band.
 * Sources:
 * - irvingoil.com (Nov 2026): "Every day since 1924 ... good energy", customer programs
 *   (Blue Rewards, Hometown Rewards, Fuel the Care), Canada's Top 100 Employers for the 10th year
 * - irvingoil.com about us and operations: Canada's largest refinery in Saint John (320,000+
 *   barrels a day, 1,600+ people), 1,000+ fuelling locations across Eastern Canada and New England,
 *   Whitegate, Ireland's only refinery
 */

export const IRVING_URL = "https://www.irvingoil.com/en-CA";

const stages = [
  { label: "Reach", note: "New customers find Irving" },
  { label: "Acquire", note: "A first visit or fill-up" },
  { label: "Engage", note: "Targeted offers that fit" },
  { label: "Retain", note: "Reasons to keep coming back" },
];

export const company: { to?: number; suffix?: string; text?: string; label: string }[] = [
  { to: 320000, suffix: "+", label: "barrels a day at Canada’s largest refinery, in Saint John" },
  { to: 1000, suffix: "+", label: "fuelling locations across Eastern Canada and New England" },
  { to: 1600, suffix: "+", label: "people at the Saint John refinery" },
  { text: "1924", label: "the year K.C. Irving opened his first service station" },
];

const programs = [
  { title: "Blue Rewards", body: "Irving’s loyalty program, where customers earn points on the road and at home." },
  { title: "Hometown Rewards", body: "Member offers that give regulars more points every day." },
  { title: "Fuel the Care", body: "Fuel gift cards for local families travelling for medical care." },
];

const workflow = [
  {
    title: "Research",
    body: "I analyzed competitors’ offers and marketing, and those insights improved targeted marketing by 11%.",
  },
  {
    title: "Model",
    body: "I developed a customer lifecycle model that showed where each customer was and what would bring them back.",
  },
  {
    title: "Target",
    body: "The model increased targeted promotions, boosting customer engagement by 8%.",
  },
];

const toolkit = ["Market Research", "Customer Analytics", "Competitive Analysis", "Marketing Strategy"];

function Eyebrow({ children, id, light = false }: { children: ReactNode; id?: string; light?: boolean }) {
  return (
    <p id={id} className={cn("irv-eyebrow", light && "is-light")}>
      {children}
    </p>
  );
}

/** The customer lifecycle loop, with a competitor scan. Decorative. */
function LifecycleVisual() {
  return (
    <div className="irv-stage" aria-hidden="true">
      <div className="irv-loop">
        <svg className="irv-loop-ring" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="78" />
        </svg>
        <span className="irv-orbit">
          <span className="irv-orbit-dot" />
        </span>
        {stages.map((stage, index) => (
          <span
            key={stage.label}
            className={`irv-node irv-node-${index}`}
            style={{ "--i": index } as CSSProperties}
          >
            <span className="irv-node-label">{stage.label}</span>
          </span>
        ))}
        <span className="irv-loop-centre">
          <span className="irv-loop-kicker">Customer lifecycle</span>
          <span className="irv-loop-value">+8%</span>
          <span className="irv-loop-note">engagement</span>
        </span>
      </div>
      <div className="irv-scan">
        <span className="irv-scan-title">Competitor scan</span>
        {[
          { name: "Irving", width: 86, mine: true },
          { name: "Brand B", width: 64 },
          { name: "Brand C", width: 52 },
        ].map((bar, index) => (
          <span key={bar.name} className={cn("irv-scan-row", bar.mine && "is-mine")}>
            <span className="irv-scan-name">{bar.name}</span>
            <span className="irv-scan-track">
              <i style={{ "--w": `${bar.width}%`, "--i": index } as CSSProperties} />
            </span>
          </span>
        ))}
        <span className="irv-scan-foot">+11% targeted marketing</span>
      </div>
    </div>
  );
}

function Workflow() {
  const { ref, active } = useSpotlightInView();

  return (
    <div ref={ref} className={cn("irv-flow", active && "is-active")}>
      <div className="irv-flow-track" aria-hidden="true">
        <span className="irv-flow-fill" />
      </div>
      <ol className="irv-flow-steps">
        {workflow.map((step, index) => (
          <li key={step.title} className="irv-flow-step" style={{ "--step-index": index } as CSSProperties}>
            <span className="irv-flow-node" aria-hidden="true">
              {index + 1}
            </span>
            <div className="irv-flow-card">
              <h4 className="irv-flow-title">{step.title}</h4>
              <p className="irv-flow-body">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

interface IrvingSpotlightProps {
  originRef: RefObject<HTMLElement>;
  logoSrc: string;
}

export default function IrvingSpotlight({ originRef, logoSrc }: IrvingSpotlightProps) {
  const roleRef = useRef<HTMLElement>(null);

  const showRole = () => {
    const reduce = typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    roleRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };

  return (
    <RoleSpotlight
      originRef={originRef}
      logoSrc={logoSrc}
      logoAlt="Irving Oil logo"
      title="Marketing Intern"
      meta="Irving Oil Limited · Saint John, NB · 2018"
      triggerLabel={spotlightTriggers.irving.label}
      triggerHint={spotlightTriggers.irving.hint}
      className="role-spotlight--irving"
    >
      <section className="irv-hero">
        <div className="irv-hero-copy">
          <SpotlightReveal delay={0}>
            <Eyebrow>Inside the role</Eyebrow>
          </SpotlightReveal>
          <SpotlightReveal delay={70}>
            <h3 className="irv-display">Good energy starts with knowing the customer.</h3>
          </SpotlightReveal>
          <SpotlightReveal delay={150}>
            <p className="irv-lede">
              Irving Oil has served customers across Eastern Canada and New England since 1924. As a marketing intern
              in Saint John, I studied the competition and built a customer lifecycle model, improving
              targeted marketing by 11% and lifting customer engagement by 8%.
            </p>
          </SpotlightReveal>
          <SpotlightReveal delay={220}>
            <div className="irv-actions">
              <button type="button" className="irv-button" onClick={showRole}>
                See my role
              </button>
              <a href={IRVING_URL} target="_blank" rel="noopener noreferrer" className="irv-button irv-button-outline">
                Visit Irving Oil
              </a>
            </div>
          </SpotlightReveal>
        </div>
        <SpotlightReveal delay={140} className="irv-hero-visual">
          <LifecycleVisual />
        </SpotlightReveal>
      </section>

      <section className="irv-band" aria-labelledby="irv-company-title">
        <div className="irv-band-inner">
          <SpotlightReveal>
            <Eyebrow light>Irving Oil</Eyebrow>
            <h3 id="irv-company-title" className="irv-heading is-light">
              Canada&rsquo;s largest refinery, run from Saint John.
            </h3>
          </SpotlightReveal>
          <dl className="irv-stats">
            {company.map((item, index) => (
              <SpotlightReveal key={item.label} delay={60 + index * 70} className="irv-stat">
                <dt className="irv-stat-label">{item.label}</dt>
                <dd className="irv-stat-value">
                  {item.text ?? <SpotlightCountUp to={item.to ?? 0} suffix={item.suffix} delay={120 + index * 70} />}
                </dd>
              </SpotlightReveal>
            ))}
          </dl>
          <SpotlightReveal delay={140}>
            <p className="irv-band-note">
              Irving also runs Whitegate, Ireland&rsquo;s only refinery, and is one of Canada&rsquo;s Top 100 Employers
              for the 10th year.
            </p>
          </SpotlightReveal>
        </div>
      </section>

      <section ref={roleRef} className="irv-section irv-role" aria-labelledby="irv-role-title">
        <SpotlightReveal>
          <Eyebrow>My role</Eyebrow>
          <h3 id="irv-role-title" className="irv-heading">
            From competitor research to targeted promotions.
          </h3>
        </SpotlightReveal>
        <SpotlightReveal delay={80}>
          <Workflow />
        </SpotlightReveal>
        <dl className="irv-results">
          {[
            { to: 11, label: "improvement in targeted marketing from my competitor analysis" },
            { to: 8, label: "boost in customer engagement from the lifecycle model" },
          ].map((figure, index) => (
            <SpotlightReveal key={figure.label} delay={80 + index * 90} className="irv-result">
              <dt className="irv-result-label">{figure.label}</dt>
              <dd className="irv-result-value">
                <SpotlightCountUp to={figure.to} prefix="+" suffix="%" delay={160 + index * 90} />
              </dd>
            </SpotlightReveal>
          ))}
        </dl>
      </section>

      <section className="irv-section" aria-labelledby="irv-programs-title">
        <SpotlightReveal>
          <Eyebrow>The customer side of Irving in 2026</Eyebrow>
          <h3 id="irv-programs-title" className="irv-heading">
            Loyalty, offers and community.
          </h3>
          <p className="irv-section-lede">
            Irving reaches customers through rewards for regulars, member offers and programs that give back.
          </p>
        </SpotlightReveal>
        <ul className="irv-programs">
          {programs.map((program, index) => (
            <li key={program.title}>
              <SpotlightReveal delay={60 + index * 70} className="irv-program">
                <span className="irv-program-title">{program.title}</span>
                <span className="irv-program-body">{program.body}</span>
              </SpotlightReveal>
            </li>
          ))}
        </ul>
      </section>

      <section className="irv-section irv-toolkit" aria-labelledby="irv-toolkit-title">
        <SpotlightReveal>
          <Eyebrow id="irv-toolkit-title">Toolkit</Eyebrow>
          <ul className="irv-chips">
            {toolkit.map((item) => (
              <li key={item} className="irv-chip">
                {item}
              </li>
            ))}
          </ul>
        </SpotlightReveal>
      </section>

      <SpotlightReveal>
        <footer className="irv-footer">
          <p>
            Company facts and programs come from irvingoil.com (2026). Role figures are my own, from my 2018 internship.
          </p>
          <a href={IRVING_URL} target="_blank" rel="noopener noreferrer" className="irv-link">
            Visit Irving Oil
            <span aria-hidden="true"> ›</span>
          </a>
        </footer>
      </SpotlightReveal>
    </RoleSpotlight>
  );
}
