import { ArrowRight, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useInitialPageAnimation } from "@/hooks/useScrollAnimation";
import profileImage from "@assets/89BBD451-CD8B-47EB-AA2E-C39D4637B01D_1_105_c_1755896148330.jpeg";

// Employment
import seventyThreeStringsLogo from "@assets/73-strings-logo.webp";
import bmoLogo from "@assets/BMO_Logo.svg_1755913265896.png";
import tdLogo from "@assets/Toronto-Dominion_Bank_logo.svg_1755913265896.png";
import rbcLogo from "@assets/rbc_logo.webp";
import irvingLogo from "@assets/Irving_Oil.svg_1755913265895.png";
import grantThorntonLogo from "@assets/grant_thornton_logo.webp";
import roiLogo from "@assets/roi_logo_icon.png";

// Education

// Certifications & Training
import cfaLogo from "@assets/CFA_Institute_Logo_1755923720192.png";
import csiLogo from "@assets/canadian securities institute_1755923720191.png";
import bloombergLogo from "@assets/bloomberg_1755923720190.png";

// Community

export default function HeroSection() {
  const isPageLoaded = useInitialPageAnimation(400);
  const heroSummary =
    "CFA Level I Candidate with front-office and portfolio-operations experience across RBC, TD, BMO Private Wealth, and 73 Strings — pairing Canadian Securities Course and Bloomberg Market Concepts training with hands-on Python and SQL analytics.";

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (!element) return;

    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const institutionLogos: { src: string; alt: string; h?: number }[] = [
    // Employers, most recognizable first
    { src: rbcLogo, alt: "Royal Bank of Canada" },
    { src: tdLogo, alt: "TD Canada Trust" },
    { src: bmoLogo, alt: "BMO Private Wealth" },
    { src: irvingLogo, alt: "Irving Oil", h: 18 },
    { src: grantThorntonLogo, alt: "Grant Thornton" },
    { src: roiLogo, alt: "ROI" },
    { src: seventyThreeStringsLogo, alt: "73 Strings" },
    // Credentials
    { src: cfaLogo, alt: "CFA Institute", h: 19 },
    { src: csiLogo, alt: "Canadian Securities Institute" },
    { src: bloombergLogo, alt: "Bloomberg", h: 17 },
  ];

  const sections = [
    { label: "Experience", target: "experience" },
    { label: "Education", target: "education" },
    { label: "Certifications", target: "certifications" },
    { label: "Community", target: "community" },
  ];

  return (
    <section
      id="hero"
      className={`hero2 relative overflow-hidden bg-background ${isPageLoaded ? "is-ready" : ""}`}
    >
      <div className="hero2-grain" aria-hidden="true" />

      <div className="container-width relative z-10 px-4 pt-28 sm:px-6 sm:pt-32 lg:pt-36">
        {/* ── Meta bar ── */}
        <div className="hero2-meta flex items-center justify-between gap-4 border-b border-slate-200/80 pb-3.5">
          <span className="hero-facts-label">Toronto, Canada — 43.65°N</span>
          <span className="hero-facts-label hidden text-primary sm:inline">CFA Level I Candidate</span>
          <span className="hero-facts-label inline-flex items-center gap-2">
            <span className="hero2-dot" aria-hidden="true" />
            Open to opportunities
          </span>
        </div>

        {/* ── Name ── */}
        <h1 className="hero2-name mt-8 uppercase sm:mt-10" style={{ fontFamily: "var(--font-display)" }}>
          <span className="hero2-clip"><span className="hero2-rise hero2-l1">Tyler</span></span>
          <span className="hero2-clip"><span className="hero2-rise hero2-rise-2 hero2-l2">Bustard</span></span>
        </h1>

        {/* ── Role / summary / CTAs + portrait plate ── */}
        <div className="mt-9 grid items-start gap-10 sm:mt-10 lg:grid-cols-[minmax(0,1fr)_330px] lg:gap-16">
          <div className="hero2-fade hero2-fade-copy min-w-0">
            <p className="hero-facts-label text-primary">Finance Professional — Toronto</p>
            <p className="mt-3.5 max-w-[36rem] text-[1.02rem] leading-[1.66] text-slate-600 sm:text-[1.05rem]">
              {heroSummary}
            </p>
            <div className="mt-7 flex flex-col gap-3.5 sm:flex-row sm:flex-wrap">
              <Button
                onClick={() => scrollToSection("experience")}
                className="min-h-[48px] cursor-pointer rounded-full bg-slate-950 px-7 text-[0.9rem] font-semibold text-white shadow-md transition-all duration-200 hover:bg-slate-800"
                data-testid="button-view-experience"
              >
                View experience
                <ArrowRight size={15} className="ml-2" />
              </Button>
              <Button
                asChild
                variant="outline"
                className="min-h-[48px] cursor-pointer rounded-full border-slate-200 bg-white px-7 text-[0.9rem] font-semibold text-slate-900 shadow-sm transition-all duration-200 hover:bg-slate-50"
                data-testid="button-download-resume-hero"
              >
                <a href="/Tyler-Bustard-Resume.pdf" download>
                  <Download size={14} className="mr-2" />
                  Download resume
                </a>
              </Button>
              <Button
                variant="outline"
                onClick={() => scrollToSection("contact")}
                className="min-h-[48px] cursor-pointer rounded-full border-slate-200 bg-white px-7 text-[0.9rem] font-semibold text-slate-900 shadow-sm transition-all duration-200 hover:bg-slate-50"
                data-testid="button-contact-hero"
              >
                Contact
              </Button>
            </div>
          </div>

          <div className="hero2-plate rounded-lg border border-slate-200 bg-white p-2.5 shadow-lg lg:-mt-24">
            <div className="relative overflow-hidden rounded-md">
              <img
                src={profileImage}
                alt="Tyler Bustard professional headshot"
                className="aspect-[3/4] w-full object-cover object-top"
                data-testid="img-profile"
                loading="eager"
                fetchPriority="high"
                decoding="async"
              />
              <div className="absolute inset-0 rounded-md ring-1 ring-inset ring-black/5" />
            </div>
            <div className="flex items-baseline justify-between px-1.5 pb-0.5 pt-2.5">
              <span className="hero-facts-label">Toronto, Ontario</span>
              <span className="hero-facts-label">2026</span>
            </div>
          </div>
        </div>

        {/* ── Key facts rule ── */}
        <div className="hero2-fade hero2-fade-facts mt-12 border-t-2 border-slate-950 pt-4 lg:mt-14">
          <div className="flex flex-col gap-5 sm:flex-row sm:flex-wrap sm:gap-x-12 sm:gap-y-5">
            <div>
              <p className="hero-facts-label">Portfolio scale</p>
              <p className="mt-1.5 text-[0.95rem] text-slate-950" style={{ fontVariantNumeric: "tabular-nums" }}>
                <strong className="font-bold">$100M+</strong>
                <span className="text-slate-500"> client portfolios supported</span>
              </p>
            </div>
            <div>
              <p className="hero-facts-label">Professional track</p>
              <p className="mt-1.5 text-[0.95rem] text-slate-950">
                <strong className="font-bold text-primary">CFA Level I Candidate</strong>
                <span className="text-slate-500"> · CSC · Bloomberg BMC</span>
              </p>
            </div>
            <div>
              <p className="hero-facts-label">Experience</p>
              <p className="mt-1.5 text-[0.95rem] text-slate-950">
                <strong className="font-bold">RBC · TD · BMO Private Wealth · 73 Strings</strong>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Institution marquee ── */}
      <div className="hero2-fade hero2-fade-marquee relative z-10 mt-10 border-t border-slate-200/80 pb-8 pt-5 lg:mt-12">
        <div className="container-width px-4 sm:px-6">
          <p className="hero-facts-label">Selected institutions</p>
        </div>
        <div className="hero2-marquee mt-4" aria-hidden="true">
          <div className="hero2-track">
            {[0, 1].map((copy) => (
              <div key={`marquee-copy-${copy}`} className="hero2-track-seg">
                {institutionLogos.map((logo) => (
                  <img
                    key={`${copy}-${logo.alt}`}
                    src={logo.src}
                    alt={copy === 0 ? logo.alt : ""}
                    style={{ height: `${logo.h ?? 21}px` }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}