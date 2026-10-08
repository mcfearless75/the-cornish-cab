export const BUSINESS = {
  name: "The Cornish Cab",
  phoneDisplay: "07708 067775",
  phoneTel: "+447708067775",
  locality: "St Austell",
  region: "Cornwall",
  country: "United Kingdom",
  updated: "2026-10-08",
  description:
    "The Cornish Cab is an independent taxi based in St Austell, Cornwall. One driver, one vehicle, maximum three passengers. Bookings are taken outside school-run times. Weekend and school-holiday bookings are available. A booking is not confirmed until availability is checked. The fare is worked out from the live road route and confirmed before you travel.",
} as const;

export function whatsappHref(text?: string) {
  const base = "https://wa.me/447708067775";
  const body = text?.trim();
  if (!body) return base;
  return `${base}?text=${encodeURIComponent(body.slice(0, 1500))}`;
}

export const services = [
  {
    slug: "local",
    name: "Local taxi journeys",
    summary:
      "Short hops around St Austell and the villages: shops, the station, a meal, or home after the harbour.",
  },
  {
    slug: "airports",
    name: "Airport transfers",
    summary:
      "Pre-booked runs to Cornwall Airport Newquay, Exeter, Bristol and other airports. The fare follows the live road route.",
  },
  {
    slug: "stations",
    name: "Train station transfers",
    summary:
      "Pickups and drop-offs at St Austell, Par and other Cornish stations. Tell us the train; we still confirm we are free.",
  },
  {
    slug: "prebook",
    name: "Pre-booked journeys",
    summary:
      "Longer days out and early starts, arranged ahead. Recommended for airports and anything beyond a local hop.",
  },
] as const;

export type Place = {
  slug: string;
  name: string;
  group: "Coast" | "Towns" | "Days out" | "Airports" | "Stations";
  description: string;
  lede: string;
  body: string;
};

