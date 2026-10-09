/** Same rate as the previous Cornish Cab calculator: £3.75 per road mile. */
export const RATE_PER_MILE = 3.75;

export function farePounds(miles: number): number {
  return Math.round(miles * RATE_PER_MILE * 100) / 100;
}

export function formatFare(pounds: number): string {
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(pounds);
}
