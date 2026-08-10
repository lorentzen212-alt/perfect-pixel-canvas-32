import type React from "react";
import { Utensils, Mountain } from "lucide-react";

export type CountryCode = "NO" | "SE" | "DK" | "FI";

export type ExtraGroup = { title: string; items: { label: string; Icon: typeof Utensils }[] };

export type ExpItem = { label: string; category: string; Icon: typeof Mountain };

export type StepKey = 1 | 2 | 3 | 4 | 5 | 6;

export type Destination = {
  id: string;
  name: string;
  country: CountryCode;
  countryName: string;
  image: string;
  alt: string;
};

export type LeisureStay = {
  id: string;
  arrival: string; // ISO yyyy-MM-dd
  departure: string;
  rooms: Record<string, number>;
  roomCategories?: Record<string, string>;
};

export type ConciergeOption = {
  label: string;
  displayLabel?: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; style?: React.CSSProperties }>;
};

export type ConciergeCategory = {
  key: string;
  title: string;
  description: string;
  img: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; style?: React.CSSProperties }>;
  configTitle: string;
  configPrompt: string;
  options: ConciergeOption[];
};

export type Step3Context = {
  city: string;
  arrival?: Date;
  departure?: Date;
  stays: LeisureStay[];
};

export type Step4Exp = { label: string; category: string; img: string };
