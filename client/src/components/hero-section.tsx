import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useInitialPageAnimation } from "@/hooks/useScrollAnimation";
import { useQuery } from "@tanstack/react-query";
import profileImage from "@assets/89BBD451-CD8B-47EB-AA2E-C39D4637B01D_1_105_c_1755896148330.jpeg";

// Employment
import seventyThreeStringsLogo from "@assets/73-strings-logo.webp";
import bmoLogo from "@assets/BMO_Logo.svg_1755913265896.png";
import tdLogo from "@assets/Toronto-Dominion_Bank_logo.svg_1755913265896.png";
import rbcLogo from "@assets/RBC-Logo_1755913716813.png";
import irvingLogo from "@assets/Irving_Oil.svg_1755913265895.png";
import grantThorntonLogo from "@assets/Grant_Thornton_logo_1755913265895.png";
import roiLogo from "@assets/roi_logo_icon.png";

// Education
import unbLogo from "@assets/University_of_New_Brunswick_Logo.svg_1755912478863.png";
import nccLogo from "@assets/northeast_christian_college_logo.png";

// Certifications & Training
import cfaLogo from "@assets/CFA_Institute_Logo_1755923720192.png";
import trainingTheStreetLogo from "@assets/trainning the street_1755938972014.png";
import csiLogo from "@assets/canadian securities institute_1755923720191.png";
import bloombergLogo from "@assets/bloomberg_1755923720190.png";
import wallStreetPrepLogo from "@assets/wall street prep_1755923720193.png";
import courseraLogo from "@assets/Coursera_1755937682843.png";
import etsLogo from "@assets/ETS_1755939510188.png";

// Community
import unitedWayLogo from "@assets/United-Way-Logo_1755913265895.png";

