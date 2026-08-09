import type { DisplayStatus } from "../data/types";

interface StatusBadgeProps {
  status: DisplayStatus;
  statusColor: string;
}

/**
 * Tailwind needs to see full class names at build time — no interpolation.
 * This lookup maps our color keys to concrete class strings.
 */
const COLOR_CLASSES: Record<
  string,
  { bg: string; text: string; ring: string }
> = {
  red: { bg: "bg-red-500/15", text: "text-red-400", ring: "ring-red-500/25" },
  amber: {
    bg: "bg-amber-500/15",
    text: "text-amber-400",
    ring: "ring-amber-500/25",
  },
  emerald: {
    bg: "bg-emerald-500/15",
    text: "text-emerald-400",
    ring: "ring-emerald-500/25",
  },
  sky: { bg: "bg-sky-500/15", text: "text-sky-400", ring: "ring-sky-500/25" },
  rose: {
    bg: "bg-rose-500/15",
    text: "text-rose-400",
    ring: "ring-rose-500/25",
  },
  violet: {
    bg: "bg-violet-500/15",
    text: "text-violet-400",
    ring: "ring-violet-500/25",
  },
  slate: {
    bg: "bg-slate-500/15",
    text: "text-slate-400",
    ring: "ring-slate-500/25",
  },
};

export function StatusBadge({ status, statusColor }: StatusBadgeProps) {
  const colors = COLOR_CLASSES[statusColor] ?? COLOR_CLASSES.slate;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ring-1 ring-inset ${colors.bg} ${colors.text} ${colors.ring}`}
    >
      {status}
    </span>
  );
}
