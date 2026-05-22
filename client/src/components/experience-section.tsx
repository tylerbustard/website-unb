import {
  SCROLL_REVEAL_OBSERVER_OPTIONS,
  getScrollRevealDelay,
  getScrollRevealStyle,
  useScrollAnimation,
  useStaggeredScrollAnimation,
} from "@/hooks/useScrollAnimation";
import { useCounterAnimation } from "@/hooks/use-counter-animation";
import { slugify } from "@/lib/utils";
import bmoLogo from "@assets/BMO_Logo.svg_1755913265896.png";
import tdLogo from "@assets/Toronto-Dominion_Bank_logo.svg_1755913265896.png";
import rbcLogo from "@assets/RBC-Logo_1755913716813.png";
import irvingLogo from "@assets/Irving_Oil.svg_1755913265895.png";
import grantThorntonLogo from "@assets/Grant_Thornton_logo_1755913265895.png";
import roiLogo from "@assets/roi_logo_icon.png";
import seventyThreeStringsLogo from "@assets/73-strings-logo.webp";

interface Experience {
  title: string;
  company: string;
  industry: string;
  location: string;
  period: string;
  duration: string;
  achievements: string[];
  technologies: string[];
  logoSrc: string;
  color: string;
}

interface CounterStatProps {
  end: number;
  suffix?: string;
  prefix?: string;
  label: string;
  className?: string;
  delay?: number;
}

function CounterStat({ end, suffix = '', prefix = '', label, className = '', delay = 0 }: CounterStatProps) {
  const { count, elementRef } = useCounterAnimation({ end, delay });

  return (
    <div className="text-center" ref={elementRef}>
      <div className={`text-4xl lg:text-5xl font-bold mb-3 ${className}`}>
        {prefix}{count}{suffix}
      </div>
      <div className="text-muted-foreground font-medium">{label}</div>
    </div>
  );
}

