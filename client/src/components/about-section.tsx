import {
  SCROLL_REVEAL_OBSERVER_OPTIONS,
  getScrollRevealStyle,
  useScrollAnimation,
  useStaggeredScrollAnimation,
} from "@/hooks/useScrollAnimation";
import { useRef, useState, type ReactNode, type Ref } from "react";
import { useCounterAnimation } from "@/hooks/use-counter-animation";
import { Eye } from "lucide-react";
import universityLogo from "@assets/University_of_New_Brunswick_Logo.svg_1755912478863.png";
import { getCertificateAsset } from "@/lib/certificates";
import { CertificateModal, preloadCertificateImage, type CertificateModalCert } from "@/components/certificate-modal";
import { LazySpotlight } from "@/components/lazy-spotlight";
import { loadUnbSpotlight } from "@/components/spotlight-loaders";
import { spotlightTriggers } from "@/components/spotlight-triggers";

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
      <div className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3 ${className}`}>
        {prefix}{count.toLocaleString()}{suffix}
      </div>
      <div className="text-muted-foreground font-medium">{label}</div>
    </div>
  );
}

type EducationEntry = {
  institution: string;
  websiteUrl: string;
  location: string;
  degree: string;
  major: string;
  year: string;
};

type CourseCategory = { title: string; courses: string[] };

export default function EducationSection() {
  const sectionAnimation = useScrollAnimation(SCROLL_REVEAL_OBSERVER_OPTIONS);
  const headerAnimation = useScrollAnimation({
    ...SCROLL_REVEAL_OBSERVER_OPTIONS,
    threshold: 0.18,
    delay: 60,
  });

  const [activeCert, setActiveCert] = useState<CertificateModalCert | null>(null);
  const unbCardRef = useRef<HTMLDivElement>(null);

  const unbEducation: EducationEntry = {
    institution: "University of New Brunswick",
    websiteUrl: "https://www.unb.ca/",
    location: "Saint John, NB",
    degree: "Bachelor of Business Administration",
    major: "Finance",
    year: "2016–2020",
  };

  const unbAchievements = [
    "5 Academic Awards totalling $47,500 in scholarships",
    "Cooperative Education Program, UNB Finance Club, and Student Investment Fund Portfolio Manager",
  ];

  const unbCourseCategories: CourseCategory[] = [
    {
      title: "Finance",
      courses: ["Managerial Finance", "Corporate Finance", "Financial Markets & Institutions", "Theory of Finance", "International Financial Management", "Student Investment Fund I"],
    },
    {
      title: "Quantitative & Statistics",
      courses: ["Business Decision Analysis (I & II)", "Management Science", "Advanced Statistics for Business", "Introduction to Calculus I", "Mathematics for Business"],
    },
    {
      title: "Economics",
      courses: ["Introductory Microeconomics", "Introductory Macroeconomics", "Contemporary Issues in the Canadian Economy", "Intermediate Microeconomics"],
    },
    {
      title: "Accounting",
      courses: ["Accounting for Managers I", "Accounting Lab", "Intermediate Accounting I"],
    },
    {
      title: "Operations & Strategy",
      courses: ["Competitive Strategy", "Operations Management I"],
    },
    {
      title: "Marketing",
      courses: ["Principles of Marketing", "Marketing Management"],
    },
    {
      title: "Information Systems",
      courses: ["Introduction to Management Information Systems", "Introduction to Computer Programming I (Java)"],
    },
    {
      title: "Law & Ethics",
      courses: ["Business Ethics", "Business Law"],
    },
    {
      title: "Communications",
      courses: ["Business Communications (I & II)", "Communicating in French I"],
    },
    {
      title: "Political Science",
      courses: ["Intro to Canadian Politics", "Global Political Studies", "Politics of Globalization"],
    },
    {
      title: "Liberal Arts",
      courses: ["Introduction to Logic, Reasoning & Critical Thinking", "History of Communication"],
    },
    {
      title: "Professional Development",
      courses: ["Introduction to Organizational Behaviour", "Everything I Need to Know in First Year"],
    },
  ];

  const totalCourses = unbCourseCategories.reduce(
    (sum, category) => sum + category.courses.length,
    0,
  );

  const unbCardRevealIndex = 0;
  const highlightsRevealStartIndex = unbCardRevealIndex + 1;
  const educationItemsAnimation = useStaggeredScrollAnimation(highlightsRevealStartIndex + 3, {
    ...SCROLL_REVEAL_OBSERVER_OPTIONS,
    threshold: 0.02,
    delay: 90,
    staggerDelay: 90,
    fastStaggerDelay: 55,
  });

  const renderEducationCard = ({
    education,
    cardId,
    logo,
    logoClassName = "",
    achievements,
    revealIndex,
    cardRef,
    spotlight,
  }: {
    education: EducationEntry;
    cardId?: string;
    logo: string;
    logoClassName?: string;
    achievements: string[];
    revealIndex: number;
    cardRef?: Ref<HTMLDivElement>;
    spotlight?: ReactNode;
  }) => {
    const isVisible = educationItemsAnimation.visibleItems.has(revealIndex);
    const revealClass = isVisible ? "visible" : "";
    const educationAsset = getCertificateAsset(education.institution);

    return (
      <div
        ref={cardRef}
        id={cardId}
        className={`education-card-shell group bg-white border border-border rounded-lg p-6 transition-shadow duration-200 hover:shadow-sm scroll-slide-up ${revealClass}`}
      >
        <div className="experience-card-header mb-4">
          <div
            className={`experience-card-header-shell scroll-slide-up ${revealClass}`}
            style={getScrollRevealStyle("cardHeader")}
          >
            <div className="experience-card-logo-shell">
              <img
                src={logo}
                alt={`${education.institution} Logo`}
                className={`experience-card-logo ${logoClassName}`}
                data-spotlight-source="logo"
              />
            </div>

            <div className="experience-card-copy min-w-0">
              <div className="experience-card-title-row">
                <h3 className="text-lg font-semibold text-foreground" data-spotlight-source="title">
                  <a
                    href={education.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit ${education.institution} website`}
                  >
                    {education.institution}
                  </a>
                </h3>
                <span className="experience-card-period text-sm font-medium text-muted-foreground">
                  {education.year}
                </span>
              </div>

              <div className="flex items-start justify-between gap-3">
                <p
                  className={`experience-card-company text-base font-medium text-primary scroll-slide-up ${revealClass}`}
                  style={getScrollRevealStyle("subheading")}
                >
                  {education.degree}
                </p>
                {educationAsset ? (
                  <button
                    type="button"
                    className="shrink-0 inline-flex items-center gap-1 whitespace-nowrap rounded-sm text-xs font-medium text-primary opacity-70 transition-opacity hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
                    aria-haspopup="dialog"
                    aria-label={`View ${education.institution} diploma`}
                    onMouseEnter={() => preloadCertificateImage(educationAsset.image)}
                    onFocus={() => preloadCertificateImage(educationAsset.image)}
                    onClick={() =>
                      setActiveCert({
                        title: education.degree,
                        issuer: education.institution,
                        year: education.year,
                        image: educationAsset.image,
                        alt: educationAsset.alt,
                        logoSrc: logo,
                      })
                    }
                  >
                    <Eye size={13} aria-hidden="true" />
                    View Diploma
                  </button>
                ) : null}
              </div>
              <p
                className={`experience-card-location text-sm text-muted-foreground scroll-slide-up ${revealClass}`}
                style={getScrollRevealStyle("body", 0)}
              >
                {education.major}, {education.location}
              </p>
            </div>
          </div>
        </div>

        {achievements.length > 0 ? (
        <div>
          <h4
            className={`text-sm font-semibold text-foreground mb-2 scroll-slide-up ${revealClass}`}
            style={getScrollRevealStyle("body", 1)}
          >
            Key Achievements
          </h4>
          <div className="space-y-1.5">
            {achievements.map((item, i) => (
              <div
                key={item}
                className={`flex items-start gap-2 scroll-slide-up ${revealClass}`}
                style={getScrollRevealStyle("body", i + 2)}
              >
                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                <p className="text-sm text-muted-foreground leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>
        ) : null}

        {spotlight ? (
          <div
            className={`experience-card-spotlight scroll-slide-up ${revealClass}`}
            style={getScrollRevealStyle("body", achievements.length + 2)}
          >
            {spotlight}
          </div>
        ) : null}
      </div>
    );
  };

  return (
    <section
      ref={sectionAnimation.ref}
      id="education"
      className="py-16 sm:py-20 lg:py-24 relative overflow-hidden"
    >
      <div className="container-width">
        {/* Header */}
        <div
          ref={headerAnimation.ref}
          className={`text-center mb-12 sm:mb-16 lg:mb-20 scroll-slide-up ${headerAnimation.isVisible ? 'visible' : ''}`}
        >
          <p className="section-kicker mb-4">Academic foundation</p>
          <h2 className="mb-6 text-[2.5rem] font-semibold leading-[1.1] tracking-[-0.009em] text-foreground sm:text-[3rem] sm:leading-[1.08349] sm:tracking-[-0.003em]">
            Education
          </h2>
          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-muted-foreground sm:text-xl lg:text-2xl">
            Strategic business foundation with finance, marketing, and practical leadership coursework
          </p>
        </div>

        {/* Education Cards - matches experience card pattern */}
        <div ref={educationItemsAnimation.ref} className="space-y-6">
          {renderEducationCard({
            education: unbEducation,
            cardId: "unb-education",
            logo: universityLogo,
            achievements: unbAchievements,
            revealIndex: unbCardRevealIndex,
            cardRef: unbCardRef,
            spotlight: (
              <LazySpotlight
                load={loadUnbSpotlight}
                trigger={spotlightTriggers.unb}
                props={{ originRef: unbCardRef, logoSrc: universityLogo, courseAreas: unbCourseCategories }}
              />
            ),
          })}
        </div>

        {/* Education Highlights - UNB summary */}
        <div className="mt-12">
          <div className="bg-white border border-border rounded-lg p-8 lg:p-10">
            <h3 className="text-xl font-bold text-foreground mb-8 text-center">
              Academic Highlights
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className={`scroll-slide-up ${educationItemsAnimation.visibleItems.has(highlightsRevealStartIndex) ? 'visible' : ''}`}>
                <CounterStat end={5} label="Academic Awards" className="text-primary" delay={0} />
              </div>
              <div className={`scroll-slide-up ${educationItemsAnimation.visibleItems.has(highlightsRevealStartIndex + 1) ? 'visible' : ''}`}>
                <CounterStat end={47500} prefix="$" label="in Scholarships" className="text-primary" delay={200} />
              </div>
              <div className={`scroll-slide-up ${educationItemsAnimation.visibleItems.has(highlightsRevealStartIndex + 2) ? 'visible' : ''}`}>
                <CounterStat end={totalCourses} label="Courses Completed" className="text-primary" delay={400} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <CertificateModal
        open={activeCert !== null}
        onOpenChange={(open) => {
          if (!open) setActiveCert(null);
        }}
        cert={activeCert}
      />
    </section>
  );
}
