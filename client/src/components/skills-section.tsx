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
import { CertificateModal, type CertificateModalCert } from "@/components/certificate-modal";
import unitedWayLogo from "@assets/United-Way-Logo_1755913265895.png";
import rbcLogo from "@assets/RBC-Logo_1755913716813.png";
import irvingLogo from "@assets/Irving_Oil.svg_1755913265895.png";
import cfaLogo from "@assets/CFA_Institute_Logo_1755923720192.png";
import csiLogo from "@assets/canadian securities institute_1755923720191.png";
import wallStreetPrepLogo from "@assets/wall street prep_1755923720193.png";
import trainingTheStreetLogo from "@assets/trainning the street_1755938972014.png";
import bloombergLogo from "@assets/bloomberg_1755923720190.png";
import courseraLogo from "@assets/Coursera_1755937682843.png";
import etsLogo from "@assets/ETS_1755939510188.png";
import mcgillLogo from "@assets/mcgill_university_logo.png";
import anthropicLogo from "@assets/anthropic_mark.png";
import openaiLogo from "@assets/openai_mark.png";
import microsoftLogo from "@assets/microsoft_logo.svg";
import googleLogo from "@assets/google_logo.svg";
import hubspotLogo from "@assets/hubspot_logo.svg";
import pythonLogo from "@assets/python_logo.svg";
import pmiLogo from "@assets/pmi_logo.png";
import acueLogo from "@assets/acue_logo.png";
import cphrLogo from "@assets/cphr_logo.png";
import shrmLogo from "@assets/shrm_logo.png";
import amaLogo from "@assets/ama_logo.png";
import garpLogo from "@assets/garp_logo.png";
import hrciLogo from "@assets/hrci_logo.png";

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

const parseCertificationYear = (certification: Certification) => {
  const year = Number.parseInt(certification.year, 10);
  return Number.isFinite(year) ? year : Number.MAX_SAFE_INTEGER;
};

