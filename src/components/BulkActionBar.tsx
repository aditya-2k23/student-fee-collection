import { Send, Users } from 'lucide-react';
import type { StudentViewModel } from '../data/types';

interface BulkActionBarProps {
  selectedStudents: StudentViewModel[];
  onSendReminders: () => void;
  onClearSelection: () => void;
}

export function BulkActionBar({ selectedStudents, onSendReminders, onClearSelection }: BulkActionBarProps) {
  // Count distinct families — siblings share a familyGroupId
  const familyIds = new Set(selectedStudents.map((s) => s.familyGroupId));
  const familyCount = familyIds.size;
  const studentCount = selectedStudents.length;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 animate-slide-up">
      <div className="max-w-7xl mx-auto px-4 pb-4">
        <div className="bg-surface-elevated border border-border rounded-xl px-5 py-3 flex items-center justify-between shadow-2xl shadow-black/40">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-text-primary">
              <Users className="w-4 h-4 text-accent" />
              <span className="font-medium">{studentCount} student{studentCount > 1 ? 's' : ''}</span>
              {familyCount !== studentCount && (
                <span className="text-text-muted">
                  ({familyCount} {familyCount === 1 ? 'family' : 'families'})
                </span>
              )}
            </div>
            <button
              onClick={onClearSelection}
              className="text-xs text-text-muted hover:text-text-secondary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded px-2 py-1"
            >
              Clear
            </button>
          </div>

          <button
            onClick={onSendReminders}
            className="
              inline-flex items-center gap-2 px-4 py-2 rounded-lg
              bg-accent hover:bg-accent-hover text-white text-sm font-medium
              transition-colors duration-150
              focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface-elevated
            "
          >
            <Send className="w-4 h-4" />
            Send Reminders
          </button>
        </div>
      </div>
    </div>
  );
}
