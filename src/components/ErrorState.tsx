import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 bg-surface border border-border rounded-md shadow-2xs animate-fade-in">
      <div className="w-14 h-14 rounded-md bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 flex items-center justify-center mb-3">
        <AlertTriangle className="w-7 h-7 text-red-600 dark:text-red-400" />
      </div>
      <h2 className="text-base font-bold font-mono text-text-primary mb-1">
        REGISTER DATA ERROR
      </h2>
      <p className="text-xs font-mono text-text-muted mb-5 text-center max-w-md">
        {message}
      </p>
      <button
        onClick={onRetry}
        className="
          inline-flex items-center gap-2 px-4 py-2 rounded-md
          bg-accent text-accent-text hover:bg-accent-hover text-xs font-mono font-semibold uppercase tracking-wider
          transition-colors cursor-pointer shadow-2xs
        "
      >
        <RefreshCw className="w-3.5 h-3.5" />
        Retry Data Load
      </button>
    </div>
  );
}
