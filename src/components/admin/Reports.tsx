import { useState, useEffect } from "react";
import { Download } from "lucide-react";
import { useAuth } from "../authpage/Authcontext";

const API_URL = import.meta.env.VITE_API_URL;

interface MonthlyStats {
  artworksSold: number;
  totalRevenue: number;
  month: string;
}

const MONTHLY_STATS_QUERY = `
  query MonthlyStats {
    monthlyStats {
      artworksSold
      totalRevenue
      month
    }
  }
`;

export default function Reports() {
  const { authFetch, accessToken } = useAuth();
  const [stats, setStats] = useState<MonthlyStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        // GraphQL peste acelaşi authFetch — un singur POST, query trimis în body
        const res = await authFetch(`${API_URL}/graphql`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: MONTHLY_STATS_QUERY }),
        });

        if (!res.ok) {
          setError("Nu am putut încărca raportul");
          return;
        }

        const { data, errors } = await res.json();
        if (errors?.length) {
          setError(errors[0].message);
          return;
        }
        setStats(data.monthlyStats);
      } catch {
        setError("Eroare la încărcarea raportului");
      } finally {
        setLoading(false);
      }
    })();
  }, [authFetch]);

  async function downloadExcel() {
    setExporting(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/reports/export`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!res.ok) {
        setError("Nu am putut genera raportul Excel");
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `raport-${stats?.month ?? "vanzari"}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setError("Eroare la descărcarea raportului");
    } finally {
      setExporting(false);
    }
  }

  if (loading) return <p className="admin-status">Se încarcă...</p>;
  if (error) return <p className="admin-status admin-status--error">{error}</p>;
  if (!stats) return null;

  return (
    <div>
      <h2 className="admin-section-title">Rapoarte — {stats.month}</h2>

      <div className="admin-metrics">
        <div className="admin-metric">
          <span className="admin-metric__label">Picturi vândute</span>
          <span className="admin-metric__value">{stats.artworksSold}</span>
        </div>
        <div className="admin-metric">
          <span className="admin-metric__label">Total încasat</span>
          <span className="admin-metric__value">
            {stats.totalRevenue.toLocaleString("ro-RO")} lei
          </span>
        </div>
      </div>

      <button className="admin-export-btn" onClick={downloadExcel} disabled={exporting}>
        <Download size={16} strokeWidth={1.75} />
        {exporting ? "Se generează..." : "Descarcă raport Excel"}
      </button>
    </div>
  );
}