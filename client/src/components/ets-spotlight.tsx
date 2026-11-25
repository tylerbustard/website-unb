import { useRef, type CSSProperties, type RefObject } from "react";
import { RoleSpotlight, SpotlightCountUp, SpotlightReveal, useSpotlightInView } from "@/components/role-spotlight";
import {
  CredCards,
  CredDone,
  CredEyebrow,
  CredFooter,
  CredResults,
  CredStats,
  CredWorkflow,
  useShowSection,
} from "@/components/credential-panel";
import { cn } from "@/lib/utils";
import { spotlightTriggers } from "@/components/spotlight-triggers";
import "@/styles/spotlights/ets.css";

/*
 * "Inside the credential" panel for the GRE General Test card, in the GRE's branding
 * on ets.org: cream pages, deep plum type and bands, lavender highlights behind
 * headlines, square orange buttons and an orange arrow.
 * Sources:
 * - ets.org/gre (Nov 2026): 250,000+ test takers a year; accepted by 20,000+ graduate,
 *   business and law programs, including 1,300+ MBA programs; 365 days a year at 1,000+
 *   locations and at home; retakes every 21 days, up to five a year; ScoreSelect; scores
 *   valid for five years
 * - ets.org GRE test structure page: about 1 hour 58 minutes in five sections since
 *   September 22, 2023 (about 3 hours 45 minutes before); one 30-minute Analyze an Issue
 *   task, always first; Verbal 12 + 15 questions in 18 + 23 minutes; Quantitative 12 + 15
 *   questions in 21 + 26 minutes; section-level adaptive; on-screen calculator
 * - ets.org scoring page: Verbal and Quantitative 130 to 170 in 1-point steps, Analytical
 *   Writing 0 to 6 in half points
 * - My ETS score report: tested May 30, 2024; Verbal 158 (77th percentile), Quantitative
 *   170 (91st), Analytical Writing 4.0. The panel leads with the 170 and the 328 total.
 */

const GRE_URL = "https://www.ets.org/gre.html";

const scores = [
  { name: "Quantitative Reasoning", score: "170", value: 170, min: 130, max: 170, note: "91st percentile", top: true },
  { name: "Verbal Reasoning", score: "158", value: 158, min: 130, max: 170, note: "77th percentile" },
  { name: "Analytical Writing", score: "4.0", value: 4, min: 0, max: 6, note: "Half-point scale" },
];

const headline = [
  { to: 170, label: "in Quantitative Reasoning, the highest score on the scale" },
  { to: 328, label: "in total, out of 340 across Quantitative and Verbal" },
];

const percentiles = [
  { name: "Quantitative Reasoning", score: "170", to: 91, suffix: "st" },
  { name: "Verbal Reasoning", score: "158", to: 77, suffix: "th" },
];

const program = [
  { to: 250000, suffix: "+", label: "students take the GRE every year" },
  { to: 20000, suffix: "+", label: "graduate, business and law programs accept it" },
  { to: 1300, suffix: "+", label: "MBA programs among them" },
  { to: 1000, suffix: "+", label: "test locations, plus testing at home" },
];

const workflow = [
  {
    title: "Analytical Writing",
    body: "One “Analyze an Issue” essay in 30 minutes. It always comes first.",
  },
  {
    title: "Verbal Reasoning",
    body: "Two sections, 27 questions in 41 minutes. The second adapts to how the first went.",
  },
  {
    title: "Quantitative Reasoning",
    body: "Two sections, 27 questions in 47 minutes, with an on-screen calculator.",
  },
];

const testFacts = [
  { to: 118, suffix: " min", label: "of testing in five sections, just under two hours" },
  { to: 54, label: "questions, plus the essay" },
  { value: "130–170", label: "the Verbal and Quantitative scale, in 1-point steps" },
];

const today = [
  {
    title: "Shorter since 2023",
    body: "In September 2023 the test went from about 3 hours 45 minutes to just under two hours.",
  },
  {
    title: "Any day, at home or not",
    body: "It runs 365 days a year at more than 1,000 locations, and at home.",
  },
  {
    title: "Retakes and ScoreSelect",
    body: "Test takers can retake every 21 days, up to five times a year, and send only their best scores.",
  },
];

