import {
  SCROLL_REVEAL_OBSERVER_OPTIONS,
  getScrollRevealDelay,
  getScrollRevealStyle,
  useScrollAnimation,
  useStaggeredScrollAnimation,
} from "@/hooks/useScrollAnimation";
import { useState, type Ref } from "react";
import { useCounterAnimation } from "@/hooks/use-counter-animation";
import {
  BookOpen,
  BriefcaseBusiness,
  Eye,
  Globe2,
  Landmark,
  Megaphone,
  MessagesSquare,
  MonitorCog,
  ReceiptText,
  Scale,
  Sigma,
  TrendingUp,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import universityLogo from "@assets/University_of_New_Brunswick_Logo.svg_1755912478863.png";
import nccLogo from "@assets/northeast_christian_college_logo.png";
import { getCertificateAsset } from "@/lib/certificates";
import { CertificateModal, type CertificateModalCert } from "@/components/certificate-modal";

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
        {prefix}{count.toLocaleString()}{suffix}
      </div>
      <div className="text-muted-foreground font-medium">{label}</div>
    </div>
  );
}

type EducationEntry = {
  institution: string;
  location: string;
  degree: string;
  major: string;
  year: string;
};

type CourseCategory = { title: string; icon: LucideIcon; courses: string[] };

export default function EducationSection() {
  const sectionAnimation = useScrollAnimation(SCROLL_REVEAL_OBSERVER_OPTIONS);
  const headerAnimation = useScrollAnimation({
    ...SCROLL_REVEAL_OBSERVER_OPTIONS,
    threshold: 0.18,
    delay: 60,
  });

  const [activeCert, setActiveCert] = useState<CertificateModalCert | null>(null);

  const unbEducation: EducationEntry = {
    institution: "University of New Brunswick",
    location: "Saint John, New Brunswick",
    degree: "Bachelor of Business Administration",
    major: "Major in Finance",
    year: "2016-2020",
  };

  const nccEducation: EducationEntry = {
    institution: "Northeast Christian College",
    location: "Fredericton, New Brunswick",
    degree: "Theology Program",
    major: "Major in Theology",
    year: "2014-2015",
  };

  const unbAchievements = [
    "Analyst and Portfolio Manager, University of New Brunswick Student Investment Fund",
    "UNB Finance Club, RBC Student Ambassador, Accredited Co-op Program",
    "5 Academic Awards totalling $47,500 in scholarships and alumni awards for merit and leadership",
    "RBC Student Ambassador of the Month, February 2020",
  ];

  const nccAchievements = [
    "Major in Theology with coursework across biblical studies, ministry, leadership, communication, Christian ethics, language, and practical skills",
    "Campus and ministry exposure included weekend ministry, chapel service, student council, social committees, and annual benefit concert pathways",
    "Built practical communication, event coordination, promotion, and leadership experience through campus initiatives",
    "Completed applied ministry preparation through personal evangelism, preaching, prayer, teacher training, and youth worker seminar coursework",
  ];

  const unbCourseCategories: CourseCategory[] = [
    {
      title: "Finance",
      icon: Landmark,
      courses: ["Managerial Finance", "Corporate Finance", "Financial Markets & Institutions", "Theory of Finance", "International Financial Management", "Student Investment Fund I"],
    },
    {
      title: "Quantitative & Statistics",
      icon: Sigma,
      courses: ["Business Decision Analysis (I & II)", "Management Science", "Advanced Statistics for Business", "Introduction to Calculus I", "Mathematics for Business"],
    },
    {
      title: "Economics",
      icon: TrendingUp,
      courses: ["Introductory Microeconomics", "Introductory Macroeconomics", "Contemporary Issues in the Canadian Economy", "Intermediate Microeconomics"],
    },
    {
      title: "Accounting",
      icon: ReceiptText,
      courses: ["Accounting for Managers I", "Accounting Lab", "Intermediate Accounting I"],
    },
    {
      title: "Operations & Strategy",
      icon: Workflow,
      courses: ["Competitive Strategy", "Operations Management I"],
    },
    {
      title: "Marketing",
      icon: Megaphone,
      courses: ["Principles of Marketing", "Marketing Management"],
    },
    {
      title: "Information Systems",
      icon: MonitorCog,
      courses: ["Introduction to Management Information Systems", "Introduction to Computer Programming I (Java)"],
    },
    {
      title: "Law & Ethics",
      icon: Scale,
      courses: ["Business Ethics", "Business Law"],
    },
    {
      title: "Communications",
      icon: MessagesSquare,
      courses: ["Business Communications (I & II)", "Communicating in French I"],
    },
    {
      title: "Political Science",
      icon: Globe2,
      courses: ["Intro to Canadian Politics", "Global Political Studies", "Politics of Globalization"],
    },
    {
      title: "Liberal Arts",
      icon: BookOpen,
      courses: ["Introduction to Logic, Reasoning & Critical Thinking", "History of Communication"],
    },
    {
      title: "Professional Development",
      icon: BriefcaseBusiness,
      courses: ["Introduction to Organizational Behaviour", "Everything I Need to Know in First Year"],
    },
  ];

  const nccCourseCategories: CourseCategory[] = [
    {
      title: "Biblical Studies",
      icon: BookOpen,
      courses: ["Old Testament Survey", "New Testament Survey", "Bible Doctrine", "Bible Study Methods", "Bible Geography", "Hermeneutics"],
    },
    {
      title: "Ministry & Evangelism",
      icon: Landmark,
      courses: ["Missiology", "Personal Evangelism", "Personal Ministry", "Preaching", "Prayer", "Evangelism", "Teacher Training", "Youth Worker Seminar"],
    },
    {
      title: "Leadership & Community",
      icon: Globe2,
      courses: ["Leadership", "Social Science", "Men's Ministry", "Women's Ministry"],
    },
    {
      title: "Communication & Music",
      icon: MessagesSquare,
      courses: ["English", "Chorale", "Playing By Ear I", "Year Book"],
    },
    {
      title: "Practical Skills",
      icon: MonitorCog,
      courses: ["Personal Finance", "Microsoft Excel", "Time Management", "Marketing & Promotion"],
    },
    {
      title: "Language & Ethics",
      icon: Scale,
      courses: ["Elementary Greek", "Christian Ethics"],
    },
  ];

  const buildCourseColumns = (categories: CourseCategory[], leftColumnTitles: Set<string>) => [
    categories.filter((category) => leftColumnTitles.has(category.title)),
    categories.filter((category) => !leftColumnTitles.has(category.title)),
  ];

  const buildRevealSequence = (columns: CourseCategory[][]) => [
    ...Array.from({ length: Math.max(columns[0].length, columns[1].length) }, (_, rowIndex) => [
      columns[0][rowIndex]?.title,
      columns[1][rowIndex]?.title,
    ]).flat().filter(Boolean),
  ] as string[];

  const unbLeftColumnCourseTitles = new Set([
    "Finance",
    "Economics",
    "Operations & Strategy",
    "Information Systems",
    "Communications",
    "Liberal Arts",
  ]);

  const nccLeftColumnCourseTitles = new Set([
    "Biblical Studies",
    "Leadership & Community",
    "Practical Skills",
  ]);

  const unbCourseColumns = buildCourseColumns(unbCourseCategories, unbLeftColumnCourseTitles);
  const nccCourseColumns = buildCourseColumns(nccCourseCategories, nccLeftColumnCourseTitles);
  const totalCourses = [...unbCourseCategories, ...nccCourseCategories].reduce(
    (sum, category) => sum + category.courses.length,
    0,
  );

  const unbEducationRevealSequence = buildRevealSequence(unbCourseColumns);
  const nccEducationRevealSequence = buildRevealSequence(nccCourseColumns);
  const unbCardRevealIndex = 0;
  const unbCourseRevealStartIndex = 1;
  const nccCardRevealIndex = unbCourseRevealStartIndex + unbEducationRevealSequence.length;
  const nccCourseRevealStartIndex = nccCardRevealIndex + 1;
  const highlightsRevealStartIndex = nccCourseRevealStartIndex + nccEducationRevealSequence.length;
  const unbEducationRevealOrder = new Map(
    unbEducationRevealSequence.map((title, index) => [title, unbCourseRevealStartIndex + index]),
  );
  const nccEducationRevealOrder = new Map(
    nccEducationRevealSequence.map((title, index) => [title, nccCourseRevealStartIndex + index]),
  );
  const educationItemsAnimation = useStaggeredScrollAnimation(highlightsRevealStartIndex + 3, {
    ...SCROLL_REVEAL_OBSERVER_OPTIONS,
    threshold: 0.02,
    delay: 90,
    staggerDelay: 90,
    fastStaggerDelay: 55,
  });

  const renderEducationCard = ({
    education,
    logo,
    logoClassName = "",
    achievements,
    courseColumns,
    revealIndex,
    revealOrder,
    cardRef,
  }: {
    education: EducationEntry;
    logo: string;
    logoClassName?: string;
    achievements: string[];
    courseColumns: CourseCategory[][];
    revealIndex: number;
    revealOrder: Map<string, number>;
    cardRef?: Ref<HTMLDivElement>;
  }) => {
    const isVisible = educationItemsAnimation.visibleItems.has(revealIndex);
    const revealClass = isVisible ? "visible" : "";
    const courseworkHeadingDelay = getScrollRevealDelay("body", achievements.length + 2);
    const courseworkCopyDelay = courseworkHeadingDelay + 90;
    const educationAsset = getCertificateAsset(education.institution);

    return (
      <div
        ref={cardRef}
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
              />
            </div>

            <div className="experience-card-copy min-w-0">
              <div className="experience-card-title-row">
                <h3 className="text-lg font-semibold text-foreground">{education.institution}</h3>
                <div className="flex flex-col items-end gap-0.5">
                  <span className="experience-card-period text-sm font-medium text-muted-foreground">
                    {education.year}
                  </span>
                  {educationAsset ? (
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 rounded-sm text-xs font-medium text-primary transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
                      aria-haspopup="dialog"
                      aria-label={`View ${education.institution} diploma`}
                      onClick={() =>
                        setActiveCert({
                          title: education.degree,
                          issuer: education.institution,
                          year: education.year,
                          image: educationAsset.image,
                          alt: educationAsset.alt,
                        })
                      }
                    >
                      <Eye size={13} aria-hidden="true" />
                      View Diploma
                    </button>
                  ) : null}
                </div>
              </div>

              <p
                className={`experience-card-company text-base font-medium text-primary scroll-slide-up ${revealClass}`}
                style={getScrollRevealStyle("subheading")}
              >
                {education.degree}
              </p>
              <p
                className={`experience-card-location text-sm text-muted-foreground scroll-slide-up ${revealClass}`}
                style={getScrollRevealStyle("body", 0)}
              >
                {education.major}, {education.location}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-4">
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

        <div className="mt-5 border-t border-border/50 pt-5">
          <div className="mb-4">
            <h4
              className={`text-sm font-semibold text-foreground scroll-slide-up ${revealClass}`}
              style={getScrollRevealStyle(courseworkHeadingDelay)}
            >
              Coursework
            </h4>
            <p
              className={`mt-1 text-sm text-muted-foreground scroll-slide-up ${revealClass}`}
              style={getScrollRevealStyle(courseworkCopyDelay)}
            >
              Academic areas arranged in the same grouped style as certifications, with every course listed directly.
            </p>
          </div>

          <div className="homepage-coursework-panel">
            <div className="homepage-coursework-columns">
              {courseColumns.map((column, columnIndex) => (
                <div key={`${education.institution}-course-column-${columnIndex}`} className="homepage-coursework-column">
                  {column.map((category) => {
                    const Icon = category.icon;
                    const isCategoryVisible = educationItemsAnimation.visibleItems.has(revealOrder.get(category.title) ?? -1);
                    const categoryRevealClass = isCategoryVisible ? "visible" : "";

                    return (
                      <article
                        key={`${education.institution}-${category.title}`}
                        className={`homepage-coursework-area scroll-slide-up ${categoryRevealClass}`}
                      >
                        <div className="homepage-coursework-area-header">
                          <div
                            className={`homepage-coursework-area-heading scroll-slide-up ${categoryRevealClass}`}
                            style={getScrollRevealStyle("cardHeader")}
                          >
                            <span className="homepage-coursework-area-icon" aria-hidden="true">
                              <Icon size={15} strokeWidth={1.9} />
                            </span>
                            <h5 className="homepage-coursework-area-title">{category.title}</h5>
                          </div>
                        </div>

                        <ul className="homepage-coursework-list">
                          {category.courses.map((course, courseIndex) => (
                            <li
                              key={`${category.title}-${course}`}
                              className={`homepage-coursework-item scroll-slide-up ${categoryRevealClass}`}
                              style={getScrollRevealStyle("body", courseIndex)}
                            >
                              {course}
                            </li>
                          ))}
                        </ul>
                      </article>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section
      ref={sectionAnimation.ref}
      id="education"
      className="py-20 sm:py-28 lg:py-36 relative overflow-hidden bg-slate-50/50"
    >
      <div className="container-width">
        {/* Header */}
        <div
          ref={headerAnimation.ref}
          className={`text-center mb-12 sm:mb-16 lg:mb-20 scroll-slide-up ${headerAnimation.isVisible ? 'visible' : ''}`}
        >
          <p className="section-kicker mb-4">Academic foundation</p>
          <h2 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Education
          </h2>
          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-muted-foreground sm:text-xl lg:text-2xl">
            Strategic business foundation with finance, marketing, and practical leadership coursework
          </p>
        </div>

        {/* Education Cards — matches experience card pattern */}
        <div ref={educationItemsAnimation.ref} className="space-y-6 lg:space-y-8">
          {renderEducationCard({
            education: unbEducation,
            logo: universityLogo,
            achievements: unbAchievements,
            courseColumns: unbCourseColumns,
            revealIndex: unbCardRevealIndex,
            revealOrder: unbEducationRevealOrder,
          })}
          {renderEducationCard({
            education: nccEducation,
            logo: nccLogo,
            logoClassName: "experience-card-logo--ncc",
            achievements: nccAchievements,
            courseColumns: nccCourseColumns,
            revealIndex: nccCardRevealIndex,
            revealOrder: nccEducationRevealOrder,
          })}
        </div>

        {/* Education Highlights — matches other sections */}
        <div className="mt-12">
          <div className="bg-white border border-border rounded-lg p-8 lg:p-10">
            <h3 className="text-xl font-bold text-foreground mb-8 text-center">
              Education Highlights
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className={`scroll-slide-up ${educationItemsAnimation.visibleItems.has(highlightsRevealStartIndex) ? 'visible' : ''}`}>
                <CounterStat end={5} label="Academic Awards" className="text-sky-700" delay={0} />
              </div>
              <div className={`scroll-slide-up ${educationItemsAnimation.visibleItems.has(highlightsRevealStartIndex + 1) ? 'visible' : ''}`}>
                <CounterStat end={47500} prefix="$" label="in Scholarships" className="text-emerald-700" delay={200} />
              </div>
              <div className={`scroll-slide-up ${educationItemsAnimation.visibleItems.has(highlightsRevealStartIndex + 2) ? 'visible' : ''}`}>
                <CounterStat end={totalCourses} label="Courses Completed" className="text-amber-600" delay={400} />
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
