import { useRef, type CSSProperties, type ReactNode, type RefObject } from "react";
import {
  RoleSpotlight,
  SpotlightCountUp,
  SpotlightReveal,
  useSpotlightInView,
} from "@/components/role-spotlight";
import { cn } from "@/lib/utils";

/*
 * "Inside the degree" panel for the UNB education card, in UNB's branding: white
 * pages with light headings, UNB red pill buttons and a UNB red band, light grey
 * sections with square white cards, and charcoal accents from unb.ca's footer.
 * Sources:
 * - unb.ca quick facts (Nov 2026): Canada's oldest English-language university, Fredericton
 *   campus 1785 and Saint John campus 1964, motto Sapere aude ("Dare to be wise"),
 *   100,000+ living alumni, 14 faculties
 * - unb.ca home page: top 5.3% of 21,291 universities worldwide (CWUR 2026)
 * - UNB Newsroom (Jul 2022): AACSB accreditation for the Faculty of Business in Saint John,
 *   held by fewer than 6% of business schools
 * - UNB Newsroom (Mar 2024) and unb.ca's Student Investment Fund page: started in 1998 with
 *   $1 million, over $14 million by 2024, first Canadian team to win the CFA Institute
 *   North American Research Challenge
 * - UNB Saint John BBA pages: the business co-op alternates study terms with paid work terms
 */

const UNB_URL = "https://www.unb.ca/";

export interface UnbCourseArea {
  title: string;
  courses: string[];
}

const university = [
  { to: 100000, suffix: "+", label: "living alumni around the world" },
  { to: 14, label: "faculties across the Fredericton and Saint John campuses" },
  { to: 5.3, prefix: "Top ", suffix: "%", decimals: 1, label: "of 21,291 universities worldwide (CWUR 2026)" },
];

const workflow = [
  {
    title: "Learn",
    body: "A full business foundation with a finance major: corporate finance, markets and institutions, the theory of finance and international financial management.",
  },
  {
    title: "Apply",
    body: "I joined UNB’s Cooperative Education Program, which alternates study terms with paid work terms, and the UNB Finance Club.",
  },
  {
    title: "Invest",
    body: "As a portfolio manager in UNB’s Student Investment Fund, I put my finance courses to work on a portfolio of real money.",
  },
];

const DONUT_RADIUS = 78;
const CIRCUMFERENCE = 2 * Math.PI * DONUT_RADIUS;

function Eyebrow({ children, id, light = false }: { children: ReactNode; id?: string; light?: boolean }) {
  return (
    <p id={id} className={cn("unb-eyebrow", light && "is-light")}>
      {children}
    </p>
  );
}

/** Ranks course areas by size; the first four get their own colour, the rest share one. */
function donutSegments(areas: UnbCourseArea[]) {
  const ranked = [...areas].sort((a, b) => b.courses.length - a.courses.length);
  const rest = ranked.slice(4).reduce((sum, area) => sum + area.courses.length, 0);
  return [...ranked.slice(0, 4).map((area) => ({ key: area.title, count: area.courses.length })), { key: "rest", count: rest }];
}

/** My 35 courses as a ring, with finance in UNB red. Decorative. */
function CoursesVisual({ areas, total, finance }: { areas: UnbCourseArea[]; total: number; finance: number }) {
  let start = 0;

  return (
    <div className="unb-stage" aria-hidden="true">
      <div className="unb-donut">
        <svg className="unb-donut-ring" viewBox="0 0 200 200">
          <g transform="rotate(-90 100 100)">
            <circle className="unb-donut-track" cx="100" cy="100" r={DONUT_RADIUS} />
            {donutSegments(areas).map((segment, index) => {
              const length = (Math.max(segment.count - 0.3, 0) / total) * CIRCUMFERENCE;
              const offset = -(start / total) * CIRCUMFERENCE;
              start += segment.count;
              return (
                <circle
                  key={segment.key}
                  className={`unb-seg unb-seg-${index}`}
                  cx="100"
                  cy="100"
                  r={DONUT_RADIUS}
                  style={
                    {
                      strokeDasharray: `${length} ${CIRCUMFERENCE - length}`,
                      strokeDashoffset: offset,
                      "--i": index,
                    } as CSSProperties
                  }
                />
              );
            })}
          </g>
        </svg>
        <span className="unb-donut-centre">
          <span className="unb-donut-kicker">Coursework</span>
          <span className="unb-donut-value">{total}</span>
          <span className="unb-donut-note">
            <i />
            {finance} in finance
          </span>
        </span>
      </div>
      <span className="unb-award">
        <span className="unb-award-value">$47,500</span>
        <span className="unb-award-note">in scholarships from 5 academic awards</span>
      </span>
      <span className="unb-fund">
        <span className="unb-fund-kicker">Student Investment Fund</span>
        <span className="unb-fund-value">Portfolio Manager</span>
      </span>
    </div>
  );
}

