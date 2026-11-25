import { Fragment, type MouseEvent } from "react";
import { ArrowRight } from "lucide-react";
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
import unbLogo from "@assets/University_of_New_Brunswick_Logo.svg_1755912478863.png";

// Education

// Certifications & Training
import cfaLogo from "@assets/CFA_Institute_Logo_1755923720192.png";
import csiLogo from "@assets/canadian securities institute_1755923720191.png";
import bloombergLogo from "@assets/bloomberg_1755923720190.png";

// Community

export default function HeroSection() {
  const isPageLoaded = useInitialPageAnimation(400);
  // Short Apple-style profile copy: three specialties and four highlights.
  const specialties = ["Portfolio monitoring.", "Investment research.", "AI-enabled analysis."];
  const yearsExperience = Math.max(1, new Date().getFullYear() - 2018); // first roles began in 2018
  const highlights = [
    { value: `${yearsExperience}+ years`, label: "of experience" },
    { value: "500+", label: "portfolios monitored" },
    { value: "CFA Level I", label: "candidate, 2026" },
    { value: "BBA, Finance", label: "University of New Brunswick" },
  ];

  const scrollToContact = (event: MouseEvent<HTMLAnchorElement>) => {
    const target = document.getElementById("contact");
    if (!target) return;
    event.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 80;
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
    window.scrollTo({ top, behavior });
  };


  const institutionGroups: { src: string; alt: string; h?: number }[][] = [
    [
      // Employers, most recognizable first
      { src: rbcLogo, alt: "Royal Bank of Canada" },
      { src: tdLogo, alt: "TD Canada Trust" },
      { src: bmoLogo, alt: "BMO Private Wealth" },
      { src: irvingLogo, alt: "Irving Oil", h: 18 },
      { src: grantThorntonLogo, alt: "Grant Thornton" },
      { src: roiLogo, alt: "ROI" },
      { src: seventyThreeStringsLogo, alt: "73 Strings" },
    ],
    [
      // Education
      { src: unbLogo, alt: "University of New Brunswick", h: 24 },
    ],
    [
      // Credentials
      { src: cfaLogo, alt: "CFA Institute", h: 19 },
      { src: csiLogo, alt: "Canadian Securities Institute" },
      { src: bloombergLogo, alt: "Bloomberg", h: 17 },
    ],
  ];

  const sections = [
    { label: "Education", target: "education" },
    { label: "Experience", target: "experience" },
    { label: "Certifications", target: "certifications" },
    { label: "Community", target: "community" },
  ];

  return (
    <section
      id="hero"
      className={`hero2 relative flex min-h-[100svh] flex-col overflow-hidden bg-background ${isPageLoaded ? "is-ready" : ""}`}
    >
      <div className="hero2-grain" aria-hidden="true" />

      <div className="container-width relative z-10 flex w-full flex-1 flex-col justify-center pb-14 pt-20">
        {/* ── Name / summary + portrait plate ── */}
        <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-14 xl:grid-cols-[minmax(0,1fr)_340px] xl:gap-16">
          <div className="min-w-0">
        {/* Availability, styled after the Dynamic Island: a black capsule that grows on hover. */}
        <a href="#contact" onClick={scrollToContact} className="hero2-island mb-6 sm:mb-7">
          <span className="hero2-island-dot" aria-hidden="true" />
          <span className="hero2-island-text">Open to financial intelligence roles</span>{" "}
          <span className="hero2-island-more">
            Get in touch
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
        </a>

        <h1 className="hero2-name uppercase">
          <span className="hero2-clip"><span className="hero2-rise hero2-l1">Tyler</span></span>
          <span className="hero2-clip"><span className="hero2-rise hero2-rise-2 hero2-l2">Bustard</span></span>
        </h1>


            <div className="hero2-fade hero2-fade-copy mt-6 min-w-0 sm:mt-7">
            <p className="hero2-specialties">
              {specialties.map((specialty, index) => (
                <Fragment key={specialty}>
                  <span className="whitespace-nowrap">{specialty}</span>
                  {index < specialties.length - 1 ? " " : null}
                </Fragment>
              ))}
            </p>
            <dl className="hero2-highlights hero2-fade hero2-fade-facts">
              {highlights.map((highlight) => (
                <div key={highlight.value} className="hero2-highlight">
                  <dt>{highlight.label}</dt>
                  <dd>{highlight.value}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-5">
              <p className="hero-facts-label">Selected institutions</p>
              <div className="mt-3.5 flex flex-wrap items-center gap-x-7 gap-y-3.5">
                {institutionGroups.map((group, groupIndex) => (
                  <div key={`logo-group-${groupIndex}`} className="flex flex-wrap items-center gap-x-7 gap-y-3.5">
                    {groupIndex > 0 ? (
                      <span className="hidden h-5 w-px bg-slate-300/90 sm:block" aria-hidden="true" />
                    ) : null}
                    {group.map((logo) => (
                      <img
                        key={logo.alt}
                        src={logo.src}
                        alt={logo.alt}
                        className="hero2-logo"
                        style={{ height: `${logo.h ?? 21}px` }}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
            </div>
          </div>

          <div className="hero2-plate order-first w-full max-w-[280px] rounded-lg border border-slate-200 bg-white p-2 shadow-lg lg:order-none lg:max-w-none">
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
