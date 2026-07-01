import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

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
            <div className="flex items-center justify-center px-6 py-6">
              <img
                src={cert.image}
                alt={cert.alt}
                loading="lazy"
                className="h-auto w-full max-h-[72vh] rounded-md border border-border object-contain"
              />
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