export default function HeroSection() {
  const isPageLoaded = useInitialPageAnimation(400);
  const yearsExperience = Math.max(1, new Date().getFullYear() - 2018);
  const heroSummary =
    "Building trust at the intersection of finance, portfolio operations, and technology. Frontline client experience, rigorous financial training, and hands-on analytics supporting better decisions and stronger operating discipline.";

  const videosQuery = useQuery({
    queryKey: ["/api/videos"],
    staleTime: 60000,
  });

  const videos = Array.isArray(videosQuery.data) ? (videosQuery.data as any[]) : [];
  const activeVideo = videos.find((video) => video.isActive);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (!element) return;

    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const openIntroductionVideo = () => {
    if (!activeVideo) {
      scrollToSection("experience");
      return;
    }

    const overlay = document.createElement("div");
    overlay.id = "video-overlay";
    overlay.style.cssText = `
      position: fixed;
      inset: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(15, 23, 42, 0.88);
      z-index: 999999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    `;

    const video = document.createElement("video");
    video.controls = true;
    video.autoplay = true;
    video.muted = true;
    video.src = "/api/introduction-video";
    video.style.cssText = `
      max-width: min(1100px, 92vw);
      max-height: 88vh;
      width: 100%;
      height: auto;
      border-radius: 24px;
      background: black;
      box-shadow: 0 30px 80px rgba(0, 0, 0, 0.35);
    `;

    const closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.textContent = "Close";
    closeButton.setAttribute("aria-label", "Close introduction video");
    closeButton.style.cssText = `
      position: absolute;
      top: 24px;
      right: 24px;
      background: white;
      color: #0f172a;
      border: none;
      padding: 10px 16px;
      border-radius: 999px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 600;
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.16);
    `;

    const closeOverlay = () => {
      overlay.remove();
      document.removeEventListener("keydown", handleEscape);
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeOverlay();
      }
    };

    closeButton.onclick = closeOverlay;
    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) {
        closeOverlay();
      }
    });

    document.addEventListener("keydown", handleEscape);
    overlay.appendChild(video);
    overlay.appendChild(closeButton);
    document.body.appendChild(overlay);
  };

  const institutionLogos = [
    // Experience (chronological, most recent first)
    { src: seventyThreeStringsLogo, alt: "73 Strings" },
    { src: roiLogo, alt: "ROI" },
    { src: bmoLogo, alt: "BMO Private Wealth" },
    { src: tdLogo, alt: "TD Canada Trust" },
    { src: rbcLogo, alt: "Royal Bank of Canada" },
    { src: irvingLogo, alt: "Irving Oil" },
    { src: grantThorntonLogo, alt: "Grant Thornton" },
    // Education
    { src: unbLogo, alt: "University of New Brunswick" },
    { src: nccLogo, alt: "Northeast Christian College", className: "hero-logo-image--ncc" },
    // Certifications (chronological, most recent first)
    { src: cfaLogo, alt: "CFA Institute" },
    { src: etsLogo, alt: "ETS" },
    { src: trainingTheStreetLogo, alt: "Training the Street" },
    { src: csiLogo, alt: "Canadian Securities Institute" },
    { src: courseraLogo, alt: "Coursera" },
    { src: bloombergLogo, alt: "Bloomberg" },
    { src: wallStreetPrepLogo, alt: "Wall Street Prep" },
    // Community
    { src: unitedWayLogo, alt: "United Way" },
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
                    <h1
                      className="hero-entrance hero-entrance-1 text-slate-950"
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "clamp(2.45rem, 11vw, 5rem)",
                        lineHeight: "0.92",
                        letterSpacing: "-0.05em",
                        textWrap: "balance",
                      }}
                    >
                      Tyler Bustard
                    </h1>
                    <p
                      className="hero-entrance hero-entrance-2 mt-3 text-slate-500 md:mt-4"
                      style={{
                        fontSize: "clamp(1.15rem, 4.2vw, 1.65rem)",
                        lineHeight: "1.14",
                        textWrap: "balance",
                      }}
                    >
                      Finance &amp; Technology
                    </p>
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
                    variant="outline"
                    onClick={() => scrollToSection("contact")}
                    className="min-h-[48px] cursor-pointer rounded-full border-slate-200 bg-white px-7 text-[0.9rem] font-semibold text-slate-900 shadow-sm transition-all duration-200 hover:bg-slate-50"
                    data-testid="button-contact-hero"
                  >
                    Contact
                  </Button>
                  {videos.length > 0 && (
                    <Button
                      variant="outline"
                      onClick={openIntroductionVideo}
                      className="min-h-[48px] cursor-pointer rounded-full border-slate-200 bg-white px-7 text-[0.9rem] font-semibold text-slate-900 shadow-sm transition-all duration-200 hover:bg-slate-50"
                      data-testid="button-introduction"
                    >
                      <Play size={14} className="mr-2" />
                      {activeVideo ? "Watch introduction" : "Introduction"}
                    </Button>
                  )}
                </div>

                {/* Proof stats — inline with copy */}
                <div className="hero-entrance hero-entrance-6 mt-8 hidden gap-5 md:grid md:grid-cols-3 md:gap-8 lg:mt-10">
                  <div>
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-400">Sector depth</p>
                    <p className="mt-1.5 text-xl font-semibold tracking-tight text-slate-950">{yearsExperience}+ years</p>
                    <p className="mt-1 text-xs text-slate-500">Wealth, banking &amp; financial operations</p>
                  </div>
                  <div>
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-400">Professional track</p>
                    <p className="mt-1.5 text-xl font-semibold tracking-tight text-slate-950">CFA Level I</p>
                    <p className="mt-1 text-xs text-slate-500">Investment analysis &amp; valuation</p>
                  </div>
                  <div>
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-400">Operating lens</p>
                    <p className="mt-1.5 text-xl font-semibold tracking-tight text-slate-950">Portfolio ops</p>
                    <p className="mt-1 text-xs text-slate-500">Analytics-forward execution</p>
                  </div>
                </div>
              </div>

              {/* Right: Portrait */}
              <div className="hero-entrance hero-entrance-3 hero-portrait hidden lg:block">
                <div className="hero-portrait-frame relative overflow-hidden rounded-2xl border border-slate-200 shadow-lg">
                  <img
                    src={profileImage}
                    alt="Tyler Bustard professional headshot"
                    className="hero-portrait-img aspect-[3/4] w-full object-cover object-top"
                    data-testid="img-profile"
                    loading="eager"
                    fetchPriority="high"
                    decoding="async"
                  />
                  <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/5" />
                </div>
              </div>
            </div>

            {/* ── Institution logos ── */}
            <div className="hero-entrance hero-entrance-7 hero-logo-strip mt-7 border-t border-slate-200/45 pt-5 sm:mt-8 md:mt-9 md:pt-6 lg:mt-10">
              <div className="hero-logo-row">
                {institutionLogos.map((logo, i) => (
                  <span key={logo.alt} className="hero-logo-entry">
                    {(i === 7 || i === 9 || i === 16) && (
                      <span className="hero-logo-separator hero-logo-light hidden sm:block" style={{ animationDelay: `${1.1 + i * 0.08}s` }} />
                    )}
                    <img
                      src={logo.src}
                      alt={logo.alt}
                      className={`hero-logo-image hero-logo-light ${logo.className ?? ""}`}
                      style={{ animationDelay: `${1.1 + i * 0.08}s` }}
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
