import { IndianRupee, AlertTriangle, Clock, TrendingDown } from 'lucide-react';
import type { Summary, Meta } from '../data/types';
import { formatCurrency, formatDateTime } from '../utils/format';

interface SummaryBarProps {
  summary: Summary;
  meta: Meta;
}

export function SummaryBar({ summary, meta }: SummaryBarProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Outstanding — the largest number on screen */}
      <div className="col-span-1 sm:col-span-2 bg-surface-elevated border border-border rounded-xl p-5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-2 text-text-secondary text-sm mb-1">
            <IndianRupee className="w-4 h-4" />
            <span>Total Outstanding</span>
          </div>
          <div className="text-3xl sm:text-4xl font-bold text-text-primary tracking-tight">
            {formatCurrency(summary.totalOutstanding)}
          </div>
          {/* Credits and refunds as secondary lines — not folded into the total */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-text-muted">
            {summary.totalCredits > 0 && (
              <span className="flex items-center gap-1">
                <TrendingDown className="w-3 h-3 text-sky-400" />
                {formatCurrency(summary.totalCredits)} in advance payments
              </span>
            )}
            {summary.totalRefundsDue > 0 && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-400" />
                {formatCurrency(summary.totalRefundsDue)} refunds pending
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action Required count */}
      <div className="bg-surface-elevated border border-border rounded-xl p-5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-2 text-text-secondary text-sm mb-1">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Action Required</span>
          </div>
          <div className="text-3xl font-bold text-text-primary">
            {summary.actionRequiredCount}
          </div>
          <div className="text-xs text-text-muted mt-1">
            of {summary.totalStudents} students
          </div>
        </div>
      </div>

      {/* Data timestamp */}
      <div className="bg-surface-elevated border border-border rounded-xl p-5">
        <div className="flex items-center gap-2 text-text-secondary text-sm mb-1">
          <Clock className="w-4 h-4" />
          <span>Data Snapshot</span>
        </div>
        <div className="text-sm font-medium text-text-primary mt-2">
          {formatDateTime(meta.asOf)}
        </div>
        <div className="text-xs text-text-muted mt-1">
          {meta.term} · {meta.academicYear}
        </div>
      </div>
    </div>
  );
}
