import airportTransferImg from "@/assets/extras/airport-transfer.jpg";
import cloakroomImg from "@/assets/extras/cloakroom.jpg";
import coachParkingImg from "@/assets/extras/coach-parking.jpg";
import packageHandlingImg from "@/assets/extras/package-handling.jpg";
import porterServiceImg from "@/assets/extras/porter-service.jpg";
import registrationDeskImg from "@/assets/extras/registration-desk.jpg";
import welcomePackageImg from "@/assets/extras/welcome-package.jpg";
import React from "react";

export type ExtraId =
  | "airport-transfer"
  | "coach-parking"
  | "registration-desk"
  | "package-handling"
  | "porter-service"
  | "cloakroom"
  | "welcome-package";

export type ExtraDef = {
  id: ExtraId;
  title: string;
  description: string;
  image: string;
  Icon: React.ComponentType<{ size?: number; strokeWidth?: number; style?: React.CSSProperties }>;
};

export const EXTRAS_DEFS: ExtraDef[] = [
  { id: "airport-transfer", title: "Airport Transfer", description: "Private transportation between the airport and the hotel.", image: airportTransferImg, Icon: Plane },
  { id: "coach-parking", title: "Coach Parking", description: "Secure coach parking and logistics on-site.", image: coachParkingImg, Icon: Bus },
  { id: "registration-desk", title: "Registration Desk", description: "Professional registration desk and guest check-in support.", image: registrationDeskImg, Icon: ClipboardCheck },
  { id: "package-handling", title: "Package Handling", description: "Receive, store and manage your event deliveries.", image: packageHandlingImg, Icon: Package },
  { id: "porter-service", title: "Porter Service", description: "Assistance with luggage and equipment on arrival and departure.", image: porterServiceImg, Icon: Luggage },
  { id: "cloakroom", title: "Cloakroom", description: "Secure cloakroom service for your guests during the event.", image: cloakroomImg, Icon: Shirt },
  { id: "welcome-package", title: "Guest Welcome Package", description: "Welcome gifts, personalised amenities or VIP in-room arrangements for your guests.", image: welcomePackageImg, Icon: Gift },
];

export type ExtraConfigs = {
  "airport-transfer": { transferType: string; direction: string };
  "coach-parking": { coaches: number; arrival: string; departure: string; instructions: string };
  "registration-desk": { start: string; end: string; staff: "yes" | "no" | ""; notes: string };
  "package-handling": { storage: string; packages: number; instructions: string };
  "porter-service": { requiredFor: string; guests: number; notes: string };
  "cloakroom": { type: string; guests: number; notes: string };
  "welcome-package": { items: string[]; otherText: string };
};

export const DEFAULT_CONFIGS: ExtraConfigs = {
  "airport-transfer": { transferType: "Private Executive Van", direction: "Both Directions" },
  "coach-parking": { coaches: 2, arrival: "12:00", departure: "18:00", instructions: "" },
  "registration-desk": { start: "08:00", end: "16:00", staff: "", notes: "" },
  "package-handling": { storage: "", packages: 10, instructions: "" },
  "porter-service": { requiredFor: "Both", guests: 80, notes: "" },
  "cloakroom": { type: "Staffed Cloakroom", guests: 80, notes: "" },
  "welcome-package": { items: [], otherText: "" },
};

/* Summary rows shown on the card after Done */
export function summaryFor(id: ExtraId, cfg: ExtraConfigs[ExtraId]): string[] {
  switch (id) {
    case "airport-transfer": {
      const c = cfg as ExtraConfigs["airport-transfer"];
      return [c.transferType, c.direction].filter(Boolean);
    }
    case "coach-parking": {
      const c = cfg as ExtraConfigs["coach-parking"];
      return [`${c.coaches} Coach${c.coaches === 1 ? "" : "es"}`, `${c.arrival} Arrival`];
    }
    case "registration-desk": {
      const c = cfg as ExtraConfigs["registration-desk"];
      return [c.staff === "yes" ? "Staff Required" : c.staff === "no" ? "No Staff" : "Staff", `${c.start}–${c.end}`];
    }
    case "package-handling": {
      const c = cfg as ExtraConfigs["package-handling"];
      return [c.storage || "Storage", `${c.packages} Packages`];
    }
    case "porter-service": {
      const c = cfg as ExtraConfigs["porter-service"];
      const label = c.requiredFor === "Both" ? "Arrival & Departure" : c.requiredFor;
      return [label, `${c.guests} Guests`];
    }
    case "cloakroom": {
      const c = cfg as ExtraConfigs["cloakroom"];
      return [c.type, `${c.guests} Guests`];
    }
    case "welcome-package": {
      const c = cfg as ExtraConfigs["welcome-package"];
      const items = c.items.slice(0, 2);
      return items.length ? items : ["Not configured"];
    }
  }
}
