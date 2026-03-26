import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker } from "react-icons/hi";
import { useScrollAnimation, useStaggeredScrollAnimation } from "@/hooks/useScrollAnimation";

export default function ContactInfoSection() {
  const sectionAnimation = useScrollAnimation({ threshold: 0.15, triggerOnce: true });
  const headerAnimation = useScrollAnimation({ threshold: 0.25, triggerOnce: true, delay: 100 });
  const { ref: contactRef, visibleItems } = useStaggeredScrollAnimation(3, { threshold: 0.15, triggerOnce: true, delay: 200 });
  const contactInfo = [
    { icon: HiOutlineMail, label: "Email", value: "tyler@tylerbustard.ca", href: "mailto:tyler@tylerbustard.ca" },
    { icon: HiOutlinePhone, label: "Phone", value: "(613) 985-1223", href: "tel:+16139851223" },
    { icon: HiOutlineLocationMarker, label: "Location", value: "Toronto, Ontario, Canada", href: "https://www.google.com/maps/search/Toronto,+Ontario,+Canada" },
  ];

  return (
    <section 
      ref={sectionAnimation.ref}
      id="contact" 
      className={`py-20 sm:py-28 lg:py-36 relative overflow-hidden scroll-fade-in ${sectionAnimation.isVisible ? 'visible' : ''}`}
    >
      {/* Background - inherits Apple grey from parent */}
      
      <div className="container-width">
        {/* Header - Outside the card */}
        <div 
          ref={headerAnimation.ref}
          className={`text-center mb-12 sm:mb-16 lg:mb-20 scroll-slide-up ${headerAnimation.isVisible ? 'visible' : ''}`}
        >
          <p className="section-kicker mb-4">Get in touch</p>
          <h2 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Contact
          </h2>
          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-muted-foreground sm:text-xl lg:text-2xl">
            Ready to discuss your next project or opportunity? I'd love to hear from you.
          </p>
        </div>

        <div className="section-shell p-8 sm:p-10 lg:p-12">

        {/* Contact Cards Grid */}
        <div ref={contactRef} className="grid lg:grid-cols-3 gap-8 sm:gap-10 max-w-4xl mx-auto">
          {contactInfo.map((info, index) => (
            <a
              key={index} 
              href={info.href}
              target={info.label === "Location" ? "_blank" : undefined}
              rel={info.label === "Location" ? "noreferrer" : undefined}
              className={`relative block scroll-scale-in scroll-stagger-${index + 1} ${visibleItems.has(index) ? 'visible' : ''}`}
              data-testid={`contact-card-${index}`}
            >
              <div className="section-card relative text-center transition-all duration-500 hover:scale-[1.02] hover:shadow-3xl group">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative p-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-6 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-110">
                    <info.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>{info.label}</h3>
                  <p className="text-base font-semibold text-primary" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>{info.value}</p>
                </div>
              </div>
            </a>
          ))}
        </div>
        </div>
      </div>
    </section>
  );
}
