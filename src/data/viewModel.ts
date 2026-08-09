import type {
  RawStudent,
  StudentViewModel,
  DisplayStatus,
  WaiverInfo,
  Summary,
} from './types';

// ─── Status mapping ───

const STATUS_LABEL_MAP: Record<RawStudent['status'], DisplayStatus> = {
  OVERDUE: 'Overdue',
  PARTIALLY_PAID: 'Partially Paid',
  PAID: 'Paid',
  CREDIT_BALANCE: 'Advance',
  PAYMENT_FAILED: 'Cheque Bounced',
  INSTALMENT_PLAN: 'Instalment Plan',
  WITHDRAWN: 'Withdrawn',
};

/**
 * Tailwind-compatible color classes per status.
 * Each value is used as a key prefix for bg/text — the component
 * applies these via a lookup, not via string interpolation (Tailwind
 * needs to see full class names to include them in the bundle).
 */
const STATUS_COLOR_MAP: Record<DisplayStatus, string> = {
  'Overdue': 'red',
  'Partially Paid': 'amber',
  'Paid': 'emerald',
  'Advance': 'sky',
  'Cheque Bounced': 'rose',
  'Instalment Plan': 'violet',
  'Withdrawn': 'slate',
};

const ACTION_REQUIRED_STATUSES: Set<RawStudent['status']> = new Set([
  'OVERDUE',
  'PARTIALLY_PAID',
  'PAYMENT_FAILED',
]);

// ─── Waiver detection ───

function detectWaiver(student: RawStudent): WaiverInfo | null {
  const waivedComponents = student.components.filter((c) => c.waiver);
  if (waivedComponents.length === 0) return null;

  // Find the component(s) without a waiver that still have a balance
  const owedComponents = student.components.filter(
    (c) => !c.waiver && c.billed - c.paid > 0
  );

  if (owedComponents.length === 0) return null;

  // Use the first waiver type as the label (they're usually the same)
  const waiverType = waivedComponents[0].waiver!;

  if (owedComponents.length === 1) {
    return {
      waiverType,
      owedComponent: owedComponents[0].type,
      owedAmount: owedComponents[0].billed - owedComponents[0].paid,
    };
  }

  // Multiple non-waived components still owed — summarize
  const totalOwed = owedComponents.reduce(
    (sum, c) => sum + (c.billed - c.paid),
    0
  );
  const names = owedComponents.map((c) => c.type).join(' + ');
  return {
    waiverType,
    owedComponent: names,
    owedAmount: totalOwed,
  };
}

// ─── Main transform ───

/**
 * Transforms a raw student record into a view model with derived fields.
 *
 * IMPORTANT: Always uses top-level `totalPaid`/`balance` for display —
 * never sums component-level `paid` fields. This is critical for
 * bounced-cheque students where component `paid` can be misleading.
 */
export function toStudentViewModel(raw: RawStudent): StudentViewModel {
  const displayStatus = STATUS_LABEL_MAP[raw.status];
  const statusColor = STATUS_COLOR_MAP[displayStatus];
  const isActionRequired = ACTION_REQUIRED_STATUSES.has(raw.status);

  // Priority: higher score = needs attention sooner
  // daysOverdue dominates, balance breaks ties
  const priorityScore = raw.daysOverdue * 1_000_000 + raw.balance;

  const waiverInfo = detectWaiver(raw);

  return {
    // Pass-through
    id: raw.id,
    name: raw.name,
    class: raw.class,
    section: raw.section,
    rollNo: raw.rollNo,
    admissionNo: raw.admissionNo,
    familyId: raw.familyId,
    guardian: raw.guardian,
    components: raw.components,
    totalBilled: raw.totalBilled,
    totalPaid: raw.totalPaid,
    balance: raw.balance,
    rawStatus: raw.status,
    daysOverdue: raw.daysOverdue,
    lastPaymentDate: raw.lastPaymentDate,
    remindersSent: raw.remindersSent,
    lastReminderAt: raw.lastReminderAt,
    reminderDeliveryStatus: raw.reminderDeliveryStatus,
    notes: raw.notes,
    payments: raw.payments,
    nextInstalmentDate: raw.nextInstalmentDate,
    nextInstalmentAmount: raw.nextInstalmentAmount,
    withdrawnOn: raw.withdrawnOn,
    refundDue: raw.refundDue,

    // Derived
    displayStatus,
    statusColor,
    isActionRequired,
    priorityScore,
    familyGroupId: raw.familyId,
    waiverInfo,
  };
}

// ─── Summary computation ───

/**
 * Computes aggregate summary from the full student list.
 *
 * Total outstanding sums only positive balances — credit balances
 * (negative) are shown separately so Lakshmi can sanity-check the number.
 */
export function computeSummary(students: StudentViewModel[]): Summary {
  let totalOutstanding = 0;
  let totalCredits = 0;
  let totalRefundsDue = 0;
  let actionRequiredCount = 0;
  let paidCount = 0;
  let instalmentPlanCount = 0;
  let withdrawnCount = 0;

  for (const s of students) {
    if (s.balance > 0) {
      totalOutstanding += s.balance;
    } else if (s.balance < 0) {
      totalCredits += Math.abs(s.balance);
    }

    if (s.refundDue && s.refundDue > 0) {
      totalRefundsDue += s.refundDue;
    }

    if (s.isActionRequired) actionRequiredCount++;
    if (s.rawStatus === 'PAID') paidCount++;
    if (s.rawStatus === 'INSTALMENT_PLAN') instalmentPlanCount++;
    if (s.rawStatus === 'WITHDRAWN') withdrawnCount++;
  }

  return {
    totalOutstanding,
    totalCredits,
    totalRefundsDue,
    actionRequiredCount,
    paidCount,
    instalmentPlanCount,
    withdrawnCount,
    totalStudents: students.length,
  };
}
