import { useState, useEffect } from "react";
import { useAuth } from "../authpage/Authcontext";

const API_URL = import.meta.env.VITE_API_URL;

interface Invoice {
  id: number;
  customerName: string;
  customerAddress: string;
  amountPaid: number;
  issuedAt: string;
}

export default function Invoices() {
  const { authFetch } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await authFetch(`${API_URL}/api/admin/invoices`);
        if (!res.ok) {
          setError("Nu am putut încărca facturile");
          return;
        }
        const data = await res.json();
        setInvoices(data.invoices);
      } catch {
        setError("Eroare la încărcarea facturilor");
      } finally {
        setLoading(false);
      }
    })();
  }, [authFetch]);

  if (loading) return <p className="admin-status">Se încarcă...</p>;
  if (error) return <p className="admin-status admin-status--error">{error}</p>;

  return (
    <div>
      <h2 className="admin-section-title">Facturi</h2>

      {invoices.length === 0 && (
        <p className="admin-status">Nicio factură emisă încă.</p>
      )}

      {invoices.map((inv) => (
        <div className="admin-row" key={inv.id}>
          <div>
            <span className="admin-row__customer">{inv.customerName}</span>
            <span className="admin-row__items"> — {inv.customerAddress}</span>
          </div>
          <div className="admin-row__meta">
            <span>{inv.amountPaid.toLocaleString("ro-RO")} lei</span>
            <span className="admin-invoice-date">
              {new Date(inv.issuedAt).toLocaleDateString("ro-RO")}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}