import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import EducationSection from "@/components/about-section";
import ExperienceSection from "@/components/experience-section";
import CertificationsSection, { CommunitySection } from "@/components/skills-section";
import ContactInfoSection from "@/components/contact-info-section";
import ScrollToTopButton from "@/components/scroll-to-top-button";
import HomepageMarketTickerDock from "@/components/homepage-market-ticker-dock";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Navigation />
      <main id="main-content">
        <HeroSection />
        <ExperienceSection />
        <EducationSection />
        <CertificationsSection />
        <CommunitySection />
        <ContactInfoSection />
      </main>

      <HomepageMarketTickerDock />
      <ScrollToTopButton compactWhenSelectorVisible="#contact" scrollBehavior="smooth" />
    </div>
  );
}
