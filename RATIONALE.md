# Rationale

## Hierarchy decisions

**Promoted to the top:** Total Outstanding — this is the number Lakshmi needs to quote if her principal asks "how much are we short?" It is the single largest piece of text on the screen, set in bold at display scale, anchored top-left where the eye lands first. Action Required count sits next to it, answering "how much work do I have today?" The data-as-of timestamp is always visible because this is a snapshot, not live data — Lakshmi should never mistake a previous evening's export for today's reality.

**Promoted in the default view:** The table opens pre-filtered to Action Required and pre-sorted by priority score (days overdue descending, then balance descending as a tiebreaker). This means the student who has owed the most for the longest is row 1. Lakshmi never needs to filter or sort to start her day. However, for specific operational tasks, an explicit Sort dropdown control sits directly beside the search bar, offering Name (A–Z), Balance (High to Low / Low to High), Days Overdue, and Last Payment Date while keeping Priority as the initial default.

**Demoted:** Admission number, email address, and the full fee component breakdown are pushed into the detail drawer. They matter when you are on the phone with a parent, not when scanning down a list. Guardian phone stays in the table because Lakshmi's most common action from the list view is dialling.

## Three awkward records

### 1. Devansh Patil — STU-1005 (scholarship + transport)

Devansh has a 100% Merit Scholarship (`SCHOLARSHIP`) waiver covering his entire tuition component (billed ₹46,000). Only transport (₹9,000) remains payable, and it is unpaid. His top-level `balance` is ₹9,000, his `status` is `OVERDUE`.

The naïve reading would be: student owes ₹9,000, mark overdue. But without the waiver context, Lakshmi would call Sameer Patil asking why his son's ₹46,000 tuition hasn't been paid — which would be embarrassing and wrong. The view model's `detectWaiver` function scans `components[].waiver`, identifies the fully-waived TUITION component, finds the non-waived TRANSPORT component still carrying a balance, and returns a structured label: **"SCHOLARSHIP — TRANSPORT Due ₹9,000"**. This appears as a violet sub-line on the table row and expands in the drawer into a full breakdown showing `Waived` for tuition and the actual due amount for transport. The status is still `OVERDUE` (correctly — the transport fee is genuinely late), but the context tells Lakshmi exactly what to say on that call.

### 2. Kavya Reddy — STU-1006 (bounced cheque)

This is the record that would silently break a naive implementation. Kavya's `components` array has a single TUITION entry with `"billed": 38000, "paid": 38000` — reading the component-level `paid` field, it looks like she has paid in full. She has not. Cheque 442190 bounced (insufficient funds), and the payment was reversed. The top-level fields tell the truth: `totalPaid: 0`, `balance: 38000`, `status: PAYMENT_FAILED`. The view model always reads `totalPaid` and `balance` from the top level and never sums component `paid` fields. Kavya's row shows balance ₹38,000, status "Cheque Bounced" (the human label for `PAYMENT_FAILED`), and `isActionRequired: true`. Her payment history in the drawer shows the ₹38,000 cheque with a red **Bounced** badge so Lakshmi can see exactly what happened before making the call.

### 3. Rhea & Ryan Fernandes — STU-1008, STU-1009 (siblings)

Two children, one guardian: Clive Fernandes, `familyId: FAM-360`. Rhea (Class 6-A) has a SIBLING_DISCOUNT waiver on tuition (15%) and owes ₹39,600 total; Ryan (Class 2-B) owes ₹26,000. In the table they appear as two separate rows — each with their own balance and overdue status. The bulk action bar correctly collapses them: when both are selected the display reads "2 students (1 family)," not "2 students (2 families)." In the reminder modal they collapse further to a single guardian line — **"Clive Fernandes — 2 children"** — with both children listed underneath, individual balances shown, and a single combined total of ₹65,600. Clive gets one message, not two identical ones.

## Numbers computed from the running data

The following figures are derived directly from `fee-data.json` (24 students, as of 8 Aug 2026):

**Total Outstanding: ₹5,70,200** — sum of all positive `balance` values only. Students with a negative balance (credit) are excluded from this total and shown on a separate line so the number can be sanity-checked without mental arithmetic.

**Credits: ₹2,000** — Zoya (STU-1004) overpaid by ₹2,000; will carry forward to Term 3.

