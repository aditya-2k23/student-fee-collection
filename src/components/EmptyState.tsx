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
    icon: <CheckCircle className="w-8 h-8 text-emerald-400" />,
    title: "All caught up!",
    description:
      "No students currently need follow-up. All fees are either paid, on an instalment plan, or resolved.",
  },
  paid: {
    icon: <Users className="w-8 h-8 text-text-muted" />,
    title: "No paid students yet",
    description:
      "No students have completed their full fee payment for this term.",
  },
  "instalment-plan": {
    icon: <Calendar className="w-8 h-8 text-text-muted" />,
    title: "No instalment plans",
    description: "No students are currently on an instalment plan.",
  },
  withdrawn: {
    icon: <LogOut className="w-8 h-8 text-text-muted" />,
    title: "No withdrawn students",
    description: "No students have been withdrawn this term.",
  },
  all: {
    icon: <Users className="w-8 h-8 text-text-muted" />,
    title: "No students found",
    description:
      "No student records match your current search. Try adjusting your search terms.",
  },
};

export function EmptyState({ filter }: EmptyStateProps) {
  const config = EMPTY_MESSAGES[filter];

  return (
    <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
      <div className="w-16 h-16 rounded-full bg-surface-elevated flex items-center justify-center mb-4">
        {config.icon}
      </div>
      <h3 className="text-base font-semibold text-text-primary mb-1">
        {config.title}
      </h3>
      <p className="text-sm text-text-secondary text-center max-w-sm">
        {config.description}
      </p>
    </div>
  );
}
