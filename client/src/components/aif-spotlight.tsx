import { useRef, type CSSProperties, type RefObject } from "react";
import { RoleSpotlight, SpotlightReveal, useSpotlightInView } from "@/components/role-spotlight";
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

/*
 * "Inside the credential" panel for the AI Fluency: Framework and Foundations card, in
 * Anthropic's branding: ivory and oat pages, slate type and bands, serif headings,
 * slate buttons with rounded corners, clay accents, and the olive, sky, heather and
 * cactus colours of my AI Fluency certificates.
 * Sources:
 * - Claude Academy course page (academy.claude.com, Nov 2026): 14 lessons, about 4 hours,
 *   1 quiz; the 4D framework and its parts; Automation, Augmentation and Agency; built
 *   with professors Rick Dakan (Ringling College of Art and Design) and Joseph Feller
 *   (University College Cork), who developed the framework in 2023-2024
 * - Claude Academy home and AI Fluency collection: free courses; AI Capabilities and
 *   Limitations, 13 lessons
 * - Anthropic's AI Fluency Framework handout and course pages: the 4D definitions and the
 *   three ways of working with AI; © 2025 Rick Dakan, Joseph Feller and Anthropic,
 *   CC BY-NC-SA 4.0; AI Fluency for students uses AI as a thinking partner for learning
 *   and careers
 * - Anthropic Academy's legacy site: moving to academy.claude.com, where certificates
 *   can be claimed; Coursera listing: the framework already informs university courses
 *   and staff training
 * - My certificates: Framework and Foundations (2026), AI Capabilities and Limitations,
 *   and AI Fluency for students, educators, nonprofits (with GivingTuesday) and small
 *   businesses (with PayPal), and Teaching the AI Fluency Framework
 */

const ACADEMY_URL = "https://academy.claude.com/courses/ai-fluency-framework-foundations";

type Tone = "olive" | "sky" | "heather" | "clay" | "cactus";

const competencies: { name: string; short: string; definition: string; parts: string; tone: Tone }[] = [
  {
    name: "Delegation",
    short: "Deciding what work to do with AI",
    definition: "Setting goals and deciding whether, when and how to engage with AI.",
    parts: "Problem awareness, platform awareness and task delegation",
    tone: "olive",
  },
  {
    name: "Description",
    short: "Communicating effectively with AI",
    definition: "Effectively describing goals to prompt useful AI behaviors and outputs.",
    parts: "Product, process and performance description",
    tone: "sky",
  },
  {
    name: "Discernment",
    short: "Evaluating AI outputs critically",
    definition: "Accurately assessing the usefulness of AI outputs and behaviors.",
    parts: "Outputs, processes and behavior, refined in the description–discernment loop",
    tone: "heather",
  },
  {
    name: "Diligence",
    short: "Ensuring responsible collaboration",
    definition: "Taking responsibility for what we do with AI and how we do it.",
    parts: "Creation, transparency and deployment diligence",
    tone: "clay",
  },
];

const modes = [
  { name: "Automation", body: "AI executes specific tasks based on your instructions." },
  { name: "Augmentation", body: "You and AI collaborate as creative thinking and task execution partners." },
  { name: "Agency", body: "You configure AI to work independently on your behalf." },
];

const framework = [
  { value: "2023–24", label: "when Dakan and Feller built the framework" },
  { to: 4, label: "competencies, the 4Ds" },
  { to: 3, label: "ways of working with AI" },
  { value: "Free", label: "like every course on Claude Academy" },
];

const workflow = [
  {
    title: "Foundations",
    body: "What AI fluency means, three ways of working with AI, and how large language models work, limits included.",
  },
  {
    title: "The 4Ds",
    body: "A closer look at each competency, from delegation decisions and prompting to the description–discernment loop.",
  },
  {
    title: "Certify",
    body: "A final quiz checks your AI fluency and earns the certificate of completion.",
  },
];

const courseFacts = [
  { to: 14, label: "lessons, with video and exercises" },
  { to: 4, suffix: " hrs", label: "or so to finish, at your own pace" },
  { to: 1, label: "final quiz for the certificate" },
];

