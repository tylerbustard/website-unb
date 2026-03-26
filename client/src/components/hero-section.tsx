import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useInitialPageAnimation } from "@/hooks/useScrollAnimation";
import { useQuery } from "@tanstack/react-query";
import profileImage from "@assets/89BBD451-CD8B-47EB-AA2E-C39D4637B01D_1_105_c_1755896148330.jpeg";
import bmoLogo from "@assets/BMO_Logo.svg_1755913265896.png";
import tdLogo from "@assets/Toronto-Dominion_Bank_logo.svg_1755913265896.png";
import rbcLogo from "@assets/RBC-Logo_1755913716813.png";
import cfaLogo from "@assets/CFA_Institute_Logo_1755923720192.png";
import mcgillLogo from "@assets/mcgill_university_logo.png";
import seventyThreeStringsLogo from "@assets/73-strings-logo.webp";
import unbLogo from "@assets/University_of_New_Brunswick_Logo.svg_1755912478863.png";
import trainingTheStreetLogo from "@assets/trainning the street_1755938972014.png";
import unitedWayLogo from "@assets/United-Way-Logo_1755913265895.png";

export default function HeroSection() {
  const isPageLoaded = useInitialPageAnimation(400);

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

  const credibilityPanels = [
    {
      label: "Current role",
      value: "Portfolio monitoring",
      detail: "Senior Associate at 73 Strings",
    },
    {
      label: "Sector depth",
      value: "6+ years",
      detail: "Wealth, banking, and financial operations",
    },
    {
      label: "Professional track",
      value: "CFA Level I",
      detail: "Candidate with a strong analytics base",
    },
  ];

  const focusCards = [
    {
      title: "McGill MMF Candidate",
      detail: "Continuing advanced finance training with a capital-markets lens.",
      logo: mcgillLogo,
    },
    {
      title: "BMO Private Wealth",
      detail: "Supported investment counsellors and client portfolio execution.",
      logo: bmoLogo,
    },
    {
      title: "TD & RBC Experience",
      detail: "Built client trust in retail banking and financial advisory roles.",
      logo: tdLogo,
    },
    {
      title: "Finance + Data",
      detail: "Combining modeling, monitoring, and analytics workflows.",
      logo: cfaLogo,
    },
  ];

  const institutionLogos = [
    { src: seventyThreeStringsLogo, alt: "73 Strings" },
    { src: bmoLogo, alt: "BMO Private Wealth" },
    { src: tdLogo, alt: "TD Canada Trust" },
    { src: rbcLogo, alt: "Royal Bank of Canada" },
    { src: cfaLogo, alt: "CFA Institute" },
    { src: trainingTheStreetLogo, alt: "Training the Street" },
  ];

  const quickLinks = [
    {
      title: "Education",
      summary: "BBA in Finance from UNB with a strong base in markets, analytics, and strategy.",
      target: "education",
      logo: unbLogo,
    },
    {
      title: "Experience",
      summary: "Career progression across portfolio monitoring, wealth management, and frontline banking.",
      target: "experience",
      logo: seventyThreeStringsLogo,
    },
    {
      title: "Certifications",
      summary: "Credentials across investment analysis, data analytics, valuation, and financial services advice.",
      target: "certifications",
      logo: trainingTheStreetLogo,
    },
    {
      title: "Community",
      summary: "Leadership through fundraising, mentoring, and workplace engagement initiatives.",
      target: "community",
      logo: unitedWayLogo,
    },
  ];

  return (
    <section id="hero" className="relative overflow-hidden bg-background pb-16 pt-28 sm:pt-32 lg:pb-24 lg:pt-40">
      <div className="absolute inset-x-0 top-0 h-[32rem] bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.14),transparent_38%),radial-gradient(circle_at_top_right,rgba(15,23,42,0.08),transparent_28%)]" />
      <div className="relative z-10 px-4 sm:px-6">
        <div className="container-width">
          <div className={`grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)] lg:items-center page-load-fade-in ${isPageLoaded ? "loaded" : ""}`}>
            <div className="space-y-8">
              <div className="hero-tag">Toronto, Ontario • Finance and technology execution</div>

              <div className="space-y-5">
                <p className="section-kicker">Finance • Technology • Portfolio Monitoring</p>
                <div className="space-y-4">
                  <h1
                    className="text-5xl leading-[0.9] tracking-tight text-slate-950 sm:text-6xl lg:text-7xl xl:text-[5.25rem]"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Tyler Bustard
                  </h1>
                  <p className="max-w-2xl text-xl font-semibold text-primary sm:text-2xl lg:text-[1.7rem]">
                    Finance & Technology Professional
                  </p>
                </div>
                <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
                  Building trust at the intersection of finance, portfolio operations, and technology. Tyler combines frontline client experience,
                  rigorous financial training, and hands-on analytics to support better decisions and stronger operating discipline.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {credibilityPanels.map((panel) => (
                  <div key={panel.label} className="hero-metric-card">
                    <p className="section-kicker mb-3">{panel.label}</p>
                    <p className="text-xl font-semibold text-slate-950 sm:text-2xl">{panel.value}</p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{panel.detail}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
                <Button
                  onClick={() => scrollToSection("experience")}
                  className="min-h-[56px] rounded-full bg-slate-950 px-6 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:translate-y-[-1px] hover:bg-slate-800"
                  data-testid="button-view-experience"
                >
                  View experience
                  <ArrowRight size={16} className="ml-2" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => scrollToSection("contact")}
                  className="min-h-[56px] rounded-full border-slate-300 bg-white/70 px-6 text-base font-semibold text-slate-900 shadow-sm transition-all duration-300 hover:bg-white"
                  data-testid="button-contact-hero"
                >
                  Contact Tyler
                </Button>
                {videos.length > 0 && (
                  <Button
                    variant="outline"
                    onClick={openIntroductionVideo}
                    className="min-h-[56px] rounded-full border-primary/20 bg-primary/5 px-6 text-base font-semibold text-primary shadow-sm transition-all duration-300 hover:bg-primary/10"
                    data-testid="button-introduction"
                  >
                    <Play size={16} className="mr-2" />
                    {activeVideo ? "Watch introduction video" : "Introduction"}
                  </Button>
                )}
              </div>
            </div>

            <aside className="section-shell section-shell-strong p-4 sm:p-5 lg:p-6">
              <div className="grid gap-5">
                <div className="relative overflow-hidden rounded-[2rem] bg-slate-950">
                  <img
                    src={profileImage}
                    alt="Tyler Bustard professional headshot"
                    className="aspect-[4/5] w-full object-cover object-center"
                    data-testid="img-profile"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent p-6 text-white">
                    <p className="section-kicker !text-white/70">Current focus</p>
                    <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">Senior Associate, Portfolio Monitoring</h2>
                    <p className="mt-3 max-w-md text-sm leading-6 text-white/78">
                      Supporting valuation integrity, reconciliations, and operational control within a modern portfolio monitoring environment.
                    </p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {focusCards.map((card) => (
                    <div key={card.title} className="section-card flex items-start gap-4 p-4">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-slate-100">
                        <img src={card.logo} alt={card.title} className="h-7 w-7 object-contain" />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-slate-950">{card.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">{card.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>

          <div className="section-shell mt-8 p-5 sm:p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="section-kicker mb-2">Selected institutions and platforms</p>
                <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                  Experience and training spanning portfolio monitoring, wealth management, Canadian banking, and investment education.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-6 sm:gap-4">
                {institutionLogos.map((logo) => (
                  <div key={logo.alt} className="logo-lockup flex items-center justify-center">
                    <img src={logo.src} alt={logo.alt} className="h-8 w-full object-contain sm:h-10" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {quickLinks.map((link, index) => (
              <button
                key={link.title}
                type="button"
                onClick={() => scrollToSection(link.target)}
                aria-label={`Scroll to ${link.title.toLowerCase()} section`}
                className={`quick-link-card page-load-fade-in focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${isPageLoaded ? "loaded" : ""}`}
                style={{ animationDelay: `${0.45 + index * 0.1}s` }}
                data-testid={`card-${link.title.toLowerCase()}`}
              >
                <div className="mb-5 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100">
                    <img src={link.logo} alt={link.title} className="h-7 w-7 object-contain" />
                  </div>
                  <div>
                    <p className="section-kicker mb-1">Explore</p>
                    <h3 className="text-lg font-semibold text-slate-950">{link.title}</h3>
                  </div>
                </div>
                <p className="text-sm leading-6 text-muted-foreground">{link.summary}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
