import afternoonBreakImg from "@/assets/catering/afternoon-break.jpg";
import barDrinksImg from "@/assets/catering/bar-drinks.jpg";
import coffeeCateringImg from "@/assets/catering/coffee.jpg";
import dinnerCateringImg from "@/assets/catering/dinner.jpg";
import fruitCateringImg from "@/assets/catering/fruit.jpg";
import galaDinnerImg from "@/assets/catering/gala-dinner.jpg";
import lunchCateringImg from "@/assets/catering/lunch.jpg";
import morningBreakImg from "@/assets/catering/morning-break.jpg";
import snacksCateringImg from "@/assets/catering/snacks.jpg";
import { Apple, CakeSlice, Coffee, Croissant, Menu, Nut, Sparkles, Utensils, UtensilsCrossed, Wine } from "lucide-react";
import React from "react";

export type CateringId =
  | "coffee"
  | "fruit"
  | "snacks"
  | "morning-break"
  | "lunch"
  | "afternoon-break"
  | "dinner"
  | "bar-drinks"
  | "gala-dinner";

export type CateringDef = {
  id: CateringId;
  label: string;
  image: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; style?: React.CSSProperties }>;
  defaultTime: string;
  defaultLocation: string;
  variants?: { default: string; options: string[] };
};

export const CATERING_DEFS: CateringDef[] = [
  {
    id: "coffee",
    label: "Coffee",
    image: coffeeCateringImg,
    icon: Coffee,
    defaultTime: "08:30",
    defaultLocation: "Main Conference Room",
  },
  {
    id: "fruit",
    label: "Fruit",
    image: fruitCateringImg,
    icon: Apple,
    defaultTime: "10:30",
    defaultLocation: "Main Conference Room",
  },
  {
    id: "snacks",
    label: "Snacks",
    image: snacksCateringImg,
    icon: Nut,
    defaultTime: "14:00",
    defaultLocation: "Main Conference Room",
  },

  {
    id: "morning-break",
    label: "Morning Break",
    image: morningBreakImg,
    icon: Croissant,
    defaultTime: "10:00",
    defaultLocation: "Main Conference Room",
  },
  {
    id: "lunch",
    label: "Lunch",
    image: lunchCateringImg,
    icon: UtensilsCrossed,
    defaultTime: "12:30",
    defaultLocation: "Restaurant",
    variants: {
      default: "Buffet",
      options: ["Buffet", "2-Course Menu", "3-Course Menu", "Chef's Choice"],
    },
  },
  {
    id: "afternoon-break",
    label: "Afternoon Break",
    image: afternoonBreakImg,
    icon: CakeSlice,
    defaultTime: "15:30",
    defaultLocation: "Main Conference Room",
  },
  {
    id: "dinner",
    label: "Dinner",
    image: dinnerCateringImg,
    icon: Utensils,
    defaultTime: "19:00",
    defaultLocation: "Restaurant",
    variants: {
      default: "3-Course Dinner",
      options: ["Buffet", "2-Course Dinner", "3-Course Dinner", "Chef's Choice"],
    },
  },
  {
    id: "bar-drinks",
    label: "Bar / Drinks",
    image: barDrinksImg,
    icon: Wine,
    defaultTime: "20:30",
    defaultLocation: "Lobby Lounge",
  },
  {
    id: "gala-dinner",
    label: "Gala Dinner",
    image: galaDinnerImg,
    icon: Sparkles,
    defaultTime: "19:30",
    defaultLocation: "Restaurant",
    variants: {
      default: "3-Course Gala Dinner",
      options: ["Gala Buffet", "3-Course Gala Dinner", "Chef's Choice"],
    },
  },
];

export const HOTEL_LOCATIONS = [
  "Restaurant",
  "Private Dining Room",
  "Lobby Lounge",
  "Outdoor Terrace",
  "Other (please specify)",
];

export type CateringServing = {
  id: string;
  catering: CateringId;
  time: string;
  location: string;
  locationOther?: string;
  variant?: string;
  included: boolean;
};

export type MeetingRoomLite = { id: string; name: string; attendees: number };

export const DIETARY_OPTIONS = [
  "Vegetarian",
  "Vegan",
  "Gluten Free",
  "Lactose Free",
  "Halal",
  "Kosher",
  "Nut Allergy",
  "Other",
];

export const DRINK_OPTIONS = [
  "Coffee & Tea",
  "Soft Drinks",
  "Beer",
  "Wine",
  "Private Bar",
  "Welcome Drink",
];
