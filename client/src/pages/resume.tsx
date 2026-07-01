import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Mail, Phone, MapPin, Globe, Linkedin, Briefcase, GraduationCap, Award, Heart, Target } from "lucide-react";
import Navigation from "@/components/navigation";
import { slugify } from "@/lib/utils";
import ScrollToTopButton from "@/components/scroll-to-top-button";
import FooterMarketTicker from "@/components/footer-market-ticker";
import {
  SCROLL_REVEAL_OBSERVER_OPTIONS,
  getScrollRevealStyle,
  useScrollAnimation,
  useStaggeredScrollAnimation,
} from "@/hooks/useScrollAnimation";

// Import logos from assets
import profileImage from "@assets/89BBD451-CD8B-47EB-AA2E-C39D4637B01D_1_105_c_1755896148330.jpeg";
import unbLogo from "@assets/University_of_New_Brunswick_Logo.svg_1755912478863.png";
import bmoLogo from "@assets/BMO_Logo.svg_1755913265896.png";
import tdLogo from "@assets/Toronto-Dominion_Bank_logo.svg_1755913265896.png";
import rbcLogo from "@assets/RBC-Logo_1755913716813.png";
import unitedWayLogo from "@assets/United-Way-Logo_1755913265895.png";
import irvingLogo from "@assets/Irving_Oil.svg_1755913265895.png";
import grantThorntonLogo from "@assets/Grant_Thornton_logo_1755913265895.png";
import cfaLogo from "@assets/CFA_Institute_Logo_1755923720192.png";
import trainingTheStreetLogo from "@assets/trainning the street_1755938972014.png";
import csiLogo from "@assets/canadian securities institute_1755923720191.png";
import wallStreetPrepLogo from "@assets/wall street prep_1755923720193.png";
import etsLogo from "@assets/ETS_1755939510188.png";
import bloombergLogo from "@assets/bloomberg_1755923720190.png";
import courseraLogo from "@assets/Coursera_1755937682843.png";
import mcgillLogo from "@assets/mcgill_university_logo.png";
import seventyThreeStringsLogo from "@assets/73-strings-logo.webp";
import roiLogo from "@assets/roi_logo_icon.png";
import anthropicLogo from "@assets/anthropic_logo.svg";
import openaiLogo from "@assets/openai_logo.svg";
import nccLogo from "@assets/northeast_christian_college_logo.png";

type ResumeEntry = {
  id: string;
  role: string;
  period: string;
  organization: string;
  location: string;
  logo: string;
  logoClassName?: string;
  bullets: string[];
  skills?: string;
};

type ResumeCertification = {
  name: string;
  issuer: string;
  year: string;
  logo: string;
  logoTone?: "anthropic" | "openai";
  emphasis?: boolean;
  detail?: string;
};

type ResumeCertificationArea = {
  title: string;
  caption: string;
  certifications: ResumeCertification[];
};

