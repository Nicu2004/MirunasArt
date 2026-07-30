import { useState, useEffect } from "react";
import { Eye, EyeOff, Trash2, Pencil, Plus, X } from "lucide-react";
import { useAuth } from "../authpage/Authcontext";
import "./ExhibitionAdministration.css";

const API_URL = import.meta.env.VITE_API_URL;

interface Exhibition {
  id: number;
  title: string;
  date: string; 
  location: string;
  description: string;
  status: "now" | "upcoming" | "past";
  viewEnabled: boolean;
}

interface ExhibitionFormData {
  title: string;
  date: string;
  location: string;
  description: string;
  status: "now" | "upcoming" | "past";
}

const EMPTY_FORM: ExhibitionFormData = {
  title: "",
  date: "",
  location: "",
  description: "",
  status: "upcoming",
};

const STATUS_LABEL: Record<Exhibition["status"], string> = {
  now: "În desfășurare",
  upcoming: "Viitor",
  past: "Trecut",
};

export default function ExhibitionAdministration() {
  const { authFetch } = useAuth();

  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ExhibitionFormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  async function loadExhibitions() {
    setLoading(true);
    setError(null);
    try {
      const res = await authFetch(`${API_URL}/api/admin/exhibitions`);
      if (!res.ok) {
        setError("Evenimentele nu au putut fi încărcate");
        return;
      }
      const data = await res.json();
      setExhibitions(data); 
    } catch (err) {
      setError("Eroare: " + err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadExhibitions();
  }, []);

  function openAddForm() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  }

  function openEditForm(ex: Exhibition) {
    setEditingId(ex.id);
    setForm({
      title: ex.title,
      date: ex.date.slice(0, 10), 
      location: ex.location,
      description: ex.description,
      status: ex.status,
    });
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const url =
        editingId != null
          ? `${API_URL}/api/admin/exhibitions/${editingId}`
          : `${API_URL}/api/admin/exhibitions`;
      const method = editingId != null ? "PATCH" : "POST";

      const res = await authFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        setError("Nu am putut salva evenimentul");
        return;
      }

    closeForm();
    loadExhibitions();
    } catch {
      setError("Eroare la salvare");
    } finally {
      setSaving(false);
    }
  }

  async function toggleVisibility(ex: Exhibition) {
    setExhibitions((prev) =>
      prev.map((e) => (e.id === ex.id ? { ...e, viewEnabled: !e.viewEnabled } : e))
    );

    const res = await authFetch(`${API_URL}/api/admin/exhibitions/${ex.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ viewEnabled: !ex.viewEnabled }),
    });

    if (!res.ok) {
      setExhibitions((prev) =>
        prev.map((e) => (e.id === ex.id ? { ...e, viewEnabled: ex.viewEnabled } : e))
      );
      setError("Nu am putut schimba vizibilitatea");
    }
  }

  async function deleteExhibition(ex: Exhibition) {
    if (!confirm(`Ștergi definitiv "${ex.title}"?`)) return;

    const res = await authFetch(`${API_URL}/api/admin/exhibitions/${ex.id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      setError("Nu am putut șterge evenimentul");
      return;
    }

    setExhibitions((prev) => prev.filter((e) => e.id !== ex.id));
  }

  return (
    <div className="exh-admin">
      <div className="exh-admin__header">
        <h2 className="admin-section-title">Administrare Expoziții</h2>
        <button className="exh-admin__add-btn" onClick={openAddForm}>
          <Plus size={16} strokeWidth={2} />
          Adaugă eveniment
        </button>
      </div>

      {error && <p className="admin-status admin-status--error">{error}</p>}

      {showForm && (
        <form className="exh-admin__form" onSubmit={handleSubmit}>
          <div className="exh-admin__form-header">
            <h3>{editingId != null ? "Editează eveniment" : "Eveniment nou"}</h3>
            <button type="button" onClick={closeForm} className="exh-admin__close-btn">
              <X size={18} />
            </button>
          </div>

          <label>
            <span>Titlu</span>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </label>

          <label>
            <span>Dată</span>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              required
            />
          </label>

          <label>
            <span>Locație</span>
            <input
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              required
            />
          </label>

          <label>
            <span>Descriere</span>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              required
            />
          </label>

          <label>
            <span>Status</span>
            <select
              value={form.status}
              onChange={(e) =>
                setForm({ ...form, status: e.target.value as ExhibitionFormData["status"] })
              }
            >
              <option value="upcoming">Viitor</option>
              <option value="now">În desfășurare</option>
              <option value="past">Trecut</option>
            </select>
          </label>

          <button type="submit" className="exh-admin__submit-btn" disabled={saving}>
            {saving ? "Se salvează..." : "Salvează"}
          </button>
        </form>
      )}

      {loading ? (
        
        <div className="exh-admin__skeleton">
          {[1, 2, 3].map((i) => (
            <div key={i} className="exh-admin__skeleton-row" />
          ))}
        </div>
      ) : exhibitions.length === 0 ? (
        <p className="admin-status">Nu ai evenimente încă.</p>
      ) : (
        <div className="exh-admin__list">
          {exhibitions.map((ex) => (
            <div className="exh-admin__card" key={ex.id}>
              <div className="exh-admin__card-main">
                <span className="exh-admin__card-title">{ex.title}</span>
                <span className="exh-admin__card-meta">
                  {new Date(ex.date).toLocaleDateString("ro-RO")} · {ex.location}
                </span>
              </div>

              <div className="exh-admin__card-actions">
                <span className={`admin-badge admin-badge--${ex.status === "now" ? "new" : ex.status === "past" ? "delivered" : "processing"}`}>
                  {STATUS_LABEL[ex.status]}
                </span>

                {!ex.viewEnabled && (
                  <span className="admin-badge admin-badge--processing">ascuns</span>
                )}

                <button onClick={() => openEditForm(ex)} title="Editează">
                  <Pencil size={16} />
                </button>
                <button onClick={() => toggleVisibility(ex)} title={ex.viewEnabled ? "Ascunde" : "Arată"}>
                  {ex.viewEnabled ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
                <button onClick={() => deleteExhibition(ex)} title="Șterge" className="exh-admin__delete">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}