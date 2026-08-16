import { useState, useEffect, useRef } from "react";
import { ChevronDown, Download, Mail, Menu, Printer, X } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import profileImage from "@assets/nav_avatar.webp";
import { slugify } from "@/lib/utils";

const HOMEPAGE_INTRO_TIMING = {
  helloFadeOut: 2030,
  expand: 2180,
  content: 2480,
} as const;

export default function Navigation() {
  const [location] = useLocation();
  const isHomePage = location === '/';
  const isResumePage = location === '/resume';
  const isUploadPage = location === '/upload';
  const canonicalResumePdfPath = '/Tyler-Bustard-Resume.pdf';
  const canonicalResumePdfUrl =
    typeof window !== 'undefined'
      ? new URL(canonicalResumePdfPath, window.location.origin).toString()
      : `https://tylerbustard.ca${canonicalResumePdfPath}`;
  const emailResumeHref = `mailto:?subject=${encodeURIComponent('Tyler Bustard Resume')}&body=${encodeURIComponent(
    `Hi,

Here is Tyler Bustard's resume PDF:
${canonicalResumePdfUrl}`,
  )}`;

  const getExperienceId = (company: string, title: string) => `#experience-${slugify(company)}-${slugify(title)}`;
  const getCertificationId = (name: string) => `#cert-${slugify(name)}`;
  const getCertificationCategoryId = (title: string) => `#certifications-${slugify(title)}`;
  const getCommunityId = (organization: string) => `#community-${slugify(organization)}`;
  const educationDropdownItems = [
    {
      title: "McGill University | Desautels Faculty of Management",
      subtitle: "Master of Business Administration Candidate",
      detail: "MBA Internship stream · 2026–2028",
      target: isResumePage ? '#education' : '#mcgill-education',
    },
    {
      title: 'University of New Brunswick',
      subtitle: 'Bachelor of Business Administration, Finance',
      detail: 'Cooperative Education Program · 2016–2020',
      target: isResumePage ? '#education' : '#unb-education',
    },
  ];
  const navSectionButtonClasses = (isActive: boolean) =>
    `nav-section-button ${isActive ? 'is-active' : ''}`;
  const initialPathRef = useRef(location);
  const [homepageIntro] = useState(() => {
    if (initialPathRef.current !== "/" || typeof window === "undefined") {
      return { shouldPlay: false, shouldMarkPlayed: false };
    }

    let hasPlayed = false;
    try {
      hasPlayed = window.sessionStorage.getItem("homepageIntroPlayed") !== null;
    } catch {
      return { shouldPlay: false, shouldMarkPlayed: false };
    }

    const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
    return {
      shouldPlay: !hasPlayed && !prefersReducedMotion,
      shouldMarkPlayed: !hasPlayed,
    };
  });
  const shouldPlayHomepageIntro = homepageIntro.shouldPlay;
  const shouldMarkHomepageIntroPlayed = homepageIntro.shouldMarkPlayed;

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [navExpanded, setNavExpanded] = useState(!shouldPlayHomepageIntro);
  const [showNavContent, setShowNavContent] = useState(!shouldPlayHomepageIntro);
  const [hideHello, setHideHello] = useState(!shouldPlayHomepageIntro);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showHomeBrandText, setShowHomeBrandText] = useState(!isHomePage);
  const mobileMenuButtonRef = useRef<HTMLButtonElement | null>(null);
  const mobileMenuCloseButtonRef = useRef<HTMLButtonElement | null>(null);
  const mobileMenuDialogRef = useRef<HTMLDivElement | null>(null);
  const wasMobileMenuOpenRef = useRef(false);

  // Dynamic Island: only play the handwritten intro on a true first homepage visit in this session
  useEffect(() => {
    if (shouldMarkHomepageIntroPlayed && typeof window !== "undefined") {
      try { window.sessionStorage.setItem("homepageIntroPlayed", "1"); } catch {}
    }

    if (!shouldPlayHomepageIntro) {
      setNavExpanded(true);
      setShowNavContent(true);
      setHideHello(true);
      return;
    }

    setHideHello(false);

    const helloFadeTimer = setTimeout(() => setHideHello(true), HOMEPAGE_INTRO_TIMING.helloFadeOut);
    const expandTimer = setTimeout(() => setNavExpanded(true), HOMEPAGE_INTRO_TIMING.expand);
    const contentTimer = setTimeout(() => setShowNavContent(true), HOMEPAGE_INTRO_TIMING.content);

    return () => {
      clearTimeout(helloFadeTimer);
      clearTimeout(expandTimer);
      clearTimeout(contentTimer);
    };
  }, [shouldMarkHomepageIntroPlayed, shouldPlayHomepageIntro]);
  const [currentSection, setCurrentSection] = useState(isHomePage ? 'hero' : '');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dropdownRef = useRef<string | null>(null);

  const clearHoverTimeout = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  };

  // Helper functions for dropdown hover behavior with improved stability
  const handleDropdownEnter = (dropdownName: string) => {
    clearHoverTimeout();
    dropdownRef.current = dropdownName;
    setOpenDropdown(dropdownName);
  };

  const handleDropdownLeave = () => {
    clearHoverTimeout();
    const timeout = setTimeout(() => {
      if (dropdownRef.current) {
        dropdownRef.current = null;
        setOpenDropdown(null);
      }
    }, 150); // Optimized delay for better UX
    hoverTimeoutRef.current = timeout;
  };

  // Enhanced function to handle dropdown content hover
  const handleDropdownContentEnter = (dropdownName: string) => {
    clearHoverTimeout();
    dropdownRef.current = dropdownName;
    setOpenDropdown(dropdownName);
  };

  // Enhanced function to handle dropdown content leave
  const handleDropdownContentLeave = () => {
    clearHoverTimeout();
    const timeout = setTimeout(() => {
      if (dropdownRef.current) {
        dropdownRef.current = null;
        setOpenDropdown(null);
      }
    }, 150); // Consistent delay
    hoverTimeoutRef.current = timeout;
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (openDropdown) {
        const target = event.target as HTMLElement;
        if (!target.closest('.dropdown-container')) {
          setOpenDropdown(null);
        }
      }
    };

    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (openDropdown) {
          setOpenDropdown(null);
        } else if (isMobileMenuOpen) {
          setIsMobileMenuOpen(false);
        }
      }
    };

    document.addEventListener('click', handleClickOutside);
    document.addEventListener('touchend', handleClickOutside);
    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('touchend', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
      clearHoverTimeout();
    };
  }, [openDropdown, isMobileMenuOpen]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      wasMobileMenuOpenRef.current = true;
      requestAnimationFrame(() => {
        mobileMenuCloseButtonRef.current?.focus({ preventScroll: true });
      });
      return;
    }

    if (wasMobileMenuOpenRef.current) {
      wasMobileMenuOpenRef.current = false;
      mobileMenuButtonRef.current?.focus({ preventScroll: true });
    }
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const handleMobileMenuKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      const dialog = mobileMenuDialogRef.current;
      if (!dialog) return;

      const focusableElements = Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => !element.hasAttribute('disabled') && element.offsetParent !== null);

      if (!focusableElements.length) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement;

      if (event.shiftKey && activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener('keydown', handleMobileMenuKeyDown);

    return () => {
      document.removeEventListener('keydown', handleMobileMenuKeyDown);
    };
  }, [isMobileMenuOpen]);

  // Lock body scroll while the mobile menu is open (prevents scroll-chaining behind the overlay)
  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const prevOverflow = document.body.style.overflow;
    const prevOverscroll = document.documentElement.style.overscrollBehavior;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overscrollBehavior = 'contain';
    return () => {
      document.body.style.overflow = prevOverflow;
      document.documentElement.style.overscrollBehavior = prevOverscroll;
    };
  }, [isMobileMenuOpen]);

  // Close the mobile menu when the viewport grows to desktop so it cannot reappear stale
  useEffect(() => {
    const mql = window.matchMedia('(min-width: 1024px)');
    const onChange = (e: MediaQueryListEvent) => { if (e.matches) setIsMobileMenuOpen(false); };
    if (mql.matches) setIsMobileMenuOpen(false);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    let rafId: number | null = null;
    let lastScrollY = 0;

    const handleScroll = () => {
      if (rafId) return;

      rafId = requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        // Only update if there's a significant change
        if (Math.abs(currentScrollY - lastScrollY) > 3) {
          setIsScrolled(currentScrollY > 100);
          lastScrollY = currentScrollY;
        }

        if (isHomePage) {
          const heroSection = document.getElementById('hero');
          const heroBottom = heroSection?.getBoundingClientRect().bottom ?? Number.POSITIVE_INFINITY;
          const shouldShowBrand = heroBottom <= 96;

          setShowHomeBrandText((previous) =>
            previous === shouldShowBrand ? previous : shouldShowBrand,
          );
        } else {
          setShowHomeBrandText(true);
        }

        rafId = null;
      });
    };

    // Initial check
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [isHomePage]);


  useEffect(() => {
    if (!isHomePage && !isResumePage && !isUploadPage) {
      setCurrentSection('');
      return;
    }

    // Set initial section based on page
    setCurrentSection(isHomePage ? 'hero' : 'academic-highlights');

    const observerOptions = {
      root: null,
      rootMargin: '-15% 0px -65% 0px',
      threshold: [0, 0.1, 0.3, 0.5, 0.7, 0.9, 1]
    };

    let visibleSections = new Map();

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          visibleSections.set(entry.target.id, entry.intersectionRatio);
        } else {
          visibleSections.delete(entry.target.id);
        }
      });

      // Find the section with the highest intersection ratio
      let maxRatio = 0;
      let activeSection = isHomePage ? 'hero' : 'academic-highlights';

      Array.from(visibleSections.entries()).forEach(([sectionId, ratio]) => {
        if (ratio > maxRatio) {
          maxRatio = ratio;
          activeSection = sectionId;
        }
      });

      setCurrentSection(activeSection);
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Add a small delay to ensure sections are rendered before observing
    const setupObserver = () => {
      const sections = document.querySelectorAll('section[id]');
      sections.forEach((section) => observer.observe(section));
    };

    // Setup immediately and also after a short delay to catch any late-rendered sections
    setupObserver();
    const delayTimer = setTimeout(setupObserver, 100);

    return () => {
      clearTimeout(delayTimer);
      const sections = document.querySelectorAll('section[id]');
      sections.forEach((section) => observer.unobserve(section));
      visibleSections.clear();
    };
  }, [isHomePage, isResumePage, isUploadPage]);

  const scrollToSection = (href: string) => {
    // Close dropdown immediately for better UX
    setOpenDropdown(null);

    // The resume pages are rendered in the document flow so navigation and
    // resume content share the browser's single scrollbar.
    if (isResumePage) {
      const section = href.includes('education')
        ? 'education'
        : href.includes('experience')
          ? 'experience'
          : href.includes('cert')
            ? 'certifications'
            : href.includes('community')
              ? 'community'
              : 'contact';
      const page = section === 'certifications'
        || section === 'community'
        || href.includes('marketing-intern')
        || href.includes('tax-return-intern')
        ? 2
        : 1;
      const resumePage = document.querySelector<HTMLElement>(`[data-resume-page="${page}"]`);

      if (resumePage) {
        const navHeight = 96;
        const offsetPosition = resumePage.getBoundingClientRect().top
          + window.pageYOffset
          - navHeight;
        const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches
          ? 'auto'
          : 'smooth';

        resumePage.focus({ preventScroll: true });
        requestAnimationFrame(() => {
          window.scrollTo({
            top: offsetPosition,
            behavior,
          });
        });
      }

      setCurrentSection(section);
      setIsMobileMenuOpen(false);
      return;
    }

    // If not on home page, navigate to home page first
    if (!isHomePage) {
      window.location.href = href;
      return;
    }

    const element = document.querySelector(href);
    if (element) {
      const navHeight = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navHeight;

      // Use requestAnimationFrame for smoother scrolling
      requestAnimationFrame(() => {
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      });
    }
    setIsMobileMenuOpen(false);
  };

  const handlePrintPdf = () => {
    if (typeof window === 'undefined') return;

    const pdfWindow = window.open(canonicalResumePdfPath, '_blank');
    if (!pdfWindow) {
      window.location.assign(canonicalResumePdfPath);
      return;
    }

    const tryPrint = () => {
      try {
        pdfWindow.focus();
        pdfWindow.print();
      } catch {
        // If print is blocked by the embedded viewer, leaving the PDF open is still useful.
      }
    };

    const fallbackTimer = window.setTimeout(tryPrint, 900);
    pdfWindow.addEventListener?.(
      'load',
      () => {
        window.clearTimeout(fallbackTimer);
        window.setTimeout(tryPrint, 180);
      },
      { once: true },
    );
  };

  return (
    <>
      {/* Professional Navigation Bar - Dynamic Island Style */}
      <nav
        className={`glass-navbar fixed top-0 z-50 transition-all ease-out ${isScrolled ? 'is-scrolled' : ''} ${navExpanded ? 'left-0 right-0 duration-700' : 'left-1/2 -translate-x-1/2 duration-500'}`}
        style={!navExpanded ? { width: '180px', margin: '0.75rem auto 0' } : undefined}
      >
        {/* Apple "hello" cursive handwriting - exact helloSystem SVG */}
        {!navExpanded && (
          <div className={`nav-hello flex items-center justify-center h-14 ${hideHello ? 'is-fading' : ''}`}>
            <svg viewBox="0 0 320 180" className="h-10 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                className="nav-hello-path"
                d="M 26.816767,36.748271 C 43.203424,67.240957 66.474145,0.31812069 55.270041,32.476855 32.265545,98.505836 29.893572,143.91569 29.893572,143.91569 c 0,0 4.58505,-70.596115 33.845596,-70.596115 29.260591,0 -7.777127,69.109905 17.759383,71.339255 C 107.03503,146.88818 149.25942,78.527398 122.65893,77.041175 96.058441,75.554951 85.096643,140.94325 120.74129,143.1726 156.38598,145.40195 207.35821,31.603066 175.96961,28.630598 144.581,25.65813 143.41473,139.457 175.33529,142.42948 c 31.92063,2.97247 85.36058,-115.66477 52.90796,-117.894121 -32.45261,-2.229351 -35.74697,113.798871 -2.23032,114.541991 21.28041,-1.48624 17.21663,-66.50088 44.88117,-65.014637 39.70208,3.309454 20.43206,76.844967 -7.41485,67.623637 -21.30785,-7.62146 -19.59447,-69.101693 7.53806,-67.61545 19.64913,2.562291 33.14886,28.34421 39.03973,9.71025"
                stroke="white"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.92"
              />
            </svg>
          </div>
        )}

        {/* Full nav content - shown after expansion */}
        {navExpanded && (
        <div className="nav-pill-shell">
          <div className="nav-pill-grid grid h-14 grid-cols-[auto_1fr_auto] items-center">

            {/* Left side - Logo/Name */}
            <div className={`nav-brand-slot flex min-w-0 items-center transition-opacity duration-300 ${showNavContent ? 'opacity-100' : 'opacity-0'}`}>
              {isHomePage && (
                <button
                  onClick={() => {
                    // Use a slight delay to prevent conflict with other animations
                    setTimeout(() => {
                      window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                      });
                    }, 50);
                  }}
                  aria-label="Tyler Bustard home"
                  className={`nav-brand-button ${showHomeBrandText ? 'is-expanded' : 'is-collapsed'} cursor-pointer`}
                >
                  <img
                    src={profileImage}
                    alt="Tyler Bustard"
                    className="w-7 h-7 rounded-lg object-cover ring-1 ring-white/20"
                  />
                  <div className={`nav-brand-text ${showHomeBrandText ? 'is-visible' : ''}`}>
                    <span className="text-sm tracking-tight text-white" style={{ fontFamily: "var(--font-display)" }}>
                      <span className="font-bold">Tyler Bustard</span>
                    </span>
                  </div>
                </button>
              )}
              {isResumePage && (
                <button
                  onClick={() => {
                    // Always go to home page, not back in history
                    window.location.href = '/';
                  }}
                  aria-label="Tyler Bustard home"
                  className="nav-brand-button is-expanded cursor-pointer"
                >
                  <img
                    src={profileImage}
                    alt="Tyler Bustard"
                    className="w-7 h-7 rounded-lg object-cover ring-1 ring-white/20"
                  />
                  <div className="nav-brand-text is-visible">
                    <span className="text-sm tracking-tight text-white" style={{ fontFamily: "var(--font-display)" }}>
                      <span className="font-bold">Tyler Bustard</span>
                    </span>
                  </div>
                </button>
              )}
            </div>

            {/* Center - Desktop Navigation */}
            <div className={`hidden min-w-0 lg:flex items-center justify-self-center space-x-1 transition-opacity duration-300 ${showNavContent ? 'opacity-100' : 'opacity-0'}`}>

              {/* Resume Page Navigation - With Dropdowns */}
              {isResumePage && (
                <>
                  {/* Education */}
                  <div
                    className="relative dropdown-container"
                    onMouseEnter={() => handleDropdownEnter('education')}
                    onMouseLeave={handleDropdownLeave}
                  >
                    <button
                      onClick={(e) => { if (window.matchMedia('(pointer: coarse)').matches || e.detail === 0) { e.preventDefault(); setOpenDropdown(openDropdown === 'education' ? null : 'education'); } else { scrollToSection('#education'); } }}
                      aria-expanded={openDropdown === 'education'}
                      aria-controls="resume-education-dropdown"
                      className={navSectionButtonClasses(currentSection === 'education')}
                    >
                      Education
                      <ChevronDown size={14} className={`transition-transform duration-200 ${openDropdown === 'education' ? 'rotate-180' : ''}`} />
                    </button>

                    {openDropdown === 'education' && (
                      <div id="resume-education-dropdown" className="absolute top-full left-0 -mt-1 w-80 z-[55] pt-1">
                        <div
                          className="liquid-glass-panel rounded-xl p-4 transition-all duration-200 mt-1"
                          onMouseEnter={() => handleDropdownContentEnter('education')}
                          onMouseLeave={handleDropdownContentLeave}
                        >
                          <div className="space-y-3">
                            {educationDropdownItems.map((item) => (
                              <button
                                key={item.title}
                                onClick={() => {
                                  scrollToSection(item.target);
                                  setOpenDropdown(null);
                                }}
                                className="w-full text-left hover:bg-white/10 rounded-lg p-3 transition-all duration-200 group"
                              >
                                <div className="space-y-1">
                                  <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors duration-200">{item.title}</div>
                                  <div className="text-xs text-white/65">{item.subtitle}</div>
                                  <div className="text-xs text-white/70">{item.detail}</div>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Experience */}
                  <div
                    className="relative dropdown-container"
                    onMouseEnter={() => handleDropdownEnter('experience')}
                    onMouseLeave={handleDropdownLeave}
                  >
                    <button
                      onClick={(e) => { if (window.matchMedia('(pointer: coarse)').matches || e.detail === 0) { e.preventDefault(); setOpenDropdown(openDropdown === 'experience' ? null : 'experience'); } else { scrollToSection('#experience'); } }}
                      aria-expanded={openDropdown === 'experience'}
                      aria-controls="resume-experience-dropdown"
                      className={navSectionButtonClasses(currentSection === 'experience')}
                    >
                      Experience
                      <ChevronDown size={14} className={`transition-transform duration-200 ${openDropdown === 'experience' ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Experience Dropdown */}
                    {openDropdown === 'experience' && (
                      <div id="resume-experience-dropdown" className="absolute top-full left-0 -mt-1 w-80 z-[55] pt-1">
                        <div
                          className="liquid-glass-panel rounded-xl p-4 transition-all duration-200 mt-1"
                          onMouseEnter={() => handleDropdownContentEnter('experience')}
                          onMouseLeave={handleDropdownContentLeave}
                        >
                          <div className="space-y-3">
                            {/* Senior Associate, Portfolio Monitoring */}
                            <button
                              onClick={() => {
                                scrollToSection(getExperienceId('73 Strings', 'Senior Associate, Portfolio Monitoring'));
                                setOpenDropdown(null);
                              }}
                              className="w-full text-left hover:bg-white/10 rounded-lg p-3 transition-all duration-200 group"
                            >
                              <div className="space-y-1">
                                <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors duration-200">Senior Associate, Portfolio Monitoring</div>
                                <div className="text-xs text-white/65">73 Strings</div>
                              </div>
                            </button>

                            {/* Equity Analyst */}
                            <button
                              onClick={() => {
                                scrollToSection(getExperienceId('ROI', 'Equity Analyst'));
                                setOpenDropdown(null);
                              }}
                              className="w-full text-left hover:bg-white/10 rounded-lg p-3 transition-all duration-200 group"
                            >
                              <div className="space-y-1">
                                <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors duration-200">Equity Analyst</div>
                                <div className="text-xs text-white/65">ROI</div>
                              </div>
                            </button>

                            {/* Portfolio Assistant */}
                            <button
                              onClick={() => {
                                scrollToSection(getExperienceId('BMO Private Wealth', 'Portfolio Assistant'));
                                setOpenDropdown(null);
                              }}
                              className="w-full text-left hover:bg-white/10 rounded-lg p-3 transition-all duration-200 group"
                            >
                              <div className="space-y-1">
                                <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors duration-200">Portfolio Assistant</div>
                                <div className="text-xs text-white/65">BMO Private Wealth</div>
                              </div>
                            </button>

                            {/* Financial Advisor */}
                            <button
                              onClick={() => {
                                scrollToSection(getExperienceId('TD Canada Trust', 'Financial Advisor'));
                                setOpenDropdown(null);
                              }}
                              className="w-full text-left hover:bg-white/10 rounded-lg p-3 transition-all duration-200 group"
                            >
                              <div className="space-y-1">
                                <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors duration-200">Financial Advisor</div>
                                <div className="text-xs text-white/65">TD Canada Trust</div>
                              </div>
                            </button>

                            {/* Banking Advisor */}
                            <button
                              onClick={() => {
                                scrollToSection(getExperienceId('Royal Bank of Canada', 'Banking Advisor'));
                                setOpenDropdown(null);
                              }}
                              className="w-full text-left hover:bg-white/10 rounded-lg p-3 transition-all duration-200 group"
                            >
                              <div className="space-y-1">
                                <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors duration-200">Banking Advisor</div>
                                <div className="text-xs text-white/65">Royal Bank of Canada</div>
                              </div>
                            </button>

                            {/* Client Advisor Intern */}
                            <button
                              onClick={() => {
                                scrollToSection(getExperienceId('Royal Bank of Canada', 'Client Advisor Intern'));
                                setOpenDropdown(null);
                              }}
                              className="w-full text-left hover:bg-white/10 rounded-lg p-3 transition-all duration-200 group"
                            >
                              <div className="space-y-1">
                                <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors duration-200">Client Advisor Intern</div>
                                <div className="text-xs text-white/65">Royal Bank of Canada</div>
                              </div>
                            </button>

                            {/* Marketing Intern */}
                            <button
                              onClick={() => {
                                scrollToSection(getExperienceId('Irving Oil Limited', 'Marketing Intern'));
                                setOpenDropdown(null);
                              }}
                              className="w-full text-left hover:bg-white/10 rounded-lg p-3 transition-all duration-200 group"
                            >
                              <div className="space-y-1">
                                <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors duration-200">Marketing Intern</div>
                                <div className="text-xs text-white/65">Irving Oil Limited</div>
                              </div>
                            </button>

                            {/* Tax Return Intern */}
                            <button
                              onClick={() => {
                                scrollToSection(getExperienceId('Grant Thornton LLP', 'Tax Return Intern'));
                                setOpenDropdown(null);
                              }}
                              className="w-full text-left hover:bg-white/10 rounded-lg p-3 transition-all duration-200 group"
                            >
                              <div className="space-y-1">
                                <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors duration-200">Tax Return Intern</div>
                                <div className="text-xs text-white/65">Grant Thornton LLP</div>
                              </div>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Certifications */}
                  <div
                    className="relative dropdown-container"
                    onMouseEnter={() => handleDropdownEnter('certifications')}
                    onMouseLeave={handleDropdownLeave}
                  >
                    <button
                      onClick={(e) => { if (window.matchMedia('(pointer: coarse)').matches || e.detail === 0) { e.preventDefault(); setOpenDropdown(openDropdown === 'certifications' ? null : 'certifications'); } else { scrollToSection('#certifications'); } }}
                      aria-expanded={openDropdown === 'certifications'}
                      aria-controls="resume-certifications-dropdown"
                      className={navSectionButtonClasses(currentSection === 'certifications')}
                    >
                      Certifications
                      <ChevronDown size={14} className={`transition-transform duration-200 ${openDropdown === 'certifications' ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Certifications Dropdown */}
                    {openDropdown === 'certifications' && (
                      <div id="resume-certifications-dropdown" className="absolute top-full left-0 -mt-1 w-80 z-[55] pt-1">
                        <div
                          className="liquid-glass-panel rounded-xl p-4 transition-all duration-200 mt-1"
                          onMouseEnter={() => handleDropdownContentEnter('certifications')}
                          onMouseLeave={handleDropdownContentLeave}
                        >
                          <div className="space-y-3">
                            {/* CFA Level I Candidate */}
                            <button
                              onClick={() => {
                                scrollToSection(getCertificationId('CFA Level I Candidate'));
                                setOpenDropdown(null);
                              }}
                              className="w-full text-left hover:bg-white/10 rounded-lg p-3 transition-all duration-200 group"
                            >
                              <div className="space-y-1">
                                <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors duration-200">CFA Level I Candidate</div>
                                <div className="text-xs text-white/65">CFA Institute</div>
                              </div>
                            </button>

                          {/* GRE General Test */}
                            <button
                              onClick={() => {
                                scrollToSection(getCertificationId('GRE General Test'));
                                setOpenDropdown(null);
                              }}
                              className="w-full text-left hover:bg-white/10 rounded-lg p-3 transition-all duration-200 group"
                            >
                              <div className="space-y-1">
                              <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors duration-200">GRE General Test</div>
                                <div className="text-xs text-white/65">ETS</div>
                              </div>
                            </button>

                            {/* Investment & Markets */}
                            <button
                              onClick={() => {
                                scrollToSection(getCertificationCategoryId('Investment & Markets'));
                                setOpenDropdown(null);
                              }}
                              className="w-full text-left hover:bg-white/10 rounded-lg p-3 transition-all duration-200 group"
                            >
                              <div className="space-y-1">
                                <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors duration-200">Investment & Markets</div>
                                <div className="text-xs text-white/65">CFA, valuation, Bloomberg</div>
                              </div>
                            </button>

                            {/* Advisory & Wealth Planning */}
                            <button
                              onClick={() => {
                                scrollToSection(getCertificationCategoryId('Advisory & Wealth Planning'));
                                setOpenDropdown(null);
                              }}
                              className="w-full text-left hover:bg-white/10 rounded-lg p-3 transition-all duration-200 group"
                            >
                              <div className="space-y-1">
                                <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors duration-200">Advisory & Wealth Planning</div>
                                <div className="text-xs text-white/65">CSI licensing &amp; planning</div>
                              </div>
                            </button>

                            {/* Quantitative & Statistical Methods */}
                            <button
                              onClick={() => {
                                scrollToSection(getCertificationCategoryId('Quantitative & Statistical Methods'));
                                setOpenDropdown(null);
                              }}
                              className="w-full text-left hover:bg-white/10 rounded-lg p-3 transition-all duration-200 group"
                            >
                              <div className="space-y-1">
                                <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors duration-200">Quantitative &amp; Statistical Methods</div>
                                <div className="text-xs text-white/65">Modeling, inference, and mathematical foundations</div>
                              </div>
                            </button>

                            {/* Data & Business Intelligence */}
                            <button
                              onClick={() => {
                                scrollToSection(getCertificationCategoryId('Data & Business Intelligence'));
                                setOpenDropdown(null);
                              }}
                              className="w-full text-left hover:bg-white/10 rounded-lg p-3 transition-all duration-200 group"
                            >
                              <div className="space-y-1">
                                <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors duration-200">Data &amp; Business Intelligence</div>
                                <div className="text-xs text-white/65">Analytics, visualization, and automation</div>
                              </div>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Community */}
                  <div
                    className="relative dropdown-container"
                    onMouseEnter={() => handleDropdownEnter('community')}
                    onMouseLeave={handleDropdownLeave}
                  >
                    <button
                      onClick={(e) => { if (window.matchMedia('(pointer: coarse)').matches || e.detail === 0) { e.preventDefault(); setOpenDropdown(openDropdown === 'community' ? null : 'community'); } else { scrollToSection(getCommunityId('United Way')); } }}
                      aria-expanded={openDropdown === 'community'}
                      aria-controls="resume-community-dropdown"
                      className={navSectionButtonClasses(currentSection === 'community')}
                    >
                      Community
                      <ChevronDown size={14} className={`transition-transform duration-200 ${openDropdown === 'community' ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Community Dropdown */}
                    {openDropdown === 'community' && (
                      <div id="resume-community-dropdown" className="absolute top-full left-0 -mt-1 w-80 z-[55] pt-1">
                        <div
                          className="liquid-glass-panel rounded-xl p-4 transition-all duration-200 mt-1"
                          onMouseEnter={() => handleDropdownEnter('community')}
                          onMouseLeave={handleDropdownLeave}
                        >
                          <div className="space-y-3">
                            {/* Next Gen Ambassador */}
                            <button
                              onClick={() => {
                                scrollToSection(getCommunityId('United Way'));
                                setOpenDropdown(null);
                              }}
                              className="w-full text-left hover:bg-white/10 rounded-lg p-3 transition-all duration-200 group"
                            >
                              <div className="space-y-1">
                                <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors duration-200">Next Gen Ambassador</div>
                                <div className="text-xs text-white/65">United Way</div>
                              </div>
                            </button>

                            {/* Student Ambassador */}
                            <button
                              onClick={() => {
                                scrollToSection(getCommunityId('Royal Bank of Canada'));
                                setOpenDropdown(null);
                              }}
                              className="w-full text-left hover:bg-white/10 rounded-lg p-3 transition-all duration-200 group"
                            >
                              <div className="space-y-1">
                                <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors duration-200">Student Ambassador</div>
                                <div className="text-xs text-white/65">Royal Bank of Canada</div>
                              </div>
                            </button>

                            {/* Volunteer Staff */}
                            <button
                              onClick={() => {
                                scrollToSection(getCommunityId('Irving Oil Limited'));
                                setOpenDropdown(null);
                              }}
                              className="w-full text-left hover:bg-white/10 rounded-lg p-3 transition-all duration-200 group"
                            >
                              <div className="space-y-1">
                                <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors duration-200">Volunteer Staff</div>
                                <div className="text-xs text-white/65">Irving Oil Limited</div>
                              </div>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Contact */}
                  <div
                    className="relative dropdown-container"
                    onMouseEnter={() => handleDropdownEnter('contact')}
                    onMouseLeave={handleDropdownLeave}
                  >
                    <button
                      onClick={(e) => { if (window.matchMedia('(pointer: coarse)').matches || e.detail === 0) { e.preventDefault(); setOpenDropdown(openDropdown === 'contact' ? null : 'contact'); } else { scrollToSection('#contact'); } }}
                      aria-expanded={openDropdown === 'contact'}
                      aria-controls="resume-contact-dropdown"
                      className={navSectionButtonClasses(currentSection === 'contact')}
                    >
                      Contact
                      <ChevronDown size={14} className={`transition-transform duration-200 ${openDropdown === 'contact' ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Contact Dropdown */}
                    {openDropdown === 'contact' && (
                      <div id="resume-contact-dropdown" className="absolute top-full left-0 -mt-1 w-80 z-[55] pt-1">
                        <div
                          className="liquid-glass-panel rounded-xl p-4 transition-all duration-200 mt-1"
                          onMouseEnter={() => handleDropdownEnter('contact')}
                          onMouseLeave={handleDropdownLeave}
                        >
                          <div className="space-y-3">
                            {/* Email */}
                            <a
                              href="mailto:tyler.bustard@mail.mcgill.ca"
                              onClick={() => setOpenDropdown(null)}
                              className="block w-full text-left hover:bg-white/10 rounded-lg p-3 transition-all duration-200 group"
                            >
                              <div className="space-y-1">
                                <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors duration-200">Email</div>
                                <div className="text-xs text-white/65">tyler.bustard@mail.mcgill.ca</div>
                              </div>
                            </a>

                            {/* Phone */}
                            <a
                              href="tel:+16139851223"
                              onClick={() => setOpenDropdown(null)}
                              className="block w-full text-left hover:bg-white/10 rounded-lg p-3 transition-all duration-200 group"
                            >
                              <div className="space-y-1">
                                <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors duration-200">Phone</div>
                                <div className="text-xs text-white/65">(613) 985-1223</div>
                              </div>
                            </a>


                            {/* Location */}
                            <button
                              onClick={() => {
                                scrollToSection('#contact');
                                setOpenDropdown(null);
                              }}
                              className="w-full text-left hover:bg-white/10 rounded-lg p-3 transition-all duration-200 group"
                            >
                              <div className="space-y-1">
                                <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors duration-200">Location</div>
                                <div className="text-xs text-white/65">Montreal, Canada</div>
                              </div>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Home Page Navigation - With Dropdowns */}

              {/* Education */}
              {isHomePage && (
                <div
                  className="relative dropdown-container"
                  onMouseEnter={() => handleDropdownEnter('education')}
                  onMouseLeave={handleDropdownLeave}
                >
                  <button
                    onClick={(e) => { if (window.matchMedia('(pointer: coarse)').matches || e.detail === 0) { e.preventDefault(); setOpenDropdown(openDropdown === 'education' ? null : 'education'); } else { scrollToSection('#education'); } }}
                    aria-expanded={openDropdown === 'education'}
                    aria-controls="home-education-dropdown"
                    className={navSectionButtonClasses(currentSection === 'education')}
                  >
                    Education
                    <ChevronDown size={14} className={`transition-transform duration-200 ${openDropdown === 'education' ? 'rotate-180' : ''}`} />
                  </button>
                  {openDropdown === 'education' && (
                    <div id="home-education-dropdown" className="absolute top-full left-0 -mt-1 w-80 z-[55] pt-1">
                      <div
                        className="liquid-glass-panel rounded-xl p-4 transition-all duration-200 mt-1"
                        onMouseEnter={() => handleDropdownContentEnter('education')}
                        onMouseLeave={handleDropdownContentLeave}
                      >
                        <div className="space-y-3">
                          {educationDropdownItems.map((item) => (
                            <button
                              key={item.title}
                              onClick={() => { scrollToSection(item.target); setOpenDropdown(null); }}
                              className="w-full text-left hover:bg-white/10 rounded-lg p-3 transition-all duration-200 group"
                            >
                              <div className="space-y-1">
                                <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors duration-200">{item.title}</div>
                                <div className="text-xs text-white/65">{item.subtitle}</div>
                                <div className="text-xs text-white/70">{item.detail}</div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Experience */}
              {isHomePage && (
                <div
                  className="relative dropdown-container"
                  onMouseEnter={() => handleDropdownEnter('experience')}
                  onMouseLeave={handleDropdownLeave}
                >
                  <button
                    onClick={(e) => { if (window.matchMedia('(pointer: coarse)').matches || e.detail === 0) { e.preventDefault(); setOpenDropdown(openDropdown === 'experience' ? null : 'experience'); } else { scrollToSection('#experience'); } }}
                    aria-expanded={openDropdown === 'experience'}
                    aria-controls="home-experience-dropdown"
                    className={navSectionButtonClasses(currentSection === 'experience')}
                  >
                    Experience
                    <ChevronDown size={14} className={`transition-transform duration-200 ${openDropdown === 'experience' ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Experience Dropdown */}
                  {openDropdown === 'experience' && (
                    <div id="home-experience-dropdown" className="absolute top-full left-0 -mt-1 w-80 z-[55] pt-1">
                      <div
                        className="liquid-glass-panel rounded-xl p-4 transition-all duration-200 mt-1"

                        onMouseEnter={() => handleDropdownEnter('experience')}
                        onMouseLeave={handleDropdownLeave}
                        >
                          <div className="space-y-2 max-h-96 overflow-y-auto">
                          {/* Senior Associate, Portfolio Monitoring */}
                          <button
                            onClick={() => {
                              scrollToSection(getExperienceId('73 Strings', 'Senior Associate, Portfolio Monitoring'));
                              setOpenDropdown(null);
                            }}
                            className="w-full text-left hover:bg-white/10 rounded-lg p-3 transition-all duration-200 group"
                          >
                            <div className="space-y-1">
                              <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors duration-200">Senior Associate, Portfolio Monitoring</div>
                              <div className="text-xs text-white/65">73 Strings</div>
                            </div>
                          </button>

                          {/* Equity Analyst */}
                          <button
                            onClick={() => {
                              scrollToSection(getExperienceId('ROI', 'Equity Analyst'));
                              setOpenDropdown(null);
                            }}
                            className="w-full text-left hover:bg-white/10 rounded-lg p-3 transition-all duration-200 group"
                          >
                            <div className="space-y-1">
                              <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors duration-200">Equity Analyst</div>
                              <div className="text-xs text-white/65">ROI</div>
                            </div>
                          </button>

                          {/* Portfolio Assistant */}
                          <button
                            onClick={() => {
                              scrollToSection(getExperienceId('BMO Private Wealth', 'Portfolio Assistant'));
                              setOpenDropdown(null);
                            }}
                            className="w-full text-left hover:bg-white/10 rounded-lg p-3 transition-all duration-200 group"
                          >
                            <div className="space-y-1">
                              <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors duration-200">Portfolio Assistant</div>
                              <div className="text-xs text-white/65">BMO Private Wealth</div>
                            </div>
                          </button>

                          {/* Financial Advisor */}
                          <button
                            onClick={() => {
                              scrollToSection(getExperienceId('TD Canada Trust', 'Financial Advisor'));
                              setOpenDropdown(null);
                            }}
                            className="w-full text-left hover:bg-white/10 rounded-lg p-3 transition-all duration-200 group"
                          >
                            <div className="space-y-1">
                              <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors duration-200">Financial Advisor</div>
                              <div className="text-xs text-white/65">TD Canada Trust</div>
                            </div>
                          </button>

                          {/* Banking Advisor */}
                          <button
                            onClick={() => {
                              scrollToSection(getExperienceId('Royal Bank of Canada', 'Banking Advisor'));
                              setOpenDropdown(null);
                            }}
                            className="w-full text-left hover:bg-white/10 rounded-lg p-3 transition-all duration-200 group"
                          >
                            <div className="space-y-1">
                              <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors duration-200">Banking Advisor</div>
                              <div className="text-xs text-white/65">Royal Bank of Canada</div>
                            </div>
                          </button>

                          {/* Client Advisor Intern */}
                          <button
                            onClick={() => {
                              scrollToSection(getExperienceId('Royal Bank of Canada', 'Client Advisor Intern'));
                              setOpenDropdown(null);
                            }}
                            className="w-full text-left hover:bg-white/10 rounded-lg p-3 transition-all duration-200 group"
                          >
                            <div className="space-y-1">
                              <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors duration-200">Client Advisor Intern</div>
                              <div className="text-xs text-white/65">Royal Bank of Canada</div>
                            </div>
                          </button>

                          {/* Marketing Intern */}
                          <button
                            onClick={() => {
                              scrollToSection(getExperienceId('Irving Oil Limited', 'Marketing Intern'));
                              setOpenDropdown(null);
                            }}
                            className="w-full text-left hover:bg-white/10 rounded-lg p-3 transition-all duration-200 group"
                          >
                            <div className="space-y-1">
                              <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors duration-200">Marketing Intern</div>
                              <div className="text-xs text-white/65">Irving Oil Limited</div>
                            </div>
                          </button>

                          {/* Tax Return Intern */}
                          <button
                            onClick={() => {
                              scrollToSection(getExperienceId('Grant Thornton LLP', 'Tax Return Intern'));
                              setOpenDropdown(null);
                            }}
                            className="w-full text-left hover:bg-white/10 rounded-lg p-3 transition-all duration-200 group"
                          >
                            <div className="space-y-1">
                              <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors duration-200">Tax Return Intern</div>
                              <div className="text-xs text-white/65">Grant Thornton LLP</div>
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Certifications */}
              {isHomePage && (
                <div
                  className="relative dropdown-container"
                  onMouseEnter={() => handleDropdownEnter('certifications')}
                  onMouseLeave={handleDropdownLeave}
                >
                  <button
                    onClick={(e) => { if (window.matchMedia('(pointer: coarse)').matches || e.detail === 0) { e.preventDefault(); setOpenDropdown(openDropdown === 'certifications' ? null : 'certifications'); } else { scrollToSection('#certifications'); } }}
                    aria-expanded={openDropdown === 'certifications'}
                    aria-controls="home-certifications-dropdown"
                    className={navSectionButtonClasses(
                      currentSection === 'certifications' || currentSection === 'skills',
                    )}
                  >
                    Certifications
                    <ChevronDown size={14} className={`transition-transform duration-200 ${openDropdown === 'certifications' ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Certifications Dropdown */}
                  {openDropdown === 'certifications' && (
                    <div id="home-certifications-dropdown" className="absolute top-full left-0 -mt-1 w-80 z-[55] pt-1">
                      <div
                        className="liquid-glass-panel rounded-xl p-4 transition-all duration-200 mt-1"

                      >
                        <div className="space-y-3">
                          <button
                            onClick={() => {
                              scrollToSection('#core-cert-cfa-level-i-candidate');
                              setOpenDropdown(null);
                            }}
                            className="w-full text-left hover:bg-white/10 rounded-lg p-3 transition-all duration-200 group"
                          >
                            <div className="space-y-1">
                              <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors duration-200">CFA Level I Candidate</div>
                              <div className="text-xs text-white/65">CFA Institute · 2026</div>
                            </div>
                          </button>

                          <button
                            onClick={() => {
                              scrollToSection('#core-cert-canadian-securities-course');
                              setOpenDropdown(null);
                            }}
                            className="w-full text-left hover:bg-white/10 rounded-lg p-3 transition-all duration-200 group"
                          >
                            <div className="space-y-1">
                              <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors duration-200">Canadian Securities Course</div>
                              <div className="text-xs text-white/65">Canadian Securities Institute · 2021</div>
                            </div>
                          </button>

                          <button
                            onClick={() => {
                              scrollToSection('#core-cert-bloomberg-market-concepts');
                              setOpenDropdown(null);
                            }}
                            className="w-full text-left hover:bg-white/10 rounded-lg p-3 transition-all duration-200 group"
                          >
                            <div className="space-y-1">
                              <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors duration-200">Bloomberg Market Concepts</div>
                              <div className="text-xs text-white/65">Bloomberg · 2019</div>
                            </div>
                          </button>

                          <button
                            onClick={() => {
                              scrollToSection('#core-cert-discounted-cash-flow-analysis-and-modeling');
                              setOpenDropdown(null);
                            }}
                            className="w-full text-left hover:bg-white/10 rounded-lg p-3 transition-all duration-200 group"
                          >
                            <div className="space-y-1">
                              <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors duration-200">Discounted Cash Flow Analysis and Modeling</div>
                              <div className="text-xs text-white/65">Training The Street · 2024</div>
                            </div>
                          </button>

                          <button
                            onClick={() => {
                              scrollToSection('#core-cert-ai-fluency--framework-and-foundations');
                              setOpenDropdown(null);
                            }}
                            className="w-full text-left hover:bg-white/10 rounded-lg p-3 transition-all duration-200 group"
                          >
                            <div className="space-y-1">
                              <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors duration-200">AI Fluency: Framework and Foundations</div>
                              <div className="text-xs text-white/65">Anthropic · 2026</div>
                            </div>
                          </button>

                          <button
                            onClick={() => {
                              scrollToSection('#core-cert-gre-general-test');
                              setOpenDropdown(null);
                            }}
                            className="w-full text-left hover:bg-white/10 rounded-lg p-3 transition-all duration-200 group"
                          >
                            <div className="space-y-1">
                              <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors duration-200">GRE General Test</div>
                              <div className="text-xs text-white/65">ETS · 2024 · 328 total; 170 Quantitative</div>
                            </div>
                          </button>

                          <div className="border-t border-white/10 pt-2">
                          <button
                            onClick={() => {
                              scrollToSection('#certifications');
                              setOpenDropdown(null);
                            }}
                            className="w-full text-left hover:bg-white/10 rounded-lg p-3 transition-all duration-200 group"
                          >
                            <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors duration-200">All certifications →</div>
                          </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Community */}
              {isHomePage && (
                <div
                  className="relative dropdown-container"
                  onMouseEnter={() => handleDropdownEnter('community')}
                  onMouseLeave={handleDropdownLeave}
                >
                  <button
                    onClick={(e) => { if (window.matchMedia('(pointer: coarse)').matches || e.detail === 0) { e.preventDefault(); setOpenDropdown(openDropdown === 'community' ? null : 'community'); } else { scrollToSection('#community'); } }}
                    aria-expanded={openDropdown === 'community'}
                    aria-controls="home-community-dropdown"
                    className={navSectionButtonClasses(currentSection === 'community')}
                  >
                    Community
                    <ChevronDown size={14} className={`transition-transform duration-200 ${openDropdown === 'community' ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Community Dropdown */}
                  {openDropdown === 'community' && (
                    <div id="home-community-dropdown" className="absolute top-full left-0 -mt-1 w-80 z-[55] pt-1">
                      <div
                        className="liquid-glass-panel rounded-xl p-4 transition-all duration-200 mt-1"

                        onMouseEnter={() => handleDropdownContentEnter('community')}
                        onMouseLeave={handleDropdownContentLeave}
                      >
                        <div className="space-y-3">
                          {/* Next Gen Ambassador */}
                          <button
                            onClick={() => {
                              scrollToSection(getCommunityId('United Way'));
                              setOpenDropdown(null);
                            }}
                            className="w-full text-left hover:bg-white/10 rounded-lg p-3 transition-all duration-200 group"
                          >
                            <div className="space-y-1">
                              <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors duration-200">Next Gen Ambassador</div>
                              <div className="text-xs text-white/65">United Way</div>
                            </div>
                          </button>

                          {/* Student Ambassador */}
                          <button
                            onClick={() => {
                              scrollToSection(getCommunityId('Royal Bank of Canada'));
                              setOpenDropdown(null);
                            }}
                            className="w-full text-left hover:bg-white/10 rounded-lg p-3 transition-all duration-200 group"
                          >
                            <div className="space-y-1">
                              <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors duration-200">Student Ambassador</div>
                              <div className="text-xs text-white/65">Royal Bank of Canada</div>
                            </div>
                          </button>

                          {/* Volunteer Staff */}
                          <button
                            onClick={() => {
                              scrollToSection(getCommunityId('Irving Oil Limited'));
                              setOpenDropdown(null);
                            }}
                            className="w-full text-left hover:bg-white/10 rounded-lg p-3 transition-all duration-200 group"
                          >
                            <div className="space-y-1">
                              <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors duration-200">Volunteer Staff</div>
                              <div className="text-xs text-white/65">Irving Oil Limited</div>
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Contact */}
              {isHomePage && (
                <div
                  className="relative dropdown-container"
                  onMouseEnter={() => handleDropdownEnter('contact')}
                  onMouseLeave={handleDropdownLeave}
                >
                  <button
                    onClick={(e) => { if (window.matchMedia('(pointer: coarse)').matches || e.detail === 0) { e.preventDefault(); setOpenDropdown(openDropdown === 'contact' ? null : 'contact'); } else { scrollToSection('#contact'); } }}
                    aria-expanded={openDropdown === 'contact'}
                    aria-controls="home-contact-dropdown"
                    className={navSectionButtonClasses(currentSection === 'contact')}
                  >
                    Contact
                    <ChevronDown size={14} className={`transition-transform duration-200 ${openDropdown === 'contact' ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Contact Dropdown */}
                  {openDropdown === 'contact' && (
                    <div id="home-contact-dropdown" className="absolute top-full left-0 -mt-1 w-72 z-[55] pt-1">
                      <div
                        className="liquid-glass-panel rounded-xl p-4 transition-all duration-200 mt-1"

                      >
                        <div className="space-y-3">
                          {/* Email */}
                          <a
                            href="mailto:tyler.bustard@mail.mcgill.ca"
                            onClick={() => setOpenDropdown(null)}
                            className="block w-full text-left hover:bg-white/10 rounded-lg p-3 transition-all duration-200 group"
                          >
                            <div className="space-y-1">
                              <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors duration-200">Email</div>
                              <div className="text-xs text-white/65">tyler.bustard@mail.mcgill.ca</div>
                            </div>
                          </a>

                          {/* Phone */}
                          <a
                            href="tel:+16139851223"
                            onClick={() => setOpenDropdown(null)}
                            className="block w-full text-left hover:bg-white/10 rounded-lg p-3 transition-all duration-200 group"
                          >
                            <div className="space-y-1">
                              <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors duration-200">Phone</div>
                              <div className="text-xs text-white/65">(613) 985-1223</div>
                            </div>
                          </a>


                          {/* Location */}
                          <button
                            onClick={() => {
                              scrollToSection('#contact');
                              setOpenDropdown(null);
                            }}
                            className="w-full text-left hover:bg-white/10 rounded-lg p-3 transition-all duration-200 group"
                          >
                            <div className="space-y-1">
                              <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors duration-200">Location</div>
                              <div className="text-xs text-white/65">Montreal, Canada</div>
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right side */}
            <div className={`flex items-center justify-self-end space-x-3 transition-opacity duration-300 ${showNavContent ? 'opacity-100' : 'opacity-0'}`}>

              {/* Desktop Resume Actions - Only on Resume Page */}
              {isResumePage && (
                <div className="resume-nav-actions hidden lg:flex" aria-label="Resume actions">
                  <a
                    href={canonicalResumePdfPath}
                    download="Tyler-Bustard-Resume.pdf"
                    className="resume-nav-action resume-nav-action-primary"
                    aria-label="Download PDF"
                  >
                    <Download size={16} />
                    <span className="resume-nav-action-label">Download PDF</span>
                  </a>
                  <a
                    href={emailResumeHref}
                    className="resume-nav-action resume-nav-action-secondary"
                    aria-label="Email PDF"
                  >
                    <Mail size={16} />
                    <span className="resume-nav-action-label">Email PDF</span>
                  </a>
                  <button
                    type="button"
                    className="resume-nav-action resume-nav-action-secondary"
                    aria-label="Print PDF"
                    onClick={handlePrintPdf}
                  >
                    <Printer size={16} />
                    <span className="resume-nav-action-label">Print PDF</span>
                  </button>
                </div>
              )}

              {/* Desktop Resume/Close Button */}
              <div className="hidden lg:block">
                <button
                  onClick={() => {
                    if (isResumePage) {
                      // Always go to home page, not back in history
                      window.location.href = '/';
                    } else if (isUploadPage) {
                      // Go to home page for the upload-resume page
                      window.location.href = '/';
                      } else {
                      window.location.href = '/resume';
                    }
                  }}
                  className="px-4 py-1.5 text-xs font-medium rounded-full bg-white text-slate-950 hover:bg-white/90 transition-all duration-200"
                >
                  {isResumePage ? 'Close' : isUploadPage ? 'Home' : 'Resume'}
                </button>
              </div>

              {/* Mobile Resume Actions - Only on Resume Page */}
              {isResumePage && (
                <div className="resume-nav-actions-mobile lg:hidden" aria-label="Resume actions">
                  <a
                    href={canonicalResumePdfPath}
                    download="Tyler-Bustard-Resume.pdf"
                    className="resume-nav-action-mobile resume-nav-action-mobile-primary"
                    aria-label="Download PDF"
                  >
                    <Download size={18} />
                  </a>
                  <a
                    href={emailResumeHref}
                    className="resume-nav-action-mobile resume-nav-action-mobile-secondary"
                    aria-label="Email PDF"
                  >
                    <Mail size={18} />
                  </a>
                  <button
                    type="button"
                    className="resume-nav-action-mobile resume-nav-action-mobile-secondary"
                    aria-label="Print PDF"
                    onClick={handlePrintPdf}
                  >
                    <Printer size={18} />
                  </button>
                </div>
              )}

              {/* Mobile Menu Button */}
              {(isResumePage || isUploadPage) ? (
                <button
                  onClick={() => {
                    // Always go to home page, not back in history
                    window.location.href = '/';
                  }}
                  className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-all duration-200 active:scale-95"
                  aria-label={isResumePage ? "Close resume" : "Go to home"}
                >
                  <X size={20} />
                </button>
              ) : (
                <button
                  ref={mobileMenuButtonRef}
                  onClick={() => setIsMobileMenuOpen((isOpen) => !isOpen)}
                  className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-all duration-200 active:scale-95"
                  aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                  aria-expanded={isMobileMenuOpen}
                  aria-controls="mobile-menu-panel"
                >
                  {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
              )}
            </div>
          </div>
        </div>
        )}
      </nav>

      {/* Mobile Menu - Clean Glass Effect */}
      {isMobileMenuOpen && !isResumePage && !isUploadPage && (
        <div className="fixed inset-0 z-[60] lg:hidden animate-in fade-in duration-200">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div
            id="mobile-menu-panel"
            ref={mobileMenuDialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="mobile-menu-title"
            className="absolute inset-x-0 top-0 h-full overflow-y-auto animate-in slide-in-from-top duration-300"
            style={{
              background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.92), rgba(15, 23, 42, 0.85))',
              backdropFilter: 'blur(28px) saturate(180%)',
              WebkitBackdropFilter: 'blur(28px) saturate(180%)',
              boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.16)'
            }}
          >
            <div className="p-6 pt-20">
              {/* Close Button at top */}
              <div className="flex justify-between items-center mb-6">
                <h2 id="mobile-menu-title" className="text-xl font-bold text-white">Menu</h2>
                <button
                  ref={mobileMenuCloseButtonRef}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                  aria-label="Close menu"
                >
                  <X size={24} className="text-white/70" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Mobile Navigation Links */}
                {isHomePage && (
                  <>
                    <button
                      onClick={() => {
                        scrollToSection('#education');
                        setIsMobileMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-3 text-lg font-medium text-white hover:bg-white/10 rounded-lg transition-all duration-200 active:scale-98"
                    >
                      Education
                    </button>
                    <button
                      onClick={() => {
                        scrollToSection('#experience');
                        setIsMobileMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-3 text-lg font-medium text-white hover:bg-white/10 rounded-lg transition-all duration-200 active:scale-98"
                    >
                      Experience
                    </button>
                    <button
                      onClick={() => {
                        scrollToSection('#certifications');
                        setIsMobileMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-3 text-lg font-medium text-white hover:bg-white/10 rounded-lg transition-all duration-200 active:scale-98"
                    >
                      Certifications
                    </button>
                    <button
                      onClick={() => {
                        scrollToSection('#community');
                        setIsMobileMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-3 text-lg font-medium text-white hover:bg-white/10 rounded-lg transition-colors"
                    >
                      Community
                    </button>
                    <button
                      onClick={() => {
                        scrollToSection('#contact');
                        setIsMobileMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-3 text-lg font-medium text-white hover:bg-white/10 rounded-lg transition-colors"
                    >
                      Contact
                    </button>
                  </>
                )}

                {/* Resume Button */}
                <button
                  onClick={() => {
                    if (isResumePage) {
                      // Always go to home page, not back in history
                      window.location.href = '/';
                    } else if (isUploadPage) {
                      // Go to home page for the upload-resume page
                      window.location.href = '/';
                      } else {
                      window.location.href = '/resume';
                    }
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full px-4 py-3 text-lg font-medium bg-white text-slate-900 rounded-lg hover:bg-white/90 transition-colors"
                >
                  {isResumePage ? 'Close Resume' : isUploadPage ? 'Home' : 'Resume'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


    </>
  );
}
