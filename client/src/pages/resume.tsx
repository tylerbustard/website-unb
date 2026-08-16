import { useEffect } from "react";
import Navigation from "@/components/navigation";
import FooterMarketTicker from "@/components/footer-market-ticker";
import ScrollToTopButton from "@/components/scroll-to-top-button";

const RESUME_PDF_PATH = "/Tyler-Bustard-Resume.pdf";
const RESUME_PAGES = [
  {
    number: 1,
    src: "/resume-pages/Tyler-Bustard-Resume-page-1.webp",
    alt: "Tyler Bustard resume, page 1 of 2",
  },
  {
    number: 2,
    src: "/resume-pages/Tyler-Bustard-Resume-page-2.webp",
    alt: "Tyler Bustard resume, page 2 of 2",
  },
] as const;

export default function Resume() {
  useEffect(() => {
    const originalTitle = document.title;
    const resumeTitle = "Tyler Bustard - Resume";
    const resumeUrl = "https://tylerbustard.ca/resume";
    const resumeDescription =
      "Resume for Tyler Bustard, a finance and data-focused McGill MBA candidate.";
    const canonicalLink = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    const descriptionMeta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    const ogUrlMeta = document.querySelector<HTMLMetaElement>('meta[property="og:url"]');
    const ogTitleMeta = document.querySelector<HTMLMetaElement>('meta[property="og:title"]');
    const ogDescriptionMeta = document.querySelector<HTMLMetaElement>('meta[property="og:description"]');
    const twitterTitleMeta = document.querySelector<HTMLMetaElement>('meta[name="twitter:title"]');
    const twitterDescriptionMeta = document.querySelector<HTMLMetaElement>('meta[name="twitter:description"]');
    const originalCanonicalHref = canonicalLink?.getAttribute("href") ?? null;
    const originalDescription = descriptionMeta?.getAttribute("content") ?? null;
    const originalOgUrl = ogUrlMeta?.getAttribute("content") ?? null;
    const originalOgTitle = ogTitleMeta?.getAttribute("content") ?? null;
    const originalOgDescription = ogDescriptionMeta?.getAttribute("content") ?? null;
    const originalTwitterTitle = twitterTitleMeta?.getAttribute("content") ?? null;
    const originalTwitterDescription = twitterDescriptionMeta?.getAttribute("content") ?? null;

    document.title = resumeTitle;
    canonicalLink?.setAttribute("href", resumeUrl);
    descriptionMeta?.setAttribute("content", resumeDescription);
    ogUrlMeta?.setAttribute("content", resumeUrl);
    ogTitleMeta?.setAttribute("content", resumeTitle);
    ogDescriptionMeta?.setAttribute("content", resumeDescription);
    twitterTitleMeta?.setAttribute("content", resumeTitle);
    twitterDescriptionMeta?.setAttribute("content", resumeDescription);

    return () => {
      document.title = originalTitle;

      if (canonicalLink) {
        if (originalCanonicalHref === null) canonicalLink.removeAttribute("href");
        else canonicalLink.setAttribute("href", originalCanonicalHref);
      }

      if (descriptionMeta) {
        if (originalDescription === null) descriptionMeta.removeAttribute("content");
        else descriptionMeta.setAttribute("content", originalDescription);
      }

      if (ogUrlMeta) {
        if (originalOgUrl === null) ogUrlMeta.removeAttribute("content");
        else ogUrlMeta.setAttribute("content", originalOgUrl);
      }

      if (ogTitleMeta) {
        if (originalOgTitle === null) ogTitleMeta.removeAttribute("content");
        else ogTitleMeta.setAttribute("content", originalOgTitle);
      }

      if (ogDescriptionMeta) {
        if (originalOgDescription === null) ogDescriptionMeta.removeAttribute("content");
        else ogDescriptionMeta.setAttribute("content", originalOgDescription);
      }

      if (twitterTitleMeta) {
        if (originalTwitterTitle === null) twitterTitleMeta.removeAttribute("content");
        else twitterTitleMeta.setAttribute("content", originalTwitterTitle);
      }

      if (twitterDescriptionMeta) {
        if (originalTwitterDescription === null) twitterDescriptionMeta.removeAttribute("content");
        else twitterDescriptionMeta.setAttribute("content", originalTwitterDescription);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />

      <main id="main-content" className="resume-document-main">
        <div className="resume-document-shell">
          <article
            className="resume-document"
            aria-labelledby="resume-document-title"
            aria-describedby="resume-document-description"
            data-resume-pdf={RESUME_PDF_PATH}
          >
            <h1 id="resume-document-title" className="sr-only">
              Tyler Bustard Resume
            </h1>
            <p id="resume-document-description" className="sr-only">
              Two-page resume. Use the navigation actions to download, email, or print the original PDF.
            </p>

            {RESUME_PAGES.map((page, index) => (
              <figure
                key={page.number}
                id={`resume-document-page-${page.number}`}
                className="resume-document-page"
                data-resume-page={page.number}
                tabIndex={-1}
              >
                <img
                  src={page.src}
                  alt={page.alt}
                  width={1632}
                  height={2112}
                  loading={index === 0 ? "eager" : "lazy"}
                  decoding="async"
                  className="resume-document-page-image"
                  draggable={false}
                />
              </figure>
            ))}
          </article>
        </div>
      </main>

      <footer className="site-footer-strip print:hidden">
        <FooterMarketTicker />
      </footer>
      <ScrollToTopButton compactWhenSelectorVisible="footer" scrollBehavior="auto" printHidden />
    </div>
  );
}
