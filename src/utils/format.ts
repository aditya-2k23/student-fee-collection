/**
 * Formatting utilities used across components.
 * Centralised so currency, date, and phone formatting are consistent.
 */

const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/** Format a number as Indian Rupees, e.g. ₹62,000 */
export function formatCurrency(amount: number): string {
  return currencyFormatter.format(amount);
}

/** Format an ISO date string as a readable short date, e.g. "15 Jul 2025" */
export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/** Format an ISO datetime as a readable timestamp, e.g. "5 Aug 2025, 9:30 AM" */
export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

/** Format a phone number for display, e.g. "+91 98765 43210" */
export function formatPhone(phone: string): string {
  // Indian mobile: +91XXXXXXXXXX → +91 XXXXX XXXXX
  const match = phone.match(/^\+91(\d{5})(\d{5})$/);
  if (match) {
    return `+91 ${match[1]} ${match[2]}`;
  }
  return phone;
}
