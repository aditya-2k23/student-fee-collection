import { useEffect, useRef } from "react";
import {
  X,
  Phone,
  Mail,
  FileText,
  AlertCircle,
  Calendar,
  CreditCard,
  Building2,
} from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import type { StudentViewModel } from "../data/types";
import {
  formatCurrency,
  formatDate,
  formatDateTime,
  formatPhone,
} from "../utils/format";

interface DetailDrawerProps {
  student: StudentViewModel;
  onClose: () => void;
}

export function DetailDrawer({ student, onClose }: DetailDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);

  // Focus trap and Esc handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      // Focus trap
      if (e.key === "Tab" && drawerRef.current) {
        const focusable = drawerRef.current.querySelectorAll<HTMLElement>(
          'button, a, input, [tabindex]:not([tabindex="-1"])',
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
    const closeBtn = drawerRef.current?.querySelector<HTMLElement>("button");
    closeBtn?.focus();

    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer panel — Official Student Fee Register Record Sheet */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label={`Student fee register record for ${student.name}`}
        className="relative w-full max-w-lg bg-surface border-l border-border overflow-y-auto animate-slide-in-right shadow-2xl"
      >
        {/* Header */}
        <div className="sticky top-0 bg-surface-elevated/95 backdrop-blur-sm border-b border-border px-6 py-4 flex items-center justify-between z-10">
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-accent" />
              <h2 className="text-lg font-bold text-text-primary">
                {student.name}
              </h2>
            </div>
            <p className="text-xs font-mono text-text-muted mt-0.5">
              Class {student.class}-{student.section} · Roll #{student.rollNo} · {student.admissionNo}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close details drawer"
            className="p-2 rounded-md hover:bg-surface-hover transition-colors cursor-pointer border border-transparent focus:border-border"
          >
            <X className="w-5 h-5 text-text-secondary" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-6">
          {/* Status + summary */}
          <div className="flex items-center justify-between p-3 bg-surface-subtle border border-border rounded-md">
            <StatusBadge
              status={student.displayStatus}
              statusColor={student.statusColor}
            />
            {student.daysOverdue > 0 && (
              <span className="text-xs font-mono font-bold text-red-700 dark:text-red-400">
                {student.daysOverdue} DAYS OVERDUE
              </span>
            )}
          </div>

          {/* Waiver callout */}
          {student.waiverInfo && (
            <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-md p-3.5">
              <div className="flex items-center gap-2 text-blue-900 dark:text-blue-300 text-xs font-mono font-bold uppercase mb-1">
                <FileText className="w-4 h-4" />
                {student.waiverInfo.waiverType} WAIVER
              </div>
              <p className="text-xs font-mono text-text-secondary">
                {student.waiverInfo.owedComponent} due:{" "}
                <span className="font-bold text-text-primary tabular-nums">
                  {formatCurrency(student.waiverInfo.owedAmount)}
                </span>
              </p>
            </div>
          )}

          {/* Student info */}
          <Section title="Student Register Details">
            <InfoRow label="Admission No" value={student.admissionNo} isMono />
            <InfoRow label="Family ID" value={student.familyId} isMono />
            {student.notes && (
              <div className="mt-2 p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-md text-xs text-amber-900 dark:text-amber-200 font-mono">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" />
                  <span>{student.notes}</span>
                </div>
              </div>
            )}
          </Section>

          {/* Guardian */}
          <Section title="Guardian Contact">
            <InfoRow label="Name" value={student.guardian.name} />
            <div className="flex items-center justify-between py-1.5 border-b border-border/40">
              <span className="text-text-muted text-xs font-mono">Phone</span>
              <a
                href={`tel:${student.guardian.phone}`}
                className="text-xs font-mono font-semibold text-accent hover:underline flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" />
                {formatPhone(student.guardian.phone)}
              </a>
            </div>
            {student.guardian.email && (
              <div className="flex items-center justify-between py-1.5 border-b border-border/40">
                <span className="text-text-muted text-xs font-mono">Email</span>
                <a
                  href={`mailto:${student.guardian.email}`}
                  className="text-xs font-mono font-semibold text-accent hover:underline flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5" />
                  {student.guardian.email}
                </a>
              </div>
            )}
            {student.remindersSent > 0 && (
              <div className="text-[11px] font-mono text-text-muted mt-2">
                {student.remindersSent} reminder
                {student.remindersSent > 1 ? "s" : ""} sent
                {student.lastReminderAt && (
                  <> · Last: {formatDateTime(student.lastReminderAt)}</>
                )}
                {student.reminderDeliveryStatus?.toUpperCase() === "FAILED" && (
                  <span className="text-red-700 dark:text-red-400 font-bold ml-1">
                    (DELIVERY FAILED)
                  </span>
                )}
              </div>
            )}
          </Section>

          {/* Fee components */}
          <Section title="Fee Component Breakdown">
            <div className="overflow-x-auto rounded-md border border-border bg-surface-subtle">
              <table className="w-full text-xs font-mono">
                <thead>
                  <tr className="border-b border-border text-left text-text-muted uppercase bg-surface-hover">
                    <th scope="col" className="px-3 py-2 font-bold">
                      Component
                    </th>
                    <th scope="col" className="px-3 py-2 font-bold text-right">
                      Billed
                    </th>
                    <th scope="col" className="px-3 py-2 font-bold text-right">
                      Paid
                    </th>
                    <th scope="col" className="px-3 py-2 font-bold text-right">
                      Due
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {student.components.map((comp) => (
                    <tr key={comp.type}>
                      <td className="px-3 py-2 text-text-primary font-medium">
                        {comp.type}
                        {comp.waiver && (
                          <span className="ml-1.5 text-[10px] text-blue-700 dark:text-blue-400 font-semibold">
                            ({comp.waiver.type})
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-2 text-right text-text-secondary tabular-nums">
                        {formatCurrency(comp.billed)}
                      </td>
                      <td className="px-3 py-2 text-right text-text-secondary tabular-nums">
                        {formatCurrency(comp.paid)}
                      </td>
                      <td className="px-3 py-2 text-right font-bold tabular-nums">
                        {comp.waiver ? (
                          <span className="text-blue-700 dark:text-blue-400">Waived</span>
                        ) : (
                          <span
                            className={
                              comp.billed - comp.paid > 0
                                ? "text-red-700 dark:text-red-400"
                                : "text-emerald-700 dark:text-emerald-400"
                            }
                          >
                            {formatCurrency(comp.billed - comp.paid)}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-surface border-t border-border font-bold text-sm">
                    <td className="px-3 py-2 text-text-primary">Total Balance</td>
                    <td className="px-3 py-2 text-right text-text-secondary tabular-nums text-xs">
                      {formatCurrency(student.totalBilled)}
                    </td>
                    <td className="px-3 py-2 text-right text-text-secondary tabular-nums text-xs">
                      {formatCurrency(student.totalPaid)}
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums">
                      <span
                        className={
                          student.balance > 0
                            ? "text-red-700 dark:text-red-400"
                            : student.balance < 0
                              ? "text-blue-700 dark:text-blue-400"
                              : "text-emerald-700 dark:text-emerald-400"
                        }
                      >
                        {student.balance < 0 && "−"}
                        {formatCurrency(Math.abs(student.balance))}
                      </span>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </Section>

          {/* Instalment plan info */}
          {student.nextInstalmentDate && student.nextInstalmentAmount && (
            <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-md p-3">
              <div className="flex items-center gap-2 text-blue-900 dark:text-blue-300 text-xs font-mono font-bold uppercase mb-1">
                <Calendar className="w-4 h-4" />
                Next Instalment Scheduled
              </div>
              <p className="text-xs font-mono text-text-secondary">
                <span className="font-bold text-text-primary tabular-nums">
                  {formatCurrency(student.nextInstalmentAmount)}
                </span>{" "}
                due on {formatDate(student.nextInstalmentDate)}
              </p>
            </div>
          )}

          {/* Withdrawn info */}
          {student.withdrawnOn && (
            <div className="bg-surface-subtle border border-border rounded-md p-3">
              <p className="text-xs font-mono text-text-secondary">
                Withdrawn on {formatDate(student.withdrawnOn)}
                {student.refundDue && student.refundDue > 0 && (
                  <>
                    {" "}
                    · Refund due:{" "}
                    <span className="text-amber-700 dark:text-amber-400 font-bold tabular-nums">
                      {formatCurrency(student.refundDue)}
                    </span>
                  </>
                )}
              </p>
            </div>
          )}

          {/* Payment history */}
          <Section title="Payment Transaction Log">
            {student.payments.length === 0 ? (
              <p className="text-xs font-mono text-text-muted py-2">
                No payment transactions recorded in register.
              </p>
            ) : (
              <div className="space-y-2">
                {student.payments.map((payment, i) => {
                  const isFailed =
                    payment.status === "BOUNCED" || payment.status === "FAILED";
                  return (
                    <div
                      key={`${payment.reference}-${i}`}
                      className={`
                        flex items-center justify-between p-3 rounded-md border font-mono text-xs
                        ${
                          isFailed
                            ? "border-red-300 dark:border-red-900 bg-red-50 dark:bg-red-950/40"
                            : "border-border bg-surface-subtle"
                        }
                      `}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <CreditCard
                            className={`w-3.5 h-3.5 ${isFailed ? "text-red-700 dark:text-red-400" : "text-text-muted"}`}
                          />
                          <span
                            className={`font-bold tabular-nums ${isFailed ? "text-red-700 dark:text-red-400" : "text-text-primary"}`}
                          >
                            {formatCurrency(payment.amount)}
                          </span>
                          {isFailed && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded border border-red-400 text-red-700 dark:text-red-400 font-bold uppercase">
                              {payment.status === "BOUNCED"
                                ? "Bounced Cheque"
                                : "Failed"}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-text-muted mt-0.5">
                          {payment.mode} · Ref #{payment.reference}
                        </div>
                      </div>
                      <div className="text-xs text-text-muted text-right tabular-nums">
                        {formatDate(payment.date)}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Section>
        </div>
      </div>
    </div>
  );
}

// ─── Helpers ───

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="text-xs font-mono font-bold text-text-muted uppercase tracking-wider mb-2.5">
        {title}
      </h3>
      {children}
    </div>
  );
}

function InfoRow({
  label,
  value,
  isMono = false,
}: {
  label: string;
  value: string;
  isMono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-border/40">
      <span className="text-text-muted text-xs font-mono">{label}</span>
      <span
        className={`text-xs text-text-primary font-semibold ${isMono ? "font-mono" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}
