/**
 * Scenario data — exactly what the Figma design shows (Medsien take-home).
 * "Now" is fixed at Wed 23 Sep 2026, 10:05 local time (GMT+3).
 * Values marked `illustrative: true` (shown with *) are not in the brief.
 */

export type Direction = "Departure" | "Arrival";
export type StatusKind = "delayed-long" | "delayed" | "on-time" | "early" | "boarding" | "cancelled";
export type FilterStatus = "Delayed" | "Boarding" | "Cancelled" | "Early" | "On time";
export type Severity = "critical" | "warning" | "info";
export type GateState = "occupied" | "available" | "out-of-service" | "conflict-risk";

export interface Flight {
  id: string; // e.g. "MD241"
  illustrative: boolean; // shown as "MD212 *"
  airline: string;
  direction: Direction;
  from: string;
  to: string;
  sched: string; // "10:15"
  est: string | null; // "11:30"; null = "—" (cancelled)
  /** How the Est cell is styled: changed times are bold; delayed ones take their badge colour. */
  estTone: "same" | "delayed-long" | "delayed" | "early" | "none";
  status: { kind: StatusKind; label: string };
  filterStatus: FilterStatus;
  gate: string;
  /** Second line in the Gate cell, e.g. "from A08" or "conflict risk" (orange text). */
  gateNote?: string;
  /** Severity of the linked alert shown in the Alert column — only Critical / Warning are shown. */
  alert?: "critical" | "warning";
  /** Position in the "Needs attention" sort (1 = top). */
  attentionRank: number;
}

export const NOW = { time: "10:05", zone: "GMT+3", date: "Wednesday, 23 September 2026" };

export const FRESHNESS = {
  flights: { label: "Flights live" },
  gates: { label: "Gates as of 10:00 · next 10:15", overdueLabel: "Gates overdue · 22 min old" },
};

/** Daily KPIs. `opens` = the full-day view a click leads to (those pages are not designed in the case study). */
export const KPIS = [
  { id: "open-alerts", label: "Open alerts", value: "7", line: "2 critical", tone: "critical" as const, opens: "the Alerts page" },
  { id: "flights-today", label: "Flights today", value: "186", line: "94 departures · 92 arrivals", mobileLine: "94 dep · 92 arr", opens: "the Flights page" },
  { id: "on-time", label: "On time", value: "128", line: "69% on-time rate", opens: "the Flights page, filtered to on time" },
  { id: "delayed", label: "Delayed", value: "34", line: "Avg. dep. delay 18 min", opens: "the Flights page, filtered to delayed" },
  { id: "boarding", label: "Boarding", value: "12", line: "So far today", opens: "the Flights page, filtered to boarded today" },
  { id: "cancelled", label: "Cancelled", value: "4", line: "2% of today's flights", opens: "the Flights page, filtered to cancelled" },
  { id: "gates-in-use", label: "Gates in use", value: "28/34", line: "5 available · 1 unavailable", opens: "the Gates page" },
];

