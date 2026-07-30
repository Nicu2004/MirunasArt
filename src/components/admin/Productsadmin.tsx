import { useState, useEffect } from "react";
import { Eye, EyeOff, Trash2 } from "lucide-react";
import { useAuth } from "../authpage/Authcontext";

const API_URL = import.meta.env.VITE_API_URL;

interface AdminProduct {
  id: number;
  name: string;
  price: number;
  photoUrl: string;
  status: "available" | "sold";
  viewEnabled: boolean;
}

export default function ProductsAdmin() {
  const { authFetch } = useAuth();
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadProducts() {
    setLoading(true);
    try {
      const res = await authFetch(`${API_URL}/api/admin/products`);
      if (!res.ok) {
        setError("Nu am putut încărca produsele");
        return;
      }
      const data = await res.json();
      setProducts(data.products);
    } catch {
      setError("Eroare la încărcare");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  async function toggleVisibility(product: AdminProduct) {
   
    setProducts((prev) =>
      prev.map((p) =>
        p.id === product.id ? { ...p, viewEnabled: !p.viewEnabled } : p
      )
    );

    const res = await authFetch(
      `${API_URL}/api/admin/products/${product.id}/visibility`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ viewEnabled: !product.viewEnabled }),
      }
    );

    if (!res.ok) {

      setProducts((prev) =>
        prev.map((p) =>
          p.id === product.id ? { ...p, viewEnabled: product.viewEnabled } : p
        )
      );
      setError("Nu am putut schimba vizibilitatea");
    }
  }

  async function deleteProduct(product: AdminProduct) {
    if (!confirm(`Ștergi definitiv "${product.name}"? Nu poate fi anulat.`)) return;

    const res = await authFetch(`${API_URL}/api/admin/products/${product.id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.message ?? "Nu am putut șterge produsul");
      return;
    }

    setProducts((prev) => prev.filter((p) => p.id !== product.id));
  }

  if (loading) return <p className="admin-status">Se încarcă...</p>;

  return (
    <div>
      <h2 className="admin-section-title">Administrare Site — Opere</h2>
      {error && <p className="admin-status admin-status--error">{error}</p>}

      {products.map((product) => (
        <div className="admin-row" key={product.id}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <img
              src={product.photoUrl}
              alt={product.name}
              style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 4 }}
            />
            <div>
              <span className="admin-row__customer">{product.name}</span>
              <span className="admin-row__items">
                {" "}
                — {product.price.toLocaleString("ro-RO")} lei
              </span>
            </div>
          </div>

          <div className="admin-row__meta">
            <span
              className={`admin-badge ${
                product.status === "sold" ? "admin-badge--delivered" : "admin-badge--new"
              }`}
            >
              {product.status === "sold" ? "vândut" : "disponibil"}
            </span>

            {!product.viewEnabled && (
              <span className="admin-badge admin-badge--processing">ascuns</span>
            )}

            <button
              onClick={() => toggleVisibility(product)}
              title={product.viewEnabled ? "Ascunde de pe site" : "Arată pe site"}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--ap-charcoal)",
              }}
            >
              {product.viewEnabled ? <Eye size={17} /> : <EyeOff size={17} />}
            </button>

            <button
              onClick={() => deleteProduct(product)}
              title="Șterge definitiv"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#a4453a",
              }}
            >
              <Trash2 size={17} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}