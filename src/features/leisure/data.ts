import { Utensils, Wine, Coffee, Briefcase, DoorOpen, Gift, Car, Bus, ShieldCheck, Home as HomeIcon, Mountain, Waves, Sparkles, Snowflake, Landmark, Compass, Camera, Flame } from "lucide-react";
import type { CountryCode, ExtraGroup, ExpItem, StepKey } from "./types";



export const HERO = {
  1: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1600&q=80", // fjord sunrise
  2: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1600&q=80", // luxury suite
  3: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1600&q=80", // long-table dinner
  4: "https://images.unsplash.com/photo-1508766206392-8bd5cf550d1c?auto=format&fit=crop&w=1600&q=80", // waterfall
  5: "https://images.unsplash.com/photo-1519974719765-e6559eac2575?auto=format&fit=crop&w=1600&q=80", // fireplace lounge
  6: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1600&q=80", // aerial norway
  confirm:
    "https://images.unsplash.com/photo-1483347756197-71ef80e95f73?auto=format&fit=crop&w=1600&q=80", // sunrise mountains
};

export const ROOM_IMG = {
  single:
    "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80",
  twin: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80",
  double:
    "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80",
  triple:
    "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=800&q=80",
  family:
    "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80",
  accessible:
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
};

export const EXP_IMG: Record<string, string> = {
  "Fjord Cruise":
    "https://images.unsplash.com/photo-1601581875309-fafbf2d3ed3a?auto=format&fit=crop&w=900&q=80",
  "Northern Lights":
    "https://images.unsplash.com/photo-1483347756197-71ef80e95f73?auto=format&fit=crop&w=900&q=80",
  Kayaking:
    "https://images.unsplash.com/photo-1526401485004-46910ecc8e51?auto=format&fit=crop&w=900&q=80",
  "Whale Safari":
    "https://images.unsplash.com/photo-1568430462989-44163eb1752f?auto=format&fit=crop&w=900&q=80",
  "City Tour":
    "https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?auto=format&fit=crop&w=900&q=80",
  "Wine Tasting":
    "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=900&q=80",
  Museum:
    "https://images.unsplash.com/photo-1565060169194-19fabf63012c?auto=format&fit=crop&w=900&q=80",
  Hiking:
    "https://images.unsplash.com/photo-1533240332313-0db49b459ad6?auto=format&fit=crop&w=900&q=80",
  Ski: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&w=900&q=80",
  "Local Food Experience":
    "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=900&q=80",
};

export const COUNTRIES: { code: CountryCode; name: string; flag: string }[] = [
  { code: "NO", name: "Norway", flag: "🇳🇴" },
  { code: "SE", name: "Sweden", flag: "🇸🇪" },
  { code: "DK", name: "Denmark", flag: "🇩🇰" },
  { code: "FI", name: "Finland", flag: "🇫🇮" },
];

export const CITIES: Record<CountryCode, string[]> = {
  NO: ["Oslo", "Bergen", "Tromsø", "Lofoten", "Stavanger", "Trondheim", "Bodø", "Ålesund"],
  SE: ["Stockholm", "Gothenburg", "Malmö", "Uppsala", "Kiruna", "Åre", "Visby"],
  DK: ["Copenhagen", "Aarhus", "Odense", "Aalborg", "Billund"],
  FI: ["Helsinki", "Rovaniemi", "Tampere", "Turku", "Levi"],
};

export const ROOMS = [
  { key: "single", title: "Single Room", desc: "1 person", img: ROOM_IMG.single },
  { key: "twin", title: "Twin Room", desc: "2 separate beds", img: ROOM_IMG.twin },
  { key: "double", title: "Double Room", desc: "1 double bed", img: ROOM_IMG.double },
  { key: "triple", title: "Triple Room", desc: "3 people", img: ROOM_IMG.triple },
  { key: "family", title: "Family Room", desc: "4+ people", img: ROOM_IMG.family },
  { key: "accessible", title: "Accessible Room", desc: "Wheelchair friendly", img: ROOM_IMG.accessible },
] as const;

export const EXTRAS: ExtraGroup[] = [
  {
    title: "Dining",
    items: [
      { label: "Breakfast", Icon: Coffee },
      { label: "Packed Breakfast", Icon: Coffee },
      { label: "Lunch", Icon: Utensils },
      { label: "Packed Lunch", Icon: Utensils },
      { label: "Dinner", Icon: Utensils },
      { label: "Gala Dinner", Icon: Wine },
    ],
  },
  {
    title: "Arrival",
    items: [
      { label: "Porter Service", Icon: Briefcase },
      { label: "Private Check-in", Icon: DoorOpen },
      { label: "Welcome Drink", Icon: Wine },
      { label: "Gift Bags", Icon: Gift },
    ],
  },
  {
    title: "Transport",
    items: [
      { label: "Airport Transfer", Icon: Car },
      { label: "Coach Transfer", Icon: Bus },
      { label: "Parking", Icon: Car },
    ],
  },
  {
    title: "Hotel Services",
    items: [
      { label: "Meeting Room", Icon: Briefcase },
      { label: "Laundry", Icon: ShieldCheck },
      { label: "Late Check-out", Icon: HomeIcon },
    ],
  },
];

export const EXPERIENCES: ExpItem[] = [
  { label: "Fjord Cruise", category: "Nature", Icon: Waves },
  { label: "Hiking", category: "Nature", Icon: Mountain },
  { label: "Northern Lights", category: "Winter", Icon: Sparkles },
  { label: "Ski", category: "Winter", Icon: Snowflake },
  { label: "City Tour", category: "Culture", Icon: Landmark },
  { label: "Museum", category: "Culture", Icon: Landmark },
  { label: "Kayaking", category: "Adventure", Icon: Compass },
  { label: "Whale Safari", category: "Adventure", Icon: Camera },
  { label: "Local Food Experience", category: "Food", Icon: Flame },
  { label: "Wine Tasting", category: "Food", Icon: Wine },
];

export const EXP_CATEGORIES = ["All", "Nature", "Winter", "Culture", "Adventure", "Food", "Group Activities"];

export const STEP_META: Record<StepKey, { title: string; kicker: string; headline: string; sub: string }> = {
  1: {
    title: "Destination",
    kicker: "Chapter I",
    headline: "Where will your group\nadventure begin?",
    sub: "Tell us your destination and hotel preferences.",
  },
  2: {
    title: "Accommodation",
    kicker: "Chapter II",
    headline: "Choose where\nyour group will rest.",
    sub: "Design the perfect room distribution for your group.",
  },
  3: {
    title: "Extras",
    kicker: "Chapter III",
    headline: "The small\nmoments that matter.",
    sub: "Add the details that turn a trip into a story.",
  },
  4: {
    title: "Experiences",
    kicker: "Chapter IV",
    headline: "Unforgettable\nScandinavian moments.",
    sub: "Curate the experiences your group will remember.",
  },
  5: {
    title: "Contact",
    kicker: "Chapter V",
    headline: "Who should\nwe write to?",
    sub: "We'll send tailored offers to this person.",
  },
  6: {
    title: "Review",
    kicker: "Chapter VI",
    headline: "One last look\nbefore we begin.",
    sub: "Review everything. It's free and non-binding.",
  },
};
