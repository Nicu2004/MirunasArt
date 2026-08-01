import type { ComponentType, SVGProps } from "react";
import { useState, useEffect } from "react";
import { InstagramIcon, FacebookIcon } from "../socialicons/SocialIcons";
import "./Artistsection.css";

const API_URL = import.meta.env.VITE_API_URL;
const NGROK_HEADERS = { "ngrok-skip-browser-warning": "true" };

interface SocialLink {
  label: string;
  href: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
}

// Poza rămâne fixă, cum ai cerut — schema Artist nu are câmp de portret.
const PORTRAIT_URL = "/images/artist-profile.jpg";

const SOCIAL_LINKS: SocialLink[] = [
  { label: "Instagram", href: "https://instagram.com/username", icon: InstagramIcon },
  { label: "Facebook", href: "https://facebook.com/username", icon: FacebookIcon },
];

export default function ArtistSection() {
  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    (async () => {
      try {
        // fetch simplu, NU authFetch — ruta /api/artist e publică,
        // fără requireAuth pe backend
        const res = await fetch(`${API_URL}/api/artist`, {
          headers: NGROK_HEADERS,
        });

        if (!res.ok) {
          setError("error while loading artist data");
          return;
        }

        const data = await res.json();
        setName(data.artist.name);
        setTagline(data.artist.title);
        setBio(data.artist.description);
      } catch {
        setError("error while loading artist data");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return null;
  if (error) return <p className="artist-section__error">{error}</p>;

  return (
    <section className="artist-section">
      <div className="artist-section__inner">
        <div className="artist-section__portrait-wrap">
          <div className="artist-section__portrait">
            <img src={PORTRAIT_URL} alt={name} />
          </div>
          <div className="artist-section__portrait-corner" />
        </div>

        <div className="artist-section__content">
          <p className="artist-section__eyebrow">Despre artist</p>

          <h2 className="artist-section__name">{name}</h2>
          <p className="artist-section__tagline">{tagline}</p>

          <div className="artist-section__rail" />

          <p className="artist-section__bio">{bio}</p>

          <div className="artist-section__social">
            {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="artist-section__social-link"
              >
                <Icon width={18} height={18} />
                <span>{label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}