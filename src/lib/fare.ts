/** Copied from the previous Cornish Cab calculator. */
export const RATE_PER_MILE = 3.75;
export const PICKUP_SURCHARGE_MILES = 10;
export const PICKUP_SURCHARGE = 10;
export const BASE = "St Austell, Cornwall, UK";

const TERM_DATES: [string, string][] = [
  ["2026-09-03", "2026-12-18"],
  ["2027-01-04", "2027-03-25"],
  ["2027-04-12", "2027-07-23"],
  ["2027-09-02", "2027-12-22"],
  ["2028-01-06", "2028-03-31"],
  ["2028-04-18", "2028-07-21"],
];

export function roundUpToPound(value: number): number {
  return Math.ceil(value - 1e-9);
}

export function quoteFare(miles: number, pickupMilesFromStAustell: number | null) {
  const journey = roundUpToPound(miles * RATE_PER_MILE);
  const surcharge =
    pickupMilesFromStAustell != null && pickupMilesFromStAustell > PICKUP_SURCHARGE_MILES
      ? PICKUP_SURCHARGE
      : 0;
  return { pounds: journey + surcharge, journey, surcharge, pickupMiles: pickupMilesFromStAustell };
}

export function formatFare(pounds: number): string {
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(
    pounds,
  );
}

function isoDate(date: Date) {
  const part = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${part(date.getMonth() + 1)}-${part(date.getDate())}`;
}

function hhmm(date: Date) {
  const part = (value: number) => String(value).padStart(2, "0");
  return `${part(date.getHours())}:${part(date.getMinutes())}`;
}

function isSchoolRunTime(date: string, time: string) {
  const day = new Date(`${date}T12:00:00`).getDay();
  if (day === 0 || day === 6) return false;
  const inTerm = TERM_DATES.some(([start, end]) => date >= start && date <= end);
  if (!inTerm) return false;
  const blocked = (start: string, end: string) => time >= start && time < end;
  return blocked("07:30", "09:15") || blocked("14:00", "16:00");
}

export function schoolRunBlock(asap: boolean, when: string, now = new Date()): string | null {
  const date = asap ? isoDate(now) : when.slice(0, 10);
  const time = asap ? hhmm(now) : when.slice(11, 16);
  if (!asap && time.length < 5) return null;
  if (!isSchoolRunTime(date, time)) return null;
  return "Bookings are unavailable at this time. The Cornish Cab is on a school run from 7:30–9:15am and 2:00–4:00pm on weekdays during school term. Please choose another time. Weekends and school holidays are available.";
}
