# Fee Collection Screen

A single-page triage tool for school accounts officers. Lakshmi opens it every morning to see how much is outstanding, who needs chasing first, and how to send batch reminders — without touching a spreadsheet.

## Stack

Vite · React 18 · TypeScript · Tailwind CSS v4

## Run

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). The app loads with the Action Required filter active and students sorted worst-first — no manual setup needed.

## Build

```bash
npm run build
```

## Dev notes

- Add `?error=1` to the URL to force the error state (useful for reviewing the error UI without a backend).
- Data is a static JSON snapshot (`src/data/fee-data.json`). The "as of" date shown in the summary bar reflects the snapshot date, not the current time.

## Design decisions

See [RATIONALE.md](./RATIONALE.md).