export const places: Place[] = [
  {
    slug: "st-austell",
    name: "St Austell",
    group: "Towns",
    description:
      "St Austell taxi with The Cornish Cab: one local driver, one vehicle, up to three passengers. Call 07708 067775. Fares confirmed from the live road route.",
    lede:
      "St Austell is home base. The Cornish Cab is an independent taxi here: one driver, one vehicle, and room for up to three passengers.",
    body:
      "Journeys around the town, to the railway station, and out toward the clay country, the coast and the gardens are the everyday work. Bookings are taken outside school-run times. Weekend and school-holiday bookings are available. Nothing is confirmed until the driver checks they are free, and the fare comes from the live road route rather than a price printed on this website.",
  },
  {
    slug: "charlestown",
    name: "Charlestown",
    group: "Coast",
    description:
      "Taxi between St Austell and Charlestown harbour. The Cornish Cab, 07708 067775. Maximum three passengers. Pre-book if you are meeting a ship or a timed visit.",
    lede:
      "Charlestown is the historic harbour just south of St Austell, with a stone quay, tall-ship heritage and a tight village street.",
    body:
      "It is a short local run from St Austell. Parking by the harbour fills quickly on bright days, so a drop-off is often simpler than hunting for a space. Say if you are meeting people at a set time. The booking still waits on an availability check, and the fare is confirmed from the road route before you travel.",
  },
  {
    slug: "mevagissey",
    name: "Mevagissey",
    group: "Coast",
    description:
      "Mevagissey taxi from St Austell with The Cornish Cab. One vehicle, maximum three passengers. Call 07708 067775 to confirm the fare and the time.",
    lede:
      "Mevagissey is a working fishing harbour south of St Austell. The lanes in are narrow and village parking is limited.",
    body:
      "A taxi to the harbour, or back up the hill after a meal, is a regular request. The Cornish Cab can take up to three passengers. Pre-booking is wise on summer evenings and when you have a train to catch afterwards. The driver confirms both the time and the fare before the job is booked.",
  },
  {
    slug: "fowey",
    name: "Fowey",
    group: "Coast",
    description:
      "Fowey taxi from St Austell. The Cornish Cab is one driver and one vehicle, maximum three passengers. Phone 07708 067775. Fare confirmed from the live road route.",
    lede:
      "Fowey sits on the estuary east of St Austell. The town is hilly, the ferry runs to Polruan, and parking in the centre is awkward.",
    body:
      "The Cornish Cab runs to Fowey by pre-booking whenever the journey is tied to a ferry, a meal or a train. This is still one ordinary vehicle with a maximum of three passengers, not a coach and not the ferry operator. Call 07708 067775 so availability and the road-route fare can be confirmed.",
  },
  {
    slug: "carlyon-bay",
    name: "Carlyon Bay",
    group: "Coast",
    description:
      "Carlyon Bay taxi from St Austell or Par station. The Cornish Cab, 07708 067775. Up to three passengers. Booking confirmed only after an availability check.",
    lede:
      "Carlyon Bay is the beach stretch between St Austell and Par, with the coast path above the sand.",
    body:
      "Useful as a drop-off for a walk, or a pickup when you do not want to climb back to the road. If you are coming off a train, Par and St Austell stations are both nearby enough to name in the booking. The fare is not fixed on this page; it is taken from the live road route and agreed before travel.",
  },
  {
    slug: "par",
    name: "Par",
    group: "Towns",
    description:
      "Par taxi and Par station transfers with The Cornish Cab in St Austell. Call 07708 067775. One driver, maximum three passengers.",
    lede:
      "Par is the village and beach east of St Austell, and Par railway station is the junction for the branch toward Newquay.",
    body:
      "Station pickups, beach runs and connections on toward the Eden Project are typical. Name the station and the train if you have one. The Cornish Cab checks it is free before confirming, including outside school-run times on weekdays, and at weekends and in school holidays.",
  },
  {
    slug: "eden-project",
    name: "Eden Project",
    group: "Days out",
    description:
      "Taxi to the Eden Project from St Austell with The Cornish Cab. Pre-book on 07708 067775. Maximum three passengers. Not the attraction’s own shuttle.",
    lede:
      "The Eden Project is in a former china-clay pit at Bodelva, a short journey from St Austell.",
    body:
      "Pre-book, particularly when you have timed entry. The Cornish Cab is an independent taxi, not the Eden Project’s own transport and not a coach operator. One vehicle, maximum three passengers. The fare is calculated from the live road route and confirmed before you go. Allow time at the other end for ticket checks; that wait is not included unless you agree it when you book.",
  },
  {
    slug: "heligan",
    name: "Lost Gardens of Heligan",
    group: "Days out",
    description:
      "Taxi to the Lost Gardens of Heligan from St Austell or Mevagissey. The Cornish Cab, 07708 067775. Up to three passengers. Pre-book.",
    lede:
      "The Lost Gardens of Heligan lie inland from Mevagissey, in the countryside south of St Austell.",
    body:
      "It is a straightforward pre-booked run, often paired with the coast afterwards. Say what time you want collecting as well as dropping, so the driver can say whether both ends are possible. Three passengers maximum. The website will measure a road route for you; the actual fare is confirmed by phone, not by this page.",
  },
  {
    slug: "truro",
    name: "Truro",
    group: "Towns",
    description:
      "St Austell to Truro taxi with The Cornish Cab. Pre-book longer journeys on 07708 067775. One driver, maximum three passengers.",
    lede:
      "Truro is the cathedral city west of St Austell, with the main hospital for Cornwall at Treliske on the edge of town.",
    body:
      "City-centre trips and journeys toward the hospital are both things people ask for. This is an ordinary taxi, not patient transport and not an ambulance. Pre-booking is recommended. Weekday bookings are outside school-run times; weekends and school holidays are available. Confirm the fare from the live road route before you travel.",
  },
  {
    slug: "newquay",
    name: "Newquay",
    group: "Towns",
    description:
      "Taxi from St Austell to Newquay town with The Cornish Cab. Pre-book on 07708 067775. Maximum three passengers. Fare confirmed from the road route.",
    lede:
      "Newquay town is the north-coast resort, separate from the airport at St Mawgan.",
    body:
      "A town run and an airport run are different jobs — say which one you need. Both should be pre-booked. The Cornish Cab takes up to three passengers in one vehicle. Availability is checked manually, and the fare follows the live road route rather than a flat fare published here.",
  },
  {
    slug: "lostwithiel",
    name: "Lostwithiel",
    group: "Towns",
    description:
      "Lostwithiel taxi from St Austell, including the railway station. The Cornish Cab, 07708 067775. One vehicle, up to three passengers.",
    lede:
      "Lostwithiel is the small town up the Fowey valley, with its own station on the Cornish main line.",
    body:
      "Useful when the train stops there and you need the last miles, or when you are heading back to St Austell. Pre-book if you are meeting a specific service. The driver confirms they can do it, then confirms the fare from the road route.",
  },
  {
    slug: "newquay-airport",
    name: "Cornwall Airport Newquay",
    group: "Airports",
    description:
      "Newquay Airport taxi from St Austell. Pre-book The Cornish Cab on 07708 067775. Up to three passengers. Fare from the live road route, not a price on this page.",
    lede:
      "Cornwall Airport Newquay (NQY) is at St Mawgan, north of Newquay. It is the local airport for mid-Cornwall.",
    body:
      "Airport transfers should be pre-booked. Put your flight number in the notes so the driver can plan around it. This website does not track flights. There is no published fixed fare: the price is taken from the live road route and agreed before the booking is confirmed. Maximum three passengers, one vehicle. Weekday work sits outside school-run times.",
  },
  {
    slug: "exeter-airport",
    name: "Exeter Airport",
    group: "Airports",
    description:
      "Exeter Airport transfer from St Austell with The Cornish Cab. Longer journey — pre-book 07708 067775. Maximum three passengers.",
    lede:
      "Exeter Airport (EXT) is in Devon, east of St Austell. It is a longer run than Newquay and needs to be arranged ahead.",
    body:
      "Because it takes a large part of the day for one driver, these jobs are pre-booked only, and they are not confirmed until availability is checked. Share the flight number and whether you need the return as well. The fare comes from the live road route, including the real miles rather than a guess on this page. Three passengers maximum.",
  },
  {
    slug: "bristol-airport",
    name: "Bristol Airport",
    group: "Airports",
    description:
      "Bristol Airport taxi from St Austell, pre-booked with The Cornish Cab. Call 07708 067775. One vehicle, maximum three passengers.",
    lede:
      "Bristol Airport (BRS) is a long pre-booked journey from St Austell, well beyond a local hop.",
    body:
      "Only book this if you can agree the time in advance. One driver means the vehicle cannot be in Cornwall and at Bristol at once, so early flights need an early confirmation. The fare is worked out from the live road route and confirmed before you travel. This site will show road distance as a guide. It will not pretend that distance is a price.",
  },
  {
    slug: "st-austell-station",
    name: "St Austell railway station",
    group: "Stations",
    description:
      "St Austell station taxi. The Cornish Cab meets mainline trains by arrangement. Call 07708 067775. Maximum three passengers.",
    lede:
      "St Austell railway station is on the Cornish main line, in the town, and the simplest station pickup for anyone based here.",
    body:
      "Say which train you are on and where you are going next. The booking is not confirmed until The Cornish Cab checks availability — a delayed train still needs the driver to be free. The fare is the live road route from the station to your stop, agreed before you travel. Maximum three passengers with their luggage that fits one ordinary car; if you have more bags than seats, say so when you call.",
  },
  {
    slug: "par-station",
    name: "Par railway station",
    group: "Stations",
    description:
      "Par station taxi to St Austell, the beach, Fowey or the Eden Project. The Cornish Cab, 07708 067775. Pre-book. Up to three passengers.",
    lede:
      "Par railway station is east of St Austell, on the main line, and the junction for the Newquay branch.",
    body:
      "People use it for Carlyon Bay, the beach at Par, Fowey and connections toward the Eden Project. Name the train. Pre-booking is recommended, especially if the branch connection is tight. One driver, one vehicle, three passengers maximum. Fare confirmed from the road route, not from a table on this website.",
  },
];

