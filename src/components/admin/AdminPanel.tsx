
import { useState } from "react";
import {
  Inbox,
  Clock,
  Truck,
  BarChart3,
  FileText,
  Settings,
  ChevronDown,
  Image,
  CalendarDays,
  UserCircle,
  Plus
} from "lucide-react";
import NewOrders from "./Neworders";
import ActiveOrders from "./ActiveOrders";
import CompletedOrders from "./CompletedOrders";
import Reports from "./Reports";
import Invoices from "./Invoices";
import ProductsAdmin from "./Productsadmin";
import ArtworkUpload from "./ArtworkImageUpload"
import ExhibitionAdministration from './ExhibitionAdminsitration'
import "./AdminPanel.css";

type View =
  | "new"
  | "active"
  | "completed"
  | "reports"
  | "invoices"
  | "site-products"
  | "uploadWidget"
  | "site-exhibitions"
  | "site-artist";

const TOP_NAV_ITEMS: { view: View; label: string; Icon: typeof Inbox }[] = [
  { view: "new", label: "Comenzi noi", Icon: Inbox },
  { view: "active", label: "Comenzi active", Icon: Clock },
  { view: "completed", label: "Terminate", Icon: Truck },
  { view: "reports", label: "Rapoarte", Icon: BarChart3 },
  { view: "invoices", label: "Facturi", Icon: FileText },
  { view: "uploadWidget", label: "Adauga Opere", Icon: Plus}
];

const SITE_SUB_ITEMS: { view: View; label: string; Icon: typeof Inbox }[] = [
  { view: "site-products", label: "Opere", Icon: Image },
  { view: "site-exhibitions", label: "Expoziții", Icon: CalendarDays },
  { view: "site-artist", label: "Despre artist", Icon: UserCircle },
];

export default function AdminPanel() {
  const [view, setView] = useState<View>("new");
  const [siteMenuOpen, setSiteMenuOpen] = useState(false);

  const isSiteView = view.startsWith("site-");

  return (
    <div className="admin-panel">
      <nav className="admin-sidebar">
        {TOP_NAV_ITEMS.map(({ view: itemView, label, Icon }) => (
          <button
            key={itemView}
            className={`admin-nav-item ${view === itemView ? "active" : ""}`}
            onClick={() => setView(itemView)}
          >
            <Icon size={17} strokeWidth={1.75} />
            <span>{label}</span>
          </button>
        ))}

        {/* Administrare Site — item expandabil, cu sub-secțiuni */}
        <button
          className={`admin-nav-item ${isSiteView ? "active" : ""}`}
          onClick={() => setSiteMenuOpen((open) => !open)}
        >
          <Settings size={17} strokeWidth={1.75} />
          <span>Administrare Site</span>
          <ChevronDown
            size={14}
            className="admin-nav-chevron"
            style={{
              marginLeft: "auto",
              transform: siteMenuOpen ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.15s ease",
            }}
          />
        </button>

        {siteMenuOpen && (
          <div className="admin-nav-submenu">
            {SITE_SUB_ITEMS.map(({ view: itemView, label, Icon }) => (
              <button
                key={itemView}
                className={`admin-nav-subitem ${view === itemView ? "active" : ""}`}
                onClick={() => setView(itemView)}
              >
                <Icon size={15} strokeWidth={1.75} />
                <span>{label}</span>
              </button>
            ))}
          </div>
        )}
      </nav>

      <div className="admin-content">
        {view === "new" && <NewOrders />}
        {view === "active" && <ActiveOrders />}
        {view === "completed" && <CompletedOrders />}
        {view === "reports" && <Reports />}
        {view === "invoices" && <Invoices />}
        {view === "uploadWidget" && <ArtworkUpload/>}
        {view === "site-products" && <ProductsAdmin />}
        {view === "site-exhibitions" && <ExhibitionAdministration/>}

        {view === "site-artist" && (
          <p className="admin-status">
            Administrare secțiune artist — în lucru, trimite fișierele
            ArtistSection ca să o construim.
          </p>
        )}
      </div>
    </div>
  );
}