import { useEffect, useState } from "react";
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
 * site's card tokens (white surface, border-border, rounded-lg, Archivo/Space Grotesk).
 */
export function CertificateModal({ open, onOpenChange, cert }: CertificateModalProps) {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    setLoaded(false);
  }, [cert?.image]);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl border border-border bg-white p-0 gap-0 overflow-hidden sm:rounded-lg motion-reduce:animate-none">
        {cert ? (
          <>
            <DialogHeader className="border-b border-border px-6 py-4 text-left">
              <div className="flex items-center gap-3 pr-8">
                {cert.logoSrc ? (
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-white">
                    <img
                      src={cert.logoSrc}
                      alt=""
                      aria-hidden="true"
                      className="h-full w-full object-contain p-2"
                    />
                  </span>
                ) : null}
                <div className="min-w-0 space-y-1">
                  <DialogTitle className="text-base font-semibold text-foreground">
                    {cert.title}
                  </DialogTitle>
                  <DialogDescription className="text-sm text-muted-foreground">
                    {cert.issuer}
                    {cert.year ? ` · ${cert.year}` : ""}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
            <div className="relative flex min-h-[16rem] items-center justify-center px-6 py-6">
              {!loaded ? (
                <div
                  className="absolute inset-6 animate-pulse rounded-md border border-border bg-muted/40 motion-reduce:animate-none"
                  aria-hidden="true"
                />
              ) : null}
              <img
                src={cert.image}
                alt={cert.alt}
                decoding="async"
                onLoad={() => setLoaded(true)}
                className={`h-auto w-full max-h-[72vh] rounded-md border border-border object-contain transition-opacity duration-200 motion-reduce:transition-none ${loaded ? "opacity-100" : "opacity-0"}`}
              />
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
