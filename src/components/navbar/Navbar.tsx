import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import './Navbar.css';

interface NavLink {
  label: string;
  href: string;
}

const links: NavLink[] = [
  { label: 'Collection', href: '#collection' },
  { label: 'Exhibitions', href: '#exhibitions' },
  { label: 'Artists', href: '#artists' },
  { label: 'About', href: '#about' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState<string>(links[0].href);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // lock body scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const handleNavClick = (href: string) => {
    setActive(href);
    setMenuOpen(false);
  };

  return (
    <header className={`av-navbar ${scrolled ? 'av-scrolled' : ''}`}>
      <nav className="av-navbar-inner">
        <a href="#top" className="av-wordmark" onClick={() => handleNavClick('#top')}>
          <span className="av-wordmark-mark">&</span>
          <span className="av-wordmark-text">Miruna's Art</span>
        </a>

        <ul className="av-links">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={`av-link ${active === link.href ? 'av-active' : ''}`}
                onClick={() => handleNavClick(link.href)}
              >
                {link.label}
                <span className="av-rail" />
              </a>
            </li>
          ))}
        </ul>

        <a href="#visit" className="av-cta" onClick={() => handleNavClick('#visit')}>
          Plan a Visit
        </a>

        <button
          className="av-menu-btn"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      <div className={`av-mobile-panel ${menuOpen ? 'av-open' : ''}`}>
        <ul>
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={`av-mobile-link ${active === link.href ? 'av-active' : ''}`}
                onClick={() => handleNavClick(link.href)}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <a href="#visit" className="av-mobile-cta" onClick={() => handleNavClick('#visit')}>
          Plan a Visit
        </a>
      </div>
    </header>
  );
}