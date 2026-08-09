export interface Meta {
  school: string;
  academicYear: string;
  term: string;
  dueDate: string;
  asOf: string;
  currency: string;
}

export interface Guardian {
  name: string;
  phone: string;
  email: string | null;
}

export interface FeeWaiver {
  type: string;
  percent: number;
  reason: string;
}

export interface FeeComponent {
  type: string;
  billed: number;
  paid: number;
  waiver?: FeeWaiver;
}

export interface Payment {
  id?: string;
  date: string;
  amount: number;
  mode: string;
  status: "SUCCESS" | "BOUNCED" | "FAILED" | "PENDING";
  reference: string;
  term?: string;
}

export type RawStatus =
  | "OVERDUE"
  | "PARTIALLY_PAID"
  | "PAID"
  | "CREDIT_BALANCE"
  | "PAYMENT_FAILED"
  | "INSTALMENT_PLAN"
  | "WITHDRAWN";

export interface RawStudent {
  id: string;
  name: string;
  class: string;
  section: string;
  rollNo: number;
  admissionNo: string;
  familyId: string;
  guardian: Guardian;
  components: FeeComponent[];
  totalBilled: number;
  totalPaid: number;
  balance: number;
  status: RawStatus;
  daysOverdue: number;
  lastPaymentDate: string | null;
  remindersSent: number;
  lastReminderAt: string | null;
  reminderDeliveryStatus?: string;
  notes: string | null;
  payments: Payment[];
  nextInstalmentDate?: string;
  nextInstalmentAmount?: number;
  withdrawnOn?: string;
  refundDue?: number;
}

export interface FeeData {
  meta: Meta;
  students: RawStudent[];
}

// ─── View model types (derived from raw data) ───

export type DisplayStatus =
  | "Overdue"
  | "Partially Paid"
  | "Paid"
  | "Advance"
  | "Cheque Bounced"
  | "Instalment Plan"
  | "Withdrawn";

export type FilterKey =
  | "action-required"
  | "paid"
  | "instalment-plan"
  | "withdrawn"
  | "all";

export type SortKey =
  | "priority"
  | "name-asc"
  | "balance-desc"
  | "balance-asc"
  | "overdue-desc"
  | "last-payment-desc";

export interface WaiverInfo {
  waiverType: string;
  owedComponent: string;
  owedAmount: number;
}

export interface StudentViewModel {
  // Pass-through fields
  id: string;
  name: string;
  class: string;
  section: string;
  rollNo: number;
  admissionNo: string;
  familyId: string;
  guardian: Guardian;
  components: FeeComponent[];
  totalBilled: number;
  totalPaid: number;
  balance: number;
  rawStatus: RawStatus;
  daysOverdue: number;
  lastPaymentDate: string | null;
  remindersSent: number;
  lastReminderAt: string | null;
  reminderDeliveryStatus?: string;
  notes: string | null;
  payments: Payment[];
  nextInstalmentDate?: string;
  nextInstalmentAmount?: number;
  withdrawnOn?: string;
  refundDue?: number;

  // Derived fields
  displayStatus: DisplayStatus;
  statusColor: string;
  isActionRequired: boolean;
  priorityScore: number;
  familyGroupId: string;
  waiverInfo: WaiverInfo | null;
}

export interface Summary {
  totalOutstanding: number;
  totalCredits: number;
  totalRefundsDue: number;
  actionRequiredCount: number;
  paidCount: number;
  instalmentPlanCount: number;
  withdrawnCount: number;
  totalStudents: number;
}
