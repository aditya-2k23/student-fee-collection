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
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-sm" role="grid">
        <thead>
          <tr className="bg-surface-elevated border-b border-border text-left">
            <th scope="col" className="w-12 px-4 py-3">
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
                className="w-4 h-4 rounded border-border-light accent-accent cursor-pointer"
              />
            </th>
            <th
              scope="col"
              className="px-4 py-3 font-semibold text-text-secondary text-xs uppercase tracking-wider"
            >
              Student
            </th>
            <th
              scope="col"
              className="px-4 py-3 font-semibold text-text-secondary text-xs uppercase tracking-wider"
            >
              Class
            </th>
            <th
              scope="col"
              className="px-4 py-3 font-semibold text-text-secondary text-xs uppercase tracking-wider hidden xl:table-cell"
            >
              Guardian Phone
            </th>
            <th
              scope="col"
              className="px-4 py-3 font-semibold text-text-secondary text-xs uppercase tracking-wider text-right"
            >
              Balance
            </th>
            <th
              scope="col"
              className="px-4 py-3 font-semibold text-text-secondary text-xs uppercase tracking-wider"
            >
              Status
            </th>
            <th
              scope="col"
              className="px-4 py-3 font-semibold text-text-secondary text-xs uppercase tracking-wider text-right"
            >
              Days Overdue
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {students.map((student) => {
            const isSelected = selectedIds.has(student.id);
            return (
              <tr
                key={student.id}
                onClick={() => onRowClick(student)}
                className={`
                  cursor-pointer transition-colors duration-100
                  ${
                    isSelected
                      ? "bg-accent/5 hover:bg-accent/10"
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
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => {
                      e.stopPropagation();
                      onToggleSelect(student.id);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    aria-label={`Select ${student.name}`}
                    className="w-4 h-4 rounded border-border-light accent-accent cursor-pointer"
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium text-text-primary">
                    {student.name}
                  </div>
                  {student.waiverInfo && (
                    <div className="text-xs text-violet-400 mt-0.5">
                      {student.waiverInfo.waiverType} ·{" "}
                      {student.waiverInfo.owedComponent} Due{" "}
                      {formatCurrency(student.waiverInfo.owedAmount)}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 text-text-secondary">
                  {student.class}-{student.section}
                </td>
                <td className="px-4 py-3 text-text-secondary hidden xl:table-cell">
                  <a
                    href={`tel:${student.guardian.phone}`}
                    className="hover:text-accent transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {formatPhone(student.guardian.phone)}
                  </a>
                </td>
                <td className="px-4 py-3 text-right font-semibold">
                  <span
                    className={
                      student.balance > 0
                        ? "text-red-400"
                        : student.balance < 0
                          ? "text-sky-400"
                          : "text-emerald-400"
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
                <td className="px-4 py-3 text-right text-text-secondary">
                  {student.daysOverdue > 0 ? (
                    <span className="text-red-400 font-medium">
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
