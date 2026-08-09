# Rationale

## Hierarchy decisions

**Promoted to the top:** Total Outstanding — this is the number Lakshmi needs to quote if her principal asks "how much are we short?" It's the single largest piece of text on the screen, set in 4xl bold, anchored top-left where the eye lands first. Action Required count sits next to it, answering "how much work do I have today?" The data-as-of timestamp is always visible because this is a snapshot, not live — Lakshmi should never mistake a yesterday-evening export for today's reality.

**Promoted in the default view:** The table opens pre-filtered to Action Required and pre-sorted by priority score (days overdue descending, then balance descending). This means the student who owes the most for the longest is row 1. Lakshmi never needs to filter or sort to start her day.

**Demoted:** Admission number, email address, and the full fee component breakdown are pushed into the detail drawer. They matter when you're on the phone with a parent, not when scanning down a list. Guardian phone stays in the table because Lakshmi's most common action from the list is dialling.

## Three awkward records

### 1. Sanya Kapoor (scholarship + transport)
Sanya has a Merit Scholarship waiver on Tuition (₹45,000) and Lab Fee (₹5,000), but Transport (₹12,000) is only partially paid. Her `status` is `OVERDUE` and her `balance` is ₹9,000. A naive view would show "Overdue ₹9,000" with no context — implying she's a delinquent payer when she's actually a scholarship student whose family just hasn't covered transport yet. The view model detects `components[].waiver`, finds the non-waived component with a remaining balance, and renders the table row with a violet sub-line: **"Merit Scholarship · Transport Due ₹9,000"**. The drawer expands this into the full component table with "Waived" labels on tuition and lab fee.

### 2. Kabir Singh (bounced cheque)
Kabir's component-level `paid` shows ₹42,000 on Tuition and ₹11,000 on Transport — totalling ₹53,000, which matches `totalBilled`. But his top-level `totalPaid` is ₹11,000 and `balance` is ₹42,000, because the ₹42,000 cheque bounced and was reversed. The spec's "important data trap" warning applies here: the view model **never sums component `paid`**; it always reads `totalPaid` and `balance` from the top level. His status is displayed as "Cheque Bounced" (not "Payment Failed"), and his payment history in the drawer shows the ₹42,000 cheque with a red "Bounced" badge alongside the ₹11,000 cash payment that did succeed.

### 3. Meera & Joel Fernandes (siblings)
Two children, one guardian (Clive Fernandes), one `familyId` (FAM008). In the table they appear as two separate rows — each has their own balance and overdue status. But in the bulk action bar, when both are selected, the display reads "8 students (7 families)" rather than "8 students (8 families)". In the reminder modal, they collapse into a single line: **"Clive Fernandes — 2 children"** with both children listed underneath and their individual balances shown. One family gets one message, not two.

## Click count

From opening the app to sending reminders to **all** action-required students:

| Step | Action | Clicks |
|------|--------|--------|
| 0 | App loads — already filtered to Action Required, sorted by priority | 0 |
| 1 | Click "Select all" checkbox in table header | 1 |
| 2 | Click "Send Reminders" in bulk action bar | 2 |
| 3 | Click "Send 7 Reminders" in confirmation modal | 3 |

**Total: 3 clicks.** This matches the spec's target. No filtering, no sorting, no scrolling required before the first click.

## Mobile trade-offs

On viewports below 1024px, the table is replaced with cards. Each card shows:
- Name, class, balance, days overdue, status badge
- Tappable "Call" (`tel:` link) and "Message" (`sms:` link) buttons

**Dropped on mobile:**
- **Bulk selection and Send Reminders.** Lakshmi isn't doing batch work on her phone in a corridor. She's checking one student's balance or making one phone call. Checkboxes and floating action bars would add clutter without matching the use case.
- **Full fee component breakdown.** The drawer still opens on card tap and shows full details including components, but the table of billed/paid/due per component is information-dense enough that it's a conscious scroll-down action, not front-and-centre.

This is a deliberate trade-off: the mobile view optimises for "look up one student, call their parent" — not for "process today's entire batch."

## One thing tried and rejected

**A small bar chart showing outstanding by class.** Early in design I considered a horizontal bar chart (Class 10: ₹71k, Class 9: ₹95k, etc.) to help Lakshmi spot which classes are worst. I dropped it for three reasons:

1. With 15 students across 10+ classes, the chart would have mostly single-student bars — not a meaningful distribution.
2. At the real scale of 900 students it might be useful, but the spec explicitly says "no charts or dashboards — the summary numbers are enough."
3. The filter + sort already surfaces the worst cases in the table. A chart would add visual weight without changing what Lakshmi does next (she still opens the table and starts calling).

The summary cards (total outstanding + action required count) carry enough signal for the "how bad is it today?" question. If the school later wants class-level breakdowns, that's a separate analytics view, not something to bolt onto this operational screen.
