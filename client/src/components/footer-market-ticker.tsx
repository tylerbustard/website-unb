import { useEffect, useRef } from "react";

const TRADINGVIEW_TICKER_SCRIPT =
  "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";

// Only symbols TradingView licenses for free widgets. Exchange-licensed feeds such as
// SP:SPX, NASDAQ:NDX, TVC:DJI, TVC:RUT, TVC:VIX and NYMEX:CL1! render as a red "!" in the
// tape, so the broad indices, VIX and crude use the widget-available CFD feeds instead.
export const marketTickerSymbols = [
  { proName: "TSX:TSX", title: "TSX Composite" },
  { proName: "TSX:RY", title: "RBC" },
  { proName: "TSX:TD", title: "TD" },
  { proName: "TSX:BMO", title: "BMO" },
  { proName: "TSX:SHOP", title: "Shopify" },
  { proName: "FOREXCOM:SPXUSD", title: "S&P 500" },
  { proName: "FOREXCOM:NSXUSD", title: "Nasdaq 100" },
  { proName: "FOREXCOM:DJI", title: "Dow 30" },
  { proName: "FOREXCOM:US2000", title: "Russell 2000" },
  { proName: "CAPITALCOM:VIX", title: "VIX" },
  { proName: "TVC:GOLD", title: "Gold" },
  { proName: "TVC:USOIL", title: "Crude Oil" },
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
        colorTheme: "light",
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
