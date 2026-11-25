import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

/** Warm the browser cache for a certificate image (e.g. on card hover) so the modal opens with it already loaded. */
export function preloadCertificateImage(src: string) {
  const img = new Image();
  img.src = src;
}

export interface CertificateModalCert {
  /** Certification display name (modal heading). */
  title: string;
  /** Issuing organization. */
  issuer: string;
  /** Year earned (optional). */
  year?: string;
  /** Root-absolute path to the preview image. */
  image: string;
  /** Alt text for the image. */
  alt: string;
  /** Issuer logo shown as a branded chip in the header (optional). */
  logoSrc?: string;
}

interface CertificateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cert: CertificateModalCert | null;
}

/**
 * "View Certificate" pop-up. Reuses the shared Radix Dialog (focus trap, Escape,
 * scroll lock, overlay-click close, and the X button come for free) and matches the
 * site's Apple-style tokens (white sheet, round grey close button, light-grey image stage).
 */
export function CertificateModal({ open, onOpenChange, cert }: CertificateModalProps) {
  const [loaded, setLoaded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    setLoaded(false);
  }, [cert?.image]);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        ref={contentRef}
        // Focus the dialog itself rather than the close button, so opening it with the
        // mouse doesn't paint a focus ring on the X (keyboard users can still Tab to it).
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          contentRef.current?.focus({ preventScroll: true });
        }}
        closeClassName="right-[1.375rem] top-[1.375rem]"
        className="w-[calc(100%-1.5rem)] max-w-3xl gap-0 overflow-hidden rounded-[1.25rem] border border-black/10 bg-white p-0 focus:outline-none sm:rounded-[1.375rem] motion-reduce:animate-none"
      >
        {cert ? (
          <>
            <DialogHeader className="space-y-0 border-b border-black/[0.08] py-4 pl-6 pr-16 text-left">
              <div className="flex items-center gap-3.5">
                {cert.logoSrc ? (
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-black/[0.08] bg-white">
                    <img
                      src={cert.logoSrc}
                      alt=""
                      aria-hidden="true"
                      className="h-full w-full object-contain p-2"
                    />
                  </span>
                ) : null}
                <div className="min-w-0">
                  <DialogTitle className="text-[1.0625rem] font-semibold leading-[1.29412] tracking-[-0.022em] text-[#1d1d1f]">
                    {cert.title}
                  </DialogTitle>
                  <DialogDescription className="mt-0.5 text-sm leading-[1.42859] tracking-[-0.016em] text-[#6e6e73]">
                    {cert.issuer}
                    {cert.year ? ` · ${cert.year}` : ""}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
            {/* Light-grey stage so the certificate reads as a document; the image box hugs the
                artwork instead of letterboxing it inside a full-width frame. */}
            <div className="relative flex min-h-[16rem] items-center justify-center bg-[#f5f5f7] px-6 py-6 sm:px-8 sm:py-7">
              {!loaded ? (
                <div
                  className="absolute inset-x-6 inset-y-6 animate-pulse rounded-[0.625rem] bg-white/70 motion-reduce:animate-none sm:inset-x-8 sm:inset-y-7"
                  aria-hidden="true"
                />
              ) : null}
              <img
                src={cert.image}
                alt={cert.alt}
                decoding="async"
                onLoad={() => setLoaded(true)}
                className={`block h-auto max-h-[min(70vh,52rem)] w-auto min-w-0 max-w-full rounded-[0.625rem] bg-white object-contain shadow-[0_1px_2px_rgba(0,0,0,0.06),0_14px_34px_-14px_rgba(0,0,0,0.24)] ring-1 ring-black/[0.06] transition-opacity duration-200 motion-reduce:transition-none ${loaded ? "opacity-100" : "opacity-0"}`}
              />
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
