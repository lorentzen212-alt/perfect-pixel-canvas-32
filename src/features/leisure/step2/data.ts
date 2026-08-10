import roomAccessibleImg from "@/assets/rooms/room-accessible.jpg";
import roomDoubleImg from "@/assets/rooms/room-double.jpg";
import roomFamilyImg from "@/assets/rooms/room-family.jpg";
import roomSingleImg from "@/assets/rooms/room-single.jpg";
import roomTripleImg from "@/assets/rooms/room-triple.jpg";
import roomTwinImg from "@/assets/rooms/room-twin.jpg";
import s2HeroImg from "@/assets/s2-accommodation-hero.jpg";

export const S2_HERO = s2HeroImg;

export const STEP2_ROOMS: {
  key: string;
  title: string;
  desc: string;
  img: string;
}[] = [
  { key: "single", title: "Single Room", desc: "1 person", img: roomSingleImg },
  { key: "triple", title: "Triple Room", desc: "3 people", img: roomTripleImg },
  { key: "twin", title: "Twin Room", desc: "2 separate beds", img: roomTwinImg },
  { key: "family", title: "Family Room", desc: "4+ people", img: roomFamilyImg },
  { key: "double", title: "Double Room", desc: "1 double bed", img: roomDoubleImg },
  { key: "accessible", title: "Accessible Room", desc: "Wheelchair friendly", img: roomAccessibleImg },
];

/* Room categories */
export const ACCESSIBLE_CATEGORY_LABEL = "Available room";

export const ROOM_CATEGORY_OPTIONS: Record<string, string[]> = {
  single: ["Standard", "Superior", "Premium", "Junior Suite", "Suite"],
  double: ["Standard", "Superior", "Premium", "Junior Suite", "Suite"],
  twin: ["Standard", "Superior", "Premium", "Junior Suite", "Suite"],
  triple: ["Superior", "Premium", "Junior Suite", "Suite"],
  family: ["Family Room", "Junior Suite", "Suite"],
};

/* Default selected category per room type (first option, e.g. "Standard") */
export function defaultDraftCategories(): Record<string, string> {
  return {
    ...Object.fromEntries(
      Object.entries(ROOM_CATEGORY_OPTIONS).map(([k, opts]) => [k, opts[0]]),
    ),
    accessible: ACCESSIBLE_CATEGORY_LABEL,
  };
}

/** Sentinel id used when the in-progress draft card asks for removal confirmation. */
export const DRAFT_REMOVE_ID = "__draft__";
