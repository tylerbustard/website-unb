import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";

type ScrollToTopButtonProps = {
  compactWhenSelectorVisible?: string;
  scrollBehavior?: ScrollBehavior;
  printHidden?: boolean;
};

export default function ScrollToTopButton({
  compactWhenSelectorVisible,
  scrollBehavior = "smooth",
  printHidden = false,
}: ScrollToTopButtonProps) {
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;
    let lastKnownScrollY = 0;

    const handleScroll = () => {
      if (timeoutId) clearTimeout(timeoutId);

      timeoutId = setTimeout(() => {
        const scrollY = window.scrollY;
        if (Math.abs(scrollY - lastKnownScrollY) > 50) {
          setShowScrollToTop(scrollY > 300);
          lastKnownScrollY = scrollY;
        }
      }, 100);
    };

    setShowScrollToTop(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    if (!compactWhenSelectorVisible) return;

    const target = document.querySelector(compactWhenSelectorVisible);
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setCompact(entry.isIntersecting);
      },
      {
        threshold: 0.15,
      },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [compactWhenSelectorVisible]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: scrollBehavior,
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`scroll-to-top-floating fixed z-40 rounded-full glass-panel transition-all duration-300 ease-in-out ${
        printHidden ? "print:hidden" : ""
      } ${
        showScrollToTop ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      } ${compact ? "shadow-lg hover:shadow-xl" : "shadow-xl hover:scale-105 hover:shadow-2xl"} focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background`}
      data-testid="scroll-to-top-button"
      aria-label="Back to top"
    >
      <div className={`${compact ? "px-3 py-3" : "px-3 py-3 sm:px-4 sm:py-3"} flex items-center`}>
        {!compact && (
          <span className="mr-3 hidden text-sm font-medium text-slate-700 sm:inline">
            Back to top
          </span>
        )}
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-white transition-colors duration-200">
          <ChevronUp size={18} />
        </div>
      </div>
    </button>
  );
}
