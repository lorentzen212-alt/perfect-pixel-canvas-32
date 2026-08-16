import { createFileRoute } from "@tanstack/react-router";
import { GroupPlanView } from "@/features/booking-workspace/group-plan/GroupPlan";
import type { PlanItem } from "@/features/booking-workspace/group-plan/types";

export const Route = createFileRoute("/gp-preview")({
  component: GpPreview,
});

const mock: PlanItem[] = [
  { id: "1", kind: "booking", type: "transport", date: "2026-08-07", time: "14:30", title: "Group arrival", secondary: "Bergen Airport (BGO)" },
  { id: "2", kind: "booking", type: "transport", date: "2026-08-07", time: "15:30", title: "Coach transfer", secondary: "Airport → Hotel" },
  { id: "3", kind: "booking", type: "checkin", date: "2026-08-07", time: "16:00", title: "Check-in", secondary: "Hotel Bergen Group Stay" },
  { id: "4", kind: "booking", type: "dinner", date: "2026-08-07", time: "18:30", title: "Dinner", secondary: "Hotel Restaurant" },
  { id: "5", kind: "myplan", type: "free-time", date: "2026-08-07", time: "20:00", title: "Evening at leisure", secondary: "Enjoy your stay" },
  { id: "6", kind: "booking", type: "breakfast", date: "2026-08-08", time: "07:00", title: "Breakfast", secondary: "Hotel Restaurant" },
  { id: "7", kind: "myplan", type: "activity", date: "2026-08-08", time: "10:00", title: "Guided city tour", secondary: "Meet in hotel lobby" },
  { id: "8", kind: "myplan", type: "lunch", date: "2026-08-08", time: "13:30", title: "Lunch", secondary: "Bryggen" },
  { id: "9", kind: "myplan", type: "meeting-point", date: "2026-08-08", time: "17:45", title: "Meet in reception", secondary: "For coach departure" },
  { id: "10", kind: "booking", type: "transport", date: "2026-08-08", time: "18:00", title: "Coach departure", secondary: "Hotel → Bergen Airport" },
  { id: "11", kind: "myplan", type: "activity", date: null, time: null, title: "Guided Bergen tour" },
  { id: "12", kind: "myplan", type: "dinner", date: null, time: null, title: "Group photo" },
];

function GpPreview() {
  return (
    <div style={{ background: "#FAF6F0", minHeight: "100vh" }} className="p-8">
      <GroupPlanView bookingItems={mock} defaultDate="2026-08-07" onRequestChange={() => {}} />
    </div>
  );
}
