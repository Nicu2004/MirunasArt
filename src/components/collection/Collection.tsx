import { useState, useEffect } from "react";
import "./Collection.css";

const API_URL = import.meta.env.VITE_API_URL;

interface Product {
  id: number;
  name: string;
  price: number;
  photoUrl: string;
}

export default function Collection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_URL}/api/products`);
        if (!res.ok) {
          setError("Nu am putut încărca colecția");
          return;
        }
        const data = await res.json();
        setProducts(data.products);
      } catch {
        setError("Eroare la încărcarea colecției");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <section id="collection" className="collection-section">
      <div className="collection-heading">
        <span className="collection-eyebrow">Colecția</span>
        <h2 className="collection-title">Lucrări expuse</h2>
        <div className="collection-rule" />
      </div>

      {loading && <p className="collection-empty">Se încarcă...</p>}
      {error && <p className="collection-empty">{error}</p>}

      {!loading && !error && products.length === 0 ? (
        <p className="collection-empty">No pieces to display yet.</p>
      ) : (
        <div className="collection-grid">
          {products.map((product) => (
            <figure className="collection-card" key={product.id}>
              <div className="collection-frame">
                <img src={product.photoUrl} alt={product.name} loading="lazy" />
              </div>
              <figcaption className="collection-caption">
                <span className="collection-piece-title">{product.name}</span>
                <span className="collection-piece-meta">
                  {product.price.toLocaleString("ro-RO")} lei
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      )}
    </section>
  );
}