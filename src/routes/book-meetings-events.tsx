import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { hasProfileDetails, upsertProfile, useAuth } from "@/lib/auth";
import { createBooking, nightsBetween, type NewBookingInput } from "@/lib/bookingsApi";
import { savePendingRequest, clearPendingRequest } from "@/lib/pendingRequest";
import React from "react";
import { useState, useEffect, useMemo, useRef } from "react";
import {
  Menu,
  X,
  ShieldCheck,
  Clock,
  Headphones,
  Lock,
  Calendar as CalendarIcon,
  Phone,
  Mail,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Users,
  Building2,
  Waves,
  Plane,
  Palmtree,
  Landmark,
  Globe,
  Check,
  Minus,
  Plus,
  Pencil,
  Trash2,
  Coffee,
  BedDouble,
  Bed,
  User,
  UsersRound,
  Sparkles,
  Utensils,
  UtensilsCrossed,
  Croissant,
  Apple,
  Nut,
  CakeSlice,
  Wine,
  GlassWater,
  MapPin,
  Info,
  ChefHat,
  ChevronLeft,
  ChevronRight,
  Bus,
  ClipboardCheck,
  Package,
  Luggage,
  Shirt,
  Gift,
  Star,
  Gem,
} from "lucide-react";
import airportTransferImg from "@/assets/extras/airport-transfer.jpg";
import coachParkingImg from "@/assets/extras/coach-parking.jpg";
import registrationDeskImg from "@/assets/extras/registration-desk.jpg";
import packageHandlingImg from "@/assets/extras/package-handling.jpg";
import porterServiceImg from "@/assets/extras/porter-service.jpg";
import cloakroomImg from "@/assets/extras/cloakroom.jpg";
import welcomePackageImg from "@/assets/extras/welcome-package.jpg";
import accommodationBannerImg from "@/assets/rooms/accommodation-banner.jpg";
import singleRoomImg from "@/assets/rooms/single.jpg";
import doubleRoomImg from "@/assets/rooms/double.jpg";
import twinRoomImg from "@/assets/rooms/twin.jpg";
import tripleRoomImg from "@/assets/rooms/triple.jpg";
import roomOnlyImg from "@/assets/rooms/room-only.jpg";
import breakfastImg from "@/assets/rooms/breakfast.jpg";
import { cn } from "@/lib/utils";
import { TrustShield, TrustClock, TrustHeadset, TrustLock } from "@/components/TrustIcons";
import { StepThreeMeetingSpaces } from "@/components/StepThreeMeetingSpaces";
import {
  useMeDraft,
  setMeSection,
  type MeAccommodationStay,
  type MeMeetingSpace,
} from "@/lib/meDraftStore";
import { BrandLogo } from "@/components/BrandLogo";
import heroAsset from "@/assets/me-hero-conference.png.asset.json";
const heroImg = heroAsset.url;
import loungeImg from "@/assets/luxury-lounge.jpg";
void loungeImg;

import osloImg from "@/assets/destinations/oslo.jpg";
import bergenImg from "@/assets/destinations/bergen.jpg";
import tromsoImg from "@/assets/destinations/tromso.jpg";
import stavangerImg from "@/assets/destinations/stavanger.jpg";
import trondheimImg from "@/assets/destinations/trondheim.jpg";
import bodoImg from "@/assets/destinations/bodo.jpg";
import lofotenImg from "@/assets/destinations/lofoten.jpg";
import stockholmImg from "@/assets/destinations/stockholm.jpg";
import gothenburgImg from "@/assets/destinations/gothenburg.jpg";
import malmoImg from "@/assets/destinations/malmo.jpg";
import uppsalaImg from "@/assets/destinations/uppsala.jpg";
import kirunaImg from "@/assets/destinations/kiruna.jpg";
import visbyImg from "@/assets/destinations/visby.jpg";
import areImg from "@/assets/destinations/are.jpg";
import copenhagenImg from "@/assets/destinations/copenhagen.jpg";
import aarhusImg from "@/assets/destinations/aarhus.jpg";
import odenseImg from "@/assets/destinations/odense.jpg";
import aalborgImg from "@/assets/destinations/aalborg.jpg";
import roskildeImg from "@/assets/destinations/roskilde.jpg";
import skagenImg from "@/assets/destinations/skagen.jpg";
import billundImg from "@/assets/destinations/billund.jpg";
import helsinkiImg from "@/assets/destinations/helsinki.jpg";
import tampereImg from "@/assets/destinations/tampere.jpg";
import turkuImg from "@/assets/destinations/turku.jpg";
import rovaniemiImg from "@/assets/destinations/rovaniemi.jpg";
import ouluImg from "@/assets/destinations/oulu.jpg";
import porvooImg from "@/assets/destinations/porvoo.jpg";
import leviImg from "@/assets/destinations/levi.jpg";

import coffeeCateringImg from "@/assets/catering/coffee.jpg";
import fruitCateringImg from "@/assets/catering/fruit.jpg";
import snacksCateringImg from "@/assets/catering/snacks.jpg";
import morningBreakImg from "@/assets/catering/morning-break.jpg";
import lunchCateringImg from "@/assets/catering/lunch.jpg";
import afternoonBreakImg from "@/assets/catering/afternoon-break.jpg";
import dinnerCateringImg from "@/assets/catering/dinner.jpg";
import barDrinksImg from "@/assets/catering/bar-drinks.jpg";
import galaDinnerImg from "@/assets/catering/gala-dinner.jpg";


export const Route = createFileRoute("/book-meetings-events")({
  component: BookMeetingsEvents,
  head: () => ({
    meta: [
      { title: "Book Meetings & Events — HotelGroupBook" },
      {
        name: "description",
        content:
          "Request offers for meetings, conferences and events. Our M&E specialists find the best hotels and handle all communication for you.",
      },
      { property: "og:title", content: "Book Meetings & Events — HotelGroupBook" },
      {
        property: "og:description",
        content: "Premium group hotel booking for meetings, conferences and events.",
      },
    ],
  }),
});

