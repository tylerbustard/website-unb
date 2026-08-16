import {
  SCROLL_REVEAL_OBSERVER_OPTIONS,
  getScrollRevealDelay,
  getScrollRevealStyle,
  useScrollAnimation,
  useStaggeredScrollAnimation,
} from "@/hooks/useScrollAnimation";
import { useCounterAnimation } from "@/hooks/use-counter-animation";
import { slugify } from "@/lib/utils";
import { useState } from "react";
import { Eye } from "lucide-react";
import { getCertificateAsset } from "@/lib/certificates";
import { CertificateModal, preloadCertificateImage, type CertificateModalCert } from "@/components/certificate-modal";
import unitedWayLogo from "@assets/United-Way-Logo_1755913265895.png";
import rbcLogo from "@assets/rbc_logo.webp";
import irvingLogo from "@assets/Irving_Oil.svg_1755913265895.png";
import cfaLogo from "@assets/CFA_Institute_Logo_1755923720192.png";
import csiLogo from "@assets/canadian securities institute_1755923720191.png";
import wallStreetPrepLogo from "@assets/wall_street_prep_logo.webp";
import trainingTheStreetLogo from "@assets/trainning the street_1755938972014.png";
import bloombergLogo from "@assets/bloomberg_1755923720190.png";
import courseraLogo from "@assets/Coursera_1755937682843.png";
import etsLogo from "@assets/ets_logo.webp";
import anthropicLogo from "@assets/anthropic_mark.png";
import googleLogo from "@assets/google_logo.svg";

interface Certification {
  name: string;
  year: string;
  issuer: string;
  logoSrc?: string;
  logoFallback?: string;
  logoTone?: "anthropic" | "openai";
  detail?: string;
  emphasis?: boolean;
}

interface CertificationCategory {
  title: string;
  caption: string;
  certifications: Certification[];
}

// Counter components for certifications section
interface CounterStatProps {
  end: number;
  suffix?: string;
  prefix?: string;
  label: string;
  className?: string;
  labelClassName?: string;
  delay?: number;
}

