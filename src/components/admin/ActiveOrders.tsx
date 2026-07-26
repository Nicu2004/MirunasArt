import { useOrders } from "./UseOrders";
import { OrderRow } from "./OrderRow";

export default function ActiveOrders() {
  const { orders, loading, error } = useOrders("processing");

  return (
    <div>
      <h2 className="admin-section-title">Comenzi active</h2>

      {loading && <p className="admin-status">Se încarcă...</p>}
      {error && <p className="admin-status admin-status--error">{error}</p>}
      {!loading && !error && orders.length === 0 && (
        <p className="admin-status">Nicio comandă în procesare momentan.</p>
      )}

      {orders.map((order) => (
        <OrderRow key={order.id} order={order} />
      ))}
    </div>
  );
}