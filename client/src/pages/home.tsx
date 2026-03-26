import { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";
import { useLocation } from "wouter";
import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import EducationSection from "@/components/about-section";
import ExperienceSection from "@/components/experience-section";
import CertificationsSection, { CommunitySection } from "@/components/skills-section";
import ContactInfoSection from "@/components/contact-info-section";

export default function Home() {
  const [location] = useLocation();
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;
    let lastKnownScrollY = 0;
    
    const handleScroll = () => {
      if (timeoutId) clearTimeout(timeoutId);
      
      timeoutId = setTimeout(() => {
        const scrollY = window.scrollY;
        // Only update if there's a significant change
        if (Math.abs(scrollY - lastKnownScrollY) > 50) {
          setShowScrollToTop(scrollY > 300);
          lastKnownScrollY = scrollY;
        }
      }, 100);
    };

    // Initial check
    setShowScrollToTop(window.scrollY > 300);

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Navigation />
      <main id="main-content">
        <HeroSection />
        <EducationSection />
        <ExperienceSection />
        <CertificationsSection />
        <CommunitySection />
        <ContactInfoSection />
      </main>
      
      <button
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 z-40 transition-all duration-300 ease-in-out rounded-full glass-panel ${
          showScrollToTop 
            ? 'opacity-100 pointer-events-auto translate-y-0' 
            : 'opacity-0 pointer-events-none translate-y-4'
        } hover:scale-105 shadow-xl hover:shadow-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background`}
        data-testid="scroll-to-top-button"
        aria-label="Back to top"
      >
        <div className="flex items-center px-4 py-3">
          <span className="mr-3 text-sm font-medium text-slate-700">
            Back to top
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-white transition-colors duration-200">
            <ChevronUp size={18} />
          </div>
        </div>
      </button>
      
      <footer className="footer-shell relative border-t border-border/80 py-8 transition-all duration-500">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="font-medium text-slate-700">
              © Tyler Bustard. All rights reserved.
            </p>
            <button
              onClick={() => {
                localStorage.setItem('previousPage', location);
                window.location.href = '/sign-in';
              }}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-900 transition-all duration-200 hover:scale-105 hover:border-slate-300 hover:bg-slate-50"
              data-testid="footer-employer-signin"
            >
              Sign In
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
