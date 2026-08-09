import { Phone, MessageSquare } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import type { StudentViewModel } from "../data/types";
import { formatCurrency, formatPhone } from "../utils/format";

interface StudentCardProps {
  student: StudentViewModel;
  onTap: (student: StudentViewModel) => void;
}

export function StudentCard({ student, onTap }: StudentCardProps) {
  return (
    <div
      onClick={() => onTap(student)}
      onKeyDown={(e) => {
        if (e.key === "Enter") onTap(student);
      }}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${student.name}`}
      className="
        bg-surface-elevated border border-border rounded-xl p-4
        active:bg-surface-hover transition-colors duration-100
        cursor-pointer
        focus:outline-none focus-visible:ring-2 focus-visible:ring-accent
      "
    >
      {/* Top: name + status */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <div className="font-semibold text-text-primary truncate">
            {student.name}
          </div>
          <div className="text-xs text-text-muted mt-0.5">
            Class {student.class}-{student.section}
          </div>
          {student.waiverInfo && (
            <div className="text-xs text-violet-400 mt-1">
              {student.waiverInfo.waiverType} ·{" "}
              {student.waiverInfo.owedComponent} Due{" "}
              {formatCurrency(student.waiverInfo.owedAmount)}
            </div>
          )}
        </div>
        <StatusBadge
          status={student.displayStatus}
          statusColor={student.statusColor}
        />
      </div>

      {/* Middle: balance + overdue */}
      <div className="flex items-baseline justify-between mb-3">
        <div>
          <div className="text-xs text-text-muted">Balance</div>
          <div
            className={`text-lg font-bold ${student.balance > 0 ? "text-red-400" : student.balance < 0 ? "text-sky-400" : "text-emerald-400"}`}
          >
            {student.balance < 0 && "−"}
            {formatCurrency(Math.abs(student.balance))}
          </div>
        </div>
        {student.daysOverdue > 0 && (
          <div className="text-right">
            <div className="text-xs text-text-muted">Overdue</div>
            <div className="text-lg font-bold text-red-400">
              {student.daysOverdue}d
            </div>
          </div>
        )}
      </div>

      {/* Bottom: quick actions */}
      <div className="flex items-center gap-2 pt-3 border-t border-border">
        <a
          href={`tel:${student.guardian.phone}`}
          onClick={(e) => e.stopPropagation()}
          className="
            flex-1 flex items-center justify-center gap-2 py-2 rounded-lg
            bg-surface-hover text-text-secondary text-sm font-medium
            hover:bg-accent/10 hover:text-accent transition-colors
            focus:outline-none focus-visible:ring-2 focus-visible:ring-accent
          "
          aria-label={`Call ${student.guardian.name} at ${formatPhone(student.guardian.phone)}`}
        >
          <Phone className="w-4 h-4" />
          Call
        </a>
        <a
          href={`sms:${student.guardian.phone}`}
          onClick={(e) => e.stopPropagation()}
          className="
            flex-1 flex items-center justify-center gap-2 py-2 rounded-lg
            bg-surface-hover text-text-secondary text-sm font-medium
            hover:bg-accent/10 hover:text-accent transition-colors
            focus:outline-none focus-visible:ring-2 focus-visible:ring-accent
          "
          aria-label={`Message ${student.guardian.name}`}
        >
          <MessageSquare className="w-4 h-4" />
          Message
        </a>
      </div>
    </div>
  );
}
