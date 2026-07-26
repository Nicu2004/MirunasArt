import { useState, useEffect } from "react";
import { useAuth } from "../authpage/Authcontext";
import type { Order } from "./OrderRow";

const API_URL = import.meta.env.VITE_API_URL;

export function useOrders(status: Order["status"]) {
  const { authFetch } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await authFetch(
          `${API_URL}/api/admin/orders?status=${status}`
        );
        if (!res.ok) {
          if (!cancelled) setError("Nu am putut încărca comenzile");
          return;
        }
        const data = await res.json();
        if (!cancelled) setOrders(data.orders);
      } catch {
        if (!cancelled) setError("Eroare la încărcarea comenzilor");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [authFetch, status]);

  return { orders, loading, error };
}