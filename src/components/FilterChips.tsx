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
      {/* Filter chips */}
      <div
        className="flex flex-wrap gap-2"
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
                inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium
                transition-all duration-150 cursor-pointer
                focus:outline-none focus-visible:ring-2 focus-visible:ring-accent
                ${
                  isActive
                    ? "bg-accent/15 text-accent ring-1 ring-accent/30"
                    : "bg-surface-elevated text-text-secondary hover:text-text-primary hover:bg-surface-hover border border-border"
                }
              `}
            >
              {f.label}
              <span
                className={`
                  text-xs px-1.5 py-0.5 rounded-full
                  ${
                    isActive
                      ? "bg-accent/20 text-accent"
                      : "bg-surface-hover text-text-muted"
                  }
                `}
              >
                {f.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative w-full sm:w-64">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
        <input
          ref={searchInputRef}
          type="search"
          placeholder="Search name or ID…   /"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search students by name or admission number"
          className="
            w-full pl-9 pr-3 py-2 rounded-lg text-sm
            bg-surface-elevated border border-border text-text-primary
            placeholder:text-text-muted
            focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:border-accent
            transition-colors duration-150
          "
        />
      </div>
    </div>
  );
}