export default function CertificationsSection() {
  const sectionAnimation = useScrollAnimation(SCROLL_REVEAL_OBSERVER_OPTIONS);
  const headerAnimation = useScrollAnimation({
    ...SCROLL_REVEAL_OBSERVER_OPTIONS,
    threshold: 0.18,
    delay: 60,
  });

  const [activeCert, setActiveCert] = useState<CertificateModalCert | null>(null);
  const openCertificate = (certification: Certification) => {
    const asset = getCertificateAsset(certification.name);
    if (asset) {
      setActiveCert({
        title: certification.name,
        issuer: certification.issuer,
        year: certification.year,
        image: asset.image,
        alt: asset.alt,
      });
    }
  };

  const certificationCategories: CertificationCategory[] = ([
    {
      title: "Investment & Markets",
      caption: "CFA, valuation, and market fluency",
      certifications: [
        { name: "CFA Level I Candidate", year: "2026", issuer: "CFA Institute", emphasis: true, logoSrc: cfaLogo },
        { name: "Discounted Cash Flow Analysis and Modeling", year: "2024", issuer: "Training The Street", logoSrc: trainingTheStreetLogo },
        { name: "Financial & Valuation Modeling", year: "2020", issuer: "Wall Street Prep", logoSrc: wallStreetPrepLogo },
        { name: "Bloomberg Market Concepts Certificate", year: "2020", issuer: "Bloomberg", logoSrc: bloombergLogo },
        { name: "CFA Institute Investment Foundations", year: "2021", issuer: "CFA Institute", logoSrc: cfaLogo },
        { name: "Financial Risk and Regulation (FRR)", year: "2025", issuer: "Global Association of Risk Professionals", logoSrc: garpLogo },
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
        { name: "Personal Finance Essentials", year: "2020", issuer: "McGill University", logoSrc: mcgillLogo },
      ],
    },
    {
      title: "Data & Business Intelligence",
      caption: "Analytics, visualization, and automation",
      certifications: [
        { name: "Google Data Analytics Professional Certificate", year: "2023", issuer: "Google", logoSrc: courseraLogo },
        { name: "Data Visualization with Tableau", year: "2023", issuer: "UC Davis", logoSrc: courseraLogo },
        { name: "Python for Everybody Specialization", year: "2023", issuer: "University of Michigan", logoSrc: courseraLogo },
        { name: "SQL for Data Science", year: "2020", issuer: "UC Davis", logoSrc: courseraLogo },
        { name: "Power BI Data Visualization", year: "2020", issuer: "Microsoft", logoSrc: courseraLogo },
        { name: "IBM Data Analyst Professional Certificate", year: "2021", issuer: "IBM", logoSrc: courseraLogo },
        { name: "Foundations: Data, Data, Everywhere", year: "2022", issuer: "Google", logoSrc: courseraLogo },
        { name: "Ask Questions to Make Data-Driven Decisions", year: "2022", issuer: "Google", logoSrc: courseraLogo },
        { name: "Prepare Data for Exploration", year: "2022", issuer: "Google", logoSrc: courseraLogo },
        { name: "Process Data from Dirty to Clean", year: "2022", issuer: "Google", logoSrc: courseraLogo },
        { name: "Analyze Data to Answer Questions", year: "2022", issuer: "Google", logoSrc: courseraLogo },
        { name: "Google Analytics Certification", year: "2022", issuer: "Google", logoSrc: googleLogo },
        { name: "Microsoft Certified: Power BI Data Analyst Associate", year: "2021", issuer: "Microsoft", logoSrc: microsoftLogo },
        { name: "Microsoft Office Specialist: Excel Associate", year: "2024", issuer: "Microsoft", logoSrc: microsoftLogo },
      ],
    },
    {
      title: "Quantitative & Statistical Methods",
      caption: "Modeling, inference, and mathematical foundations",
      certifications: [
        { name: "Econometrics: Methods & Applications", year: "2024", issuer: "Erasmus University", logoSrc: courseraLogo },
        { name: "Matrix Algebra for Engineers", year: "2024", issuer: "HKUST", logoSrc: courseraLogo },
        { name: "Introduction to Calculus", year: "2023", issuer: "University of Sydney", logoSrc: courseraLogo },
        { name: "Machine Learning", year: "2020", issuer: "Stanford University", logoSrc: courseraLogo },
        { name: "Inferential Statistics", year: "2020", issuer: "Duke University", logoSrc: courseraLogo },
        { name: "Excel Skills for Business", year: "2020", issuer: "Macquarie University", logoSrc: courseraLogo },
      ],
    },
    {
      title: "Cloud & AI Engineering",
      caption: "Azure engineering, data, and AI certifications",
      certifications: [
        { name: "Microsoft Certified: Azure AI Engineer Associate", year: "2022", issuer: "Microsoft", logoSrc: microsoftLogo, emphasis: true },
        { name: "Microsoft Certified: Azure Data Scientist Associate", year: "2021", issuer: "Microsoft", logoSrc: microsoftLogo },
        { name: "Microsoft Certified: Azure Data Engineer Associate", year: "2021", issuer: "Microsoft", logoSrc: microsoftLogo },
        { name: "Microsoft Certified: Azure Developer Associate", year: "2022", issuer: "Microsoft", logoSrc: microsoftLogo },
        { name: "Microsoft Certified: Azure AI Fundamentals", year: "2021", issuer: "Microsoft", logoSrc: microsoftLogo },
        { name: "Microsoft Certified: Azure Data Fundamentals", year: "2021", issuer: "Microsoft", logoSrc: microsoftLogo },
        { name: "Microsoft Certified: Azure Fundamentals", year: "2021", issuer: "Microsoft", logoSrc: microsoftLogo },
      ],
    },
    {
      title: "Software & Programming",
      caption: "Python programming and software development credentials",
      certifications: [
        { name: "PCAP: Certified Associate in Python Programming", year: "2021", issuer: "Python Institute", logoSrc: pythonLogo, emphasis: true },
        { name: "PCEP: Certified Entry-Level Python Programmer", year: "2023", issuer: "Python Institute", logoSrc: pythonLogo },
        { name: "Programming for Everybody (Python)", year: "2021", issuer: "University of Michigan", logoSrc: courseraLogo },
        { name: "Python Data Structures", year: "2021", issuer: "University of Michigan", logoSrc: courseraLogo },
        { name: "Using Python to Access Web Data", year: "2022", issuer: "University of Michigan", logoSrc: courseraLogo },
        { name: "Using Databases with Python", year: "2022", issuer: "University of Michigan", logoSrc: courseraLogo },
        { name: "Capstone: Retrieving, Processing & Visualizing Data with Python", year: "2022", issuer: "University of Michigan", logoSrc: courseraLogo },
      ],
    },
    {
      title: "Marketing",
      caption: "Digital marketing, advertising, and inbound",
      certifications: [
        { name: "Inbound Marketing Certification", year: "2023", issuer: "HubSpot Academy", logoSrc: hubspotLogo, emphasis: true },
        { name: "AMA PCM Digital Marketing", year: "2017", issuer: "American Marketing Association", logoSrc: amaLogo },
        { name: "Google Ads Measurement Certification", year: "2022", issuer: "Google", logoSrc: googleLogo },
        { name: "Google Ads Search Certification", year: "2022", issuer: "Google", logoSrc: googleLogo },
      ],
    },
    {
      title: "Human Resources",
      caption: "People, talent, and HR management credentials",
      certifications: [
        { name: "SHRM Certified Professional (SHRM-CP)", year: "2015", issuer: "SHRM", logoSrc: shrmLogo, emphasis: true },
        { name: "CPHR Canada", year: "2023", issuer: "CPHR Canada", logoSrc: cphrLogo },
        { name: "HRCI Professional in Human Resources – International (PHRi)", year: "", issuer: "HR Certification Institute", logoSrc: hrciLogo },
      ],
    },
    {
      title: "Project & Agile Management",
      caption: "Project management and agile delivery",
      certifications: [
        { name: "Certified Associate in Project Management (CAPM)", year: "2024", issuer: "Project Management Institute", logoSrc: pmiLogo, emphasis: true },
        { name: "Certified ScrumMaster (CSM)", year: "2025", issuer: "Scrum Alliance" },
      ],
    },
    {
      title: "Teaching & Learning",
      caption: "Instructional practice and educator credentials",
      certifications: [
        { name: "Certificate in Effective Teaching", year: "2025", issuer: "Association of College and University Educators", logoSrc: acueLogo, emphasis: true },
        { name: "Microsoft Certified Educator", year: "2016", issuer: "Microsoft", logoSrc: microsoftLogo },
      ],
    },
    {
      title: "Claude Code & Agent Skills",
      caption: "Anthropic Academy credentials for agentic development",
      certifications: [
        { name: "Claude Code 101", year: "2026", issuer: "Anthropic Academy", logoSrc: anthropicLogo, logoTone: "anthropic", emphasis: true },
        { name: "Claude Code in Action", year: "2026", issuer: "Anthropic Academy", logoSrc: anthropicLogo, logoTone: "anthropic", emphasis: true },
        { name: "Introduction to subagents", year: "2026", issuer: "Anthropic Academy", logoSrc: anthropicLogo, logoTone: "anthropic" },
        { name: "Introduction to agent skills", year: "2026", issuer: "Anthropic Academy", logoSrc: anthropicLogo, logoTone: "anthropic" },
      ],
    },
    {
      title: "Claude Platform, API & MCP",
      caption: "Claude engineering paths across API, MCP, and cloud deployment",
      certifications: [
        { name: "Building with the Claude API", year: "2026", issuer: "Anthropic Academy", logoSrc: anthropicLogo, logoTone: "anthropic", emphasis: true },
        { name: "Introduction to Model Context Protocol", year: "2026", issuer: "Anthropic Academy", logoSrc: anthropicLogo, logoTone: "anthropic" },
        { name: "Model Context Protocol: Advanced Topics", year: "2026", issuer: "Anthropic Academy", logoSrc: anthropicLogo, logoTone: "anthropic" },
        { name: "Claude with Amazon Bedrock", year: "2026", issuer: "Anthropic Academy", logoSrc: anthropicLogo, logoTone: "anthropic" },
        { name: "Claude with Google Cloud's Vertex AI", year: "2026", issuer: "Anthropic Academy", logoSrc: anthropicLogo, logoTone: "anthropic" },
      ],
    },
    {
      title: "Claude AI Fluency",
      caption: "Claude productivity, AI fluency, education, nonprofit, and small business coursework",
      certifications: [
        { name: "Claude 101", year: "2026", issuer: "Anthropic Academy", logoSrc: anthropicLogo, logoTone: "anthropic", emphasis: true },
        { name: "AI Capabilities and Limitations", year: "2026", issuer: "Anthropic Academy", logoSrc: anthropicLogo, logoTone: "anthropic" },
        { name: "AI Fluency: Framework & Foundations", year: "2026", issuer: "Anthropic Academy", logoSrc: anthropicLogo, logoTone: "anthropic" },
        { name: "AI Fluency for educators", year: "2026", issuer: "Anthropic Academy", logoSrc: anthropicLogo, logoTone: "anthropic" },
        { name: "AI Fluency for students", year: "2026", issuer: "Anthropic Academy", logoSrc: anthropicLogo, logoTone: "anthropic" },
        { name: "Teaching AI Fluency", year: "2026", issuer: "Anthropic Academy", logoSrc: anthropicLogo, logoTone: "anthropic" },
        { name: "AI Fluency for nonprofits", year: "2026", issuer: "Anthropic Academy", logoSrc: anthropicLogo, logoTone: "anthropic" },
        { name: "AI Fluency for Small Businesses", year: "2026", issuer: "Anthropic Academy", logoSrc: anthropicLogo, logoTone: "anthropic" },
        { name: "Introduction to Claude Cowork", year: "2026", issuer: "Anthropic Academy", logoSrc: anthropicLogo, logoTone: "anthropic" },
      ],
    },
    {
      title: "OpenAI Codex Academy",
      caption: "OpenAI Academy modules for coding agents and automated workflows",
      certifications: [
        { name: "Get started with Codex", year: "2026", issuer: "OpenAI Academy", logoSrc: openaiLogo, logoTone: "openai", emphasis: true },
        { name: "Try real tasks with Codex", year: "2026", issuer: "OpenAI Academy", logoSrc: openaiLogo, logoTone: "openai" },
        { name: "Write better prompts for Codex", year: "2026", issuer: "OpenAI Academy", logoSrc: openaiLogo, logoTone: "openai" },
        { name: "Work faster with the Codex app", year: "2026", issuer: "OpenAI Academy", logoSrc: openaiLogo, logoTone: "openai" },
        { name: "Codex fundamentals", year: "2026", issuer: "OpenAI Academy", logoSrc: openaiLogo, logoTone: "openai", emphasis: true },
        { name: "Hands-on workshop: Practical Codex workflows", year: "2026", issuer: "OpenAI Academy", logoSrc: openaiLogo, logoTone: "openai" },
        { name: "How OpenAI uses Codex", year: "2026", issuer: "OpenAI Academy", logoSrc: openaiLogo, logoTone: "openai" },
        { name: "Advanced workflows and automations", year: "2026", issuer: "OpenAI Academy", logoSrc: openaiLogo, logoTone: "openai" },
      ],
    },
    {
      title: "Graduate Admissions",
      caption: "Standardized assessment",
      certifications: [
        { 
          name: "GRE General Test", 
          year: "2024", 
          issuer: "ETS", 
          detail: "Score: 325",
          emphasis: true,
          logoSrc: etsLogo,
        }
      ],
    },
  ] satisfies CertificationCategory[]).map((category): CertificationCategory => ({
    ...category,
    certifications: [...category.certifications].sort(
      (left, right) => parseCertificationYear(right) - parseCertificationYear(left),
    ),
  }));

  const leftColumnCertificationTitles = new Set([
    "Investment & Markets",
    "Data & Business Intelligence",
    "Software & Programming",
    "Human Resources",
    "Teaching & Learning",
    "Claude AI Fluency",
    "Graduate Admissions",
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
    threshold: 0.14,
    delay: 90,
    staggerDelay: 90,
    fastStaggerDelay: 55,
  });

  return (
    <section
      ref={sectionAnimation.ref}
      id="certifications"
      className="py-20 sm:py-28 lg:py-36 relative overflow-hidden"
    >
      <div className="container-width">
        {/* Header */}
        <div
          ref={headerAnimation.ref}
          className={`text-center mb-12 sm:mb-16 lg:mb-20 scroll-slide-up ${headerAnimation.isVisible ? 'visible' : ''}`}
        >
          <p className="section-kicker mb-4">Credentials</p>
          <h2 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Certifications
          </h2>
          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-muted-foreground sm:text-xl lg:text-2xl">
            Structured across investment, advisory, analytics, and quantitative training.
          </p>
        </div>

        <div
          ref={certificationItemsAnimation.ref}
          className="homepage-certifications-panel group bg-white border border-border rounded-lg p-6 transition-shadow duration-200 hover:shadow-sm sm:p-8 lg:p-10"
        >
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
                        className={`resume-certification-area homepage-certification-area scroll-slide-up ${revealClass}`}
                      >
                        <div className="resume-certification-area-header homepage-certification-area-header">
                          <h3
                            className={`resume-certification-area-title homepage-certification-area-title scroll-slide-up ${revealClass}`}
                            style={getScrollRevealStyle('cardHeader')}
                          >
                            {category.title}
                          </h3>
                          <p
                            className={`resume-certification-area-caption homepage-certification-area-caption scroll-slide-up ${revealClass}`}
                            style={getScrollRevealStyle('subheading')}
                          >
                            {category.caption}
                          </p>
                        </div>

                        <div className="resume-certification-cards homepage-certification-cards">
                          {category.certifications.map((certification, certificationIndex) => {
                            const certAsset = getCertificateAsset(certification.name);
                            return (
                            <div
                              key={`${category.title}-${certification.name}`}
                              id={`cert-${slugify(certification.name)}`}
                              className={`resume-certification-card homepage-certification-card scroll-slide-up ${revealClass}${certAsset ? " certificate-card-viewable focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2" : ""}`}
                              style={certAsset ? { ...getScrollRevealStyle('body', certificationIndex), cursor: 'pointer' } : getScrollRevealStyle('body', certificationIndex)}
                              role={certAsset ? "button" : undefined}
                              tabIndex={certAsset ? 0 : undefined}
                              aria-haspopup={certAsset ? "dialog" : undefined}
                              aria-label={certAsset ? `View ${certification.name} certificate` : undefined}
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
                                <span className="resume-certification-card-year homepage-certification-card-year">{certification.year}</span>
                                {certification.detail ? (
                                  <span className="resume-certification-card-detail homepage-certification-card-detail">{certification.detail}</span>
                                ) : null}
                                {certAsset ? (
                                  <span className="inline-flex items-center gap-1 text-xs font-medium text-primary">
                                    <Eye size={13} aria-hidden="true" />
                                    View
                                  </span>
                                ) : null}
                              </div>
                            </div>
                            );
                          })}
                        </div>
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
                <CertificationCounter end={totalCerts} label="Total Certifications & Courses" className="text-sky-700" delay={0} />
              </div>
              <div className={`scroll-slide-up ${certificationItemsAnimation.visibleItems.has(certificationRevealSequence.length + 1) ? 'visible' : ''}`}>
                <CertificationCounter end={certificationCategories.length} label="Expertise Areas" className="text-emerald-700" delay={200} />
              </div>
              <div className={`scroll-slide-up ${certificationItemsAnimation.visibleItems.has(certificationRevealSequence.length + 2) ? 'visible' : ''}`}>
                <CertificationCounter end={organizationCount} label="Different Organizations" className="text-amber-600" delay={400} />
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
      period: "2020-Present",
      duration: "4+ years",
      location: "Toronto, Ontario",
      description: "",
      achievements: [
        "Led implementation of fundraising strategies achieving 20% increase in funds raised over three years",
        "Spearheaded engagement initiatives resulting in 15% rise in participation and awareness within workplace community",
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
      period: "2019-2020",
      duration: "1 year",
      location: "Fredericton, New Brunswick",
      description: "",
      achievements: [
        "Organized and executed campus-wide events resulting in 25% increase in student engagement and awareness",
        "Developed targeted outreach strategy achieving 30% increase in student participation in RBC-sponsored events",
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
      period: "2018",
      duration: "Seasonal",
      location: "Saint John, New Brunswick",
      description: "",
      achievements: [
        "Successfully organized and executed engaging activities for over 100 children ensuring safe and enjoyable experience",
        "Demonstrated leadership through collaboration with fellow volunteers for well-coordinated event execution",
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
      className={`py-20 sm:py-28 lg:py-36 relative overflow-hidden bg-amber-50/20 scroll-fade-in ${communityAnimation.isVisible ? 'visible' : ''}`}
    >
      {/* Background - inherits Apple grey from parent */}
      
      <div className="container-width">
        {/* Header - Outside the card */}
        <div 
          ref={communityHeaderAnimation.ref}
          className={`text-center mb-12 sm:mb-16 lg:mb-20 scroll-slide-up ${communityHeaderAnimation.isVisible ? 'visible' : ''}`}
        >
          <p className="section-kicker mb-4">Leadership</p>
          <h2 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Community
          </h2>
          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-muted-foreground sm:text-xl lg:text-2xl">
            Community leadership and volunteer service initiatives
          </p>
        </div>

        {/* Community Activities — matches experience card pattern */}
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
                          {activity.organization}
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
                  className="text-sky-700"
                  delay={0}
                />
              </div>
              <div className={`scroll-slide-up ${communitySummaryAnimation.visibleItems.has(1) ? 'visible' : ''}`}>
                <CommunityCounter
                  end={peopleHelped}
                  suffix="+"
                  label="People Helped"
                  className="text-emerald-700"
                  delay={200}
                />
              </div>
              <div className={`scroll-slide-up ${communitySummaryAnimation.visibleItems.has(2) ? 'visible' : ''}`}>
                <CommunityCounter
                  end={organizationsServed}
                  label="Organizations Served"
                  className="text-amber-600"
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
