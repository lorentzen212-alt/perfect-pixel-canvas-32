/* Notes data model.
   The global Notes dashboard has been retired — notes are now attached
   contextually to Group Plan itinerary items. The model and the stored
   notes below are preserved and consumed by the Group Plan. */

export type NoteCategory =
  | "Guest information"
  | "Rooming list"
  | "Special requests"
  | "Dietary"
  | "Hotel communication"
  | "Meetings & Events"
  | "Transport"
  | "Accommodation"
  | "Finance"
  | "Internal notes";

type Priority = "Important" | "Normal" | "Info";

export type Note = {
  id: string;
  title: string;
  preview: string;
  body: string;
  category: NoteCategory;
  priority: Priority;
  author: string;
  updatedLabel: string;
  updatedAt: number;
  pinned: boolean;
  checklist?: { label: string; done: boolean }[];
  attachments?: string[];
  links?: { label: string; href: string }[];
  mentions?: string[];
  dueLabel?: string;
};

const day = 86400000;
const now = Date.now();

const SEED: Note[] = [
  {
    id: "n1",
    title: "VIP guest arriving early on 12 Sep",
    preview: "The group leader, Mr. Erik Nilsen, will arrive early around 10:00.",
    body: "The group leader, Mr. Erik Nilsen, will arrive early around 10:00. Hotel has been asked to hold luggage and prepare an early check-in for room 412 if available.",
    category: "Guest information",
    priority: "Important",
    author: "Emma Hansen",
    updatedLabel: "Today, 11:24",
    updatedAt: now,
    pinned: true,
    checklist: [
      { label: "Confirm early check-in with front desk", done: true },
      { label: "Arrange luggage storage", done: false },
    ],
    mentions: ["@Nicklas"],
    dueLabel: "12 Sep 2026",
  },
  {
    id: "n2",
    title: "Vegetarian meal requested",
    preview: "3 guests are vegetarian and 2 guests have gluten allergy.",
    body: "3 guests are vegetarian and 2 guests have a gluten allergy. Kitchen confirmed alternatives for both dinner services.",
    category: "Dietary",
    priority: "Important",
    author: "Emma Hansen",
    updatedLabel: "Today, 09:15",
    updatedAt: now - 2 * 3600000,
    pinned: false,
    attachments: ["dietary-overview.pdf"],
  },
  {
    id: "n3",
    title: "Meeting room changed to Fjord Hall",
    preview: "U-shape setup for 20 people with projector and flipchart.",
    body: "The 13 Sep session was moved to Fjord Hall. U-shape setup for 20 people with projector and flipchart. Coffee break at 10:30.",
    category: "Meetings & Events",
    priority: "Normal",
    author: "Emma Hansen",
    updatedLabel: "Yesterday, 16:40",
    updatedAt: now - day,
    pinned: false,
  },
  {
    id: "n4",
    title: "Payment reminder — prepayment terms confirmed",
    preview: "Prepayment 29 days prior to arrival.",
    body: "Prepayment of 30% is due 29 days prior to arrival. Finance notified, invoice reference attached.",
    category: "Finance",
    priority: "Normal",
    author: "Emma Hansen",
    updatedLabel: "22 Jul 2026",
    updatedAt: now - 14 * day,
    pinned: false,
    attachments: ["invoice-HGB-00104.pdf"],
  },
  {
    id: "n5",
    title: "Rooming list submitted",
    preview: "Rooming list must be received no later than 10 days before arrival.",
    body: "First version of the rooming list was submitted to the hotel. Remaining 16 guest names must be received no later than 10 days before arrival.",
    category: "Rooming list",
    priority: "Important",
    author: "Emma Hansen",
    updatedLabel: "20 Jul 2026",
    updatedAt: now - 16 * day,
    pinned: true,
    dueLabel: "02 Sep 2026",
  },
  {
    id: "n6",
    title: "Airport transfer booked",
    preview: "Group arrival 12 Sep. 2 buses from Bergen Airport at 11:00.",
    body: "Two buses booked from Bergen Airport at 11:00 on 12 Sep. Driver contact will be shared 24h before arrival.",
    category: "Transport",
    priority: "Normal",
    author: "Emma Hansen",
    updatedLabel: "18 Jul 2026",
    updatedAt: now - 18 * day,
    pinned: false,
  },
  {
    id: "n7",
    title: "Extra twin rooms requested",
    preview: "Requested 4 additional twin rooms for the second night.",
    body: "Requested 4 additional twin rooms for the second night. Awaiting hotel confirmation on availability and rate parity.",
    category: "Special requests",
    priority: "Important",
    author: "Nicklas Lorentzen",
    updatedLabel: "16 Jul 2026",
    updatedAt: now - 20 * day,
    pinned: false,
  },
  {
    id: "n8",
    title: "Hotel approved late check-out",
    preview: "Late check-out until 15:00 approved for all rooms.",
    body: "The hotel approved late check-out until 15:00 for all rooms on departure day at no extra cost.",
    category: "Hotel communication",
    priority: "Info",
    author: "Radisson Blu",
    updatedLabel: "10 Jul 2026",
    updatedAt: now - 26 * day,
    pinned: false,
    links: [{ label: "Confirmation e-mail", href: "#" }],
  },
  {
    id: "n9",
    title: "Allergy information for dinner service",
    preview: "One guest has a severe nut allergy — kitchen informed.",
    body: "One guest has a severe nut allergy. The kitchen has been informed and will prepare a separate plated menu.",
    category: "Dietary",
    priority: "Important",
    author: "Emma Hansen",
    updatedLabel: "08 Jul 2026",
    updatedAt: now - 28 * day,
    pinned: false,
  },
  {
    id: "n10",
    title: "Internal reminder — send final invoice split",
    preview: "Split invoicing between two cost centres before departure.",
    body: "Remember to split invoicing between the two cost centres before departure and forward to accounting.",
    category: "Internal notes",
    priority: "Info",
    author: "Nicklas Lorentzen",
    updatedLabel: "05 Jul 2026",
    updatedAt: now - 31 * day,
    pinned: false,
    mentions: ["@Emma"],
  },
  {
    id: "n11",
    title: "Accommodation upgrade for organiser",
    preview: "Organiser upgraded to a junior suite, complimentary.",
    body: "The organiser was upgraded to a junior suite complimentary as part of the group agreement.",
    category: "Accommodation",
    priority: "Info",
    author: "Radisson Blu",
    updatedLabel: "02 Jul 2026",
    updatedAt: now - 34 * day,
    pinned: false,
  },
  {
    id: "n12",
    title: "Welcome desk in lobby at 11:30",
    preview: "Staffed welcome desk with key envelopes prepared per room.",
    body: "A staffed welcome desk will be set up in the lobby at 11:30 with key envelopes prepared per room.",
    category: "Guest information",
    priority: "Normal",
    author: "Emma Hansen",
    updatedLabel: "30 Jun 2026",
    updatedAt: now - 37 * day,
    pinned: false,
  },
];


export const STORED_NOTES: Note[] = SEED;
