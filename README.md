# Istanbul Regional · Operations overview

Coded version of my Medsien UI/UX take-home: an airport operations dashboard for the duty manager at a fictional regional airport. It follows the Figma design 1:1 (desktop 1440, mobile 375).

**Case study prototype · fictional data. Not a real airport system.**

## What works

- **KPI cards:** clickable, with a hover state. Each one would open the full-day list behind its number (the Alerts, Flights or Gates page). Those pages aren't designed, so a click shows a note saying so.
- **Flights:** filter by direction, filter by status (multi-select), search by flight, airline, city or gate, and sort by "Needs attention" or time.
- **Flight detail:** click a row, or "View" on the MD241 alert, to open the slide-out panel. On mobile it opens as a bottom sheet. You can deep-link to it with `?flight=MD241`.
- **Alerts:** Acknowledge shows a toast with Undo. Acknowledged alerts stay in the list, greyed, with who and when.
- **Gates:** hover a tile (or focus it with the keyboard) on desktop for a tooltip. On mobile, tap a tile to open the gate sheet (B06 shows the full conflict).
- **Sticky page header:** it switches to its "Scrolled" state once the content moves under it.
- **Keyboard and screen readers:** Esc closes panels, focus stays inside open panels and returns to where it was on close, and reduced motion is respected.

Screens and links that the case study didn't design (the Flights, Gates and Alerts pages, notifications, the account menu) are shown but do nothing.

## Stack

Next.js (App Router), React, TypeScript and Tailwind CSS v4. Design tokens are copied from the Figma variables (Untitled UI kit) into `src/app/globals.css`, and the icons are `@untitledui/icons`. All scenario data lives in `src/data/scenario.ts`.

## Run locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000.
