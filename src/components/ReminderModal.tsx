import { useState, useEffect, useRef } from "react";
import { X, Send, CheckCircle, Loader2 } from "lucide-react";
import type { StudentViewModel } from "../data/types";
import { formatCurrency } from "../utils/format";

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

type ModalState = "confirm" | "sending" | "success";

export function ReminderModal({
  students,
  onClose,
  onConfirm,
}: ReminderModalProps) {
  const [state, setState] = useState<ModalState>("confirm");
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
        children: [
          {
            name: student.name,
            class: student.class,
            section: student.section,
            balance: student.balance,
          },
        ],
        totalBalance: student.balance,
      };
      familyMap.set(student.familyGroupId, group);
      familyGroups.push(group);
    }
  }

  // Focus trap and Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && state !== "sending") {
        onClose();
      }

      if (e.key === "Tab" && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button:not(:disabled), a, input, [tabindex]:not([tabindex="-1"])',
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

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose, state]);

  // Focus the primary button on mount
  useEffect(() => {
    const primary =
      modalRef.current?.querySelector<HTMLElement>("[data-primary]");
    primary?.focus();
  }, []);

  const handleSend = () => {
    setState("sending");
    // Simulate sending
    setTimeout(() => {
      setState("success");
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
        onClick={state !== "sending" ? onClose : undefined}
        aria-hidden="true"
      />

      {/* Modal — Batch Dispatch Register */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-label="Send payment reminders"
        className="relative bg-surface-elevated border border-border rounded-md w-full max-w-md max-h-[80vh] overflow-hidden animate-fade-in shadow-2xl"
      >
        {state === "success" ? (
          /* Success state */
          <div className="p-8 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h2 className="text-lg font-bold font-mono text-text-primary mb-1">
              REMINDERS DISPATCHED
            </h2>
            <p className="text-xs font-mono text-text-muted">
              {familyGroups.length}{" "}
              {familyGroups.length === 1 ? "family" : "families"} notified
              successfully.
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface-subtle">
              <h2 className="text-base font-bold font-mono text-text-primary tracking-tight">
                SEND REMINDERS DISPATCH
              </h2>
              <button
                onClick={onClose}
                disabled={state === "sending"}
                aria-label="Close reminder dialog"
                className="p-1.5 rounded-md hover:bg-surface-hover transition-colors border border-transparent focus:border-border disabled:opacity-50 cursor-pointer"
              >
                <X className="w-4 h-4 text-text-secondary" />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-4 overflow-y-auto max-h-[50vh]">
              <p className="text-xs font-mono text-text-muted mb-3">
                Payment reminders will be sent to{" "}
                <span className="font-bold text-text-primary tabular-nums">{familyGroups.length}</span>{" "}
                {familyGroups.length === 1 ? "family" : "families"}:
              </p>

              <div className="space-y-2.5">
                {familyGroups.map((group) => (
                  <div
                    key={group.guardianPhone}
                    className="bg-surface border border-border rounded-md p-3 font-mono text-xs"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-text-primary">
                        {group.guardianName}
                        {group.children.length > 1 && (
                          <span className="text-text-muted font-normal ml-1">
                            — {group.children.length} children
                          </span>
                        )}
                      </span>
                      <span className="font-bold text-red-700 dark:text-red-400 tabular-nums">
                        {formatCurrency(group.totalBalance)}
                      </span>
                    </div>
                    <div className="text-[11px] text-text-muted">
                      {group.children
                        .map((c) => (
                          <span key={c.name}>
                            {c.name} (Class {c.class}-{c.section})
                            {group.children.length > 1 && (
                              <> · <span className="tabular-nums">{formatCurrency(c.balance)}</span></>
                            )}
                          </span>
                        ))
                        .reduce((acc: React.ReactNode[], el, i) => {
                          if (i > 0)
                            acc.push(<span key={`sep-${i}`}> · </span>);
                          acc.push(el);
                          return acc;
                        }, [])}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-3.5 border-t border-border bg-surface-subtle flex justify-end gap-2.5">
              <button
                onClick={onClose}
                disabled={state === "sending"}
                className="px-3.5 py-1.5 rounded-md text-xs font-mono font-medium text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors border border-border disabled:opacity-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                data-primary
                onClick={handleSend}
                disabled={state === "sending"}
                className="
                  inline-flex items-center gap-2 px-4 py-1.5 rounded-md
                  bg-accent text-accent-text hover:bg-accent-hover text-xs font-mono font-semibold uppercase tracking-wider
                  transition-colors cursor-pointer shadow-2xs
                  disabled:opacity-70 disabled:cursor-not-allowed
                "
              >
                {state === "sending" ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Sending…
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    Send {familyGroups.length} Reminder
                    {familyGroups.length > 1 ? "s" : ""}
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