/** Rows in "Needs attention" order (the default sort). */
export const FLIGHTS: Flight[] = [
  { id: "MD241", illustrative: false, airline: "AeroSky", direction: "Departure", from: "Istanbul", to: "Berlin", sched: "10:15", est: "11:30", estTone: "delayed-long", status: { kind: "delayed-long", label: "Delayed +75m" }, filterStatus: "Delayed", gate: "B06", alert: "warning", attentionRank: 1 },
  { id: "MD774", illustrative: false, airline: "EuroAir", direction: "Arrival", from: "London", to: "Istanbul", sched: "10:55", est: "10:55", estTone: "same", status: { kind: "on-time", label: "On time" }, filterStatus: "On time", gate: "B04", alert: "critical", attentionRank: 2 },
  { id: "MD890", illustrative: false, airline: "Global Wings", direction: "Arrival", from: "Dubai", to: "Istanbul", sched: "11:20", est: "11:05", estTone: "early", status: { kind: "early", label: "Early −15m" }, filterStatus: "Early", gate: "C08", alert: "warning", attentionRank: 3 },
  { id: "MD415", illustrative: false, airline: "EuroAir", direction: "Departure", from: "Istanbul", to: "Vienna", sched: "11:35", est: null, estTone: "none", status: { kind: "cancelled", label: "Cancelled" }, filterStatus: "Cancelled", gate: "B09", attentionRank: 4 },
  { id: "MD332", illustrative: false, airline: "NorthJet", direction: "Departure", from: "Istanbul", to: "Amsterdam", sched: "11:10", est: "11:30", estTone: "delayed", status: { kind: "delayed", label: "Delayed +20m" }, filterStatus: "Delayed", gate: "A03", attentionRank: 5 },
  { id: "MD518", illustrative: false, airline: "NorthJet", direction: "Arrival", from: "Paris", to: "Istanbul", sched: "10:30", est: "10:30", estTone: "same", status: { kind: "on-time", label: "On time" }, filterStatus: "On time", gate: "C03", gateNote: "from A08", attentionRank: 6 },
  { id: "MD106", illustrative: false, airline: "AeroSky", direction: "Departure", from: "Istanbul", to: "Rome", sched: "10:45", est: "10:45", estTone: "same", status: { kind: "boarding", label: "Boarding" }, filterStatus: "Boarding", gate: "A11", attentionRank: 7 },
  { id: "MD212", illustrative: true, airline: "EuroAir", direction: "Departure", from: "Istanbul", to: "Zurich", sched: "11:40", est: "11:40", estTone: "same", status: { kind: "on-time", label: "On time" }, filterStatus: "On time", gate: "B07", attentionRank: 8 },
  { id: "MD544", illustrative: true, airline: "NorthJet", direction: "Arrival", from: "Frankfurt", to: "Istanbul", sched: "11:45", est: "11:45", estTone: "same", status: { kind: "on-time", label: "On time" }, filterStatus: "On time", gate: "B06", gateNote: "conflict risk", attentionRank: 9 },
  { id: "MD627", illustrative: false, airline: "Global Wings", direction: "Arrival", from: "Madrid", to: "Istanbul", sched: "11:50", est: "11:50", estTone: "same", status: { kind: "on-time", label: "On time" }, filterStatus: "On time", gate: "A07", attentionRank: 10 },
  { id: "MD903", illustrative: true, airline: "AeroSky", direction: "Departure", from: "Istanbul", to: "Athens", sched: "11:55", est: "11:55", estTone: "same", status: { kind: "on-time", label: "On time" }, filterStatus: "On time", gate: "A02", attentionRank: 11 },
  { id: "MD760", illustrative: true, airline: "Global Wings", direction: "Arrival", from: "Doha", to: "Istanbul", sched: "12:00", est: "12:00", estTone: "same", status: { kind: "on-time", label: "On time" }, filterStatus: "On time", gate: "C01", attentionRank: 12 },
];

export const FILTER_STATUSES: FilterStatus[] = ["Delayed", "Boarding", "Cancelled", "Early", "On time"];

export interface Alert {
  id: string;
  title: string; // may end with " *"
  severity: Severity;
  age: string; // "18 min ago"
  why: string;
  impact: string;
  owner: string;
  links: string[]; // chips after the owner chip
  acknowledgedBy?: string; // "SK 09:58" → "Acknowledged · SK 09:58"
  /** Flight whose detail panel "View" opens (only MD241 is designed). */
  opensFlight?: string;
}

/** Most urgent first: critical, then warning, then info; acknowledged at the bottom. */
export const ALERTS: Alert[] = [
  { id: "a1", title: "Gate B12 unavailable", severity: "critical", age: "18 min ago", why: "Equipment malfunction.", impact: "2 flights need a new gate", owner: "Maintenance", links: ["B12"] },
  { id: "a2", title: "Baggage belt 4 stopped", severity: "critical", age: "6 min ago", why: "Technical team investigating.", impact: "MD774 from London lands 10:55", owner: "Technical", links: ["MD774", "Belt 4"] },
  { id: "a3", title: "MD890 arriving 15 min early *", severity: "warning", age: "3 min ago", why: "Gate C08 occupied until 11:15.", impact: "Possible gate conflict at C08", owner: "Unassigned", links: ["MD890", "C08"] },
  { id: "a4", title: "High density at checkpoint B", severity: "warning", age: "9 min ago", why: "Estimated wait 32 min.", impact: "Target ≤ 15 min · pier B departures", owner: "Security", links: ["Checkpoint B"] },
  { id: "a5", title: "MD241 delayed 75 min", severity: "warning", age: "22 min ago", why: "Severe weather at destination (Berlin).", impact: "Gate B06 held until 11:30 · MD544 due 11:45", owner: "AeroSky ops", links: ["MD241", "B06"], opensFlight: "MD241" },
  { id: "a6", title: "Bridge A11 inspection at 12:00 *", severity: "info", age: "1 h ago", why: "Scheduled, 30 min.", impact: "A11 without bridge 12:00–12:30 · none scheduled then", owner: "Maintenance", links: ["A11"] },
  { id: "a7", title: "Gate change for MD518", severity: "info", age: "25 min ago", why: "Moved from Gate A08 to Gate C03.", impact: "Passengers notified", owner: "Gate control", links: ["MD518", "C03"], acknowledgedBy: "SK 09:58" },
];