export const quickJourneys = [
  { from: "St Austell railway station", to: "Mevagissey" },
  { from: "St Austell", to: "Eden Project, Bodelva" },
  { from: "St Austell", to: "Cornwall Airport Newquay" },
  { from: "Charlestown", to: "Fowey" },
  { from: "Par railway station", to: "Carlyon Bay" },
  { from: "St Austell", to: "Lost Gardens of Heligan" },
] as const;

export const faqs = [
  {
    q: "How do I book The Cornish Cab?",
    a: "Send the journey on WhatsApp to 07708 067775 from the booking page. A booking is not confirmed until The Cornish Cab checks availability.",
  },
  {
    q: "How many passengers can you take?",
    a: "Maximum three passengers. There is one driver and one vehicle.",
  },
  {
    q: "Do you run during the school run?",
    a: "Bookings are taken outside school-run times. Weekend and school-holiday bookings are available. The exact window on a school day is confirmed when you call — this site does not publish a clock time the old listing did not state.",
  },
  {
    q: "How is the fare worked out?",
    a: "From the live road route, then confirmed before you travel. The route checker on this site can show distance and driving time. That figure is not a price and not a confirmed booking.",
  },
  {
    q: "Do you do airports and stations?",
    a: "Yes. Airport transfers and train station transfers are part of the work, and pre-booking is recommended, especially for airports and longer journeys. Newquay, Exeter and Bristol are the airports people usually mean. St Austell and Par are the local stations.",
  },
  {
    q: "Is my online request a confirmed booking?",
    a: "No. The driver checks the time manually before anything is confirmed. Until you have that confirmation, the trip is only a request.",
  },
  {
    q: "Do you publish a street address, email or vehicle registration?",
    a: "No. The public details are the name, the base in St Austell, Cornwall, and the phone number 07708 067775. Ask anything else when you call.",
  },
  {
    q: "Can you guarantee a child seat, card payment or a wheelchair vehicle?",
    a: "Those details are not published. This is one ordinary vehicle with a maximum of three passengers. Ask when you book rather than assuming.",
  },
] as const;

