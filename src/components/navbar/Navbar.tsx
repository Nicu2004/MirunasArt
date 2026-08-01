import { useState, useEffect } from "react";
import { Menu, X, User, LogOut, Clock, History, Bell } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../authpage/Authcontext";
import "./Navbar.css";

interface NavLink {
  label: string;
  href: string;
}

const links: NavLink[] = [
  { label: "Colectii", href: "#collection" },
  { label: "Expoziții", href: "#exhibitions" },
  { label: "Artist", href: "#artists" },
  { label: "Despre", href: "#about" },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState<string>(links[0].href);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const handleNavClick = (href: string) => {
    setActive(href);
    setMenuOpen(false);
  };

  async function handleLogout() {
    await logout();
    alert("se cere delogare")
    setMenuOpen(false);
    navigate("/");
  }

  return (
    <header className={`av-navbar ${scrolled ? "av-scrolled" : ""}`}>
      <nav className="av-navbar-inner">
        <a href="/" className="av-wordmark" onClick={() => handleNavClick("#top")}>
          <span className="av-wordmark-mark">&</span>
          <span className="av-wordmark-text">Miruna's Art</span>
        </a>

        <ul className="av-links">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={`av-link ${active === link.href ? "av-active" : ""}`}
                onClick={() => handleNavClick(link.href)}
              >
                {link.label}
                <span className="av-rail" />
              </a>
            </li>
          ))}
        </ul>

        <div className="av-actions">
          {user ? (
            <div className="av-profile-dropdown">
              <Link to="/profile" className="av-login">
                <User size={16} strokeWidth={1.75} />
                <span>{user.email}</span>
              </Link>

              <div className="av-profile-menu">
                <Link to="/profile#order-details" className="av-profile-menu-item">
                  <Clock size={15} strokeWidth={1.75} />
                  <span>Comenzi active</span>
                </Link>
                <Link to="/profile#order-history" className="av-profile-menu-item">
                  <History size={15} strokeWidth={1.75} />
                  <span>Istoric comenzi</span>
                </Link>
                <Link to="/profile#notifications-area" className="av-profile-menu-item">
                  <Bell size={15} strokeWidth={1.75} />
                  <span>Notificări</span>
                </Link>
                <button className="av-profile-menu-item av-profile-menu-item--logout" onClick={handleLogout}>
                  <LogOut size={15} strokeWidth={1.75} />
                  <span>Delogare</span>
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="av-login" onClick={() => setMenuOpen(false)}>
              <User size={16} strokeWidth={1.75} />
              <span>Autentificare</span>
            </Link>
          )}

          <a href="#visit" className="av-cta" onClick={() => handleNavClick("#visit")}>
            Planifica o vizita
          </a>
        </div>

        <button
          className="av-menu-btn"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      <div className={`av-mobile-panel ${menuOpen ? "av-open" : ""}`}>
        <ul>
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={`av-mobile-link ${active === link.href ? "av-active" : ""}`}
                onClick={() => handleNavClick(link.href)}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {user ? (
          <>
            <Link to="/profile" className="av-mobile-login" onClick={() => setMenuOpen(false)}>
              <User size={16} strokeWidth={1.75} />
              <span>{user.email}</span>
            </Link>
            <Link to="/profile#order-details" className="av-mobile-login" onClick={() => setMenuOpen(false)}>
              <Clock size={16} strokeWidth={1.75} />
              <span>Comenzi active</span>
            </Link>
            <Link to="/profile#order-history" className="av-mobile-login" onClick={() => setMenuOpen(false)}>
              <History size={16} strokeWidth={1.75} />
              <span>Istoric comenzi</span>
            </Link>
            <Link to="/profile#notifications-area" className="av-mobile-login" onClick={() => setMenuOpen(false)}>
              <Bell size={16} strokeWidth={1.75} />
              <span>Notificări</span>
            </Link>
            <button className="av-mobile-login av-mobile-logout" onClick={handleLogout}>
              <LogOut size={16} strokeWidth={1.75} />
              <span>Delogare</span>
            </button>
          </>
        ) : (
          <Link to="/login" className="av-mobile-login" onClick={() => setMenuOpen(false)}>
            <User size={16} strokeWidth={1.75} />
            <span>Autentificare</span>
          </Link>
        )}

        <a href="#visit" className="av-mobile-cta" onClick={() => handleNavClick("#visit")}>
          Plan a Visit
        </a>
      </div>
    </header>
  );
}