function Workflow() {
  const { ref, active } = useSpotlightInView();

  return (
    <div ref={ref} className={cn("unb-flow", active && "is-active")}>
      <div className="unb-flow-track" aria-hidden="true">
        <span className="unb-flow-fill" />
      </div>
      <ol className="unb-flow-steps">
        {workflow.map((step, index) => (
          <li key={step.title} className="unb-flow-step" style={{ "--step-index": index } as CSSProperties}>
            <span className="unb-flow-node" aria-hidden="true">
              {index + 1}
            </span>
            <div className="unb-flow-card">
              <h4 className="unb-flow-title">{step.title}</h4>
              <p className="unb-flow-body">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** Courses per area, largest first, with bars that grow in. */
function CourseBars({ areas }: { areas: UnbCourseArea[] }) {
  const { ref, active } = useSpotlightInView();
  const ranked = [...areas].sort((a, b) => b.courses.length - a.courses.length);
  const most = Math.max(...ranked.map((area) => area.courses.length), 1);

  return (
    <div ref={ref} className={cn("unb-bars", active && "is-active")}>
      <ul className="unb-bars-list">
        {ranked.map((area, index) => (
          <li
            key={area.title}
            className={cn("unb-bar", index === 0 && "is-major")}
            style={{ "--i": index, "--w": `${(area.courses.length / most) * 100}%` } as CSSProperties}
          >
            <span className="unb-bar-label">{area.title}</span>
            <span className="unb-bar-count">
              {area.courses.length}
              <span className="sr-only">{area.courses.length === 1 ? " course" : " courses"}</span>
            </span>
            <span className="unb-bar-track" aria-hidden="true">
              <i />
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

interface UnbSpotlightProps {
  originRef: RefObject<HTMLElement>;
  logoSrc: string;
  courseAreas: UnbCourseArea[];
}

export default function UnbSpotlight({ originRef, logoSrc, courseAreas }: UnbSpotlightProps) {
  const degreeRef = useRef<HTMLElement>(null);
  const total = courseAreas.reduce((sum, area) => sum + area.courses.length, 0);
  const financeCourses = courseAreas.find((area) => area.title === "Finance")?.courses ?? [];

  const showDegree = () => {
    const reduce = typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    degreeRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };

  return (
    <RoleSpotlight
      originRef={originRef}
      logoSrc={logoSrc}
      logoAlt="University of New Brunswick logo"
      title="University of New Brunswick"
      meta={"BBA, Finance · Saint John, NB · 2016–\u20602020"}
      triggerLabel="Inside the degree"
      triggerHint="The university, the program and my results"
      className="role-spotlight--unb"
    >
      <section className="unb-hero">
        <div className="unb-hero-copy">
          <SpotlightReveal delay={0}>
            <Eyebrow>Inside the degree</Eyebrow>
          </SpotlightReveal>
          <SpotlightReveal delay={70}>
            <h3 className="unb-display">Finance, learned by doing.</h3>
          </SpotlightReveal>
          <SpotlightReveal delay={150}>
            <p className="unb-lede">
              I earned a Bachelor of Business Administration in Finance at UNB Saint John from 2016 to 2020, with 5
              academic awards worth $47,500 in scholarships. Outside class I joined the co-op program and the UNB Finance
              Club, and was a portfolio manager in UNB&rsquo;s Student Investment Fund, which invests real money.
            </p>
          </SpotlightReveal>
          <SpotlightReveal delay={220}>
            <div className="unb-actions">
              <button type="button" className="unb-button" onClick={showDegree}>
                See my degree
                <span aria-hidden="true" className="unb-button-chevron">
                  ›
                </span>
              </button>
              <a href={UNB_URL} target="_blank" rel="noopener noreferrer" className="unb-button unb-button-outline">
                Visit UNB
              </a>
            </div>
          </SpotlightReveal>
        </div>
        <SpotlightReveal delay={140} className="unb-hero-visual">
          <CoursesVisual areas={courseAreas} total={total} finance={financeCourses.length} />
        </SpotlightReveal>
      </section>

      <section className="unb-band" aria-labelledby="unb-university-title">
        <div className="unb-band-inner">
          <SpotlightReveal>
            <Eyebrow light>University of New Brunswick</Eyebrow>
            <h3 id="unb-university-title" className="unb-heading is-light">
              Daring to be wise since 1785.
            </h3>
          </SpotlightReveal>
          <dl className="unb-stats">
            <SpotlightReveal delay={60} className="unb-stat">
              <dt className="unb-stat-label">founded, making UNB Canada&rsquo;s oldest English-language university</dt>
              <dd className="unb-stat-value">1785</dd>
            </SpotlightReveal>
            {university.map((item, index) => (
              <SpotlightReveal key={item.label} delay={130 + index * 70} className="unb-stat">
                <dt className="unb-stat-label">{item.label}</dt>
                <dd className="unb-stat-value">
                  <SpotlightCountUp
                    to={item.to}
                    prefix={item.prefix}
                    suffix={item.suffix}
                    decimals={item.decimals}
                    delay={190 + index * 70}
                  />
                </dd>
              </SpotlightReveal>
            ))}
          </dl>
          <SpotlightReveal delay={140}>
            <p className="unb-band-note">
              UNB&rsquo;s motto is <i lang="la">Sapere aude</i>, &ldquo;Dare to be wise.&rdquo; Its Saint John campus,
              where I studied, opened in 1964, and its Faculty of Business earned AACSB International accreditation in
              2022, a mark held by fewer than 6% of the world&rsquo;s business schools.
            </p>
          </SpotlightReveal>
        </div>
      </section>

      <section ref={degreeRef} className="unb-section unb-degree" aria-labelledby="unb-degree-title">
        <SpotlightReveal>
          <Eyebrow>My degree</Eyebrow>
          <h3 id="unb-degree-title" className="unb-heading">
            Theory in class, practice in the market.
          </h3>
        </SpotlightReveal>
        <SpotlightReveal delay={80}>
          <Workflow />
        </SpotlightReveal>
        <dl className="unb-results">
          {[
            { to: 5, label: "academic awards" },
            { to: 47500, prefix: "$", label: "in scholarships" },
            { to: total, label: "courses completed" },
          ].map((figure, index) => (
            <SpotlightReveal key={figure.label} delay={80 + index * 90} className="unb-result">
              <dt className="unb-result-label">{figure.label}</dt>
              <dd className="unb-result-value">
                <SpotlightCountUp to={figure.to} prefix={figure.prefix} delay={160 + index * 90} />
              </dd>
            </SpotlightReveal>
          ))}
        </dl>
      </section>

      <section className="unb-courses" aria-labelledby="unb-courses-title">
        <div className="unb-courses-inner">
          <SpotlightReveal>
            <Eyebrow>Coursework</Eyebrow>
            <h3 id="unb-courses-title" className="unb-heading">
              {total} courses across {courseAreas.length} areas.
            </h3>
            <p className="unb-section-lede">
              A full business foundation, from statistics and economics to law and communications, built around finance.
            </p>
          </SpotlightReveal>
          <div className="unb-courses-grid">
            <SpotlightReveal delay={60}>
              <CourseBars areas={courseAreas} />
            </SpotlightReveal>
            <SpotlightReveal delay={140} className="unb-major">
              <p className="unb-major-head">Finance, my major</p>
              <ul className="unb-major-list">
                {financeCourses.map((course) => (
                  <li key={course}>{course}</li>
                ))}
              </ul>
            </SpotlightReveal>
          </div>
        </div>
      </section>

      <section className="unb-section unb-sif" aria-labelledby="unb-sif-title">
        <SpotlightReveal>
          <Eyebrow>Student Investment Fund</Eyebrow>
          <h3 id="unb-sif-title" className="unb-heading">
            Real money, real decisions.
          </h3>
          <p className="unb-section-lede">
            In UNB&rsquo;s Student Investment Fund, students research the markets and drive investment decisions
            alongside professional portfolio managers. I was one of its portfolio managers.
          </p>
        </SpotlightReveal>
        <dl className="unb-growth">
          <SpotlightReveal delay={60} className="unb-growth-item">
            <dt className="unb-growth-label">the fund&rsquo;s starting capital in 1998</dt>
            <dd className="unb-growth-value">$1M</dd>
          </SpotlightReveal>
          <SpotlightReveal delay={150} className="unb-growth-item is-now">
            <dt className="unb-growth-label">its capital by 2024, 25 years on</dt>
            <dd className="unb-growth-value">
              <SpotlightCountUp to={14} prefix="$" suffix="M+" delay={260} />
            </dd>
          </SpotlightReveal>
        </dl>
        <SpotlightReveal delay={120}>
          <p className="unb-sif-note">
            SIF students are the first Canadian winners of the CFA Institute North American Research Challenge.
          </p>
        </SpotlightReveal>
      </section>

      <SpotlightReveal>
        <footer className="unb-footer">
          <p>
            University facts come from unb.ca (2026). My degree, awards and courses are my own, from 2016 to 2020.
          </p>
          <a href={UNB_URL} target="_blank" rel="noopener noreferrer" className="unb-link">
            Visit UNB
            <span aria-hidden="true"> ›</span>
          </a>
        </footer>
      </SpotlightReveal>
    </RoleSpotlight>
  );
}
