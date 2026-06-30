import {
  SCROLL_REVEAL_OBSERVER_OPTIONS,
  getScrollRevealDelay,
  getScrollRevealStyle,
  useScrollAnimation,
  useStaggeredScrollAnimation,
} from "@/hooks/useScrollAnimation";
import { useCounterAnimation } from "@/hooks/use-counter-animation";
import {
  BookOpen,
  BriefcaseBusiness,
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
import queensLogo from "@assets/queens_university_logo.png";
import universityLogo from "@assets/University_of_New_Brunswick_Logo.svg_1755912478863.png";
import nccLogo from "@assets/northeast_christian_college_logo.png";

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

export default function EducationSection() {
  const sectionAnimation = useScrollAnimation(SCROLL_REVEAL_OBSERVER_OPTIONS);
  const headerAnimation = useScrollAnimation({
    ...SCROLL_REVEAL_OBSERVER_OPTIONS,
    threshold: 0.18,
    delay: 60,
  });
  const rotmanCardAnimation = useScrollAnimation({
    ...SCROLL_REVEAL_OBSERVER_OPTIONS,
    threshold: 0.16,
    delay: 80,
  });

  const rotmanEducation = {
    institution: "Rotman School of Management",
    location: "Toronto, Ontario",
    degree: "University of Toronto",
    major: "Master of Business Administration",
    year: "2024 - Present",
  };
  const rotmanAchievements = [
    "Case competition track record across CIBC, TD, RBC, and SLC, including 1st Place at CIBC and 3rd Place at TD.",
    "Analyst covering the financials and real estate sectors with the Rotman Student Investment Fund.",
    "Active in the Finance, Asset Management, Business Technology, and Management Consulting Associations.",
    "Entrance Scholarship and Emerging Canadian Leadership Award totaling $25,000.",
  ];
  const rotmanCourseCategories: { title: string; icon: LucideIcon; courses: string[] }[] = [
    {
      title: "Strategic Management",
      icon: Workflow,
      courses: ["Foundations of Strategic Management"],
    },
    {
      title: "Economic Analysis & Policy",
      icon: Globe2,
      courses: ["Managerial Economics", "Economic Environment of Business"],
    },
    {
      title: "Decision Making with Models & Data",
      icon: Sigma,
      courses: ["Decision Making with Models and Data"],
    },
    {
      title: "Accounting",
      icon: ReceiptText,
      courses: ["Financial Accounting and Reporting", "Managerial Accounting"],
    },
    {
      title: "Finance",
      icon: Landmark,
      courses: ["Finance I: Global Markets and Valuation", "Finance II: Corporate Finance"],
    },
    {
      title: "Operations & Statistics",
      icon: MonitorCog,
      courses: ["Operations Management", "Statistics for Management"],
    },
    {
      title: "Marketing",
      icon: Megaphone,
      courses: ["Managing Customer Value"],
    },
    {
      title: "Leadership, Teams & Ethics",
      icon: MessagesSquare,
      courses: [
        "Business Ethics",
        "Leveraging Diverse Teams",
        "Leading People in Organizations",
      ],
    },
  ];
  const rotmanLeftColumnCourseTitles = new Set([
    "Strategic Management",
    "Decision Making with Models & Data",
    "Finance",
    "Marketing",
  ]);
  const rotmanCourseColumns = [
    rotmanCourseCategories.filter((category) => rotmanLeftColumnCourseTitles.has(category.title)),
    rotmanCourseCategories.filter((category) => !rotmanLeftColumnCourseTitles.has(category.title)),
  ];
  const rotmanTotalCourses = rotmanCourseCategories.reduce((sum, category) => sum + category.courses.length, 0);

  const unbEducation = {
    institution: "University of New Brunswick",
    location: "Saint John, New Brunswick",
    degree: "Bachelor of Business Administration",
    major: "Major in Finance",
    year: "2016-2020",
  };

  const nccEducation = {
    institution: "Northeast Christian College",
    location: "Fredericton, New Brunswick",
    degree: "Theology Program",
    major: "Major in Theology",
    year: "2014-2015",
  };

  const achievements = [
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

  const courseCategories: { title: string; icon: LucideIcon; courses: string[] }[] = [
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
  const leftColumnCourseTitles = new Set([
    "Finance",
    "Economics",
    "Operations & Strategy",
    "Information Systems",
    "Communications",
    "Liberal Arts",
  ]);
  const courseColumns = [
    courseCategories.filter((category) => leftColumnCourseTitles.has(category.title)),
    courseCategories.filter((category) => !leftColumnCourseTitles.has(category.title)),
  ];
  const nccCourseCategories: { title: string; icon: LucideIcon; courses: string[] }[] = [
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
  const nccLeftColumnCourseTitles = new Set(["Biblical Studies", "Leadership & Community", "Practical Skills"]);
  const nccCourseColumns = [
    nccCourseCategories.filter((category) => nccLeftColumnCourseTitles.has(category.title)),
    nccCourseCategories.filter((category) => !nccLeftColumnCourseTitles.has(category.title)),
  ];
  const totalCourses = courseCategories.reduce((sum, category) => sum + category.courses.length, 0);
  const nccTotalCourses = nccCourseCategories.reduce((sum, category) => sum + category.courses.length, 0);
  const totalEducationCourses = rotmanTotalCourses + totalCourses + nccTotalCourses;
  const educationRevealSequence = [
    ...Array.from({ length: Math.max(courseColumns[0].length, courseColumns[1].length) }, (_, rowIndex) => [
      courseColumns[0][rowIndex]?.title,
      courseColumns[1][rowIndex]?.title,
    ]).flat().filter(Boolean),
  ] as string[];
  const nccEducationRevealSequence = [
    ...Array.from({ length: Math.max(nccCourseColumns[0].length, nccCourseColumns[1].length) }, (_, rowIndex) => [
      nccCourseColumns[0][rowIndex]?.title,
      nccCourseColumns[1][rowIndex]?.title,
    ]).flat().filter(Boolean),
  ] as string[];
  const educationRevealOrder = new Map(
    educationRevealSequence.map((title, index) => [title, index + 1]),
  );
  const nccCardRevealIndex = educationRevealSequence.length + 1;
  const nccCourseRevealStartIndex = nccCardRevealIndex + 1;
  const nccEducationRevealOrder = new Map(
    nccEducationRevealSequence.map((title, index) => [title, nccCourseRevealStartIndex + index]),
  );
  const highlightsRevealStartIndex = nccCourseRevealStartIndex + nccEducationRevealSequence.length;
  const educationItemsAnimation = useStaggeredScrollAnimation(highlightsRevealStartIndex + 3, {
    ...SCROLL_REVEAL_OBSERVER_OPTIONS,
    threshold: 0.14,
    delay: 90,
    staggerDelay: 90,
    fastStaggerDelay: 55,
  });

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
            Strategic business foundation with finance expertise
          </p>
        </div>

        <div className="space-y-8 sm:space-y-10">
          <div
            ref={rotmanCardAnimation.ref}
            id="rotman-education"
            className={`education-card-shell group bg-white border border-border rounded-lg p-6 transition-shadow duration-200 hover:shadow-sm scroll-slide-up ${rotmanCardAnimation.isVisible ? 'visible' : ''}`}
          >
            <div className="experience-card-header mb-4">
              <div
                className={`experience-card-header-shell scroll-slide-up ${rotmanCardAnimation.isVisible ? 'visible' : ''}`}
                style={getScrollRevealStyle('cardHeader')}
              >
                <div className="experience-card-logo-shell">
                  <img
                    src={queensLogo}
                    alt="Queen's University Logo"
                    className="experience-card-logo"
                  />
                </div>

                <div className="experience-card-copy min-w-0">
                  <div className="experience-card-title-row">
                    <h3 className="text-lg font-semibold text-foreground">{rotmanEducation.institution}</h3>
                    <span className="experience-card-period text-sm font-medium text-muted-foreground">
                      {rotmanEducation.year}
                    </span>
                  </div>

                  <p
                    className={`experience-card-company text-base font-medium text-primary scroll-slide-up ${rotmanCardAnimation.isVisible ? 'visible' : ''}`}
                    style={getScrollRevealStyle('subheading')}
                  >
                    {rotmanEducation.degree}
                  </p>
                  <p
                    className={`experience-card-location text-sm text-muted-foreground scroll-slide-up ${rotmanCardAnimation.isVisible ? 'visible' : ''}`}
                    style={getScrollRevealStyle('body', 0)}
                  >
                    {rotmanEducation.major}, {rotmanEducation.location}
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h4
                className={`text-sm font-semibold text-foreground mb-2 scroll-slide-up ${rotmanCardAnimation.isVisible ? 'visible' : ''}`}
                style={getScrollRevealStyle('body', 1)}
              >
                Key Achievements
              </h4>
              <div className="space-y-1.5">
                {rotmanAchievements.map((item, index) => (
                  <div
                    key={item}
                    className={`flex items-start gap-2 scroll-slide-up ${rotmanCardAnimation.isVisible ? 'visible' : ''}`}
                    style={getScrollRevealStyle('body', index + 2)}
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
                  className={`text-sm font-semibold text-foreground scroll-slide-up ${rotmanCardAnimation.isVisible ? 'visible' : ''}`}
                  style={getScrollRevealStyle('body', rotmanAchievements.length + 2)}
                >
                  Coursework
                </h4>
                <p
                  className={`mt-1 text-sm text-muted-foreground scroll-slide-up ${rotmanCardAnimation.isVisible ? 'visible' : ''}`}
                  style={getScrollRevealStyle('body', rotmanAchievements.length + 3)}
                >
                  Rotman MBA coursework grouped in the same direct, certification-style format used across the site.
                </p>
              </div>

              <div className="homepage-coursework-panel">
                <div className="homepage-coursework-columns">
                  {rotmanCourseColumns.map((column, columnIndex) => (
                    <div key={`rotman-course-column-${columnIndex}`} className="homepage-coursework-column">
                      {column.map((category) => {
                        const Icon = category.icon;

                        return (
                          <article
                            key={category.title}
                            className={`homepage-coursework-area scroll-slide-up ${rotmanCardAnimation.isVisible ? 'visible' : ''}`}
                            style={getScrollRevealStyle('body', rotmanAchievements.length + columnIndex + 4)}
                          >
                            <div className="homepage-coursework-area-header">
                              <div
                                className={`homepage-coursework-area-heading scroll-slide-up ${rotmanCardAnimation.isVisible ? 'visible' : ''}`}
                                style={getScrollRevealStyle('cardHeader')}
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
                                  className={`homepage-coursework-item scroll-slide-up ${rotmanCardAnimation.isVisible ? 'visible' : ''}`}
                                  style={getScrollRevealStyle('body', courseIndex)}
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

          {/* Education Card — matches experience card pattern */}
          <div
            ref={educationItemsAnimation.ref}
            id="unb-education"
            className={`education-card-shell group bg-white border border-border rounded-lg p-6 transition-shadow duration-200 hover:shadow-sm scroll-slide-up ${educationItemsAnimation.visibleItems.has(0) ? 'visible' : ''}`}
          >
            {(() => {
              const isVisible = educationItemsAnimation.visibleItems.has(0);
              const revealClass = isVisible ? 'visible' : '';
              const courseworkHeadingDelay = getScrollRevealDelay('body', achievements.length + 2);
              const courseworkCopyDelay = courseworkHeadingDelay + 90;

              return (
                <>
                  <div className="experience-card-header mb-4">
                    <div
                      className={`experience-card-header-shell scroll-slide-up ${revealClass}`}
                      style={getScrollRevealStyle('cardHeader')}
                    >
                      <div className="experience-card-logo-shell">
                        <img
                          src={universityLogo}
                          alt="University of New Brunswick Logo"
                          className="experience-card-logo"
                        />
                      </div>

                      <div className="experience-card-copy min-w-0">
                        <div className="experience-card-title-row">
                          <h3 className="text-lg font-semibold text-foreground">{unbEducation.institution}</h3>
                          <span className="experience-card-period text-sm font-medium text-muted-foreground">
                            {unbEducation.year}
                          </span>
                        </div>

                        <p
                          className={`experience-card-company text-base font-medium text-primary scroll-slide-up ${revealClass}`}
                          style={getScrollRevealStyle('subheading')}
                        >
                          {unbEducation.degree}
                        </p>
                        <p
                          className={`experience-card-location text-sm text-muted-foreground scroll-slide-up ${revealClass}`}
                          style={getScrollRevealStyle('body', 0)}
                        >
                          {unbEducation.major}, {unbEducation.location}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4
                      className={`text-sm font-semibold text-foreground mb-2 scroll-slide-up ${revealClass}`}
                      style={getScrollRevealStyle('body', 1)}
                    >
                      Key Achievements
                    </h4>
                    <div className="space-y-1.5">
                      {achievements.map((item, i) => (
                        <div
                          key={i}
                          className={`flex items-start gap-2 scroll-slide-up ${revealClass}`}
                          style={getScrollRevealStyle('body', i + 2)}
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
                          <div key={`course-column-${columnIndex}`} className="homepage-coursework-column">
                            {column.map((category) => {
                              const Icon = category.icon;
                              const isCategoryVisible = educationItemsAnimation.visibleItems.has(educationRevealOrder.get(category.title) ?? -1);
                              const categoryRevealClass = isCategoryVisible ? 'visible' : '';

                              return (
                                <article
                                  key={category.title}
                                  className={`homepage-coursework-area scroll-slide-up ${categoryRevealClass}`}
                                >
                                  <div className="homepage-coursework-area-header">
                                    <div
                                      className={`homepage-coursework-area-heading scroll-slide-up ${categoryRevealClass}`}
                                      style={getScrollRevealStyle('cardHeader')}
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
                                        style={getScrollRevealStyle('body', courseIndex)}
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
                </>
              );
            })()}
          </div>

          <div
            id="ncc-education"
            className={`education-card-shell group bg-white border border-border rounded-lg p-6 transition-shadow duration-200 hover:shadow-sm scroll-slide-up ${educationItemsAnimation.visibleItems.has(nccCardRevealIndex) ? 'visible' : ''}`}
          >
            {(() => {
              const isVisible = educationItemsAnimation.visibleItems.has(nccCardRevealIndex);
              const revealClass = isVisible ? 'visible' : '';
              const courseworkHeadingDelay = getScrollRevealDelay('body', nccAchievements.length + 2);
              const courseworkCopyDelay = courseworkHeadingDelay + 90;

              return (
                <>
                  <div className="experience-card-header mb-4">
                    <div
                      className={`experience-card-header-shell scroll-slide-up ${revealClass}`}
                      style={getScrollRevealStyle('cardHeader')}
                    >
                      <div className="experience-card-logo-shell">
                        <img
                          src={nccLogo}
                          alt="Northeast Christian College Logo"
                          className="experience-card-logo experience-card-logo--ncc"
                        />
                      </div>

                      <div className="experience-card-copy min-w-0">
                        <div className="experience-card-title-row">
                          <h3 className="text-lg font-semibold text-foreground">{nccEducation.institution}</h3>
                          <span className="experience-card-period text-sm font-medium text-muted-foreground">
                            {nccEducation.year}
                          </span>
                        </div>

                        <p
                          className={`experience-card-company text-base font-medium text-primary scroll-slide-up ${revealClass}`}
                          style={getScrollRevealStyle('subheading')}
                        >
                          {nccEducation.degree}
                        </p>
                        <p
                          className={`experience-card-location text-sm text-muted-foreground scroll-slide-up ${revealClass}`}
                          style={getScrollRevealStyle('body', 0)}
                        >
                          {nccEducation.major}, {nccEducation.location}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4
                      className={`text-sm font-semibold text-foreground mb-2 scroll-slide-up ${revealClass}`}
                      style={getScrollRevealStyle('body', 1)}
                    >
                      Key Achievements
                    </h4>
                    <div className="space-y-1.5">
                      {nccAchievements.map((item, i) => (
                        <div
                          key={i}
                          className={`flex items-start gap-2 scroll-slide-up ${revealClass}`}
                          style={getScrollRevealStyle('body', i + 2)}
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
                        {nccCourseColumns.map((column, columnIndex) => (
                          <div key={`${nccEducation.institution}-course-column-${columnIndex}`} className="homepage-coursework-column">
                            {column.map((category) => {
                              const Icon = category.icon;
                              const isCategoryVisible = educationItemsAnimation.visibleItems.has(nccEducationRevealOrder.get(category.title) ?? -1);
                              const categoryRevealClass = isCategoryVisible ? 'visible' : '';

                              return (
                                <article
                                  key={`${nccEducation.institution}-${category.title}`}
                                  className={`homepage-coursework-area scroll-slide-up ${categoryRevealClass}`}
                                >
                                  <div className="homepage-coursework-area-header">
                                    <div
                                      className={`homepage-coursework-area-heading scroll-slide-up ${categoryRevealClass}`}
                                      style={getScrollRevealStyle('cardHeader')}
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
                                        style={getScrollRevealStyle('body', courseIndex)}
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
                </>
              );
            })()}
          </div>
        </div>

        {/* Education Highlights — combined Rotman + UNB summary */}
        <div className="mt-12">
          <div className="bg-white border border-border rounded-lg p-8 lg:p-10">
            <h3 className="text-xl font-bold text-foreground mb-8 text-center">
              Academic Highlights
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className={`scroll-slide-up ${educationItemsAnimation.visibleItems.has(highlightsRevealStartIndex) ? 'visible' : ''}`}>
                <CounterStat end={7} label="Awards Across Rotman & UNB" className="text-sky-700" delay={0} />
              </div>
              <div className={`scroll-slide-up ${educationItemsAnimation.visibleItems.has(highlightsRevealStartIndex + 1) ? 'visible' : ''}`}>
                <CounterStat end={72500} prefix="$" label="Combined Scholarships" className="text-emerald-700" delay={200} />
              </div>
              <div className={`scroll-slide-up ${educationItemsAnimation.visibleItems.has(highlightsRevealStartIndex + 2) ? 'visible' : ''}`}>
                <CounterStat end={totalEducationCourses} label="Courses, Workshops & Practicums" className="text-amber-600" delay={400} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