export interface Gate {
  id: string; // "A05"
  pier: "A" | "B" | "C";
  number: string; // "05"
  state: GateState;
  tooltipTitle: string;
  /** Lines of the hover tooltip (desktop) / tap sheet (mobile). */
  tooltipLines: string[];
  /** Tooltip opens to the left for columns 4+ (so it never leaves the card). */
  opensLeft: boolean;
}

const G = (id: string, state: GateState, title: string, lines: string[], opensLeft: boolean): Gate => ({
  id, pier: id[0] as Gate["pier"], number: id.slice(1), state, tooltipTitle: title, tooltipLines: lines, opensLeft,
});
const AS_OF = "Gate data as of 10:00";

export const GATES: Gate[] = [
  G("A01", "occupied", "A01 · Occupied", ["Now: MD318 → Izmir * · departs 12:20", AS_OF], false),
  G("A02", "occupied", "A02 · Occupied", ["Now: MD903 → Athens * · departs 11:55", AS_OF], false),
  G("A03", "occupied", "A03 · Occupied", ["Now: MD332 → Amsterdam · departs 11:30 (+20 min)", AS_OF], false),
  G("A04", "occupied", "A04 · Occupied", ["Now: MD402 → Ankara * · departs 12:35", AS_OF], true),
  G("A05", "available", "A05 · Available", ["Free now · nothing assigned before 12:05", AS_OF], true),
  G("A06", "occupied", "A06 · Occupied", ["Now: MD527 → Antalya * · departs 12:50", AS_OF], true),
  G("A07", "occupied", "A07 · Occupied", ["Now: parked aircraft *, towed to remote stand 11:30", "Next: MD627 from Madrid · arrives 11:50", AS_OF], true),
  G("A08", "occupied", "A08 · Occupied", ["Now: MD233 → Trabzon * · departs 13:05", AS_OF], true),
  G("A09", "occupied", "A09 · Occupied", ["Now: MD611 → Bodrum * · departs 13:20", AS_OF], true),
  G("A10", "available", "A10 · Available", ["Free now · nothing assigned before 12:05", AS_OF], true),
  G("A11", "occupied", "A11 · Occupied", ["Now: MD106 → Rome · boarding, departs 10:45", "Next: free from 10:45 · without bridge 12:00–12:30 *", AS_OF], true),
  G("A12", "occupied", "A12 · Occupied", ["Now: occupied · no flight in the next 2 h", AS_OF], true),
  G("B01", "occupied", "B01 · Occupied", ["Now: MD372 → Milan * · departs 12:25", AS_OF], false),
  G("B02", "available", "B02 · Available", ["Free now · nothing assigned before 12:05", AS_OF], false),
  G("B03", "occupied", "B03 · Occupied", ["Now: MD288 → Brussels * · departs 12:45", AS_OF], false),
  G("B04", "occupied", "B04 · Occupied", ["Now: parked aircraft *, towed to remote stand 10:40", "Next: MD774 from London · arrives 10:55 · belt 4 alert", AS_OF], true),
  G("B05", "occupied", "B05 · Occupied", ["Now: MD519 → Prague * · departs 13:10", AS_OF], true),
  G("B06", "conflict-risk", "B06 · Conflict risk", ["Now: MD241 → Berlin · held until 11:30 (+75 min)", "Next: MD544 from Frankfurt * · arrives 11:45", "Only 15 min between them", AS_OF], true),
  G("B07", "occupied", "B07 · Occupied", ["Now: MD212 → Zurich * · departs 11:40", AS_OF], true),
  G("B08", "occupied", "B08 · Occupied", ["Now: MD640 → Kayseri * · departs 13:30", AS_OF], true),
  G("B09", "available", "B09 · Available", ["Freed by cancelled MD415 → Vienna", "Can take a flight displaced from B12", AS_OF], true),
  G("B10", "occupied", "B10 · Occupied", ["Now: MD207 → Warsaw * · departs 14:05", AS_OF], true),
  G("B11", "occupied", "B11 · Occupied", ["Now: MD356 → Dalaman * · departs 14:30", AS_OF], true),
  G("B12", "out-of-service", "B12 · Out of service", ["Equipment malfunction · maintenance assigned", "2 flights need a new gate *", AS_OF], true),
  G("C01", "occupied", "C01 · Occupied", ["Now: parked aircraft *, towed to remote stand 11:40", "Next: MD760 from Doha * · arrives 12:00", AS_OF], false),
  G("C02", "occupied", "C02 · Occupied", ["Now: MD481 → Gaziantep * · departs 12:30", AS_OF], false),
  G("C03", "occupied", "C03 · Occupied", ["Now: held for MD518 (gate changed from A08)", "Next: MD518 from Paris · arrives 10:30", AS_OF], false),
  G("C04", "occupied", "C04 · Occupied", ["Now: MD163 → Adana * · departs 12:55", AS_OF], true),
  G("C05", "occupied", "C05 · Occupied", ["Now: MD690 → Bursa * · departs 12:40", AS_OF], true),
  G("C06", "available", "C06 · Available", ["Free now · nothing assigned before 12:05", AS_OF], true),
  G("C07", "occupied", "C07 · Occupied", ["Now: MD592 → Samsun * · departs 13:15", AS_OF], true),
  G("C08", "conflict-risk", "C08 · Conflict risk", ["Now: occupied until 11:15", "Next: MD890 from Dubai · arrives 11:05 (early)", AS_OF], true),
  G("C09", "occupied", "C09 · Occupied", ["Now: MD734 → Lisbon * · departs 13:50", AS_OF], true),
  G("C10", "occupied", "C10 · Occupied", ["Now: MD825 → Copenhagen * · departs 15:10", AS_OF], true),
];

