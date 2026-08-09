import { useEffect, useRef } from 'react';
import { X, Phone, Mail, FileText, AlertCircle, Calendar, CreditCard } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import type { StudentViewModel } from '../data/types';
import { formatCurrency, formatDate, formatDateTime, formatPhone } from '../utils/format';

interface DetailDrawerProps {
  student: StudentViewModel;
  onClose: () => void;
}

export function DetailDrawer({ student, onClose }: DetailDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);

  // Focus trap and Esc handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      // Simple focus trap
      if (e.key === 'Tab' && drawerRef.current) {
        const focusable = drawerRef.current.querySelectorAll<HTMLElement>(
          'button, a, input, [tabindex]:not([tabindex="-1"])'
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
    // Focus the close button on mount
    const closeBtn = drawerRef.current?.querySelector<HTMLElement>('button');
    closeBtn?.focus();

    // Prevent body scroll
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label={`Details for ${student.name}`}
        className="relative w-full max-w-lg bg-surface-elevated border-l border-border overflow-y-auto animate-slide-in-right"
      >
        {/* Header */}
        <div className="sticky top-0 bg-surface-elevated/95 backdrop-blur-sm border-b border-border px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-lg font-semibold text-text-primary">{student.name}</h2>
            <p className="text-sm text-text-secondary">
              Class {student.class}-{student.section} · Roll #{student.rollNo}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close details drawer"
            className="p-2 rounded-lg hover:bg-surface-hover transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <X className="w-5 h-5 text-text-secondary" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-6">
          {/* Status + summary */}
          <div className="flex items-center justify-between">
            <StatusBadge status={student.displayStatus} statusColor={student.statusColor} />
            {student.daysOverdue > 0 && (
              <span className="text-sm text-red-400 font-medium">{student.daysOverdue} days overdue</span>
            )}
          </div>

          {/* Waiver callout */}
          {student.waiverInfo && (
            <div className="bg-violet-500/10 border border-violet-500/20 rounded-lg p-3">
              <div className="flex items-center gap-2 text-violet-400 text-sm font-medium mb-1">
                <FileText className="w-4 h-4" />
                {student.waiverInfo.waiverType}
              </div>
              <p className="text-sm text-text-secondary">
                {student.waiverInfo.owedComponent} due: {formatCurrency(student.waiverInfo.owedAmount)}
              </p>
            </div>
          )}

          {/* Student info */}
          <Section title="Student Information">
            <InfoRow label="Admission No" value={student.admissionNo} />
            <InfoRow label="Family ID" value={student.familyId} />
            {student.notes && (
              <div className="mt-2 p-3 bg-amber-500/5 border border-amber-500/15 rounded-lg text-sm text-amber-300">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{student.notes}</span>
                </div>
              </div>
            )}
          </Section>

          {/* Guardian */}
          <Section title="Guardian">
            <InfoRow label="Name" value={student.guardian.name} />
            <div className="flex items-center justify-between py-1.5">
              <span className="text-text-muted text-sm">Phone</span>
              <a
                href={`tel:${student.guardian.phone}`}
                className="text-sm text-accent hover:text-accent-hover transition-colors flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" />
                {formatPhone(student.guardian.phone)}
              </a>
            </div>
            {student.guardian.email && (
              <div className="flex items-center justify-between py-1.5">
                <span className="text-text-muted text-sm">Email</span>
                <a
                  href={`mailto:${student.guardian.email}`}
                  className="text-sm text-accent hover:text-accent-hover transition-colors flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5" />
                  {student.guardian.email}
                </a>
              </div>
            )}
            {student.remindersSent > 0 && (
              <div className="text-xs text-text-muted mt-1">
                {student.remindersSent} reminder{student.remindersSent > 1 ? 's' : ''} sent
                {student.lastReminderAt && <> · Last: {formatDateTime(student.lastReminderAt)}</>}
                {student.reminderDeliveryStatus?.toUpperCase() === 'FAILED' && (
                  <span className="text-red-400 ml-1">(delivery failed)</span>
                )}
              </div>
            )}
          </Section>

          {/* Fee components */}
          <Section title="Fee Breakdown">
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-surface-hover text-left">
                    <th scope="col" className="px-3 py-2 font-medium text-text-secondary text-xs">Component</th>
                    <th scope="col" className="px-3 py-2 font-medium text-text-secondary text-xs text-right">Billed</th>
                    <th scope="col" className="px-3 py-2 font-medium text-text-secondary text-xs text-right">Paid</th>
                    <th scope="col" className="px-3 py-2 font-medium text-text-secondary text-xs text-right">Due</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {student.components.map((comp) => (
                    <tr key={comp.type}>
                      <td className="px-3 py-2 text-text-primary">
                        {comp.type}
                        {comp.waiver && (
                          <span className="ml-2 text-xs text-violet-400">({comp.waiver.type})</span>
                        )}
                      </td>
                      <td className="px-3 py-2 text-right text-text-secondary">{formatCurrency(comp.billed)}</td>
                      <td className="px-3 py-2 text-right text-text-secondary">{formatCurrency(comp.paid)}</td>
                      <td className="px-3 py-2 text-right font-medium">
                        {comp.waiver ? (
                          <span className="text-violet-400">Waived</span>
                        ) : (
                          <span className={comp.billed - comp.paid > 0 ? 'text-red-400' : 'text-emerald-400'}>
                            {formatCurrency(comp.billed - comp.paid)}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-surface-hover font-semibold">
                    <td className="px-3 py-2 text-text-primary">Total</td>
                    <td className="px-3 py-2 text-right text-text-secondary">{formatCurrency(student.totalBilled)}</td>
                    <td className="px-3 py-2 text-right text-text-secondary">{formatCurrency(student.totalPaid)}</td>
                    <td className="px-3 py-2 text-right">
                      <span className={student.balance > 0 ? 'text-red-400' : student.balance < 0 ? 'text-sky-400' : 'text-emerald-400'}>
                        {student.balance < 0 && '−'}{formatCurrency(Math.abs(student.balance))}
                      </span>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </Section>

          {/* Instalment plan info */}
          {student.nextInstalmentDate && student.nextInstalmentAmount && (
            <div className="bg-violet-500/10 border border-violet-500/20 rounded-lg p-3">
              <div className="flex items-center gap-2 text-violet-400 text-sm font-medium mb-1">
                <Calendar className="w-4 h-4" />
                Next Instalment
              </div>
              <p className="text-sm text-text-secondary">
                {formatCurrency(student.nextInstalmentAmount)} due on {formatDate(student.nextInstalmentDate)}
              </p>
            </div>
          )}

          {/* Withdrawn info */}
          {student.withdrawnOn && (
            <div className="bg-slate-500/10 border border-slate-500/20 rounded-lg p-3">
              <p className="text-sm text-text-secondary">
                Withdrawn on {formatDate(student.withdrawnOn)}
                {student.refundDue && student.refundDue > 0 && (
                  <> · Refund due: <span className="text-amber-400 font-medium">{formatCurrency(student.refundDue)}</span></>
                )}
              </p>
            </div>
          )}

          {/* Payment history */}
          <Section title="Payment History">
            {student.payments.length === 0 ? (
              <p className="text-sm text-text-muted py-3">No payments recorded.</p>
            ) : (
              <div className="space-y-2">
                {student.payments.map((payment, i) => {
                  const isFailed = payment.status === 'BOUNCED' || payment.status === 'FAILED';
                  return (
                    <div
                      key={`${payment.reference}-${i}`}
                      className={`
                        flex items-center justify-between p-3 rounded-lg border
                        ${isFailed
                          ? 'border-red-500/20 bg-red-500/5'
                          : 'border-border bg-surface-hover/50'
                        }
                      `}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <CreditCard className={`w-4 h-4 ${isFailed ? 'text-red-400' : 'text-text-muted'}`} />
                          <span className={`text-sm font-medium ${isFailed ? 'text-red-400' : 'text-text-primary'}`}>
                            {formatCurrency(payment.amount)}
                          </span>
                          {isFailed && (
                            <span className="text-xs px-1.5 py-0.5 rounded bg-red-500/15 text-red-400 font-medium">
                              {payment.status === 'BOUNCED' ? 'Bounced' : 'Failed'}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-text-muted mt-0.5">
                          {payment.mode} · {payment.reference}
                        </div>
                      </div>
                      <div className="text-xs text-text-muted text-right">
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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">{title}</h3>
      {children}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-text-muted text-sm">{label}</span>
      <span className="text-sm text-text-primary font-medium">{value}</span>
    </div>
  );
}
