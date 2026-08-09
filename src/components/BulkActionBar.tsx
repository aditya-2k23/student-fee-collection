import { Send, Users } from "lucide-react";
import type { StudentViewModel } from "../data/types";

interface BulkActionBarProps {
  selectedStudents: StudentViewModel[];
  onSendReminders: () => void;
  onClearSelection: () => void;
}

export function BulkActionBar({
  selectedStudents,
  onSendReminders,
  onClearSelection,
}: BulkActionBarProps) {
  // Count distinct families — siblings share a familyGroupId
  const familyIds = new Set(selectedStudents.map((s) => s.familyGroupId));
  const familyCount = familyIds.size;
  const studentCount = selectedStudents.length;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 animate-slide-up">
      <div className="max-w-7xl mx-auto px-4 pb-4">
        <div className="bg-surface-elevated border border-border rounded-md px-5 py-3 flex items-center justify-between shadow-xl">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-mono font-medium text-text-primary">
              <Users className="w-4 h-4 text-accent" />
              <span>
                <span className="font-bold tabular-nums text-sm">{studentCount}</span> student{studentCount > 1 ? "s" : ""}
              </span>
              {familyCount !== studentCount && (
                <span className="text-text-muted">
                  (<span className="tabular-nums font-semibold">{familyCount}</span> {familyCount === 1 ? "family" : "families"})
                </span>
              )}
            </div>
            <button
              onClick={onClearSelection}
              className="text-xs font-mono text-text-muted hover:text-text-primary transition-colors cursor-pointer rounded-xs px-2 py-1 border border-border bg-surface-subtle"
            >
              Clear selection
            </button>
          </div>

          <button
            onClick={onSendReminders}
            className="
              inline-flex items-center gap-2 px-4 py-2 rounded-md
              bg-accent text-accent-text hover:bg-accent-hover text-xs font-semibold
              transition-colors cursor-pointer shadow-2xs uppercase tracking-wider font-mono
            "
          >
            <Send className="w-3.5 h-3.5" />
            Send Batch Reminders
          </button>
        </div>
      </div>
    </div>
  );
}
