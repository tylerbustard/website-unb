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
            <DialogHeader className="space-y-1 border-b border-border px-6 py-4 text-left">
              <DialogTitle className="pr-8 text-base font-semibold text-foreground">
                {cert.title}
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                {cert.issuer}
                {cert.year ? ` · ${cert.year}` : ""}
              </DialogDescription>
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
