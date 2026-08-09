import { Phone, MessageSquare } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import type { StudentViewModel } from "../data/types";
import { formatCurrency, formatPhone } from "../utils/format";

interface StudentCardProps {
  student: StudentViewModel;
  onTap: (student: StudentViewModel) => void;
}

export function StudentCard({ student, onTap }: StudentCardProps) {
  // Left Margin Ledger Index Tab border calculation
  let tabBorderClass = "border-l-4 border-l-transparent";
  if (student.statusColor === "red" || student.statusColor === "rose") {
    tabBorderClass = "border-l-4 border-l-rose-500/80 dark:border-l-red-500/80";
  } else if (student.statusColor === "amber") {
    tabBorderClass = "border-l-4 border-l-amber-600 dark:border-l-amber-500";
  } else if (student.statusColor === "sky" || student.statusColor === "violet") {
    tabBorderClass = "border-l-4 border-l-blue-600 dark:border-l-blue-500";
  } else if (student.statusColor === "emerald") {
    tabBorderClass = "border-l-4 border-l-emerald-600 dark:border-l-emerald-500";
  }

  return (
    <div
      onClick={() => onTap(student)}
      onKeyDown={(e) => {
        if (e.key === "Enter") onTap(student);
      }}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${student.name}`}
      className={`
        bg-surface-elevated border border-border rounded-md p-4 ${tabBorderClass}
        active:bg-surface-hover transition-colors shadow-2xs
        cursor-pointer select-none
      `}
    >
      {/* Top: name + status */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <div className="font-bold text-text-primary truncate text-base">
            {student.name}
          </div>
          <div className="text-xs font-mono text-text-muted mt-0.5">
            Class {student.class}-{student.section} · {student.admissionNo}
          </div>
          {student.waiverInfo && (
            <div className="text-xs font-mono text-blue-700 dark:text-blue-400 mt-1 font-medium">
              {student.waiverInfo.waiverType} ·{" "}
              {student.waiverInfo.owedComponent} Due{" "}
              <span className="tabular-nums">
                {formatCurrency(student.waiverInfo.owedAmount)}
              </span>
            </div>
          )}
        </div>
        <StatusBadge
          status={student.displayStatus}
          statusColor={student.statusColor}
        />
      </div>

      {/* Middle: balance + overdue */}
      <div className="flex items-baseline justify-between mb-3 bg-surface-subtle p-2.5 rounded-sm border border-border-subtle">
        <div>
          <div className="text-[11px] font-mono text-text-muted uppercase tracking-wider">
            Balance
          </div>
          <div
            className={`text-lg font-mono tabular-nums ${
              student.balance > 0
                ? student.daysOverdue > 30
                  ? "text-rose-700 dark:text-red-500 font-extrabold"
                  : "text-rose-600 dark:text-red-400 font-bold"
                : student.balance < 0
                  ? "text-blue-700 dark:text-blue-400 font-bold"
                  : "text-emerald-700 dark:text-emerald-400 font-bold"
            }`}
          >
            {student.balance < 0 && "−"}
            {formatCurrency(Math.abs(student.balance))}
          </div>
        </div>
        {student.daysOverdue > 0 && (
          <div className="text-right">
            <div className="text-[11px] font-mono text-text-muted uppercase tracking-wider">
              Overdue
            </div>
            <div className={`text-lg font-mono tabular-nums ${student.daysOverdue > 30 ? "text-rose-700 dark:text-red-500 font-extrabold" : "text-rose-600 dark:text-red-400 font-bold"}`}>
              {student.daysOverdue}d
            </div>
          </div>
        )}
      </div>

      {/* Bottom: quick actions */}
      <div className="flex items-center gap-2 pt-2 border-t border-border">
        <a
          href={`tel:${student.guardian.phone}`}
          onClick={(e) => e.stopPropagation()}
          className="
            flex-1 flex items-center justify-center gap-2 py-2 rounded-sm
            bg-surface-subtle text-text-primary text-xs font-semibold border border-border
            hover:bg-accent hover:text-accent-text transition-colors
          "
          aria-label={`Call ${student.guardian.name} at ${formatPhone(student.guardian.phone)}`}
        >
          <Phone className="w-3.5 h-3.5" />
          Call
        </a>
        <a
          href={`sms:${student.guardian.phone}`}
          onClick={(e) => e.stopPropagation()}
          className="
            flex-1 flex items-center justify-center gap-2 py-2 rounded-sm
            bg-surface-subtle text-text-primary text-xs font-semibold border border-border
            hover:bg-accent hover:text-accent-text transition-colors
          "
          aria-label={`Message ${student.guardian.name}`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          Message
        </a>
      </div>
    </div>
  );
}
