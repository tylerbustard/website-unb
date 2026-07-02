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
      className={`hero2 relative flex min-h-[100svh] flex-col overflow-hidden bg-background ${isPageLoaded ? "is-ready" : ""}`}
    >
      <div className="hero2-grain" aria-hidden="true" />

      <div className="container-width relative z-10 flex w-full flex-1 flex-col justify-center px-4 pb-14 pt-20 sm:px-6">
        {/* ── Meta bar ── */}
        <div className="hero2-meta flex items-center justify-between gap-4 border-b border-slate-200/80 pb-3">
          <span className="hero-facts-label">Toronto, Canada — 43.65°N</span>
          <span className="hero-facts-label hidden text-primary sm:inline">CFA Level I Candidate</span>
          <span className="hero-facts-label inline-flex items-center gap-2">
            <span className="hero2-dot" aria-hidden="true" />
            Open to opportunities
          </span>
        </div>

        {/* ── Name ── */}
        <h1 className="hero2-name mt-5 uppercase sm:mt-6" style={{ fontFamily: "var(--font-display)" }}>
          <span className="hero2-clip"><span className="hero2-rise hero2-l1">Tyler</span></span>
          <span className="hero2-clip"><span className="hero2-rise hero2-rise-2 hero2-l2">Bustard</span></span>
        </h1>

        {/* ── Role / summary + portrait plate ── */}
        <div className="mt-6 grid items-start gap-8 sm:mt-7 lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-14 xl:grid-cols-[minmax(0,1fr)_340px] xl:gap-16">
          <div className="hero2-fade hero2-fade-copy min-w-0">
            <p className="hero-facts-label text-primary">Finance Professional — Toronto</p>
            <p className="mt-3 max-w-[38rem] text-[1.02rem] leading-[1.64] text-slate-600 sm:text-[1.08rem]">
              {heroSummary}
            </p>
            <div className="mt-6 border-t border-slate-200/80 pt-3">
              <p className="hero-facts-label">Selected institutions</p>
              <div className="mt-3.5 flex flex-wrap items-center gap-x-7 gap-y-3.5">
                {institutionLogos.map((logo) => (
                  <img
                    key={logo.alt}
                    src={logo.src}
                    alt={logo.alt}
                    className="hero2-logo"
                    style={{ height: `${logo.h ?? 21}px` }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="hero2-plate w-full max-w-[280px] rounded-lg border border-slate-200 bg-white p-2 shadow-lg lg:max-w-none xl:-mt-44">
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
          </div>
        </div>
      </div>

    </section>
  );
}