export default function ExperienceSection() {
  const sectionAnimation = useScrollAnimation(SCROLL_REVEAL_OBSERVER_OPTIONS);
  const headerAnimation = useScrollAnimation({
    ...SCROLL_REVEAL_OBSERVER_OPTIONS,
    threshold: 0.18,
    delay: 60,
  });

  const baseExperiences: Experience[] = [
    {
      title: "Equity Analyst",
      company: "ROI",
      industry: "Fintech",
      location: "Toronto, Ontario",
      period: "2023-2025",
      duration: "2+ years",
      achievements: [
        "Analyzed and compiled public company financial statements, cutting reporting turnaround by 13%",
        "Collaborated with product and engineering to implement AI-driven data features, boosting adoption by 12%",
      ],
      technologies: ["Financial Analysis", "AI Integration", "Data Analytics", "Python", "SQL"],
      logoSrc: roiLogo,
      color: "#00A97F",
    },
    {
      title: "Portfolio Assistant",
      company: "BMO Private Wealth",
      industry: "Financial Services",
      location: "Toronto, Ontario",
      period: "2022-2023",
      duration: "1 year",
      achievements: [
        "Advised two Investment Counsellors managing portfolios over $100M and cut preparation time by 12%",
        "Bolstered client communications, boosting response rates by 9% heightening client satisfaction and retention",
      ],
      technologies: ["Portfolio Management", "Client Relations", "Financial Analysis", "Excel"],
      logoSrc: bmoLogo,
      color: "#005EB8",
    },
    {
      title: "Financial Advisor",
      company: "TD Canada Trust",
      industry: "Financial Services",
      location: "Kingston, Ontario",
      period: "2021-2022",
      duration: "1 year",
      achievements: [
        "Cultivated strong client relationships by assessing individual financial needs, resulting in an 11% increase in sales",
        "Exceeded sales targets, achieving a top 15% performance ranking within the district",
      ],
      technologies: ["Financial Planning", "Sales", "Client Advisory", "Product Knowledge"],
      logoSrc: tdLogo,
      color: "#00AC46",
    },
    {
      title: "Banking Advisor",
      company: "Royal Bank of Canada",
      industry: "Financial Services",
      location: "Kingston, Ontario",
      period: "2020-2021",
      duration: "1 year",
      achievements: [
        "Strengthened client relationships by advising on personalized solutions, increased repeat transactions by 13%",
        "Excelled in needs-based advising, boosting adoption of core products like GICs, mutual funds, and TFSAs by 8%",
      ],
      technologies: ["Banking Products", "Financial Advisory", "Client Relationship Management", "Digital Banking"],
      logoSrc: rbcLogo,
      color: "#005DAA",
    },
    {
      title: "Client Advisor Intern",
      company: "Royal Bank of Canada",
      industry: "Financial Services",
      location: "Fredericton, New Brunswick",
      period: "2019-2020",
      duration: "1 year",
      achievements: [
        "Resolved complex client issues, achieving a 15% boost in positive feedback scores for the branch",
        "Promoted RBC's digital banking tools, leading to a 10% increase in online and mobile banking adoption",
      ],
      technologies: ["Client Service", "Digital Banking", "Problem Resolution", "Customer Support"],
      logoSrc: rbcLogo,
      color: "#005DAA",
    },
    {
      title: "Marketing Intern",
      company: "Irving Oil Limited",
      industry: "Energy",
      location: "Saint John, New Brunswick",
      period: "2018",
      duration: "4 months",
      achievements: [
        "Conducted competitor analysis driving insights that improved targeted marketing by 11%",
        "Developed a Customer Lifecycle model that increased targeted promotions, boosting customer engagement by 8%",
      ],
      technologies: ["Market Research", "Customer Analytics", "Competitive Analysis", "Marketing Strategy"],
      logoSrc: irvingLogo,
      color: "#FF6B35",
    },
    {
      title: "Tax Return Intern",
      company: "Grant Thornton LLP",
      industry: "Professional Services",
      location: "Saint John, New Brunswick",
      period: "2018",
      duration: "5 months",
      achievements: [
        "Streamlined client financial data, boosting accuracy by 10% ensuring timely submission of 100+ tax returns",
        "Improved tax return preparation processes, cutting filing errors by 15%",
      ],
      technologies: ["Tax Preparation", "Financial Analysis", "Data Management", "Client Service"],
      logoSrc: grantThorntonLogo,
      color: "#8B5CF6",
    },
  ];

  const seventyThreeStringsExperience: Experience = {
    title: "Senior Associate, Portfolio Monitoring",
    company: "73 Strings",
    industry: "Fintech",
    location: "Toronto, Ontario",
    period: "Jan 2025 - May 2026",
    duration: "1 yr 5 mos",
    achievements: [
      "Monitored daily NAV inputs and validated holdings and cash flows, supporting accurate fund valuations across 15+ portfolios",
      "Reviewed reconciliation workflows and investigated exceptions, reducing resolution time by 18% through streamlined communication with operations risk and portfolio managers",
    ],
    technologies: ["Portfolio Monitoring", "Reconciliation", "NAV Validation", "SQL", "Excel"],
    logoSrc: seventyThreeStringsLogo,
    color: "#1e5ba8",
  };

  const experiences: Experience[] = [seventyThreeStringsExperience, ...baseExperiences];
  const currentYear = new Date().getFullYear();
  const startYears = experiences
    .map((experience) => Number.parseInt(experience.period.slice(0, 4), 10))
    .filter((year) => Number.isFinite(year));
  const firstExperienceYear = Math.min(...startYears);
  const yearsExperience = Math.max(1, currentYear - firstExperienceYear);
  const companyCount = new Set(experiences.map((experience) => experience.company)).size;
  const industryCount = new Set(experiences.map((experience) => experience.industry)).size;
  const cardsAnimation = useStaggeredScrollAnimation(experiences.length, {
    ...SCROLL_REVEAL_OBSERVER_OPTIONS,
    threshold: 0.1,
    delay: 90,
    staggerDelay: 90,
    fastStaggerDelay: 55,
  });
  const summaryAnimation = useStaggeredScrollAnimation(3, {
    ...SCROLL_REVEAL_OBSERVER_OPTIONS,
    threshold: 0.16,
    delay: 220,
    staggerDelay: 90,
    fastStaggerDelay: 55,
  });

  return (
    <section
      ref={sectionAnimation.ref}
      id="experience"
      className={`py-20 sm:py-28 lg:py-36 relative overflow-hidden scroll-fade-in ${sectionAnimation.isVisible ? 'visible' : ''}`}
    >
      <div className="container-width">
        <div
          ref={headerAnimation.ref}
          className={`text-center mb-12 sm:mb-16 lg:mb-20 scroll-slide-up ${headerAnimation.isVisible ? 'visible' : ''}`}
        >
          <p className="section-kicker mb-4">Career history</p>
          <h2 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Experience
          </h2>
          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-muted-foreground sm:text-xl lg:text-2xl">
            Professional experience in finance, banking and accounting
          </p>
        </div>

        {/* Experience Cards */}
        <div ref={cardsAnimation.ref} className="space-y-6">
            {experiences.map((exp, index) => (
              <div
                key={index}
                id={`experience-${slugify(exp.company)}-${slugify(exp.title)}`}
                data-testid={`experience-${index}`}
              >
                {(() => {
                  const isCardVisible = cardsAnimation.visibleItems.has(index);
                  const revealClass = isCardVisible ? 'visible' : '';
                  const achievementsHeadingDelay = getScrollRevealDelay('body', 1);
                  const competenciesHeadingDelay = getScrollRevealDelay('body', exp.achievements.length + 2);
                  const chipStartDelay = competenciesHeadingDelay + 90;

                  return (
                <div
                  className={`experience-card-shell scroll-slide-up ${revealClass}`}
                >
                  <div className="experience-card-surface group bg-white border border-border rounded-lg p-6 transition-shadow duration-200 hover:shadow-sm">
                    {/* Header */}
                    <div className="experience-card-header mb-4">
                      <div
                        className={`experience-card-header-shell scroll-slide-up ${revealClass}`}
                        style={getScrollRevealStyle('cardHeader')}
                      >
                        <div className="experience-card-logo-shell">
                          <img
                            src={exp.logoSrc}
                            alt={`${exp.company} Logo`}
                            className="experience-card-logo"
                          />
                        </div>

                        <div className="experience-card-copy min-w-0">
                          <div className="experience-card-title-row">
                            <h3 className="text-lg font-semibold text-foreground">{exp.title}</h3>
                            <span className="experience-card-period text-sm font-medium text-muted-foreground">
                              {exp.period}
                            </span>
                          </div>

                          <p
                            className={`experience-card-company text-base font-medium text-primary scroll-slide-up ${revealClass}`}
                            style={getScrollRevealStyle('subheading')}
                          >
                            {exp.company}
                          </p>
                          <p
                            className={`experience-card-location text-sm text-muted-foreground scroll-slide-up ${revealClass}`}
                            style={getScrollRevealStyle('body', 0)}
                          >
                            {exp.location}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Achievements */}
                    <div className="mb-4">
                      <h4
                        className={`text-sm font-semibold text-foreground mb-2 scroll-slide-up ${revealClass}`}
                        style={getScrollRevealStyle('body', 1)}
                      >
                        Key Achievements
                      </h4>
                      <div className="space-y-1.5">
                        {exp.achievements.map((achievement, i) => (
                          <div
                            key={i}
                            className={`flex items-start gap-2 scroll-slide-up ${revealClass}`}
                            style={getScrollRevealStyle('body', i + 2)}
                          >
                            <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                            <p className="text-sm text-muted-foreground leading-relaxed">{achievement}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* Competencies */}
                    <div>
                      <h4
                        className={`text-sm font-semibold text-foreground mb-2 scroll-slide-up ${revealClass}`}
                        style={getScrollRevealStyle(competenciesHeadingDelay)}
                      >
                        Core Competencies
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {exp.technologies.map((tech, i) => (
                          <span
                            key={i}
                            className={`bg-slate-50 text-slate-700 border border-border/60 px-2.5 py-1 rounded-md text-xs font-medium scroll-slide-up ${revealClass}`}
                            style={getScrollRevealStyle(chipStartDelay + i * 65)}
                            data-testid={`tech-${index}-${i}`}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                  );
                })()}
              </div>
            ))}
        </div>

        {/* Career Summary */}
        <div className="mt-12" ref={summaryAnimation.ref}>
          <div className="bg-white border border-border rounded-lg p-8 lg:p-10">
            <h3 className="text-xl font-bold text-foreground mb-8 text-center">
              Career Highlights
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className={`scroll-slide-up ${summaryAnimation.visibleItems.has(0) ? 'visible' : ''}`}>
                <CounterStat end={yearsExperience} suffix="+" label="Years Experience" className="text-sky-700" delay={0} />
              </div>
              <div className={`scroll-slide-up ${summaryAnimation.visibleItems.has(1) ? 'visible' : ''}`}>
                <CounterStat end={companyCount} label="Companies" className="text-emerald-700" delay={200} />
              </div>
              <div className={`scroll-slide-up ${summaryAnimation.visibleItems.has(2) ? 'visible' : ''}`}>
                <CounterStat end={industryCount} label="Industries" className="text-amber-600" delay={400} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
