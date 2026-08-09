/**
 * Formatting utilities used across components.
 * Centralised so currency, date, and phone formatting are consistent.
 */

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/** Format a number as Indian Rupees, e.g. ₹62,000 */
export function formatCurrency(amount: number): string {
  return currencyFormatter.format(amount);
}

/**
 * Format an ISO date string as a readable short date, e.g. "15 Jul 2025"
 * Works with both full datetimes and date-only strings ("2026-08-08").
 */
export function formatDate(iso: string): string {
  // Append T00:00 to avoid UTC midnight → previous day in local timezone
  const d = new Date(iso.length === 10 ? `${iso}T00:00:00` : iso);
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * Format an ISO datetime as a readable timestamp, e.g. "5 Aug 2025, 9:30 AM"
 * Falls back to date-only display if no time component is present.
 */
export function formatDateTime(iso: string): string {
  // Date-only string like "2026-08-08" — just show the date, no time
  if (iso.length === 10) {
    return formatDate(iso);
  }
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

/** Format a phone number for display, e.g. "+91 98765 43210" */
export function formatPhone(phone: string): string {
  // Already formatted with spaces (new data format) — return as-is
  if (phone.includes(" ")) return phone;

  // Legacy compact format: +91XXXXXXXXXX → +91 XXXXX XXXXX
  const match = phone.match(/^\+91(\d{5})(\d{5})$/);
  if (match) {
    return `+91 ${match[1]} ${match[2]}`;
  }
  return phone;
}