**Refunds pending: ₹4,500** — Anya Krishnan (STU-1012) withdrew mid-term on 25 Jul 2026; pro-rata refund of ₹4,500 is pending approval.

**Action Required: 15 of 24 students** — 10 OVERDUE + 4 PARTIALLY_PAID + 1 PAYMENT_FAILED.

## Click count

From opening the app to sending reminders to all Action Required students:

| Step | Action                                                                            | Clicks |
| ---- | --------------------------------------------------------------------------------- | ------ |
| 0    | App loads — already filtered to Action Required (15 students), sorted worst-first | 0      |
| 1    | Click "Select all" checkbox in the table header                                   | 1      |
| 2    | Click "Send Reminders" in the bulk action bar                                     | 2      |
| 3    | Click "Send 14 Reminders" in the confirmation modal                               | 3      |

**Total: 3 clicks.** The flow was verified by clicking through in the running app — select all, send, confirm. The siblings correctly collapse to one guardian entry in the modal, so the button reads "Send 14 Reminders" (14 distinct families for 15 students, since the Fernandes family has two children). The number in the modal reflects families, not students — which is the right unit for messaging.

## Mobile and tablet trade-offs

On viewports below 768px (phones), the table is replaced with cards. On tablet screens (768px–1023px), the application deliberately retains the table format with secondary columns (Class, Guardian Phone) hidden, preserving the core ledger grid experience where horizontal space permits.

On phone cards (below 768px), each card shows:

- Name, class, balance, days overdue, status badge
- Tappable "Call" (`tel:` link) and "Message" (`sms:` link) quick actions

**Dropped on mobile, deliberately:**

- **Bulk selection and Send Reminders.** On a 375px screen in a school corridor, Lakshmi is looking up one family's details or making one phone call. Checkboxes and a floating action bar add clutter without matching that use case. Batch reminders are a desk task.
- **Full fee component breakdown on the card face.** The drawer still opens on tap and shows the full breakdown — it is one tap away, not hidden. But the card itself shows only balance and status: enough to decide whether to call.

This is a deliberate trade-off: mobile optimises for "look up one student, call their parent" not "process today's full batch."

## One thing tried and rejected

**A bar chart showing outstanding balance by class.** Early in the design I sketched a horizontal bar chart (Class 10: ₹1,15,800, Class 9: ₹1,24,000, etc.) to let Lakshmi see which year groups were worst. I dropped it for three reasons:

1. With 24 students spread across 12 classes, most bars would represent one or two students — not a meaningful distribution curve, just a restatement of the table in a harder-to-read form.
2. The spec explicitly calls for no dashboards or charts: "the summary numbers are enough; if you considered a chart and dropped it, that's good material for the rationale."
3. The filter + sort already surfaces worst cases immediately in the table. A chart would add visual weight without changing what Lakshmi does next — she still opens the table and starts calling.

The summary bar (total outstanding + action required count + data timestamp) carries sufficient signal for the "how bad is today?" question. Class-level analytics, if ever needed, belong in a separate reporting view, not bolted onto this operational screen.

## Visual craft and design identity

**Moving beyond generic AI dashboard defaults:** Rather than relying on standard dark-slate glassy cards, glowing pill badges, and single indigo accents, the visual language draws inspiration from physical school record registers and official ledger accounting books.

- **Ledger Aesthetics & Alignment:** Typography pairs structural sans-serif headers (`Plus Jakarta Sans`) with crisp monospace numerics (`JetBrains Mono` with `tabular-nums`) to ensure financial figures align perfectly down every column. Left-margin index tab borders mimic physical paper ledger section dividers.
- **Dual Theme System:**
  - _Light Register:_ Modeled after an official printed paper ledger with cream/slate paper tones and deep blue-black ink (`#0f172a`).
  - _Dark Register:_ Modeled after a midnight ledger desk with deep navy surfaces (`#0b0f17`) and cool blue index-rule accents.
- **Considered Color & Contrast:** Overdue status stamps avoid harsh neon red; light mode uses a soft brick/rose hue (`#be123c`) for WCAG AA compliance without feeling overly alarming. Severe overdue records (> 30 days) receive a subtle weight bump (`font-extrabold`) to draw visual priority naturally within the existing palette.
