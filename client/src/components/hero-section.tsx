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
      className="hero-layout relative overflow-hidden bg-background min-h-[88svh] pt-24 pb-8 sm:min-h-[92svh] sm:pt-28 sm:pb-10 lg:min-h-[100svh] lg:pt-32 lg:pb-14 flex flex-col justify-between"
    >
      {/* Ambient hero reveal */}
      <div
        className={`hero-aurora hero-ambient-scene absolute inset-0 ${isPageLoaded ? "is-ready" : ""}`}
        aria-hidden="true"
      >
        <span className="hero-ambient-scrim" />
        <span className="hero-ambient-veil hero-ambient-veil--left" />
        <span className="hero-ambient-veil hero-ambient-veil--right" />
        <span className="hero-ambient-layer hero-ambient-layer--left">
          <span className="hero-ambient-blob hero-ambient-blob--left" />
        </span>
        <span className="hero-ambient-layer hero-ambient-layer--right">
          <span className="hero-ambient-blob hero-ambient-blob--right" />
        </span>
      </div>

      <div className="hero-content-shell relative z-10 flex-1 flex flex-col justify-center">
        <div className="container-width">
          <div>
            {/* ── Primary: Name + Role + Portrait ── */}
            <div className="hero-primary-grid grid items-center gap-10 md:gap-12 lg:grid-cols-[1fr_340px] xl:grid-cols-[1fr_400px] xl:gap-16">
              {/* Left: Identity */}
              <div className="hero-copy-column max-w-full sm:max-w-[42rem] lg:max-w-none">
                <div className="hero-intro-grid mb-7 grid items-center gap-x-4 gap-y-4 [grid-template-columns:minmax(0,1fr)_clamp(5.2rem,24vw,6.15rem)] sm:mb-8 sm:[grid-template-columns:minmax(0,1fr)_clamp(7rem,19vw,9rem)] md:mb-9 md:gap-x-8 lg:mb-0 lg:block">
                  <div className="min-w-0 order-1">
                    <p className="hero-entrance hero-entrance-1 text-[0.72rem] font-bold uppercase tracking-[0.22em] text-primary">
                      Finance Professional — Toronto
                    </p>
                    <h1
                      className="hero-entrance hero-entrance-2 mt-4 text-slate-950"
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "clamp(2.45rem, 11vw, 5rem)",
                        lineHeight: "0.92",
                        letterSpacing: "-0.045em",
                        wordSpacing: "0.14em",
                        textWrap: "balance",
                      }}
                    >
                      Tyler Bustard
                    </h1>
                  </div>
                  <div className="hero-entrance hero-entrance-3 order-2 justify-self-end lg:hidden">
                    <div className="hero-portrait-frame relative overflow-hidden rounded-[1.35rem] border border-slate-200/90 bg-white shadow-lg">
                      <img
                        src={profileImage}
                        alt="Tyler Bustard professional headshot"
                        className="hero-portrait-img aspect-[3/4] w-full object-cover object-top"
                        data-testid="img-profile-inline"
                        loading="eager"
                        fetchPriority="high"
                        decoding="async"
                      />
                      <div className="absolute inset-0 rounded-[1.35rem] ring-1 ring-inset ring-black/5" />
                    </div>
                  </div>
                </div>

                <p className="hero-entrance hero-entrance-4 hero-summary mt-4 max-w-full text-[1.02rem] leading-[1.64] text-slate-600 sm:mt-5 sm:max-w-[38rem] sm:text-[1.06rem] md:max-w-[44rem] md:text-[1.08rem] lg:max-w-[36rem] lg:text-[1.05rem]">
                  {heroSummary}
                </p>

                {/* Actions */}
                <div className="hero-entrance hero-entrance-5 hero-actions mt-8 flex flex-col gap-3.5 sm:flex-row sm:flex-wrap md:gap-4 lg:flex-row">
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

                {/* Key facts — fund-fact-sheet ledger */}
                <div className="hero-entrance hero-entrance-6 mt-9 min-w-0 lg:mt-11">
                  <div className="flex items-baseline justify-between border-t-2 border-slate-950 pt-2.5">
                    <span className="hero-facts-label">Key facts</span>
                    <span className="hero-facts-label">As at 2026</span>
                  </div>
                  <dl>
                    <div className="grid grid-cols-[6.5rem_1fr] items-baseline gap-4 border-b border-slate-200 py-3 sm:grid-cols-[10.5rem_1fr] sm:gap-6">
                      <dt className="hero-facts-label">Portfolio scale</dt>
                      <dd className="text-[0.95rem] text-slate-950 sm:text-base" style={{ fontVariantNumeric: "tabular-nums" }}>
                        <strong className="font-bold">$100M+</strong>
                        <span className="text-slate-500"> client portfolios supported</span>
                      </dd>
                    </div>
                    <div className="grid grid-cols-[6.5rem_1fr] items-baseline gap-4 border-b border-slate-200 py-3 sm:grid-cols-[10.5rem_1fr] sm:gap-6">
                      <dt className="hero-facts-label">Professional track</dt>
                      <dd className="text-[0.95rem] text-slate-950 sm:text-base">
                        <strong className="font-bold text-primary">CFA Level I Candidate</strong>
                        <span className="text-slate-500"> · CSC · Bloomberg BMC</span>
                      </dd>
                    </div>
                    <div className="grid grid-cols-[6.5rem_1fr] items-baseline gap-4 border-b border-slate-200 py-3 sm:grid-cols-[10.5rem_1fr] sm:gap-6">
                      <dt className="hero-facts-label">Experience</dt>
                      <dd className="text-[0.95rem] text-slate-950 sm:text-base">
                        <strong className="font-bold">RBC · TD · BMO Private Wealth · 73 Strings</strong>
                        <span className="text-slate-500"> — wealth, banking &amp; fintech</span>
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              {/* Right: Portrait plate */}
              <div className="hero-entrance hero-entrance-3 hero-portrait hidden lg:block">
                <div className="rounded-lg border border-slate-200 bg-white p-2.5 shadow-lg">
                  <div className="relative overflow-hidden rounded-md">
                    <img
                      src={profileImage}
                      alt="Tyler Bustard professional headshot"
                      className="hero-portrait-img aspect-[3/4] w-full object-cover object-top"
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
            </div>

            {/* ── Institution logos ── */}
            <div className="hero-entrance hero-entrance-7 hero-logo-strip mt-7 border-t border-slate-200/60 pt-5 sm:mt-8 md:mt-9 md:pt-6 lg:mt-10">
              <div className="flex flex-wrap items-center justify-center gap-x-7 gap-y-4 lg:justify-start">
                <span className="hero-facts-label hero-logo-light" style={{ animationDelay: "1.05s" }}>Selected institutions</span>
                {institutionLogos.map((logo, i) => (
                  <span key={logo.alt} className="hero-logo-entry">
                    {i === 7 && (
                      <span className="hero-logo-separator hero-logo-light hidden sm:block" style={{ animationDelay: `${1.1 + i * 0.08}s` }} />
                    )}
                    <img
                      src={logo.src}
                      alt={logo.alt}
                      className="hero-logo-image hero-logo-light"
                      style={{ animationDelay: `${1.1 + i * 0.08}s`, height: `${logo.h ?? 22}px` }}
                    />
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
