import { useOrders } from "./UseOrders";
import { OrderRow } from "./OrderRow";

export default function NewOrders() {
  const { orders, loading, error } = useOrders("new");

  return (
    <div>
      <h2 className="admin-section-title">Comenzi noi</h2>

      {loading && <p className="admin-status">Se încarcă...</p>}
      {error && <p className="admin-status admin-status--error">{error}</p>}
      {!loading && !error && orders.length === 0 && (
        <p className="admin-status">Nicio comandă nouă momentan.</p>
      )}

      {orders.map((order) => (
        <OrderRow key={order.id} order={order} />
      ))}
    </div>
  );
}