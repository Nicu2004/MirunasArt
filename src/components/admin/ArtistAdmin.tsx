import { useState, useEffect } from "react";
import { useAuth } from "../authpage/Authcontext";
import "./ArtistAdmin.css";

const API_URL = import.meta.env.VITE_API_URL;

interface ArtistData {
  name: string;
  title: string;
  description: string;
}

export default function ArtistAdmin() {
  const { authFetch } = useAuth();

  const [form, setForm] = useState<ArtistData>({ name: "", title: "", description: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await authFetch(`${API_URL}/api/admin/artist`);
        if (res.ok) {
          const data = await res.json();
          if (data.artist) {
            setForm({
              name: data.artist.name,
              title: data.artist.title,
              description: data.artist.description,
            });
          }
        }
      } catch {
        setError("Nu am putut încărca datele artistului");
      } finally {
        setLoading(false);
      }
    })();
  }, [authFetch]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setSaving(true);

    try {
      const res = await authFetch(`${API_URL}/api/admin/artist`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.message ?? "Nu am putut salva modificările");
        return;
      }

      setSuccess(true);
    } catch {
      setError("Eroare la salvare");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="admin-status">Se încarcă...</p>;

  return (
    <div>
      <h2 className="admin-section-title">Administrare — Despre Artist</h2>

      <form className="artist-admin__form" onSubmit={handleSubmit}>
        <label>
          <span>Nume</span>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </label>

        <label>
          <span>Titlu / Tagline</span>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder='ex: "Pictor / Sculptor"'
            required
          />
        </label>

        <label>
          <span>Descriere</span>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={6}
            required
          />
        </label>

        {error && <p className="artist-admin__error">{error}</p>}
        {success && <p className="artist-admin__success">Modificări salvate.</p>}

        <button type="submit" className="artist-admin__submit" disabled={saving}>
          {saving ? "Se salvează..." : "Salvează modificările"}
        </button>
      </form>
    </div>
  );
}