import { useState, useEffect, useRef } from 'react';
import { X, Send, CheckCircle, Loader2 } from 'lucide-react';
import type { StudentViewModel } from '../data/types';
import { formatCurrency } from '../utils/format';

interface ReminderModalProps {
  students: StudentViewModel[];
  onClose: () => void;
  onConfirm: () => void;
}

interface FamilyGroup {
  guardianName: string;
  guardianPhone: string;
  children: { name: string; class: string; section: string; balance: number }[];
  totalBalance: number;
}

type ModalState = 'confirm' | 'sending' | 'success';

export function ReminderModal({ students, onClose, onConfirm }: ReminderModalProps) {
  const [state, setState] = useState<ModalState>('confirm');
  const modalRef = useRef<HTMLDivElement>(null);

  // Group students by family
  const familyGroups: FamilyGroup[] = [];
  const familyMap = new Map<string, FamilyGroup>();

  for (const student of students) {
    const existing = familyMap.get(student.familyGroupId);
    if (existing) {
      existing.children.push({
        name: student.name,
        class: student.class,
        section: student.section,
        balance: student.balance,
      });
      existing.totalBalance += student.balance;
    } else {
      const group: FamilyGroup = {
        guardianName: student.guardian.name,
        guardianPhone: student.guardian.phone,
        children: [{
          name: student.name,
          class: student.class,
          section: student.section,
          balance: student.balance,
        }],
        totalBalance: student.balance,
      };
      familyMap.set(student.familyGroupId, group);
      familyGroups.push(group);
    }
  }

  // Focus trap and Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && state !== 'sending') {
        onClose();
      }

      if (e.key === 'Tab' && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button:not(:disabled), a, input, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose, state]);

  // Focus the primary button on mount
  useEffect(() => {
    const primary = modalRef.current?.querySelector<HTMLElement>('[data-primary]');
    primary?.focus();
  }, []);

  const handleSend = () => {
    setState('sending');
    // Simulate sending
    setTimeout(() => {
      setState('success');
      setTimeout(() => {
        onConfirm();
      }, 1200);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 animate-fade-in"
        onClick={state !== 'sending' ? onClose : undefined}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-label="Send payment reminders"
        className="relative bg-surface-elevated border border-border rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden animate-fade-in"
      >
        {state === 'success' ? (
          /* Success state */
          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/15 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-emerald-400" />
            </div>
            <h2 className="text-lg font-semibold text-text-primary mb-1">Reminders Sent</h2>
            <p className="text-sm text-text-secondary">
              {familyGroups.length} {familyGroups.length === 1 ? 'family' : 'families'} notified successfully.
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="text-lg font-semibold text-text-primary">Send Reminders</h2>
              <button
                onClick={onClose}
                disabled={state === 'sending'}
                aria-label="Close reminder dialog"
                className="p-2 rounded-lg hover:bg-surface-hover transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-50"
              >
                <X className="w-5 h-5 text-text-secondary" />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-4 overflow-y-auto max-h-[50vh]">
              <p className="text-sm text-text-secondary mb-4">
                Payment reminders will be sent to {familyGroups.length} {familyGroups.length === 1 ? 'family' : 'families'}:
              </p>

              <div className="space-y-3">
                {familyGroups.map((group) => (
                  <div key={group.guardianPhone} className="bg-surface-hover/50 border border-border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-text-primary">
                        {group.guardianName}
                        {group.children.length > 1 && (
                          <span className="text-text-muted font-normal ml-1">
                            — {group.children.length} children
                          </span>
                        )}
                      </span>
                      <span className="text-sm font-semibold text-red-400">
                        {formatCurrency(group.totalBalance)}
                      </span>
                    </div>
                    <div className="text-xs text-text-muted">
                      {group.children.map((c) => (
                        <span key={c.name}>
                          {c.name} (Class {c.class}-{c.section})
                          {group.children.length > 1 && <> · {formatCurrency(c.balance)}</>}
                        </span>
                      )).reduce((acc: React.ReactNode[], el, i) => {
                        if (i > 0) acc.push(<span key={`sep-${i}`}> · </span>);
                        acc.push(el);
                        return acc;
                      }, [])}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-border flex justify-end gap-3">
              <button
                onClick={onClose}
                disabled={state === 'sending'}
                className="px-4 py-2 rounded-lg text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                data-primary
                onClick={handleSend}
                disabled={state === 'sending'}
                className="
                  inline-flex items-center gap-2 px-4 py-2 rounded-lg
                  bg-accent hover:bg-accent-hover text-white text-sm font-medium
                  transition-colors duration-150
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface-elevated
                  disabled:opacity-70 disabled:cursor-not-allowed
                "
              >
                {state === 'sending' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending…
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send {familyGroups.length} Reminder{familyGroups.length > 1 ? 's' : ''}
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
