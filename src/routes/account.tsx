import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Check } from "lucide-react";
import { upsertProfile, useAuth } from "@/lib/auth";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "My Profile — HotelGroupBook" },
      {
        name: "description",
        content:
          "Manage your HotelGroupBook account details — name, phone, organisation and country — and reuse them for future group bookings.",
      },
      { property: "og:title", content: "My Profile — HotelGroupBook" },
      {
        property: "og:description",
        content: "Manage your HotelGroupBook customer profile and contact details.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AccountRoute,
});

const BG = "#12222C";
const CARD = "#1B3550";
const FIELD = "#214A6C";
const BORDER = "rgba(199,163,74,0.24)";
const GOLD = "#C7A34A";
const GOLD_SOFT = "#E7C878";
const TEXT = "#F5F1E6";
const MUTED = "rgba(245,241,230,0.58)";
const SERIF = "'Cormorant Garamond', Georgia, serif";

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  disabled,
  hint,
}: {
  label: string;
  value: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
  hint?: string;
}) {
  return (
    <div>
      <label
        className="block text-[11.5px] font-semibold uppercase tracking-[0.14em]"
        style={{ color: MUTED }}
      >
        {label}
      </label>
      <input
        type={type}
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(e) => onChange?.(e.target.value)}
        className="mt-2 w-full rounded-[12px] px-4 py-3 text-[15px] outline-none transition-all disabled:opacity-60"
        style={{ backgroundColor: FIELD, color: TEXT, border: `1px solid ${BORDER}` }}
      />
      {hint && (
        <p className="mt-1.5 text-[11.5px]" style={{ color: MUTED }}>
          {hint}
        </p>
      )}
    </div>
  );
}

function AccountRoute() {
  const { session, loading, profile, refreshProfile } = useAuth();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [country, setCountry] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!loading && !session) void navigate({ to: "/auth" });
  }, [loading, session, navigate]);

  useEffect(() => {
    if (!profile) return;
    setFirstName(profile.first_name ?? "");
    setLastName(profile.last_name ?? "");
    setPhone(profile.phone ?? "");
    setCompany(profile.company_name ?? "");
    setCountry(profile.country ?? "");
  }, [profile]);

  const email = profile?.email || session?.user.email || "";
  const initials =
    ((firstName[0] ?? email[0] ?? "") + (lastName[0] ?? "")).toUpperCase() || "—";

  const save = async () => {
    if (!session) return;
    setSaving(true);
    await upsertProfile(session.user.id, {
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      email,
      phone: phone.trim() || null,
      company_name: company.trim() || null,
      country: country.trim() || null,
    });
    await refreshProfile();
    setSaving(false);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2600);
  };

  return (
    <main
      className="min-h-screen px-4 py-10 sm:px-6 lg:px-8"
      style={{ backgroundColor: BG, fontFamily: "Inter, system-ui, sans-serif" }}
    >
      <div className="mx-auto w-full max-w-[720px]">
        <Link
          to="/manage-bookings"
          className="inline-flex items-center gap-2 text-[13.5px] font-medium"
          style={{ color: GOLD_SOFT }}
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        <section
          className="mt-6 rounded-[22px] p-6 sm:p-8"
          style={{
            backgroundColor: CARD,
            border: `1px solid ${BORDER}`,
            boxShadow: "0 40px 80px -46px rgba(0,0,0,0.6)",
          }}
        >
          <div className="flex items-center gap-4">
            <span
              className="grid h-12 w-12 shrink-0 place-items-center rounded-full text-[14px] font-semibold"
              style={{ backgroundColor: "rgba(199,163,74,0.16)", color: GOLD }}
            >
              {initials}
            </span>
            <div className="min-w-0">
              <h1 className="text-[30px] leading-tight" style={{ color: TEXT, fontFamily: SERIF }}>
                My Profile
              </h1>
              <p className="truncate text-[13px]" style={{ color: MUTED }}>
                {email}
              </p>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="First Name" value={firstName} onChange={setFirstName} placeholder="First name" />
            <Field label="Last Name" value={lastName} onChange={setLastName} placeholder="Last name" />
            <Field
              label="Email"
              value={email}
              disabled
              type="email"
              hint="Taken from your sign-in account."
            />
            <Field label="Phone" value={phone} onChange={setPhone} placeholder="+47 000 00 000" />
            <Field
              label="Organisation / Company"
              value={company}
              onChange={setCompany}
              placeholder="Organisation name"
            />
            <Field label="Country" value={country} onChange={setCountry} placeholder="Norway" />
          </div>

          <div className="mt-8 flex items-center gap-4">
            <button
              type="button"
              onClick={() => void save()}
              disabled={saving}
              className="rounded-[12px] px-7 py-3.5 text-[13px] font-semibold uppercase tracking-[0.14em] transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{
                background: "linear-gradient(180deg, #E7C878 0%, #C5A24B 55%, #A9853A 100%)",
                color: "#20180A",
              }}
            >
              {saving ? "Saving…" : "Save profile"}
            </button>
            {saved && (
              <span
                className="inline-flex items-center gap-1.5 text-[13px] font-medium"
                style={{ color: GOLD_SOFT }}
              >
                <Check size={15} /> Profile saved
              </span>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
