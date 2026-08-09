import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { GraduationCap } from "lucide-react";
import type {
  FeeData,
  StudentViewModel,
  FilterKey,
  Meta,
  Summary,
} from "./data/types";
import { fetchFeeData } from "./data/dataService";
import { toStudentViewModel, computeSummary } from "./data/viewModel";
import { SummaryBar } from "./components/SummaryBar";
import { FilterChips } from "./components/FilterChips";
import { StudentTable } from "./components/StudentTable";
import { StudentCard } from "./components/StudentCard";
import { DetailDrawer } from "./components/DetailDrawer";
import { BulkActionBar } from "./components/BulkActionBar";
import { ReminderModal } from "./components/ReminderModal";
import { LoadingState } from "./components/LoadingState";
import { ErrorState } from "./components/ErrorState";
import { EmptyState } from "./components/EmptyState";

type AppState =
  | { kind: "loading" }
  | { kind: "error"; message: string }
  | { kind: "loaded"; data: FeeData; students: StudentViewModel[] };

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(query).matches : false,
  );

  useEffect(() => {
    const mq = window.matchMedia(query);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [query]);

  return matches;
}

export default function App() {
  // ─── Data state ───
  const [appState, setAppState] = useState<AppState>({ kind: "loading" });

  // ─── UI state ───
  const [activeFilter, setActiveFilter] =
    useState<FilterKey>("action-required");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [drawerStudent, setDrawerStudent] = useState<StudentViewModel | null>(
    null,
  );
  const [showReminderModal, setShowReminderModal] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  // ─── Data fetching ───
  const loadData = useCallback(() => {
    setAppState({ kind: "loading" });
    fetchFeeData()
      .then((data) => {
        const students = data.students
          .map(toStudentViewModel)
          .sort((a, b) => b.priorityScore - a.priorityScore);
        setAppState({ kind: "loaded", data, students });
      })
      .catch((err) => {
        setAppState({
          kind: "error",
          message:
            err instanceof Error ? err.message : "Failed to load fee data.",
        });
      });
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ─── Keyboard shortcuts ───
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // '/' focuses search (unless already in an input)
      if (
        e.key === "/" &&
        !drawerStudent &&
        !showReminderModal &&
        !(e.target instanceof HTMLInputElement) &&
        !(e.target instanceof HTMLTextAreaElement)
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }

      // Esc closes drawer/modal (handled within those components too, but this is a safety net)
      if (e.key === "Escape") {
        if (showReminderModal) {
          setShowReminderModal(false);
        } else if (drawerStudent) {
          setDrawerStudent(null);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [drawerStudent, showReminderModal]);

  // ─── Derived data ───
  const { meta, summary, filteredStudents } = useMemo(() => {
    if (appState.kind !== "loaded") {
      return {
        meta: null as Meta | null,
        summary: null as Summary | null,
        filteredStudents: [] as StudentViewModel[],
      };
    }

    const allStudents = appState.students;
    const summaryResult = computeSummary(allStudents);

    // Apply filter
    let filtered = allStudents;
    switch (activeFilter) {
      case "action-required":
        filtered = allStudents.filter((s) => s.isActionRequired);
        break;
      case "paid":
        filtered = allStudents.filter((s) => s.rawStatus === "PAID");
        break;
      case "instalment-plan":
        filtered = allStudents.filter((s) => s.rawStatus === "INSTALMENT_PLAN");
        break;
      case "withdrawn":
        filtered = allStudents.filter((s) => s.rawStatus === "WITHDRAWN");
        break;
      case "all":
        break;
    }

    // Apply search
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.admissionNo.toLowerCase().includes(q) ||
          s.guardian.name.toLowerCase().includes(q),
      );
    }

    return {
      meta: appState.data.meta,
      summary: summaryResult,
      filteredStudents: filtered,
    };
  }, [appState, activeFilter, searchQuery]);

  // ─── Selection handlers ───
  const handleToggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const handleToggleSelectAll = useCallback(() => {
    if (!filteredStudents.length) return;

    setSelectedIds((prev) => {
      const allFilteredIds = filteredStudents.map((s) => s.id);
      const allSelected = allFilteredIds.every((id) => prev.has(id));

      if (allSelected) {
        // Deselect all filtered
        const next = new Set(prev);
        allFilteredIds.forEach((id) => next.delete(id));
        return next;
      } else {
        // Select all filtered
        const next = new Set(prev);
        allFilteredIds.forEach((id) => next.add(id));
        return next;
      }
    });
  }, [filteredStudents]);

  const handleClearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  // ─── Row click → drawer ───
  const handleRowClick = useCallback((student: StudentViewModel) => {
    setDrawerStudent(student);
  }, []);

  // ─── Reminder modal ───
  const handleSendReminders = useCallback(() => {
    setShowReminderModal(true);
  }, []);

  const handleReminderConfirm = useCallback(() => {
    setShowReminderModal(false);
    setSelectedIds(new Set());
  }, []);

  // ─── Selected students (for bulk bar & modal) ───
  const selectedStudents = useMemo(() => {
    if (appState.kind !== "loaded") return [];
    return appState.students.filter((s) => selectedIds.has(s.id));
  }, [appState, selectedIds]);

  // ─── Selection state for table header checkbox ───
  const allFilteredSelected =
    filteredStudents.length > 0 &&
    filteredStudents.every((s) => selectedIds.has(s.id));
  const someFilteredSelected = filteredStudents.some((s) =>
    selectedIds.has(s.id),
  );

  // ─── Render ───
  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <header className="border-b border-border bg-surface-elevated/80 backdrop-blur-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-accent/15 flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h1 className="text-base font-semibold text-text-primary leading-tight">
              Fee Collection
            </h1>
            {appState.kind === "loaded" && (
              <p className="text-xs text-text-muted">
                {appState.data.meta.school}
              </p>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {appState.kind === "loading" && <LoadingState />}

        {appState.kind === "error" && (
          <ErrorState message={appState.message} onRetry={loadData} />
        )}

        {appState.kind === "loaded" && meta && summary && (
          <>
            <SummaryBar summary={summary} meta={meta} />

            <FilterChips
              activeFilter={activeFilter}
              onFilterChange={(f) => {
                setActiveFilter(f);
                // Clear selection when changing filters to avoid confusion
                setSelectedIds(new Set());
              }}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              searchInputRef={searchInputRef}
              summary={summary}
            />

            {filteredStudents.length === 0 ? (
              <EmptyState filter={activeFilter} />
            ) : isDesktop ? (
              <StudentTable
                students={filteredStudents}
                selectedIds={selectedIds}
                onToggleSelect={handleToggleSelect}
                onToggleSelectAll={handleToggleSelectAll}
                onRowClick={handleRowClick}
                allSelected={allFilteredSelected}
                someSelected={someFilteredSelected}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredStudents.map((student) => (
                  <StudentCard
                    key={student.id}
                    student={student}
                    onTap={handleRowClick}
                  />
                ))}
              </div>
            )}

            {/* Spacer when bulk bar is visible, so content isn't hidden behind it */}
            {selectedIds.size > 0 && <div className="h-20" />}
          </>
        )}
      </main>

      {/* Bulk action bar */}
      {selectedStudents.length > 0 && (
        <BulkActionBar
          selectedStudents={selectedStudents}
          onSendReminders={handleSendReminders}
          onClearSelection={handleClearSelection}
        />
      )}

      {/* Detail drawer */}
      {drawerStudent && (
        <DetailDrawer
          student={drawerStudent}
          onClose={() => setDrawerStudent(null)}
        />
      )}

      {/* Reminder modal */}
      {showReminderModal && selectedStudents.length > 0 && (
        <ReminderModal
          students={selectedStudents}
          onClose={() => setShowReminderModal(false)}
          onConfirm={handleReminderConfirm}
        />
      )}
    </div>
  );
}
