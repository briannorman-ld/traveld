"use client";

import {
  createContext,
  startTransition,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { SessionUser, UserTier } from "@/lib/ld-context";

const ANON_KEY = "traveld_ld_anon";
const SESSION_KEY = "traveld_session";
const USERS_KEY = "traveld_users";

type StoredUser = SessionUser & { password: string };

type UsersDb = Record<string, StoredUser>;

function loadUsers(): UsersDb {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(USERS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as UsersDb;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function saveUsers(db: UsersDb) {
  window.localStorage.setItem(USERS_KEY, JSON.stringify(db));
}

function ensureAnonymousId(): string {
  if (typeof window === "undefined") return "ssr";
  let id = window.localStorage.getItem(ANON_KEY);
  if (!id) {
    id =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `anon_${Math.random().toString(36).slice(2)}`;
    window.localStorage.setItem(ANON_KEY, id);
  }
  return id;
}

type SessionContextValue = {
  anonymousKey: string;
  user: SessionUser | null;
  /** Tier for UI: anonymous when logged out */
  effectiveTier: UserTier;
  ready: boolean;
  signup: (email: string, password: string) => { ok: true } | { ok: false; error: string };
  login: (email: string, password: string) => { ok: true } | { ok: false; error: string };
  logout: () => void;
  setPaidTier: () => void;
  resetDemoStorage: () => void;
};

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [anonymousKey, setAnonymousKey] = useState("pending");
  const [user, setUser] = useState<SessionUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    startTransition(() => {
      setAnonymousKey(ensureAnonymousId());
      try {
        const raw = window.localStorage.getItem(SESSION_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as SessionUser;
          if (parsed?.id && parsed?.email && parsed?.tier) {
            setUser(parsed);
          }
        }
      } catch {
        /* ignore */
      }
      setReady(true);
    });
  }, []);

  const persistSession = useCallback((next: SessionUser | null) => {
    setUser(next);
    if (next) {
      window.localStorage.setItem(SESSION_KEY, JSON.stringify(next));
    } else {
      window.localStorage.removeItem(SESSION_KEY);
    }
  }, []);

  const signup = useCallback(
    (email: string, password: string): { ok: true } | { ok: false; error: string } => {
      const normalized = email.trim().toLowerCase();
      if (!normalized || !password) {
        return { ok: false, error: "Email and password are required." };
      }
      const db = loadUsers();
      const existing = Object.values(db).some(
        (u) => u.email.toLowerCase() === normalized,
      );
      if (existing) {
        return { ok: false, error: "An account with that email already exists." };
      }
      const id =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `user_${Math.random().toString(36).slice(2)}`;
      const createdAt = new Date().toISOString();
      const record: StoredUser = {
        id,
        email: normalized,
        password,
        tier: "free",
        createdAt,
      };
      db[id] = record;
      saveUsers(db);
      persistSession({
        id,
        email: normalized,
        tier: "free",
        createdAt,
      });
      return { ok: true };
    },
    [persistSession],
  );

  const login = useCallback(
    (email: string, password: string): { ok: true } | { ok: false; error: string } => {
      const normalized = email.trim().toLowerCase();
      const db = loadUsers();
      const found = Object.values(db).find(
        (u) => u.email.toLowerCase() === normalized,
      );
      if (!found || found.password !== password) {
        return { ok: false, error: "Invalid email or password." };
      }
      persistSession({
        id: found.id,
        email: found.email,
        tier: found.tier,
        createdAt: found.createdAt,
      });
      return { ok: true };
    },
    [persistSession],
  );

  const logout = useCallback(() => {
    persistSession(null);
  }, [persistSession]);

  const setPaidTier = useCallback(() => {
    if (!user) return;
    const db = loadUsers();
    const existing = db[user.id];
    if (existing) {
      existing.tier = "paid";
      db[user.id] = existing;
      saveUsers(db);
    }
    persistSession({ ...user, tier: "paid" });
  }, [persistSession, user]);

  const resetDemoStorage = useCallback(() => {
    const keys: string[] = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i);
      if (k && (k.startsWith("traveld_") || k.startsWith("ld:"))) {
        keys.push(k);
      }
    }
    keys.forEach((k) => window.localStorage.removeItem(k));
    const newAnon = ensureAnonymousId();
    setAnonymousKey(newAnon);
    persistSession(null);
    window.location.reload();
  }, [persistSession]);

  const value = useMemo<SessionContextValue>(
    () => ({
      anonymousKey,
      user,
      effectiveTier: user ? user.tier : "anonymous",
      ready,
      signup,
      login,
      logout,
      setPaidTier,
      resetDemoStorage,
    }),
    [
      anonymousKey,
      user,
      ready,
      signup,
      login,
      logout,
      setPaidTier,
      resetDemoStorage,
    ],
  );

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export function useSession(): SessionContextValue {
  const ctx = useContext(SessionContext);
  if (!ctx) {
    throw new Error("useSession must be used within SessionProvider");
  }
  return ctx;
}