/** The three scores on their scales, after the ETS score report. Decorative: the text states them. */
function ScoreReport() {
  const { ref, active } = useSpotlightInView();

  return (
    <div ref={ref} className={cn("ets-report", active && "is-active")} aria-hidden="true">
      <div className="ets-report-head">
        <span className="ets-report-title">
          My scores
          <small>May 30, 2024</small>
        </span>
        <span className="ets-report-total">
          328
          <small>total</small>
        </span>
      </div>
      <ul className="ets-scales">
        {scores.map((item, index) => (
          <li
            key={item.name}
            className={cn("ets-scale", item.top && "is-top")}
            style={
              {
                "--pos": `${((item.value - item.min) / (item.max - item.min)) * 100}%`,
                "--i": index,
              } as CSSProperties
            }
          >
            <span className="ets-scale-name">{item.name}</span>
            <span className="ets-scale-score">{item.score}</span>
            <span className="ets-scale-track">
              <i className="ets-scale-fill" />
              <b className="ets-scale-marker" />
            </span>
            <span className="ets-scale-min">{item.min}</span>
            <span className="ets-scale-pct">{item.note}</span>
            <span className="ets-scale-max">{item.top ? "Top of the scale" : item.max}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Percentile bars for the two scaled measures. */
function Percentiles() {
  const { ref, active } = useSpotlightInView();

  return (
    <div ref={ref} className={cn("ets-pcts", active && "is-active")}>
      <ul className="ets-pct-list">
        {percentiles.map((item, index) => (
          <li key={item.name} className="ets-pct" style={{ "--w": `${item.to}%`, "--i": index } as CSSProperties}>
            <span className="ets-pct-name">
              {item.name} <b>{item.score}</b>
            </span>
            <span className="ets-pct-value">
              <SpotlightCountUp to={item.to} suffix={item.suffix} delay={250 + index * 140} /> percentile
            </span>
            <span className="ets-pct-track" aria-hidden="true">
              <i />
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

interface EtsSpotlightProps {
  originRef: RefObject<HTMLElement>;
  logoSrc: string;
}

export default function EtsSpotlight({ originRef, logoSrc }: EtsSpotlightProps) {
  const scoresRef = useRef<HTMLElement>(null);
  const showScores = useShowSection(scoresRef);

  return (
    <RoleSpotlight
      originRef={originRef}
      logoSrc={logoSrc}
      logoAlt="ETS logo"
      title="GRE General Test"
      meta="ETS · Taken May 2024"
      triggerLabel={spotlightTriggers.ets.label}
      triggerHint={spotlightTriggers.ets.hint}
      className="role-spotlight--cred role-spotlight--ets"
    >
      <section className="cred-hero">
        <div>
          <SpotlightReveal delay={0}>
            <CredEyebrow>Inside the credential</CredEyebrow>
          </SpotlightReveal>
          <SpotlightReveal delay={70}>
            <h3 className="cred-display">
              A perfect score in <span className="ets-mark">quantitative reasoning.</span>
            </h3>
          </SpotlightReveal>
          <SpotlightReveal delay={150}>
            <p className="cred-lede">
              I took the GRE General Test on May 30, 2024 and scored 328: a 170 in Quantitative Reasoning, the top of
              the scale, and a 158 in Verbal Reasoning, with a 4.0 in Analytical Writing.
            </p>
          </SpotlightReveal>
          <SpotlightReveal delay={220}>
            <div className="cred-actions">
              <button type="button" className="cred-button" onClick={showScores}>
                See how my scores compare
              </button>
              <a href={GRE_URL} target="_blank" rel="noopener noreferrer" className="cred-button cred-button-outline">
                Visit the GRE
              </a>
            </div>
          </SpotlightReveal>
        </div>
        <SpotlightReveal delay={140} className="cred-hero-visual">
          <ScoreReport />
        </SpotlightReveal>
      </section>

      <section className="cred-band" aria-labelledby="ets-program-title">
        <div className="cred-band-inner">
          <SpotlightReveal>
            <CredEyebrow>The GRE</CredEyebrow>
            <h3 id="ets-program-title" className="cred-heading">
              One test for graduate, business and law school.
            </h3>
          </SpotlightReveal>
          <CredStats figures={program} />
          <SpotlightReveal delay={140}>
            <p className="cred-band-note">
              Scores stay valid for five years, and ScoreSelect lets test takers send only the scores they choose.
            </p>
          </SpotlightReveal>
        </div>
      </section>

      <section className="cred-section" aria-labelledby="ets-test-title">
        <SpotlightReveal>
          <CredEyebrow>The test</CredEyebrow>
          <h3 id="ets-test-title" className="cred-heading">
            Five sections, just under two hours.
          </h3>
        </SpotlightReveal>
        <SpotlightReveal delay={80}>
          <CredWorkflow steps={workflow} />
        </SpotlightReveal>
        <CredResults figures={testFacts} />
        <CredDone>I took it on May 30, 2024, in the shorter format ETS introduced in September 2023.</CredDone>
      </section>

      <section ref={scoresRef} className="cred-section cred-anchor" aria-labelledby="ets-scores-title">
        <SpotlightReveal>
          <CredEyebrow>My scores</CredEyebrow>
          <h3 id="ets-scores-title" className="cred-heading">
            Where 328 lands.
          </h3>
          <p className="cred-section-lede">
            A 170 is the highest Quantitative Reasoning score there is. Each percentile is the share of test takers
            who scored lower, from my ETS score report.
          </p>
        </SpotlightReveal>
        <CredResults figures={headline} />
        <SpotlightReveal delay={80}>
          <Percentiles />
        </SpotlightReveal>
      </section>

      <section className="cred-section" aria-labelledby="ets-today-title">
        <SpotlightReveal>
          <CredEyebrow>The GRE in 2026</CredEyebrow>
          <h3 id="ets-today-title" className="cred-heading">
            Where the test stands.
          </h3>
        </SpotlightReveal>
        <CredCards cards={today} />
      </section>

      <CredFooter
        note="Test facts come from ets.org (2026). My scores and percentiles are from my ETS score report."
        href={GRE_URL}
        linkLabel="Visit the GRE"
      />
    </RoleSpotlight>
  );
}
