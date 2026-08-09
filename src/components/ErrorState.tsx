import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
      <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
        <AlertTriangle className="w-8 h-8 text-red-400" />
      </div>
      <h2 className="text-lg font-semibold text-text-primary mb-2">Something went wrong</h2>
      <p className="text-sm text-text-secondary mb-6 text-center max-w-sm">
        {message}
      </p>
      <button
        onClick={onRetry}
        className="
          inline-flex items-center gap-2 px-4 py-2 rounded-lg
          bg-accent hover:bg-accent-hover text-white text-sm font-medium
          transition-colors duration-150
          focus:outline-none focus-visible:ring-2 focus-visible:ring-accent
        "
      >
        <RefreshCw className="w-4 h-4" />
        Try Again
      </button>
    </div>
  );
}
