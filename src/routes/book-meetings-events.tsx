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
import helpCardBgAsset from "@/assets/need-help-bg.png.asset.json";
const helpCardBg = helpCardBgAsset.url;
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

type VellumVariantOpt = "A" | "B" | "C" | "D" | "E" | "current";
function VellumSwitcher({
  value,
  onChange,
}: {
  value: VellumVariantOpt;
  onChange: (v: VellumVariantOpt) => void;
}) {
  const [open, setOpen] = useState(true);
  const opts: { id: VellumVariantOpt; label: string; hint: string }[] = [
    { id: "A", label: "A · Pure Vellum", hint: "Minimal, timeless, almost invisible" },
    { id: "B", label: "B · Scandinavian depth", hint: "Vellum with architectural volume" },
    { id: "C", label: "C · Hotel lobby light", hint: "Soft sconces, warm floor bounce" },
    { id: "D", label: "D · Marine restraint", hint: "Vellum contained in cool marine light" },
    { id: "E", label: "E · Signature (rec.)", hint: "Three layers of light, nothing else" },
    { id: "current", label: "— Current", hint: "Existing atmosphere, for comparison" },
  ];
  return (
    <div
      className="fixed z-[9999] bottom-4 right-4 select-none"
      style={{
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      {open ? (
        <div
          className="rounded-lg"
          style={{
            width: 268,
            background: "rgba(20, 24, 32, 0.86)",
            backdropFilter: "blur(14px) saturate(140%)",
            WebkitBackdropFilter: "blur(14px) saturate(140%)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 12px 40px rgba(0,0,0,0.35)",
            color: "#F2ECDE",
          }}
        >
          <div className="flex items-center justify-between px-3 py-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <span style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "#C9B98F" }}>
              Vellum · design preview
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Hide"
              style={{ fontSize: 12, color: "rgba(242,236,222,0.6)", padding: "2px 6px" }}
            >
              ×
            </button>
          </div>
          <div className="p-2 flex flex-col gap-1">
            {opts.map((o) => {
              const active = value === o.id;
              return (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => onChange(o.id)}
                  className="text-left rounded-md px-2.5 py-2"
                  style={{
                    background: active ? "rgba(245,174,0,0.14)" : "transparent",
                    border: active ? "1px solid rgba(245,174,0,0.55)" : "1px solid transparent",
                    color: active ? "#F5E6BE" : "#F2ECDE",
                  }}
                >
                  <div style={{ fontSize: 12.5, fontWeight: 500 }}>{o.label}</div>
                  <div style={{ fontSize: 11, color: "rgba(242,236,222,0.55)", marginTop: 1 }}>{o.hint}</div>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-full px-3 py-2"
          style={{
            background: "rgba(20,24,32,0.86)",
            color: "#F2ECDE",
            fontSize: 11,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
          }}
        >
          Vellum · {value}
        </button>
      )}
    </div>
  );
}

/* --------- Step Progress --------- */

function StepProgress({ step, onGo }: { step: number; onGo: (n: number) => void }) {
  const total = STEPS.length;
  const progressPercentage = ((step - 1) / (total - 1)) * 100;
  const [pulseKey, setPulseKey] = useState(step);
  const prevStep = useRef(step);
  useEffect(() => {
    if (prevStep.current !== step) {
      const t = window.setTimeout(() => setPulseKey(step), 500);
      prevStep.current = step;
      return () => window.clearTimeout(t);
    }
  }, [step]);

  // Track spans from center of first circle to center of last circle.
  // Each button is flex-1 (equal width = 100%/total), so first/last centers
  // sit at 100%/(2*total) from each edge.
  const edgeInset = `${100 / (total * 2)}%`;

  return (
    <div className="relative">
      <div className="relative flex items-start justify-between gap-2">
        {/* Continuous progress track behind circles */}
        <div
          className="pointer-events-none absolute"
          style={{ top: 18, left: edgeInset, right: edgeInset, zIndex: 0 }}
        >
          {/* Inactive base line: solid up to step 6, dashed from step 6 -> step 7 */}
          <div className="relative h-px w-full">
            <div
              className="absolute left-0 top-0 h-px"
              style={{
                width: `${((total - 2) / (total - 1)) * 100}%`,
                backgroundColor: "rgba(245,194,90,0.28)",
              }}
            />
            <div
              className="absolute top-0 h-px"
              style={{
                left: `${((total - 2) / (total - 1)) * 100}%`,
                right: 0,
                backgroundImage:
                  "linear-gradient(90deg, rgba(255,255,255,0.35) 50%, transparent 50%)",
                backgroundSize: "6px 1px",
                backgroundRepeat: "repeat-x",
              }}
            />
          </div>
          {/* Gold overlay — polished metallic line with subtle reflections */}
          <div
            className="absolute left-0 top-0"
            style={{
              width: `${progressPercentage}%`,
              height: 1,
              background:
                "linear-gradient(90deg, #C79A32 0%, #E4C15E 22%, #F5E4A6 42%, #FFF3C8 50%, #F5E4A6 58%, #E4C15E 78%, #C79A32 100%)",
              boxShadow:
                "0 0 6px rgba(245,228,166,0.55), 0 0 14px rgba(214,177,90,0.28), 0 0 22px rgba(214,177,90,0.14)",
              transition: "width 500ms cubic-bezier(0.4, 0, 0.2, 1)",
              zIndex: 1,
            }}
          />
          {/* progress line intentionally static — no sparkles */}
        </div>

        {STEPS.map((label, i) => {
          const n = i + 1;
          const active = n === step;
          const completed = n < step;
          const isLast = n === total;
          const clickable = !isLast && !active;
          const pulse = active && pulseKey === step;

          const bg = active
            ? "linear-gradient(180deg, #F7CF63 0%, #E4B52F 52%, #D9A520 100%)"
            : completed
              ? NAVY_DEEP
              : "transparent";
          const borderColor = active
            ? "rgba(255,223,130,0.95)"
            : isLast
              ? "rgba(255,255,255,0.28)"
              : GOLD;
          const numberColor = active
            ? "#FFFFFF"
            : completed
              ? GOLD
              : isLast
                ? "rgba(255,255,255,0.4)"
                : GOLD;

          return (
            <button
              key={label}
              type="button"
              onClick={() => (clickable ? onGo(n) : undefined)}
              disabled={!clickable}
              aria-current={active ? "step" : undefined}
              className={cn(
                "relative flex flex-col items-center gap-2 flex-1 min-w-0",
                clickable ? "cursor-pointer" : "cursor-default",
              )}
              style={{ zIndex: 2 }}
            >
              {active && (
                <span
                  aria-hidden
                  className="pointer-events-none absolute"
                  style={{
                    top: 6,
                    width: 48,
                    height: 48,
                    borderRadius: "9999px",
                    background:
                      "radial-gradient(circle, rgba(212,175,55,0.28) 0%, rgba(212,175,55,0.10) 45%, transparent 75%)",
                    animation: "step-breathe 4600ms ease-in-out infinite",
                    zIndex: 0,
                  }}
                />
              )}
              {active && (
                <span
                  aria-hidden
                  className="pointer-events-none absolute"
                  style={{
                    top: 0,
                    width: 36,
                    height: 36,
                    zIndex: 3,
                  }}
                >
                  {[
                    { x: 35, y: 16, size: 2,   delay: 0,    dur: 2600, dx: 2,  dy: -1 },
                    { x: 26, y: 32, size: 2.5, delay: 700,  dur: 3000, dx: 2,  dy: 2  },
                    { x: 3,  y: 28, size: 2,   delay: 1400, dur: 2700, dx: -2, dy: 2  },
                    { x: -2, y: 11, size: 2.5, delay: 2100, dur: 3200, dx: -2, dy: -1 },
                    { x: 10, y: -2, size: 2,   delay: 2800, dur: 2500, dx: 1,  dy: -2 },
                    { x: 29, y: 1,  size: 1.8, delay: 3500, dur: 2900, dx: 2,  dy: -2 },
                  ].map((s, si) => (
                    <span
                      key={si}
                      aria-hidden
                      style={{
                        position: "absolute",
                        left: s.x,
                        top: s.y,
                        width: s.size,
                        height: s.size,
                        borderRadius: "9999px",
                        background:
                          "radial-gradient(circle, #FFF3C8 0%, rgba(245,228,166,0.95) 45%, rgba(245,228,166,0) 75%)",
                        boxShadow: "0 0 4px rgba(255,243,200,0.85)",
                        animation: `step-spark-drift ${s.dur}ms ease-in-out ${s.delay}ms infinite`,
                        ["--dx" as never]: `${s.dx}px`,
                        ["--dy" as never]: `${s.dy}px`,
                        pointerEvents: "none",
                      }}
                    />
                  ))}
                </span>
              )}
              <span
                className="relative flex h-9 w-9 items-center justify-center rounded-full text-[13px] font-semibold overflow-hidden"
                style={{
                  background: bg,
                  color: numberColor,
                  border: `1px solid ${borderColor}`,
                  boxShadow: active
                    ? "0 0 6px rgba(214,177,90,0.35), inset 0 1px 0 rgba(255,236,183,0.55), inset 0 -1px 0 rgba(120,80,20,0.35)"
                    : completed
                      ? "0 2px 6px rgba(0,0,0,0.25)"
                      : "none",
                  transition:
                    "background 250ms cubic-bezier(0.4,0,0.2,1), box-shadow 250ms cubic-bezier(0.4,0,0.2,1), border-color 250ms",
                  animation: pulse ? "step-pulse 260ms cubic-bezier(0.4,0,0.2,1) 1" : undefined,
                  zIndex: 1,
                }}
              >
                {/* shimmer sweep removed per spec — only sparkles animate */}


                <span style={{ position: "relative", zIndex: 2 }}>
                  {completed ? <Check size={16} strokeWidth={2.5} style={{ color: GOLD }} /> : n}
                </span>
              </span>

              <span
                className="text-[13px] lg:text-[14px] font-medium text-center whitespace-nowrap transition-colors duration-[250ms]"
                style={{
                  color: active ? GOLD : isLast ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.85)",
                }}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* Lets a signed-in customer reuse their saved HotelGroupBook profile details. */
function AccountPrefillPanel({
  form,
  setForm,
}: {
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
}) {
  const { session, profile } = useAuth();
  const [prefilled, setPrefilled] = useState(false);
  if (!session) return null;
  const canPrefill = hasProfileDetails(profile);

  const apply = () => {
    const typed = form.contactPerson.trim() || form.email.trim() || form.company.trim();
    if (
      typed &&
      typeof window !== "undefined" &&
      !window.confirm("Replace the contact details you've already entered with your account details?")
    )
      return;
    setForm((s) => ({
      ...s,
      contactPerson:
        [profile?.first_name, profile?.last_name].filter(Boolean).join(" ").trim() ||
        s.contactPerson,
      email: profile?.email || s.email,
      phone: profile?.phone || s.phone,
      company: profile?.company_name || s.company,
    }));
    setPrefilled(true);
  };

  return (
    <div
      className="mt-6 flex flex-col gap-3 rounded-[12px] px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between"
      style={{ backgroundColor: "#FBF7EE", border: "1px solid rgba(184,138,46,0.28)" }}
    >
      <div className="min-w-0">
        <p className="text-[13.5px] font-semibold" style={{ color: "#0A1B2C" }}>
          {canPrefill ? "Use your account details?" : "Complete your profile"}
        </p>
        <p className="mt-0.5 text-[12.5px]" style={{ color: "#4A5866" }}>
          {canPrefill
            ? "We can fill in your contact information from your HotelGroupBook profile."
            : "Add your details once in your profile and reuse them on every request."}
        </p>
      </div>
      {canPrefill ? (
        prefilled ? (
          <span className="shrink-0 text-[12.5px] font-semibold" style={{ color: "#B88A2E" }}>
            ✓ Account details added
          </span>
        ) : (
          <button
            type="button"
            onClick={apply}
            className="shrink-0 rounded-[8px] px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.12em] transition-opacity hover:opacity-90"
            style={{
              background: "linear-gradient(180deg, #E7C878 0%, #C5A24B 55%, #A9853A 100%)",
              color: "#20180A",
            }}
          >
            Use my account details
          </button>
        )
      ) : (
        <Link
          to="/account"
          className="shrink-0 rounded-[8px] px-4 py-2 text-center text-[12px] font-semibold uppercase tracking-[0.12em]"
          style={{ border: "1px solid rgba(184,138,46,0.5)", color: "#B88A2E" }}
        >
          Complete profile
        </Link>
      )}
    </div>
  );
}

/* --------- Step 1 --------- */


function StepOne({
  form,
  setForm,
  errors,
  onNext,
}: {
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
  errors: Record<string, string>;
  onNext: () => void;
}) {
  return (
    <div>
      <div className="flex items-start gap-5">
        <span
          className="hidden sm:inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full"
          style={{ backgroundColor: "#F5EFE1" }}
        >
          <CalendarIcon size={24} strokeWidth={1.75} style={{ color: "#B88A2E" }} />
        </span>
        <div>
          <h2
            className="text-[#0A1B2C] text-3xl lg:text-[34px] leading-tight"
            style={{ fontFamily: SERIF }}
          >
            Step 1 – Event Details
          </h2>
          <div className="mt-2 h-[2px] w-16" style={{ backgroundColor: GOLD }} />
          <p className="mt-4 text-[#4A5866] text-[15px] max-w-xs leading-relaxed">
            Please provide basic information
            <br />
            about your event.
          </p>
        </div>
      </div>

      <AccountPrefillPanel form={form} setForm={setForm} />

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">

        <Field
          label="Event name"
          required
          value={form.eventName}
          onChange={(v) => setForm((s) => ({ ...s, eventName: v }))}
          placeholder="Enter event name"
          error={errors.eventName}
        />
        <Field
          label="Company / Organization"
          required
          value={form.company}
          onChange={(v) => setForm((s) => ({ ...s, company: v }))}
          placeholder="Enter company / organization"
          error={errors.company}
        />
        <Field
          label="Contact person"
          required
          value={form.contactPerson}
          onChange={(v) => setForm((s) => ({ ...s, contactPerson: v }))}
          placeholder="Enter contact person"
          error={errors.contactPerson}
        />
        <Field
          label="Email"
          required
          type="email"
          value={form.email}
          onChange={(v) => setForm((s) => ({ ...s, email: v }))}
          placeholder="Enter email address"
          error={errors.email}
        />
        <div>
          <label className="block text-[14px] font-semibold text-[#0A1B2C]">
            Phone <span style={{ color: "#D64545" }}>*</span>
          </label>
          <div className="mt-2 flex gap-2">
            <div
              className="flex items-center gap-2 rounded-md border px-3 h-[46px] bg-white"
              style={{ borderColor: errors.phone ? "#D64545" : "#D9D3C4" }}
            >
              <FlagNO />
              <span className="text-[15px] text-[#0A1B2C]">{form.countryCode}</span>
              <ChevronDown size={16} className="text-[#4A5866]" />
            </div>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))}
              placeholder="123 45 678"
              className="flex-1 rounded-md border px-4 h-[46px] text-[15px] text-[#0A1B2C] outline-none focus:border-[#B88A2E] bg-white"
              style={{ borderColor: errors.phone ? "#D64545" : "#D9D3C4" }}
            />
          </div>
          {errors.phone && (
            <p className="mt-1 text-[12px]" style={{ color: "#D64545" }}>
              {errors.phone}
            </p>
          )}
        </div>

        <div className="flex items-end justify-end">
          <NextButton onClick={onNext} label="Next Step" />
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  value,
  onChange,
  placeholder,
  type = "text",
  error,
}: {
  label: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  error?: string;
}) {
  return (
    <div>
      <label className="block text-[14px] font-semibold text-[#0A1B2C]">
        {label} {required && <span style={{ color: "#D64545" }}>*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full rounded-md border px-4 h-[46px] text-[15px] text-[#0A1B2C] outline-none focus:border-[#B88A2E] bg-white transition-colors"
        style={{ borderColor: error ? "#D64545" : "#D9D3C4" }}
      />
      {error && (
        <p className="mt-1 text-[12px]" style={{ color: "#D64545" }}>
          {error}
        </p>
      )}
    </div>
  );
}

























function StepSevenReview({
  onBack,
  onEdit,
}: {
  onBack: () => void;
  onEdit: (step: number) => void;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const draft = useMeDraft();
  const navigate = useNavigate();

  const GOLD = "#D4AF6A";
  const GOLD_HI = "#F0D890";
  const CREAM = "#FBF5EA";
  const CREAM_2 = "#F6EEDD";
  const NAVY = "#0A1B2C";
  const NAVY_2 = "#0E2236";
  const INK = "#0B1620";

  // -------- Derived, humanised values (no fallbacks / demo data) --------
  const loc = draft.location ?? {};
  const locationTitle =
    loc.destinationName && loc.countryName
      ? loc.isAnywhere
        ? loc.destinationName
        : `${loc.destinationName}, ${loc.countryName}`
      : loc.destinationName || loc.countryName || "";
  const budgetLabel = loc.budget
    ? { economy: "Economy", mid: "Mid-range", premium: "Premium", luxury: "Luxury" }[loc.budget]
    : "";
  const hasLocation = Boolean(locationTitle || loc.preferredVenue || budgetLabel);

  const stays = draft.accommodationStays ?? [];
  const roomsTotalAll = stays.reduce(
    (n, s) =>
      n + s.rooms.sgl + s.rooms.dbl + s.rooms.twn + s.rooms.trp + s.rooms.ste,
    0,
  );
  const guestsTotalAll = stays.reduce(
    (n, s) =>
      n +
      s.rooms.sgl +
      s.rooms.dbl * 2 +
      s.rooms.twn * 2 +
      s.rooms.trp * 3 +
      s.rooms.ste * 2,
    0,
  );
  const hasAccommodation = stays.length > 0;

  const meetings = draft.meetingSpaces ?? [];
  const hasMeetings = meetings.length > 0;

  const catering = draft.catering ?? [];
  const cateringExtras = draft.cateringExtras ?? { dietary: [], dietaryOther: "", drinks: [], notes: "" };
  const dietaryList = [
    ...cateringExtras.dietary.filter((d) => d && d !== "Other"),
    ...(cateringExtras.dietary.includes("Other") && cateringExtras.dietaryOther
      ? [cateringExtras.dietaryOther]
      : []),
  ];
  const hasCatering =
    catering.length > 0 ||
    dietaryList.length > 0 ||
    (cateringExtras.drinks?.length ?? 0) > 0 ||
    Boolean(cateringExtras.notes?.trim());

  const extras = draft.extras ?? [];
  const extrasNotes = draft.extrasNotes?.trim() ?? "";
  const hasExtras = extras.length > 0 || Boolean(extrasNotes);

  const details = draft.eventDetails ?? {};
  const hasDetails = Boolean(
    details.eventName ||
      details.company ||
      details.contactPerson ||
      details.email ||
      details.phone,
  );

  const fmt = (iso: string) => {
    if (!iso) return "";
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  };
  const roomsBreakdown = (r: MeAccommodationStay["rooms"]) => {
    const parts: string[] = [];
    if (r.sgl) parts.push(`${r.sgl} Single`);
    if (r.dbl) parts.push(`${r.dbl} Double`);
    if (r.twn) parts.push(`${r.twn} Twin`);
    if (r.trp) parts.push(`${r.trp} Triple`);
    if (r.ste) parts.push(`${r.ste} Suite`);
    return parts.join(", ");
  };

  const { session: authSession } = useAuth();

  const handleSubmit = async () => {
    if (submitting || submitted) return;
    setSubmitting(true);
    try {
      const contactName = String(details.contactPerson ?? "");
      const firstStay = stays[0];
      const lastStay = stays[stays.length - 1];
      const startDate = firstStay?.checkIn || meetings[0]?.date || null;
      const endDate = lastStay?.checkOut || meetings[meetings.length - 1]?.date || null;
      const input: NewBookingInput = {
        bookingType: "me",
        name: String(details.eventName ?? "") || (locationTitle ? `${locationTitle} Event` : "Meetings & Events Request"),
        destination: locationTitle,
        country: loc.countryName ?? null,
        city: loc.destinationName ?? null,
        startDate,
        endDate,
        nights: nightsBetween(startDate, endDate),
        rooms: roomsTotalAll,
        guests: guestsTotalAll,
        delegates: meetings.reduce((n, m) => Math.max(n, m.attendees ?? 0), 0) || null,
        meetingSpaces: meetings.length || null,
        contact: {
          firstName: String(contactName).split(" ")[0] ?? "",
          lastName: String(contactName).split(" ").slice(1).join(" "),
          email: String(details.email ?? ""),
          phone: String(details.phone ?? ""),
          company: String(details.company ?? ""),
        },
        request: {
          type: "me",
          location: loc,
          accommodationStays: stays,
          meetingSpaces: meetings,
          catering,
          cateringExtras,
          extras,
          extrasNotes,
          eventDetails: details,
        },
        roomLines: stays.flatMap((stay) =>
          (
            [
              ["Single", stay.rooms.sgl],
              ["Double", stay.rooms.dbl],
              ["Twin", stay.rooms.twn],
              ["Triple", stay.rooms.trp],
              ["Suite", stay.rooms.ste],
            ] as const
          )
            .filter(([, qty]) => qty > 0)
            .map(([room_type, quantity]) => ({
              room_type,
              quantity,
              check_in: stay.checkIn || null,
              check_out: stay.checkOut || null,
            })),
        ),
      };

      // Single global session (falls back to the shared client if not hydrated yet).
      const user =
        authSession?.user ?? (await supabase.auth.getSession()).data.session?.user;
      if (!user) {
        savePendingRequest(input);
        navigate({ to: "/auth", search: { next: "/manage-bookings", mode: "signup" } });
        return;
      }

      // Keep the customer's saved profile intact: only fill blanks.
      const { data: existing } = await supabase
        .from("profiles")
        .select("first_name, last_name, email, company_name, phone, country")
        .eq("user_id", user.id)
        .maybeSingle();
      await upsertProfile(user.id, {
        first_name: existing?.first_name?.trim() || (String(contactName).split(" ")[0] ?? ""),
        last_name:
          existing?.last_name?.trim() || String(contactName).split(" ").slice(1).join(" "),
        email: existing?.email?.trim() || String(details.email ?? "") || user.email || "",
        company_name: existing?.company_name?.trim() || String(details.company ?? "") || null,
        phone: existing?.phone?.trim() || String(details.phone ?? "") || null,
        country: existing?.country?.trim() || loc.countryName || null,
      });

      await createBooking(user.id, input);
      clearPendingRequest();
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  /* -------- Section row primitive -------- */
  type SectionProps = {
    step?: number;
    icon: React.ReactNode;
    label: string;
    children: React.ReactNode;
    isFirst?: boolean;
    isLast?: boolean;
    showEdit?: boolean;
    labelStyle?: React.CSSProperties;
  };
  const SectionRow = ({
    step,
    icon,
    label,
    children,
    isFirst,
    isLast,
    showEdit = true,
    labelStyle,
  }: SectionProps) => (
    <div
      className="grid grid-cols-[132px_1fr] sm:grid-cols-[188px_1fr]"
      style={{
        borderTop: isFirst ? "none" : "1px solid rgba(212,175,106,0.23)",
      }}
    >
      {/* Left navy panel */}
      <div
        className="flex flex-col items-start justify-start gap-3 p-5 sm:p-6"
        style={{
          backgroundColor: "#193649",
          borderTopLeftRadius: isFirst ? 18 : 0,
          borderBottomLeftRadius: isLast ? 18 : 0,
        }}
      >
        <span
          className="inline-flex h-9 w-9 items-center justify-center"
          style={{ color: GOLD }}
        >
          {icon}
        </span>
        <div
          className="text-[10.5px] sm:text-[11.5px] tracking-[0.20em] uppercase leading-[1.35]"
          style={{ color: GOLD, fontWeight: 500, whiteSpace: "normal", ...labelStyle }}
        >
          {label}
        </div>
      </div>
      {/* Right cream panel */}
      <div
        className="relative p-5 sm:p-7"
        style={{
          backgroundColor: "#FAF6EE",
          backgroundImage:
            "linear-gradient(180deg, #FBF6EB 0%, #F6EFDF 100%)",
          borderTopRightRadius: isFirst ? 18 : 0,
          borderBottomRightRadius: isLast ? 18 : 0,
        }}
      >
        {showEdit && step !== undefined && (
          <button
            type="button"
            onClick={() => onEdit(step)}
            className="absolute right-4 top-4 sm:right-5 sm:top-5 inline-flex items-center gap-1.5 rounded-[8px] px-3 py-1.5 text-[12.5px]"
            style={{
              backgroundColor: "#FAF8F4",
              border: "1px solid rgba(212,175,106,0.55)",
              color: "#7A5A1E",
              boxShadow: "0 1px 2px rgba(10,27,44,0.04)",
            }}
            aria-label={`Edit ${label}`}
          >
            <Pencil size={12} strokeWidth={2.2} style={{ color: GOLD }} />
            <span style={{ fontWeight: 500 }}>Edit</span>
          </button>
        )}
        <div className="pr-16 sm:pr-20">{children}</div>
      </div>
    </div>
  );

  /* -------- Sidebar card primitive -------- */
  const SideCard = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <div
      className="relative overflow-hidden rounded-[16px] p-6"
      style={{
        backgroundImage:
          "linear-gradient(180deg, #FBF6EB 0%, #F4EBD5 100%)",
        border: "1px solid rgba(212,175,106,0.45)",
        boxShadow:
          "0 30px 60px -30px rgba(0,0,0,0.55), 0 6px 14px -6px rgba(6,20,34,0.35), inset 0 1px 0 rgba(255,255,255,0.7)",
      }}
    >
      {/* Marble texture veil */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 20% 15%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 45%), radial-gradient(ellipse at 85% 90%, rgba(180,150,90,0.09) 0%, rgba(180,150,90,0) 50%), url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='260' height='260'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.75  0 0 0 0 0.65  0 0 0 0 0.45  0 0 0 0.06 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
          backgroundSize: "auto, auto, 260px 260px",
          mixBlendMode: "multiply",
          opacity: 0.9,
        }}
      />
      <div className="relative">
        <div
          className="text-[12px] tracking-[0.22em] uppercase text-center"
          style={{ color: GOLD, fontWeight: 600 }}
        >
          {title}
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );

  const nextSteps = [
    { title: "Submitted", body: "Once you submit your request" },
    { title: "We Review", body: "Our team will review your request and select the most suitable hotels" },
    { title: "Hotels Contacted", body: "We contact the best matching hotels for you", Icon: Mail },
    { title: "Offers Received", body: "We collect the best offers and compare them", Icon: Gift },
    { title: "Proposal to You", body: "You will receive a curated proposal with the best options" },
  ];

  return (
    <div
      className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen overflow-hidden pb-16"
      style={{
        position: "relative",
        width: "100vw",
        maxWidth: "none",
        minHeight: "100%",
        backgroundColor: "#0B1C33",
        backgroundImage: [
          // Central soft top sheen
          "radial-gradient(ellipse 70% 40% at 50% -5%, rgba(255,246,220,0.05) 0%, rgba(255,246,220,0) 60%)",
          // Warm corner glow (top-right, matches trails)
          "radial-gradient(ellipse 55% 45% at 100% 0%, rgba(214,168,84,0.14) 0%, rgba(214,168,84,0.05) 30%, rgba(214,168,84,0) 60%)",
          // Subtle opposite-corner cool depth
          "radial-gradient(ellipse 60% 50% at 0% 100%, rgba(9,20,36,0.9) 0%, rgba(9,20,36,0) 55%)",
          // Deep vignette
          "radial-gradient(ellipse 90% 75% at 50% 45%, rgba(11,28,51,0) 0%, rgba(6,15,28,0.55) 70%, rgba(3,9,18,0.95) 100%)",
          // Base tonal wash
          "linear-gradient(180deg, #0D2038 0%, #0B1C33 45%, #071427 100%)",
        ].join(","),
        backgroundSize: "100% 100%",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Gold dust along the outer edges — soft radial haze */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background: [
            "radial-gradient(ellipse 40% 8% at 50% 0%, rgba(214,170,84,0.08) 0%, rgba(214,170,84,0) 70%)",
            "radial-gradient(ellipse 40% 8% at 50% 100%, rgba(198,154,74,0.07) 0%, rgba(198,154,74,0) 70%)",
            "radial-gradient(ellipse 8% 45% at 0% 50%, rgba(198,154,74,0.06) 0%, rgba(198,154,74,0) 70%)",
            "radial-gradient(ellipse 8% 45% at 100% 50%, rgba(214,170,84,0.08) 0%, rgba(214,170,84,0) 70%)",
          ].join(","),
        }}
      />

      {/* Flowing golden light trails — top-right corner only */}
      <svg
        aria-hidden
        className="pointer-events-none absolute z-0 luxury-trail"
        style={{
          top: "-6%",
          right: "-4%",
          width: "58%",
          height: "42%",
          animation: "luxury-trail-shimmer 8s ease-in-out infinite",
          opacity: 0.75,
          filter: "blur(0.3px)",
        }}
        viewBox="0 0 800 500"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="trailGold" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(214,170,84,0)" />
            <stop offset="55%" stopColor="rgba(228,188,110,0.55)" />
            <stop offset="88%" stopColor="rgba(245,215,140,0.9)" />
            <stop offset="100%" stopColor="rgba(255,236,180,0)" />
          </linearGradient>
          <radialGradient id="trailBurst" cx="88%" cy="18%" r="18%">
            <stop offset="0%" stopColor="rgba(255,236,180,0.55)" />
            <stop offset="60%" stopColor="rgba(214,170,84,0.12)" />
            <stop offset="100%" stopColor="rgba(214,170,84,0)" />
          </radialGradient>
        </defs>
        <rect x="0" y="0" width="800" height="500" fill="url(#trailBurst)" />
        {[
          "M-20 220 C 200 180, 420 150, 780 40",
          "M-20 250 C 220 210, 460 180, 780 60",
          "M-20 280 C 240 250, 500 210, 780 90",
          "M-20 310 C 260 280, 520 240, 780 120",
          "M-20 340 C 280 310, 540 270, 780 150",
          "M-20 200 C 180 150, 400 120, 780 25",
        ].map((d, i) => (
          <path
            key={i}
            d={d}
            fill="none"
            stroke="url(#trailGold)"
            strokeWidth={0.6 + (i % 3) * 0.25}
            strokeLinecap="round"
            opacity={0.55 - i * 0.06}
          />
        ))}
      </svg>

      {/* Star flares — a few cinematic sparkles */}
      {[
        { top: "14%", left: "6%", size: 34, delay: "0s" },
        { top: "58%", left: "94%", size: 26, delay: "2.4s" },
        { top: "82%", left: "10%", size: 22, delay: "4.1s" },
        { top: "8%", left: "42%", size: 18, delay: "1.6s" },
      ].map((f, i) => (
        <span
          key={`flare-${i}`}
          aria-hidden
          className="pointer-events-none absolute z-0 luxury-flare"
          style={{
            top: f.top,
            left: f.left,
            width: f.size,
            height: f.size,
            animation: `luxury-flare 7s ease-in-out ${f.delay} infinite`,
            background:
              "radial-gradient(circle, rgba(255,240,200,0.9) 0%, rgba(245,215,140,0.35) 18%, rgba(214,170,84,0) 55%)",
          }}
        >
          <span
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, transparent 46%, rgba(255,236,180,0.85) 50%, transparent 54%), linear-gradient(0deg, transparent 46%, rgba(255,236,180,0.85) 50%, transparent 54%)",
            }}
          />
        </span>
      ))}

      {/* Scattered sparkles — varying brightness, edges only */}
      {[
        { top: "5%",  left: "18%", s: 2,   b: 0.55, d: "0s"   },
        { top: "9%",  left: "68%", s: 1.5, b: 0.4,  d: "1.2s" },
        { top: "12%", left: "88%", s: 2.5, b: 0.85, d: "2.6s" },
        { top: "22%", left: "4%",  s: 2,   b: 0.7,  d: "0.7s" },
        { top: "28%", left: "96%", s: 1.5, b: 0.5,  d: "3.4s" },
        { top: "36%", left: "9%",  s: 1.5, b: 0.4,  d: "1.9s" },
        { top: "44%", left: "93%", s: 2,   b: 0.65, d: "4.1s" },
        { top: "52%", left: "3%",  s: 2.5, b: 0.9,  d: "2.2s" },
        { top: "62%", left: "97%", s: 1.5, b: 0.45, d: "0.4s" },
        { top: "71%", left: "7%",  s: 2,   b: 0.7,  d: "3.6s" },
        { top: "78%", left: "92%", s: 1.5, b: 0.5,  d: "1.5s" },
        { top: "88%", left: "16%", s: 2,   b: 0.65, d: "2.9s" },
        { top: "93%", left: "62%", s: 1.5, b: 0.45, d: "4.7s" },
        { top: "96%", left: "88%", s: 2.5, b: 0.8,  d: "0.9s" },
        { top: "3%",  left: "34%", s: 1.5, b: 0.4,  d: "3.2s" },
        { top: "17%", left: "78%", s: 1.5, b: 0.5,  d: "2.1s" },
        { top: "84%", left: "44%", s: 1.5, b: 0.45, d: "1.1s" },
      ].map((p, i) => (
        <span
          key={`sp-${i}`}
          aria-hidden
          className="pointer-events-none absolute z-0 rounded-full luxury-particle"
          style={{
            top: p.top,
            left: p.left,
            width: p.s,
            height: p.s,
            backgroundColor: `rgba(250,232,190,${p.b})`,
            boxShadow: `0 0 ${4 + p.s}px rgba(245,215,145,${p.b * 0.55})`,
            animation: `luxury-twinkle ${6 + (i % 4)}s ease-in-out ${p.d} infinite`,
          }}
        />
      ))}

      {/* Slow floating drift motes — subtle movement */}
      {[
        { top: "24%", left: "12%", d: "0s" },
        { top: "66%", left: "88%", d: "2.5s" },
        { top: "48%", left: "6%",  d: "5.1s" },
      ].map((m, i) => (
        <span
          key={`d-${i}`}
          aria-hidden
          className="pointer-events-none absolute z-0 rounded-full luxury-drift"
          style={{
            top: m.top,
            left: m.left,
            width: 3,
            height: 3,
            backgroundColor: "rgba(252,236,196,0.55)",
            boxShadow: "0 0 8px rgba(245,215,145,0.45)",
            animation: `luxury-drift 14s ease-in-out ${m.d} infinite`,
          }}
        />
      ))}




      <div className="relative z-[1] mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-8">
        <div className="pt-[38px]">



          <div className="max-w-[720px]" style={{ paddingBottom: "30px" }}>

            <h1
              className="leading-[1.02] whitespace-nowrap"
              style={{
                fontFamily: SERIF,
                fontSize: "clamp(34px, 4.4vw, 58px)",
                fontWeight: 500,
                letterSpacing: "0.005em",
                color: "#FFF8EA",
                textShadow: "0 2px 24px rgba(245,220,150,0.18)",
              }}
            >
              Executive Event Review
            </h1>
            <div className="relative mt-5 w-[320px] max-w-full">
              <div
                className="h-[2px] w-full"
                style={{
                  backgroundImage:
                    "linear-gradient(90deg, transparent, #B98F3D 18%, #F5E9B8 50%, #B98F3D 82%, transparent)",
                  boxShadow: "0 0 12px rgba(245,220,150,0.55)",
                }}
              />
              <span
                aria-hidden
                className="absolute left-1/2 top-1/2 h-[8px] w-[80px] -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                  background:
                    "radial-gradient(ellipse at center, rgba(255,235,180,0.85) 0%, rgba(255,215,130,0.35) 40%, rgba(255,215,130,0) 75%)",
                  filter: "blur(2px)",
                }}
              />
            </div>
            <p
              className="mt-5 text-[16px] sm:text-[17px] leading-relaxed"
              style={{ color: "rgba(250,240,220,0.88)" }}
            >
              You&apos;re all set! Please review your request before submitting it to our team.
            </p>
          </div>
        </div>




      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-6 items-start">
        {/* LEFT — sectioned card */}
        <div
          className="overflow-hidden rounded-[20px]"
          style={{
            backgroundColor: NAVY_2,
            border: "1px solid rgba(212,175,106,0.42)",
            boxShadow:
              "0 50px 90px -40px rgba(0,0,0,0.75), 0 10px 24px -10px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)",
          }}
        >
          {/* Row 0 — Your Event Summary intro */}
          <SectionRow
            icon={<ClipboardCheck size={22} strokeWidth={1.8} />}
            label={"Your Event\u00A0Summary"}
            showEdit={false}
            isFirst
          >
            <div className="text-[15px] leading-relaxed text-[#334155]">
              Here is a summary of your request.
              <br />
              You can go back and edit any section if needed.
            </div>
          </SectionRow>

          {(() => {
            const sections: React.ReactNode[] = [];

            if (hasLocation) {
              sections.push(
                <SectionRow
                  key="location"
                  step={1}
                  icon={<MapPin size={22} strokeWidth={1.8} />}
                  label="Location"
                >
                  {locationTitle && (
                    <div style={{ fontFamily: SERIF, fontSize: "24px", color: INK, fontWeight: 500 }}>
                      {locationTitle}
                    </div>
                  )}
                  {loc.preferredVenue && (
                    <div className="mt-2 text-[14px] text-[#334155]">
                      Preferred venue: {loc.preferredVenue}
                    </div>
                  )}
                  {budgetLabel && (
                    <div className="mt-1 text-[14px] text-[#334155]">
                      Budget: {budgetLabel}
                    </div>
                  )}
                </SectionRow>,
              );
            }

            if (hasAccommodation) {
              sections.push(
                <SectionRow
                  key="accommodation"
                  step={2}
                  icon={<BedDouble size={22} strokeWidth={1.8} />}
                  label="Accommodation"
                >
                  <div style={{ fontFamily: SERIF, fontSize: "24px", color: INK, fontWeight: 500 }}>
                    {guestsTotalAll} {guestsTotalAll === 1 ? "Guest" : "Guests"}
                  </div>
                  <div className="mt-1 text-[14px] text-[#334155]">
                    {roomsTotalAll} {roomsTotalAll === 1 ? "Room" : "Rooms"}
                  </div>
                  <div className="mt-3 space-y-3 text-[14px] text-[#334155]">
                    {stays.map((s, i) => (
                      <div key={s.id}>
                        {stays.length > 1 && (
                          <div className="text-[12px] uppercase tracking-[0.08em] text-[#64748B] mb-1">
                            Stay {i + 1}
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <CalendarIcon size={14} strokeWidth={2} style={{ color: GOLD }} />
                          Check-in: {fmt(s.checkIn)}
                        </div>
                        <div className="flex items-center gap-2">
                          <CalendarIcon size={14} strokeWidth={2} style={{ color: GOLD }} />
                          Check-out: {fmt(s.checkOut)}
                        </div>
                        {roomsBreakdown(s.rooms) && (
                          <div className="mt-1">{roomsBreakdown(s.rooms)}</div>
                        )}
                        <div className="mt-1">
                          Meal plan: {s.mealPlan === "breakfast" ? "Breakfast included" : "Room only"}
                        </div>
                      </div>
                    ))}
                  </div>
                </SectionRow>,
              );
            }

            if (hasMeetings) {
              sections.push(
                <SectionRow
                  key="meetings"
                  step={3}
                  icon={<Users size={22} strokeWidth={1.8} />}
                  label={"Meeting &\u00A0Space"}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                    {meetings.map((m) => (
                      <div key={m.id}>
                        <div className="text-[13.5px] font-semibold" style={{ color: INK }}>
                          {m.name || "Meeting Room"}
                        </div>
                        {m.attendees > 0 && (
                          <div className="text-[13px] text-[#334155] mt-1">
                            {m.attendees} {m.attendees === 1 ? "attendee" : "attendees"}
                          </div>
                        )}
                        {m.setupLabel && (
                          <div className="text-[13px] text-[#334155]">{m.setupLabel}</div>
                        )}
                        {(m.date || m.startTime || m.endTime) && (
                          <div className="text-[13px] text-[#334155]">
                            {[fmt(m.date), [m.startTime, m.endTime].filter(Boolean).join("–")]
                              .filter(Boolean)
                              .join(" · ")}
                          </div>
                        )}
                        {m.equipmentLabels.length > 0 && (
                          <div className="text-[13px] text-[#334155] mt-1">
                            {m.equipmentLabels.join(", ")}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </SectionRow>,
              );
            }

            if (hasCatering) {
              sections.push(
                <SectionRow
                  key="catering"
                  step={4}
                  icon={<Utensils size={22} strokeWidth={1.8} />}
                  label="Catering"
                >
                  {catering.length > 0 && (
                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-[13.5px] text-[#334155]">
                      {catering.map((c) => (
                        <span key={c.servingId} className="inline-flex items-center gap-2">
                          <Utensils size={14} strokeWidth={2} style={{ color: GOLD }} />
                          {c.label}
                          {c.variant ? ` — ${c.variant}` : ""}
                          {c.time ? ` · ${c.time}` : ""}
                        </span>
                      ))}
                    </div>
                  )}
                  {dietaryList.length > 0 && (
                    <div className="mt-3 text-[13.5px] text-[#334155]">
                      Dietary requirements: {dietaryList.join(", ")}
                    </div>
                  )}
                  {(cateringExtras.drinks?.length ?? 0) > 0 && (
                    <div className="mt-1 text-[13.5px] text-[#334155]">
                      Drinks: {cateringExtras.drinks.join(", ")}
                    </div>
                  )}
                  {cateringExtras.notes?.trim() && (
                    <div className="mt-1 text-[13.5px] text-[#334155]">
                      Notes: {cateringExtras.notes}
                    </div>
                  )}
                </SectionRow>,
              );
            }

            if (hasExtras) {
              sections.push(
                <SectionRow
                  key="extras"
                  step={5}
                  icon={<Star size={22} strokeWidth={1.8} />}
                  label={"Extras &\u00A0Activities"}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {extras.map((x) => (
                      <div key={x.id}>
                        <div
                          className="inline-flex items-center gap-2 text-[13.5px] font-semibold"
                          style={{ color: INK }}
                        >
                          <Sparkles size={15} strokeWidth={2} style={{ color: GOLD }} />
                          {x.title}
                        </div>
                        {x.summary.length > 0 && (
                          <div className="mt-1 text-[13px] text-[#334155]">
                            {x.summary.join(" · ")}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  {extrasNotes && (
                    <div className="mt-3 text-[13.5px] text-[#334155]">Notes: {extrasNotes}</div>
                  )}
                </SectionRow>,
              );
            }

            if (hasDetails) {
              sections.push(
                <SectionRow
                  key="details"
                  step={6}
                  icon={<ClipboardCheck size={22} strokeWidth={1.8} />}
                  label="Additional Information"
                  labelStyle={{ letterSpacing: "0.14em" }}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-[13.5px] text-[#334155]">
                    {details.eventName && (
                      <div>
                        <div className="font-semibold" style={{ color: INK }}>Event name</div>
                        <div className="mt-1">{details.eventName}</div>
                      </div>
                    )}
                    {details.company && (
                      <div>
                        <div className="font-semibold" style={{ color: INK }}>Company</div>
                        <div className="mt-1">{details.company}</div>
                      </div>
                    )}
                    {details.contactPerson && (
                      <div>
                        <div className="font-semibold" style={{ color: INK }}>Contact</div>
                        <div className="mt-1">{details.contactPerson}</div>
                      </div>
                    )}
                    {details.email && (
                      <div>
                        <div className="font-semibold" style={{ color: INK }}>Email</div>
                        <div className="mt-1">{details.email}</div>
                      </div>
                    )}
                    {details.phone && (
                      <div>
                        <div className="font-semibold" style={{ color: INK }}>Phone</div>
                        <div className="mt-1">
                          {details.countryCode ? `${details.countryCode} ` : ""}{details.phone}
                        </div>
                      </div>
                    )}
                  </div>
                </SectionRow>,
              );
            }

            // Mark the last rendered row as isLast so the timeline terminates correctly.
            return sections.map((node, i) => {
              if (!React.isValidElement(node)) return node;
              return React.cloneElement(node as React.ReactElement<SectionProps>, {
                isLast: i === sections.length - 1,
              });
            });
          })()}
        </div>

        {/* RIGHT — sidebar */}
        <div className="space-y-5">
          {/* What Happens Next */}
          <SideCard title="What Happens Next?">
            <ol className="relative">
              {/* connecting line */}
              <span
                aria-hidden
                className="absolute left-[17px] top-3 bottom-3 w-px"
                style={{ backgroundColor: "rgba(212,175,106,0.45)" }}
              />
              {nextSteps.map((s, i) => (
                <li key={s.title} className="relative pl-12 pb-4 last:pb-0">
                  <span
                    className="absolute left-0 top-0 inline-flex h-[34px] w-[34px] items-center justify-center rounded-full"
                    style={{
                      backgroundColor: "#FFFBF0",
                      border: "1.5px solid rgba(212,175,106,0.75)",
                      color: GOLD,
                      boxShadow: "0 1px 2px rgba(10,27,44,0.06)",
                    }}
                  >
                    {i === 0 ? (
                      <Check size={16} strokeWidth={2.4} />
                    ) : i === 1 ? (
                      <User size={15} strokeWidth={2} />
                    ) : i === 2 ? (
                      <Mail size={15} strokeWidth={2} />
                    ) : i === 3 ? (
                      <Gift size={15} strokeWidth={2} />
                    ) : (
                      <User size={15} strokeWidth={2} />
                    )}
                  </span>
                  <div className="text-[13.5px] font-semibold" style={{ color: INK }}>
                    {i + 1}. {s.title}
                  </div>
                  <div className="mt-1 text-[12.5px] leading-snug text-[#4C5866]">
                    {s.body}
                  </div>
                </li>
              ))}
            </ol>
          </SideCard>

          {/* Estimated Response Time */}
          <SideCard title="Estimated Response Time">
            <div className="flex items-start gap-3">
              <span
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                style={{
                  backgroundColor: "#FFFBF0",
                  border: "1.5px solid rgba(212,175,106,0.7)",
                  color: GOLD,
                }}
              >
                <Clock size={16} strokeWidth={2} />
              </span>
              <div>
                <div style={{ fontFamily: SERIF, fontSize: "22px", color: INK, fontWeight: 500, lineHeight: 1.1 }}>
                  Within 24 hours
                </div>
                <div className="mt-1 text-[12.5px] leading-snug text-[#4C5866]">
                  You will receive an update from us within 24 hours.
                </div>
              </div>
            </div>
          </SideCard>

          {/* Need Help */}
          <SideCard title="Need Help?">
            <div className="flex items-start gap-3">
              <span
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                style={{
                  backgroundColor: "#FFFBF0",
                  border: "1.5px solid rgba(212,175,106,0.7)",
                  color: GOLD,
                }}
              >
                <Headphones size={16} strokeWidth={2} />
              </span>
              <p className="text-[13px] leading-snug text-[#4C5866]">
                Our team is here to assist you with anything you need.
              </p>
            </div>
            <div className="mt-4 space-y-2.5 text-[13.5px]" style={{ color: INK }}>
              <a href="tel:+4721010101" className="flex items-center gap-2.5 hover:text-[#7A5A1E]">
                <Phone size={14} strokeWidth={2} style={{ color: GOLD }} />
                +47 21 01 01 01
              </a>
              <a
                href="mailto:events@hotelgroupbook.com"
                className="flex items-center gap-2.5 hover:text-[#7A5A1E]"
              >
                <Mail size={14} strokeWidth={2} style={{ color: GOLD }} />
                events@hotelgroupbook.com
              </a>
            </div>
          </SideCard>

          {/* Ready to Submit */}
          <SideCard title="Ready to Submit?">
            <p className="text-center text-[13px] text-[#4C5866]">
              When you&apos;re happy with your request, click the button below.
            </p>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting || submitted}
              className="mt-4 w-full inline-flex items-center justify-center rounded-[10px] transition-colors disabled:opacity-80"
              style={{
                height: "50px",
                color: "#241703",
                fontFamily: SERIF,
                fontSize: "16px",
                letterSpacing: "0.02em",
                backgroundImage:
                  "linear-gradient(180deg, #F4DFA1 0%, #E6C56A 45%, #C9A24A 100%)",
                border: "1px solid rgba(122,86,20,0.65)",
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.55), inset 0 -1px 0 rgba(122,86,20,0.35), 0 10px 24px -14px rgba(201,162,74,0.55)",
                fontWeight: 600,
              }}
            >
              {submitted ? "Request Sent" : submitting ? "Sending…" : "Submit Event Request"}
            </button>
            <div className="mt-3 flex items-center justify-center gap-1.5 text-[12px] text-[#4C5866]">
              <Lock size={12} strokeWidth={2} />
              No payment required
            </div>
          </SideCard>
        </div>
      </div>

      {/* SECURITY BAR */}
      <div
        className="relative overflow-hidden rounded-[18px] px-6 sm:px-8 py-5"
        style={{
          backgroundImage:
            "linear-gradient(180deg, #FBF6EB 0%, #F4EBD5 100%), url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='260' height='260'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.75  0 0 0 0 0.65  0 0 0 0 0.45  0 0 0 0.06 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
          backgroundBlendMode: "multiply",
          border: "1px solid rgba(212,175,106,0.5)",
          boxShadow:
            "0 30px 60px -35px rgba(0,0,0,0.6), 0 6px 14px -6px rgba(6,20,34,0.4), inset 0 1px 0 rgba(255,255,255,0.7)",
        }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] items-center gap-4">
          <div className="flex items-start gap-4">
            <span
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
              style={{
                backgroundColor: "#FFFBF0",
                border: "1.5px solid rgba(212,175,106,0.7)",
                color: GOLD,
              }}
            >
              <ShieldCheck size={22} strokeWidth={1.9} />
            </span>
            <div>
              <div style={{ fontFamily: SERIF, fontSize: "20px", color: INK, fontWeight: 500 }}>
                Your information is secure
              </div>
              <div className="mt-1 text-[13px] text-[#4C5866]">
                We treat your data with the utmost confidentiality.
                <br className="hidden sm:block" />
                Your request will only be shared with relevant hotels.
              </div>
            </div>
          </div>
          {/* Decorative gold key tag */}
          <div className="hidden sm:flex items-center justify-end pr-2" aria-hidden>
            <svg width="110" height="60" viewBox="0 0 110 60" fill="none">
              <defs>
                <linearGradient id="hgbKeyGold" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#F5E9B8" />
                  <stop offset="50%" stopColor="#D4AF6A" />
                  <stop offset="100%" stopColor="#8A6A1F" />
                </linearGradient>
              </defs>
              <rect x="10" y="10" width="42" height="40" rx="6" fill="url(#hgbKeyGold)" />
              <text x="31" y="35" textAnchor="middle" fontFamily="serif" fontSize="12" fontWeight="700" fill="#0A1B2C">HGB</text>
              <circle cx="70" cy="30" r="9" stroke="url(#hgbKeyGold)" strokeWidth="3" fill="none" />
              <rect x="79" y="28.5" width="22" height="3" fill="url(#hgbKeyGold)" />
              <rect x="94" y="28.5" width="3" height="8" fill="url(#hgbKeyGold)" />
              <rect x="88" y="28.5" width="3" height="6" fill="url(#hgbKeyGold)" />
            </svg>
          </div>
        </div>
      </div>

      {/* FOOTER ROW */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-[14px]"
          style={{ color: GOLD_HI }}
        >
          <ArrowLeft size={16} strokeWidth={2} />
          Back to Step 6
        </button>
        <div className="inline-flex items-center gap-2 text-[13px] text-white/75">
          <ShieldCheck size={14} strokeWidth={2} style={{ color: GOLD }} />
          You&apos;re almost there! One last step.
        </div>
        <span aria-hidden />
      </div>
      </div>
    </div>
  );
}



/* --------- Placeholder for later steps --------- */




function StepPlaceholder({
  step,
  title,
  onBack,
  onNext,
  isLast,
}: {
  step: number;
  title: string;
  onBack: () => void;
  onNext: () => void;
  isLast: boolean;
}) {
  return (
    <div>
      <h2
        className="text-[#0A1B2C] text-3xl lg:text-[34px] leading-tight"
        style={{ fontFamily: SERIF }}
      >
        Step {step} – {title}
      </h2>
      <div className="mt-2 h-[2px] w-16" style={{ backgroundColor: GOLD }} />
      <p className="mt-6 text-[#4A5866] text-[15px] max-w-lg leading-relaxed">
        Your {title.toLowerCase()} details will be captured here. Continue to the
        next step to complete your Meetings &amp; Events request.
      </p>

      <div className="mt-10 flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center justify-center gap-2 rounded-md border px-6 h-[48px] text-[15px] font-medium text-[#0A1B2C] bg-white hover:bg-[#F5EFE1] transition-colors"
          style={{ borderColor: "#D9D3C4" }}
        >
          Back
        </button>
        {!isLast ? (
          <NextButton onClick={onNext} label="Next Step" />
        ) : (
          <NextButton onClick={onNext} label="Submit Request" />
        )}
      </div>
    </div>
  );
}

/* --------- Help Card --------- */


function FlagNO() {
  return (
    <svg width="20" height="14" viewBox="0 0 20 14" aria-hidden="true">
      <rect width="20" height="14" fill="#BA0C2F" />
      <rect x="6" width="2" height="14" fill="#FFF" />
      <rect y="6" width="20" height="2" fill="#FFF" />
      <rect x="6.5" width="1" height="14" fill="#00205B" />
      <rect y="6.5" width="20" height="1" fill="#00205B" />
    </svg>
  );
}

function FlagSE() {
  return (
    <svg width="20" height="14" viewBox="0 0 20 14" aria-hidden="true">
      <rect width="20" height="14" fill="#005293" />
      <rect x="6" width="2" height="14" fill="#FECB00" />
      <rect y="6" width="20" height="2" fill="#FECB00" />
    </svg>
  );
}

function FlagDK() {
  return (
    <svg width="20" height="14" viewBox="0 0 20 14" aria-hidden="true">
      <rect width="20" height="14" fill="#C8102E" />
      <rect x="6" width="2" height="14" fill="#FFF" />
      <rect y="6" width="20" height="2" fill="#FFF" />
    </svg>
  );
}

function FlagFI() {
  return (
    <svg width="20" height="14" viewBox="0 0 20 14" aria-hidden="true">
      <rect width="20" height="14" fill="#FFF" />
      <rect x="6" width="2" height="14" fill="#003580" />
      <rect y="6" width="20" height="2" fill="#003580" />
    </svg>
  );
}

/* --------- Step 2: Location --------- */

type Destination = {
  id: string;
  name: string;
  image?: string;
  Icon: typeof Building2;
  anywhere?: boolean;
};

type CountryCode = "NO" | "SE" | "DK" | "FI";

const COUNTRIES: { code: CountryCode; name: string; Flag: () => React.ReactElement }[] = [
  { code: "NO", name: "Norway", Flag: FlagNO },
  { code: "SE", name: "Sweden", Flag: FlagSE },
  { code: "DK", name: "Denmark", Flag: FlagDK },
  { code: "FI", name: "Finland", Flag: FlagFI },
];

const DESTINATIONS_BY_COUNTRY: Record<CountryCode, Destination[]> = {
  NO: [
    { id: "oslo", name: "Oslo", image: osloImg, Icon: Building2 },
    { id: "bergen", name: "Bergen", image: bergenImg, Icon: Landmark },
    { id: "tromso", name: "Tromsø", image: tromsoImg, Icon: Plane },
    { id: "stavanger", name: "Stavanger", image: stavangerImg, Icon: Building2 },
    { id: "trondheim", name: "Trondheim", image: trondheimImg, Icon: Landmark },
    { id: "bodo", name: "Bodø", image: bodoImg, Icon: Building2 },
    { id: "lofoten", name: "Lofoten", image: lofotenImg, Icon: Waves },
    { id: "anywhere-NO", name: "Anywhere in Norway", Icon: Globe, anywhere: true },
  ],
  SE: [
    { id: "stockholm", name: "Stockholm", image: stockholmImg, Icon: Building2 },
    { id: "gothenburg", name: "Gothenburg", image: gothenburgImg, Icon: Waves },
    { id: "malmo", name: "Malmö", image: malmoImg, Icon: Building2 },
    { id: "uppsala", name: "Uppsala", image: uppsalaImg, Icon: Landmark },
    { id: "kiruna", name: "Kiruna", image: kirunaImg, Icon: Plane },
    { id: "visby", name: "Visby", image: visbyImg, Icon: Landmark },
    { id: "are", name: "Åre", image: areImg, Icon: Palmtree },
    { id: "anywhere-SE", name: "Anywhere in Sweden", Icon: Globe, anywhere: true },
  ],
  DK: [
    { id: "copenhagen", name: "Copenhagen", image: copenhagenImg, Icon: Building2 },
    { id: "aarhus", name: "Aarhus", image: aarhusImg, Icon: Waves },
    { id: "odense", name: "Odense", image: odenseImg, Icon: Landmark },
    { id: "aalborg", name: "Aalborg", image: aalborgImg, Icon: Building2 },
    { id: "roskilde", name: "Roskilde", image: roskildeImg, Icon: Landmark },
    { id: "skagen", name: "Skagen", image: skagenImg, Icon: Waves },
    { id: "billund", name: "Billund", image: billundImg, Icon: Plane },
    { id: "anywhere-DK", name: "Anywhere in Denmark", Icon: Globe, anywhere: true },
  ],
  FI: [
    { id: "helsinki", name: "Helsinki", image: helsinkiImg, Icon: Building2 },
    { id: "tampere", name: "Tampere", image: tampereImg, Icon: Landmark },
    { id: "turku", name: "Turku", image: turkuImg, Icon: Waves },
    { id: "rovaniemi", name: "Rovaniemi", image: rovaniemiImg, Icon: Plane },
    { id: "oulu", name: "Oulu", image: ouluImg, Icon: Building2 },
    { id: "porvoo", name: "Porvoo", image: porvooImg, Icon: Landmark },
    { id: "levi", name: "Levi", image: leviImg, Icon: Palmtree },
    { id: "anywhere-FI", name: "Anywhere in Finland", Icon: Globe, anywhere: true },
  ],
};

type SearchableDestination = {
  id: string;
  name: string;
  country: CountryCode;
  countryName: string;
};

const ALL_SEARCHABLE_DESTINATIONS: SearchableDestination[] = (Object.keys(
  DESTINATIONS_BY_COUNTRY,
) as CountryCode[]).flatMap((code) => {
  const country = COUNTRIES.find((c) => c.code === code)!;
  return DESTINATIONS_BY_COUNTRY[code]
    .filter((d) => !d.anywhere)
    .map((d) => ({
      id: d.id,
      name: d.name,
      country: code,
      countryName: country.name,
    }));
});

type BudgetTier = "economy" | "mid" | "premium" | "luxury";

function BudgetPreference({
  value,
  onChange,
}: {
  value: BudgetTier | null;
  onChange: (v: BudgetTier | null) => void;
}) {
  const GOLD_GRAD = "linear-gradient(135deg, #F7E3A8 0%, #E8C46A 45%, #B88A2E 100%)";

  const EconomyIcon = ({ active }: { active: boolean }) => (
    <svg width="30" height="30" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="econG" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F7E3A8" />
          <stop offset="50%" stopColor="#E8C46A" />
          <stop offset="100%" stopColor="#B88A2E" />
        </linearGradient>
      </defs>
      <g stroke="url(#econG)" strokeWidth={active ? 1.7 : 1.5} strokeLinejoin="round" strokeLinecap="round" fill="none">
        <rect x="4" y="10" width="9" height="18" rx="1" />
        <rect x="13" y="6" width="10" height="22" rx="1" />
        <rect x="23" y="13" width="6" height="15" rx="1" />
        <path d="M16 10h4M16 14h4M16 18h4M16 22h4M7 15h3M7 19h3M7 23h3M25 17h2M25 21h2" strokeWidth="1.1" />
      </g>
    </svg>
  );

  const MidIcon = ({ active }: { active: boolean }) => (
    <svg width="30" height="30" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="midG" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F7E3A8" />
          <stop offset="50%" stopColor="#E8C46A" />
          <stop offset="100%" stopColor="#B88A2E" />
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="11" stroke="url(#midG)" strokeWidth={active ? 1.7 : 1.5} fill="none" />
      <path
        d="M16 10.5l1.5 3.2 3.5.5-2.5 2.4.6 3.5L16 18.5l-3.1 1.6.6-3.5-2.5-2.4 3.5-.5z"
        fill="url(#midG)"
      />
    </svg>
  );

  const PremiumIcon = ({ active }: { active: boolean }) => (
    <svg width="30" height="30" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="premG" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F7E3A8" />
          <stop offset="50%" stopColor="#E8C46A" />
          <stop offset="100%" stopColor="#B88A2E" />
        </linearGradient>
      </defs>
      <path
        d="M16 4.5l3.4 7 7.6 1.1-5.5 5.4 1.3 7.6L16 22l-6.8 3.6 1.3-7.6L5 12.6l7.6-1.1z"
        stroke="url(#premG)"
        strokeWidth={active ? 1.7 : 1.5}
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );

  const LuxuryIcon = ({ active }: { active: boolean }) => (
    <svg width="30" height="30" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="luxG" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F7E3A8" />
          <stop offset="50%" stopColor="#E8C46A" />
          <stop offset="100%" stopColor="#B88A2E" />
        </linearGradient>
      </defs>
      <g stroke="url(#luxG)" strokeWidth={active ? 1.7 : 1.5} strokeLinejoin="round" strokeLinecap="round" fill="none">
        <path d="M6 12l4-6h12l4 6-10 15z" />
        <path d="M6 12h20M10 6l6 6 6-6M12 12l4 15M20 12l-4 15" strokeWidth="1.1" />
      </g>
    </svg>
  );

  const tiers: {
    id: BudgetTier;
    label: string;
    desc: string;
    Icon: (p: { active: boolean }) => React.ReactElement;
  }[] = [
    { id: "economy", label: "Economy", desc: "Smart value", Icon: EconomyIcon },
    { id: "mid", label: "Mid-range", desc: "Balanced comfort", Icon: MidIcon },
    { id: "premium", label: "Premium", desc: "Elevated stay", Icon: PremiumIcon },
    { id: "luxury", label: "Luxury", desc: "Signature luxury", Icon: LuxuryIcon },
  ];

  return (
    <section className="mt-8">
      <GoldStarDivider />
      <div className="mt-6">
        <h3
          className="text-[22px] leading-tight"
          style={{ fontFamily: SERIF, fontWeight: 700, color: "#0F1B2D" }}
        >
          Budget Preference{" "}
          <span className="text-[15px]" style={{ fontFamily: "inherit", fontWeight: 400, color: "#6B778C" }}>
            (Optional)
          </span>
        </h3>
        <p className="mt-0.5 text-[14px]" style={{ fontWeight: 500, color: "#334155" }}>
          Help us tailor the best options for your event.
        </p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {tiers.map((t) => {
          const selected = value === t.id;
          const Icon = t.Icon;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onChange(selected ? null : t.id)}
              aria-pressed={selected}
              className="group relative flex flex-col items-center justify-center rounded-[14px] px-3 py-3 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E8C46A]/60"
              style={{
                minHeight: 118,
                background: selected
                  ? "linear-gradient(160deg, #142743 0%, #0F1B2D 55%, #0A1524 100%)"
                  : "#FFFDF8",
                border: selected
                  ? "1px solid rgba(212,175,55,0.85)"
                  : "1px solid rgba(60,72,90,0.10)",
                boxShadow: selected
                  ? "0 0 0 1px rgba(212,175,55,0.35), 0 10px 26px -10px rgba(212,175,55,0.55), 0 4px 14px -6px rgba(10,20,36,0.35), inset 0 1px 0 rgba(255,220,140,0.12)"
                  : "inset 0 1px 2px rgba(255,255,255,0.9), inset 0 -1px 3px rgba(20,30,45,0.04), 0 1px 2px rgba(20,30,45,0.03)",
              }}
            >
              {selected && (
                <span
                  aria-hidden="true"
                  className="absolute right-2 top-2 inline-flex h-[18px] w-[18px] items-center justify-center rounded-full"
                  style={{
                    background: "linear-gradient(160deg, #F7E3A8 0%, #E8C46A 55%, #B88A2E 100%)",
                    boxShadow: "0 2px 6px -2px rgba(184,138,46,0.55)",
                  }}
                >
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path d="M2.5 6.2l2.3 2.3L9.5 3.8" stroke="#0F1B2D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              )}
              <Icon active={selected} />
              <span
                className="mt-2 text-[13.5px]"
                style={{
                  fontFamily: SERIF,
                  fontWeight: selected ? 600 : 550,
                  letterSpacing: "0.005em",
                  color: selected ? "#F7E3A8" : "#0A1B2C",
                }}
              >
                {t.label}
              </span>
              <span
                className="mt-0.5 text-[10.5px] font-normal tracking-[0.01em]"
                style={{
                  fontFamily: "Inter, system-ui, sans-serif",
                  color: selected ? "rgba(255,255,255,0.72)" : "#8A8578",
                }}
              >
                {t.desc}
              </span>
            </button>
          );
        })}
      </div>

      {value && (
        <div className="mt-2 flex justify-end">
          <button
            type="button"
            onClick={() => onChange(null)}
            className="text-[10.5px] font-medium text-[#B88A2E]/75 underline underline-offset-2 hover:text-[#8E6A20]"
          >
            Clear selection
          </button>
        </div>
      )}
    </section>
  );
}




function StepTwoLocation({
  onBack,
  onNext,
}: {
  onBack: () => void;
  onNext: () => void;
}) {
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>("NO");
  const [selectedDestination, setSelectedDestination] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [budget, setBudget] = useState<"economy" | "mid" | "premium" | "luxury" | null>(null);
  const [preferredVenue, setPreferredVenue] = useState("");
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
  const [highlightedSearchIndex, setHighlightedSearchIndex] = useState(0);

  // Commit location selection into shared draft.
  useEffect(() => {
    const country = COUNTRIES.find((c) => c.code === selectedCountry);
    const dest = selectedDestination
      ? DESTINATIONS_BY_COUNTRY[selectedCountry].find((d) => d.id === selectedDestination) ??
        ALL_SEARCHABLE_DESTINATIONS.find((d) => d.id === selectedDestination)
      : null;
    setMeSection("location", {
      countryCode: selectedCountry,
      countryName: country?.name,
      destinationId: selectedDestination ?? undefined,
      destinationName: dest?.name,
      isAnywhere: (dest as { anywhere?: boolean } | undefined)?.anywhere ?? false,
      preferredVenue: preferredVenue.trim() || undefined,
      budget: budget,
    });
  }, [selectedCountry, selectedDestination, budget, preferredVenue]);

  const searchRef = useRef<HTMLDivElement>(null);

  const currentCountry = COUNTRIES.find((c) => c.code === selectedCountry) ?? COUNTRIES[0];
  const destinations = DESTINATIONS_BY_COUNTRY[selectedCountry];

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return ALL_SEARCHABLE_DESTINATIONS.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.countryName.toLowerCase().includes(q),
    ).slice(0, 8);
  }, [searchQuery]);

  // Close search dropdown on outside click
  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  useEffect(() => {
    setHighlightedSearchIndex(0);
  }, [searchQuery]);

  function changeCountry(code: CountryCode) {
    setSelectedCountry(code);
    setSelectedDestination(null);
    setSearchQuery("");
    setIsSearchDropdownOpen(false);
  }

  function pickDestinationCard(d: Destination) {
    setSelectedDestination(d.id);
    setSearchQuery(d.name);
    setIsSearchDropdownOpen(false);
  }

  function pickSearchResult(r: SearchableDestination) {
    setSelectedCountry(r.country);
    setSelectedDestination(r.id);
    setSearchQuery(r.name);
    setIsSearchDropdownOpen(false);
  }

  function onSearchKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!isSearchDropdownOpen || searchResults.length === 0) {
      if (e.key === "ArrowDown" && searchResults.length > 0) {
        setIsSearchDropdownOpen(true);
      }
      if (e.key === "Escape") setIsSearchDropdownOpen(false);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedSearchIndex((i) => (i + 1) % searchResults.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedSearchIndex(
        (i) => (i - 1 + searchResults.length) % searchResults.length,
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      const r = searchResults[highlightedSearchIndex];
      if (r) pickSearchResult(r);
    } else if (e.key === "Escape") {
      setIsSearchDropdownOpen(false);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 lg:gap-8 items-start">
      {/* MAIN BOOKING CARD */}
      <div
        className="relative overflow-hidden rounded-[26px] p-6 sm:p-10 lg:p-14"
        style={{
          background: "#FCFBF8",
          border: "1px solid #ECE6D6",
          boxShadow:
            "inset 0 1px 0 rgba(255,251,240,0.7), 0 1px 0 rgba(90,72,44,0.05), 0 20px 44px -34px rgba(60,48,28,0.14)",
        }}
      >
        {/* Title */}
        <h2
          className="text-[42px] sm:text-[50px] leading-[1.05]"
          style={{ fontFamily: SERIF, fontWeight: 400, color: "#1F1F1F", letterSpacing: "-0.015em", fontVariantNumeric: "lining-nums", fontFeatureSettings: '"lnum" 1' }}
        >
          Step{" "}
          <span style={{ fontFamily: '"EB Garamond", "Cormorant Garamond", Georgia, "Times New Roman", serif', fontWeight: 500, fontSize: "0.93em", display: "inline-block" }}>
            1
          </span>
          {" "}– Location
        </h2>


        <p className="mt-3 text-[15px] text-[#4A5866]">
          Where would you like to host your event?
        </p>
        <div className="mt-6 h-px w-full" style={{ background: "#ECE6D6" }} />

        {/* Country pills */}
        <div className="mt-8 flex flex-wrap gap-3">
          {COUNTRIES.map((c) => {
            const active = c.code === selectedCountry;
            return (
              <button
                key={c.code}
                type="button"
                onClick={() => changeCountry(c.code)}
                aria-pressed={active}
                className={cn(
                  "country-pill group inline-flex items-center gap-3 rounded-full pl-4 pr-6 h-[48px] text-[15px] transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B15A]/30",
                  active ? "country-pill--active" : "",
                )}
                style={{
                  background: "#FAF8F4",
                  border: active ? "1.5px solid transparent" : "1px solid #ECE6D6",
                  color: active ? "#7A5A1E" : "#4A5866",
                  fontWeight: active ? 600 : 500,
                  ...(active
                    ? {
                        backgroundImage:
                          "linear-gradient(#FFFFFF,#FFFFFF), linear-gradient(180deg,#F5E4A6 0%, #D6B15A 45%, #C79A32 75%, #A87516 100%)",
                        backgroundOrigin: "border-box",
                        backgroundClip: "padding-box, border-box",
                        boxShadow:
                          "0 2px 6px -2px rgba(168,117,22,0.18), inset 0 1px 0 rgba(245,228,166,0.35)",
                      }
                    : {
                        boxShadow: "0 4px 14px -12px rgba(10,27,44,0.14)",
                      }),
                }}
              >
                <span
                  className="inline-flex h-6 w-9 items-center justify-center overflow-hidden rounded-[3px] shrink-0"
                >
                  <c.Flag />
                </span>
                {c.name}
              </button>

            );
          })}
        </div>

        {/* Curated destinations */}
        <div className="mt-10 flex items-center gap-3">
          <Sparkles size={18} className="text-[#D4AF37]" strokeWidth={1.6} />
          <h3
            className="text-[#0A1B2C] text-[18px]"
            style={{ fontFamily: SANS, fontWeight: 600 }}
          >
            Curated destinations in {currentCountry.name}
          </h3>
        </div>

        {/* Destination grid: 4 per row × 2 rows */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {destinations.map((d) => {
            const selected = selectedDestination === d.id;
            if (d.anywhere) {
              return (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => pickDestinationCard(d)}
                  aria-pressed={selected}
                  className={cn(
                    "destination-card group relative overflow-hidden rounded-[16px] aspect-[4/3] flex flex-col items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B15A]/35",
                    selected && "destination-card--selected",
                  )}
                  style={{
                    background:
                      "linear-gradient(180deg,#0F2233 0%, #0A1B2C 100%) padding-box, linear-gradient(180deg,#F5E4A6 0%, #D6B15A 45%, #C79A32 75%, #A87516 100%) border-box",
                    border: "1.5px solid transparent",
                    boxShadow: "0 6px 18px -12px rgba(10,27,44,0.35), inset 0 1px 0 rgba(245,228,166,0.18)",
                  }}
                >
                  <Globe size={30} strokeWidth={1.4} className="text-[#F0D78C]" />
                  <span
                    className="text-white text-[16px] text-center leading-tight"
                    style={{ fontFamily: SANS, fontWeight: 500 }}
                  >
                    Anywhere
                    <br />
                    <span className="text-[#F0D78C]">in {currentCountry.name}</span>
                  </span>
                  {selected && (
                    <span
                      className="absolute top-3 right-3 inline-flex h-6 w-6 items-center justify-center rounded-full"
                      style={{ backgroundColor: "#D4AF37" }}
                    >
                      <Check size={13} strokeWidth={3} className="text-[#0A1B2C]" />
                    </span>
                  )}
                </button>
              );
            }
            return (
              <button
                key={d.id}
                type="button"
                onClick={() => pickDestinationCard(d)}
                aria-pressed={selected}
                className={cn(
                  "destination-card group relative overflow-hidden rounded-[16px] aspect-[4/3] text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B15A]/35",
                  selected && "destination-card--selected",
                )}
                style={{
                  background:
                    "#0A1B2C padding-box, linear-gradient(180deg,#F5E4A6 0%, #D6B15A 45%, #C79A32 75%, #A87516 100%) border-box",
                  border: "1.5px solid transparent",
                  boxShadow: "0 8px 22px -14px rgba(10,27,44,0.4), inset 0 1px 0 rgba(245,228,166,0.15)",
                }}
              >

                <img
                  src={d.image}
                  alt={d.name}
                  loading="lazy"
                  width={600}
                  height={450}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(4,17,26,0) 45%, rgba(4,17,26,0.55) 78%, rgba(4,17,26,0.9) 100%)",
                  }}
                />
                <div className="absolute inset-x-0 bottom-0 flex items-center gap-2 px-4 pb-3">
                  <span
                    className="inline-flex h-7 w-7 items-center justify-center rounded-md"
                    style={{
                      background: "rgba(255,255,255,0.08)",
                      border: "1px solid rgba(240,215,140,0.55)",
                    }}
                  >
                    <d.Icon size={14} strokeWidth={1.6} className="text-[#F0D78C]" />
                  </span>
                  <span
                    className="text-white text-[17px] tracking-[-0.005em]"
                    style={{ fontFamily: SANS, fontWeight: 500 }}
                  >
                    {d.name}
                  </span>
                </div>
                {selected && (
                  <span
                    className="absolute top-3 right-3 inline-flex h-6 w-6 items-center justify-center rounded-full"
                    style={{ backgroundColor: "#D4AF37" }}
                  >
                    <Check size={13} strokeWidth={3} className="text-[#0A1B2C]" />
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Search field */}
        <div className="mt-10">
          <p className="text-[15px] mb-2" style={{ fontWeight: 600, color: "#1A2233" }}>Or search for any destination</p>
          <div ref={searchRef} className="relative">
            <div
              className="flex items-center gap-3 rounded-[16px] px-5 h-[56px]"
              style={{
                background: "#FAF8F4",
                border: "1px solid #ECE6D6",
                boxShadow: "0 4px 14px -10px rgba(10,27,44,0.10)",
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#B88A2E"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="shrink-0"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchDropdownOpen(true);
                }}
                onFocus={() => {
                  if (searchQuery.trim()) setIsSearchDropdownOpen(true);
                }}
                onKeyDown={onSearchKey}
                placeholder="Type city, region or venue"
                autoComplete="off"
                aria-label="Destination"
                className="w-full bg-transparent text-[15px] outline-none border-none placeholder:text-[#6B778C]"
                style={{ color: "#0F1B2D" }}
              />
            </div>

            {isSearchDropdownOpen && searchResults.length > 0 && (
              <ul
                role="listbox"
                className="absolute left-0 right-0 top-[calc(100%+6px)] z-40 max-h-[280px] overflow-auto rounded-[16px] border bg-white py-1"
                style={{
                  borderColor: "#ECE6D6",
                  boxShadow: "0 24px 50px -18px rgba(10,27,44,0.22)",
                }}
              >
                {searchResults.map((r, idx) => {
                  const highlighted = idx === highlightedSearchIndex;
                  return (
                    <li key={`${r.country}-${r.id}`}>
                      <button
                        type="button"
                        onMouseEnter={() => setHighlightedSearchIndex(idx)}
                        onClick={(e) => {
                          e.preventDefault();
                          pickSearchResult(r);
                        }}
                        className={cn(
                          "w-full flex items-center justify-between gap-3 px-5 py-2.5 text-left text-[15px] text-[#0A1B2C] transition-colors",
                          highlighted ? "bg-[#FBF6EA]" : "hover:bg-[#F8F4E8]",
                        )}
                      >
                        <span className="truncate">{r.name}</span>
                        <span className="text-[13px] text-[#7C8794] shrink-0">
                          {r.countryName}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        {/* Preferred venue field */}
        <div
          className="mt-4 flex items-center gap-4 rounded-[16px] px-5 py-3"
          style={{
            background: "#FAF8F4",
            border: "1px solid #ECE6D6",
            boxShadow: "0 4px 14px -10px rgba(10,27,44,0.10)",
          }}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#B88A2E"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="shrink-0"
          >
            <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z" />
            <path d="M14 3v5h5" />
            <path d="M8 13h6M8 17h4" />
          </svg>
          <div className="flex flex-1 flex-col min-w-0">
            <label
              htmlFor="preferred-venue"
              className="text-[14.5px]"
            >
              <span style={{ fontWeight: 650, color: "#2A3441" }}>Preferred venue</span>{" "}
              <span className="font-normal" style={{ color: "#6B778C" }}>(optional)</span>
            </label>
            <input
              id="preferred-venue"
              type="text"
              value={preferredVenue}
              onChange={(e) => setPreferredVenue(e.target.value)}
              placeholder="Specific hotel, venue or any special request…"
              className="w-full bg-transparent text-[14px] outline-none border-none mt-0.5 placeholder:text-[#6B778C]"
              style={{ color: "#0F1B2D" }}
            />
          </div>
          <button
            type="button"
            aria-label="Edit preferred venue"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-[#F7F3EA] shrink-0"
          >
            <Pencil size={16} className="text-[#B88A2E]" strokeWidth={1.8} />
          </button>
        </div>


        {/* Budget preference */}
        <BudgetPreference value={budget} onChange={setBudget} />

        {/* Continue to Accommodation */}
        <div className="mt-8">
          <GoldStarDivider />
          <div className="mt-6 flex justify-end">
            <ContinueButton
              onClick={() => {
                if (selectedDestination) onNext();
              }}
              label="Continue to Accommodation"
              disabled={!selectedDestination}
            />
          </div>
        </div>

        {/* Hidden back nav — progress bar handles previous-step navigation */}
        <div className="sr-only" aria-hidden="true">
          <button type="button" onClick={onBack}>Back</button>
        </div>
      </div>

      {/* NEED HELP CARD */}
      <aside
        className="relative overflow-hidden rounded-[26px]"
        style={{
          backgroundColor: "#FAF8F4",
          boxShadow:
            "0 40px 80px -50px rgba(10,27,44,0.18), 0 12px 32px -20px rgba(10,27,44,0.08)",
          minHeight: 480,
        }}
      >
        {/* Reference illustration: warm off-white bg + gold lines + lounge — used as full card background */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${helpCardBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center bottom",
            backgroundRepeat: "no-repeat",
          }}
        />

        <div className="relative pt-9 lg:pt-10 px-8 lg:px-9 pb-4">

          <h3
            className="text-[#0A1B2C] text-[28px] leading-tight"
            style={{ fontFamily: SERIF, fontWeight: 500 }}
          >
            Need help?
          </h3>
          <p className="mt-3 text-[#4A5866] text-[15px] leading-relaxed">
            Our M&amp;E specialists are
            <br />
            ready to assist you.
          </p>

          <div className="mt-8 flex flex-col gap-5">
            <a
              href="tel:+4721002100"
              className="flex items-center gap-3 text-[#2A2A2A] text-[15px] hover:text-[#B88A2E] transition-colors"
            >
              <span
                className="inline-flex h-10 w-10 items-center justify-center rounded-full shrink-0"
                style={{
                  background:
                    "linear-gradient(180deg,#F5E4A6 0%, #D6B15A 50%, #C79A32 100%)",
                  boxShadow:
                    "0 4px 10px -6px rgba(168,117,22,0.45), inset 0 1px 0 rgba(255,245,210,0.7), inset 0 -1px 0 rgba(120,80,20,0.35)",
                }}
              >
                <Phone size={16} strokeWidth={2} className="text-white" />
              </span>
              +47 21 00 21 00
            </a>
            <a
              href="mailto:meetings@hotelgroupbook.com"
              className="flex items-center gap-3 text-[#2A2A2A] text-[15px] hover:text-[#B88A2E] transition-colors whitespace-nowrap"
            >
              <span
                className="inline-flex h-10 w-10 items-center justify-center rounded-full shrink-0"
                style={{
                  background:
                    "linear-gradient(180deg,#F5E4A6 0%, #D6B15A 50%, #C79A32 100%)",
                  boxShadow:
                    "0 4px 10px -6px rgba(168,117,22,0.45), inset 0 1px 0 rgba(255,245,210,0.7), inset 0 -1px 0 rgba(120,80,20,0.35)",
                }}
              >
                <Mail size={16} strokeWidth={2} className="text-white" />
              </span>
              meetings@hotelgroupbook.com
            </a>
          </div>
        </div>
      </aside>
    </div>
  );
}


type RoomMix = { sgl: number; dbl: number; twn: number; trp: number; ste: number };
type MealPlan = "room" | "breakfast";
type Stay = {
  id: string;
  checkIn: string;
  checkOut: string;
  rooms: RoomMix;
  mealPlan: MealPlan;
};

const emptyRooms = (): RoomMix => ({ sgl: 0, dbl: 0, twn: 0, trp: 0, ste: 0 });

function fmtDate(iso: string) {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function roomsSummary(r: RoomMix) {
  const parts: string[] = [];
  if (r.sgl) parts.push(`${r.sgl} SGL`);
  if (r.dbl) parts.push(`${r.dbl} DBL`);
  if (r.twn) parts.push(`${r.twn} TWN`);
  if (r.trp) parts.push(`${r.trp} TRP`);
  if (r.ste) parts.push(`${r.ste} STE`);
  return parts.join(", ");
}

function roomsTotal(r: RoomMix) {
  return r.sgl + r.dbl + r.twn + r.trp + r.ste;
}
function guestsCapacity(r: RoomMix) {
  return r.sgl * 1 + r.dbl * 2 + r.twn * 2 + r.trp * 3 + r.ste * 2;
}

function AccommodationIcon() {
  return (
    <svg
      aria-hidden
      width={44}
      height={44}
      viewBox="0 0 44 44"
      style={{
        flexShrink: 0,
        display: "block",
        filter: "drop-shadow(0 10px 14px rgba(0,0,0,0.35)) drop-shadow(0 2px 3px rgba(0,0,0,0.28))",
      }}
    >
      <defs>
        {/* Navy body — layered gradient */}
        <linearGradient id="acmBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1B2735" />
          <stop offset="45%" stopColor="#0E1620" />
          <stop offset="100%" stopColor="#070C13" />
        </linearGradient>
        {/* Inner glossy sheen */}
        <linearGradient id="acmSheen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.22" />
          <stop offset="35%" stopColor="#ffffff" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        {/* Champagne gold border — beveled */}
        <linearGradient id="acmFrame" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F9E4A2" />
          <stop offset="18%" stopColor="#E9C879" />
          <stop offset="42%" stopColor="#C89A3E" />
          <stop offset="58%" stopColor="#F4D98A" />
          <stop offset="82%" stopColor="#B0821E" />
          <stop offset="100%" stopColor="#F7DE96" />
        </linearGradient>
        {/* Bright calendar gold */}
        <linearGradient id="acmCal" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FBE9AE" />
          <stop offset="42%" stopColor="#E9C46A" />
          <stop offset="100%" stopColor="#9E7422" />
        </linearGradient>
        {/* Header bar gold */}
        <linearGradient id="acmHeader" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F8D98A" />
          <stop offset="100%" stopColor="#B78624" />
        </linearGradient>
        {/* Radial highlight on top-left */}
        <radialGradient id="acmGlow" cx="30%" cy="22%" r="55%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
          <stop offset="60%" stopColor="#ffffff" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        {/* Sparkle gradient */}
        <radialGradient id="acmSpark" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFF6D2" />
          <stop offset="45%" stopColor="#F5D682" />
          <stop offset="100%" stopColor="#C89A3E" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Outer frame */}
      <rect x="0.5" y="0.5" width="43" height="43" rx="11" fill="url(#acmFrame)" />
      {/* Navy body inset */}
      <rect x="2" y="2" width="40" height="40" rx="9.5" fill="url(#acmBody)" />
      {/* Glossy top sheen */}
      <rect x="2" y="2" width="40" height="20" rx="9.5" fill="url(#acmSheen)" />
      {/* Corner glow */}
      <rect x="2" y="2" width="40" height="40" rx="9.5" fill="url(#acmGlow)" />
      {/* Inner hairline */}
      <rect
        x="2.75"
        y="2.75"
        width="38.5"
        height="38.5"
        rx="8.75"
        fill="none"
        stroke="#ffffff"
        strokeOpacity="0.06"
      />

      {/* Calendar — centered around (22,23) */}
      <g transform="translate(11 10)">
        {/* body */}
        <rect
          x="0.9"
          y="3.4"
          width="20.2"
          height="18.2"
          rx="2.6"
          fill="none"
          stroke="url(#acmCal)"
          strokeWidth="1.7"
        />
        {/* header strip */}
        <path
          d="M0.9 8 h20.2 v-1.6 a2.6 2.6 0 0 0 -2.6 -2.6 h-15 a2.6 2.6 0 0 0 -2.6 2.6 z"
          fill="url(#acmHeader)"
        />
        {/* rings */}
        <rect x="5.4" y="0.6" width="1.9" height="4.4" rx="0.95" fill="url(#acmCal)" />
        <rect x="14.7" y="0.6" width="1.9" height="4.4" rx="0.95" fill="url(#acmCal)" />
        {/* ring highlights */}
        <rect x="5.8" y="0.9" width="0.5" height="3.6" rx="0.25" fill="#FFF3C8" opacity="0.75" />
        <rect x="15.1" y="0.9" width="0.5" height="3.6" rx="0.25" fill="#FFF3C8" opacity="0.75" />
        {/* date squares — 4 cols x 3 rows */}
        {[0, 1, 2, 3].map((c) =>
          [0, 1, 2].map((r) => {
            const isToday = c === 1 && r === 1;
            return (
              <rect
                key={`${c}-${r}`}
                x={2.7 + c * 4.2}
                y={10.4 + r * 3.4}
                width="2.6"
                height="2.4"
                rx="0.55"
                fill="url(#acmCal)"
                opacity={isToday ? 1 : 0.82}
              />
            );
          })
        )}
      </g>

      {/* Sparkle — bottom right */}
      <g transform="translate(31 30)">
        <circle r="4.2" fill="url(#acmSpark)" />
        <path
          d="M0 -4.2 L0.7 -0.7 L4.2 0 L0.7 0.7 L0 4.2 L-0.7 0.7 L-4.2 0 L-0.7 -0.7 Z"
          fill="url(#acmCal)"
        />
        <circle r="0.55" fill="#FFF6D2" />
      </g>
    </svg>
  );
}

function StepThreeAccommodation({

  onBack,
  onNext,
  direction,
}: {
  onBack: () => void;
  onNext: () => void;
  direction: "forward" | "back";
}) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [rooms, setRooms] = useState<RoomMix>(emptyRooms());
  const [roomCategory, setRoomCategory] = useState<
    Record<"sgl" | "dbl" | "twn" | "trp", string>
  >({ sgl: "Standard", dbl: "Standard", twn: "Standard", trp: "Standard" });
  const [mealPlan, setMealPlan] = useState<MealPlan>("breakfast");
  const [stays, setStays] = useState<Stay[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [special, setSpecial] = useState("");

  const totalRooms = stays.reduce((n, s) => n + roomsTotal(s.rooms), 0);
  const totalGuests = stays.reduce((n, s) => n + guestsCapacity(s.rooms), 0);
  const primaryMeal = stays[0]?.mealPlan ?? mealPlan;

  // Commit accommodation into shared draft.
  useEffect(() => {
    setMeSection(
      "accommodationStays",
      stays.map<MeAccommodationStay>((s) => ({
        id: s.id,
        checkIn: s.checkIn,
        checkOut: s.checkOut,
        rooms: s.rooms,
        mealPlan: s.mealPlan,
      })),
    );
  }, [stays]);

  useEffect(() => {
    setMeSection("accommodationExtras", {
      special: special.trim() || undefined,
      roomCategory,
    });
  }, [special, roomCategory]);

  const clearDraft = () => {
    setCheckIn("");
    setCheckOut("");
    setRooms(emptyRooms());
    setMealPlan("breakfast");
    setEditingId(null);
  };

  const addStay = () => {
    if (!checkIn || !checkOut) return;
    const stay: Stay = {
      id: editingId ?? crypto.randomUUID(),
      checkIn,
      checkOut,
      rooms,
      mealPlan,
    };
    setStays((prev) =>
      editingId ? prev.map((s) => (s.id === editingId ? stay : s)) : [...prev, stay],
    );
    clearDraft();
  };

  const editStay = (id: string) => {
    const s = stays.find((x) => x.id === id);
    if (!s) return;
    setEditingId(id);
    setCheckIn(s.checkIn);
    setCheckOut(s.checkOut);
    setRooms(s.rooms);
    setMealPlan(s.mealPlan);
  };

  const removeStay = (id: string) => {
    setStays((prev) => prev.filter((s) => s.id !== id));
    if (editingId === id) clearDraft();
  };

  return (
    <div
      className={
        ""
      }
    >
      <div className="mb-6">
        <h2
          className="text-[#0A1B2C] text-3xl lg:text-[38px] leading-tight"
          style={{ fontFamily: SERIF }}
        >
          Step 2&nbsp;– Accommodation
        </h2>
        <div className="mt-3 h-[2px] w-16" style={{ background: "linear-gradient(90deg,#F7D97A,#B88917)" }} />
        <p className="mt-4 text-[#4A5866] text-[15px] max-w-xl leading-relaxed">
          Add the room mix for each stay period. You can add multiple stay periods if
          guests are arriving or departing on different dates.
        </p>
      </div>

      <div
        className="overflow-hidden rounded-[20px]"
        style={{
          background:
            "linear-gradient(180deg, #FAF9F6 0%, #F7F6F2 50%, #F4F3EF 100%)",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.75), 0 12px 34px rgba(15,23,42,0.06), 0 3px 10px rgba(15,23,42,0.03)",
          border: "1px solid #E8E6E1",
        }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px]">
          {/* LEFT COLUMN */}
          <div className="p-6 sm:p-9 lg:p-11 lg:pr-9">
            {/* Accommodation Period card */}
            <div
              className="rounded-[16px] overflow-hidden"
              style={{
                backgroundColor: "#FAF8F4",
                border: "1px solid #EEEBE3",
                boxShadow: "0 6px 18px -10px rgba(10,27,44,0.08)",
              }}
            >
              <div className="relative w-full" style={{ height: 145 }}>
                <img
                  src={accommodationBannerImg}
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ objectPosition: "center" }}
                  draggable={false}
                />
                <div
                  aria-hidden
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to bottom, rgba(10,27,44,0) 60%, rgba(10,27,44,0.32) 100%)",
                  }}
                />
              </div>
              <div className="pt-4 pb-6 px-6 lg:pt-5 lg:pb-7 lg:px-7">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AccommodationIcon />

                  <div>
                  <h3
                    className="text-[#1A1F24] text-[20px] leading-tight tracking-[0.04em]"
                    style={{ fontFamily: SANS, fontWeight: 600 }}
                  >
                    Accommodation Period{" "}
                    <span className="text-[#8A94A0] text-[15px] font-normal tracking-normal">
                      ({editingId ? "Editing" : "Draft"})
                    </span>
                  </h3>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={clearDraft}
                  className="inline-flex items-center gap-2 rounded-md border px-3 h-9 text-[13px] text-[#4A5866] bg-white hover:bg-[#FBF7EA] transition-colors"
                  style={{ borderColor: "#E3DFD3", boxShadow: "0 1px 2px rgba(10,27,44,0.04)" }}
                >
                  <Trash2 size={14} style={{ color: "#B88917" }} />
                  Clear
                </button>
              </div>

              {/* Dates */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] items-end gap-4">
                <DateField label="Check-in" value={checkIn} onChange={setCheckIn} />
                <div className="hidden sm:flex items-center justify-center pb-3">
                  <ArrowRight size={18} className="text-[#4A5866]" />
                </div>
                <DateField label="Check-out" value={checkOut} onChange={setCheckOut} />
              </div>

              {/* Room Categories — stacked full-width rows */}
              <div className="mt-8">
                <div className="mb-4 sm:hidden">
                  <h4
                    className="text-[#1F2937] text-[15px]"
                    style={{ fontFamily: SANS, fontWeight: 600 }}
                  >
                    Room Categories
                  </h4>
                </div>
                <div
                  className="mb-3 hidden sm:grid items-baseline gap-6 pb-2 border-b px-5"
                  style={{ gridTemplateColumns: "44px minmax(0,1fr) 132px 180px", borderColor: "#ECE7DC" }}
                >
                  <div aria-hidden />
                  <h4
                    className="text-[#1F2937] text-[16.5px] ml-[-82px]"
                    style={{ fontFamily: SANS, fontWeight: 600, letterSpacing: "0.02em" }}
                  >
                    Room Categories
                  </h4>
                  <span
                    className="text-[11px] tracking-[0.05em] text-[#1F2937] uppercase text-center"
                    style={{ fontFamily: SANS, fontWeight: 600 }}
                  >
                    Guests
                  </span>
                  <span
                    className="text-[11px] tracking-[0.05em] text-[#1F2937] uppercase text-center"
                    style={{ fontFamily: SANS, fontWeight: 600 }}
                  >
                    Preferred Room Category
                  </span>
                </div>
                <div className="flex flex-col gap-3">
                  <RoomRow
                    image={singleRoomImg}
                    label="Single Room"
                    value={rooms.sgl}
                    onChange={(v) => setRooms({ ...rooms, sgl: v })}
                    category={roomCategory.sgl}
                    onCategoryChange={(c) => setRoomCategory({ ...roomCategory, sgl: c })}
                  />
                  <RoomRow
                    image={doubleRoomImg}
                    label="Double Room"
                    value={rooms.dbl}
                    onChange={(v) => setRooms({ ...rooms, dbl: v })}
                    category={roomCategory.dbl}
                    onCategoryChange={(c) => setRoomCategory({ ...roomCategory, dbl: c })}
                  />
                  <RoomRow
                    image={twinRoomImg}
                    label="Twin Room"
                    value={rooms.twn}
                    onChange={(v) => setRooms({ ...rooms, twn: v })}
                    category={roomCategory.twn}
                    onCategoryChange={(c) => setRoomCategory({ ...roomCategory, twn: c })}
                  />
                  <RoomRow
                    image={tripleRoomImg}
                    label="Triple Room"
                    value={rooms.trp}
                    onChange={(v) => setRooms({ ...rooms, trp: v })}
                    category={roomCategory.trp}
                    onCategoryChange={(c) => setRoomCategory({ ...roomCategory, trp: c })}
                  />

                </div>
              </div>


              {/* Meal Plan */}
              <div className="mt-8 border-t pt-6" style={{ borderColor: "#EEEBE3" }}>
                <h4
                  className="text-[#1F2937] text-[16.5px] mb-4"
                  style={{ fontFamily: SANS, fontWeight: 600, letterSpacing: "0.02em" }}
                >
                  Meal Plan
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <MealOption
                    image={roomOnlyImg}
                    label="Room Only"
                    selected={mealPlan === "room"}
                    onClick={() => setMealPlan("room")}
                  />
                  <MealOption
                    image={breakfastImg}
                    label="Breakfast Included"
                    selected={mealPlan === "breakfast"}
                    onClick={() => setMealPlan("breakfast")}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="mt-8 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={clearDraft}
                  className="inline-flex items-center justify-center rounded-md border px-6 h-[46px] text-[14px] font-medium text-[#0A1B2C] bg-white hover:bg-[#F5EFE1]"
                  style={{ borderColor: "#D9D3C4" }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={addStay}
                  disabled={!checkIn || !checkOut}
                  className="group inline-flex items-center justify-center gap-2 rounded-md px-6 h-[46px] text-[14px] font-semibold text-white disabled:opacity-50 transition-colors"
                  style={{
                    background:
                      "linear-gradient(180deg,#153353 0%,#0C2440 55%,#081A30 100%)",
                    boxShadow:
                      "inset 0 1px 0 rgba(255,255,255,0.16), inset 0 -1px 0 rgba(0,0,0,0.4), 0 12px 28px -14px rgba(10,27,44,0.7), 0 2px 6px -2px rgba(10,27,44,0.35)",
                    border: "1px solid rgba(255,255,255,0.12)",
                  }}
                >
                  {editingId ? "Save changes" : "Add this stay"}
                  <ArrowRight size={16} style={{ color: "#F2C860" }} />
                </button>
              </div>
              </div>
            </div>

            {/* Complete stay and continue (outlined gold) */}
            <button
              type="button"
              onClick={() => {
                try {
                  if (typeof window !== "undefined" && totalGuests > 0) {
                    window.localStorage.setItem(
                      "hgb:guest-count",
                      String(totalGuests),
                    );
                  }
                } catch {
                  /* non-fatal */
                }
                onNext();
              }}
              className="complete-stay-btn mt-5 w-full inline-flex items-center justify-center gap-2 h-[52px] text-[15px] font-medium"
            >
              <Plus size={18} className="complete-stay-plus" />
              Complete stay and continue
            </button>

            {/* Added Stays */}
            {stays.length > 0 && (
              <div className="mt-9">
                <h4 className="text-[#0A1B2C] text-[15px] font-semibold mb-4">Added Stays</h4>
                <div className="flex flex-col gap-3">
                  {stays.map((s) => (
                    <div
                      key={s.id}
                      className="flex items-center justify-between gap-4 rounded-[12px] px-4 py-3"
                      style={{
                        backgroundColor: "#FAF8F4",
                        border: "1px solid #EEEBE3",
                      }}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <LuxIconBadge size={36} tone="onDark">
                          <CalendarIcon size={16} strokeWidth={1.8} />
                        </LuxIconBadge>
                        <div className="min-w-0">
                          <div className="text-[#0A1B2C] text-[14px] font-semibold truncate">
                            {fmtDate(s.checkIn)} – {fmtDate(s.checkOut)}
                          </div>
                          <div className="text-[#4A5866] text-[13px] truncate">
                            {roomsSummary(s.rooms) || "No rooms"}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => editStay(s.id)}
                          className="inline-flex items-center gap-1.5 h-9 px-3 rounded-md text-[13px] text-[#0A1B2C] hover:bg-[#F5EFE1]"
                        >
                          <Pencil size={14} /> Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => removeStay(s.id)}
                          className="inline-flex items-center gap-1.5 h-9 px-3 rounded-md text-[13px] text-[#B45B4A] hover:bg-[#FBECEA]"
                        >
                          <Trash2 size={14} /> Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add another stay */}
            <button
              type="button"
              onClick={clearDraft}
              className="add-stay-btn mt-5 w-full inline-flex items-center justify-center gap-2 rounded-[12px] h-[54px] text-[15px] font-semibold text-white"
            >
              <Plus size={18} style={{ color: "#F2C860" }} />
              Add another stay
            </button>


            {/* Special Requests */}
            <div className="mt-9">
              <label className="block">
                <span className="text-[#0A1B2C] text-[15px] font-semibold">
                  Special Requests <span className="font-normal text-[#8A94A0]">(Optional)</span>
                </span>
                <span className="mt-1 block text-[#4A5866] text-[13px]">
                  Tell us about any specific requirements.
                </span>
                <textarea
                  value={special}
                  onChange={(e) => setSpecial(e.target.value)}
                  rows={3}
                  placeholder="E.g. early check-in, late check-out, welcome gift, specific floor, etc."
                  className="mt-3 w-full rounded-[10px] px-4 py-3 text-[14px] text-[#0A1B2C] placeholder:text-[#9BA4AE] outline-none transition-all focus:border-[#D4AF37] focus:shadow-[0_0_0_3px_rgba(212,175,55,0.14)]"
                  style={{
                    backgroundColor: "#FAF8F4",
                    border: "1px solid #E6E2D5",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.7), 0 1px 2px rgba(10,27,44,0.04)",
                  }}
                />
              </label>
            </div>

            {/* Back */}
            <div className="mt-10 flex">
              <button
                type="button"
                onClick={onBack}
                className="inline-flex items-center justify-center gap-2 rounded-md border px-6 h-[46px] text-[14px] font-medium text-[#0A1B2C] bg-white hover:bg-[#F5EFE1]"
                style={{ borderColor: "#D9D3C4" }}
              >
                Back
              </button>
            </div>
          </div>

          {/* RIGHT SIDEBAR - premium navy */}
          <aside
            className="relative p-7 lg:p-8 text-white"
            style={{
              background:
                "linear-gradient(180deg, #112842 0%, #0F2239 50%, #0D1D31 100%)",
              boxShadow: "inset 1px 0 0 rgba(255,255,255,0.04)",
            }}
          >
            {/* subtle vertical divider gradient with champagne reflection */}
            <div
              className="pointer-events-none absolute left-0 top-6 bottom-6 w-px"
              style={{
                background:
                  "linear-gradient(180deg, transparent 0%, rgba(247,217,122,0.18) 22%, rgba(212,175,55,0.34) 50%, rgba(247,217,122,0.16) 78%, transparent 100%)",
              }}
            />

            {/* Summary */}
            <h3
              className="text-white text-[24px] leading-tight"
              style={{ fontFamily: SERIF }}
            >
              Summary
            </h3>
            <div
              className="mt-3 h-[2px] w-14"
              style={{
                background:
                  "linear-gradient(90deg,#F7D97A 0%,#D4AF37 60%,rgba(212,175,55,0) 100%)",
              }}
            />

            <div className="mt-6 flex flex-col gap-4">
              <SummaryRow icon={<Users size={16} />} label="Total Guests" value={totalGuests} />
              <SummaryRow icon={<CalendarIcon size={16} />} label="Stay Periods" value={stays.length} />
              <SummaryRow icon={<BedDouble size={16} />} label="Total Rooms Requested" value={totalRooms} />
            </div>

            <div className="mt-6 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <LuxIconBadge size={36} tone="onDark">
                  <Coffee size={16} />
                </LuxIconBadge>
                <div>
                  <div className="text-white/70 text-[13px]">Meal Plan</div>
                  <div className="text-white text-[15px] font-medium">
                    {primaryMeal === "breakfast" ? "Breakfast Included" : "Room Only"}
                  </div>
                </div>
              </div>
            </div>

            {/* Need help card */}
            <div
              className="mt-7 rounded-[14px] p-5"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)",
                border: "1px solid rgba(212,175,55,0.22)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
              }}
            >
              <h4 className="text-white text-[20px]" style={{ fontFamily: SERIF }}>
                Need help?
              </h4>
              <div
                className="mt-2 h-[2px] w-10"
                style={{ background: "linear-gradient(90deg,#F7D97A,rgba(247,217,122,0))" }}
              />
              <p className="mt-3 text-white/75 text-[13.5px] leading-relaxed">
                Our M&amp;E specialists are ready to assist you.
              </p>
              <div className="mt-4 flex flex-col gap-3">
                <a
                  href="tel:+4721002100"
                  className="flex items-center gap-3 text-white/90 text-[13.5px] hover:text-[#F7D97A] transition-colors"
                >
                  <LuxIconBadge size={32} tone="onDark">
                    <Phone size={14} />
                  </LuxIconBadge>
                  +47 21 00 21 00
                </a>
                <a
                  href="mailto:meetings@hotelgroupbook.com"
                  className="flex items-center gap-3 text-white/90 text-[13.5px] hover:text-[#F7D97A] transition-colors whitespace-nowrap"
                >
                  <LuxIconBadge size={32} tone="onDark">
                    <Mail size={14} />
                  </LuxIconBadge>
                  meetings@hotelgroupbook.com
                </a>
              </div>
            </div>

            {/* Trust box */}
            <div
              className="mt-5 rounded-[14px] p-5 text-center"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)",
                border: "1px solid rgba(212,175,55,0.22)",
              }}
            >
              <div className="mx-auto flex items-center justify-center">
                <LuxIconBadge size={44} tone="onDark">
                  <Users size={20} />
                </LuxIconBadge>
              </div>
              <p
                className="mt-3 text-white text-[15px] leading-snug"
                style={{ fontFamily: SERIF }}
              >
                Built by group booking
                <br />
                professionals
              </p>
              <p className="mt-2 text-white/70 text-[12.5px] leading-relaxed">
                with experience from{" "}
                <span className="text-[#F7D97A] font-semibold">10,000+ groups.</span>
              </p>
            </div>

          </aside>
        </div>
      </div>
    </div>
  );
}

function DateField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-[#0A1B2C] text-[13.5px] font-semibold">{label}</span>
      <div
        className="group mt-2 flex items-center gap-2 rounded-[10px] px-3 h-[46px] transition-all focus-within:border-[#D4AF37] focus-within:shadow-[0_0_0_3px_rgba(212,175,55,0.14)]"
        style={{
          backgroundColor: "#FAF8F4",
          border: "1px solid #E6E2D5",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.7), 0 1px 2px rgba(10,27,44,0.04)",
        }}
      >
        <input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-transparent outline-none text-[14px] text-[#0A1B2C]"
        />
        <CalendarIcon size={16} style={{ color: "#B88917" }} />
      </div>
    </label>
  );
}

function Counter({
  label,
  value,
  onChange,
  icon,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  icon?: React.ReactNode;
}) {
  return (
    <div>
      <div className="text-[#0A1B2C] text-[13px] font-medium mb-2 flex items-center gap-2">
        {icon ? <LuxIconBadge size={28}>{icon}</LuxIconBadge> : null}
        <span>{label}</span>
      </div>
      <div
        className="flex items-center justify-between rounded-[10px] h-[46px] px-1.5"
        style={{
          backgroundColor: "#FAF8F4",
          border: "1px solid #E6E2D5",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.7), 0 1px 2px rgba(10,27,44,0.04)",
        }}
      >
        <button
          type="button"
          onClick={() => onChange(Math.max(0, value - 1))}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors hover:bg-[#0F1115]"
          style={{ color: "#B88917" }}
          aria-label={`Decrease ${label}`}
        >
          <Minus size={15} />
        </button>
        <span className="text-[#0A1B2C] text-[15px] font-semibold tabular-nums">{value}</span>
        <button
          type="button"
          onClick={() => onChange(value + 1)}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors hover:bg-[#0F1115] hover:text-[#EBCB6A]"
          style={{ color: "#B88917" }}
          aria-label={`Increase ${label}`}
        >
          <Plus size={15} />
        </button>
      </div>
    </div>
  );
}

const ROOM_CATEGORY_OPTIONS = [
  "Standard",
  "Superior",
  "Premium",
  "Junior Suite",
  "Suite",
] as const;

function RoomRow({
  icon,
  image,
  label,
  value,
  onChange,
  category,
  onCategoryChange,
}: {
  icon?: React.ReactNode;
  image?: string;
  label: string;
  value: number;
  onChange: (v: number) => void;
  category: string;
  onCategoryChange: (c: string) => void;
}) {
  return (
    <div
      className="rounded-[16px] px-4 sm:px-5 py-4 sm:py-4"
      style={{
        backgroundColor: "#FAF8F4",
        border: "1px solid #ECE7DC",
        boxShadow:
          "0 6px 20px -14px rgba(10,27,44,0.20), 0 1px 2px rgba(10,27,44,0.03)",
      }}
    >
      <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] sm:grid-cols-[auto_minmax(0,1fr)_auto_auto] items-center gap-3 sm:gap-6">
        {image ? (
          <div
            className="overflow-hidden shrink-0"
            style={{
              width: 112,
              height: 50,
              borderRadius: 10,
              border: "1px solid #D4AF37",
              boxShadow:
                "0 4px 10px -6px rgba(10,27,44,0.25), 0 1px 2px rgba(10,27,44,0.06), inset 0 0 0 1px rgba(255,255,255,0.35)",
            }}
          >
            <img
              src={image}
              alt=""
              loading="lazy"
              className="w-full h-full object-cover"
              draggable={false}
            />
          </div>
        ) : (
          <LuxIconBadge size={44} finish="engraved">{icon}</LuxIconBadge>
        )}
        <div className="min-w-0 text-[#0A1B2C] text-[15px] sm:text-[16px] font-medium truncate">
          {label}
        </div>
        <div
          className="col-span-3 sm:col-span-1 flex items-center justify-between sm:justify-center rounded-[10px] h-[44px] sm:w-[132px] px-1.5"
          style={{
            backgroundColor: "#FAF8F4",
            border: "1px solid #E6E2D5",
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.7), 0 1px 2px rgba(10,27,44,0.04)",
          }}
        >
          <button
            type="button"
            onClick={() => onChange(Math.max(0, value - 1))}
            className="qty-btn inline-flex h-8 w-8 items-center justify-center"
            aria-label={`Decrease ${label}`}
          >
            <Minus size={15} />
          </button>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={value}
            onChange={(e) => {
              const raw = e.target.value.replace(/\D/g, "");
              const n = raw === "" ? 0 : Math.max(0, Math.min(parseInt(raw, 10), 999));
              onChange(n);
            }}
            onBlur={(e) => {
              if (e.target.value === "") onChange(0);
            }}
            className="w-8 bg-transparent text-center text-[#0A1B2C] text-[15px] font-semibold tabular-nums outline-none"
            aria-label={`${label} quantity`}
          />
          <button
            type="button"
            onClick={() => onChange(value + 1)}
            className="qty-btn inline-flex h-8 w-8 items-center justify-center"
            aria-label={`Increase ${label}`}
          >
            <Plus size={15} />
          </button>
        </div>
        <div className="col-span-3 sm:col-span-1 relative sm:w-[180px]">
          <select
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full appearance-none rounded-[10px] h-[44px] pl-3 pr-9 text-[14px] text-[#0A1B2C] outline-none focus:border-[#D4AF37] focus:shadow-[0_0_0_3px_rgba(212,175,55,0.14)]"
            style={{
              backgroundColor: "#FAF8F4",
              border: "1px solid #E6E2D5",
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.7), 0 1px 2px rgba(10,27,44,0.04)",
            }}
            aria-label={`Preferred category for ${label}`}
          >
            {ROOM_CATEGORY_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
            style={{ color: "#B88917" }}
          />
        </div>
      </div>
    </div>
  );
}

function PremiumRoomIconDefs({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={`${id}-stroke`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FFE7A8" />
        <stop offset="45%" stopColor="#F2C14E" />
        <stop offset="100%" stopColor="#B87912" />
      </linearGradient>
      <linearGradient id={`${id}-hi`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.55" />
        <stop offset="55%" stopColor="#FFFFFF" stopOpacity="0" />
      </linearGradient>
      <filter id={`${id}-glow`} x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="0.35" result="b" />
        <feMerge>
          <feMergeNode in="b" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
  );
}

function SingleRoomIcon({ size = 22 }: { size?: number }) {
  const id = "sglp";
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden
      strokeLinecap="round" strokeLinejoin="round">
      <PremiumRoomIconDefs id={id} />
      <g stroke={`url(#${id}-stroke)`} strokeWidth={1.6} filter={`url(#${id}-glow)`}>
        <circle cx="12" cy="8.2" r="3.4" />
        <path d="M5.2 19.2c0-3.5 3-6 6.8-6s6.8 2.5 6.8 6" />
      </g>
      <g stroke={`url(#${id}-hi)`} strokeWidth={0.6} fill="none">
        <path d="M9.6 6.4c.7-.9 1.6-1.3 2.6-1.3" />
        <path d="M7.4 17.6c.9-1.8 2.6-2.8 4.6-2.9" />
      </g>
    </svg>
  );
}

function DoubleRoomIcon({ size = 22 }: { size?: number }) {
  const id = "dblp";
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden
      strokeLinecap="round" strokeLinejoin="round">
      <PremiumRoomIconDefs id={id} />
      <g stroke={`url(#${id}-stroke)`} strokeWidth={1.55} filter={`url(#${id}-glow)`}>
        <circle cx="8.4" cy="8.4" r="3.1" />
        <circle cx="15.6" cy="8.4" r="3.1" />
        <path d="M2.6 19.2c0-3.2 2.6-5.6 5.8-5.6s5.8 2.4 5.8 5.6" />
        <path d="M9.8 19.2c0-3.2 2.6-5.6 5.8-5.6s5.8 2.4 5.8 5.6" />
      </g>
      <g stroke={`url(#${id}-hi)`} strokeWidth={0.6} fill="none">
        <path d="M6.4 6.7c.5-.7 1.2-1.1 2-1.2" />
        <path d="M13.6 6.7c.5-.7 1.2-1.1 2-1.2" />
      </g>
    </svg>
  );
}

function TripleRoomIcon({ size = 22 }: { size?: number }) {
  const id = "trpp";
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden
      strokeLinecap="round" strokeLinejoin="round">
      <PremiumRoomIconDefs id={id} />
      <g stroke={`url(#${id}-stroke)`} strokeWidth={1.5} filter={`url(#${id}-glow)`}>
        <circle cx="12" cy="7.6" r="2.7" />
        <circle cx="5.4" cy="9" r="2.4" />
        <circle cx="18.6" cy="9" r="2.4" />
        <path d="M6.4 19.2c0-3 2.5-5.2 5.6-5.2s5.6 2.2 5.6 5.2" />
        <path d="M1.6 19.2c0-2.4 1.8-4.2 4-4.4" />
        <path d="M22.4 19.2c0-2.4-1.8-4.2-4-4.4" />
      </g>
      <g stroke={`url(#${id}-hi)`} strokeWidth={0.55} fill="none">
        <path d="M10.3 6.3c.4-.6 1-1 1.7-1" />
      </g>
    </svg>
  );
}

function TwinBedsIcon({ size = 22 }: { size?: number }) {
  const id = "twinp";
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden
      strokeLinecap="round" strokeLinejoin="round">
      <PremiumRoomIconDefs id={id} />
      <defs>
        <linearGradient id={`${id}-fill`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFF4D1" />
          <stop offset="32%" stopColor="#F2C14E" />
          <stop offset="70%" stopColor="#D4A03A" />
          <stop offset="100%" stopColor="#A67416" />
        </linearGradient>
        <linearGradient id={`${id}-dark`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E8B43F" />
          <stop offset="100%" stopColor="#7A4E08" />
        </linearGradient>
        <linearGradient id={`${id}-hi2`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
      </defs>
      <g filter={`url(#${id}-glow)`}>
        {/* left bed */}
        <g>
          <rect x="2.5" y="5.2" width="7" height="6" rx="1.8"
            fill={`url(#${id}-fill)`} stroke={`url(#${id}-stroke)`} strokeWidth={0.45} />
          <rect x="4" y="8.5" width="4" height="2.2" rx="0.6"
            fill={`url(#${id}-fill)`} stroke={`url(#${id}-stroke)`} strokeWidth={0.4} />
          <rect x="2.7" y="10.8" width="6.8" height="5.6" rx="0.55"
            fill={`url(#${id}-fill)`} stroke={`url(#${id}-stroke)`} strokeWidth={0.45} />
          <rect x="2.9" y="16.3" width="0.9" height="1.3" rx="0.25"
            fill={`url(#${id}-dark)`} stroke={`url(#${id}-stroke)`} strokeWidth={0.35} />
          <rect x="8.1" y="16.3" width="0.9" height="1.3" rx="0.25"
            fill={`url(#${id}-dark)`} stroke={`url(#${id}-stroke)`} strokeWidth={0.35} />
          <path d="M3.1 12H9.1" stroke="#8F5E0A" strokeWidth={0.35} strokeOpacity={0.55} strokeLinecap="round" />
          <path d="M2.7 11.1Q6 10.2 9.5 11.1" stroke={`url(#${id}-hi2)`} strokeWidth={0.55} fill="none" />
          <path d="M4.1 8.9Q6 8.5 7.9 8.9" stroke={`url(#${id}-hi2)`} strokeWidth={0.5} fill="none" />
          <path d="M2.8 6Q6 5.3 9.2 6" stroke={`url(#${id}-hi2)`} strokeWidth={0.5} fill="none" />
        </g>
        {/* right bed */}
        <g>
          <rect x="13.1" y="5.2" width="7" height="6" rx="1.8"
            fill={`url(#${id}-fill)`} stroke={`url(#${id}-stroke)`} strokeWidth={0.45} />
          <rect x="14.6" y="8.5" width="4" height="2.2" rx="0.6"
            fill={`url(#${id}-fill)`} stroke={`url(#${id}-stroke)`} strokeWidth={0.4} />
          <rect x="13.3" y="10.8" width="6.8" height="5.6" rx="0.55"
            fill={`url(#${id}-fill)`} stroke={`url(#${id}-stroke)`} strokeWidth={0.45} />
          <rect x="13.5" y="16.3" width="0.9" height="1.3" rx="0.25"
            fill={`url(#${id}-dark)`} stroke={`url(#${id}-stroke)`} strokeWidth={0.35} />
          <rect x="18.7" y="16.3" width="0.9" height="1.3" rx="0.25"
            fill={`url(#${id}-dark)`} stroke={`url(#${id}-stroke)`} strokeWidth={0.35} />
          <path d="M13.7 12H19.7" stroke="#8F5E0A" strokeWidth={0.35} strokeOpacity={0.55} strokeLinecap="round" />
          <path d="M13.3 11.1Q16.6 10.2 20.1 11.1" stroke={`url(#${id}-hi2)`} strokeWidth={0.55} fill="none" />
          <path d="M14.7 8.9Q16.6 8.5 18.5 8.9" stroke={`url(#${id}-hi2)`} strokeWidth={0.5} fill="none" />
          <path d="M13.4 6Q16.6 5.3 19.8 6" stroke={`url(#${id}-hi2)`} strokeWidth={0.5} fill="none" />
        </g>
      </g>
    </svg>
  );
}



function MealOption({
  icon,
  image,
  label,
  selected,
  onClick,
}: {
  icon?: React.ReactNode;
  image?: string;
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "meal-card flex items-center justify-between rounded-[14px] px-4 h-[56px] text-left",
        selected && "meal-card-selected"
      )}
    >
      <span className="flex items-center gap-3">
        {image ? (
          <span
            className="overflow-hidden shrink-0 block"
            style={{
              width: 54,
              height: 40,
              borderRadius: 8,
              border: "1px solid #D4AF37",
              boxShadow:
                "0 3px 8px -5px rgba(10,27,44,0.25), 0 1px 2px rgba(10,27,44,0.06), inset 0 0 0 1px rgba(255,255,255,0.35)",
            }}
          >
            <img src={image} alt="" loading="lazy" className="w-full h-full object-cover" draggable={false} />
          </span>
        ) : (
          <LuxIconBadge size={36} finish="engraved">{icon}</LuxIconBadge>
        )}
        <span className="text-[#0A1B2C] text-[14.5px] font-medium">{label}</span>
      </span>
      <span
        className="relative inline-flex h-5 w-5 items-center justify-center rounded-full"
        style={{
          background: selected
            ? "conic-gradient(from 210deg, #F3DFA2, #C9A24A, #8A6318, #E8CE86, #F3DFA2)"
            : "#FFFFFF",
          padding: selected ? "2px" : "1px",
          boxShadow: selected
            ? "0 0 0 1px rgba(212,175,55,0.22), 0 1px 2px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.55)"
            : "inset 0 0 0 1.5px #CFC4B4, 0 1px 2px rgba(0,0,0,0.04)",
        }}
      >
        <span
          className="flex h-full w-full items-center justify-center rounded-full"
          style={{ background: "#FAF8F4" }}
        >
          {selected && (
            <span
              className="h-2 w-2 rounded-full"
              style={{
                background: "radial-gradient(circle at 30% 30%, #FBEAB0 0%, #D4AF37 55%, #9A6E14 100%)",
                boxShadow: "inset 0 0.5px 0 rgba(255,255,255,0.7), 0 0 3px rgba(212,175,55,0.5)",
              }}
            />
          )}
        </span>
      </span>
    </button>
  );
}

function SummaryRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <LuxIconBadge size={32} tone="onDark">
          {icon}
        </LuxIconBadge>
        <span className="text-white/85 text-[14px]">{label}</span>
      </div>
      <span
        className="text-white text-[16px] font-semibold tabular-nums"
        style={{ fontFamily: SERIF }}
      >
        {value}
      </span>
    </div>
  );
}


/**
 * LuxIconBadge — premium matte-black container with champagne-gold icon.
 * Preserves size prop; icon inherits color via currentColor from the gradient
 * stroke supplied here.
 */
function LuxIconBadge({
  children,
  size = 40,
  tone = "onLight",
  finish = "standard",
}: {
  children: React.ReactNode;
  size?: number;
  tone?: "onLight" | "onDark";
  finish?: "standard" | "engraved";
}) {
  const radius = size >= 40 ? 10 : Math.max(5, Math.round(size * 0.224));

  if (finish === "engraved") {
    const shadow =
      tone === "onDark"
        ? "0 8px 20px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.05), inset 0 -1px 0 rgba(0,0,0,0.45)"
        : "0 6px 18px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.40)";
    const bg = tone === "onDark" ? "#111317" : "#18181A";
    return (
      <span
        className="relative inline-flex shrink-0 items-center justify-center"
        style={{
          width: size,
          height: size,
          borderRadius: radius,
          background: bg,
          boxShadow: shadow,
          color: "#E6C25A",
        }}
      >
        {/* uniform 1.5px champagne-gold frame */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            borderRadius: radius,
            padding: 1.5,
            background: "#D9B65A",
            WebkitMask:
              "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
          }}
        />

        <span
          className="relative"
          style={{
            color: "#EBCB6A",
            filter:
              "drop-shadow(0 1px 0 rgba(255,255,255,0.10)) drop-shadow(0 1px 1px rgba(0,0,0,0.35))",
          }}
        >
          {children}
        </span>
      </span>
    );
  }

  const shadow =
    tone === "onDark"
      ? "0 8px 20px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.4)"
      : "0 6px 18px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 0 rgba(0,0,0,0.35)";
  const bg =
    tone === "onDark"
      ? "linear-gradient(180deg,#1A1D24 0%, #101319 55%, #0B0D12 100%)"
      : "linear-gradient(180deg,#262626 0%, #111111 100%)";
  const borderColor =
    tone === "onDark" ? "rgba(212,175,55,0.22)" : "rgba(212,175,55,0.28)";
  return (
    <span
      className="relative inline-flex shrink-0 items-center justify-center"
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        background: bg,
        border: `1px solid ${borderColor}`,
        boxShadow: shadow,
        color: "#E6C25A",
      }}
    >
      {/* soft inner highlight */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          borderRadius: radius,
          background:
            "radial-gradient(120% 60% at 50% 0%, rgba(247,231,166,0.16) 0%, rgba(247,231,166,0) 55%)",
        }}
      />
      <span
        className="relative"
        style={{
          color: "#EBCB6A",
          filter:
            "drop-shadow(0 1px 0 rgba(255,255,255,0.10)) drop-shadow(0 1px 1px rgba(0,0,0,0.35))",
        }}
      >
        {children}
      </span>
    </span>
  );
}

/* ============================================================
   Step 4 – Catering
   ============================================================ */

type CateringId =
  | "coffee"
  | "fruit"
  | "snacks"
  | "morning-break"
  | "lunch"
  | "afternoon-break"
  | "dinner"
  | "bar-drinks"
  | "gala-dinner";

type CateringDef = {
  id: CateringId;
  label: string;
  image: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; style?: React.CSSProperties }>;
  defaultTime: string;
  defaultLocation: string;
  variants?: { default: string; options: string[] };
};

const CATERING_DEFS: CateringDef[] = [
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

const HOTEL_LOCATIONS = [
  "Restaurant",
  "Private Dining Room",
  "Lobby Lounge",
  "Outdoor Terrace",
  "Other (please specify)",
];

type CateringServing = {
  id: string;
  catering: CateringId;
  time: string;
  location: string;
  locationOther?: string;
  variant?: string;
  included: boolean;
};

type MeetingRoomLite = { id: string; name: string; attendees: number };

const DIETARY_OPTIONS = [
  "Vegetarian",
  "Vegan",
  "Gluten Free",
  "Lactose Free",
  "Halal",
  "Kosher",
  "Nut Allergy",
  "Other",
];

const DRINK_OPTIONS = [
  "Coffee & Tea",
  "Soft Drinks",
  "Beer",
  "Wine",
  "Private Bar",
  "Welcome Drink",
];

function CateringCarousel({
  defs,
  selected,
  onToggle,
}: {
  defs: CateringDef[];
  selected: Record<CateringId, boolean>;
  onToggle: (id: CateringId) => void;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const dragRef = useRef<{ down: boolean; startX: number; startScroll: number; moved: boolean }>({
    down: false,
    startX: 0,
    startScroll: 0,
    moved: false,
  });

  const updateEdges = () => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    updateEdges();
    const el = scrollerRef.current;
    if (!el) return;
    const onScroll = () => updateEdges();
    el.addEventListener("scroll", onScroll, { passive: true });
    const ro = new ResizeObserver(updateEdges);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", onScroll);
      ro.disconnect();
    };
  }, []);

  // Scroll selected card into view if off-screen
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const lastSelected = defs.find((d) => selected[d.id] && !!selected[d.id]);
    if (!lastSelected) return;
    const target = el.querySelector<HTMLElement>(`[data-cid="${lastSelected.id}"]`);
    if (!target) return;
    const eLeft = target.offsetLeft;
    const eRight = eLeft + target.offsetWidth;
    if (eLeft < el.scrollLeft || eRight > el.scrollLeft + el.clientWidth) {
      target.scrollIntoView({ block: "nearest", inline: "center" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  const scrollByCards = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-cid]");
    const cardW = card ? card.offsetWidth + 16 : 220;
    el.scrollBy({ left: dir * cardW * 2.5 });
  };

  return (
    <div className="relative mt-8">
      {/* Left arrow */}
      {canPrev && (
        <button
          type="button"
          aria-label="Previous catering options"
          onClick={() => scrollByCards(-1)}
          className="absolute left-1 top-1/2 -translate-y-1/2 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:brightness-105"
          style={{
            background: "rgba(252,250,243,0.96)",
            border: "1px solid #E3D2A1",
            boxShadow: "0 6px 16px -8px rgba(10,27,44,0.25)",
          }}
        >
          <ChevronLeft size={18} style={{ color: "#B88A2E" }} />
        </button>
      )}
      {/* Right arrow */}
      {canNext && (
        <button
          type="button"
          aria-label="Next catering options"
          onClick={() => scrollByCards(1)}
          className="absolute right-1 top-1/2 -translate-y-1/2 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:brightness-105"
          style={{
            background: "rgba(252,250,243,0.96)",
            border: "1px solid #E3D2A1",
            boxShadow: "0 6px 16px -8px rgba(10,27,44,0.25)",
          }}
        >
          <ChevronRight size={18} style={{ color: "#B88A2E" }} />
        </button>
      )}

      {/* Left fade */}
      {canPrev && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-10 z-10"
          style={{
            background:
              "linear-gradient(to right, rgba(255,255,255,0.9), rgba(255,255,255,0))",
          }}
        />
      )}
      {/* Right fade */}
      {canNext && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-10 z-10"
          style={{
            background:
              "linear-gradient(to left, rgba(255,255,255,0.9), rgba(255,255,255,0))",
          }}
        />
      )}

      <div
        ref={scrollerRef}
        className="catering-scroller flex gap-4 overflow-x-auto overflow-y-hidden pb-2 -mx-1 px-1 select-none"
        style={{
          scrollSnapType: "x mandatory",
          scrollbarWidth: "thin",
          scrollbarColor: "#E3D2A1 transparent",
          WebkitOverflowScrolling: "touch",
          scrollPaddingLeft: "4px",
          scrollPaddingRight: "4px",
        }}
        onMouseDown={(e) => {
          const el = scrollerRef.current;
          if (!el) return;
          dragRef.current = {
            down: true,
            startX: e.pageX,
            startScroll: el.scrollLeft,
            moved: false,
          };
        }}
        onMouseMove={(e) => {
          const d = dragRef.current;
          if (!d.down) return;
          const el = scrollerRef.current;
          if (!el) return;
          const dx = e.pageX - d.startX;
          if (Math.abs(dx) > 4) d.moved = true;
          el.scrollLeft = d.startScroll - dx;
        }}
        onMouseUp={() => {
          dragRef.current.down = false;
        }}
        onMouseLeave={() => {
          dragRef.current.down = false;
        }}
        onWheel={(e) => {
          const el = scrollerRef.current;
          if (!el) return;
          if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
            el.scrollLeft += e.deltaY;
          }
        }}
      >
        {defs.map((def) => {
          const isOn = !!selected[def.id];
          const Icon = def.icon;
          return (
            <button
              key={def.id}
              data-cid={def.id}
              type="button"
              onClick={() => {
                if (dragRef.current.moved) {
                  dragRef.current.moved = false;
                  return;
                }
                onToggle(def.id);
              }}
              aria-pressed={isOn}
              className="group relative overflow-hidden rounded-[12px] text-left transition-all shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              style={{
                width: "clamp(150px, 14vw, 180px)",
                scrollSnapAlign: "start",
                background: "#FCFAF3",
                border: isOn ? "1.5px solid #C79A32" : "1px solid #ECE6D6",
                boxShadow: isOn
                  ? "0 10px 24px -14px rgba(184,138,46,0.45), 0 2px 6px -2px rgba(10,27,44,0.06)"
                  : "0 6px 18px -14px rgba(10,27,44,0.10)",
              }}
            >
              <div
                className="w-full overflow-hidden"
                style={{ aspectRatio: "4 / 3" }}
                aria-hidden
              >
                <img
                  src={def.image}
                  alt=""
                  draggable={false}
                  className="h-full w-full object-cover object-center pointer-events-none"
                />
              </div>
              <div className="p-2.5 pt-2 flex flex-col items-center gap-1">
                <Icon size={18} strokeWidth={1.6} style={{ color: "#B88A2E" }} />
                <span className="text-[12.5px] font-medium text-[#0A1B2C] text-center leading-tight">
                  {def.label}
                </span>
              </div>
              {isOn && (
                <span
                  className="absolute top-2 right-2 inline-flex h-5 w-5 items-center justify-center rounded-full"
                  style={{
                    background:
                      "linear-gradient(180deg,#F7D97A 0%, #D4AF37 55%, #B88917 100%)",
                    boxShadow: "0 2px 6px -2px rgba(184,138,46,0.55)",
                  }}
                >
                  <Check size={12} strokeWidth={3} style={{ color: "#0A1B2C" }} />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}


function StepFourCatering({
  onBack,
  onNext,
  direction,
}: {
  onBack: () => void;
  onNext: () => void;
  direction: "forward" | "back";
}) {
  // Load persisted data from previous steps
  const [meetingRooms, setMeetingRooms] = useState<MeetingRoomLite[]>([]);
  const [guestCount, setGuestCount] = useState<number>(0);
  const [recommended, setRecommended] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const rr = window.localStorage.getItem("hgb:meeting-rooms");
      if (rr) {
        const parsed = JSON.parse(rr) as MeetingRoomLite[];
        if (Array.isArray(parsed)) setMeetingRooms(parsed);
      }
      const gc = window.localStorage.getItem("hgb:guest-count");
      const attn = window.localStorage.getItem("hgb:attendees");
      const g = Number(gc) || Number(attn) || 0;
      setGuestCount(g);
      const rec = window.localStorage.getItem("hgb:catering-recommended");
      if (rec) {
        const arr = JSON.parse(rec) as string[];
        if (Array.isArray(arr)) setRecommended(arr);
      }
      const saved = window.localStorage.getItem("hgb:catering-state");
      if (saved) {
        const st = JSON.parse(saved);
        if (st?.selected) setSelected(st.selected);
        if (st?.servings) setServings(st.servings);
        if (st?.dietary) setDietary(st.dietary);
        if (st?.dietaryOther) setDietaryOther(st.dietaryOther);
        if (st?.drinks) setDrinks(st.drinks);
        if (st?.notes) setNotes(st.notes);
      }
    } catch {
      /* non-fatal */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fallback demo rooms if none persisted, so page is usable when landing directly.
  const effectiveRooms: MeetingRoomLite[] = useMemo(() => {
    if (meetingRooms.length) return meetingRooms;
    return [
      { id: "m1", name: "Main Conference Room", attendees: guestCount || 65 },
      { id: "m2", name: "Breakout Room A", attendees: 20 },
      { id: "m3", name: "Breakout Room B", attendees: 20 },
    ];
  }, [meetingRooms, guestCount]);

  const effectiveGuests = guestCount || effectiveRooms[0]?.attendees || 0;

  const [selected, setSelected] = useState<Record<CateringId, boolean>>(
    {} as Record<CateringId, boolean>,
  );
  const [servings, setServings] = useState<CateringServing[]>([]);
  const [dietary, setDietary] = useState<string[]>([]);
  const [dietaryOther, setDietaryOther] = useState("");
  const [drinks, setDrinks] = useState<string[]>(["Coffee & Tea", "Wine"]);
  const [notes, setNotes] = useState("");
  const [openLocId, setOpenLocId] = useState<string | null>(null);
  const [openVariantId, setOpenVariantId] = useState<string | null>(null);
  const [recommendationVisible, setRecommendationVisible] = useState(true);
  const [recommendationRendered, setRecommendationRendered] = useState(true);

  // Persist state
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(
        "hgb:catering-state",
        JSON.stringify({ selected, servings, dietary, dietaryOther, drinks, notes }),
      );
    } catch {
      /* non-fatal */
    }
  }, [selected, servings, dietary, dietaryOther, drinks, notes]);

  // Commit catering into shared draft.
  useEffect(() => {
    setMeSection(
      "catering",
      servings.map((s) => {
        const def = CATERING_DEFS.find((d) => d.id === s.catering);
        return {
          servingId: s.id,
          cateringId: s.catering,
          label: def?.label ?? s.catering,
          time: s.time,
          location: s.location,
          locationOther: s.locationOther,
          variant: s.variant,
        };
      }),
    );
  }, [servings]);

  useEffect(() => {
    setMeSection("cateringExtras", { dietary, dietaryOther, drinks, notes });
  }, [dietary, dietaryOther, drinks, notes]);

  const locationOptions = useMemo(
    () => [...effectiveRooms.map((r) => r.name), ...HOTEL_LOCATIONS],
    [effectiveRooms],
  );

  const findDef = (id: CateringId) => CATERING_DEFS.find((d) => d.id === id)!;

  const addServingForCatering = (id: CateringId) => {
    const def = findDef(id);
    const newId =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `s_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    setServings((prev) => [
      ...prev,
      {
        id: newId,
        catering: id,
        time: def.defaultTime,
        location: def.defaultLocation,
        variant: undefined,
        included: true,
      },
    ]);
    setSelected((prev) => (prev[id] ? prev : { ...prev, [id]: true }));
    if (def.variants) setOpenVariantId(newId);
    else setOpenVariantId(null);
    return newId;
  };

  const toggleCatering = (id: CateringId) => {
    const existingList = servings.filter((s) => s.catering === id);
    if (existingList.length > 0) {
      // Already selected → clicking the card again deselects it entirely
      // (removes all servings for this catering type and closes any open variant).
      setServings((prev) => prev.filter((s) => s.catering !== id));
      setSelected((sel) => ({ ...sel, [id]: false }));
      setOpenVariantId((cur) =>
        existingList.some((s) => s.id === cur) ? null : cur,
      );
      return;
    }
    addServingForCatering(id);
  };


  const updateServing = (id: string, patch: Partial<CateringServing>) => {
    setServings((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  };

  const removeServing = (id: string) => {
    setServings((prev) => {
      const removed = prev.find((s) => s.id === id);
      const next = prev.filter((s) => s.id !== id);
      if (removed && !next.some((s) => s.catering === removed.catering)) {
        setSelected((sel) => ({ ...sel, [removed.catering]: false }));
      }
      return next;
    });
    setOpenVariantId((cur) => (cur === id ? null : cur));
  };

  const addAnotherServing = () => {
    const base = servings[servings.length - 1];
    const cid = base?.catering ?? "coffee";
    addServingForCatering(cid);
  };

  const applyRecommendation = () => {
    const wanted: CateringId[] = ["coffee", "lunch"];
    wanted.forEach((id) => {
      const existing = servings.find((s) => s.catering === id);
      if (!existing) {
        addServingForCatering(id);
      } else {
        const def = findDef(id);
        if (def.variants && !existing.variant) {
          setOpenVariantId(existing.id);
        }
      }
    });
  };

  const dismissRecommendation = () => {
    setRecommendationVisible(false);
    setTimeout(() => setRecommendationRendered(false), 300);
  };

  const toggleFrom = (
    val: string,
    list: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>,
  ) => {
    setter((prev) =>
      prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val],
    );
  };
  void toggleFrom;

  // Group servings by location for overview
  const overviewGroups = useMemo(() => {
    const map = new Map<string, { time: string; label: string }[]>();
    // seed with all effective rooms
    effectiveRooms.forEach((r) => map.set(r.name, []));
    servings
      .filter((s) => s.included)
      .forEach((s) => {
        const def = findDef(s.catering);
        const loc =
          s.location === "Other (please specify)"
            ? s.locationOther?.trim() || "Other"
            : s.location;
        const label = s.variant ? `${def.label} (${s.variant})` : def.label;
        const arr = map.get(loc) ?? [];
        arr.push({ time: s.time, label });
        map.set(loc, arr);
      });
    // sort each group by time
    return Array.from(map.entries()).map(([loc, items]) => ({
      loc,
      items: items.sort((a, b) => a.time.localeCompare(b.time)),
    }));
  }, [servings, effectiveRooms]);

  const locationsWithCatering = overviewGroups.filter((g) => g.items.length > 0).length;

  return (
    <div
      className={
        ""
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        {/* LEFT — main panel */}
        <div
          className="overflow-hidden rounded-[20px] p-6 sm:p-8 lg:p-10"
          style={{
            backgroundColor: "#FAF8F4",
            backgroundImage:
              "linear-gradient(180deg, #FCFAF5 0%, #F8F5EE 55%, #F3EFE6 100%)",
            boxShadow:
              "inset 0 1px 0 rgba(255,251,240,0.7), 0 1px 0 rgba(90,72,44,0.05), 0 20px 44px -34px rgba(60,48,28,0.14)",
            border: "1px solid #E7DFCE",
          }}
        >
          {/* Header row */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div>
              <button
                type="button"
                onClick={onBack}
                className="mb-4 inline-flex items-center gap-2 text-[13px] font-medium text-[#0A1B2C] hover:text-[#B88A2E] transition-colors"
              >
                <ArrowLeft size={16} /> Back
              </button>
              <h2
                className="text-[#0A1B2C] text-3xl lg:text-[34px] leading-tight"
                style={{ fontFamily: SERIF }}
              >
                Step 4 – Catering
              </h2>
              <div className="mt-2 h-[2px] w-16" style={{ backgroundColor: GOLD }} />
              <p className="mt-4 text-[#4A5866] text-[15px] max-w-xl leading-relaxed">
                Select the catering you would like to include in your event and
                choose where it should be served.
              </p>
            </div>

            {/* Apply Recommendation card */}
            {recommendationRendered && (
              <div
                className={cn(
                   "rounded-[14px] p-5 w-full lg:w-[380px] transition-opacity duration-300 ease-out origin-top",
                  recommendationVisible
                    ? "opacity-100"
                    : "opacity-0 pointer-events-none"
                )}
                style={{
                  background:
                    "linear-gradient(180deg, #FFFDF6 0%, #FBF6E7 100%)",
                  border: "1px solid #EBDDB4",
                  boxShadow: "0 10px 26px -18px rgba(184,138,46,0.35)",
                }}
              >
                <div className="flex items-center gap-2">
                  <Sparkles size={16} style={{ color: "#B88A2E" }} />
                  <span
                    className="text-[15px] font-semibold"
                    style={{ color: "#7C5A16", fontFamily: SERIF }}
                  >
                    Apply Recommendation
                  </span>
                </div>
                <p className="mt-1.5 text-[12.5px] leading-relaxed text-[#6E5A2E]">
                  Based on {effectiveGuests || "your"} guests and your selected
                  rooms, we recommend:
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center rounded-full border px-3 h-8 text-[12px] font-medium text-[#0A1B2C] bg-white" style={{ borderColor: "#E3D2A1" }}>
                    Morning Coffee Break
                  </span>
                  <span className="inline-flex items-center rounded-full border px-3 h-8 text-[12px] font-medium text-[#0A1B2C] bg-white" style={{ borderColor: "#E3D2A1" }}>
                    Lunch (Buffet)
                  </span>
                </div>
                <div className="mt-4 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={dismissRecommendation}
                    className="inline-flex items-center justify-center rounded-full h-8 px-4 text-[12.5px] font-semibold text-[#3A3A3A] transition-all duration-200 hover:bg-[#F7F4EC] hover:shadow-md"
                    style={{
                      background: "#FDFBF6",
                      border: "1px solid #D9C07A",
                      boxShadow: "0 4px 10px -4px rgba(184,138,46,0.18), inset 0 1px 0 rgba(255,255,255,0.8)",
                    }}
                  >
                    No, thanks
                  </button>
                  <button
                    type="button"
                    onClick={applyRecommendation}
                    className="inline-flex items-center gap-1.5 rounded-full h-8 px-4 text-[12.5px] font-semibold text-[#0A1B2C] transition-all duration-200 hover:brightness-105"
                    style={{
                      background:
                        "linear-gradient(180deg,#F7D97A 0%, #D4AF37 55%, #B88917 100%)",
                      border: "1px solid rgba(184,137,23,0.85)",
                      boxShadow:
                        "inset 0 1px 0 rgba(255,255,255,0.45), 0 6px 14px -8px rgba(184,137,23,0.55)",
                    }}
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Catering cards */}
          <CateringCarousel
            defs={CATERING_DEFS}
            selected={selected}
            onToggle={toggleCatering}
          />


          {/* Plan & Choose Where to Serve */}
          <div
            className="mt-8 rounded-[14px] p-5 sm:p-6"
            style={{ background: "#FBFAF6", border: "1px solid #ECE6D6" }}
          >
            <h3
              className="text-[15.5px] font-semibold text-[#0A1B2C]"
              style={{ fontFamily: SANS }}
            >
              Plan &amp; Choose Where to Serve
            </h3>

            {servings.length === 0 ? (
              <p className="mt-3 text-[13.5px] text-[#6E7A88]">
                Select one or more catering options above to plan servings.
              </p>
            ) : (
              <>
                <div className="mt-4 hidden md:grid grid-cols-[minmax(180px,1.2fr)_120px_1fr_44px_44px] gap-3 text-[12px] font-semibold uppercase tracking-wide text-[#6E7A88]">
                  <span>Selected Catering</span>
                  <span>When</span>
                  <span className="flex items-center gap-1.5">
                    Serving Location <Info size={12} />
                  </span>
                  <span />
                  <span />
                </div>

                <div className="mt-3 flex flex-col gap-2.5">
                  {servings.map((s) => {
                    const def = findDef(s.catering);
                    const Icon = def.icon;
                    const isOpen = def.variants && openVariantId === s.id;
                    return (
                      <div key={s.id} className="flex flex-col">
                      <div
                        className="grid grid-cols-1 md:grid-cols-[minmax(180px,1.2fr)_120px_1fr_44px_44px] gap-3 items-center rounded-[10px] px-3 py-2.5"
                        style={{
                          background: "#FAF8F4",
                          border: "1px solid #E7DFCE",
                          borderBottomLeftRadius: isOpen ? 0 : 10,
                          borderBottomRightRadius: isOpen ? 0 : 10,
                        }}
                      >
                        {/* Label + thumbnail */}
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className="h-10 w-10 shrink-0 rounded-md bg-cover bg-center"
                            style={{ backgroundImage: `url(${def.image})` }}
                            aria-hidden
                          />
                          <div className="min-w-0">
                            <div className="text-[14px] font-medium text-[#0A1B2C] truncate flex items-center gap-1.5">
                              <Icon size={13} style={{ color: "#B88A2E" }} />
                              {def.label}
                            </div>
                            {def.variants && (
                              <button
                                type="button"
                                onClick={() =>
                                  setOpenVariantId(openVariantId === s.id ? null : s.id)
                                }
                                className="mt-0.5 inline-flex items-center gap-1 text-[11.5px] text-[#6E7A88] hover:text-[#B88A2E]"
                                aria-expanded={openVariantId === s.id}
                              >
                                {s.variant ?? def.variants.default}
                                <ChevronDown
                                  size={11}
                                  style={{
                                    transition: "transform 240ms ease",
                                    transform:
                                      openVariantId === s.id ? "rotate(180deg)" : "none",
                                  }}
                                />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* When */}
                        <div className="relative">
                          <Clock
                            size={13}
                            className="absolute left-2.5 top-1/2 -translate-y-1/2"
                            style={{ color: "#B88A2E" }}
                          />
                          <input
                            type="time"
                            value={s.time}
                            onChange={(e) => updateServing(s.id, { time: e.target.value })}
                            className="w-full h-[38px] rounded-md text-[13px] text-[#0A1B2C] pl-8 pr-2 outline-none"
                            style={{ background: "#FAF8F4", border: "1px solid #E8E0D3" }}
                          />
                        </div>

                        {/* Serving location dropdown */}
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() =>
                              setOpenLocId(openLocId === s.id ? null : s.id)
                            }
                            className="w-full h-[38px] rounded-md pl-8 pr-8 text-left text-[13px] text-[#0A1B2C] flex items-center"
                            style={{
                              background: "#FAF8F4",
                              border: "1px solid #E8E0D3",
                            }}
                          >
                            <MapPin
                              size={13}
                              className="absolute left-2.5 top-1/2 -translate-y-1/2"
                              style={{ color: "#B88A2E" }}
                            />
                            <span className="truncate">
                              {s.location === "Other (please specify)"
                                ? s.locationOther || "Other (please specify)"
                                : s.location}
                            </span>
                            <ChevronDown
                              size={14}
                              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#6E7A88]"
                            />
                          </button>
                          {openLocId === s.id && (
                            <div
                              className="absolute z-30 mt-1 w-full rounded-md py-1 text-[13px] max-h-[240px] overflow-auto"
                              style={{
                                background: "#FAF8F4",
                                border: "1px solid #E7DEC4",
                                boxShadow:
                                  "0 12px 28px -14px rgba(10,27,44,0.20)",
                              }}
                            >
                              {locationOptions.map((opt) => (
                                <button
                                  key={opt}
                                  type="button"
                                  onClick={() => {
                                    updateServing(s.id, { location: opt });
                                    setOpenLocId(null);
                                  }}
                                  className="flex w-full items-center gap-2 px-3 py-1.5 text-left hover:bg-[#FBF6E7] text-[#0A1B2C]"
                                >
                                  <MapPin size={12} style={{ color: "#B88A2E" }} />
                                  {opt}
                                </button>
                              ))}
                            </div>
                          )}
                          {s.location === "Other (please specify)" && (
                            <input
                              type="text"
                              placeholder="Specify location"
                              value={s.locationOther ?? ""}
                              onChange={(e) =>
                                updateServing(s.id, { locationOther: e.target.value })
                              }
                              className="mt-1.5 w-full h-[32px] rounded-md px-2 text-[12.5px] text-[#0A1B2C] outline-none"
                              style={{
                                background: "#FAF8F4",
                                border: "1px solid #E8E0D3",
                              }}
                            />
                          )}
                        </div>

                        {/* Included toggle */}
                        <button
                          type="button"
                          onClick={() =>
                            updateServing(s.id, { included: !s.included })
                          }
                          aria-pressed={s.included}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-md justify-self-start md:justify-self-center"
                          style={{
                            background: s.included
                              ? "linear-gradient(180deg,#F7D97A 0%, #D4AF37 55%, #B88917 100%)"
                              : "#F4F1E7",
                            border: s.included
                              ? "1px solid rgba(184,137,23,0.85)"
                              : "1px solid #E4DDC8",
                          }}
                          title={s.included ? "Included" : "Excluded"}
                        >
                          {s.included ? (
                            <Check size={14} strokeWidth={3} style={{ color: "#0A1B2C" }} />
                          ) : (
                            <Minus size={14} style={{ color: "#6E7A88" }} />
                          )}
                        </button>

                        {/* Remove */}
                        <button
                          type="button"
                          onClick={() => removeServing(s.id)}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-md text-[#6E7A88] hover:bg-[#F4EDE0]"
                          style={{ border: "1px solid #E7E1CE" }}
                          title="Remove"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      {isOpen && def.variants && (
                        <div
                          className="rounded-b-[10px] px-4 sm:px-5 pt-4 pb-5"
                          style={{
                            background: "#FBFAF6",
                            borderLeft: "1px solid #EFEAD8",
                            borderRight: "1px solid #EFEAD8",
                            borderBottom: "1px solid #EFEAD8",
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className="text-[13px] font-semibold text-[#0A1B2C]"
                              style={{ fontFamily: SANS }}
                            >
                              Choose menu type
                            </span>
                            <span
                              aria-hidden
                              className="h-px flex-1"
                              style={{
                                background:
                                  "linear-gradient(90deg, rgba(184,138,46,0.35), rgba(184,138,46,0))",
                              }}
                            />
                          </div>
                          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                            {def.variants.options.map((v) => {
                              const selected = (s.variant ?? def.variants!.default) === v;
                              return (
                                <button
                                  key={v}
                                  type="button"
                                  onClick={() => {
                                    updateServing(s.id, { variant: v });
                                    setOpenVariantId(null);
                                  }}
                                  className="group relative flex items-center gap-2.5 rounded-[10px] px-3 py-2.5 text-left transition"
                                  style={{
                                    background: "#FFFDF7",
                                    border: selected
                                      ? "1.5px solid #C9A24B"
                                      : "1px solid #E7DEC4",
                                    boxShadow: selected
                                      ? "0 6px 18px -10px rgba(184,138,46,0.45), inset 0 0 0 1px rgba(255,255,255,0.6)"
                                      : "0 1px 2px rgba(10,27,44,0.04)",
                                  }}
                                  aria-pressed={selected}
                                >
                                  <span
                                    className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full"
                                    style={{
                                      border: selected
                                        ? "1.5px solid #B88A2E"
                                        : "1.5px solid #D9C79A",
                                      background: "#FAF8F4",
                                    }}
                                  >
                                    {selected && (
                                      <span
                                        className="h-2 w-2 rounded-full"
                                        style={{
                                          background:
                                            "linear-gradient(180deg,#F7D97A 0%, #D4AF37 55%, #B88917 100%)",
                                        }}
                                      />
                                    )}
                                  </span>
                                  <span
                                    className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md"
                                    style={{
                                      background:
                                        "linear-gradient(180deg,#FBF3DE 0%, #F3E4B8 100%)",
                                      border: "1px solid #E6D3A0",
                                    }}
                                  >
                                    {/Chef/i.test(v) ? (
                                      <ChefHat size={12} style={{ color: "#8A6516" }} />
                                    ) : /Buffet/i.test(v) ? (
                                      <UtensilsCrossed
                                        size={12}
                                        style={{ color: "#8A6516" }}
                                      />
                                    ) : (
                                      <Utensils size={12} style={{ color: "#8A6516" }} />
                                    )}
                                  </span>
                                  <span
                                    className="text-[13px] font-medium text-[#0A1B2C]"
                                    style={{ fontFamily: SANS }}
                                  >
                                    {v}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                      </div>
                    );
                  })}
                </div>


                <button
                  type="button"
                  onClick={addAnotherServing}
                  className="mt-4 inline-flex items-center gap-1.5 rounded-md px-3.5 h-[36px] text-[13px] font-medium text-[#B88A2E] hover:bg-[#FBF6E7]"
                  style={{ border: "1px solid #E3D2A1", background: "#FFFDF6" }}
                >
                  <Plus size={14} /> Add Another Serving
                </button>
              </>
            )}
          </div>

          {/* Bottom row: dietary / drinks / additional */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Dietary Requirements */}
            <div
              className="rounded-[12px] p-4"
              style={{ background: "#FAF8F4", border: "1px solid #E7DFCE" }}
            >
              <div className="flex items-center gap-2">
                <ShieldCheck size={15} style={{ color: "#B88A2E" }} />
                <h4 className="text-[14.5px] font-semibold text-[#0A1B2C]">
                  Dietary Requirements
                </h4>
              </div>
              <p className="mt-0.5 text-[11.5px] text-[#8A8471]">Select all that apply</p>
              <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2">
                {DIETARY_OPTIONS.map((opt) => (
                  <SquareCheckbox
                    key={opt}
                    label={opt}
                    checked={dietary.includes(opt)}
                    onChange={() =>
                      setDietary((prev) =>
                        prev.includes(opt) ? prev.filter((v) => v !== opt) : [...prev, opt],
                      )
                    }
                  />
                ))}
              </div>
              {dietary.includes("Other") && (
                <input
                  type="text"
                  value={dietaryOther}
                  onChange={(e) => setDietaryOther(e.target.value)}
                  placeholder="Please specify"
                  className="mt-2.5 w-full h-[34px] rounded-md px-2.5 text-[12.5px] text-[#0A1B2C] outline-none"
                  style={{ background: "#FAF8F4", border: "1px solid #E8E0D3" }}
                />
              )}
            </div>

            {/* Drinks */}
            <div
              className="rounded-[12px] p-4"
              style={{ background: "#FAF8F4", border: "1px solid #E7DFCE" }}
            >
              <div className="flex items-center gap-2">
                <GlassWater size={15} style={{ color: "#B88A2E" }} />
                <h4 className="text-[14.5px] font-semibold text-[#0A1B2C]">Drinks</h4>
              </div>
              <p className="mt-0.5 text-[11.5px] text-[#8A8471]">Select all that apply</p>
              <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2">
                {DRINK_OPTIONS.map((opt) => (
                  <SquareCheckbox
                    key={opt}
                    label={opt}
                    checked={drinks.includes(opt)}
                    onChange={() =>
                      setDrinks((prev) =>
                        prev.includes(opt) ? prev.filter((v) => v !== opt) : [...prev, opt],
                      )
                    }
                  />
                ))}
              </div>
            </div>

            {/* Additional Requests */}
            <div
              className="rounded-[12px] p-4"
              style={{ background: "#FAF8F4", border: "1px solid #E7DFCE" }}
            >
              <div className="flex items-center gap-2">
                <Pencil size={14} style={{ color: "#B88A2E" }} />
                <h4 className="text-[14.5px] font-semibold text-[#0A1B2C]">
                  Additional Requests
                </h4>
              </div>
              <p className="mt-0.5 text-[11.5px] text-[#8A8471]">
                Anything we should know about your catering?
              </p>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value.slice(0, 500))}
                rows={5}
                placeholder="Tell us about allergies, menu wishes, themed dinners, receptions or any other catering requests..."
                className="mt-2 w-full resize-none rounded-md p-2.5 text-[12.5px] text-[#0A1B2C] outline-none"
                style={{ background: "#FAF8F4", border: "1px solid #E8E0D3" }}
              />
              <div className="mt-1 text-right text-[11px] text-[#9C9484]">
                {notes.length} / 500
              </div>
            </div>
          </div>

          {/* Footer nav */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center justify-center gap-2 rounded-md border px-6 h-[48px] text-[15px] font-medium text-[#0A1B2C] bg-white hover:bg-[#F5EFE1] transition-colors"
              style={{ borderColor: "#D9D3C4" }}
            >
              Back
            </button>
            <NextButton onClick={onNext} label="Next Step" />
          </div>
        </div>

        {/* RIGHT — Catering Overview */}
        <aside className="self-start">
          <div
            className="rounded-[16px] p-5 text-white"
            style={{
              background:
                "linear-gradient(180deg,#112842 0%, #0F2239 55%, #0D1D31 100%)",
              border: "1px solid rgba(255,255,255,0.06)",
              boxShadow: "0 20px 40px -20px rgba(10,27,44,0.35)",
            }}
          >
            <div className="flex items-center gap-2">
              <ChefHat size={16} style={{ color: GOLD }} />
              <h3
                className="text-[16px] font-semibold"
                style={{ fontFamily: SERIF, color: "#F5EFE1" }}
              >
                Your Catering Overview
              </h3>
            </div>
            <div
              className="mt-3 h-px w-full"
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.55) 50%, transparent 100%)",
              }}
            />

            <div className="mt-4 flex flex-col gap-4">
              {overviewGroups.map((g) => {
                const room = effectiveRooms.find((r) => r.name === g.loc);
                return (
                  <div key={g.loc}>
                    <div className="flex items-center justify-between">
                      <span className="text-[13.5px] font-semibold text-white">
                        {g.loc}
                      </span>
                      {room && (
                        <span className="inline-flex items-center gap-1 text-[12px] text-[#C9CCD1]">
                          <Users size={12} style={{ color: GOLD }} /> {room.attendees}
                        </span>
                      )}
                    </div>
                    {g.items.length === 0 ? (
                      <div className="mt-1.5 text-[12px] text-[#9AA3AF]">
                        No catering selected
                      </div>
                    ) : (
                      <div className="mt-2 flex flex-col gap-1.5">
                        {g.items.map((it, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-2 text-[12.5px]"
                          >
                            <Clock size={12} style={{ color: GOLD }} />
                            <span className="text-[#C9CCD1] w-[46px]">{it.time}</span>
                            <span className="text-white">{it.label}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    <div
                      className="mt-3 h-px w-full"
                      style={{
                        background:
                          "linear-gradient(90deg, rgba(212,175,55,0.16) 0%, rgba(212,175,55,0.28) 50%, rgba(212,175,55,0.10) 100%)",
                      }}
                    />
                  </div>
                );
              })}
            </div>

            <div className="mt-4 flex items-center justify-between text-[12.5px]">
              <span className="inline-flex items-center gap-1.5 text-[#C9CCD1]">
                <Users size={13} style={{ color: GOLD }} /> Total Guests
              </span>
              <span className="text-white font-semibold">{effectiveGuests || "—"}</span>
            </div>
            <div className="mt-1.5 flex items-center justify-between text-[12.5px]">
              <span className="inline-flex items-center gap-1.5 text-[#C9CCD1]">
                <MapPin size={13} style={{ color: GOLD }} /> Locations with Catering
              </span>
              <span className="text-white font-semibold">
                {locationsWithCatering}
              </span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

/* Premium square checkbox used inside Catering panel */
function SquareCheckbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="inline-flex items-center gap-2 cursor-pointer select-none">
      <span
        onClick={onChange}
        className="inline-flex h-[16px] w-[16px] shrink-0 items-center justify-center rounded-[3px] transition-all"
        style={{
          background: checked ? "#0A1B2C" : "#FFFFFF",
          border: checked ? "1px solid #0A1B2C" : "1.25px solid #C9C3B0",
          boxShadow: checked
            ? "0 2px 5px -2px rgba(10,27,44,0.4)"
            : "inset 0 1px 0 rgba(255,255,255,0.6)",
        }}
      >
        {checked && <Check size={11} strokeWidth={3.2} style={{ color: GOLD }} />}
      </span>
      <input
        type="checkbox"
        className="hidden"
        checked={checked}
        onChange={onChange}
      />
      <span className="text-[13px] text-[#0A1B2C]">{label}</span>
    </label>
  );
}



