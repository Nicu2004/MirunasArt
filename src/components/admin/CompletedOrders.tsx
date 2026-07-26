import { useState } from "react";
import { useOrders } from "./UseOrders";
import { OrderRow } from "./OrderRow";

export default function CompletedOrders() {
  const [subTab, setSubTab] = useState<"shipping" | "delivered">("shipping");
  const { orders, loading, error } = useOrders(subTab);

  return (
    <div>
      <h2 className="admin-section-title">Terminate</h2>

      <div className="admin-subtabs">
        <button
          className={subTab === "shipping" ? "active" : ""}
          onClick={() => setSubTab("shipping")}
        >
          În livrare
        </button>
        <button
          className={subTab === "delivered" ? "active" : ""}
          onClick={() => setSubTab("delivered")}
        >
          Livrate
        </button>
      </div>

      {loading && <p className="admin-status">Se încarcă...</p>}
      {error && <p className="admin-status admin-status--error">{error}</p>}
      {!loading && !error && orders.length === 0 && (
        <p className="admin-status">Nicio comandă în această categorie.</p>
      )}

      {orders.map((order) => (
        <OrderRow key={order.id} order={order} />
      ))}
    </div>
  );
}