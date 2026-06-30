import { useState } from "react";
import { Mail, Phone, MapPin, Globe, Download, CalendarDays, ExternalLink, LoaderCircle, Send, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  SCROLL_REVEAL_OBSERVER_OPTIONS,
  getScrollRevealStyle,
  useScrollAnimation,
  useStaggeredScrollAnimation,
} from "@/hooks/useScrollAnimation";
import FooterMarketTicker from "@/components/footer-market-ticker";
import profileImage from "@assets/89BBD451-CD8B-47EB-AA2E-C39D4637B01D_1_105_c_1755896148330.jpeg";

type ContactFormState = {
  name: string;
  email: string;
  subject: string;
  message: string;
  "bot-field": string;
};

const CONTACT_FORM_ENDPOINT = "https://formsubmit.co/ajax/tyler@tylerbustard.com";

export default function ContactInfoSection() {
  const { toast } = useToast();
  const sectionAnimation = useScrollAnimation(SCROLL_REVEAL_OBSERVER_OPTIONS);
  const headerAnimation = useScrollAnimation({
    ...SCROLL_REVEAL_OBSERVER_OPTIONS,
    threshold: 0.18,
    delay: 60,
  });
  const contactItemsAnimation = useStaggeredScrollAnimation(3, {
    ...SCROLL_REVEAL_OBSERVER_OPTIONS,
    threshold: 0.14,
    delay: 90,
    staggerDelay: 90,
    fastStaggerDelay: 55,
  });
  const contactCardHref = "/Tyler-Bustard-Contact.vcf";
  const calendlyHref = "https://calendly.com/tyler-bustard";
  const calendlyEmbedHref = "https://calendly.com/tyler-bustard?hide_gdpr_banner=1";
  const [formData, setFormData] = useState<ContactFormState>({
    name: "",
    email: "",
    subject: "",
    message: "",
    "bot-field": "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitState, setSubmitState] = useState<"idle" | "success" | "error">("idle");

  const handleInputChange = (field: keyof ContactFormState, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setSubmitState("idle");

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        _subject: `Website contact: ${formData.subject}`,
        _replyto: formData.email,
        _template: "table",
        _captcha: "false",
        _honey: formData["bot-field"],
        _url: "https://tylerbustard.com/#contact",
      };

      const response = await fetch(CONTACT_FORM_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Form submission failed");
      }

      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
        "bot-field": "",
      });
      setSubmitState("success");
      toast({
        title: "Message sent",
        description: "Thanks. Your message was sent without leaving the site.",
      });
    } catch (error) {
      console.error("Contact form submission error:", error);
      setSubmitState("error");
      toast({
        title: "Message failed",
        description: "The form couldn't be submitted. Please try again in a moment.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      ref={sectionAnimation.ref}
      id="contact"
      className="relative overflow-hidden bg-white pt-20 pb-0 sm:pt-28 sm:pb-0 lg:pt-36 lg:pb-0"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

      <div className="container-width relative pb-8 sm:pb-10 lg:pb-12">
        <div
          ref={headerAnimation.ref}
          className={`text-center mb-12 sm:mb-16 lg:mb-20 scroll-slide-up ${headerAnimation.isVisible ? "visible" : ""}`}
        >
          <p className="section-kicker mb-4">Contact</p>
          <h2 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
            Let&apos;s connect
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-slate-500 sm:text-xl lg:text-2xl">
            A direct contact card, an on-site message form, and live scheduling in one place. Reach out the way that fits the moment best.
          </p>
        </div>

        <div className="contact-feature-grid" ref={contactItemsAnimation.ref}>
          <article className={`section-card contact-feature-card scroll-slide-up ${contactItemsAnimation.visibleItems.has(0) ? "visible" : ""}`}>
            {(() => {
              const isVisible = contactItemsAnimation.visibleItems.has(0);
              const revealClass = isVisible ? "visible" : "";

              return (
                <>
                  <div className="contact-profile-header">
                    <div
                      className={`contact-profile-portrait hero-portrait-frame scroll-slide-up ${revealClass}`}
                      style={getScrollRevealStyle("cardHeader")}
                    >
                      <img
                        src={profileImage}
                        alt="Tyler Bustard professional headshot"
                        className="hero-portrait-img aspect-[3/4] w-full object-cover object-top"
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="absolute inset-0 rounded-[1.15rem] ring-1 ring-inset ring-black/5" />
                    </div>

                    <div className="min-w-0">
                      <p className="section-kicker mb-3">Direct contact</p>
                      <h3
                        className={`contact-feature-title scroll-slide-up ${revealClass}`}
                        style={getScrollRevealStyle("cardHeader")}
                      >
                        Tyler Bustard
                      </h3>
                      <p
                        className={`contact-feature-subtitle scroll-slide-up ${revealClass}`}
                        style={getScrollRevealStyle("subheading")}
                      >
                        Finance &amp; Technology
                      </p>
                      <p
                        className={`contact-feature-body scroll-slide-up ${revealClass}`}
                        style={getScrollRevealStyle("body", 0)}
                      >
                        Frontline client experience, portfolio operations, analytics, and finance-led execution across wealth, banking, and technology-focused work.
                      </p>
                    </div>
                  </div>

                  <div className="contact-detail-list">
                    <a
                      href="mailto:tyler@tylerbustard.com"
                      className={`contact-detail-item scroll-slide-up ${revealClass}`}
                      style={getScrollRevealStyle("body", 1)}
                    >
                      <span className="contact-detail-icon" aria-hidden="true">
                        <Mail size={16} />
                      </span>
                      <span className="contact-detail-copy">
                        <span className="contact-detail-label">Email</span>
                        <span className="contact-detail-value">tyler@tylerbustard.com</span>
                      </span>
                    </a>

                    <a
                      href="tel:+16139851223"
                      className={`contact-detail-item scroll-slide-up ${revealClass}`}
                      style={getScrollRevealStyle("body", 2)}
                    >
                      <span className="contact-detail-icon" aria-hidden="true">
                        <Phone size={16} />
                      </span>
                      <span className="contact-detail-copy">
                        <span className="contact-detail-label">Phone</span>
                        <span className="contact-detail-value">(613) 985-1223</span>
                      </span>
                    </a>

                    <a
                      href="https://tylerbustard.com"
                      className={`contact-detail-item scroll-slide-up ${revealClass}`}
                      target="_blank"
                      rel="noreferrer"
                      style={getScrollRevealStyle("body", 3)}
                    >
                      <span className="contact-detail-icon" aria-hidden="true">
                        <Globe size={16} />
                      </span>
                      <span className="contact-detail-copy">
                        <span className="contact-detail-label">Website</span>
                        <span className="contact-detail-value">tylerbustard.com</span>
                      </span>
                    </a>

                    <div
                      className={`contact-detail-item scroll-slide-up ${revealClass}`}
                      style={getScrollRevealStyle("body", 4)}
                    >
                      <span className="contact-detail-icon" aria-hidden="true">
                        <MapPin size={16} />
                      </span>
                      <span className="contact-detail-copy">
                        <span className="contact-detail-label">Location</span>
                        <span className="contact-detail-value">Toronto, Ontario</span>
                      </span>
                    </div>
                  </div>

                  <div
                    className={`contact-card-footer scroll-slide-up ${revealClass}`}
                    style={getScrollRevealStyle("dense", 4)}
                  >
                    <a
                      href={contactCardHref}
                      download="Tyler-Bustard-Contact.vcf"
                      className="contact-secondary-action"
                    >
                      <Download size={15} />
                      <span>Save contact card</span>
                    </a>
                  </div>
                </>
              );
            })()}
          </article>

          <article className={`section-shell section-shell-strong contact-feature-card contact-feature-card--form scroll-slide-up ${contactItemsAnimation.visibleItems.has(1) ? "visible" : ""}`}>
            {(() => {
              const isVisible = contactItemsAnimation.visibleItems.has(1);
              const revealClass = isVisible ? "visible" : "";

              return (
                <>
                  <div>
                    <p className="section-kicker mb-3">Send a note</p>
                    <h3
                      className={`contact-feature-title scroll-slide-up ${revealClass}`}
                      style={getScrollRevealStyle("cardHeader")}
                    >
                      Email directly from the site
                    </h3>
                    <p
                      className={`contact-feature-body contact-feature-body--wide scroll-slide-up ${revealClass}`}
                      style={getScrollRevealStyle("subheading")}
                    >
                      Use the form below for opportunities, interview outreach, partnerships, or questions. It submits without opening your email client.
                    </p>
                  </div>

                  <form
                    onSubmit={handleSubmit}
                    className="contact-form-shell"
                  >
                    <input
                      type="hidden"
                      name="_honey"
                      value={formData["bot-field"]}
                      onChange={(event) => handleInputChange("bot-field", event.target.value)}
                    />

                    <div className="contact-form-grid">
                      <label
                        className={`contact-form-field scroll-slide-up ${revealClass}`}
                        style={getScrollRevealStyle("body", 0)}
                      >
                        <span className="contact-form-label">Name</span>
                        <input
                          type="text"
                          name="name"
                          autoComplete="name"
                          required
                          value={formData.name}
                          onChange={(event) => handleInputChange("name", event.target.value)}
                          className="contact-form-input"
                          placeholder="Your full name"
                        />
                      </label>

                      <label
                        className={`contact-form-field scroll-slide-up ${revealClass}`}
                        style={getScrollRevealStyle("body", 1)}
                      >
                        <span className="contact-form-label">Email</span>
                        <input
                          type="email"
                          name="email"
                          autoComplete="email"
                          required
                          value={formData.email}
                          onChange={(event) => handleInputChange("email", event.target.value)}
                          className="contact-form-input"
                          placeholder="name@example.com"
                        />
                      </label>
                    </div>

                    <label
                      className={`contact-form-field scroll-slide-up ${revealClass}`}
                      style={getScrollRevealStyle("body", 2)}
                    >
                      <span className="contact-form-label">Subject</span>
                      <input
                        type="text"
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={(event) => handleInputChange("subject", event.target.value)}
                        className="contact-form-input"
                        placeholder="What would you like to discuss?"
                      />
                    </label>

                    <label
                      className={`contact-form-field scroll-slide-up ${revealClass}`}
                      style={getScrollRevealStyle("body", 3)}
                    >
                      <span className="contact-form-label">Message</span>
                      <textarea
                        name="message"
                        required
                        value={formData.message}
                        onChange={(event) => handleInputChange("message", event.target.value)}
                        className="contact-form-textarea"
                        placeholder="Tell me a little about the opportunity, role, or conversation you have in mind."
                      />
                    </label>

                    <div
                      className={`contact-form-actions scroll-slide-up ${revealClass}`}
                      style={getScrollRevealStyle("dense", 4)}
                    >
                      <button
                        type="submit"
                        className="contact-primary-action contact-submit-button"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? <LoaderCircle size={17} className="animate-spin" /> : <Send size={17} />}
                        <span>{isSubmitting ? "Sending..." : "Send message"}</span>
                      </button>

                      {submitState === "success" ? (
                        <p className="contact-form-status contact-form-status--success">
                          <CheckCircle2 size={16} />
                          <span>Message submitted successfully.</span>
                        </p>
                      ) : submitState === "error" ? (
                        <p className="contact-form-status contact-form-status--error">
                          <span>There was a problem sending your message. Please try again.</span>
                        </p>
                      ) : null}
                    </div>
                  </form>
                </>
              );
            })()}
          </article>
        </div>

        <article className={`section-shell section-shell-strong contact-booking-shell scroll-slide-up ${contactItemsAnimation.visibleItems.has(2) ? "visible" : ""}`}>
          {(() => {
            const isVisible = contactItemsAnimation.visibleItems.has(2);
            const revealClass = isVisible ? "visible" : "";

            return (
              <>
                <div className="contact-booking-header">
                  <div>
                    <p className="section-kicker mb-3">Appointments</p>
                    <h3
                      className={`contact-feature-title scroll-slide-up ${revealClass}`}
                      style={getScrollRevealStyle("cardHeader")}
                    >
                      Book time directly
                    </h3>
                    <p
                      className={`contact-feature-body contact-feature-body--wide scroll-slide-up ${revealClass}`}
                      style={getScrollRevealStyle("subheading")}
                    >
                      Schedule a time instantly through Calendly for interviews, conversations, and opportunities that are easier to discuss live.
                    </p>
                  </div>

                  <a
                    href={calendlyHref}
                    target="_blank"
                    rel="noreferrer"
                    className={`contact-secondary-action contact-secondary-action--large scroll-slide-up ${revealClass}`}
                    style={getScrollRevealStyle("body", 0)}
                  >
                    <CalendarDays size={17} />
                    <span>Open booking page</span>
                    <ExternalLink size={15} />
                  </a>
                </div>

                <div
                  className={`contact-booking-frame scroll-slide-up ${revealClass}`}
                  style={getScrollRevealStyle("body", 1)}
                >
                  <iframe
                    src={calendlyEmbedHref}
                    title="Book time with Tyler Bustard on Calendly"
                    loading="eager"
                    className="contact-booking-iframe"
                    allow="fullscreen"
                  />
                </div>
              </>
            );
          })()}
        </article>

      </div>

      <div id="home-market-footer" className="site-footer-strip print:hidden">
        <FooterMarketTicker />
      </div>
    </section>
  );
}
