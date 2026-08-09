import { StatusBadge } from "./StatusBadge";
import type { StudentViewModel } from "../data/types";
import { formatCurrency, formatPhone } from "../utils/format";

interface StudentTableProps {
  students: StudentViewModel[];
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onRowClick: (student: StudentViewModel) => void;
  allSelected: boolean;
  someSelected: boolean;
}

export function StudentTable({
  students,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onRowClick,
  allSelected,
  someSelected,
}: StudentTableProps) {
  return (
    <div className="overflow-x-auto rounded-md border border-border bg-surface shadow-2xs">
      <table className="w-full text-sm text-left border-collapse" role="grid">
        <thead>
          <tr className="bg-surface-subtle border-b border-border text-xs text-text-muted font-mono font-semibold uppercase tracking-wider">
            <th scope="col" className="w-12 px-3 py-2.5 text-center">
              <input
                type="checkbox"
                checked={allSelected}
                ref={(el) => {
                  if (el) el.indeterminate = someSelected && !allSelected;
                }}
                onChange={onToggleSelectAll}
                aria-label={
                  allSelected ? "Deselect all students" : "Select all students"
                }
                className="w-4 h-4 rounded-xs border-border accent-accent cursor-pointer"
              />
            </th>
            <th scope="col" className="px-4 py-2.5">
              Student / Admission
            </th>
            <th scope="col" className="px-4 py-2.5 hidden lg:table-cell">
              Class
            </th>
            <th scope="col" className="px-4 py-2.5 hidden xl:table-cell">
              Guardian Phone
            </th>
            <th scope="col" className="px-4 py-2.5 text-right font-mono">
              Balance
            </th>
            <th scope="col" className="px-4 py-2.5">
              Register Status
            </th>
            <th scope="col" className="px-4 py-2.5 text-right font-mono">
              Overdue
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/60">
          {students.map((student) => {
            const isSelected = selectedIds.has(student.id);

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
              <tr
                key={student.id}
                onClick={() => onRowClick(student)}
                className={`
                  cursor-pointer transition-colors duration-100 ${tabBorderClass}
                  ${
                    isSelected
                      ? "bg-accent-bg/40 hover:bg-accent-bg/60"
                      : "hover:bg-surface-hover"
                  }
                `}
                tabIndex={0}
                role="row"
                aria-selected={isSelected}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    if (e.key === " ") {
                      onToggleSelect(student.id);
                    } else {
                      onRowClick(student);
                    }
                  }
                }}
              >
                <td className="px-3 py-3 text-center">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => {
                      e.stopPropagation();
                      onToggleSelect(student.id);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    aria-label={`Select ${student.name}`}
                    className="w-4 h-4 rounded-xs border-border accent-accent cursor-pointer"
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="font-semibold text-text-primary flex items-center gap-2">
                    <span>{student.name}</span>
                    <span className="text-[11px] font-mono font-normal text-text-muted">
                      ({student.admissionNo})
                    </span>
                  </div>
                  {student.waiverInfo && (
                    <div className="text-xs font-mono text-blue-700 dark:text-blue-400 mt-0.5 font-medium">
                      {student.waiverInfo.waiverType} ·{" "}
                      {student.waiverInfo.owedComponent} Due{" "}
                      <span className="tabular-nums">
                        {formatCurrency(student.waiverInfo.owedAmount)}
                      </span>
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 text-text-secondary hidden lg:table-cell font-mono text-xs font-medium">
                  {student.class}-{student.section}
                </td>
                <td className="px-4 py-3 text-text-secondary hidden xl:table-cell font-mono text-xs">
                  <a
                    href={`tel:${student.guardian.phone}`}
                    className="hover:text-accent hover:underline transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {formatPhone(student.guardian.phone)}
                  </a>
                </td>
                <td className="px-4 py-3 text-right font-mono text-sm tabular-nums">
                  <span
                    className={
                      student.balance > 0
                        ? student.daysOverdue > 30
                          ? "text-rose-700 dark:text-red-500 font-extrabold"
                          : "text-rose-600 dark:text-red-400 font-bold"
                        : student.balance < 0
                          ? "text-blue-700 dark:text-blue-400 font-bold"
                          : "text-emerald-700 dark:text-emerald-400 font-bold"
                    }
                  >
                    {student.balance < 0 && "−"}
                    {formatCurrency(Math.abs(student.balance))}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge
                    status={student.displayStatus}
                    statusColor={student.statusColor}
                  />
                </td>
                <td className="px-4 py-3 text-right font-mono text-xs tabular-nums">
                  {student.daysOverdue > 0 ? (
                    <span className={student.daysOverdue > 30 ? "text-rose-700 dark:text-red-500 font-extrabold" : "text-rose-600 dark:text-red-400 font-bold"}>
                      {student.daysOverdue}d
                    </span>
                  ) : (
                    <span className="text-text-muted">—</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
