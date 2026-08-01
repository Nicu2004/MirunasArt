import { useState, useEffect } from "react";
import { Download, Mail } from "lucide-react";
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
  const { authFetch, accessToken } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sendingId, setSendingId] = useState<number | null>(null);

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

  async function downloadPdf(invoice: Invoice) {
    const res = await fetch(`${API_URL}/api/admin/invoices/${invoice.id}/pdf`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!res.ok) {
      setError("Nu am putut descărca factura");
      return;
    }

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `factura-INV-${String(invoice.id).padStart(4, "0")}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function sendByEmail(invoice: Invoice) {
    setSendingId(invoice.id);
    try {
      const res = await authFetch(
        `${API_URL}/api/admin/invoices/${invoice.id}/send-email`,
        { method: "POST" }
      );

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setError(data?.message ?? "Nu am putut trimite factura");
        return;
      }

      alert(data.message);
    } catch {
      setError("Eroare la trimiterea facturii");
    } finally {
      setSendingId(null);
    }
  }

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

            <button
              onClick={() => downloadPdf(inv)}
              title="Descarcă PDF"
              style={{ background: "none", border: "none", cursor: "pointer", color: "var(--ap-charcoal)" }}
            >
              <Download size={16} />
            </button>

            <button
              onClick={() => sendByEmail(inv)}
              disabled={sendingId === inv.id}
              title="Trimite pe email"
              style={{ background: "none", border: "none", cursor: "pointer", color: "var(--ap-charcoal)" }}
            >
              <Mail size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}