import { IndianRupee, AlertTriangle, Clock, TrendingDown, FileSpreadsheet } from "lucide-react";
import type { Summary, Meta } from "../data/types";
import { formatCurrency, formatDateTime } from "../utils/format";

interface SummaryBarProps {
  summary: Summary;
  meta: Meta;
}

export function SummaryBar({ summary, meta }: SummaryBarProps) {
  return (
    <div className="bg-surface-elevated border border-border rounded-md shadow-2xs overflow-hidden">
      {/* Top Banner / Ledger Register Seal */}
      <div className="bg-surface-subtle border-b border-border px-4 py-2 flex items-center justify-between text-xs text-text-muted">
        <div className="flex items-center gap-2 font-mono font-medium">
          <FileSpreadsheet className="w-3.5 h-3.5 text-accent" />
          <span>MASTER FEE REGISTER SUMMARY</span>
        </div>
        <div className="font-mono text-[11px]">
          {meta.term} · {meta.academicYear}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-border">
        {/* Total Outstanding — largest ledger figure on screen */}
        <div className="col-span-1 sm:col-span-2 p-4 sm:p-5 relative bg-surface">
          <div className="flex items-center gap-2 text-text-muted text-xs font-semibold uppercase tracking-wider mb-1.5">
            <IndianRupee className="w-4 h-4 text-accent" />
            <span>Total Outstanding Balance</span>
          </div>
          <div className="text-3xl sm:text-4xl font-bold font-mono text-text-primary tabular-nums tracking-tight">
            {formatCurrency(summary.totalOutstanding)}
          </div>
          {/* Credits and refunds line */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2.5 text-xs text-text-muted font-medium">
            {summary.totalCredits > 0 && (
              <span className="flex items-center gap-1">
                <TrendingDown className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                <span className="font-mono tabular-nums">{formatCurrency(summary.totalCredits)}</span> advance credit
              </span>
            )}
            {summary.totalRefundsDue > 0 && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                <span className="font-mono tabular-nums">{formatCurrency(summary.totalRefundsDue)}</span> pending refund
              </span>
            )}
          </div>
        </div>

        {/* Action Required count */}
        <div className="p-4 sm:p-5 bg-surface">
          <div className="flex items-center gap-2 text-text-muted text-xs font-semibold uppercase tracking-wider mb-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>Action Required</span>
          </div>
          <div className="flex items-baseline gap-2">
            <div className="text-3xl font-bold font-mono text-text-primary tabular-nums">
              {summary.actionRequiredCount}
            </div>
            <div className="text-xs text-text-muted font-medium">
              of <span className="font-mono">{summary.totalStudents}</span> students
            </div>
          </div>
          <div className="text-[11px] text-text-muted mt-2 font-mono">
            Priority sorted worst-first
          </div>
        </div>

        {/* Data snapshot timestamp */}
        <div className="p-4 sm:p-5 bg-surface">
          <div className="flex items-center gap-2 text-text-muted text-xs font-semibold uppercase tracking-wider mb-1.5">
            <Clock className="w-4 h-4 text-text-muted" />
            <span>Data Snapshot</span>
          </div>
          <div className="text-sm font-semibold font-mono text-text-primary">
            {formatDateTime(meta.asOf)}
          </div>
          <div className="text-xs text-text-muted mt-1.5">
            Static export snapshot
          </div>
        </div>
      </div>
    </div>
  );
}
