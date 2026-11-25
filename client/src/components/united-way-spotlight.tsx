import { useRef, type CSSProperties, type RefObject } from "react";
import { RoleSpotlight, SpotlightReveal, useSpotlightInView } from "@/components/role-spotlight";
import {
  CredCards,
  CredDone,
  CredEyebrow,
  CredFooter,
  CredResults,
  CredStats,
  CredWorkflow,
  useShowSection,
} from "@/components/credential-panel";
import { cn } from "@/lib/utils";
import { spotlightTriggers } from "@/components/spotlight-triggers";
import "@/styles/spotlights/uw.css";

/*
 * "Inside the role" panel for the United Way community card, in United Way Greater
 * Toronto's branding: a United Way red hero with heavy italic capitals, white pill
 * buttons, white pages with black type, a black band, and the yellow of the logo.
 * Sources:
 * - unitedwaygt.org (Nov 2026): 70 years of tackling poverty across the GTA; certified
 *   Living Wage employer and funder of the Ontario Living Wage Network; the Toronto Youth
 *   Employment Table, co-chaired with the City of Toronto, and its youth employment
 *   charter; the 2026 CN Tower Climb, November 14 and 15, with a $1.85 million goal
 * - United Way Greater Toronto news release, February 27, 2026: the 2025 community
 *   campaign projected to raise $112 million; a network of 312 local agencies across
 *   Toronto, Peel and York Region
 * - Charity Intelligence: founded in 1956
 * - United Way Greater Toronto newsletter: founded and supports the 211 helpline, which
 *   serves 1.2 million people a year
 * - My community card: Next Gen Ambassador since 2020; a fundraising strategy that raised
 *   20% more over three years; engagement that raised workplace participation and
 *   awareness 15%
 */

const UW_URL = "https://www.unitedwaygt.org/";

const workflow = [
  { title: "Plan", body: "I led a fundraising strategy for United Way’s campaign." },
  {
    title: "Engage",
    body: "I drove engagement initiatives that raised workplace participation and awareness by 15%.",
  },
  { title: "Grow", body: "Over three years, the strategy raised 20% more funds for the GTA." },
];

/** Whole years since 2020, counted so it never overstates: 6+ through 2027, 7+ in 2028, and so on. */
const yearsServing = Math.max(6, new Date().getFullYear() - 2021);

const results = [
  { to: 20, prefix: "+", suffix: "%", label: "more funds raised over three years" },
  { to: 15, prefix: "+", suffix: "%", label: "workplace participation and awareness" },
  { to: yearsServing, suffix: "+ yrs", label: "as a Next Gen Ambassador, since 2020" },
];

const organization = [
  { value: "1956", label: "the year United Way Greater Toronto was founded" },
  { to: 112, prefix: "$", suffix: "M", label: "projected for the 2025 community campaign" },
  { to: 312, label: "local agencies in its network" },
  { to: 3, label: "regions: Toronto, Peel and York" },
];

const toolkit = ["Fundraising Strategy", "Leadership", "Event Planning", "Community Engagement", "Stakeholder Management"];

const today = [
  {
    title: "CN Tower Climb",
    body: "The 2026 climb, on November 14 and 15, set a $1.85 million goal for the GTA.",
  },
  {
    title: "A living wage",
    body: "United Way Greater Toronto is a certified Living Wage employer and funds the Ontario Living Wage Network.",
  },
  {
    title: "Youth employment",
    body: "With the City of Toronto, it co-chairs the Toronto Youth Employment Table, which launched a youth employment charter.",
  },
];

