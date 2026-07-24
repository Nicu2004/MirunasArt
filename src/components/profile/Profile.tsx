import { useAuth } from "../authpage/Authcontext";
import { useState, useEffect } from "react";
import "./Profile.css";

const API_URL = import.meta.env.VITE_API_URL;

type UserProfile = {
  name: string;
  email: string;
  phoneNumber: string;
};

export default function Profile() {
  const NGROK_HEADERS = { "ngrok-skip-browser-warning": "true" };
  const { authFetch } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // stare separată pentru editarea telefonului
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [phoneInput, setPhoneInput] = useState("");
  const [savingPhone, setSavingPhone] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await authFetch(`${API_URL}/api/user/profile`);
        if (!res.ok) {
          setError("Nu am putut încărca profilul");
          return;
        }
        const data = await res.json();
        const profile: UserProfile = data.user;

        setName(profile.name ?? "");
        setEmail(profile.email ?? "");
        setPhoneNumber(profile.phoneNumber ?? "");
        setPhoneInput(profile.phoneNumber ?? "");
      } catch {
        setError("Eroare la încărcarea profilului");
      } finally {
        setLoading(false);
      }
    })();
  }, [authFetch]);

  function startEditingPhone() {
    setPhoneInput(phoneNumber);
    setIsEditingPhone(true);
  }

  function cancelEditingPhone() {
    setPhoneInput(phoneNumber);
    setIsEditingPhone(false);
  }

  async function savePhone() {
    setSavingPhone(true);
    try {
      const res = await authFetch(`${API_URL}/api/user/profile`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" , ...NGROK_HEADERS},
        body: JSON.stringify({ phoneNumber: phoneInput }),
      });

      if (!res.ok) {
        setError("Nu am putut salva numărul de telefon");
        return;
      }

      const data = await res.json();
      setPhoneNumber(data.user.phoneNumber ?? "");
      setIsEditingPhone(false);
    } catch {
      setError("Eroare la salvarea telefonului");
    } finally {
      setSavingPhone(false);
    }
  }

  if (loading) return <p className="profile-status">Se încarcă...</p>;
  if (error) return <p className="profile-status profile-status--error">{error}</p>;

  return (
    <div className="profile-page">
      <section className="profile-section personal-details">
        <h1 className="profile-title">Detalii personale</h1>

        <div className="profile-field">
          <span className="profile-field__label">Nume</span>
          <span className="profile-field__value">{name}</span>
        </div>

        <div className="profile-field">
          <span className="profile-field__label">Email</span>
          <span className="profile-field__value">{email}</span>
        </div>

        <div className="profile-field">
          <span className="profile-field__label">Telefon</span>

          {isEditingPhone ? (
            <div className="profile-field__edit">
              <input
                type="tel"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                placeholder="07xx xxx xxx"
                className="profile-field__input"
              />
              <button
                className="profile-btn profile-btn--save"
                onClick={savePhone}
                disabled={savingPhone}
              >
                {savingPhone ? "Se salvează..." : "Salvează"}
              </button>
              <button
                className="profile-btn profile-btn--cancel"
                onClick={cancelEditingPhone}
                disabled={savingPhone}
              >
                Anulează
              </button>
            </div>
          ) : (
            <div className="profile-field__edit">
              <span className="profile-field__value">
                {phoneNumber || <em>Nesetat</em>}
              </span>
              <button className="profile-btn profile-btn--edit" onClick={startEditingPhone}>
                Editează
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="profile-section order-details">
        <h2 className="profile-subtitle">Comenzi active</h2>
      </section>

      <section className="profile-section order-history">
        <h2 className="profile-subtitle">Istoric comenzi</h2>
      </section>

      <section className="profile-section notifications-area">
        <h2 className="profile-subtitle">Notificări</h2>
      </section>

      <section className="profile-section faq-area">
        <h2 className="profile-subtitle">Întrebări frecvente</h2>
      </section>
    </div>
  );
}