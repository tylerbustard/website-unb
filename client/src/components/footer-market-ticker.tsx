import { useEffect, useRef } from "react";

const TRADINGVIEW_TICKER_SCRIPT =
  "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";

export const marketTickerSymbols = [
  { proName: "TVC:TSX", title: "TSX" },
  { proName: "TSX:RY", title: "RBC" },
  { proName: "TSX:TD", title: "TD" },
  { proName: "TSX:BMO", title: "BMO" },
  { proName: "TSX:SHOP", title: "Shopify" },
  { proName: "AMEX:SPY", title: "S&P 500" },
  { proName: "NASDAQ:QQQ", title: "Nasdaq 100" },
  { proName: "AMEX:DIA", title: "Dow 30" },
  { proName: "AMEX:IWM", title: "Russell 2000" },
  { proName: "CBOE:VIX", title: "VIX" },
  { proName: "AMEX:GLD", title: "Gold" },
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
    if (!containerRef.current) {
      return;
    }

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

    containerRef.current.innerHTML = "";
    containerRef.current.appendChild(widgetShell);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, []);

  return (
    <div className={`market-ticker-shell ${className}`.trim()} aria-label={ariaLabel}>
      <div className="market-ticker-marquee" ref={containerRef} />
    </div>
  );
}