const series: { title: string; body: string; tone: Tone }[] = [
  { title: "AI Capabilities & Limitations", body: "What large language models can and cannot do.", tone: "heather" },
  { title: "AI Fluency for students", body: "AI as a thinking partner for learning and careers.", tone: "heather" },
  { title: "AI Fluency for educators", body: "Made with Ringling College, UCC and Ireland’s HEA.", tone: "cactus" },
  { title: "Teaching the AI Fluency Framework", body: "How to teach the 4Ds to others.", tone: "sky" },
  { title: "AI Fluency for nonprofits", body: "Made with GivingTuesday.", tone: "cactus" },
  { title: "AI Fluency for Small Businesses", body: "Made with PayPal.", tone: "olive" },
];

const today = [
  {
    title: "A new home",
    body: "Anthropic’s courses are moving to Claude Academy, where certificates can be claimed.",
  },
  {
    title: "Also on Coursera",
    body: "The same course is offered on Coursera, under Anthropic’s name.",
  },
  {
    title: "Open to teach",
    body: "Under a Creative Commons licence, the framework already shapes university courses and staff training.",
  },
];

/** The four competencies as tiles around a check, after my certificate. Decorative. */
function FourDs() {
  const { ref, active } = useSpotlightInView();

  return (
    <div ref={ref} className={cn("aif-stage", active && "is-active")} aria-hidden="true">
      <div className="aif-grid">
        {competencies.map((item, index) => (
          <span key={item.name} className={`aif-tile is-${item.tone}`} style={{ "--i": index } as CSSProperties}>
            <span className="aif-tile-index">0{index + 1}</span>
            <span className="aif-tile-name">{item.name}</span>
            <span className="aif-tile-line">{item.short}</span>
          </span>
        ))}
        <span className="aif-check">
          <svg viewBox="0 0 24 24" focusable="false">
            <path d="M6.5 12.5l3.6 3.6 7.6-8.2" />
          </svg>
        </span>
      </div>
      <span className="aif-pill">
        <span className="aif-pill-check">
          <svg viewBox="0 0 24 24" focusable="false">
            <path d="M6.5 12.5l3.6 3.6 7.6-8.2" />
          </svg>
        </span>
        Certificate <i>of</i> completion
      </span>
    </div>
  );
}

interface AifSpotlightProps {
  originRef: RefObject<HTMLElement>;
  logoSrc: string;
}

