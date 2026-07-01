import { useState, useEffect, useRef } from "react";
import { ChevronDown, Download, Mail, Menu, Printer, X } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import profileImage from "@assets/Untitled design (1)_1755896187722.png";
import { slugify } from "@/lib/utils";

export default function Navigation() {
  const [location] = useLocation();
  const isHomePage = location === '/';
  const isResumePage = location === '/resume';
  const isUploadPage = location === '/upload';
  const isSignInPage = location === '/sign-in';
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
  const navSectionButtonClasses = (isActive: boolean) =>
    `nav-section-button ${isActive ? 'is-active' : ''}`;
  const initialPathRef = useRef(location);
  const shouldPlayHomepageIntro = isHomePage && initialPathRef.current === "/" && typeof window !== "undefined" && !sessionStorage.getItem("homepageIntroPlayed");
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [navExpanded, setNavExpanded] = useState(!shouldPlayHomepageIntro);
  const [showNavContent, setShowNavContent] = useState(!shouldPlayHomepageIntro);
  const [scrollY, setScrollY] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showHomeBrandText, setShowHomeBrandText] = useState(!isHomePage);

  // Dynamic Island: only play the handwritten intro on a true first homepage visit in this session
  useEffect(() => {
    if (!shouldPlayHomepageIntro) {
      setNavExpanded(true);
      setShowNavContent(true);
      return;
    }

    const expandTimer = setTimeout(() => setNavExpanded(true), 1500);
    const contentTimer = setTimeout(() => setShowNavContent(true), 2000);
    try { sessionStorage.setItem("homepageIntroPlayed", "1"); } catch (e) {}

    return () => {
      clearTimeout(expandTimer);
      clearTimeout(contentTimer);
    };
  }, [shouldPlayHomepageIntro]);
  const [currentSection, setCurrentSection] = useState(isHomePage ? 'hero' : '');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);
  const dropdownRef = useRef<string | null>(null);

  // Helper functions for dropdown hover behavior with improved stability
  const handleDropdownEnter = (dropdownName: string) => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    dropdownRef.current = dropdownName;
    setOpenDropdown(dropdownName);
  };

  const handleDropdownLeave = () => {
    const timeout = setTimeout(() => {
      if (dropdownRef.current) {
        dropdownRef.current = null;
        setOpenDropdown(null);
      }
    }, 150); // Optimized delay for better UX
    setHoverTimeout(timeout);
  };

  // Enhanced function to handle dropdown content hover
  const handleDropdownContentEnter = (dropdownName: string) => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    dropdownRef.current = dropdownName;
    setOpenDropdown(dropdownName);
  };

  // Enhanced function to handle dropdown content leave
  const handleDropdownContentLeave = () => {
    const timeout = setTimeout(() => {
      if (dropdownRef.current) {
        dropdownRef.current = null;
        setOpenDropdown(null);
      }
    }, 150); // Consistent delay
    setHoverTimeout(timeout);
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
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
    };
  }, [openDropdown, hoverTimeout, isMobileMenuOpen]);

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
          setScrollY(currentScrollY);
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
    if (!isHomePage && !isResumePage && !isUploadPage && !isSignInPage) {
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
  }, [isHomePage, isResumePage, isUploadPage, isSignInPage]);

  const scrollToSection = (href: string) => {
    // Close dropdown immediately for better UX
    setOpenDropdown(null);
    
    // If on resume page, scroll to resume sections
    if (isResumePage) {
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
          <div className="flex items-center justify-center h-14">
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
            <div className={`nav-brand-slot flex min-w-0 items-center transition-opacity duration-500 ${showNavContent ? 'opacity-100' : 'opacity-0'}`}>
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
            <div className={`hidden min-w-0 lg:flex items-center justify-self-center space-x-1 transition-opacity duration-500 ${showNavContent ? 'opacity-100' : 'opacity-0'}`}>

              {/* Resume Page Navigation - With Dropdowns */}
              {isResumePage && (
                <>
                  {/* Experience */}
                  <div 
                    className="relative dropdown-container"
                    onMouseEnter={() => handleDropdownEnter('experience')}
                    onMouseLeave={handleDropdownLeave}
                  >
                    <button
                      onClick={(e) => { if (window.matchMedia('(pointer: coarse)').matches || e.detail === 0) { e.preventDefault(); setOpenDropdown(openDropdown === 'experience' ? null : 'experience'); } else { scrollToSection('#experience'); } }}
                      aria-haspopup="menu"
                      aria-expanded={openDropdown === 'experience'}
                      className={navSectionButtonClasses(currentSection === 'experience')}
                    >
                      Experience
                      <ChevronDown size={14} className={`transition-transform duration-200 ${openDropdown === 'experience' ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {/* Experience Dropdown */}
                    {openDropdown === 'experience' && (
                      <div className="absolute top-full left-0 -mt-1 w-80 z-[55] pt-1">
                        <div 
                          className="rounded-xl p-4 transition-all duration-200 mt-1" style={{ background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(24px) saturate(180%)', WebkitBackdropFilter: 'blur(24px) saturate(180%)', border: '1px solid rgba(255, 255, 255, 0.08)', boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)' }}
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
                              className="w-full text-left hover:bg-white/5 rounded-lg p-3 transition-all duration-200 group"
                            >
                              <div className="space-y-1">
                                <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors duration-200">Senior Associate, Portfolio Monitoring</div>
                                <div className="text-xs text-white/50">73 Strings</div>
                              </div>
                            </button>

                            {/* Equity Analyst */}
                            <button
                              onClick={() => {
                                scrollToSection(getExperienceId('ROI', 'Equity Analyst'));
                                setOpenDropdown(null);
                              }}
                              className="w-full text-left hover:bg-white/5 rounded-lg p-3 transition-all duration-200 group"
                            >
                              <div className="space-y-1">
                                <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors duration-200">Equity Analyst</div>
                                <div className="text-xs text-white/50">ROI</div>
                              </div>
                            </button>

                            {/* Portfolio Assistant */}
                            <button 
                              onClick={() => {
                                scrollToSection(getExperienceId('BMO Private Wealth', 'Portfolio Assistant'));
                                setOpenDropdown(null);
                              }}
                              className="w-full text-left hover:bg-white/5 rounded-lg p-3 transition-all duration-200 group"
                            >
                              <div className="space-y-1">
                                <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors duration-200">Portfolio Assistant</div>
                                <div className="text-xs text-white/50">BMO Private Wealth</div>
                              </div>
                            </button>

                            {/* Financial Advisor */}
                            <button 
                              onClick={() => {
                                scrollToSection(getExperienceId('TD Canada Trust', 'Financial Advisor'));
                                setOpenDropdown(null);
                              }}
                              className="w-full text-left hover:bg-white/5 rounded-lg p-3 transition-all duration-200 group"
                            >
                              <div className="space-y-1">
                                <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors duration-200">Financial Advisor</div>
                                <div className="text-xs text-white/50">TD Canada Trust</div>
                              </div>
                            </button>

                            {/* Banking Advisor */}
                            <button 
                              onClick={() => {
                                scrollToSection(getExperienceId('Royal Bank of Canada', 'Banking Advisor'));
                                setOpenDropdown(null);
                              }}
                              className="w-full text-left hover:bg-white/5 rounded-lg p-3 transition-all duration-200 group"
                            >
                              <div className="space-y-1">
                                <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors duration-200">Banking Advisor</div>
                                <div className="text-xs text-white/50">Royal Bank of Canada</div>
                              </div>
                            </button>

                            {/* Client Advisor Intern */}
                            <button 
                              onClick={() => {
                                scrollToSection(getExperienceId('Royal Bank of Canada', 'Client Advisor Intern'));
                                setOpenDropdown(null);
                              }}
                              className="w-full text-left hover:bg-white/5 rounded-lg p-3 transition-all duration-200 group"
                            >
                              <div className="space-y-1">
                                <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors duration-200">Client Advisor Intern</div>
                                <div className="text-xs text-white/50">Royal Bank of Canada</div>
                              </div>
                            </button>

                            {/* Marketing Intern */}
                            <button 
                              onClick={() => {
                                scrollToSection(getExperienceId('Irving Oil Limited', 'Marketing Intern'));
                                setOpenDropdown(null);
                              }}
                              className="w-full text-left hover:bg-white/5 rounded-lg p-3 transition-all duration-200 group"
                            >
                              <div className="space-y-1">
                                <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors duration-200">Marketing Intern</div>
                                <div className="text-xs text-white/50">Irving Oil Limited</div>
                              </div>
                            </button>

                            {/* Tax Return Intern */}
                            <button 
                              onClick={() => {
                                scrollToSection(getExperienceId('Grant Thornton LLP', 'Tax Return Intern'));
                                setOpenDropdown(null);
                              }}
                              className="w-full text-left hover:bg-white/5 rounded-lg p-3 transition-all duration-200 group"
                            >
                              <div className="space-y-1">
                                <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors duration-200">Tax Return Intern</div>
                                <div className="text-xs text-white/50">Grant Thornton LLP</div>
                              </div>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Education */}
                  <div
                    className="relative dropdown-container"
                    onMouseEnter={() => handleDropdownEnter('education')}
                    onMouseLeave={handleDropdownLeave}
                  >
                    <button
                      onClick={(e) => { if (window.matchMedia('(pointer: coarse)').matches || e.detail === 0) { e.preventDefault(); setOpenDropdown(openDropdown === 'education' ? null : 'education'); } else { scrollToSection('#education'); } }}
                      aria-haspopup="menu"
                      aria-expanded={openDropdown === 'education'}
                      className={navSectionButtonClasses(currentSection === 'education')}
                    >
                      Education
                      <ChevronDown size={14} className={`transition-transform duration-200 ${openDropdown === 'education' ? 'rotate-180' : ''}`} />
                    </button>

                    {openDropdown === 'education' && (
                      <div className="absolute top-full left-0 -mt-1 w-80 z-[55] pt-1">
                        <div
                          className="rounded-xl p-4 transition-all duration-200 mt-1" style={{ background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(24px) saturate(180%)', WebkitBackdropFilter: 'blur(24px) saturate(180%)', border: '1px solid rgba(255, 255, 255, 0.08)', boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)' }}
                          onMouseEnter={() => handleDropdownContentEnter('education')}
                          onMouseLeave={handleDropdownContentLeave}
                        >
                          <div className="space-y-3">
                            <button
                              onClick={() => {
                                scrollToSection('#education');
                                setOpenDropdown(null);
                              }}
                              className="w-full text-left hover:bg-white/5 rounded-lg p-3 transition-all duration-200 group"
                            >
                              <div className="space-y-1">
                                <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors duration-200">University of New Brunswick</div>
                                <div className="text-xs text-white/50">Bachelor of Business Administration</div>
                                <div className="text-xs text-white/40">Finance Major</div>
                              </div>
                            </button>
                            <button
                              onClick={() => {
                                scrollToSection('#education');
                                setOpenDropdown(null);
                              }}
                              className="w-full text-left hover:bg-white/5 rounded-lg p-3 transition-all duration-200 group"
                            >
                              <div className="space-y-1">
                                <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors duration-200">Northeast Christian College</div>
                                <div className="text-xs text-white/50">Theology Program</div>
                                <div className="text-xs text-white/40">Marketing</div>
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
                      aria-haspopup="menu"
                      aria-expanded={openDropdown === 'certifications'}
                      className={navSectionButtonClasses(currentSection === 'certifications')}
                    >
                      Certifications
                      <ChevronDown size={14} className={`transition-transform duration-200 ${openDropdown === 'certifications' ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {/* Certifications Dropdown */}
                    {openDropdown === 'certifications' && (
                      <div className="absolute top-full left-0 -mt-1 w-80 z-[55] pt-1">
                        <div 
                          className="rounded-xl p-4 transition-all duration-200 mt-1" style={{ background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(24px) saturate(180%)', WebkitBackdropFilter: 'blur(24px) saturate(180%)', border: '1px solid rgba(255, 255, 255, 0.08)', boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)' }}
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
                              className="w-full text-left hover:bg-white/5 rounded-lg p-3 transition-all duration-200 group"
                            >
                              <div className="space-y-1">
                                <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors duration-200">CFA Level I Candidate</div>
                                <div className="text-xs text-white/50">CFA Institute</div>
                              </div>
                            </button>

                          {/* GRE General Test */}
                            <button 
                              onClick={() => {
                                scrollToSection(getCertificationId('GRE General Test'));
                                setOpenDropdown(null);
                              }}
                              className="w-full text-left hover:bg-white/5 rounded-lg p-3 transition-all duration-200 group"
                            >
                              <div className="space-y-1">
                              <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors duration-200">GRE General Test</div>
                                <div className="text-xs text-white/50">Educational Testing Service</div>
                              </div>
                            </button>

                            {/* Investment & Markets */}
                            <button 
                              onClick={() => {
                                scrollToSection(getCertificationCategoryId('Investment & Markets'));
                                setOpenDropdown(null);
                              }}
                              className="w-full text-left hover:bg-white/5 rounded-lg p-3 transition-all duration-200 group"
                            >
                              <div className="space-y-1">
                                <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors duration-200">Investment & Markets</div>
                                <div className="text-xs text-white/50">CFA, valuation, Bloomberg</div>
                              </div>
                            </button>

                            {/* Advisory & Wealth Planning */}
                            <button 
                              onClick={() => {
                                scrollToSection(getCertificationCategoryId('Advisory & Wealth Planning'));
                                setOpenDropdown(null);
                              }}
                              className="w-full text-left hover:bg-white/5 rounded-lg p-3 transition-all duration-200 group"
                            >
                              <div className="space-y-1">
                                <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors duration-200">Advisory & Wealth Planning</div>
                                <div className="text-xs text-white/50">CSI, McGill</div>
                              </div>
                            </button>

                            {/* Data & Business Intelligence */}
                            <button 
                              onClick={() => {
                                scrollToSection(getCertificationCategoryId('Data & Business Intelligence'));
                                setOpenDropdown(null);
                              }}
                              className="w-full text-left hover:bg-white/5 rounded-lg p-3 transition-all duration-200 group"
                            >
                              <div className="space-y-1">
                                <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors duration-200">Data & Business Intelligence</div>
                                <div className="text-xs text-white/50">Google, Tableau, Power BI</div>
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
                      onClick={(e) => { if (window.matchMedia('(pointer: coarse)').matches || e.detail === 0) { e.preventDefault(); setOpenDropdown(openDropdown === 'community' ? null : 'community'); } else { scrollToSection('#community'); } }}
                      aria-haspopup="menu"
                      aria-expanded={openDropdown === 'community'}
                      className={navSectionButtonClasses(currentSection === 'community')}
                    >
                      Community
                      <ChevronDown size={14} className={`transition-transform duration-200 ${openDropdown === 'community' ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {/* Community Dropdown */}
                    {openDropdown === 'community' && (
                      <div className="absolute top-full left-0 -mt-1 w-80 z-[55] pt-1">
                        <div 
                          className="rounded-xl p-4 transition-all duration-200 mt-1" style={{ background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(24px) saturate(180%)', WebkitBackdropFilter: 'blur(24px) saturate(180%)', border: '1px solid rgba(255, 255, 255, 0.08)', boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)' }}
                          onMouseEnter={() => handleDropdownEnter('community')}
                          onMouseLeave={handleDropdownLeave}
                        >
                          <div className="space-y-3">
                            {/* Next Gen Ambassador */}
                            <button 
                              onClick={() => {
                                scrollToSection('#community');
                                setOpenDropdown(null);
                              }}
                              className="w-full text-left hover:bg-white/5 rounded-lg p-3 transition-all duration-200 group"
                            >
                              <div className="space-y-1">
                                <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors duration-200">Next Gen Ambassador</div>
                                <div className="text-xs text-white/50">United Way</div>
                              </div>
                            </button>

                            {/* Student Ambassador */}
                            <button 
                              onClick={() => {
                                scrollToSection('#community');
                                setOpenDropdown(null);
                              }}
                              className="w-full text-left hover:bg-white/5 rounded-lg p-3 transition-all duration-200 group"
                            >
                              <div className="space-y-1">
                                <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors duration-200">Student Ambassador</div>
                                <div className="text-xs text-white/50">Royal Bank of Canada</div>
                              </div>
                            </button>

                            {/* Volunteer Staff */}
                            <button 
                              onClick={() => {
                                scrollToSection('#community');
                                setOpenDropdown(null);
                              }}
                              className="w-full text-left hover:bg-white/5 rounded-lg p-3 transition-all duration-200 group"
                            >
                              <div className="space-y-1">
                                <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors duration-200">Volunteer Staff</div>
                                <div className="text-xs text-white/50">Irving Oil Limited</div>
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
                      aria-haspopup="menu"
                      aria-expanded={openDropdown === 'contact'}
                      className={navSectionButtonClasses(currentSection === 'contact')}
                    >
                      Contact
                      <ChevronDown size={14} className={`transition-transform duration-200 ${openDropdown === 'contact' ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {/* Contact Dropdown */}
                    {openDropdown === 'contact' && (
                      <div className="absolute top-full left-0 -mt-1 w-80 z-[55] pt-1">
                        <div 
                          className="rounded-xl p-4 transition-all duration-200 mt-1" style={{ background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(24px) saturate(180%)', WebkitBackdropFilter: 'blur(24px) saturate(180%)', border: '1px solid rgba(255, 255, 255, 0.08)', boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)' }}
                          onMouseEnter={() => handleDropdownEnter('contact')}
                          onMouseLeave={handleDropdownLeave}
                        >
                          <div className="space-y-3">
                            {/* Email */}
                            <button 
                              onClick={() => {
                                scrollToSection('#contact');
                                setOpenDropdown(null);
                              }}
                              className="w-full text-left hover:bg-white/5 rounded-lg p-3 transition-all duration-200 group"
                            >
                              <div className="space-y-1">
                                <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors duration-200">Email</div>
                <div className="text-xs text-white/50">tyler@tylerbustard.ca</div>
                              </div>
                            </button>

                            {/* Phone */}
                            <button 
                              onClick={() => {
                                scrollToSection('#contact');
                                setOpenDropdown(null);
                              }}
                              className="w-full text-left hover:bg-white/5 rounded-lg p-3 transition-all duration-200 group"
                            >
                              <div className="space-y-1">
                                <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors duration-200">Phone</div>
                                <div className="text-xs text-white/50">(613) 985-1223</div>
                              </div>
                            </button>

                            {/* Location */}
                            <button 
                              onClick={() => {
                                scrollToSection('#contact');
                                setOpenDropdown(null);
                              }}
                              className="w-full text-left hover:bg-white/5 rounded-lg p-3 transition-all duration-200 group"
                            >
                              <div className="space-y-1">
                                <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors duration-200">Location</div>
                                <div className="text-xs text-white/50">Toronto, Ontario</div>
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

              {/* Experience appears first (chronological - most recent) */}

              {/* Experience */}
              {isHomePage && (
                <div 
                  className="relative dropdown-container"
                  onMouseEnter={() => handleDropdownEnter('experience')}
                  onMouseLeave={handleDropdownLeave}
                >
                  <button
                    onClick={(e) => { if (window.matchMedia('(pointer: coarse)').matches || e.detail === 0) { e.preventDefault(); setOpenDropdown(openDropdown === 'experience' ? null : 'experience'); } else { scrollToSection('#experience'); } }}
                    aria-haspopup="menu"
                    aria-expanded={openDropdown === 'experience'}
                    className={navSectionButtonClasses(currentSection === 'experience')}
                  >
                    Experience
                    <ChevronDown size={14} className={`transition-transform duration-200 ${openDropdown === 'experience' ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {/* Experience Dropdown */}
                  {openDropdown === 'experience' && (
                    <div className="absolute top-full left-0 -mt-1 w-80 z-[55] pt-1">
                      <div 
                        className="rounded-xl p-4 transition-all duration-200 mt-1"
                        style={{
                          background: 'rgba(15, 23, 42, 0.85)',
                          backdropFilter: 'blur(24px) saturate(180%)',
                          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)'
                        }}
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
                            className="w-full text-left hover:bg-white/5 rounded-lg p-3 transition-all duration-200 group"
                          >
                            <div className="space-y-1">
                              <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors duration-200">Senior Associate, Portfolio Monitoring</div>
                              <div className="text-xs text-white/50">73 Strings</div>
                            </div>
                          </button>

                          {/* Equity Analyst */}
                          <button
                            onClick={() => {
                              scrollToSection(getExperienceId('ROI', 'Equity Analyst'));
                              setOpenDropdown(null);
                            }}
                            className="w-full text-left hover:bg-white/5 rounded-lg p-3 transition-all duration-200 group"
                          >
                            <div className="space-y-1">
                              <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors duration-200">Equity Analyst</div>
                              <div className="text-xs text-white/50">ROI</div>
                            </div>
                          </button>

                          {/* Portfolio Assistant */}
                          <button 
                            onClick={() => {
                              scrollToSection(getExperienceId('BMO Private Wealth', 'Portfolio Assistant'));
                              setOpenDropdown(null);
                            }}
                            className="w-full text-left hover:bg-white/5 rounded-lg p-3 transition-all duration-200 group"
                          >
                            <div className="space-y-1">
                              <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors duration-200">Portfolio Assistant</div>
                              <div className="text-xs text-white/50">BMO Private Wealth</div>
                            </div>
                          </button>
                          
                          {/* Financial Advisor */}
                          <button 
                            onClick={() => {
                              scrollToSection(getExperienceId('TD Canada Trust', 'Financial Advisor'));
                              setOpenDropdown(null);
                            }}
                            className="w-full text-left hover:bg-white/5 rounded-lg p-3 transition-all duration-200 group"
                          >
                            <div className="space-y-1">
                              <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors duration-200">Financial Advisor</div>
                              <div className="text-xs text-white/50">TD Canada Trust</div>
                            </div>
                          </button>
                          
                          {/* Banking Advisor */}
                          <button 
                            onClick={() => {
                              scrollToSection(getExperienceId('Royal Bank of Canada', 'Banking Advisor'));
                              setOpenDropdown(null);
                            }}
                            className="w-full text-left hover:bg-white/5 rounded-lg p-3 transition-all duration-200 group"
                          >
                            <div className="space-y-1">
                              <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors duration-200">Banking Advisor</div>
                              <div className="text-xs text-white/50">Royal Bank of Canada</div>
                            </div>
                          </button>
                          
                          {/* Client Advisor Intern */}
                          <button 
                            onClick={() => {
                              scrollToSection(getExperienceId('Royal Bank of Canada', 'Client Advisor Intern'));
                              setOpenDropdown(null);
                            }}
                            className="w-full text-left hover:bg-white/5 rounded-lg p-3 transition-all duration-200 group"
                          >
                            <div className="space-y-1">
                              <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors duration-200">Client Advisor Intern</div>
                              <div className="text-xs text-white/50">Royal Bank of Canada</div>
                            </div>
                          </button>
                          
                          {/* Marketing Intern */}
                          <button 
                            onClick={() => {
                              scrollToSection(getExperienceId('Irving Oil Limited', 'Marketing Intern'));
                              setOpenDropdown(null);
                            }}
                            className="w-full text-left hover:bg-white/5 rounded-lg p-3 transition-all duration-200 group"
                          >
                            <div className="space-y-1">
                              <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors duration-200">Marketing Intern</div>
                              <div className="text-xs text-white/50">Irving Oil Limited</div>
                            </div>
                          </button>
                          
                          {/* Tax Return Intern */}
                          <button 
                            onClick={() => {
                              scrollToSection(getExperienceId('Grant Thornton LLP', 'Tax Return Intern'));
                              setOpenDropdown(null);
                            }}
                            className="w-full text-left hover:bg-white/5 rounded-lg p-3 transition-all duration-200 group"
                          >
                            <div className="space-y-1">
                              <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors duration-200">Tax Return Intern</div>
                              <div className="text-xs text-white/50">Grant Thornton LLP</div>
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Education */}
              {isHomePage && (
                <div
                  className="relative dropdown-container"
                  onMouseEnter={() => handleDropdownEnter('education')}
                  onMouseLeave={handleDropdownLeave}
                >
                  <button
                    onClick={(e) => { if (window.matchMedia('(pointer: coarse)').matches || e.detail === 0) { e.preventDefault(); setOpenDropdown(openDropdown === 'education' ? null : 'education'); } else { scrollToSection('#education'); } }}
                    aria-haspopup="menu"
                    aria-expanded={openDropdown === 'education'}
                    className={navSectionButtonClasses(currentSection === 'education')}
                  >
                    Education
                    <ChevronDown size={14} className={`transition-transform duration-200 ${openDropdown === 'education' ? 'rotate-180' : ''}`} />
                  </button>
                  {openDropdown === 'education' && (
                    <div className="absolute top-full left-0 -mt-1 w-80 z-[55] pt-1">
                      <div
                        className="rounded-xl p-4 transition-all duration-200 mt-1" style={{ background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(24px) saturate(180%)', WebkitBackdropFilter: 'blur(24px) saturate(180%)', border: '1px solid rgba(255, 255, 255, 0.08)', boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)' }}
                        onMouseEnter={() => handleDropdownContentEnter('education')}
                        onMouseLeave={handleDropdownContentLeave}
                      >
                        <div className="space-y-3">
                          <button
                            onClick={() => { scrollToSection('#education'); setOpenDropdown(null); }}
                            className="w-full text-left hover:bg-white/5 rounded-lg p-3 transition-all duration-200 group"
                          >
                            <div className="space-y-1">
                              <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors duration-200">University of New Brunswick</div>
                              <div className="text-xs text-white/50">Bachelor of Business Administration</div>
                              <div className="text-xs text-white/40">Finance Major</div>
                            </div>
                          </button>
                          <button
                            onClick={() => { scrollToSection('#education'); setOpenDropdown(null); }}
                            className="w-full text-left hover:bg-white/5 rounded-lg p-3 transition-all duration-200 group"
                          >
                            <div className="space-y-1">
                              <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors duration-200">Northeast Christian College</div>
                              <div className="text-xs text-white/50">Theology Program</div>
                              <div className="text-xs text-white/40">Marketing</div>
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
                    aria-haspopup="menu"
                    aria-expanded={openDropdown === 'certifications'}
                    className={navSectionButtonClasses(
                      currentSection === 'certifications' || currentSection === 'skills',
                    )}
                  >
                    Certifications
                    <ChevronDown size={14} className={`transition-transform duration-200 ${openDropdown === 'certifications' ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {/* Certifications Dropdown */}
                  {openDropdown === 'certifications' && (
                    <div className="absolute top-full left-0 -mt-1 w-80 z-[55] pt-1">
                      <div 
                        className="rounded-xl p-4 transition-all duration-200 mt-1"
                        style={{
                          background: 'rgba(15, 23, 42, 0.85)',
                          backdropFilter: 'blur(24px) saturate(180%)',
                          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)'
                        }}
                      >
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                          {/* Financial Certifications */}
                          <button 
                            onClick={() => {
                              scrollToSection(getCertificationId('CFA Level I Candidate'));
                              setOpenDropdown(null);
                            }}
                            className="w-full text-left hover:bg-white/5 rounded-lg p-3 transition-all duration-200 group"
                          >
                            <div className="space-y-1">
                              <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors duration-200">CFA Level I Candidate</div>
                              <div className="text-xs text-white/50">CFA Institute</div>
                            </div>
                          </button>

                          <button 
                            onClick={() => {
                              scrollToSection(getCertificationId('Discounted Cash Flow Analysis and Modeling'));
                              setOpenDropdown(null);
                            }}
                            className="w-full text-left hover:bg-white/5 rounded-lg p-3 transition-all duration-200 group"
                          >
                            <div className="space-y-1">
                              <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors duration-200">Discounted Cash Flow Analysis and Modeling</div>
                              <div className="text-xs text-white/50">Training The Street</div>
                            </div>
                          </button>

                          <button 
                            onClick={() => {
                              scrollToSection(getCertificationId('Financial Planning 1'));
                              setOpenDropdown(null);
                            }}
                            className="w-full text-left hover:bg-white/5 rounded-lg p-3 transition-all duration-200 group"
                          >
                            <div className="space-y-1">
                              <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors duration-200">Financial Planning 1</div>
                              <div className="text-xs text-white/50">Canadian Securities Institute</div>
                            </div>
                          </button>

                          <button 
                            onClick={() => {
                              scrollToSection(getCertificationId('Certificate in Financial Services Advice'));
                              setOpenDropdown(null);
                            }}
                            className="w-full text-left hover:bg-white/5 rounded-lg p-3 transition-all duration-200 group"
                          >
                            <div className="space-y-1">
                              <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors duration-200">Certificate in Financial Services Advice</div>
                              <div className="text-xs text-white/50">Canadian Securities Institute</div>
                            </div>
                          </button>

                          <button 
                            onClick={() => {
                              scrollToSection(getCertificationId('Personal Financial Service Advice'));
                              setOpenDropdown(null);
                            }}
                            className="w-full text-left hover:bg-white/5 rounded-lg p-3 transition-all duration-200 group"
                          >
                            <div className="space-y-1">
                              <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors duration-200">Personal Financial Service Advice</div>
                              <div className="text-xs text-white/50">Canadian Securities Institute</div>
                            </div>
                          </button>

                          <button 
                            onClick={() => {
                              scrollToSection(getCertificationId('Canadian Securities Course'));
                              setOpenDropdown(null);
                            }}
                            className="w-full text-left hover:bg-white/5 rounded-lg p-3 transition-all duration-200 group"
                          >
                            <div className="space-y-1">
                              <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors duration-200">Canadian Securities Course</div>
                              <div className="text-xs text-white/50">Canadian Securities Institute</div>
                            </div>
                          </button>

                          <button 
                            onClick={() => {
                              scrollToSection(getCertificationId('Financial & Valuation Modeling'));
                              setOpenDropdown(null);
                            }}
                            className="w-full text-left hover:bg-white/5 rounded-lg p-3 transition-all duration-200 group"
                          >
                            <div className="space-y-1">
                              <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors duration-200">Financial & Valuation Modeling</div>
                              <div className="text-xs text-white/50">Wall Street Prep</div>
                            </div>
                          </button>

                          <button 
                            onClick={() => {
                              scrollToSection(getCertificationId('Investment Funds in Canada'));
                              setOpenDropdown(null);
                            }}
                            className="w-full text-left hover:bg-white/5 rounded-lg p-3 transition-all duration-200 group"
                          >
                            <div className="space-y-1">
                              <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors duration-200">Investment Funds in Canada</div>
                              <div className="text-xs text-white/50">Canadian Securities Institute</div>
                            </div>
                          </button>

                          <button 
                            onClick={() => {
                              scrollToSection(getCertificationId('Bloomberg Market Concepts Certificate'));
                              setOpenDropdown(null);
                            }}
                            className="w-full text-left hover:bg-white/5 rounded-lg p-3 transition-all duration-200 group"
                          >
                            <div className="space-y-1">
                              <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors duration-200">Bloomberg Market Concepts Certificate</div>
                              <div className="text-xs text-white/50">Bloomberg</div>
                            </div>
                          </button>

                          <button 
                            onClick={() => {
                              scrollToSection(getCertificationId('Personal Finance Essentials'));
                              setOpenDropdown(null);
                            }}
                            className="w-full text-left hover:bg-white/5 rounded-lg p-3 transition-all duration-200 group"
                          >
                            <div className="space-y-1">
                              <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors duration-200">Personal Finance Essentials</div>
                              <div className="text-xs text-white/50">McGill University</div>
                            </div>
                          </button>

                          {/* Data & Business Intelligence */}
                          <button 
                            onClick={() => {
                              scrollToSection(getCertificationId('Google Data Analytics Professional Certificate'));
                              setOpenDropdown(null);
                            }}
                            className="w-full text-left hover:bg-white/5 rounded-lg p-3 transition-all duration-200 group"
                          >
                            <div className="space-y-1">
                              <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors duration-200">Google Data Analytics Professional Certificate</div>
                              <div className="text-xs text-white/50">Google</div>
                            </div>
                          </button>

                          <button 
                            onClick={() => {
                              scrollToSection(getCertificationId('Data Visualization with Tableau'));
                              setOpenDropdown(null);
                            }}
                            className="w-full text-left hover:bg-white/5 rounded-lg p-3 transition-all duration-200 group"
                          >
                            <div className="space-y-1">
                              <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors duration-200">Data Visualization with Tableau</div>
                              <div className="text-xs text-white/50">UC Davis</div>
                            </div>
                          </button>

                          <button 
                            onClick={() => {
                              scrollToSection(getCertificationId('Python for Everybody Specialization'));
                              setOpenDropdown(null);
                            }}
                            className="w-full text-left hover:bg-white/5 rounded-lg p-3 transition-all duration-200 group"
                          >
                            <div className="space-y-1">
                              <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors duration-200">Python for Everybody Specialization</div>
                              <div className="text-xs text-white/50">University of Michigan</div>
                            </div>
                          </button>

                          <button 
                            onClick={() => {
                              scrollToSection(getCertificationId('Machine Learning'));
                              setOpenDropdown(null);
                            }}
                            className="w-full text-left hover:bg-white/5 rounded-lg p-3 transition-all duration-200 group"
                          >
                            <div className="space-y-1">
                              <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors duration-200">Machine Learning</div>
                              <div className="text-xs text-white/50">Stanford University</div>
                            </div>
                          </button>

                          <button 
                            onClick={() => {
                              scrollToSection(getCertificationId('SQL for Data Science'));
                              setOpenDropdown(null);
                            }}
                            className="w-full text-left hover:bg-white/5 rounded-lg p-3 transition-all duration-200 group"
                          >
                            <div className="space-y-1">
                              <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors duration-200">SQL for Data Science</div>
                              <div className="text-xs text-white/50">UC Davis</div>
                            </div>
                          </button>

                          <button 
                            onClick={() => {
                              scrollToSection(getCertificationId('Power BI Data Visualization'));
                              setOpenDropdown(null);
                            }}
                            className="w-full text-left hover:bg-white/5 rounded-lg p-3 transition-all duration-200 group"
                          >
                            <div className="space-y-1">
                              <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors duration-200">Power BI Data Visualization</div>
                              <div className="text-xs text-white/50">Microsoft</div>
                            </div>
                          </button>

                          {/* Mathematical & Statistical Certifications */}
                          <button 
                            onClick={() => {
                              scrollToSection(getCertificationId('Econometrics: Methods & Applications'));
                              setOpenDropdown(null);
                            }}
                            className="w-full text-left hover:bg-white/5 rounded-lg p-3 transition-all duration-200 group"
                          >
                            <div className="space-y-1">
                              <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors duration-200">Econometrics: Methods & Applications</div>
                              <div className="text-xs text-white/50">Erasmus University</div>
                            </div>
                          </button>

                          <button 
                            onClick={() => {
                              scrollToSection(getCertificationId('Matrix Algebra for Engineers'));
                              setOpenDropdown(null);
                            }}
                            className="w-full text-left hover:bg-white/5 rounded-lg p-3 transition-all duration-200 group"
                          >
                            <div className="space-y-1">
                              <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors duration-200">Matrix Algebra for Engineers</div>
                              <div className="text-xs text-white/50">HKUST</div>
                            </div>
                          </button>

                          <button 
                            onClick={() => {
                              scrollToSection(getCertificationId('Introduction to Calculus'));
                              setOpenDropdown(null);
                            }}
                            className="w-full text-left hover:bg-white/5 rounded-lg p-3 transition-all duration-200 group"
                          >
                            <div className="space-y-1">
                              <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors duration-200">Introduction to Calculus</div>
                              <div className="text-xs text-white/50">University of Sydney</div>
                            </div>
                          </button>

                          <button 
                            onClick={() => {
                              scrollToSection(getCertificationId('Inferential Statistics'));
                              setOpenDropdown(null);
                            }}
                            className="w-full text-left hover:bg-white/5 rounded-lg p-3 transition-all duration-200 group"
                          >
                            <div className="space-y-1">
                              <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors duration-200">Inferential Statistics</div>
                              <div className="text-xs text-white/50">Duke University</div>
                            </div>
                          </button>

                          <button 
                            onClick={() => {
                              scrollToSection(getCertificationId('Excel Skills for Business'));
                              setOpenDropdown(null);
                            }}
                            className="w-full text-left hover:bg-white/5 rounded-lg p-3 transition-all duration-200 group"
                          >
                            <div className="space-y-1">
                              <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors duration-200">Excel Skills for Business</div>
                              <div className="text-xs text-white/50">Macquarie University</div>
                            </div>
                          </button>

                          {/* Standardized Exam */}
                          <button 
                            onClick={() => {
                              scrollToSection(getCertificationId('GRE General Test'));
                              setOpenDropdown(null);
                            }}
                            className="w-full text-left hover:bg-white/5 rounded-lg p-3 transition-all duration-200 group"
                          >
                            <div className="space-y-1">
                              <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors duration-200">GRE General Test</div>
                              <div className="text-xs text-white/50">ETS</div>
                            </div>
                          </button>
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
                    aria-haspopup="menu"
                    aria-expanded={openDropdown === 'community'}
                    className={navSectionButtonClasses(currentSection === 'community')}
                  >
                    Community
                    <ChevronDown size={14} className={`transition-transform duration-200 ${openDropdown === 'community' ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {/* Community Dropdown */}
                  {openDropdown === 'community' && (
                    <div className="absolute top-full left-0 -mt-1 w-80 z-[55] pt-1">
                      <div 
                        className="rounded-xl p-4 transition-all duration-200 mt-1"
                        style={{
                          background: 'rgba(15, 23, 42, 0.85)',
                          backdropFilter: 'blur(24px) saturate(180%)',
                          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)'
                        }}
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
                            className="w-full text-left hover:bg-white/5 rounded-lg p-3 transition-all duration-200 group"
                          >
                            <div className="space-y-1">
                              <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors duration-200">Next Gen Ambassador</div>
                              <div className="text-xs text-white/50">United Way</div>
                            </div>
                          </button>
                          
                          {/* Student Ambassador */}
                          <button 
                            onClick={() => {
                              scrollToSection(getCommunityId('Royal Bank of Canada'));
                              setOpenDropdown(null);
                            }}
                            className="w-full text-left hover:bg-white/5 rounded-lg p-3 transition-all duration-200 group"
                          >
                            <div className="space-y-1">
                              <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors duration-200">Student Ambassador</div>
                              <div className="text-xs text-white/50">Royal Bank of Canada</div>
                            </div>
                          </button>

                          {/* Volunteer Staff */}
                          <button 
                            onClick={() => {
                              scrollToSection(getCommunityId('Irving Oil Limited'));
                              setOpenDropdown(null);
                            }}
                            className="w-full text-left hover:bg-white/5 rounded-lg p-3 transition-all duration-200 group"
                          >
                            <div className="space-y-1">
                              <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors duration-200">Volunteer Staff</div>
                              <div className="text-xs text-white/50">Irving Oil Limited</div>
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
                    aria-haspopup="menu"
                    aria-expanded={openDropdown === 'contact'}
                    className={navSectionButtonClasses(currentSection === 'contact')}
                  >
                    Contact
                    <ChevronDown size={14} className={`transition-transform duration-200 ${openDropdown === 'contact' ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {/* Contact Dropdown */}
                  {openDropdown === 'contact' && (
                    <div className="absolute top-full left-0 -mt-1 w-72 z-[55] pt-1">
                      <div 
                        className="rounded-xl p-4 transition-all duration-200 mt-1"
                        style={{
                          background: 'rgba(15, 23, 42, 0.85)',
                          backdropFilter: 'blur(24px) saturate(180%)',
                          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)'
                        }}
                      >
                        <div className="space-y-3">
                          {/* Email */}
                          <button 
                            onClick={() => {
                              scrollToSection('#contact');
                              setOpenDropdown(null);
                            }}
                            className="w-full text-left hover:bg-white/5 rounded-lg p-3 transition-all duration-200 group"
                          >
                            <div className="space-y-1">
                              <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors duration-200">Email</div>
                              <div className="text-xs text-white/50">tyler@tylerbustard.ca</div>
                            </div>
                          </button>

                          {/* Phone */}
                          <button 
                            onClick={() => {
                              scrollToSection('#contact');
                              setOpenDropdown(null);
                            }}
                            className="w-full text-left hover:bg-white/5 rounded-lg p-3 transition-all duration-200 group"
                          >
                            <div className="space-y-1">
                              <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors duration-200">Phone</div>
                              <div className="text-xs text-white/50">(613) 985-1223</div>
                            </div>
                          </button>

                          {/* Location */}
                          <button 
                            onClick={() => {
                              scrollToSection('#contact');
                              setOpenDropdown(null);
                            }}
                            className="w-full text-left hover:bg-white/5 rounded-lg p-3 transition-all duration-200 group"
                          >
                            <div className="space-y-1">
                              <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors duration-200">Location</div>
                              <div className="text-xs text-white/50">Toronto, Ontario</div>
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
            {!isSignInPage && (
            <div className={`flex items-center justify-self-end space-x-3 transition-opacity duration-500 ${showNavContent ? 'opacity-100' : 'opacity-0'}`}>
              
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
                    } else if (isUploadPage || isSignInPage) {
                      // Go to home page for upload-resume and sign-in pages
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
              {(isResumePage || isUploadPage || isSignInPage) ? (
                <button
                  onClick={() => {
                    // Always go to home page, not back in history
                    window.location.href = '/';
                  }}
                  className="lg:hidden p-2 rounded-lg hover:bg-gray-100/50 transition-all duration-200 active:scale-95"
                  aria-label={isResumePage ? "Close resume" : "Go to home"}
                >
                  <X size={20} />
                </button>
              ) : (
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="lg:hidden p-2 rounded-lg hover:bg-gray-100/50 transition-all duration-200 active:scale-95"
                  aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                >
                  {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
              )}
            </div>
            )}
          </div>
        </div>
        )}
      </nav>

      {/* Mobile Menu - Clean Glass Effect */}
      {isMobileMenuOpen && !isResumePage && !isUploadPage && !isSignInPage && (
        <div className="fixed inset-0 z-[60] lg:hidden animate-in fade-in duration-200">
          <div 
            className="absolute inset-0 bg-black/30 backdrop-blur-sm" 
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div 
            className="absolute inset-x-0 top-0 h-full overflow-y-auto animate-in slide-in-from-top duration-300"
            style={{
              background: 'rgba(255, 255, 255, 0.98)',
              backdropFilter: 'blur(24px) saturate(180%)',
              WebkitBackdropFilter: 'blur(24px) saturate(180%)'
            }}
          >
            <div className="p-6 pt-20">
              {/* Close Button at top */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Menu</h2>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100/50 transition-colors"
                  aria-label="Close menu"
                >
                  <X size={24} className="text-gray-600" />
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
                      className="block w-full text-left px-4 py-3 text-lg font-medium text-gray-900 hover:bg-gray-100/50 rounded-lg transition-all duration-200 active:scale-98"
                    >
                      Education
                    </button>
                    <button 
                      onClick={() => {
                        scrollToSection('#experience');
                        setIsMobileMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-3 text-lg font-medium text-gray-900 hover:bg-gray-100/50 rounded-lg transition-all duration-200 active:scale-98"
                    >
                      Experience
                    </button>
                    <button 
                      onClick={() => {
                        scrollToSection('#certifications');
                        setIsMobileMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-3 text-lg font-medium text-gray-900 hover:bg-gray-100/50 rounded-lg transition-all duration-200 active:scale-98"
                    >
                      Certifications
                    </button>
                    <button 
                      onClick={() => {
                        scrollToSection('#community');
                        setIsMobileMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-3 text-lg font-medium text-gray-900 hover:bg-gray-100/50 rounded-lg transition-colors"
                    >
                      Community
                    </button>
                    <button 
                      onClick={() => {
                        scrollToSection('#contact');
                        setIsMobileMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-3 text-lg font-medium text-gray-900 hover:bg-gray-100/50 rounded-lg transition-colors"
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
                    } else if (isUploadPage || isSignInPage) {
                      // Go to home page for upload-resume and sign-in pages
                      window.location.href = '/';
                      } else {
                      window.location.href = '/resume';
                    }
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full px-4 py-3 text-lg font-medium bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
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
