import { useState } from "react";
import { Inbox, Clock, Truck, BarChart3, FileText } from "lucide-react";
import NewOrders from "./Neworders.tsx";
import ActiveOrders from "./ActiveOrders.tsx";
import CompletedOrders from "./CompletedOrders.tsx";
import Reports from "./Reports.tsx";
import Invoices from "./Invoices.tsx";
import ArtworkUpload from './ArtworkImageUpload'
import "./AdminPanel.css";

type View = "new" | "active" | "completed" | "reports" | "invoices" | "uploadWidget";

const NAV_ITEMS: { view: View; label: string; Icon: typeof Inbox }[] = [
  { view: "new", label: "Comenzi noi", Icon: Inbox },
  { view: "active", label: "Comenzi active", Icon: Clock },
  { view: "completed", label: "Terminate", Icon: Truck },
  { view: "reports", label: "Rapoarte", Icon: BarChart3 },
  { view: "invoices", label: "Facturi", Icon: FileText },
  { view: "uploadWidget", label:"Upload Artword", Icon: FileText},
];

export default function AdminPanel() {
  const [view, setView] = useState<View>("new");

  return (
    <div className="admin-panel">
      <nav className="admin-sidebar">
        {NAV_ITEMS.map(({ view: itemView, label, Icon }) => (
          <button
            key={itemView}
            className={`admin-nav-item ${view === itemView ? "active" : ""}`}
            onClick={() => setView(itemView)}
          >
            <Icon size={17} strokeWidth={1.75} />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <div className="admin-content">
        {view === "new" && <NewOrders />}
        {view === "active" && <ActiveOrders />}
        {view === "completed" && <CompletedOrders />}
        {view === "reports" && <Reports />}
        {view === "invoices" && <Invoices />}
        {view === "uploadWidget" && <ArtworkUpload/>}
      </div>
    </div>
  );
}