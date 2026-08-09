import { useEffect, useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { BrandLogo } from "@/components/BrandLogo";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Set a new password — HotelGroupBook" },
      {
        name: "description",
        content: "Choose a new password for your HotelGroupBook account and get back to your group bookings.",
      },
      { property: "og:title", content: "Set a new password — HotelGroupBook" },
      { property: "og:description", content: "Choose a new password for your HotelGroupBook account." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ResetPassword,
});

const GOLD = "#C5A24B";

function ResetPassword() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || session) setReady(true);
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    if (password !== confirm) {
      setError("The two passwords do not match.");
      return;
    }
    setBusy(true);
    setError(null);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) {
      setError(error.message);
      return;
    }
    setDone(true);
    setTimeout(() => navigate({ to: "/manage-bookings", replace: true }), 1200);
  };

  return (
    <main
      className="flex min-h-screen items-center justify-center px-4 py-16"
      style={{ background: "radial-gradient(120% 90% at 50% 0%, #1B3A58 0%, #132B44 60%, #0E1F33 100%)" }}
    >
      <div
        className="w-full max-w-[420px] rounded-[18px] px-7 py-8"
        style={{
          background: "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03))",
          border: "1px solid rgba(255,255,255,0.10)",
          boxShadow: "0 26px 60px rgba(6,16,26,0.45)",
        }}
      >
        <Link to="/" aria-label="HotelGroupBook" className="inline-flex items-center">
          <BrandLogo size="sm" tone="dark" />
        </Link>
        <h1
          className="mt-3 text-[28px] leading-tight text-white"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Set a new password
        </h1>

        {done ? (
          <p className="mt-4 text-[13.5px] text-white/70">
            Password updated. Taking you to your bookings…
          </p>
        ) : !ready ? (
          <p className="mt-4 text-[13.5px] text-white/60">
            Open this page from the reset link in your email to continue.
          </p>
        ) : (
          <form onSubmit={submit} className="mt-6 space-y-3.5">
            {[
              { label: "New password", value: password, set: setPassword },
              { label: "Confirm password", value: confirm, set: setConfirm },
            ].map((f) => (
              <label key={f.label} className="block">
                <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.16em] text-white/55">
                  {f.label}
                </span>
                <input
                  type="password"
                  value={f.value}
                  minLength={8}
                  required
                  onChange={(e) => f.set(e.target.value)}
                  className="h-[46px] w-full rounded-[10px] border border-white/14 bg-white/[0.06] px-3.5 text-[14px] text-white outline-none focus:border-[rgba(197,162,75,0.55)]"
                />
              </label>
            ))}
            {error && (
              <p className="rounded-[8px] bg-[rgba(200,110,110,0.14)] px-3 py-2 text-[12.5px] text-[#E7B4B4]">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={busy}
              className="h-[48px] w-full rounded-[10px] text-[13px] font-semibold uppercase tracking-[0.18em] text-[#20180A] disabled:opacity-60"
              style={{ background: "linear-gradient(180deg, #E7C878 0%, #C5A24B 55%, #A9853A 100%)" }}
            >
              {busy ? "Saving…" : "Update password"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