import { SERIF, SANS, GOLD, NAVY, NAVY_DEEP } from "@/features/me/tokens";
import { NAV_LINKS, TRUST, STEPS, DRAFT_KEY } from "@/features/me/data";
import type { FormState } from "@/features/me/types";
import { NextButton, ContinueButton } from "@/features/me/common/buttons";
import { GoldStarDivider, PremiumDivider, GoldDivider } from "@/features/me/common/dividers";
import { HelpCard } from "@/features/me/shell/HelpCard";
import { StepFiveExtras } from "@/features/me/step5/StepFiveExtras";
import { VellumSwitcher } from "@/features/me/shell/VellumSwitcher";
import { StepProgress } from "@/features/me/shell/StepProgress";
import { Field } from "@/features/me/common/Field";
import { StepPlaceholder } from "@/features/me/common/StepPlaceholder";
import { StepOne, AccountPrefillPanel } from "@/features/me/step1/StepOne";
import { StepTwoLocation } from "@/features/me/step2/StepTwoLocation";
import { StepThreeAccommodation } from "@/features/me/step3/StepThreeAccommodation";
import { StepFourCatering } from "@/features/me/step4/StepFourCatering";
import { StepSevenReview } from "@/features/me/step7/StepSevenReview";


function BookMeetingsEvents() {
  // Same global session the rest of the app uses.
  const { isAuthenticated, user, profile } = useAuth();
  const accountLabel =
    [profile?.first_name, profile?.last_name].filter(Boolean).join(" ").trim() ||
    profile?.email ||
    user?.email ||
    "My account";
  const [hydrated, setHydrated] = useState(false);
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [form, setForm] = useState<FormState>({
    eventName: "",
    company: "",
    contactPerson: "",
    email: "",
    phone: "",
    countryCode: "+47",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [visited, setVisited] = useState<Set<number>>(() => new Set([1]));

  // ── Vellum material variants (design preview) ─────────────────────────────
  // A: Pure Vellum · B: Scandinavian depth · C: Hotel lobby light
  // D: Restrained marine · E: Signature   · "current": existing atmosphere
  type VellumVariant = "A" | "B" | "C" | "D" | "E" | "current";
  const [vellum, setVellum] = useState<VellumVariant>("A");
  useEffect(() => {
    try {
      const v = window.localStorage.getItem("hgb:vellum-variant");
      if (v && ["A", "B", "C", "D", "E", "current"].includes(v)) {
        setVellum(v as VellumVariant);
      }
    } catch {}
  }, []);
  useEffect(() => {
    try {
      window.localStorage.setItem("hgb:vellum-variant", vellum);
    } catch {}
  }, [vellum]);

  // Restore draft on mount
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const d = JSON.parse(raw);
        if (typeof d.step === "number") setStep(d.step);
        if (d.form) setForm((f) => ({ ...f, ...d.form }));
        if (Array.isArray(d.visited)) {
          setVisited(new Set<number>(d.visited));
        } else if (typeof d.step === "number") {
          const s = new Set<number>();
          for (let i = 1; i <= d.step; i++) s.add(i);
          setVisited(s);
        }
      }
    } catch {}
    setHydrated(true);
  }, []);

  // Persist draft on change
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({ step, form, visited: Array.from(visited) }),
      );
    } catch {}
  }, [hydrated, step, form, visited]);

  // Commit event details / contact info from Step 6 (StepOne) into the shared draft.
  useEffect(() => {
    if (!hydrated) return;
    setMeSection("eventDetails", {
      eventName: form.eventName.trim() || undefined,
      company: form.company.trim() || undefined,
      contactPerson: form.contactPerson.trim() || undefined,
      email: form.email.trim() || undefined,
      phone: form.phone.trim() || undefined,
      countryCode: form.countryCode || undefined,
    });
  }, [hydrated, form]);

  const go = (n: number) => {
    setDirection(n > step ? "forward" : "back");
    setVisited((prev) => {
      if (prev.has(n)) return prev;
      const next = new Set(prev);
      next.add(n);
      return next;
    });
    setStep(n);
  };

  const validateStep1 = () => {
    const e: Record<string, string> = {};
    if (!form.eventName.trim()) e.eventName = "Required";
    if (!form.company.trim()) e.company = "Required";
    if (!form.contactPerson.trim()) e.contactPerson = "Required";
    if (!form.email.trim()) e.email = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      e.email = "Invalid email";
    if (!form.phone.trim()) e.phone = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (step === 6 && !validateStep1()) return;
    if (step < STEPS.length) go(step + 1);
  };



  // Two subtle surface textures — very fine grain (fine paper) + a broader mottling (polished
  // plaster / limestone). Both blend as soft-light so they never read as pattern.
  // Very muted textures — enough to give the surface material, never enough to shimmer while scrolling.
  const paperGrain =
    "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.34  0 0 0 0 0.28  0 0 0 0 0.20  0 0 0 0.045 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")";
  const plasterTexture =
    "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='820' height='820'><filter id='p'><feTurbulence type='fractalNoise' baseFrequency='0.009' numOctaves='2' seed='11' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.28  0 0 0 0 0.23  0 0 0 0 0.17  0 0 0 0.08 0'/></filter><rect width='100%25' height='100%25' filter='url(%23p)'/></svg>\")";

  return (
    <main
      className="relative min-h-screen w-full"
      style={(() => {
        if (step === 7) {
          return { backgroundColor: "#EDE7DC" } as const;
        }

        // ── Vellum variants ────────────────────────────────────────────────
        // Each variant is a small, disciplined stack of light layers over a
        // warm off-white base. No motion, no imagery, no pattern.
        type Recipe = {
          color: string;
          layers: string[];   // painted top → bottom
          blends: string[];   // one per layer
          sizes?: string[];   // optional per-layer size
        };

        // Micro-grain (paper) — sub-perceptual, prevents banding only.
        const grain =
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.34  0 0 0 0 0.28  0 0 0 0 0.20  0 0 0 0.035 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")";

        const recipes: Record<Exclude<VellumVariant, "current">, Recipe> = {
          // A · Pure Vellum — near-flat warm off-white, one whisper of daylight,
          // one whisper of edge containment. As invisible as it can be.
          A: {
            color: "#F0EADC",
            layers: [
              grain,
              "radial-gradient(1700px 1150px at 16% 4%, rgba(255,249,232,0.16) 0%, rgba(255,249,232,0) 60%)",
              "radial-gradient(1900px 1300px at 50% 55%, rgba(244,238,224,0) 62%, rgba(90,80,64,0.09) 100%)",
              "linear-gradient(178deg, #F1EBDE 0%, #EDE6D4 100%)",
            ],
            blends: ["soft-light", "normal", "normal", "normal"],
            sizes: ["300px 300px", "auto", "auto", "auto"],
          },

          // B · Vellum + Scandinavian depth — same skin, but two structural
          // shadows suggest a tall room with volume; a hairline horizon
          // reads as where a wall meets the floor.
          B: {
            color: "#EFE9DA",
            layers: [
              grain,
              "radial-gradient(1500px 1000px at 12% 6%, rgba(255,248,230,0.15) 0%, rgba(255,248,230,0) 60%)",
              "radial-gradient(1400px 1000px at 100% 100%, rgba(60,72,86,0.10) 0%, rgba(60,72,86,0) 62%)",
              "radial-gradient(1100px 820px at 6% 96%, rgba(232,206,164,0.09) 0%, rgba(232,206,164,0) 66%)",
              "linear-gradient(180deg, transparent 0%, transparent 62%, rgba(80,70,54,0.05) 62.4%, transparent 63%, transparent 100%)",
              "radial-gradient(1900px 1300px at 50% 55%, rgba(244,238,224,0) 60%, rgba(80,72,58,0.11) 100%)",
              "linear-gradient(180deg, #F1EBDD 0%, #ECE4D2 100%)",
            ],
            blends: ["soft-light", "normal", "multiply", "normal", "multiply", "normal", "normal"],
            sizes: ["300px 300px", "auto", "auto", "auto", "auto", "auto", "auto"],
          },

          // C · Vellum + hotel lobby lighting — two soft sconces above,
          // one warm floor-bounce below. Warmer overall temperature.
          C: {
            color: "#F1EAD8",
            layers: [
              grain,
              "radial-gradient(900px 700px at 18% 8%, rgba(248,224,180,0.14) 0%, rgba(248,224,180,0) 66%)",
              "radial-gradient(900px 700px at 84% 10%, rgba(248,224,180,0.12) 0%, rgba(248,224,180,0) 66%)",
              "radial-gradient(1600px 520px at 50% 108%, rgba(226,196,148,0.14) 0%, rgba(226,196,148,0) 72%)",
              "radial-gradient(1900px 1300px at 50% 52%, rgba(244,238,224,0) 62%, rgba(92,74,50,0.11) 100%)",
              "linear-gradient(180deg, #F3ECDA 0%, #EFE6D0 100%)",
            ],
            blends: ["soft-light", "normal", "normal", "normal", "normal", "normal"],
            sizes: ["300px 300px", "auto", "auto", "auto", "auto", "auto"],
          },

          // D · Vellum + restrained marine depth — Vellum stays dominant.
          // The room's containment turns cool marine, as if the space
          // overlooks water in overcast light.
          D: {
            color: "#EDE8DB",
            layers: [
              grain,
              "radial-gradient(1500px 1000px at 14% 6%, rgba(255,248,232,0.14) 0%, rgba(255,248,232,0) 60%)",
              "radial-gradient(1300px 900px at 94% 8%, rgba(178,196,212,0.10) 0%, rgba(178,196,212,0) 64%)",
              "radial-gradient(900px 720px at 88% 94%, rgba(216,190,150,0.06) 0%, rgba(216,190,150,0) 70%)",
              "radial-gradient(1950px 1350px at 50% 54%, rgba(244,240,228,0) 55%, rgba(28,52,72,0.12) 100%)",
              "linear-gradient(178deg, #F0EADB 0%, #EAE3D1 100%)",
            ],
            blends: ["soft-light", "normal", "normal", "normal", "normal", "normal"],
            sizes: ["300px 300px", "auto", "auto", "auto", "auto", "auto"],
          },

          // E · Signature Vellum — the foundation, refined with almost
          // imperceptible architectural depth. Nothing decorative: only the
          // behaviour of light suggesting a real room around the interface.
          //   1. broad directional daylight from the upper-left (window)
          //   2. faint far-wall recession — a horizontal tonal seam ~58% down
          //      that hints at the meeting of a distant wall and floor
          //   3. cool containment along the left and right edges — the room
          //      quietly closes around the page instead of dissolving
          //   4. warm reserve pooling low-right — daylight bouncing back off
          //      an unseen surface, giving the space an interior temperature
          //   5. gentle overall vignette so the centre reads as inhabited
          //   6. base Vellum with a whisper more vertical fall-off
          E: {
            color: "#F0EADB",
            layers: [
              grain,
              // 1 · directional daylight, broader and softer
              "radial-gradient(1900px 1250px at 12% 2%, rgba(255,248,230,0.22) 0%, rgba(255,248,230,0.05) 45%, rgba(255,248,230,0) 66%)",
              // 2 · far-wall recession — extremely faint horizontal seam
              "linear-gradient(180deg, rgba(0,0,0,0) 54%, rgba(60,54,44,0.05) 58%, rgba(0,0,0,0) 63%)",
              // 3a · left edge containment (cool, very subtle)
              "linear-gradient(90deg, rgba(46,54,64,0.07) 0%, rgba(46,54,64,0) 12%)",
              // 3b · right edge containment
              "linear-gradient(270deg, rgba(46,54,64,0.06) 0%, rgba(46,54,64,0) 12%)",
              // 4 · warm reserve — daylight bouncing back from below-right
              "radial-gradient(1100px 820px at 86% 94%, rgba(226,198,154,0.09) 0%, rgba(226,198,154,0) 70%)",
              // 5 · inhabited-centre vignette
              "radial-gradient(2100px 1400px at 50% 50%, rgba(244,238,224,0) 60%, rgba(42,46,52,0.13) 100%)",
              // 6 · base with a whisper deeper vertical fall-off
              "linear-gradient(176deg, #F3EDDF 0%, #EEE6D4 62%, #E9E1CE 100%)",
            ],
            blends: ["soft-light", "normal", "multiply", "multiply", "multiply", "normal", "normal", "normal"],
            sizes: ["300px 300px", "auto", "auto", "auto", "auto", "auto", "auto", "auto"],
          },
        };

        if (vellum !== "current") {
          const r = recipes[vellum];
          return {
            backgroundColor: r.color,
            backgroundImage: r.layers.join(", "),
            backgroundBlendMode: r.blends.join(", "),
            backgroundSize: (r.sizes ?? r.layers.map(() => "auto")).join(", "),
            backgroundRepeat: r.layers.map((_, i) => (i === 0 ? "repeat" : "no-repeat")).join(", "),
            backgroundAttachment: "scroll",
          } as const;
        }

        // "current" — keep the existing per-step atmospheric recipe for comparison.
        type V = { sweep: string; warm: string; shadow: string; accent: string; vignette: string; base: string; };
        const variants: Record<number, V> = {
          1: { sweep: "linear-gradient(118deg, rgba(255,251,238,0.28) 0%, rgba(255,251,238,0.06) 32%, rgba(255,251,238,0) 58%)", warm: "radial-gradient(1200px 720px at 18% 8%, rgba(240,214,168,0.16) 0%, rgba(240,214,168,0) 62%)", shadow: "radial-gradient(1400px 900px at 100% 100%, rgba(120,108,88,0.18) 0%, rgba(150,138,116,0.08) 40%, rgba(150,138,116,0) 70%)", accent: "radial-gradient(600px 520px at 92% 30%, rgba(226,204,164,0.08) 0%, rgba(226,204,164,0) 68%)", vignette: "radial-gradient(1500px 1050px at 50% 46%, rgba(244,241,234,0) 55%, rgba(110,98,78,0.12) 100%)", base: "linear-gradient(160deg, #F2EEE5 0%, #ECE5D8 55%, #E1D8C6 100%)" },
          2: { sweep: "linear-gradient(180deg, rgba(255,250,238,0.22) 0%, rgba(255,250,238,0.05) 24%, rgba(255,250,238,0) 48%)", warm: "radial-gradient(900px 700px at 6% 96%, rgba(232,196,140,0.16) 0%, rgba(232,196,140,0) 62%)", shadow: "radial-gradient(1200px 820px at 100% 4%, rgba(126,116,96,0.15) 0%, rgba(146,134,112,0) 65%)", accent: "radial-gradient(700px 600px at 88% 78%, rgba(200,188,166,0.11) 0%, rgba(200,188,166,0) 65%)", vignette: "radial-gradient(1500px 1050px at 48% 44%, rgba(244,241,234,0) 55%, rgba(104,92,72,0.13) 100%)", base: "linear-gradient(190deg, #F3EFE7 0%, #EBE5D8 55%, #DFD5C1 100%)" },
          3: { sweep: "linear-gradient(96deg, rgba(255,250,236,0.18) 0%, rgba(255,250,236,0) 30%, rgba(255,250,236,0) 70%, rgba(255,250,236,0.18) 100%)", warm: "radial-gradient(820px 620px at 50% 20%, rgba(238,214,170,0.11) 0%, rgba(238,214,170,0) 65%)", shadow: "radial-gradient(1300px 700px at 50% 110%, rgba(120,110,90,0.18) 0%, rgba(150,138,116,0.06) 45%, rgba(150,138,116,0) 70%)", accent: "radial-gradient(520px 520px at 6% 92%, rgba(190,180,160,0.12) 0%, rgba(190,180,160,0) 68%)", vignette: "radial-gradient(1600px 1080px at 50% 48%, rgba(244,241,234,0) 55%, rgba(108,96,76,0.12) 100%)", base: "linear-gradient(180deg, #F3EFE7 0%, #ECE6D9 56%, #E1D7C3 100%)" },
          4: { sweep: "linear-gradient(232deg, rgba(255,244,220,0.26) 0%, rgba(255,244,220,0.06) 34%, rgba(255,244,220,0) 60%)", warm: "radial-gradient(1100px 780px at 96% 6%, rgba(232,198,140,0.18) 0%, rgba(232,198,140,0) 62%)", shadow: "radial-gradient(1200px 820px at 0% 100%, rgba(112,100,80,0.17) 0%, rgba(146,132,108,0) 65%)", accent: "radial-gradient(600px 520px at 24% 34%, rgba(255,246,222,0.12) 0%, rgba(255,246,222,0) 68%)", vignette: "radial-gradient(1500px 1050px at 52% 46%, rgba(244,240,232,0) 55%, rgba(102,88,66,0.13) 100%)", base: "linear-gradient(196deg, #F2EEE4 0%, #EBE3D3 55%, #DDD2BA 100%)" },
          5: { sweep: "linear-gradient(258deg, rgba(255,252,242,0.28) 0%, rgba(255,252,242,0.06) 32%, rgba(255,252,242,0) 58%)", warm: "radial-gradient(900px 720px at 92% 40%, rgba(238,218,178,0.12) 0%, rgba(238,218,178,0) 65%)", shadow: "radial-gradient(1200px 900px at 0% 60%, rgba(118,108,90,0.16) 0%, rgba(146,134,114,0) 65%)", accent: "radial-gradient(700px 600px at 46% 96%, rgba(200,188,166,0.11) 0%, rgba(200,188,166,0) 65%)", vignette: "radial-gradient(1600px 1050px at 52% 46%, rgba(244,241,234,0) 55%, rgba(104,94,74,0.12) 100%)", base: "linear-gradient(200deg, #F3EFE7 0%, #ECE6D8 55%, #E0D6C2 100%)" },
          6: { sweep: "linear-gradient(6deg, rgba(255,242,214,0.22) 0%, rgba(255,242,214,0.05) 30%, rgba(255,242,214,0) 58%)", warm: "radial-gradient(1300px 620px at 50% 108%, rgba(230,194,138,0.17) 0%, rgba(230,194,138,0) 62%)", shadow: "radial-gradient(1400px 620px at 50% -8%, rgba(118,108,90,0.14) 0%, rgba(146,136,116,0) 62%)", accent: "radial-gradient(680px 560px at 8% 46%, rgba(200,190,170,0.11) 0%, rgba(200,190,170,0) 68%)", vignette: "radial-gradient(1600px 1050px at 50% 48%, rgba(244,240,232,0) 55%, rgba(102,90,70,0.13) 100%)", base: "linear-gradient(190deg, #F2EEE4 0%, #EBE4D5 55%, #DED3BD 100%)" },
        };
        const v = variants[step] ?? variants[1];
        return {
          backgroundColor: "#EDE7DC",
          backgroundImage: [grain, plasterTexture, v.sweep, v.warm, v.shadow, v.accent, v.vignette, v.base].join(", "),
          backgroundBlendMode: "soft-light, soft-light, normal, normal, multiply, normal, normal, normal",
          backgroundSize: "300px 300px, 820px 820px, auto, auto, auto, auto, auto, auto",
          backgroundAttachment: "scroll",
          backgroundRepeat: "repeat, repeat, no-repeat, no-repeat, no-repeat, no-repeat, no-repeat, no-repeat",
        } as const;
      })()}
    >
      <VellumSwitcher value={vellum} onChange={setVellum} />
      {/* HERO */}
      <section
        className="relative w-full min-h-[650px] lg:h-[650px]"
        style={{
          backgroundColor: NAVY_DEEP,
          backgroundImage: `url(${heroImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* TOP: soft dark gradient only behind the navigation */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-10 h-[110px]"
          style={{
            background:
              "linear-gradient(180deg, rgba(10,20,35,0.38) 0%, rgba(10,20,35,0.16) 55%, rgba(10,20,35,0) 100%)",
          }}
        />
        {/* LEFT: soft white/champagne wash behind headline */}
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-[60%]"
          style={{
            background:
              "linear-gradient(90deg, rgba(255,250,240,0.74) 0%, rgba(255,250,240,0.42) 35%, rgba(255,250,240,0.14) 70%, rgba(255,250,240,0) 100%)",
          }}
        />
        {/* BOTTOM: darker gradient behind progress navigation */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[200px]"
          style={{
            background:
              "linear-gradient(180deg, rgba(6,14,26,0) 0%, rgba(6,14,26,0.38) 45%, rgba(6,14,26,0.82) 100%)",
          }}
        />
        {/* BOTTOM-RIGHT: slightly darker corner vignette */}
        <div
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            background:
              "radial-gradient(ellipse at 100% 100%, rgba(6,14,26,0.35) 0%, rgba(6,14,26,0) 45%)",
          }}
        />


        <div className="relative z-20 flex flex-col lg:h-[650px] min-h-[650px]">

          {/* HEADER */}
          <header className="flex h-[88px] items-center justify-between px-5 sm:px-8 lg:px-[50px] xl:px-[60px]">
            <Link to="/" aria-label="HotelGroupBook" className="flex items-center">
              <BrandLogo size="lg" tone="light" />
            </Link>


            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="lg:hidden text-[#0A1B2C] p-2"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={28} /> : <Menu size={28} />}
            </button>

            <nav className="hidden lg:flex items-center gap-9">
              {NAV_LINKS.map((l) =>
                "to" in l ? (
                  <Link
                    key={l.label}
                    to={l.to as string}
                    className="text-[17px] font-medium transition-colors hover:text-[#F2D477]"
                    style={{ color: "#F5F5F0", textShadow: "0 1px 2px rgba(0,0,0,0.35)" }}
                  >
                    {l.label}
                  </Link>
                ) : (
                  <a
                    key={l.label}
                    href={l.href}
                    className="text-[17px] font-medium transition-colors hover:text-[#F2D477]"
                    style={{ color: "#F5F5F0", textShadow: "0 1px 2px rgba(0,0,0,0.35)" }}
                  >
                    {l.label}
                  </a>
                ),
              )}
              <Link
                to="/manage-bookings"
                className="inline-flex items-center gap-[13px] rounded-[8px] px-[18px] h-[51px] text-[16px] font-medium transition-all duration-200 ease-out hover:brightness-[1.08] active:brightness-95"
                style={{
                  color: "#E8C46A",
                  background:
                    "linear-gradient(135deg, #1A1A1A 0%, #0E0E10 55%, #050505 100%)",
                  border: "1px solid",
                  borderImage:
                    "linear-gradient(135deg, #F2D477 0%, #D4AF37 45%, #8F6818 100%) 1",
                  borderImageSlice: 1,
                  boxShadow:
                    "inset 0 1px 0 rgba(242,212,119,0.28), inset 0 -1px 0 rgba(143,104,24,0.35), 0 4px 14px rgba(0,0,0,0.35), 0 0 18px rgba(212,175,55,0.14)",
                }}
              >
                <CalendarIcon size={19} strokeWidth={2} style={{ color: "#E8C46A" }} />
                Manage Bookings
              </Link>
              {isAuthenticated ? (
                <Link
                  to="/account"
                  className="max-w-[220px] truncate text-[15px] font-medium transition-colors hover:text-[#F2D477]"
                  style={{ color: "#F5F5F0", textShadow: "0 1px 2px rgba(0,0,0,0.35)" }}
                >
                  {accountLabel}
                </Link>
              ) : (
                <Link
                  to="/auth"
                  className="text-[15px] font-medium transition-colors hover:text-[#F2D477]"
                  style={{ color: "#E8C46A", textShadow: "0 1px 2px rgba(0,0,0,0.35)" }}
                >
                  Sign in
                </Link>
              )}
            </nav>

          </header>

          {mobileOpen && (
            <nav className="lg:hidden mx-5 sm:mx-8 flex flex-col gap-3 rounded-xl bg-[rgba(255,255,255,0.92)] p-4">
              {NAV_LINKS.map((l) =>
                "to" in l ? (
                  <Link key={l.label} to={l.to ?? "/"} className="text-[#0A1B2C] text-base">
                    {l.label}
                  </Link>
                ) : (
                  <a key={l.label} href={l.href} className="text-[#0A1B2C] text-base">
                    {l.label}
                  </a>
                ),
              )}
              <Link
                to="/manage-bookings"
                className="mt-1 rounded-md border px-4 py-2 text-[#0A1B2C] self-start"
                style={{ borderColor: GOLD }}
              >
                Manage Bookings
              </Link>
            </nav>
          )}

          {/* HERO CONTENT */}
          <div className="flex-1 px-5 sm:px-8 lg:px-[50px] xl:px-[60px] pt-4 lg:pt-6">
            <div className="max-w-[720px]">
              <h1
                className="text-[#0A1B2C] text-5xl sm:text-6xl lg:text-[80px] leading-[1.0] tracking-tight"
                style={{ fontFamily: SERIF, fontWeight: 300 }}
              >
                Extraordinary
                <br />
                Meetings.
              </h1>

              <p className="mt-6 text-[#26364A] text-lg lg:text-[18px] leading-[1.55] max-w-[560px]">
                Request offers for meetings, conferences and events.
                <br />
                Our M&amp;E specialists will find the best hotels
                <br className="hidden sm:block" />
                and handle all communication for you.
              </p>

              {/* Trust row */}
              <div className="mt-7 relative -mx-5 sm:-mx-8 lg:-mx-[50px] xl:-mx-[60px]">
                <div
                  className="absolute inset-0 bg-white/[0.06] backdrop-blur-[3px]"
                  style={{
                    maskImage: "linear-gradient(90deg, transparent 0%, black 4%, black 96%, transparent 100%)",
                    WebkitMaskImage: "linear-gradient(90deg, transparent 0%, black 4%, black 96%, transparent 100%)",
                  }}
                />
                <div className="relative flex flex-nowrap items-center justify-start gap-[38px] px-5 sm:px-8 lg:px-[50px] xl:px-[60px] py-3">
                  {TRUST.map(({ Icon, label }) => {
                    const isSecure = label === "Secure & trusted";
                    return (
                      <div key={label} className="inline-flex items-center gap-[10px] flex-shrink-0">
                        <Icon size={44} />
                        <span
                          className={cn(
                            "text-[15px] font-medium leading-none whitespace-nowrap",
                            isSecure ? "text-[#1A1A1A]" : "text-[#151515]"
                          )}
                          style={{
                            textShadow: "0 1px 3px rgba(255,255,255,0.35)",
                          }}
                        >
                          {label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>


          {/* PROGRESS BAR */}
          <div
            className="relative px-5 sm:px-8 lg:px-[50px] xl:px-[60px] pb-7 pt-4 mt-auto"
          >
            <StepProgress step={step} onGo={go} />
          </div>


        </div>
      </section>

      {/* FORM SECTION */}
      <section
        className={`px-5 sm:px-8 lg:px-[50px] xl:px-[60px] relative ${step === 7 ? "py-0" : "py-10 lg:py-14"}`}
        style={
          step === 7
            ? {
                backgroundColor: "#061B2E",
              }
            : undefined
        }
      >
        <div className="mx-auto max-w-[1400px]">
          {/* Keep visited steps mounted so state persists across navigation. */}
          <div style={{ display: step === 1 ? "block" : "none" }}>
            {visited.has(1) && (
              <StepTwoLocation onBack={() => go(1)} onNext={handleNext} />
            )}
          </div>
          <div style={{ display: step === 2 ? "block" : "none" }}>
            {visited.has(2) && (
              <StepThreeAccommodation
                onBack={() => go(1)}
                onNext={handleNext}
                direction={direction}
              />
            )}
          </div>
          <div style={{ display: step === 3 ? "block" : "none" }}>
            {visited.has(3) && (
              <StepThreeMeetingSpaces
                onBack={() => go(2)}
                onNext={handleNext}
                direction={direction}
                onEditStep={(s) => go(s)}
              />
            )}
          </div>
          <div style={{ display: step === 4 ? "block" : "none" }}>
            {visited.has(4) && (
              <StepFourCatering
                onBack={() => go(3)}
                onNext={handleNext}
                direction={direction}
              />
            )}
          </div>
          <div style={{ display: step === 5 ? "block" : "none" }}>
            {visited.has(5) && (
              <StepFiveExtras
                onBack={() => go(4)}
                onNext={handleNext}
                direction={direction}
              />
            )}
          </div>
          {step === 6 && (

            <div
              className="overflow-hidden rounded-[20px]"
              style={{
                backgroundColor: "#FAF8F4",
                backgroundImage:
                  "linear-gradient(180deg, #FCFAF5 0%, #F8F5EE 55%, #F3EFE6 100%)",
                boxShadow:
                  "inset 0 1px 0 rgba(255,251,240,0.7), 0 1px 0 rgba(90,72,44,0.05), 0 20px 44px -34px rgba(60,48,28,0.14)",
                border: "1px solid #E7DFCE",
              }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_minmax(392px,420px)]">
                <div className="p-6 sm:p-10 lg:p-12">
                  <div key={step}>
                    <StepOne form={form} setForm={setForm} errors={errors} onNext={handleNext} />
                  </div>
                </div>

                {/* Help card */}
                <div
                  className="p-8 lg:p-10 lg:pl-8"
                  style={{
                    backgroundColor: "transparent",
                    borderLeft: "1px solid #E7DFCE",
                  }}
                >
                  <div
                    className="rounded-[16px] p-6 w-full lg:w-[320px] lg:min-w-[320px]"
                    style={{
                      backgroundColor: "#FAF8F4",
                      border: "1px solid #E7DFCE",
                      boxShadow:
                        "inset 0 1px 0 rgba(255,251,240,0.7), 0 1px 0 rgba(90,72,44,0.05), 0 20px 44px -34px rgba(60,48,28,0.14)",
                    }}
                  >
                    <HelpCard />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 7 && (
            <div key={step}>
              <StepSevenReview onBack={() => go(6)} onEdit={(s) => go(s)} />
            </div>
          )}


          {/* Step 1 premium divider / other steps credibility banner */}
          {step === 1 ? (
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 lg:gap-8">
              <PremiumDivider />
              <div aria-hidden className="hidden lg:block" />
            </div>

          ) : step !== 2 && step !== 3 && step !== 7 ? (
          <div
            className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start md:items-center px-8 md:px-12 py-8 md:py-10 rounded-[20px]"
            style={{
              backgroundColor: "#FAF8F4",
              backgroundImage:
                "linear-gradient(180deg, #FCFAF5 0%, #F4F0E7 100%)",
              border: "1px solid #E7DFCE",
              boxShadow:
                "inset 0 1px 0 rgba(255,251,240,0.7), 0 1px 0 rgba(90,72,44,0.05), 0 20px 44px -34px rgba(60,48,28,0.14)",
            }}
          >
            <div className="flex items-start gap-4">
              <span
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
                style={{ backgroundColor: "#FAF3E1" }}
              >
                <Users size={22} strokeWidth={1.75} style={{ color: "#B88A2E" }} />
              </span>
              <p className="text-[#1F2A36] text-[17px] leading-relaxed">
                <span className="font-semibold" style={{ fontFamily: SERIF }}>
                  Built by group booking professionals
                </span>
                <br />
                with experience from{" "}
                <span className="font-semibold" style={{ color: "#B88A2E" }}>
                  10,000+ groups.
                </span>
              </p>
            </div>
            <div className="md:pl-10 md:border-l flex items-center gap-8" style={{ borderColor: "#F1F1EE" }}>
              <span
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full relative"
                style={{ border: "1.5px solid #C79A32", backgroundColor: "#FAF8F4" }}
                aria-hidden="true"
              >
                {/* Four gold stars above the building */}
                <svg
                  viewBox="0 0 44 44"
                  className="absolute"
                  style={{ top: 6, left: 0, right: 0, margin: "0 auto", width: 22, height: 6 }}
                >
                  {[3, 9, 15, 21].map((x) => (
                    <polygon
                      key={x}
                      points={`${x},0 ${x + 1.2},2.2 ${x + 3.4},2.4 ${x + 1.7},3.9 ${x + 2.3},6 ${x},4.7 ${x - 2.3},6 ${x - 1.7},3.9 ${x - 3.4},2.4 ${x - 1.2},2.2`}
                      fill="#C79A32"
                    />
                  ))}
                </svg>
                {/* Hotel building icon */}
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#B88A2E" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ marginTop: 4 }}>
                  <rect x="8" y="6" width="8" height="14" rx="0.5" />
                  <line x1="10.5" y1="9" x2="10.5" y2="9.01" />
                  <line x1="13.5" y1="9" x2="13.5" y2="9.01" />
                  <line x1="10.5" y1="12" x2="10.5" y2="12.01" />
                  <line x1="13.5" y1="12" x2="13.5" y2="12.01" />
                  <line x1="10.5" y1="15" x2="10.5" y2="15.01" />
                  <line x1="13.5" y1="15" x2="13.5" y2="15.01" />
                  <path d="M5 20h3v-4a2 2 0 0 1 2-2" />
                  <path d="M19 20h-3v-4a2 2 0 0 0-2-2" />
                </svg>
              </span>
              <p className="text-[#3B4A56] text-[16px] leading-relaxed">
                Expert planning for meetings,
                <br />
                conferences and group stays.
              </p>
            </div>

          </div>
          ) : null}

        </div>
      </section>


      <style>{`
        /* Luxury metallic gold border for destination cards */
        .destination-card {
          border: 1.5px solid transparent;
          background-clip: padding-box;
          box-shadow:
            0 0 0 1px rgba(199, 154, 50, 0.18),
            0 0 2px rgba(199, 154, 50, 0.28),
            0 10px 26px -18px rgba(10,27,44,0.30);
          transition: box-shadow 220ms ease, filter 220ms ease;
          position: relative;
        }
        /* Subtle inner edge darkening so the metallic border reads on bright images */
        .destination-card::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          pointer-events: none;
          z-index: 2;
          box-shadow: inset 0 0 0 1px rgba(10, 20, 34, 0.14), inset 0 0 6px rgba(10, 20, 34, 0.18);
        }
        .destination-card::before {
          content: "";
          position: absolute;
          inset: -1.5px;
          border-radius: inherit;
          padding: 1.5px;
          background: linear-gradient(135deg, #F1DFA0 0%, #E4C77A 25%, #C79A32 55%, #A87516 100%);
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          -webkit-mask-composite: xor;
                  mask-composite: exclude;
          pointer-events: none;
          transition: filter 220ms ease, opacity 220ms ease;
          z-index: 3;
        }
        .destination-card:hover {
          box-shadow:
            0 0 0 1px rgba(199, 154, 50, 0.22),
            0 0 2px rgba(199, 154, 50, 0.32),
            0 14px 30px -16px rgba(10,27,44,0.34);
        }
        .destination-card:hover::before {
          filter: brightness(1.1);
        }
        .destination-card--selected::before {
          filter: brightness(1.12);
        }
        .destination-card--selected {
          box-shadow:
            0 0 0 1px rgba(199, 154, 50, 0.28),
            0 0 2px rgba(199, 154, 50, 0.38),
            0 16px 32px -18px rgba(10,27,44,0.38);
        }


        /* Metallic country pill hover */
        .country-pill { transition: box-shadow 220ms ease, filter 220ms ease, border-color 220ms ease; }
        .country-pill--active:hover { filter: brightness(1.06); box-shadow: 0 6px 14px -6px rgba(168,117,22,0.28), inset 0 1px 0 rgba(245,228,166,0.45); }

        /* Active step: tiny drifting sparkles + slow shimmer sweep on the circle */
        @keyframes step-spark-drift {
          0%   { opacity: 0; transform: translate(0, 0) scale(0.4); }
          25%  { opacity: 1; }
          75%  { opacity: 1; }
          100% { opacity: 0; transform: translate(var(--dx,2px), var(--dy,-2px)) scale(1); }
        }
        @keyframes step-shimmer-sweep {
          0%   { transform: translateX(-140%) rotate(20deg); opacity: 0; }
          10%  { opacity: 0.85; }
          50%  { opacity: 0.85; }
          90%  { opacity: 0; }
          100% { transform: translateX(160%) rotate(20deg); opacity: 0; }
        }
        @keyframes step-breathe {
          0%, 100% { opacity: 0.5; transform: scale(0.98); }
          50%      { opacity: 0.9; transform: scale(1.04); }
        }




        .meal-card {
          background: linear-gradient(180deg, #F9FAFB 0%, #F1F2F4 100%);
          border: 1px solid #D8CFC0;
          box-shadow: 0 3px 10px rgba(15, 23, 42, 0.04);
          transition: border-color 200ms ease, box-shadow 200ms ease, background 200ms ease;
        }
        .meal-card:hover {
          border-color: #CFC4B4;
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.05);
        }

        .meal-card-selected {
          background:
            linear-gradient(145deg, #FCFAF5 0%, #F6F0E1 100%) padding-box,
            linear-gradient(135deg, #E8CE86 0%, #C9A24A 35%, #F3DFA2 55%, #B08528 100%) border-box;
          border: 2px solid transparent;
          box-shadow:
            0 8px 20px rgba(15, 23, 42, 0.08),
            0 0 0 2px rgba(212, 175, 55, 0.06),
            inset 0 0 10px rgba(212, 175, 55, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.95);
        }
        .meal-card-selected:hover {
          box-shadow:
            0 10px 24px rgba(15, 23, 42, 0.10),
            0 0 0 2px rgba(212, 175, 55, 0.08),
            inset 0 0 12px rgba(212, 175, 55, 0.10),
            inset 0 1px 0 rgba(255, 255, 255, 1);
        }

        .qty-btn {
          color: #B88917;
          background: transparent;
          border: 1px solid transparent;
          border-radius: 6px;
          transition: all 150ms ease;
        }
        .qty-btn:hover {
          color: #B88917;
          background: rgba(212, 175, 55, 0.08);
          border-color: rgba(184, 137, 23, 0.30);
        }
        .qty-btn:active {
          background: linear-gradient(145deg, #F4D878 0%, #D7AD39 48%, #B8871E 100%);
          color: #071A2D;
          border-color: rgba(179, 132, 25, 0.75);
          box-shadow: 0 2px 8px rgba(185, 137, 30, 0.24), inset 0 1px 0 rgba(255, 245, 191, 0.75);
        }
        .qty-btn:focus-visible {
          outline: 2px solid rgba(215, 173, 57, 0.30);
          outline-offset: 2px;
        }

        .complete-stay-btn {
          position: relative;
          overflow: hidden;
          isolation: isolate;
          color: #1A1A1A;
          background: #FFFFFF;
          border: 1px solid #D4AF37;
          border-radius: 16px;
          box-shadow:
            inset 0 1px 0 rgba(255, 245, 200, 0.55),
            inset 0 -1px 0 rgba(143, 104, 24, 0.35),
            0 0 18px rgba(212, 175, 55, 0.10),
            0 10px 28px rgba(15, 23, 42, 0.08),
            0 2px 8px rgba(212, 175, 55, 0.08);
          cursor: pointer;
          transition: box-shadow 250ms ease-out, filter 250ms ease-out, background 250ms ease-out, color 250ms ease-out, border-color 250ms ease-out;
        }
        .complete-stay-plus {
          color: #D4AF37;
          transition: color 250ms ease-out;
          position: relative;
          z-index: 2;
        }
        .complete-stay-btn > span,
        .complete-stay-btn > svg {
          position: relative;
          z-index: 2;
        }
        /* Light sweep */
        .complete-stay-btn::before {
          content: "";
          position: absolute;
          top: 0;
          left: -40%;
          width: 40%;
          height: 100%;
          background: linear-gradient(
            100deg,
            transparent 0%,
            rgba(255, 220, 130, 0) 20%,
            rgba(255, 224, 150, 0.55) 50%,
            rgba(255, 220, 130, 0) 80%,
            transparent 100%
          );
          filter: blur(2px);
          opacity: 0;
          pointer-events: none;
          z-index: 1;
        }
        /* Sparkles overlay */
        .complete-stay-btn::after {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0;
          background-image:
            radial-gradient(1.5px 1.5px at 18% 55%, rgba(255, 232, 160, 0.95), transparent 60%),
            radial-gradient(1px 1px at 32% 40%, rgba(255, 240, 190, 0.9), transparent 60%),
            radial-gradient(2px 2px at 60% 68%, rgba(255, 220, 130, 0.85), transparent 60%),
            radial-gradient(1.2px 1.2px at 75% 45%, rgba(255, 240, 190, 0.9), transparent 60%),
            radial-gradient(1.6px 1.6px at 88% 60%, rgba(255, 224, 150, 0.9), transparent 60%),
            radial-gradient(1px 1px at 45% 30%, rgba(255, 250, 210, 0.9), transparent 60%);
          transition: opacity 250ms ease-out;
          z-index: 1;
        }
        .complete-stay-btn:hover {
          filter: brightness(1.04);
          color: #FFFFFF;
          background-image:
            linear-gradient(180deg,
              rgba(46, 142, 92, 0.92) 0%,
              rgba(33, 107, 67, 0.92) 50%,
              rgba(20, 78, 49, 0.92) 100%);
          border-color: #D4AF37;
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.14),
            inset 0 -10px 20px -10px rgba(0, 0, 0, 0.45),
            0 0 12px rgba(46, 142, 92, 0.35),
            0 0 26px rgba(46, 142, 92, 0.18),
            0 14px 32px -12px rgba(0, 0, 0, 0.28);
        }
        .complete-stay-btn:hover::before {
          animation: completeStaySweep 1200ms ease-out forwards;
          opacity: 1;
        }
        .complete-stay-btn:hover::after {
          animation: completeStaySparkle 1400ms ease-out forwards;
        }
        .complete-stay-btn:active {
          filter: brightness(0.94);
          color: #FFFFFF;
          background-image:
            linear-gradient(180deg,
              rgba(33, 107, 67, 0.95) 0%,
              rgba(20, 78, 49, 0.95) 50%,
              rgba(14, 58, 36, 0.95) 100%);
          border-color: #C9A34A;
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.10),
            inset 0 -8px 16px -10px rgba(0, 0, 0, 0.50),
            0 0 8px rgba(46, 142, 92, 0.22),
            0 0 16px rgba(46, 142, 92, 0.10),
            0 8px 18px rgba(0, 0, 0, 0.22);
        }
        @keyframes completeStaySweep {
          0%   { left: -40%; opacity: 0; }
          15%  { opacity: 1; }
          85%  { opacity: 1; }
          100% { left: 110%; opacity: 0; }
        }
        @keyframes completeStaySparkle {
          0%   { opacity: 0; transform: translateX(-10px); }
          40%  { opacity: 1; }
          100% { opacity: 0; transform: translateX(10px); }
        }
        .add-stay-btn {
          background: linear-gradient(180deg, #143253 0%, #0F2743 55%, #08182B 100%);
          border: 1px solid rgba(255, 255, 255, 0.12);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.14),
            inset 0 -1px 0 rgba(0,0,0,0.5),
            0 14px 32px -14px rgba(10,27,44,0.7),
            0 2px 6px -2px rgba(10,27,44,0.35);
          transition: box-shadow 220ms ease-out, filter 220ms ease-out;
          cursor: pointer;
        }
        .add-stay-btn:hover {
          filter: brightness(1.1);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.18),
            0 0 16px rgba(37, 99, 235, 0.30),
            0 0 34px rgba(37, 99, 235, 0.18),
            0 14px 28px rgba(0, 0, 0, 0.28);
        }
        .add-stay-btn:active {
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.14),
            0 0 10px rgba(37, 99, 235, 0.22),
            0 0 20px rgba(37, 99, 235, 0.12),
            0 8px 18px rgba(0, 0, 0, 0.25);
        }

      `}</style>
    </main>
  );
}

/* --------- Vellum Variant Switcher (design preview) --------- */


























































































