import { forwardRef, type ButtonHTMLAttributes } from "react";

interface SpotlightTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  hint: string;
}

/** The "+" button that opens a panel. Shared by the panel and its placeholder so they look the same. */
export const SpotlightTrigger = forwardRef<HTMLButtonElement, SpotlightTriggerProps>(function SpotlightTrigger(
  { label, hint, ...props },
  ref,
) {
  return (
    <button ref={ref} type="button" className="role-spotlight-trigger" aria-haspopup="dialog" {...props}>
      <span className="role-spotlight-trigger-copy">
        <span className="role-spotlight-trigger-label">{label}</span>
        <span className="role-spotlight-trigger-hint">{hint}</span>
      </span>
      <span className="role-spotlight-trigger-icon" aria-hidden="true">
        <svg viewBox="0 0 20 20">
          <path d="M10 4.5v11M4.5 10h11" />
        </svg>
      </span>
    </button>
  );
});