export default function AifSpotlight({ originRef, logoSrc }: AifSpotlightProps) {
  const frameworkRef = useRef<HTMLElement>(null);
  const showFramework = useShowSection(frameworkRef);

  return (
    <RoleSpotlight
      originRef={originRef}
      logoSrc={logoSrc}
      logoAlt="Anthropic logo"
      title="AI Fluency: Framework and Foundations"
      meta="Anthropic · Completed 2026"
      triggerLabel="Inside the credential"
      triggerHint="The framework, the course and the series"
      className="role-spotlight--cred role-spotlight--aif"
    >
      <section className="cred-hero">
        <div>
          <SpotlightReveal delay={0}>
            <CredEyebrow>Inside the credential</CredEyebrow>
          </SpotlightReveal>
          <SpotlightReveal delay={70}>
            <h3 className="cred-display">How to work with AI, not just prompt it.</h3>
          </SpotlightReveal>
          <SpotlightReveal delay={150}>
            <p className="cred-lede">
              I completed AI Fluency: Framework and Foundations, Anthropic&rsquo;s course built with professors Rick
              Dakan and Joseph Feller. It teaches the 4D framework for working with AI effectively, efficiently,
              ethically and safely, whatever the model or tool.
            </p>
          </SpotlightReveal>
          <SpotlightReveal delay={220}>
            <div className="cred-actions">
              <button type="button" className="cred-button" onClick={showFramework}>
                See the 4D framework
              </button>
              <a href={ACADEMY_URL} target="_blank" rel="noopener noreferrer" className="cred-button cred-button-outline">
                Visit Claude Academy
              </a>
            </div>
          </SpotlightReveal>
        </div>
        <SpotlightReveal delay={140} className="cred-hero-visual">
          <FourDs />
        </SpotlightReveal>
      </section>

      <section className="cred-band" aria-labelledby="aif-framework-band-title">
        <div className="cred-band-inner">
          <SpotlightReveal>
            <CredEyebrow>The AI Fluency Framework</CredEyebrow>
            <h3 id="aif-framework-band-title" className="cred-heading">
              Built by educators, taught by Anthropic.
            </h3>
          </SpotlightReveal>
          <CredStats figures={framework} />
          <SpotlightReveal delay={140}>
            <p className="cred-band-note">
              Professors Rick Dakan and Joseph Feller built the framework from their research on how tools like
              Claude were changing creative and business work.
            </p>
          </SpotlightReveal>
        </div>
      </section>

      <section className="cred-section" aria-labelledby="aif-course-title">
        <SpotlightReveal>
          <CredEyebrow>The course</CredEyebrow>
          <h3 id="aif-course-title" className="cred-heading">
            Fourteen lessons and a quiz.
          </h3>
        </SpotlightReveal>
        <SpotlightReveal delay={80}>
          <CredWorkflow steps={workflow} />
        </SpotlightReveal>
        <CredResults figures={courseFacts} />
        <CredDone>I completed the course and its quiz, then went on to finish the rest of the AI Fluency series.</CredDone>
      </section>

      <section ref={frameworkRef} className="cred-section cred-anchor" aria-labelledby="aif-4d-title">
        <SpotlightReveal>
          <CredEyebrow>The framework</CredEyebrow>
          <h3 id="aif-4d-title" className="cred-heading">
            Four competencies, three ways of working.
          </h3>
          <p className="cred-section-lede">
            The 4Ds apply whether AI is doing a task for you, thinking with you or acting on your behalf.
          </p>
        </SpotlightReveal>
        <ul className="aif-ds">
          {competencies.map((item, index) => (
            <li key={item.name}>
              <SpotlightReveal delay={60 + index * 70} className={`aif-d is-${item.tone}`}>
                <span className="aif-d-name">{item.name}</span>
                <span className="aif-d-definition">{item.definition}</span>
                <span className="aif-d-parts">{item.parts}</span>
              </SpotlightReveal>
            </li>
          ))}
        </ul>
        <ul className="aif-modes">
          {modes.map((mode, index) => (
            <li key={mode.name}>
              <SpotlightReveal delay={80 + index * 70} className="aif-mode">
                <span className="aif-mode-name">{mode.name}</span>
                <span className="aif-mode-body">{mode.body}</span>
              </SpotlightReveal>
            </li>
          ))}
        </ul>
      </section>

      <section className="cred-section" aria-labelledby="aif-series-title">
        <SpotlightReveal>
          <CredEyebrow>Beyond the course</CredEyebrow>
          <h3 id="aif-series-title" className="cred-heading">
            The rest of the AI Fluency series.
          </h3>
          <p className="cred-section-lede">Six more Anthropic courses I have completed, each with its own certificate.</p>
        </SpotlightReveal>
        <ul className="aif-series">
          {series.map((course, index) => (
            <li key={course.title}>
              <SpotlightReveal delay={60 + index * 60} className={`aif-course is-${course.tone}`}>
                <span className="aif-course-swatch" aria-hidden="true">
                  <span className="aif-pill-check">
                    <svg viewBox="0 0 24 24" focusable="false">
                      <path d="M6.5 12.5l3.6 3.6 7.6-8.2" />
                    </svg>
                  </span>
                </span>
                <span className="aif-course-copy">
                  <span className="aif-course-title">{course.title}</span>
                  <span className="aif-course-body">{course.body}</span>
                  <span className="aif-course-done">Completed</span>
                </span>
              </SpotlightReveal>
            </li>
          ))}
        </ul>
      </section>

      <section className="cred-section" aria-labelledby="aif-today-title">
        <SpotlightReveal>
          <CredEyebrow>AI Fluency today</CredEyebrow>
          <h3 id="aif-today-title" className="cred-heading">
            Where the course stands now.
          </h3>
        </SpotlightReveal>
        <CredCards cards={today} />
      </section>

      <CredFooter
        note="Course facts come from Claude Academy and Anthropic (2026). The AI Fluency Framework is © 2025 Rick Dakan, Joseph Feller and Anthropic, under CC BY-NC-SA 4.0. My completions are from my certificates."
        href={ACADEMY_URL}
        linkLabel="Visit Claude Academy"
      />
    </RoleSpotlight>
  );
}
