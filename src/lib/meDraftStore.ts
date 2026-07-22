import { useSyncExternalStore } from "react";

export type MeRooms = { sgl: number; dbl: number; twn: number; trp: number; ste: number };
export type MeMealPlan = "room" | "breakfast";

export type MeLocation = {
  countryCode?: string;
  countryName?: string;
  destinationId?: string;
  destinationName?: string;
  isAnywhere?: boolean;
  preferredVenue?: string;
  budget?: "economy" | "mid" | "premium" | "luxury" | null;
};

export type MeAccommodationStay = {
  id: string;
  checkIn: string;
  checkOut: string;
  rooms: MeRooms;
  mealPlan: MeMealPlan;
};

export type MeAccommodationExtras = {
  special?: string;
  roomCategory?: Partial<Record<"sgl" | "dbl" | "twn" | "trp", string>>;
};

export type MeMeetingSpace = {
  id: string;
  name: string;
  date: string;
  startTime: string;
  endTime: string;
  attendees: number;
  setupId: string;
  setupLabel: string;
  equipmentLabels: string[];
  notes: string;
  customLayout?: string;
};

export type MeCateringItem = {
  servingId: string;
  cateringId: string;
  label: string;
  time: string;
  location: string;
  locationOther?: string;
  variant?: string;
};

export type MeCateringExtras = {
  dietary: string[];
  dietaryOther: string;
  drinks: string[];
  notes: string;
};

export type MeExtraItem = {
  id: string;
  title: string;
  summary: string[];
};

export type MeEventDetails = {
  eventName?: string;
  company?: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  countryCode?: string;
};

export type MeDraft = {
  location: MeLocation;
  accommodationStays: MeAccommodationStay[];
  accommodationExtras: MeAccommodationExtras;
  meetingSpaces: MeMeetingSpace[];
  catering: MeCateringItem[];
  cateringExtras: MeCateringExtras;
  extras: MeExtraItem[];
  extrasNotes: string;
  eventDetails: MeEventDetails;
};

const KEY = "hgb:me-request-v1";

const empty = (): MeDraft => ({
  location: {},
  accommodationStays: [],
  accommodationExtras: {},
  meetingSpaces: [],
  catering: [],
  cateringExtras: { dietary: [], dietaryOther: "", drinks: [], notes: "" },
  extras: [],
  extrasNotes: "",
  eventDetails: {},
});

let state: MeDraft = empty();
let hydrated = false;
const listeners = new Set<() => void>();

function loadFromStorage() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) state = { ...empty(), ...JSON.parse(raw) };
  } catch {
    /* ignore */
  }
}

function persist() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

function emit() {
  listeners.forEach((l) => l());
}

export function getMeDraft(): MeDraft {
  loadFromStorage();
  return state;
}

export function setMeSection<K extends keyof MeDraft>(key: K, value: MeDraft[K]) {
  loadFromStorage();
  // Skip when equal (shallow JSON compare) to prevent update loops.
  try {
    if (JSON.stringify(state[key]) === JSON.stringify(value)) return;
  } catch {
    /* fall through */
  }
  state = { ...state, [key]: value };
  persist();
  emit();
}

export function subscribeMeDraft(fn: () => void) {
  loadFromStorage();
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function useMeDraft(): MeDraft {
  return useSyncExternalStore(
    subscribeMeDraft,
    () => {
      loadFromStorage();
      return state;
    },
    () => empty(),
  );
}