export default function Resume() {
  const [location] = useLocation();

  const certificationAreas: ResumeCertificationArea[] = [
    {
      title: "Investment & Markets",
      caption: "CFA, valuation, and market fluency",
      certifications: [
        { name: "CFA Level I Candidate", issuer: "CFA Institute", year: "2026", logo: cfaLogo, emphasis: true },
        { name: "Discounted Cash Flow Analysis and Modeling", issuer: "Training The Street", year: "2024", logo: trainingTheStreetLogo },
        { name: "Financial & Valuation Modeling", issuer: "Wall Street Prep", year: "2020", logo: wallStreetPrepLogo },
        { name: "Bloomberg Market Concepts Certificate", issuer: "Bloomberg", year: "2020", logo: bloombergLogo },
      ],
    },
    {
      title: "AI Engineering & Agentic Workflows",
      caption: "Claude, Codex, MCP, and coding-agent credentials",
      certifications: [
        { name: "Claude Code, Agent Skills & Subagents", issuer: "Anthropic Academy", year: "2026", logo: anthropicLogo, logoTone: "anthropic", emphasis: true },
        { name: "Claude API, MCP, Bedrock & Vertex AI", issuer: "Anthropic Academy", year: "2026", logo: anthropicLogo, logoTone: "anthropic" },
        { name: "Claude 101, Cowork & AI Fluency Suite", issuer: "Anthropic Academy", year: "2026", logo: anthropicLogo, logoTone: "anthropic" },
        { name: "OpenAI Codex Workflows & Automations", issuer: "OpenAI Academy", year: "2026", logo: openaiLogo, logoTone: "openai", emphasis: true },
      ],
    },
    {
      title: "Advisory & Wealth Planning",
      caption: "Licensing, suitability, and client advice",
      certifications: [
        { name: "Financial Planning 1", issuer: "Canadian Securities Institute", year: "2023", logo: csiLogo },
        { name: "Certificate in Financial Services Advice", issuer: "Canadian Securities Institute", year: "2022", logo: csiLogo },
        { name: "Canadian Securities Course", issuer: "Canadian Securities Institute", year: "2021", logo: csiLogo },
      ],
    },
    {
      title: "Analytics & Quantitative Methods",
      caption: "Data, modeling, inference, and standardized assessment",
      certifications: [
        { name: "Google Data Analytics Professional Certificate", issuer: "Google", year: "2023", logo: courseraLogo },
        { name: "Python for Everybody Specialization", issuer: "University of Michigan", year: "2023", logo: courseraLogo },
        { name: "SQL for Data Science", issuer: "UC Davis", year: "2020", logo: courseraLogo },
        { name: "Machine Learning", issuer: "Stanford University", year: "2020", logo: courseraLogo },
        { name: "Econometrics: Methods & Applications", issuer: "Erasmus University", year: "2024", logo: courseraLogo },
        { name: "GRE General Test", issuer: "ETS", year: "2024", logo: etsLogo, detail: "Score: 325", emphasis: true },
      ],
    },
  ];

  const getCertificationLogos = (area: ResumeCertificationArea) => (
    Array.from(
      new Map(
        area.certifications.map((certification) => [
          certification.logo,
          {
            src: certification.logo,
            alt: certification.issuer,
            tone: certification.logoTone,
          },
        ]),
      ).values(),
    )
  );

  const experienceEntries: ResumeEntry[] = [
    {
      id: `experience-${slugify('73 Strings')}-${slugify('Senior Associate, Portfolio Monitoring')}`,
      role: "Senior Associate, Portfolio Monitoring",
      period: "Jan 2025 - May 2026",
      organization: "73 Strings",
      location: "Toronto, ON",
      logo: seventyThreeStringsLogo,
      bullets: [
        "Monitored daily NAV inputs and validated holdings and cash flows, supporting accurate fund valuations across 15+ portfolios",
        "Reviewed reconciliation workflows and investigated exceptions, reducing resolution time by 18% through streamlined communication with operations risk and portfolio managers",
      ],
      skills: "Portfolio Monitoring · Reconciliation · NAV Validation · SQL · Excel",
    },
    {
      id: `experience-${slugify('ROI')}-${slugify('Equity Analyst')}`,
      role: "Equity Analyst",
      period: "2023 - 2025",
      organization: "ROI",
      location: "Toronto, ON",
      logo: roiLogo,
      bullets: [
        "Analyzed and compiled public company financial statements, cutting reporting turnaround by 13%",
        "Collaborated with product and engineering to implement AI-driven data features, boosting adoption by 12%",
      ],
      skills: "Financial Analysis · AI Integration · Data Analytics · Python · SQL",
    },
    {
      id: `experience-${slugify('BMO Private Wealth')}-${slugify('Portfolio Assistant')}`,
      role: "Portfolio Assistant",
      period: "2022 - 2023",
      organization: "BMO Private Wealth",
      location: "Toronto, ON",
      logo: bmoLogo,
      bullets: [
        "Advised two Investment Counsellors managing portfolios over $100M and cut preparation time by 12%",
        "Bolstered client communications, boosting response rates by 9%, heightening client satisfaction and retention",
      ],
      skills: "Portfolio Management · Client Relations · Financial Analysis · Excel",
    },
    {
      id: `experience-${slugify('TD Canada Trust')}-${slugify('Financial Advisor')}`,
      role: "Financial Advisor",
      period: "2021 - 2022",
      organization: "TD Canada Trust",
      location: "Kingston, ON",
      logo: tdLogo,
      bullets: [
        "Cultivated strong client relationships by assessing individual financial needs, resulting in an 11% increase in sales",
        "Exceeded sales targets, achieving a top 15% performance ranking within the district",
      ],
      skills: "Financial Planning · Sales · Client Advisory · Product Knowledge",
    },
    {
      id: `experience-${slugify('Royal Bank of Canada')}-${slugify('Banking Advisor')}`,
      role: "Banking Advisor",
      period: "2020 - 2021",
      organization: "Royal Bank of Canada",
      location: "Kingston, ON",
      logo: rbcLogo,
      bullets: [
        "Strengthened client relationships by advising on personalized solutions, increased repeat transactions by 13%",
        "Excelled in needs-based advising, boosting adoption of core products like GICs, mutual funds, and TFSAs by 8%",
      ],
      skills: "Banking Products · Financial Advisory · Client Relationship Management · Digital Banking",
    },
    {
      id: `experience-${slugify('Royal Bank of Canada')}-${slugify('Client Advisor Intern')}`,
      role: "Client Advisor Intern",
      period: "2019 - 2020",
      organization: "Royal Bank of Canada",
      location: "Fredericton, NB",
      logo: rbcLogo,
      bullets: [
        "Resolved complex client issues, achieving a 15% boost in positive feedback scores for the branch",
        "Promoted RBC's digital banking tools, leading to a 10% increase in online and mobile banking adoption",
      ],
      skills: "Client Service · Digital Banking · Problem Resolution · Customer Support",
    },
    {
      id: `experience-${slugify('Irving Oil Limited')}-${slugify('Marketing Intern')}`,
      role: "Marketing Intern",
      period: "2018",
      organization: "Irving Oil Limited",
      location: "Saint John, NB",
      logo: irvingLogo,
      bullets: [
        "Conducted competitor analysis driving insights that improved targeted marketing by 11%",
        "Developed a Customer Lifecycle model that increased targeted promotions, boosting customer engagement by 8%",
      ],
      skills: "Market Research · Customer Analytics · Competitive Analysis · Marketing Strategy",
    },
    {
      id: `experience-${slugify('Grant Thornton LLP')}-${slugify('Tax Return Intern')}`,
      role: "Tax Return Intern",
      period: "2018",
      organization: "Grant Thornton LLP",
      location: "Saint John, NB",
      logo: grantThorntonLogo,
      bullets: [
        "Streamlined client financial data, boosting accuracy by 10% ensuring timely submission of 100+ tax returns",
        "Improved tax return preparation processes, cutting filing errors by 15%",
      ],
      skills: "Tax Preparation · Financial Analysis · Data Management · Client Service",
    },
  ];

  const educationEntries: ResumeEntry[] = [
    {
      id: "education-unb",
      role: "Bachelor of Business Administration, Finance",
      period: "2016 - 2020",
      organization: "University of New Brunswick",
      location: "Saint John, NB",
      logo: unbLogo,
      bullets: [
        "Student Investment Fund Analyst and Portfolio Manager, 5 Academic Awards ($47,500 in scholarships)",
        "UNB Finance Club, RBC Student Ambassador, Accredited Co-op Program",
        "RBC Student Ambassador of the Month, February 2020",
      ],
    },
    {
      id: "education-northeast-christian-college",
      role: "Theology Program",
      period: "2014 - 2015",
      organization: "Northeast Christian College",
      location: "Fredericton, NB",
      logo: nccLogo,
      logoClassName: "resume-entry-logo--ncc",
      bullets: [
        "Major in Theology with coursework across Bible, ministry, leadership, communication, ethics, and practical skills",
        "Campus and ministry exposure included weekend ministry, chapel service, student council, social committees, and annual benefit concert pathways",
      ],
    },
  ];

  const communityEntries: ResumeEntry[] = [
    {
      id: `community-${slugify('United Way')}`,
      role: "Next Gen Ambassador",
      period: "2020 - Present",
      organization: "United Way",
      location: "Toronto, ON",
      logo: unitedWayLogo,
      bullets: [
        "Led implementation of fundraising strategies achieving 20% increase in funds raised over three years",
        "Spearheaded engagement initiatives resulting in 15% rise in participation and awareness within workplace community",
      ],
    },
    {
      id: `community-${slugify('Royal Bank of Canada')}`,
      role: "Student Ambassador",
      period: "2019 - 2020",
      organization: "Royal Bank of Canada",
      location: "Fredericton, NB",
      logo: rbcLogo,
      bullets: [
        "Organized and executed campus-wide events resulting in 25% increase in student engagement and awareness",
        "Developed targeted outreach strategy achieving 30% increase in student participation in RBC-sponsored events",
      ],
    },
    {
      id: `community-${slugify('Irving Oil Limited')}`,
      role: "Volunteer Staff",
      period: "2018",
      organization: "Irving Oil Limited",
      location: "Saint John, NB",
      logo: irvingLogo,
      bullets: [
        "Successfully organized and executed engaging activities for over 100 children ensuring safe and enjoyable experience",
        "Demonstrated leadership through collaboration with fellow volunteers for well-coordinated event execution",
      ],
    },
  ];

  const summaryAnimation = useScrollAnimation({ ...SCROLL_REVEAL_OBSERVER_OPTIONS, threshold: 0.22, delay: 60 });
  const experienceAnimation = useStaggeredScrollAnimation(experienceEntries.length, {
    ...SCROLL_REVEAL_OBSERVER_OPTIONS,
    delay: 120,
    staggerDelay: 90,
    fastStaggerDelay: 55,
  });
  const educationAnimation = useStaggeredScrollAnimation(educationEntries.length, {
    ...SCROLL_REVEAL_OBSERVER_OPTIONS,
    delay: 120,
    staggerDelay: 90,
    fastStaggerDelay: 55,
  });
  const certificationRevealSequence = [
    "Investment & Markets",
    "AI Engineering & Agentic Workflows",
    "Advisory & Wealth Planning",
    "Analytics & Quantitative Methods",
  ];
  const certificationRevealOrder = new Map(
    certificationRevealSequence.map((title, index) => [title, index]),
  );
  const certificationAnimation = useStaggeredScrollAnimation(certificationRevealSequence.length, {
    ...SCROLL_REVEAL_OBSERVER_OPTIONS,
    delay: 120,
    staggerDelay: 90,
    fastStaggerDelay: 55,
  });
  const communityAnimation = useStaggeredScrollAnimation(communityEntries.length, {
    ...SCROLL_REVEAL_OBSERVER_OPTIONS,
    delay: 140,
    staggerDelay: 90,
    fastStaggerDelay: 55,
  });

  const renderResumeEntry = (
    entry: ResumeEntry,
    options?: { showSkills?: boolean; isVisible?: boolean },
  ) => (
    <article key={entry.id} id={entry.id} className="resume-entry">
      <div
        className={`resume-entry-header scroll-slide-up ${options?.isVisible ? "visible" : ""}`}
        style={getScrollRevealStyle("cardHeader")}
      >
        <h4 className="resume-entry-title">{entry.role}</h4>
        <span className="resume-entry-date">{entry.period}</span>
      </div>
      <div
        className={`resume-entry-meta scroll-slide-up ${options?.isVisible ? "visible" : ""}`}
        style={getScrollRevealStyle("subheading")}
      >
        <img
          src={entry.logo}
          alt={entry.organization}
          className={`resume-entry-logo ${entry.logoClassName ?? ""}`}
        />
        <span className="resume-entry-organization">{entry.organization}</span>
        <span className="resume-entry-meta-separator" aria-hidden="true">|</span>
        <span className="resume-entry-location">{entry.location}</span>
      </div>
      <ul className="resume-entry-bullets">
        {entry.bullets.map((bullet, bulletIndex) => (
          <li
            key={bullet}
            className={`resume-entry-bullet-line scroll-slide-up ${options?.isVisible ? "visible" : ""}`}
            style={getScrollRevealStyle("body", bulletIndex)}
          >
            {bullet}
          </li>
        ))}
      </ul>
      {options?.showSkills && entry.skills ? (
        <p
          className={`resume-entry-skills resume-entry-skills-animated scroll-slide-up ${options?.isVisible ? "visible" : ""}`}
          style={getScrollRevealStyle("dense", entry.bullets.length)}
        >
          <span className="resume-entry-skills-label">Skills:</span> {entry.skills}
        </p>
      ) : null}
    </article>
  );

  // Fetch resumes to check if any exist
  const resumesQuery = useQuery({
    queryKey: ['/api/resumes/employer'],
    staleTime: 60000, // 1 minute
  });

  useEffect(() => {
    const originalTitle = document.title;
    document.title = "Tyler Bustard - Resume";

    return () => {
      document.title = originalTitle;
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />

      {/* Main Resume Content */}
      <div className="pb-12 pt-24">
        <div className="max-w-4xl mx-auto">

          {/* Resume Container */}
          <div className="resume-page bg-white px-10 py-9 md:px-11 md:py-10 print:shadow-none print:px-0 print:py-0">

            <div className="resume-print-page-one-flow">
              {/* Header */}
              <header className="resume-header">
                <div className="resume-header-top">
                  <div className="resume-header-portrait-shell">
                    <div className="resume-header-portrait-frame">
                      <img
                        src={profileImage}
                        alt="Tyler Bustard"
                        className="resume-header-portrait-image"
                      />
                    </div>
                  </div>
                  <div className="resume-header-copy">
                    <h1 className="resume-header-name">Tyler Bustard</h1>
                  </div>
                </div>
                <div id="contact" className="resume-header-contact">
                  <a href="mailto:tyler@tylerbustard.ca" className="resume-header-contact-link" aria-label="Email Tyler Bustard">
                    <Mail size={13} />
                    tyler@tylerbustard.ca
                  </a>
                  <span className="resume-contact-separator" aria-hidden="true" />
                  <a href="tel:+16139851223" className="resume-header-contact-link" aria-label="Call Tyler Bustard">
                    <Phone size={13} />
                    +1 (613) 985-1223
                  </a>
                  <span className="resume-contact-separator" aria-hidden="true" />
                  <a href="https://tylerbustard.ca" target="_blank" rel="noopener noreferrer" className="resume-header-contact-link" aria-label="Visit Tyler Bustard website">
                    <Globe size={13} />
                    tylerbustard.ca
                  </a>
                  <span className="resume-contact-separator" aria-hidden="true" />
                  <span className="resume-header-contact-item">
                    <MapPin size={13} />
                    Toronto, Ontario
                  </span>
                </div>
                <hr className="resume-header-divider" />
              </header>

              {/* Summary */}
              <section ref={summaryAnimation.ref} className="resume-summary-section">
                <p
                  className={`resume-summary-text scroll-slide-up ${summaryAnimation.isVisible ? "visible" : ""}`}
                  style={getScrollRevealStyle("section")}
                >
                  Driving innovation at the intersection of finance and technology while delivering exceptional results through analytical expertise, strategic thinking, and client-focused solutions.
                </p>
              </section>

              {/* Experience */}
              <section ref={experienceAnimation.ref} id="experience" className="resume-section scroll-mt-24">
                <h3
                  className={`resume-section-heading scroll-slide-up ${experienceAnimation.visibleItems.size > 0 ? "visible" : ""}`}
                  style={getScrollRevealStyle("section")}
                >
                  Experience
                </h3>
                <div className="resume-section-body resume-section-body-stack">
                  {experienceEntries.map((entry, index) =>
                    renderResumeEntry(entry, { showSkills: true, isVisible: experienceAnimation.visibleItems.has(index) }),
                  )}
                </div>
              </section>
            </div>

            <div className="resume-print-page-two-flow">
              {/* Education */}
              <section ref={educationAnimation.ref} id="education" className="resume-section scroll-mt-24">
                <h3
                  className={`resume-section-heading scroll-slide-up ${educationAnimation.visibleItems.size > 0 ? "visible" : ""}`}
                  style={getScrollRevealStyle("section")}
                >
                  Education
                </h3>
                <div className="resume-section-body resume-section-body-stack">
                  {educationEntries.map((entry, index) =>
                    renderResumeEntry(entry, { isVisible: educationAnimation.visibleItems.has(index) }),
                  )}
                </div>
              </section>

              {/* Certifications */}
              <section ref={certificationAnimation.ref} id="certifications" className="resume-section scroll-mt-24">
                <h3
                  className={`resume-section-heading scroll-slide-up ${certificationAnimation.visibleItems.size > 0 ? "visible" : ""}`}
                  style={getScrollRevealStyle("section")}
                >
                  Certifications
                </h3>

                <div className="resume-section-body resume-certification-matrix">
                  {certificationAreas.map((area) => {
                    const isAreaVisible = certificationAnimation.visibleItems.has(certificationRevealOrder.get(area.title) ?? -1);

                    return (
                      <article key={area.title} id={`certifications-${slugify(area.title)}`} className="resume-certification-area resume-certification-area-compact">
                        <div
                          className={`resume-certification-area-header resume-certification-area-header-compact scroll-slide-up ${
                            isAreaVisible ? "visible" : ""
                          }`}
                          style={getScrollRevealStyle("cardHeader")}
                        >
                          <div className="resume-certification-area-heading-copy">
                            <h4 className="resume-certification-area-title">{area.title}</h4>
                            <p className="resume-certification-area-caption">{area.caption}</p>
                          </div>
                          <div className="resume-certification-logo-cluster" aria-hidden="true">
                            {getCertificationLogos(area).map((logo) => (
                              <span
                                key={`${area.title}-${logo.alt}`}
                                className={`resume-certification-cluster-logo-shell${logo.tone ? ` resume-certification-cluster-logo-shell--${logo.tone}` : ""}`}
                              >
                                <img
                                  src={logo.src}
                                  alt=""
                                  className="resume-certification-card-logo"
                                />
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="resume-certification-cards resume-certification-cards-compact">
                          {area.certifications.map((certification, certificationIndex) => (
                            <div
                              key={`${area.title}-${certification.name}`}
                              id={`cert-${slugify(certification.name)}`}
                              className={`resume-certification-card resume-certification-card-compact scroll-slide-up ${
                                isAreaVisible ? "visible" : ""
                              }`}
                              style={getScrollRevealStyle("body", certificationIndex)}
                            >
                              <div className="resume-certification-card-copy">
                                <p className={`resume-certification-card-title${certification.emphasis ? " resume-certification-card-title-emphasis" : ""}`}>
                                  {certification.name}
                                </p>
                                <p className="resume-certification-card-issuer">
                                  {certification.issuer}
                                  {certification.detail ? (
                                    <span className="resume-certification-card-detail-inline"> · {certification.detail}</span>
                                  ) : null}
                                </p>
                              </div>
                              <span className="resume-certification-card-year">{certification.year}</span>
                            </div>
                          ))}
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>

              {/* Community */}
              <section ref={communityAnimation.ref} id="community" className="resume-section scroll-mt-24">
                <h3
                  className={`resume-section-heading scroll-slide-up ${communityAnimation.visibleItems.size > 0 ? "visible" : ""}`}
                  style={getScrollRevealStyle("section")}
                >
                  Community
                </h3>
                <div className="resume-section-body resume-section-body-stack">
                  {communityEntries.map((entry, index) =>
                    renderResumeEntry(entry, { isVisible: communityAnimation.visibleItems.has(index) }),
                  )}
                </div>
              </section>
            </div>

          </div>
        </div>
      </div>

      {/* Print Styles — optimized for legal-size PDF */}
      <style>{`
        @media print {
          @page {
            size: letter portrait;
            margin: 0.4in 0.5in;
          }

          :root {
            --pdf-density: 0.97;
            --pdf-page-margin-top-bottom: 0.40in;
            --pdf-page-margin-left-right: 0.50in;
            --pdf-space-1: calc(2pt * var(--pdf-density));
            --pdf-space-2: calc(4pt * var(--pdf-density));
            --pdf-space-3: calc(6pt * var(--pdf-density));
            --pdf-space-4: calc(8pt * var(--pdf-density));
            --pdf-space-5: calc(12pt * var(--pdf-density));
            --pdf-space-6: calc(16pt * var(--pdf-density));
            --pdf-column-gap: calc(12pt * var(--pdf-density));
            --pdf-heading-size: calc(9.3pt * var(--pdf-density));
            --pdf-entry-title-size: calc(8.8pt * var(--pdf-density));
            --pdf-entry-date-size: calc(7pt * var(--pdf-density));
            --pdf-meta-size: calc(7.2pt * var(--pdf-density));
            --pdf-bullet-size: calc(8.15pt * var(--pdf-density));
            --pdf-skills-size: calc(6.9pt * var(--pdf-density));
          }

          /* Global resets */
          *, *::before, *::after {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          body, html {
            background: white !important;
            margin: 0 !important;
            padding: 0 !important;
            font-size: 8.35pt !important;
            line-height: 1.34 !important;
          }

          /* Hide non-print elements */
          nav, footer, button, .glass-panel, .glass-navbar,
          [data-testid="scroll-to-top-button"],
          .print\\:hidden {
            display: none !important;
          }

          /* Reset page containers */
          .min-h-screen {
            background: white !important;
            padding: 0 !important;
            min-height: auto !important;
          }

          .pb-12, .pt-24 {
            padding: 0 !important;
          }

          .max-w-4xl {
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          .resume-page {
            background: white !important;
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            box-shadow: none !important;
            border: none !important;
          }

          .resume-print-page-one-flow,
          .resume-print-page-two-flow {
            display: flex !important;
            flex-direction: column !important;
            gap: var(--pdf-space-5) !important;
          }

          .resume-print-page-two-flow {
            page-break-before: always !important;
            break-before: page !important;
            margin-top: 0 !important;
          }

          /* Resume header for print */
          .resume-header {
            margin-bottom: 0 !important;
          }

          .resume-header-top {
            display: grid !important;
            grid-template-columns: 56px 1fr !important;
            align-items: center !important;
            column-gap: var(--pdf-column-gap) !important;
          }

          .resume-header-portrait-frame {
            width: 56px !important;
            height: 56px !important;
            border-radius: 9999px !important;
            border: 1px solid #e2e8f0 !important;
            box-shadow: none !important;
            background: white !important;
          }

          .resume-header-portrait-image {
            width: 56px !important;
            height: 56px !important;
            aspect-ratio: 1 / 1 !important;
            object-fit: cover !important;
            object-position: center 12% !important;
          }

          .resume-header-name {
            font-family: var(--font-display) !important;
            font-size: 22pt !important;
            line-height: 0.96 !important;
            letter-spacing: -0.04em !important;
            font-weight: 700 !important;
            font-feature-settings: 'kern' 1 !important;
            text-rendering: optimizeLegibility !important;
            margin: 0 !important;
          }

          .resume-header-role {
            font-size: 11pt !important;
            line-height: 1.15 !important;
            margin-top: var(--pdf-space-2) !important;
            color: #64748b !important;
          }

          .resume-header-contact {
            margin-top: var(--pdf-space-3) !important;
            gap: var(--pdf-space-1) var(--pdf-space-3) !important;
            font-size: 8.2pt !important;
          }

          .resume-header-contact a,
          .resume-header-contact span {
            font-size: 8.2pt !important;
          }

          .resume-contact-separator {
            display: inline-block !important;
            height: var(--pdf-space-4) !important;
          }

          .resume-header-divider {
            margin-top: var(--pdf-space-3) !important;
            border-top: 1px solid #cbd5e1 !important;
          }

          .resume-summary-section {
            margin-bottom: 0 !important;
          }

          p, li, span, a {
            font-size: 8.2pt !important;
            line-height: 1.34 !important;
          }

          .text-xs {
            font-size: 7.15pt !important;
          }
          /* Preserve link colors */
          a { color: inherit !important; text-decoration: none !important; }
          .text-primary { color: #1e40af !important; }

          /* Preserve text colors */
          .text-slate-900 { color: #0f172a !important; }
          .text-slate-700 { color: #334155 !important; }
          .text-slate-600 { color: #475569 !important; }
          .text-slate-500 { color: #64748b !important; }
          .text-slate-400 { color: #94a3b8 !important; }
          .text-slate-300 { color: #cbd5e1 !important; }
          .border-slate-300 { border-color: #cbd5e1 !important; }

          /* Logos */
          img {
            max-width: 100% !important;
          }

          .resume-header,
          .resume-summary-section,
          .resume-page section {
            margin: 0 !important;
          }

          .resume-page section {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }

          .resume-section-heading {
            margin: 0 0 var(--pdf-space-3) !important;
            padding: 0 0 var(--pdf-space-2) !important;
            border-bottom: 1px solid #cbd5e1 !important;
            color: #0f172a !important;
            font-size: var(--pdf-heading-size) !important;
            line-height: 1.1 !important;
            letter-spacing: 0.16em !important;
            font-weight: 700 !important;
            text-transform: uppercase !important;
          }

          .resume-section-body {
            display: flex !important;
            flex-direction: column !important;
          }

          .resume-section-body-stack {
            gap: var(--pdf-space-2) !important;
          }

          .resume-summary-text {
            font-size: 8.5pt !important;
            line-height: 1.42 !important;
          }

          #experience,
          #certifications,
          #community,
          #education {
            margin-bottom: 0 !important;
          }

          .resume-entry,
          .resume-certification-area {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }

          .resume-entry-header {
            display: flex !important;
            align-items: baseline !important;
            justify-content: space-between !important;
            gap: var(--pdf-space-3) !important;
          }

          .resume-entry-title {
            margin: 0 !important;
            color: #0f172a !important;
            font-size: var(--pdf-entry-title-size) !important;
            line-height: 1.18 !important;
            letter-spacing: -0.018em !important;
            font-weight: 700 !important;
          }

          .resume-entry-date {
            flex: 0 0 auto !important;
            margin-left: auto !important;
            color: #94a3b8 !important;
            font-size: var(--pdf-entry-date-size) !important;
            line-height: 1.2 !important;
            white-space: nowrap !important;
          }

          .resume-entry-meta {
            display: flex !important;
            flex-wrap: wrap !important;
            align-items: center !important;
            gap: var(--pdf-space-1) var(--pdf-space-2) !important;
            margin-top: var(--pdf-space-1) !important;
            color: #64748b !important;
            font-size: var(--pdf-meta-size) !important;
            line-height: 1.25 !important;
          }

          .resume-entry-logo {
            width: 11pt !important;
            height: 11pt !important;
            flex: 0 0 11pt !important;
            object-fit: contain !important;
          }

          .resume-entry-logo--ncc {
            width: 17pt !important;
            height: 7.4pt !important;
            flex-basis: 17pt !important;
          }

          .resume-entry-bullets {
            margin: var(--pdf-space-2) 0 0 !important;
            padding-left: 11pt !important;
            display: grid !important;
            gap: var(--pdf-space-1) !important;
            color: #334155 !important;
            font-size: var(--pdf-bullet-size) !important;
            line-height: 1.34 !important;
          }

          .resume-entry-bullets li {
            margin: 0 !important;
            font-size: var(--pdf-bullet-size) !important;
            line-height: 1.34 !important;
          }

          .resume-entry-skills {
            display: block !important;
            margin: var(--pdf-space-1) 0 0 !important;
            padding-left: 11pt !important;
            color: #64748b !important;
            font-size: var(--pdf-skills-size) !important;
            line-height: 1.24 !important;
            letter-spacing: -0.01em !important;
          }

          .resume-entry-skills-label {
            color: #475569 !important;
            font-weight: 600 !important;
          }

          #community .resume-section-body-stack {
            display: flex !important;
            flex-direction: column !important;
            gap: var(--pdf-space-3) !important;
          }

          #community .resume-entry-header {
            display: flex !important;
            align-items: baseline !important;
            justify-content: space-between !important;
            gap: var(--pdf-space-3) !important;
          }

          #community .resume-entry-meta {
            margin-top: 1.5pt !important;
            font-size: 7.25pt !important;
            line-height: 1.22 !important;
          }

          #community .resume-entry-logo {
            width: 9.2pt !important;
            height: 9.2pt !important;
            flex-basis: 9.2pt !important;
          }

          #community .resume-entry-bullets {
            margin-top: 2.5pt !important;
            padding-left: 10pt !important;
            gap: 1.2pt !important;
          }

          #community .resume-entry-bullets li {
            font-size: 7.25pt !important;
            line-height: 1.25 !important;
          }

          #community .resume-entry-bullets li:nth-child(n+2) {
            display: list-item !important;
          }

          .resume-certification-columns {
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            column-gap: var(--pdf-column-gap) !important;
            align-items: start !important;
          }

          .resume-certification-column {
            display: flex !important;
            flex-direction: column !important;
            justify-content: flex-start !important;
            gap: var(--pdf-space-2) !important;
          }

          .resume-certification-area {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            border: 0 !important;
            border-top: 1px solid #dbe3ee !important;
            border-radius: 0 !important;
            padding: var(--pdf-space-2) 0 0 !important;
            background: transparent !important;
          }


          .resume-certification-area-header {
            margin-bottom: var(--pdf-space-3) !important;
          }

          .resume-certification-area-title {
            margin: 0 !important;
            font-size: 7.6pt !important;
            font-weight: 700 !important;
            line-height: 1.2 !important;
            letter-spacing: 0.1em !important;
            text-transform: uppercase !important;
            color: #475569 !important;
          }

          .resume-certification-area-caption {
            display: none !important;
          }

          .resume-certification-cards {
            display: block !important;
          }

          .resume-certification-card {
            display: flex !important;
            align-items: flex-start !important;
            justify-content: space-between !important;
            gap: var(--pdf-space-2) !important;
            padding-top: 0 !important;
            border-top: none !important;
          }

          .resume-certification-card + .resume-certification-card {
            margin-top: var(--pdf-space-2) !important;
            padding-top: var(--pdf-space-2) !important;
            border-top: 1px solid #edf2f7 !important;
          }

          .resume-certification-card-brand {
            display: flex !important;
            align-items: center !important;
            gap: var(--pdf-space-2) !important;
            min-width: 0 !important;
          }

          .resume-certification-card-logo-shell {
            width: 11pt !important;
            height: 11pt !important;
            flex: 0 0 11pt !important;
            display: grid !important;
            place-items: center !important;
            align-self: center !important;
          }

          .resume-certification-card-logo-shell--anthropic,
          .resume-certification-card-logo-shell--openai {
            width: 24pt !important;
            height: 11pt !important;
            flex-basis: 24pt !important;
          }

          .resume-certification-card-logo-shell--openai {
            width: 21pt !important;
            flex-basis: 21pt !important;
          }

          .resume-certification-card-logo {
            display: block !important;
            width: 100% !important;
            max-width: 100% !important;
            max-height: 100% !important;
            object-fit: contain !important;
            object-position: center !important;
            border-radius: 0 !important;
            border: 0 !important;
            background: transparent !important;
            padding: 0 !important;
          }

          .resume-certification-card-copy {
            min-width: 0 !important;
          }

          .resume-certification-card-title {
            margin: 0 !important;
            font-size: 7.82pt !important;
            line-height: 1.22 !important;
            letter-spacing: -0.01em !important;
            color: #0f172a !important;
            font-weight: 600 !important;
          }

          .resume-certification-card-title-emphasis {
            font-weight: 700 !important;
          }

          .resume-certification-card-issuer {
            margin: var(--pdf-space-1) 0 0 !important;
            font-size: 6.92pt !important;
            line-height: 1.24 !important;
            color: #64748b !important;
          }

          .resume-certification-card-meta {
            display: flex !important;
            flex-direction: column !important;
            align-items: flex-end !important;
            gap: 1pt !important;
            flex: 0 0 auto !important;
          }

          .resume-certification-card-year {
            font-size: 6.95pt !important;
            line-height: 1.2 !important;
            color: #94a3b8 !important;
            white-space: nowrap !important;
          }

          .resume-certification-card-detail {
            font-size: 6.55pt !important;
            line-height: 1.2 !important;
            color: #475569 !important;
            font-weight: 600 !important;
          }

          .resume-certification-matrix {
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            column-gap: var(--pdf-column-gap) !important;
            row-gap: var(--pdf-space-3) !important;
            align-items: start !important;
          }

          .resume-certification-area-compact {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            border: 0 !important;
            border-top: 1px solid #dbe3ee !important;
            padding: var(--pdf-space-2) 0 0 !important;
            background: transparent !important;
          }

          .resume-certification-area-header-compact {
            display: grid !important;
            grid-template-columns: minmax(0, 1fr) auto !important;
            align-items: start !important;
            gap: var(--pdf-space-2) !important;
            margin-bottom: var(--pdf-space-2) !important;
          }

          .resume-certification-logo-cluster {
            display: flex !important;
            align-items: center !important;
            justify-content: flex-end !important;
            gap: 2pt !important;
          }

          .resume-certification-cluster-logo-shell {
            width: 10pt !important;
            height: 10pt !important;
            flex: 0 0 10pt !important;
            display: grid !important;
            place-items: center !important;
          }

          .resume-certification-cluster-logo-shell--anthropic,
          .resume-certification-cluster-logo-shell--openai {
            width: 20pt !important;
            flex-basis: 20pt !important;
          }

          .resume-certification-cards-compact {
            display: grid !important;
            gap: 1.8pt !important;
          }

          .resume-certification-card-compact {
            display: grid !important;
            grid-template-columns: minmax(0, 1fr) auto !important;
            align-items: baseline !important;
            gap: var(--pdf-space-2) !important;
            padding-top: 0 !important;
            border-top: 0 !important;
          }

          .resume-certification-card-compact + .resume-certification-card-compact {
            margin-top: 0 !important;
            padding-top: 0 !important;
            border-top: 0 !important;
          }

          .resume-certification-card-detail-inline {
            color: #475569 !important;
            font-weight: 600 !important;
          }

          .resume-section,
          .resume-entry,
          .resume-certification-area {
            margin-bottom: 0 !important;
          }

          .resume-summary-text.scroll-slide-up,
          .resume-section-heading.scroll-slide-up,
          .resume-entry-header.scroll-slide-up,
          .resume-entry-meta.scroll-slide-up,
          .resume-entry-bullet-line.scroll-slide-up,
          .resume-entry-skills-animated.scroll-slide-up,
          .resume-certification-area-header.scroll-slide-up,
          .resume-certification-card.scroll-slide-up {
            opacity: 1 !important;
            transform: none !important;
            transition: none !important;
          }

        }
      `}</style>

      <ScrollToTopButton compactWhenSelectorVisible="footer" scrollBehavior="auto" printHidden />

      {/* Footer */}
      <footer className="site-footer-strip print:hidden">
        <FooterMarketTicker />
      </footer>
    </div>
  );
}
