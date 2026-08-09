import { Search } from "lucide-react";
import type { FilterKey, Summary } from "../data/types";

interface FilterChipsProps {
  activeFilter: FilterKey;
  onFilterChange: (filter: FilterKey) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
  summary: Summary;
}

interface FilterOption {
  key: FilterKey;
  label: string;
  count: number;
}

export function FilterChips({
  activeFilter,
  onFilterChange,
  searchQuery,
  onSearchChange,
  searchInputRef,
  summary,
}: FilterChipsProps) {
  const filters: FilterOption[] = [
    {
      key: "action-required",
      label: "Action Required",
      count: summary.actionRequiredCount,
    },
    { key: "paid", label: "Paid", count: summary.paidCount },
    {
      key: "instalment-plan",
      label: "Instalment Plan",
      count: summary.instalmentPlanCount,
    },
    { key: "withdrawn", label: "Withdrawn", count: summary.withdrawnCount },
    { key: "all", label: "All", count: summary.totalStudents },
  ];

  return (
    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
      {/* Ledger Register Filter Tabs */}
      <div
        className="flex flex-wrap gap-1.5 p-1 bg-surface-elevated border border-border rounded-md shadow-2xs"
        role="tablist"
        aria-label="Filter students by status"
      >
        {filters.map((f) => {
          const isActive = activeFilter === f.key;
          return (
            <button
              key={f.key}
              role="tab"
              aria-selected={isActive}
              onClick={() => onFilterChange(f.key)}
              className={`
                inline-flex items-center gap-2 px-3 py-1.5 rounded text-xs font-semibold
                transition-colors cursor-pointer select-none
                ${
                  isActive
                    ? "bg-accent text-accent-text shadow-2xs"
                    : "text-text-secondary hover:text-text-primary hover:bg-surface-hover"
                }
              `}
            >
              <span>{f.label}</span>
              <span
                className={`
                  text-[11px] font-mono tabular-nums px-1.5 py-0.2 rounded-xs
                  ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-surface-subtle text-text-muted border border-border-subtle"
                  }
                `}
              >
                {f.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search Input */}
      <div className="relative w-full sm:w-64">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
        <input
          ref={searchInputRef}
          type="search"
          placeholder="Search name, ID (press '/')"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search students by name or admission number"
          className="
            w-full pl-9 pr-8 py-1.5 rounded-md text-xs font-medium
            bg-surface-elevated border border-border text-text-primary
            placeholder:text-text-muted
            focus:outline-none focus:border-accent
            transition-colors
          "
        />
        {!searchQuery && (
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-mono text-text-muted bg-surface-subtle border border-border rounded-xs">
            /
          </kbd>
        )}
      </div>
    </div>
  );
}
