import { CheckCircle, Calendar, LogOut, Users } from "lucide-react";
import type { FilterKey } from "../data/types";

interface EmptyStateProps {
  filter: FilterKey;
}

const EMPTY_MESSAGES: Record<
  FilterKey,
  { icon: React.ReactNode; title: string; description: string }
> = {
  "action-required": {
    icon: <CheckCircle className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />,
    title: "All Action Items Resolved",
    description:
      "No student accounts currently require follow-up. All fees are paid, scheduled on an instalment plan, or resolved.",
  },
  paid: {
    icon: <Users className="w-8 h-8 text-text-muted" />,
    title: "No Paid Records Found",
    description:
      "No students have completed their full fee payment for this term.",
  },
  "instalment-plan": {
    icon: <Calendar className="w-8 h-8 text-text-muted" />,
    title: "No Instalment Plans Recorded",
    description: "No student accounts are currently on an active instalment schedule.",
  },
  withdrawn: {
    icon: <LogOut className="w-8 h-8 text-text-muted" />,
    title: "No Withdrawn Student Records",
    description: "No student withdrawals recorded for this term.",
  },
  all: {
    icon: <Users className="w-8 h-8 text-text-muted" />,
    title: "No Register Records Found",
    description:
      "No student records match your current search query. Try searching by name or admission number.",
  },
};

export function EmptyState({ filter }: EmptyStateProps) {
  const config = EMPTY_MESSAGES[filter];

  return (
    <div className="flex flex-col items-center justify-center py-16 animate-fade-in bg-surface border border-border rounded-md shadow-2xs">
      <div className="w-14 h-14 rounded-md bg-surface-subtle border border-border flex items-center justify-center mb-3">
        {config.icon}
      </div>
      <h3 className="text-base font-bold font-mono text-text-primary mb-1">
        {config.title}
      </h3>
      <p className="text-xs font-mono text-text-muted text-center max-w-md">
        {config.description}
      </p>
    </div>
  );
}