function CertificationCounter({ end, suffix = '', prefix = '', label, className = '', labelClassName = 'text-muted-foreground', delay = 0 }: CounterStatProps) {
  const { count, elementRef } = useCounterAnimation({ end, delay });

  return (
    <div className="text-center" ref={elementRef}>
      <div className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3 ${className}`}>
        {prefix}{count}{suffix}
      </div>
      <div className={`text-base font-medium ${labelClassName}`}>{label}</div>
    </div>
  );
}

export default function CertificationsSection() {
  const sectionAnimation = useScrollAnimation(SCROLL_REVEAL_OBSERVER_OPTIONS);
  const headerAnimation = useScrollAnimation({
    ...SCROLL_REVEAL_OBSERVER_OPTIONS,
    threshold: 0.18,
    delay: 60,
  });

  const [activeCert, setActiveCert] = useState<CertificateModalCert | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const toggleCategory = (title: string) =>
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(title)) next.delete(title);
      else next.add(title);
      return next;
    });
  const openCertificate = (certification: Certification) => {
    const asset = getCertificateAsset(certification.name);
    if (asset) {
      setActiveCert({
        title: certification.name,
        issuer: certification.issuer,
        year: certification.year,
        image: asset.image,
        alt: asset.alt,
        logoSrc: certification.logoSrc,
      });
    }
  };

  const coreCredentials: Certification[] = [
    { name: "CFA Level I Candidate", year: "2026", issuer: "CFA Institute", logoSrc: cfaLogo },
    { name: "Discounted Cash Flow Analysis and Modeling", year: "2024", issuer: "Training The Street", logoSrc: trainingTheStreetLogo },
    { name: "Canadian Securities Course", year: "2021", issuer: "Canadian Securities Institute", logoSrc: csiLogo },
    { name: "Bloomberg Market Concepts", year: "2019", issuer: "Bloomberg", logoSrc: bloombergLogo },
    { name: "GRE General Test", year: "2024", issuer: "ETS", detail: "328 total; 170 Quantitative", logoSrc: etsLogo },
    { name: "AI Fluency: Framework and Foundations", year: "2026", issuer: "Anthropic", logoSrc: anthropicLogo },
  ];

  const certificationCategories: CertificationCategory[] = [
    {
      title: "Investment & Markets",
      caption: "CFA, valuation, and market fluency",
      certifications: [
        { name: "CFA Level I Candidate", year: "2026", issuer: "CFA Institute", emphasis: true, logoSrc: cfaLogo },
        { name: "Discounted Cash Flow Analysis and Modeling", year: "2024", issuer: "Training The Street", logoSrc: trainingTheStreetLogo },
        { name: "Financial & Valuation Modeling", year: "2020", issuer: "Wall Street Prep", logoSrc: wallStreetPrepLogo },
        { name: "Bloomberg Market Concepts", year: "2019", issuer: "Bloomberg", logoSrc: bloombergLogo },
      ],
    },
    {
      title: "Advisory & Wealth Planning",
      caption: "Licensing, suitability, and client advice",
      certifications: [
        { name: "Financial Planning 1", year: "2023", issuer: "Canadian Securities Institute", logoSrc: csiLogo },
        { name: "Certificate in Financial Services Advice", year: "2022", issuer: "Canadian Securities Institute", logoSrc: csiLogo },
        { name: "Canadian Securities Course", year: "2021", issuer: "Canadian Securities Institute", logoSrc: csiLogo },
        { name: "Personal Financial Service Advice", year: "2021", issuer: "Canadian Securities Institute", logoSrc: csiLogo },
        { name: "Investment Funds in Canada", year: "2020", issuer: "Canadian Securities Institute", logoSrc: csiLogo },
      ],
    },
    {
      title: "Quantitative & Statistical Methods",
      caption: "Modeling, inference, and mathematical foundations",
      certifications: [
        { name: "GRE General Test", year: "2024", issuer: "ETS", detail: "328 total; 170 Quantitative", logoSrc: etsLogo },
        { name: "Matrix Algebra for Engineers", year: "2024", issuer: "HKUST", logoSrc: courseraLogo },
        { name: "Introduction to Calculus", year: "2023", issuer: "University of Sydney", logoSrc: courseraLogo },
        { name: "Inferential Statistics", year: "2023", issuer: "Duke University", logoSrc: courseraLogo },
        { name: "Econometrics: Methods and Applications", year: "2022", issuer: "Erasmus University Rotterdam", logoSrc: courseraLogo },
        { name: "Machine Learning", year: "2020", issuer: "Stanford University", logoSrc: courseraLogo },
        { name: "Excel Skills for Business", year: "2020", issuer: "Macquarie University", logoSrc: courseraLogo },
      ],
    },
    {
      title: "Data & Business Intelligence",
      caption: "Analytics, visualization, and automation",
      certifications: [
        { name: "AI Fluency: Framework and Foundations", year: "2026", issuer: "Anthropic", logoSrc: anthropicLogo },
        { name: "Data Visualization with Tableau", year: "2023", issuer: "UC Davis", logoSrc: courseraLogo },
        { name: "Learn SQL Basics for Data Science", year: "2023", issuer: "UC Davis", detail: "4-course specialization", logoSrc: courseraLogo },
        { name: "Python for Everybody Specialization", year: "2022", issuer: "University of Michigan", detail: "5-course specialization", logoSrc: courseraLogo },
        { name: "Google Data Analytics Professional Certificate", year: "2021", issuer: "Google", detail: "8-course Professional Certificate", logoSrc: googleLogo },
      ],
    },
  ];

  const leftColumnCertificationTitles = new Set([
    "Investment & Markets",
    "Quantitative & Statistical Methods",
  ]);

  const certificationColumns = [
    certificationCategories.filter((category) => leftColumnCertificationTitles.has(category.title)),
    certificationCategories.filter((category) => !leftColumnCertificationTitles.has(category.title)),
  ];
  const totalCerts = certificationCategories.reduce((sum, cat) => sum + cat.certifications.length, 0);
  const organizationCount = new Set(
    certificationCategories.flatMap((category) => category.certifications.map((certification) => certification.issuer)),
  ).size;
  const certificationRevealSequence = certificationCategories.map((category) => category.title);
  const certificationRevealOrder = new Map(
    certificationRevealSequence.map((title, index) => [title, index]),
  );
  const certificationItemsAnimation = useStaggeredScrollAnimation(certificationRevealSequence.length + 3, {
    ...SCROLL_REVEAL_OBSERVER_OPTIONS,
    // The panel is far taller than a phone viewport, so a high threshold can never be
    // reached on mobile (max ratio = viewport/panel height). Keep it near zero.
    threshold: 0.02,
    delay: 90,
    staggerDelay: 90,
    fastStaggerDelay: 55,
  });

  return (
    <section
      ref={sectionAnimation.ref}
      id="certifications"
      className="py-16 sm:py-20 lg:py-24 relative overflow-hidden bg-slate-50/50"
    >
      <div className="container-width">
        {/* Header */}
        <div
          ref={headerAnimation.ref}
          className={`text-center mb-12 sm:mb-16 lg:mb-20 scroll-slide-up ${headerAnimation.isVisible ? 'visible' : ''}`}
        >
          <p className="section-kicker mb-4">Credentials</p>
          <h2 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Certifications
          </h2>
          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-muted-foreground sm:text-xl lg:text-2xl">
            Structured across investment, advisory, analytics, and quantitative training.
          </p>
        </div>

        <div
          ref={certificationItemsAnimation.ref}
          className="homepage-certifications-panel"
        >
          <div className="mb-10">
            <h3 className="resume-certification-area-title homepage-certification-area-title">Core Credentials</h3>
            <p className="resume-certification-area-caption homepage-certification-area-caption mt-1">
              Flagship finance, valuation, and assessment credentials
            </p>
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {coreCredentials.map((credential) => {
                const coreAsset = getCertificateAsset(credential.name);
                return (
                  <div
                    key={`core-${credential.name}`}
                    id={`core-cert-${slugify(credential.name)}`}
                    className={`group flex flex-col rounded-lg border border-border bg-white p-5 transition-shadow duration-200${coreAsset ? " certificate-card-viewable cursor-pointer hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2" : ""}`}
                    role={coreAsset ? "button" : undefined}
                    tabIndex={coreAsset ? 0 : undefined}
                    aria-haspopup={coreAsset ? "dialog" : undefined}
                    aria-label={coreAsset ? `View ${credential.name} certificate` : undefined}
                    onMouseEnter={coreAsset ? () => preloadCertificateImage(coreAsset.image) : undefined}
                    onFocus={coreAsset ? () => preloadCertificateImage(coreAsset.image) : undefined}
                    onClick={coreAsset ? () => openCertificate(credential) : undefined}
                    onKeyDown={coreAsset ? (event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        openCertificate(credential);
                      }
                    } : undefined}
                  >
                    <div className="flex items-start justify-between gap-3">
                      {credential.logoSrc ? (
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-white">
                          <img src={credential.logoSrc} alt="" aria-hidden="true" className="h-full w-full object-contain p-2" />
                        </span>
                      ) : null}
                      <span className="mt-0.5 text-sm font-medium text-muted-foreground">{credential.year}</span>
                    </div>
                    <p className="mt-4 min-h-[2.6em] text-[0.99rem] font-semibold leading-snug text-foreground">
                      {credential.name}
                    </p>
                    <div className="mt-2 flex items-baseline justify-between gap-3 border-t border-border/60 pt-2.5">
                      <p className="truncate text-xs text-muted-foreground">
                        {credential.issuer}
                        {credential.detail ? ` · ${credential.detail}` : ""}
                      </p>
                      {coreAsset ? (
                        <span className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-primary opacity-70 transition-opacity group-hover:opacity-100">
                          <Eye size={13} aria-hidden="true" />
                          View
                        </span>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="resume-certification-columns homepage-certification-columns">
            {certificationColumns.map((column, columnIndex) => (
              <div
                key={`homepage-certification-column-${columnIndex}`}
                className="resume-certification-column homepage-certification-column"
              >
                {column.map((category) => (
                  (() => {
                    const isCategoryVisible = certificationItemsAnimation.visibleItems.has(certificationRevealOrder.get(category.title) ?? -1);
                    const revealClass = isCategoryVisible ? 'visible' : '';

                    return (
                      <article
                        key={category.title}
                        id={`certifications-${slugify(category.title)}`}
                        className={`resume-certification-area homepage-certification-area rounded-lg border border-border bg-white p-5 transition-shadow duration-200 hover:shadow-sm scroll-slide-up ${revealClass}`}
                      >
                        <div className="resume-certification-area-header homepage-certification-area-header">
                          <div className="flex items-center justify-between gap-3">
                            <h3 className="resume-certification-area-title homepage-certification-area-title">
                              {category.title}
                            </h3>
                            <span className="rounded-full border border-border px-2 py-0.5 text-[0.66rem] font-semibold tabular-nums text-slate-500">
                              {category.certifications.length}
                            </span>
                          </div>
                          <p className="resume-certification-area-caption homepage-certification-area-caption">
                            {category.caption}
                          </p>
                        </div>

                        <div className="resume-certification-cards homepage-certification-cards">
                          {(expandedCategories.has(category.title)
                            ? category.certifications
                            : category.certifications.slice(0, 4)
                          ).map((certification, certificationIndex) => {
                            const certAsset = getCertificateAsset(certification.name);
                            return (
                            <div
                              key={`${category.title}-${certification.name}`}
                              id={`cert-${slugify(certification.name)}`}
                              className={`resume-certification-card homepage-certification-card${certAsset ? " certificate-card-viewable focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2" : ""}`}
                              style={certAsset ? { cursor: 'pointer' } : undefined}
                              role={certAsset ? "button" : undefined}
                              tabIndex={certAsset ? 0 : undefined}
                              aria-haspopup={certAsset ? "dialog" : undefined}
                              aria-label={certAsset ? `View ${certification.name} certificate` : undefined}
                              onMouseEnter={certAsset ? () => preloadCertificateImage(certAsset.image) : undefined}
                              onFocus={certAsset ? () => preloadCertificateImage(certAsset.image) : undefined}
                              onClick={certAsset ? () => openCertificate(certification) : undefined}
                              onKeyDown={certAsset ? (event) => {
                                if (event.key === "Enter" || event.key === " ") {
                                  event.preventDefault();
                                  openCertificate(certification);
                                }
                              } : undefined}
                            >
                              <div className="resume-certification-card-brand homepage-certification-card-brand">
                                {certification.logoSrc ? (
                                  <span
                                    className={`resume-certification-card-logo-shell homepage-certification-card-logo-shell${certification.logoTone ? ` resume-certification-card-logo-shell--${certification.logoTone}` : ""}`}
                                    aria-hidden="true"
                                  >
                                    <img
                                      src={certification.logoSrc}
                                      alt={certification.issuer}
                                      className="resume-certification-card-logo homepage-certification-card-logo"
                                    />
                                  </span>
                                ) : certification.logoFallback ? (
                                  <span
                                    className={`resume-certification-card-logo-shell homepage-certification-card-logo-shell resume-certification-card-logo-fallback resume-certification-card-logo-fallback--${certification.logoTone ?? "openai"}`}
                                    aria-hidden="true"
                                  >
                                    {certification.logoFallback}
                                  </span>
                                ) : null}
                                <div className="resume-certification-card-copy homepage-certification-card-copy">
                                  <p className={`resume-certification-card-title homepage-certification-card-title${certification.emphasis ? " resume-certification-card-title-emphasis" : ""}`}>
                                    {certification.name}
                                  </p>
                                  <p className="resume-certification-card-issuer homepage-certification-card-issuer">{certification.issuer}</p>
                                </div>
                              </div>

                              <div className="resume-certification-card-meta homepage-certification-card-meta">
                                {certification.year ? (
                                  <span className="resume-certification-card-year homepage-certification-card-year">{certification.year}</span>
                                ) : null}
                                {certification.detail ? (
                                  <span className="resume-certification-card-detail homepage-certification-card-detail">{certification.detail}</span>
                                ) : null}
                                {certAsset ? (
                                  <span className="cert-row-view inline-flex items-center gap-1 text-xs font-medium text-primary">
                                    <Eye size={13} aria-hidden="true" />
                                    View
                                  </span>
                                ) : null}
                              </div>
                            </div>
                            );
                          })}
                        </div>
                        {category.certifications.length > 4 ? (
                          <button
                            type="button"
                            className="mt-4 block w-full rounded-md border border-border/80 py-1.5 text-center text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                            aria-expanded={expandedCategories.has(category.title)}
                            onClick={() => toggleCategory(category.title)}
                          >
                            {expandedCategories.has(category.title)
                              ? "Show fewer"
                              : `Show all ${category.certifications.length}`}
                          </button>
                        ) : null}
                      </article>
                    );
                  })()
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Highlights */}
        <div className="mt-12">
          <div className="bg-white border border-border rounded-lg p-8 lg:p-10">
            <h3 className="text-xl font-bold text-foreground mb-8 text-center">
              Professional Development Highlights
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className={`scroll-slide-up ${certificationItemsAnimation.visibleItems.has(certificationRevealSequence.length) ? 'visible' : ''}`}>
                <CertificationCounter end={totalCerts} label="Total Certifications & Courses" className="text-primary" delay={0} />
              </div>
              <div className={`scroll-slide-up ${certificationItemsAnimation.visibleItems.has(certificationRevealSequence.length + 1) ? 'visible' : ''}`}>
                <CertificationCounter end={certificationCategories.length} label="Expertise Areas" className="text-primary" delay={200} />
              </div>
              <div className={`scroll-slide-up ${certificationItemsAnimation.visibleItems.has(certificationRevealSequence.length + 2) ? 'visible' : ''}`}>
                <CertificationCounter end={organizationCount} label="Different Organizations" className="text-primary" delay={400} />
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

// Community Impact Section Component
interface CommunityActivity {
  title: string;
  organization: string;
  websiteUrl: string;
  period: string;
  duration: string;
  location: string;
  description: string;
  achievements: string[];
  skills: string[];
  logoSrc?: string;
  color: string;
}

// Counter components for community section
function CommunityCounter({ end, suffix = '', prefix = '', label, className = '', labelClassName = 'text-muted-foreground', delay = 0 }: CounterStatProps) {
  const { count, elementRef } = useCounterAnimation({ end, delay });

  return (
    <div className="text-center" ref={elementRef}>
      <div className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3 ${className}`}>
        {prefix}{count}{suffix}
      </div>
      <div className={`text-base font-medium ${labelClassName}`}>{label}</div>
    </div>
  );
}

