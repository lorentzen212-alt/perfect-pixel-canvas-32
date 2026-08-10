import { TrustShield, TrustClock, TrustHeadset, TrustLock } from "@/components/TrustIcons";

export const NAV_LINKS = [
  { label: "Home", to: "/" as const },
  { label: "About us", href: "/#about" },
  { label: "How it works", href: "/#how" },
  { label: "Destinations", href: "/#destinations" },
  { label: "Contact", href: "/#contact" },
];

export const TRUST = [
  { Icon: TrustShield, label: "No commitment" },
  { Icon: TrustClock, label: "Fast and free" },
  { Icon: TrustHeadset, label: "Expert support" },
  { Icon: TrustLock, label: "Secure & trusted" },
];

export const STEPS = [
  "Location",
  "Accommodation",
  "Meeting Spaces",
  "Catering",
  "Extras",
  "Event Details",
  "Review & Submit",

];

export const DRAFT_KEY = "hgb:me-draft-v1";
