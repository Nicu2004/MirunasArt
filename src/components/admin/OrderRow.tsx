export interface OrderItemSummary {
  productName: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: number;
  status: "new" | "processing" | "shipping" | "delivered";
  totalAmount: number;
  createdAt: string;
  customerName: string;
  items: OrderItemSummary[];
}

const STATUS_LABEL: Record<Order["status"], string> = {
  new: "nouă",
  processing: "procesare",
  shipping: "în livrare",
  delivered: "livrată",
};

export function OrderRow({ order }: { order: Order }) {
  const itemsSummary = order.items
    .map((i) => (i.quantity > 1 ? `${i.productName} ×${i.quantity}` : i.productName))
    .join(", ");

  return (
    <div className="admin-row">
      <div>
        <span className="admin-row__customer">{order.customerName}</span>
        <span className="admin-row__items"> — {itemsSummary}</span>
      </div>
      <div className="admin-row__meta">
        <span>{order.totalAmount.toLocaleString("ro-RO")} lei</span>
        <span className={`admin-badge admin-badge--${order.status}`}>
          {STATUS_LABEL[order.status]}
        </span>
      </div>
    </div>
  );
}