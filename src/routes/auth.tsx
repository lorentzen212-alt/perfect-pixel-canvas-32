import { useEffect, useState } from "react";
import { createFileRoute, useNavigate, useSearch, Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { BrandLogo } from "@/components/BrandLogo";
import { lovable } from "@/integrations/lovable/index";
import { useAuth, upsertProfile } from "@/lib/auth";

export const Route = createFileRoute("/auth")({
  validateSearch: (
    search: Record<string, unknown>,
  ): { next?: string; mode?: "signup" } => ({
    next: typeof search.next === "string" ? search.next : undefined,
    mode: search.mode === "signup" ? ("signup" as const) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Sign in — HotelGroupBook" },
      {
        name: "description",
        content:
          "Sign in to HotelGroupBook to submit group hotel requests and manage your bookings, offers and rooming lists.",
      },
      { property: "og:title", content: "Sign in — HotelGroupBook" },
      {
        property: "og:description",
        content: "Access your group bookings, offers and rooming lists.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

const NAVY = "#132B44";
const GOLD = "#C5A24B";

type Mode = "signin" | "signup" | "magic" | "reset";

function safeNext(next?: string) {
  if (!next || !next.startsWith("/") || next.startsWith("//")) return "/manage-bookings";
  return next;
}

function Field({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.16em] text-white/55">
        {label}
      </span>
      <input
        {...props}
        className="h-[46px] w-full rounded-[10px] border border-white/14 bg-white/[0.06] px-3.5 text-[14px] text-white outline-none transition-colors placeholder:text-white/30 focus:border-[rgba(197,162,75,0.55)]"
      />
    </label>
  );
}

function AuthPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/auth" });
  const { session, loading } = useAuth();

  const [mode, setMode] = useState<Mode>(search.mode === "signup" ? "signup" : "signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const destination = safeNext(search.next);

  useEffect(() => {
    if (!loading && session) navigate({ to: destination, replace: true });
  }, [loading, session, destination, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (error) throw error;
      } else if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            emailRedirectTo: `${window.location.origin}${destination}`,
            data: { first_name: firstName, last_name: lastName },
          },
        });
        if (error) throw error;
        if (data.user && data.session) {
          await upsertProfile(data.user.id, {
            first_name: firstName,
            last_name: lastName,
            email: email.trim(),
            company_name: company || null,
            phone: phone || null,
          });
        } else {
          setNotice("Check your email to confirm your account, then sign in.");
        }
      } else if (mode === "magic") {
        const { error } = await supabase.auth.signInWithOtp({
          email: email.trim(),
          options: { emailRedirectTo: `${window.location.origin}${destination}` },
        });
        if (error) throw error;
        setNotice("We sent you a sign-in link. Check your inbox.");
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        setNotice("Password reset link sent. Check your inbox.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setError("Google sign-in is unavailable right now.");
      return;
    }
  };

  const title =
    mode === "signup"
      ? "Create your account"
      : mode === "magic"
        ? "Sign in with a link"
        : mode === "reset"
          ? "Reset your password"
          : "Welcome back";

  return (
    <main
      className="flex min-h-screen items-center justify-center px-4 py-16"
      style={{ background: `radial-gradient(120% 90% at 50% 0%, #1B3A58 0%, ${NAVY} 60%, #0E1F33 100%)` }}
    >
      <div
        className="w-full max-w-[440px] rounded-[18px] px-7 py-8"
        style={{
          background: "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03))",
          border: "1px solid rgba(255,255,255,0.10)",
          boxShadow: "0 26px 60px rgba(6,16,26,0.45)",
        }}
      >
        <Link to="/" className="text-[11px] uppercase tracking-[0.28em]" style={{ color: GOLD }}>
          HotelGroupBook
        </Link>
        <h1
          className="mt-3 text-[30px] leading-tight text-white"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          {title}
        </h1>
        <p className="mt-1.5 text-[13px] text-white/55">
          {mode === "signup"
            ? "Your requests, offers and rooming lists in one place."
            : "Access your group bookings and rooming lists."}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-3.5">
          {mode === "signup" && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <Field
                  label="First name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
                <Field
                  label="Last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Company" value={company} onChange={(e) => setCompany(e.target.value)} />
                <Field label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
            </>
          )}

          <Field
            label="Email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {(mode === "signin" || mode === "signup") && (
            <Field
              label="Password"
              type="password"
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              required
            />
          )}

          {error && (
            <p className="rounded-[8px] bg-[rgba(200,110,110,0.14)] px-3 py-2 text-[12.5px] text-[#E7B4B4]">
              {error}
            </p>
          )}
          {notice && (
            <p className="rounded-[8px] bg-[rgba(140,180,150,0.14)] px-3 py-2 text-[12.5px] text-[#B8DcC0]">
              {notice}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="mt-1 h-[48px] w-full rounded-[10px] text-[13px] font-semibold uppercase tracking-[0.18em] text-[#20180A] transition-opacity disabled:opacity-60"
            style={{ background: "linear-gradient(180deg, #E7C878 0%, #C5A24B 55%, #A9853A 100%)" }}
          >
            {busy
              ? "Please wait…"
              : mode === "signup"
                ? "Create account"
                : mode === "magic"
                  ? "Send sign-in link"
                  : mode === "reset"
                    ? "Send reset link"
                    : "Sign in"}
          </button>
        </form>

        <div className="my-5 flex items-center gap-3">
          <span className="h-px flex-1 bg-white/12" />
          <span className="text-[10.5px] uppercase tracking-[0.22em] text-white/35">or</span>
          <span className="h-px flex-1 bg-white/12" />
        </div>

        <button
          type="button"
          onClick={handleGoogle}
          className="flex h-[46px] w-full items-center justify-center gap-2.5 rounded-[10px] border border-white/14 bg-white/[0.06] text-[13.5px] text-white transition-colors hover:bg-white/[0.10]"
        >
          <svg width="17" height="17" viewBox="0 0 48 48" aria-hidden="true">
            <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.9z" />
            <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.1 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
            <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.3 0-9.7-3.1-11.3-7.9l-6.5 5C9.6 39.6 16.2 44 24 44z" />
            <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.5l6.2 5.2C39 36.4 44 31 44 24c0-1.3-.1-2.6-.4-3.9z" />
          </svg>
          Continue with Google
        </button>

        <div className="mt-6 space-y-1.5 text-center text-[12.5px] text-white/50">
          {mode !== "signup" && (
            <p>
              New to HotelGroupBook?{" "}
              <button className="underline" style={{ color: GOLD }} onClick={() => setMode("signup")}>
                Create an account
              </button>
            </p>
          )}
          {mode !== "signin" && (
            <p>
              Already have an account?{" "}
              <button className="underline" style={{ color: GOLD }} onClick={() => setMode("signin")}>
                Sign in
              </button>
            </p>
          )}
          {mode === "signin" && (
            <p className="flex justify-center gap-4">
              <button className="underline hover:text-white/75" onClick={() => setMode("magic")}>
                Email me a link
              </button>
              <button className="underline hover:text-white/75" onClick={() => setMode("reset")}>
                Forgot password?
              </button>
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
