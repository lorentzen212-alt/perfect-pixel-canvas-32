import { createFileRoute } from "@tanstack/react-router";
import { GroupPlanView } from "@/features/booking-workspace/group-plan/GroupPlan";
import type { PlanItem } from "@/features/booking-workspace/group-plan/types";

export const Route = createFileRoute("/gp-preview")({
  component: PreviewPage,
});

const mockItems: PlanItem[] = [
  {
    id: "b-transfer-in",
    kind: "booking",
    type: "transport",
    date: "2026-08-07",
    time: "11:00",
    title: "Airport transfer to the hotel",
    secondary: "Bergen airport · 45 passengers",
    summary: "Bergen airport · 45 passengers",
    location: "Bergen",
  },
  {
    id: "b-checkin",
    kind: "booking",
    type: "checkin",
    date: "2026-08-07",
    time: "15:00",
    title: "Hotel check-in",
    secondary: "Hotel Norge by Scandic · 20 rooms",
    summary: "Hotel Norge by Scandic · 20 rooms",
    tiles: [
      { label: "Rooms", value: "20 rooms", icon: "bed" },
      { label: "Guests", value: "45 guests", icon: "guests" },
      { label: "Nights", value: "3 nights", icon: "clock" },
    ],
    facts: [
      { label: "Hotel", value: "Hotel Norge by Scandic" },
      { label: "Destination", value: "Bergen" },
    ],
  },
  {
    id: "b-dinner",
    kind: "booking",
    type: "dinner",
    date: "2026-08-07",
    time: "19:00",
    title: "Welcome group dinner",
    secondary: "Hotel Restaurant · Chef's Choice",
    summary: "Hotel Restaurant · Chef's Choice",
    tiles: [
      { label: "Venue", value: "Hotel Restaurant", icon: "dining" },
      { label: "Guests", value: "45 guests", icon: "guests" },
    ],
    included: ["3-course menu", "Welcome drink", "Reserved seating"],
  },
  {
    id: "b-meeting",
    kind: "booking",
    type: "meeting",
    date: "2026-08-08",
    time: "09:00",
    title: "Morning meeting",
    secondary: "Fjord Suite · 40 participants",
    summary: "Fjord Suite · 40 participants",
    tiles: [
      { label: "Room", value: "Fjord Suite", icon: "room" },
      { label: "Setup", value: "Theatre", icon: "setup" },
      { label: "Equipment", value: "Screen & mic", icon: "equipment" },
    ],
  },
  {
    id: "b-lunch",
    kind: "booking",
    type: "lunch",
    date: "2026-08-08",
    time: "12:30",
    title: "Group lunch",
    secondary: "Hotel Restaurant · Buffet",
    summary: "Hotel Restaurant · Buffet",
  },
  {
    id: "b-activity",
    kind: "booking",
    type: "activity",
    date: "2026-08-08",
    time: "14:00",
    title: "Guided fjord cruise",
    secondary: "Bergen harbour · 2.5 hours",
    summary: "Bergen harbour · 2.5 hours",
  },
  {
    id: "b-checkout",
    kind: "booking",
    type: "checkout",
    date: "2026-08-09",
    time: "11:00",
    title: "Hotel check-out",
    secondary: "Late check-out for 5 rooms",
    summary: "Late check-out for 5 rooms",
  },
];

function PreviewPage() {
  return (
    <div className="min-h-screen p-6" style={{ background: "#FAF6F0" }}>
      <GroupPlanView
        bookingItems={mockItems}
        defaultDate="2026-08-07"
        onRequestChange={() => {}}
      />
    </div>
  );
}
