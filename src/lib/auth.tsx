import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export interface Profile {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  company_name: string | null;
  phone: string | null;
  country: string | null;
}

export interface AuthState {
  loading: boolean;
  session: Session | null;
  user: User | null;
  /** Convenience flag — true once a session has been restored. */
  isAuthenticated: boolean;
  userId: string | null;
  profile: Profile | null;
  profileLoading: boolean;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
}

/** True when the profile holds usable contact info beyond the login email. */
export function isProfileComplete(profile: Profile | null): boolean {
  if (!profile) return false;
  return Boolean(
    profile.first_name?.trim() &&
      profile.last_name?.trim() &&
      profile.phone?.trim() &&
      profile.country?.trim(),
  );
}

/** True when the profile has at least a name — enough to prefill something useful. */
export function hasProfileDetails(profile: Profile | null): boolean {
  if (!profile) return false;
  return Boolean(
    profile.first_name?.trim() ||
      profile.last_name?.trim() ||
      profile.phone?.trim() ||
      profile.company_name?.trim() ||
      profile.country?.trim(),
  );
}

const AuthContext = createContext<AuthState>({
  loading: true,
  session: null,
  user: null,
  profile: null,
  profileLoading: false,
  refreshProfile: async () => {},
  signOut: async () => {},
});


export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      if (!active) return;
      setSession(next);
      setLoading(false);
      if (!next) setProfile(null);
    });

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session);
      setLoading(false);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const userId = session?.user?.id ?? null;
  const userEmail = session?.user?.email ?? "";
  const [profileLoading, setProfileLoading] = useState(false);

  /**
   * Loads the profile for a signed-in user and, for accounts created before the
   * profile system existed, provisions the missing row (user_id + auth email).
   * The upsert on the user_id primary key makes repeated calls safe.
   */
  const loadProfile = useCallback(
    async (id: string, email: string) => {
      setProfileLoading(true);
      try {
        const { data } = await supabase
          .from("profiles")
          .select("user_id, first_name, last_name, email, company_name, phone, country")
          .eq("user_id", id)
          .maybeSingle();

        if (data) {
          // Backfill the email from auth when it is missing on an older row.
          if (email && !data.email) {
            await supabase
              .from("profiles")
              .upsert({ user_id: id, email }, { onConflict: "user_id" });
            setProfile({ ...(data as Profile), email });
          } else {
            setProfile(data as Profile);
          }
          return;
        }

        const { data: created, error } = await supabase
          .from("profiles")
          .upsert({ user_id: id, email }, { onConflict: "user_id" })
          .select("user_id, first_name, last_name, email, company_name, phone, country")
          .single();
        if (error) {
          console.error("[profile] provisioning failed", error.message);
          setProfile(null);
          return;
        }
        setProfile(created as Profile);
      } finally {
        setProfileLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    if (!userId) return;
    void loadProfile(userId, userEmail);
  }, [userId, userEmail, loadProfile]);

  const value = useMemo<AuthState>(
    () => ({
      loading,
      session,
      user: session?.user ?? null,
      profile,
      profileLoading,
      refreshProfile: async () => {
        if (userId) await loadProfile(userId, userEmail);
      },
      signOut: async () => {
        await supabase.auth.signOut();
        setProfile(null);
      },
    }),
    [loading, session, profile, profileLoading, userId, userEmail, loadProfile],
  );


  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

/** Upserts profile fields for the signed-in user. Safe to call repeatedly. */
export async function upsertProfile(
  userId: string,
  fields: Partial<Omit<Profile, "user_id">>,
) {
  const { error } = await supabase
    .from("profiles")
    .upsert({ user_id: userId, ...fields }, { onConflict: "user_id" });
  if (error) console.error("[profile]", error.message);
}
