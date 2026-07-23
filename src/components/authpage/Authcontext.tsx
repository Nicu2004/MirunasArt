import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

const API_URL = import.meta.env.VITE_API_URL;

interface User {
  id: number;
  email: string;
}

interface AuthContextValue {
  user: User | null;
  accessToken: string | null;
  loading: boolean; // true în timpul verificării inițiale a sesiunii
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name:string, code:string) => Promise<void>;
  logout: () => Promise<void>;
  authFetch: (input: string, init?: RequestInit) => Promise<Response>;
  getAuthToken: ()=> string | null;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  // Access token-ul stă DOAR în memorie (state React) — nu în localStorage,
  // nu în cookie accesibil din JS. Se pierde la refresh de pagină, dar
  // asta se repară prin silent refresh la montare (vezi useEffect mai jos).
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async (): Promise<string | null> => {
    try {
      const res = await fetch(`${API_URL}/api/auth/refresh`, {
        method: "POST",
        credentials: "include", // trimite cookie-ul httpOnly de refresh
      });
      if (!res.ok) return null;

      const data = await res.json();
      setAccessToken(data.accessToken);
      return data.accessToken as string;
    } catch {
      return null;
    }
  }, []);

  // La încărcarea aplicației (sau refresh de pagină), încearcă să restaurezi
  // sesiunea folosind cookie-ul de refresh, fără să ceri userului să se
  // logheze din nou.
  useEffect(() => {
    (async () => {
      const token = await refresh();
      if (token) {
        const res = await fetch(`${API_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      }
      setLoading(false);
    })();
  }, [refresh]);

  /**
   * Wrapper peste fetch care atașează automat access token-ul, și dacă
   * primește 401 (token expirat), încearcă o dată un refresh silențios
   * și reface request-ul original. Folosește asta pentru orice apel către
   * rute protejate, în loc de fetch direct.
   */
  const authFetch = useCallback(
    async (input: string, init: RequestInit = {}) => {
      const doFetch = (token: string | null) =>
        fetch(input, {
          ...init,
          headers: {
            ...init.headers,
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

      let res = await doFetch(accessToken);

      if (res.status === 401) {
        const newToken = await refresh();
        if (!newToken) {
          setUser(null);
          setAccessToken(null);
          return res;
        }
        res = await doFetch(newToken);
      }

      return res;
    },
    [accessToken, refresh]
  );

  async function login(email: string, password: string) {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      throw new Error(data?.message ?? "Email sau parolă incorecte");
    }
    const data = await res.json();

    setAccessToken(data.accessToken);
    setUser(data.user);
  }

  async function register(email: string, password: string, name:string, code:string) {
    const res = await fetch(`${API_URL}/api/auth/register`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name ,code}),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      throw new Error(data?.message ?? "Nu am putut crea contul");
    }
    const data = await res.json();
    setAccessToken(data.accessToken);
    setUser(data.user);
  }

  async function logout() {
    await fetch(`${API_URL}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
    setAccessToken(null);
  }
  const getAuthToken = () => {return accessToken;}

  return (
    <AuthContext.Provider
      value={{ user, accessToken, loading, login, register, logout, authFetch, getAuthToken }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth trebuie folosit în interiorul <AuthProvider>");
  return ctx;
}