export const staticPages = [
  { path: "/", priority: "1.0" },
  { path: "/book", priority: "0.9" },
  { path: "/services", priority: "0.8" },
  { path: "/airport-transfers", priority: "0.8" },
  { path: "/train-stations", priority: "0.8" },
  { path: "/areas", priority: "0.8" },
  { path: "/faq", priority: "0.7" },
  { path: "/about", priority: "0.6" },
] as const;

export function allPaths(): string[] {
  return [...staticPages.map((p) => p.path), ...places.map((p) => `/areas/${p.slug}`)];
}

export function factsBrief(): string {
  const placeLines = places
    .map((p) => `${p.name} (${p.group}): ${p.lede} ${p.body}`)
    .join("\n");
  const faqLines = faqs.map((f) => `Q: ${f.q}\nA: ${f.a}`).join("\n");
  return [
    BUSINESS.description,
    `Phone and WhatsApp: ${BUSINESS.phoneDisplay} (${BUSINESS.phoneTel}). Bookings and enquiries are taken on WhatsApp.`,
    "Services: " + services.map((s) => `${s.name} — ${s.summary}`).join(" "),
    "Places:\n" + placeLines,
    "FAQ:\n" + faqLines,
  ].join("\n\n");
}

export function placeBySlug(slug: string): Place | undefined {
  return places.find((p) => p.slug === slug);
}
