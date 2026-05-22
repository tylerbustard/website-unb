import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import FooterMarketTicker from "@/components/footer-market-ticker";

const HERO_TICKER_REVEAL_DELAY_MS = 3200;

export default function HomepageMarketTickerDock() {
  const [isReady, setIsReady] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isFooterVisible, setIsFooterVisible] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsReady(true);
    }, HERO_TICKER_REVEAL_DELAY_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    const footer = document.getElementById("home-market-footer");
    if (!footer) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFooterVisible(entry.isIntersecting);
      },
      {
        threshold: 0.05,
      },
    );

    observer.observe(footer);

    return () => {
      observer.disconnect();
    };
  }, []);

  const isActive = isReady && !isDismissed && !isFooterVisible;

  useEffect(() => {
    document.documentElement.style.setProperty("--footer-ticker-offset", isActive ? "3.55rem" : "0px");

    return () => {
      document.documentElement.style.setProperty("--footer-ticker-offset", "0px");
    };
  }, [isActive]);

  if (isDismissed) {
    return null;
  }

  return (
    <div
      className="homepage-market-ticker-dock print:hidden"
      data-active={isActive ? "true" : "false"}
      aria-hidden={!isActive}
    >
      <div className="homepage-market-ticker-dock__surface">
        <FooterMarketTicker
          ariaLabel="Sticky live market ticker"
          className="market-ticker-shell--floating"
        />
        <button
          type="button"
          className="homepage-market-ticker-dock__hide"
          onClick={() => setIsDismissed(true)}
          data-testid="button-hide-market-ticker"
        >
          <span>Hide</span>
          <ChevronDown size={14} />
        </button>
      </div>
    </div>
  );
}