/** Two campaign thermometers rising past where they started. Decorative: the text states the results. */
function Thermometers() {
  const { ref, active } = useSpotlightInView();

  return (
    <div ref={ref} className={cn("uw-campaign", active && "is-active")} aria-hidden="true">
      <div className="uw-campaign-head">
        <span>My campaign results</span>
        <span className="uw-campaign-chip">Since 2020</span>
      </div>
      <div className="uw-thermos">
        {[
          { value: "+20%", label: "funds raised", note: "over three years", start: 83.3 },
          { value: "+15%", label: "participation", note: "and awareness at work", start: 87 },
        ].map((item, index) => (
          <div key={item.label} className="uw-thermo" style={{ "--start": `${item.start}%`, "--i": index } as CSSProperties}>
            <span className="uw-thermo-value">{item.value}</span>
            <span className="uw-tube">
              <span className="uw-mercury" />
              <span className="uw-start">
                <span>Start</span>
              </span>
            </span>
            <span className="uw-bulb" />
            <span className="uw-thermo-label">{item.label}</span>
            <span className="uw-thermo-note">{item.note}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface UnitedWaySpotlightProps {
  originRef: RefObject<HTMLElement>;
  logoSrc: string;
}

export default function UnitedWaySpotlight({ originRef, logoSrc }: UnitedWaySpotlightProps) {
  const roleRef = useRef<HTMLElement>(null);
  const showRole = useShowSection(roleRef);

  return (
    <RoleSpotlight
      originRef={originRef}
      logoSrc={logoSrc}
      logoAlt="United Way logo"
      title="Next Gen Ambassador"
      meta="United Way · Toronto, ON · 2020–Present"
      triggerLabel={spotlightTriggers["united-way"].label}
      triggerHint={spotlightTriggers["united-way"].hint}
      className="role-spotlight--cred role-spotlight--uw"
    >
      <section className="uw-hero">
        <div>
          <SpotlightReveal delay={0}>
            <CredEyebrow>Inside the role</CredEyebrow>
          </SpotlightReveal>
          <SpotlightReveal delay={70}>
            <h3 className="uw-display">Raising more for the GTA, campaign after campaign.</h3>
          </SpotlightReveal>
          <SpotlightReveal delay={150}>
            <p className="uw-lede">
              United Way Greater Toronto has spent 70 years bringing people together to tackle poverty. As a Next Gen
              Ambassador since 2020, I led a fundraising strategy that raised 20% more over three years, and drove
              engagement that lifted workplace participation and awareness by 15%.
            </p>
          </SpotlightReveal>
          <SpotlightReveal delay={220}>
            <div className="cred-actions">
              <button type="button" className="uw-button" onClick={showRole}>
                See my role
              </button>
              <a href={UW_URL} target="_blank" rel="noopener noreferrer" className="uw-button uw-button-outline">
                Visit United Way
              </a>
            </div>
          </SpotlightReveal>
        </div>
        <SpotlightReveal delay={140} className="cred-hero-visual">
          <Thermometers />
        </SpotlightReveal>
      </section>

      <div className="uw-body">
        <div className="uw-body-inner">
          <section ref={roleRef} className="cred-section uw-first cred-anchor" aria-labelledby="uw-role-title">
            <SpotlightReveal>
              <CredEyebrow>My role</CredEyebrow>
              <h3 id="uw-role-title" className="cred-heading">
                Plan it, rally people, raise more.
              </h3>
            </SpotlightReveal>
            <SpotlightReveal delay={80}>
              <CredWorkflow steps={workflow} />
            </SpotlightReveal>
            <CredResults figures={results} />
            <CredDone>I&rsquo;ve been a Next Gen Ambassador since 2020, and I still am.</CredDone>
          </section>

          <section className="cred-band" aria-labelledby="uw-org-title">
            <div className="cred-band-inner">
              <SpotlightReveal>
                <CredEyebrow>United Way Greater Toronto</CredEyebrow>
                <h3 id="uw-org-title" className="cred-heading">
                  Seventy years of fighting local poverty.
                </h3>
              </SpotlightReveal>
              <CredStats figures={organization} />
              <SpotlightReveal delay={140}>
                <p className="cred-band-note">
                  United Way also founded and supports 211, the helpline that connects 1.2 million people a year with
                  non-emergency social services.
                </p>
              </SpotlightReveal>
            </div>
          </section>

          <section className="cred-section" aria-labelledby="uw-toolkit-title">
            <SpotlightReveal>
              <CredEyebrow id="uw-toolkit-title">Toolkit</CredEyebrow>
              <ul className="uw-chips">
                {toolkit.map((item) => (
                  <li key={item} className="uw-chip">
                    {item}
                  </li>
                ))}
              </ul>
            </SpotlightReveal>
          </section>

          <section className="cred-section" aria-labelledby="uw-today-title">
            <SpotlightReveal>
              <CredEyebrow>United Way in 2026</CredEyebrow>
              <h3 id="uw-today-title" className="cred-heading">
                What the GTA&rsquo;s United Way is working on.
              </h3>
            </SpotlightReveal>
            <CredCards cards={today} />
          </section>

          <CredFooter
            note="Facts come from unitedwaygt.org (2026) and United Way Greater Toronto's February 2026 campaign release. Role figures are my own."
            href={UW_URL}
            linkLabel="Visit United Way"
          />
        </div>
      </div>
    </RoleSpotlight>
  );
}
