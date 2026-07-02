import { useEffect, useRef } from "react";

const TRADINGVIEW_TICKER_SCRIPT =
  "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";

export const marketTickerSymbols = [
  { proName: "TSX:TSX", title: "TSX Composite" },
  { proName: "TSX:RY", title: "RBC" },
  { proName: "TSX:TD", title: "TD" },
  { proName: "TSX:BMO", title: "BMO" },
  { proName: "TSX:SHOP", title: "Shopify" },
  { proName: "SP:SPX", title: "S&P 500" },
  { proName: "NASDAQ:NDX", title: "Nasdaq 100" },
  { proName: "TVC:DJI", title: "Dow 30" },
  { proName: "TVC:RUT", title: "Russell 2000" },
  { proName: "TVC:VIX", title: "VIX" },
  { proName: "TVC:GOLD", title: "Gold" },
  { proName: "NYMEX:CL1!", title: "Crude Oil" },
  { proName: "FX_IDC:USDCAD", title: "USD/CAD" },
  { proName: "NASDAQ:AAPL", title: "Apple" },
  { proName: "NASDAQ:MSFT", title: "Microsoft" },
  { proName: "NASDAQ:NVDA", title: "NVIDIA" },
  { proName: "TSX:BNS", title: "Scotiabank" },
  { proName: "BITSTAMP:BTCUSD", title: "Bitcoin" },
  { proName: "BITSTAMP:ETHUSD", title: "Ethereum" },
];

type FooterMarketTickerProps = {
  ariaLabel?: string;
  className?: string;
};

export default function FooterMarketTicker({
  ariaLabel = "Live market ticker",
  className = "",
}: FooterMarketTickerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    let hasLoaded = false;

    const loadWidget = () => {
      if (hasLoaded) {
        return;
      }

      hasLoaded = true;

      const widgetShell = document.createElement("div");
      widgetShell.className = "market-ticker-widget-shell";

      const widgetTarget = document.createElement("div");
      widgetTarget.className = "tradingview-widget-container__widget";

      const script = document.createElement("script");
      script.type = "text/javascript";
      script.async = true;
      script.src = TRADINGVIEW_TICKER_SCRIPT;
      script.innerHTML = JSON.stringify({
        symbols: marketTickerSymbols,
        showSymbolLogo: true,
        isTransparent: true,
        displayMode: "adaptive",
        colorTheme: "dark",
        locale: "en",
      });

      widgetShell.appendChild(widgetTarget);
      widgetShell.appendChild(script);

      container.innerHTML = "";
      container.appendChild(widgetShell);
    };

    if (!("IntersectionObserver" in window)) {
      loadWidget();
      return () => {
        container.innerHTML = "";
      };
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          loadWidget();
          observer.disconnect();
        }
      },
      {
        rootMargin: "120px 0px",
        threshold: 0.01,
      },
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
      container.innerHTML = "";
    };
  }, []);

  return (
    <div className={`market-ticker-shell ${className}`.trim()} aria-label={ariaLabel}>
      <div className="market-ticker-marquee" ref={containerRef} />
    </div>
  );
}