export function CommunitySection() {
  const communityAnimation = useScrollAnimation(SCROLL_REVEAL_OBSERVER_OPTIONS);
  const communityHeaderAnimation = useScrollAnimation({
    ...SCROLL_REVEAL_OBSERVER_OPTIONS,
    threshold: 0.18,
    delay: 60,
  });
  const { ref: communityRef, visibleItems: communityItems } = useStaggeredScrollAnimation(3, {
    ...SCROLL_REVEAL_OBSERVER_OPTIONS,
    threshold: 0.15,
    delay: 90,
    staggerDelay: 90,
    fastStaggerDelay: 55,
  });
  const communitySummaryAnimation = useStaggeredScrollAnimation(3, {
    ...SCROLL_REVEAL_OBSERVER_OPTIONS,
    threshold: 0.16,
    delay: 220,
    staggerDelay: 90,
    fastStaggerDelay: 55,
  });
  
  const communityActivities: CommunityActivity[] = [
    {
      title: "Next Gen Ambassador",
      organization: "United Way",
      websiteUrl: "https://www.unitedwaygt.org/",
      period: "2020–Present",
      duration: "6+ years",
      location: "Toronto, ON",
      description: "",
      achievements: [
        "Led a fundraising strategy that raised 20% more funds over three years",
        "Drove engagement initiatives that raised workplace participation and awareness 15%",
      ],
      skills: [
        "Fundraising Strategy",
        "Leadership",
        "Event Planning",
        "Community Engagement",
        "Stakeholder Management",
      ],
      logoSrc: unitedWayLogo,
      color: "#FF5A28",
    },
    {
      title: "Student Ambassador",
      organization: "Royal Bank of Canada",
      websiteUrl: "https://www.rbc.com/",
      period: "2019–2020",
      duration: "1 year",
      location: "Fredericton, NB",
      description: "",
      achievements: [
        "Organized campus-wide events that raised student engagement and awareness 25%",
        "Built targeted outreach that raised student participation in RBC events 30%",
      ],
      skills: [
        "Event Management",
        "Strategic Outreach",
        "Campus Relations",
        "Brand Promotion",
        "Student Engagement",
      ],
      logoSrc: rbcLogo,
      color: "#005DAA",
    },
    {
      title: "Volunteer Staff",
      organization: "Irving Oil Limited",
      websiteUrl: "https://www.irvingoil.com/en-CA",
      period: "2018",
      duration: "Seasonal",
      location: "Saint John, NB",
      description: "",
      achievements: [
        "Ran activities for over 100 children and kept the event safe and enjoyable",
        "Coordinated with fellow volunteers to keep the event running smoothly",
      ],
      skills: [
        "Youth Engagement",
        "Event Coordination",
        "Team Collaboration",
        "Community Relations",
        "Safety Management",
      ],
      logoSrc: irvingLogo,
      color: "#1E40AF",
    }
  ];
  const currentYear = new Date().getFullYear();
  const communityStartYears = communityActivities
    .map((activity) => Number.parseInt(activity.period.slice(0, 4), 10))
    .filter((year) => Number.isFinite(year));
  const firstCommunityYear = Math.min(...communityStartYears);
  const yearsOfService = Math.max(1, currentYear - firstCommunityYear);
  const organizationsServed = new Set(communityActivities.map((activity) => activity.organization)).size;
  const peopleHelped = 100;

  return (
    <section 
      ref={communityAnimation.ref}
      id="community" 
      className={`py-16 sm:py-20 lg:py-24 relative overflow-hidden bg-slate-50/50 scroll-fade-in ${communityAnimation.isVisible ? 'visible' : ''}`}
    >
      {/* Background - inherits Apple grey from parent */}
      
      <div className="container-width">
        {/* Header - Outside the card */}
        <div 
          ref={communityHeaderAnimation.ref}
          className={`text-center mb-12 sm:mb-16 lg:mb-20 scroll-slide-up ${communityHeaderAnimation.isVisible ? 'visible' : ''}`}
        >
          <p className="section-kicker mb-4">Leadership</p>
          <h2 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Community
          </h2>
          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-muted-foreground sm:text-xl lg:text-2xl">
            Community leadership and volunteer service initiatives
          </p>
        </div>

        {/* Community Activities - matches experience card pattern */}
        <div ref={communityRef} className="space-y-6">
          {communityActivities.map((activity, index) => (
            (() => {
              const isCardVisible = communityItems.has(index);
              const revealClass = isCardVisible ? 'visible' : '';
              const competenciesHeadingDelay = getScrollRevealDelay('body', activity.achievements.length + 2);
              const chipStartDelay = competenciesHeadingDelay + 90;

              return (
                <div
                  key={index}
                  id={`community-${slugify(activity.organization)}`}
                  className={`community-card-shell group bg-white border border-border rounded-lg p-6 transition-shadow duration-200 hover:shadow-sm scroll-slide-up ${revealClass}`}
                  data-testid={`community-activity-${index}`}
                >
                  <div className="experience-card-header mb-4">
                    <div
                      className={`experience-card-header-shell scroll-slide-up ${revealClass}`}
                      style={getScrollRevealStyle('cardHeader')}
                    >
                      {activity.logoSrc ? (
                        <div className="experience-card-logo-shell">
                          <img
                            src={activity.logoSrc}
                            alt={`${activity.organization} Logo`}
                            className="experience-card-logo"
                          />
                        </div>
                      ) : null}

                      <div className="experience-card-copy min-w-0">
                        <div className="experience-card-title-row">
                          <h3 className="text-lg font-semibold text-foreground">{activity.title}</h3>
                          <span className="experience-card-period text-sm font-medium text-muted-foreground">
                            {activity.period}
                          </span>
                        </div>

                        <p
                          className={`experience-card-company text-base font-medium text-primary scroll-slide-up ${revealClass}`}
                          style={getScrollRevealStyle('subheading')}
                        >
                          <a
                            href={activity.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Visit ${activity.organization} website`}
                          >
                            {activity.organization}
                          </a>
                        </p>
                        <p
                          className={`experience-card-location text-sm text-muted-foreground scroll-slide-up ${revealClass}`}
                          style={getScrollRevealStyle('body', 0)}
                        >
                          {activity.location}
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
                      {activity.achievements.map((ach, i) => (
                        <div
                          key={i}
                          className={`flex items-start gap-2 scroll-slide-up ${revealClass}`}
                          style={getScrollRevealStyle('body', i + 2)}
                        >
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                          <p className="text-sm text-muted-foreground leading-relaxed">{ach}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4
                      className={`text-sm font-semibold text-foreground mb-2 scroll-slide-up ${revealClass}`}
                      style={getScrollRevealStyle(competenciesHeadingDelay)}
                    >
                      Core Competencies
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {activity.skills.map((skill, i) => (
                        <span
                          key={i}
                          className={`bg-slate-50 text-slate-700 border border-border/60 px-2.5 py-1 rounded-md text-xs font-medium scroll-slide-up ${revealClass}`}
                          style={getScrollRevealStyle(chipStartDelay + i * 65)}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()
          ))}
        </div>

        {/* Community Impact Summary */}
        <div className="mt-12" ref={communitySummaryAnimation.ref}>
          <div className="bg-white border border-border rounded-lg p-8 lg:p-10">
            <h3 className="text-xl font-bold text-foreground mb-8 text-center">
              Community Highlights
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className={`scroll-slide-up ${communitySummaryAnimation.visibleItems.has(0) ? 'visible' : ''}`}>
                <CommunityCounter
                  end={yearsOfService}
                  suffix="+"
                  label="Years of Service"
                  className="text-primary"
                  delay={0}
                />
              </div>
              <div className={`scroll-slide-up ${communitySummaryAnimation.visibleItems.has(1) ? 'visible' : ''}`}>
                <CommunityCounter
                  end={peopleHelped}
                  suffix="+"
                  label="People Helped"
                  className="text-primary"
                  delay={200}
                />
              </div>
              <div className={`scroll-slide-up ${communitySummaryAnimation.visibleItems.has(2) ? 'visible' : ''}`}>
                <CommunityCounter
                  end={organizationsServed}
                  label="Organizations Served"
                  className="text-primary"
                  delay={400}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
