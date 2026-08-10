import { type ConciergeCategory, type Step3Context } from "@/features/leisure/types";
import { format } from "date-fns";
import { BedDouble, Bell, Briefcase, Check, Coffee, ConciergeBell, DoorOpen, Gift, Home as HomeIcon, MessageSquare, Pencil, Plane, Users, Users2, Utensils, Wine } from "lucide-react";

export const CONCIERGE_CATEGORIES: ConciergeCategory[] = [
  {
    key: "arrival",
    title: "Arrival",
    description: "Welcome, porter & first impressions",
    img: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=900&q=80",
    icon: ConciergeBell,
    configTitle: "Arrival Experience",
    configPrompt: "How should your group be welcomed on arrival?",
    options: [
      { label: "Hospitality Desk", icon: Users2 },
      { label: "Arrival Porter Service", displayLabel: "Porter Service", icon: Bell },
      { label: "No arrival services required", icon: Check },
    ],
  },
  {
    key: "welcome",
    title: "Welcome",
    description: "Personalised touches on arrival",
    img: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=900&q=80",
    icon: Gift,
    configTitle: "Welcome Touches",
    configPrompt: "How would you like to greet your guests?",
    options: [
      { label: "VIP Welcome Amenities", icon: Gift },
      { label: "Welcome Letter", icon: Pencil },
      { label: "No welcome services required", icon: Check },
    ],
  },
  {
    key: "stay",
    title: "Stay",
    description: "Enhance their hotel experience",
    img: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=900&q=80",
    icon: BedDouble,
    configTitle: "In-Stay Enhancements",
    configPrompt: "Refinements to elevate the hotel experience.",
    options: [
      { label: "Early Check-in", icon: DoorOpen },
      { label: "Late Check-out", icon: DoorOpen },
      { label: "Room Location Preferences", icon: HomeIcon },
      { label: "No stay services required", icon: Check },
    ],
  },
  {
    key: "dining",
    title: "Dining",
    description: "Breakfast, lunch & dinner",
    img: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=900&q=80",
    icon: Utensils,
    configTitle: "Dining Arrangements",
    configPrompt: "Where and when should your group dine?",
    options: [
      { label: "Group Lunch", icon: Utensils },
      { label: "Group Dinner", icon: Utensils },
      { label: "Packed Lunch", icon: Briefcase },
      { label: "Private Dining", icon: Wine },
      { label: "Breakfast Box", icon: Coffee },
      { label: "Early Breakfast", icon: Coffee },
      { label: "No dining services required", icon: Check },
    ],
  },
  {
    key: "meeting",
    title: "Meeting",
    description: "Welcome or information meeting",
    img: "https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=900&q=80",
    icon: Users,
    configTitle: "Meeting Space",
    configPrompt: "A quiet room for your group briefing.",
    options: [
      { label: "Meeting Room", icon: Users2 },
      { label: "Information Desk", icon: MessageSquare },
      { label: "No meeting services required", icon: Check },
    ],
  },
  {
    key: "departure",
    title: "Departure",
    description: "Farewell assistance & departure services",
    img: "https://images.unsplash.com/photo-1553913861-c0fddf2619ee?auto=format&fit=crop&w=900&q=80",
    icon: Plane,
    configTitle: "Departure Experience",
    configPrompt: "How should your group leave?",
    options: [
      { label: "Porter Service Out", displayLabel: "Porter Service", icon: Briefcase },
      { label: "No departure services required", icon: Check },
    ],
  },
];

export const TRANSPORT_SERVICES = new Set(["Arrival Transport", "Departure Transport"]);

export const PORTER_SERVICES = new Set(["Arrival Porter Service", "Porter Service Out"]);

export const CITY_AIRPORT: Record<string, string> = {
  Oslo: "Oslo Airport (OSL)",
  Bergen: "Bergen Airport (BGO)",
  Tromsø: "Tromsø Airport (TOS)",
  Tromso: "Tromsø Airport (TOS)",
  Stavanger: "Stavanger Airport (SVG)",
  Trondheim: "Trondheim Airport (TRD)",
  Bodø: "Bodø Airport (BOO)",
  Bodo: "Bodø Airport (BOO)",
  Ålesund: "Ålesund Airport (AES)",
  Alesund: "Ålesund Airport (AES)",
};

export function nearestAirportFor(city: string | undefined): string {
  if (!city) return "";
  return CITY_AIRPORT[city] ?? "";
}

export function contextArrivalISO(ctx: Step3Context): string {
  if (ctx.stays[0]?.arrival) return ctx.stays[0].arrival;
  return ctx.arrival ? format(ctx.arrival, "yyyy-MM-dd") : "";
}

export function contextDepartureISO(ctx: Step3Context): string {
  if (ctx.stays.length) return ctx.stays[ctx.stays.length - 1]!.departure;
  return ctx.departure ? format(ctx.departure, "yyyy-MM-dd") : "";
}

export const SMART_SERVICES = new Set<string>([
  "Group Lunch",
  "Group Dinner",
  "Early Check-in",
  "Late Check-out",
  "VIP Welcome Amenities",
  "Hospitality Desk",
  ...Array.from(TRANSPORT_SERVICES),
  ...Array.from(PORTER_SERVICES),
]);
