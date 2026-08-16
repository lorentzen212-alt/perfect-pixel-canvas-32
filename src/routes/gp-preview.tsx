import { createFileRoute } from "@tanstack/react-router";
import { GroupPlanView } from "@/features/booking-workspace/group-plan/GroupPlan";
import type { PlanItem } from "@/features/booking-workspace/group-plan/types";

export const Route = createFileRoute("/gp-preview")({
  head: () => ({
    meta: [
      { title: "Group Plan Preview — HotelGroupBook" },
      { name: "description", content: "Temporary visual preview of the Group Plan workspace." },
      { property: "og:title", content: "Group Plan Preview — HotelGroupBook" },
      { property: "og:description", content: "Temporary visual preview of the Group Plan workspace." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: GroupPlanPreview,
});

const MOCK_ITEMS: PlanItem[] = [
  {
    id: "arrival",
    kind: "booking",
    type: "transport",
    date: "2026-08-07",
    time: "14:30",
    title: "Coach transfer to the hotel",
    secondary: "Copenhagen Airport → Hotel d’Angleterre",
  },
  {
    id: "checkin",
    kind: "booking",
    type: "checkin",
    date: "2026-08-07",
    time: "16:00",
    title: "Check-in",
    secondary: "Hotel d’Angleterre · 28 rooms",
  },
  {
    id: "dinner",
    kind: "booking",
    type: "dinner",
    date: "2026-08-07",
    time: "19:30",
    title: "Welcome dinner",
    secondary: "Hotel Restaurant · Three-course menu",
  },
  {
    id: "morning-walk",
    kind: "myplan",
    type: "activity",
    date: "2026-08-08",
    time: "10:00",
    title: "Guided city walk",
    secondary: "Meet in the hotel lobby",
  },
  {
    id: "breakfast",
    kind: "booking",
    type: "breakfast",
    date: "2026-08-08",
    time: "07:00–10:00",
    title: "Breakfast",
    secondary: "Hotel Restaurant · Included in the room rate",
  },
  {
    id: "meeting-point",
    kind: "myplan",
    type: "meeting-point",
    date: "2026-08-08",
    time: "13:15",
    title: "Meet by the harbour",
    secondary: "Nyhavn · Outside the theatre",
  },
  {
    id: "museum-reminder",
    kind: "myplan",
    type: "reminder",
    date: null,
    time: null,
    title: "Confirm museum tickets",
    secondary: "No time set",
  },
  {
    id: "free-evening",
    kind: "myplan",
    type: "free-time",
    date: null,
    time: null,
    title: "Ideas for the free evening",
    secondary: "No time set",
  },
];

function GroupPlanPreview() {
  return (
    <main className="min-h-screen px-5 pb-14 pt-6 sm:px-9" style={{ background: "#FAF6F0" }}>
      <GroupPlanView
        bookingItems={MOCK_ITEMS}
        defaultDate="2026-08-07"
        onRequestChange={() => undefined}
      />
    </main>
  );
}