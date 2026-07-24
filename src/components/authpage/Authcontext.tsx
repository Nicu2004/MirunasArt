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
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name:string, code:string) => Promise<void>;
  logout: () => Promise<void>;
  authFetch: (input: string, init?: RequestInit) => Promise<Response>;
  getAuthToken: ()=> string | null;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {

  const NGROK_HEADERS = { "ngrok-skip-browser-warning": "true" };

   console.log("AuthProvider a pornit"); // ← linia 1
  const [user, setUser] = useState<User | null>(null);

  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async (): Promise<string | null> => {
    try {
      console.log('====================================');
      console.log("Trying to refesh");
      console.log('====================================');
      const res = await fetch(`${API_URL}/api/auth/refresh`, {
        method: "POST",
        credentials: "include", 
        headers: NGROK_HEADERS,
      });
      if (!res.ok) return null;
      console.log("fetch s-a terminat, status:", res.status)
      const data = await res.json();
      setAccessToken(data.accessToken);
      return data.accessToken as string;
    } catch(err) {
       console.log("EROARE în refresh():", err);
      return null;
    }
  }, []);


  useEffect(() => {
    (async () => {
       console.log("useEffect-ul de silent refresh a pornit");
      const token = await refresh();
      if (token) {
        const res = await fetch(`${API_URL}/api/user/profile`, {
          headers: { Authorization: `Bearer ${token}`, ...NGROK_HEADERS },
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      }
      setLoading(false);
    })();
  }, [refresh]);

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
      headers: { "Content-Type": "application/json", ...NGROK_HEADERS },
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
      headers: { "Content-Type": "application/json", ...NGROK_HEADERS },
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
  if (!ctx) throw new Error("useAuth error");
  return ctx;
}