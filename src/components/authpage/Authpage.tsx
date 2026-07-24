import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./Authcontext";
import "./Authpage.css";

const API_URL = import.meta.env.VITE_API_URL;

type Mode = "login" | "register";
type RegisterStep = 1 | 2 | 3;

const STEP_LABELS: Record<RegisterStep, string> = {
  1: "Email",
  2: "Verificare",
  3: "Parolă",
};

export default function AuthPage() {

  const [mode, setMode] = useState<Mode>("login");

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <span className="auth-mark">&amp;</span>
          <h1 className="auth-title">
            {mode === "login" ? "Autentificare" : "Creează cont"}
          </h1>
        </div>

        <div className="auth-toggle" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={mode === "login"}
            className={`auth-toggle-btn ${mode === "login" ? "active" : ""}`}
            onClick={() => setMode("login")}
          >
            Autentificare
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "register"}
            className={`auth-toggle-btn ${mode === "register" ? "active" : ""}`}
            onClick={() => setMode("register")}
          >
            Cont nou
          </button>
        </div>

        {mode === "login" ? <LoginForm /> : <RegisterForm />}
      </div>
    </div>
  );
}

function LoginForm() {
  const { login} = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {

    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password); 
      navigate("/");
      console.log("Autentificat");
    }catch (err) {
  setError(err instanceof Error ? err.message : "Eroare la autentificare");
} finally {
  setLoading(false);
}
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <label className="auth-field">
        <span>Email</span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="nume@exemplu.com"
          required
        />
      </label>

      <label className="auth-field">
        <span>Parolă</span>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
        />
      </label>

      <a href="#forgot-password" className="auth-forgot">
        Ai uitat parola?
      </a>

      {error && <p className="auth-error">{error}</p>}

      <button type="submit" className="auth-submit" disabled={loading}>
        {loading ? "Se conectează..." : "Autentificare"}
      </button>
    </form>
  );
}

function RegisterForm() {
  const [step, setStep] = useState<RegisterStep>(1);
  const { register} = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [name,  setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSendCode(e: FormEvent) {
    const NGROK_HEADERS = { "ngrok-skip-browser-warning": "true" };
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/send-verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...NGROK_HEADERS },
        body: JSON.stringify({ email }),
      });
      console.log(res.body);
      
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message ?? "Nu am putut trimite emailul de verificare");
      }

      setStep(2);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Nu am putut trimite emailul de verificare"
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyCode(e: FormEvent) {
    const NGROK_HEADERS = { "ngrok-skip-browser-warning": "true" };
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/verify-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...NGROK_HEADERS },
        body: JSON.stringify({ email, code }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message ?? "Cod incorect sau expirat");
      }

      setStep(3);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Cod incorect sau expirat");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateAccount(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Parolele nu coincid");
      return;
    }
    if (password.length < 8) {
      setError("Parola trebuie să aibă minim 8 caractere");
      return;
    }

    setLoading(true);
    try {
      await register(email, password, name, code);
      navigate('/');
      console.log("autentificated");
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nu am putut crea contul");
    } finally {
      setLoading(false);
    }
  }

  async function handleResendCode() {
    const NGROK_HEADERS = { "ngrok-skip-browser-warning": "true" };
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/send-verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...NGROK_HEADERS },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("Nu am putut retrimite codul");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nu am putut retrimite codul");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-register">
      <ol className="auth-stepper">
        {([1, 2, 3] as RegisterStep[]).map((s) => (
          <li
            key={s}
            className={`auth-step ${
              s === step ? "current" : s < step ? "done" : ""
            }`}
          >
            <span className="auth-step-dot">{s < step ? "✓" : s}</span>
            <span className="auth-step-label">{STEP_LABELS[s]}</span>
          </li>
        ))}
      </ol>

      {step === 1 && (
        <form className="auth-form" onSubmit={handleSendCode}>
          <label className="auth-field">
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nume@exemplu.com"
              required
            />
          </label>

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? "Se trimite..." : "Trimite cod de verificare"}
          </button>
        </form>
      )}

      {step === 2 && (
        <form className="auth-form" onSubmit={handleVerifyCode}>
          <p className="auth-hint">
            Am trimis un cod de verificare la <strong>{email}</strong>
          </p>

          <label className="auth-field">
            <span>Cod de verificare</span>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="000000"
              required
            />
          </label>

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? "Se verifică..." : "Verifică codul"}
          </button>

          <button
            type="button"
            className="auth-link-btn"
            onClick={handleResendCode}
            disabled={loading}
          >
            Retrimite codul
          </button>
        </form>
      )}

      {step === 3 && (
        <form className="auth-form" onSubmit={handleCreateAccount}>
          <label className="auth-field">
            <span>Nume</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nume de utilizator"
              required
            />
          </label>
          <label className="auth-field">
            <span>Parolă</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="minim 8 caractere"
              required
            />
          </label>

          <label className="auth-field">
            <span>Confirmă parola</span>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </label>

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? "Se creează contul..." : "Creează cont"}
          </button>
        </form>
      )}
    </div>
  );
}