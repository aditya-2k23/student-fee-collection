import type { DisplayStatus } from "../data/types";

interface StatusBadgeProps {
  status: DisplayStatus;
  statusColor: string;
}

/**
 * Official Ledger Status Stamps & Tags
 * - Action Required items (Overdue, Bounced, Partial) use framed uppercase STAMP styling.
 * - Informational / Settled items (Paid, Instalment, Credit, Withdrawn) use clean administrative tags.
 */
export function StatusBadge({ status, statusColor }: StatusBadgeProps) {
  // Urgent Action Required Stamps (Overdue, Cheque Bounced, Partial)
  if (statusColor === "red" || statusColor === "rose") {
    // Overdue or Payment Failed (Cheque Bounced)
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm font-mono text-[11px] font-bold uppercase tracking-wider border-2 border-rose-400 dark:border-red-500/80 bg-rose-50 dark:bg-red-950/40 text-rose-700 dark:text-red-400 shadow-2xs">
        <span className="w-1.5 h-1.5 rounded-full bg-rose-600 dark:bg-red-500 animate-pulse" />
        {status}
      </span>
    );
  }

  if (statusColor === "amber") {
    // Partial Payment Due
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm font-mono text-[11px] font-bold uppercase tracking-wider border border-amber-500 dark:border-amber-500/70 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-600 dark:bg-amber-500" />
        {status}
      </span>
    );
  }

  if (statusColor === "emerald") {
    // Paid in Full or Credit
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm text-xs font-semibold border border-emerald-600/40 dark:border-emerald-500/40 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300">
        ✓ {status}
      </span>
    );
  }

  if (statusColor === "sky" || statusColor === "violet") {
    // Instalment Plan or Scholarship Context
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm text-xs font-semibold border border-blue-600/40 dark:border-blue-500/40 bg-blue-100 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300">
        {status}
      </span>
    );
  }

  // Default Slate (Withdrawn or Routine)
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm text-xs font-medium border border-border bg-surface-subtle text-text-muted">
      {status}
    </span>
  );
}