export const GATE_SUMMARY = {
  total: 34,
  inUse: 28,
  inUseLabel: "28 of 34 in use",
  stats: [
    { label: "5 available", dot: "success" as const },
    { label: "1 out of service", dot: "error" as const },
    { label: "2 conflict risks", dot: "warning" as const },
  ],
};

/** Flight detail — only MD241 is designed in full. */
export const FLIGHT_DETAIL_MD241 = {
  flightId: "MD241",
  title: "MD241 · AeroSky",
  route: "Istanbul (IST) → Berlin (BER) · Departure",
  routeMobile: ["Istanbul (IST) → Berlin (BER)", "Departure"],
  badges: [
    { kind: "status" as const, status: "delayed-long" as StatusKind, label: "Delayed +75m" },
    { kind: "severity" as const, severity: "warning" as Severity, label: "Warning" },
  ],
  times: { scheduled: "10:15", estimated: "11:30", departsIn: "1 h 25 min" },
  delayReason: { text: "Severe weather at destination", code: "IATA 72", assumption: true },
  gate: {
    gate: "B06",
    title: "B06 · held until 11:30",
    lines: ["MD544 * from Frankfurt is due at 11:45", "Only 15 min between them"],
    freshness: "Gates as of 10:00 · next 10:15",
  },
  details: [
    { label: "Aircraft", value: "A321neo *" },
    { label: "Passengers", value: "184 booked *" },
    { label: "Boarding starts", value: "10:55 (est.) *" },
    { label: "Ground handler", value: "Istanbul Ground *" },
  ],
  activity: [
    { time: "09:43", text: "Delay +75 min published by AeroSky ops" },
    { time: "09:40", text: "Weather advisory issued for BER" },
    { time: "08:10", text: "Gate B06 assigned" },
  ],
  actions: { secondary: "Notify gate agent", primary: "Acknowledge alert", alertId: "a5" },
};

/** Only MD241's detail is designed (as in Figma), so it is the only flight that opens the panel / sheet. */
export const hasFlightDetail = (flightId: string) => flightId === FLIGHT_DETAIL_MD241.flightId;

/** Mobile gate sheet (tap B06). */
export const GATE_SHEET_B06 = {
  gate: "B06",
  title: "B06 · Conflict risk",
  subtitle: "Pier B · predicted from live flight data, not confirmed",
  now: "MD241 → Berlin · held until 11:30 (+75 min)",
  next: ["MD544 from Frankfurt * · arrives 11:45", "Only 15 min between them"],
  freshness: "Gates as of 10:00 · next 10:15",
  actions: { secondary: "View MD241", primary: "Open gate timeline" },
};
