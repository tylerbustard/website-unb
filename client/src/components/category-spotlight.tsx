import { useRef, type CSSProperties, type ReactNode, type RefObject } from "react";
import { RoleSpotlight, SpotlightReveal, useSpotlightInView } from "@/components/role-spotlight";
import {
  CredDone,
  CredEyebrow,
  CredFooter,
  CredStats,
  CredWorkflow,
  useShowSection,
  type CredFigure,
  type CredStep,
} from "@/components/credential-panel";
import { cn } from "@/lib/utils";

/*
 * "Inside the category" panel for a certification category card. Each category is
 * styled after its lead issuer (see category-panels.ts) and shares this layout: the
 * certificates on a timeline, a band of figures, how the certificates fit together,
 * and a card per certificate.
 */

export interface CategoryCert {
  name: string;
  issuer: string;
  year: string;
  logoSrc?: string;
  body: string;
  chips?: string[];
}

export interface CategoryPanelConfig {
  /** Theme class, e.g. role-spotlight--cat-invest. */
  theme: string;
  /** Header mark, as an image URL. */
  icon: string;
  title: string;
  meta: string;
  triggerHint: string;
  display: ReactNode;
  lede: string;
  /** Oldest first. */
  certs: CategoryCert[];
  band: { eyebrow: string; heading: string; figures: CredFigure[]; note: string };
  path: { heading: string; steps: CredStep[]; done: string };
  certsHeading: string;
  certsLede?: string;
  footer: string;
  link?: { href: string; label: string };
}

/** The category's certificates in order, on a rail. Decorative: the cards list them. */
function Timeline({ config }: { config: CategoryPanelConfig }) {
  const { ref, active } = useSpotlightInView();
  const first = config.certs[0]?.year;
  const last = config.certs[config.certs.length - 1]?.year;

  return (
    <div ref={ref} className={cn("cat-timeline", active && "is-active")} aria-hidden="true">
      <div className="cat-timeline-head">
        <span>{config.title}</span>
        <span>{first === last ? first : `${first}–${last}`}</span>
      </div>
      <ol className="cat-timeline-list">
        {config.certs.map((cert, index) => (
          <li key={cert.name} className={`cat-timeline-item is-k${index % 4}`} style={{ "--i": index } as CSSProperties}>
            <span className="cat-timeline-year">{cert.year}</span>
            <span className="cat-timeline-dot" />
            <span className="cat-timeline-logo">{cert.logoSrc ? <img src={cert.logoSrc} alt="" /> : null}</span>
            <span className="cat-timeline-name">{cert.name}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

interface CategorySpotlightProps {
  originRef: RefObject<HTMLElement>;
  config: CategoryPanelConfig;
}

export default function CategorySpotlight({ originRef, config }: CategorySpotlightProps) {
  const certsRef = useRef<HTMLElement>(null);
  const showCerts = useShowSection(certsRef);
  const id = config.theme.replace("role-spotlight--", "");

  return (
    <RoleSpotlight
      originRef={originRef}
      logoSrc={config.icon}
      logoAlt=""
      title={config.title}
      meta={config.meta}
      triggerLabel="Inside the category"
      triggerHint={config.triggerHint}
      className={`role-spotlight--cred role-spotlight--cat ${config.theme}`}
    >
      <section className="cred-hero">
        <div>
          <SpotlightReveal delay={0}>
            <CredEyebrow>Inside the category</CredEyebrow>
          </SpotlightReveal>
          <SpotlightReveal delay={70}>
            <h3 className="cred-display">{config.display}</h3>
          </SpotlightReveal>
          <SpotlightReveal delay={150}>
            <p className="cred-lede">{config.lede}</p>
          </SpotlightReveal>
          <SpotlightReveal delay={220}>
            <div className="cred-actions">
              <button type="button" className="cred-button" onClick={showCerts}>
                See the certificates
              </button>
              {config.link ? (
                <a
                  href={config.link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cred-button cred-button-outline"
                >
                  {config.link.label}
                </a>
              ) : null}
            </div>
          </SpotlightReveal>
        </div>
        <SpotlightReveal delay={140} className="cred-hero-visual">
          <Timeline config={config} />
        </SpotlightReveal>
      </section>

      <section className="cred-band" aria-labelledby={`${id}-band-title`}>
        <div className="cred-band-inner">
          <SpotlightReveal>
            <CredEyebrow>{config.band.eyebrow}</CredEyebrow>
            <h3 id={`${id}-band-title`} className="cred-heading">
              {config.band.heading}
            </h3>
          </SpotlightReveal>
          <CredStats figures={config.band.figures} />
          <SpotlightReveal delay={140}>
            <p className="cred-band-note">{config.band.note}</p>
          </SpotlightReveal>
        </div>
      </section>

      <section className="cred-section" aria-labelledby={`${id}-path-title`}>
        <SpotlightReveal>
          <CredEyebrow>How they fit</CredEyebrow>
          <h3 id={`${id}-path-title`} className="cred-heading">
            {config.path.heading}
          </h3>
        </SpotlightReveal>
        <SpotlightReveal delay={80}>
          <CredWorkflow steps={config.path.steps} />
        </SpotlightReveal>
        <CredDone>{config.path.done}</CredDone>
      </section>

      <section ref={certsRef} className="cred-section cred-anchor" aria-labelledby={`${id}-certs-title`}>
        <SpotlightReveal>
          <CredEyebrow>The certificates</CredEyebrow>
          <h3 id={`${id}-certs-title`} className="cred-heading">
            {config.certsHeading}
          </h3>
          {config.certsLede ? <p className="cred-section-lede">{config.certsLede}</p> : null}
        </SpotlightReveal>
        <ul className="cat-certs">
          {[...config.certs].reverse().map((cert, index) => (
            <li key={cert.name} className={`is-k${(config.certs.length - 1 - index) % 4}`}>
              <SpotlightReveal delay={60 + index * 60} className="cat-cert">
                <span className="cat-cert-head">
                  <span className="cat-cert-logo" aria-hidden="true">
                    {cert.logoSrc ? <img src={cert.logoSrc} alt="" /> : null}
                  </span>
                  <span className="cat-cert-year">{cert.year}</span>
                </span>
                <span className="cat-cert-name">{cert.name}</span>
                <span className="cat-cert-issuer">{cert.issuer}</span>
                <span className="cat-cert-body">{cert.body}</span>
                {cert.chips?.length ? (
                  <span className="cat-cert-chips">
                    {cert.chips.map((chip) => (
                      <span key={chip} className="cat-chip">
                        {chip}
                      </span>
                    ))}
                  </span>
                ) : null}
              </SpotlightReveal>
            </li>
          ))}
        </ul>
      </section>

      <CredFooter note={config.footer} />
    </RoleSpotlight>
  );
}
