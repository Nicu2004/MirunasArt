import type { ComponentType, SVGProps } from "react";
import { InstagramIcon, FacebookIcon } from "../socialicons/SocialIcons";
import "./Artistsection.css";

interface SocialLink {
  label: string;
  href: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
}

interface Artist {
  name: string;
  tagline: string;
  bio: string;
  portraitUrl: string;
  social: SocialLink[];
}

const artist: Artist = {
  name: "Miruna Anton",
  tagline: "Pictor ",
  bio: "Scurtă descriere a artistului — parcurs, stil, ce anume caracterizează lucrările. Două-trei propoziții sunt suficiente aici; detaliul aparține paginii individuale a fiecărei lucrări, nu acestei secțiuni.",
  portraitUrl: "/images/artist-profile.jpg",
  social: [
    { label: "Instagram", href: "https://www.instagram.com/miruna.anton.art/", icon: InstagramIcon },
    { label: "Facebook", href: "https://www.facebook.com/miruna.anton1", icon: FacebookIcon },
  ],
};

export default function ArtistSection() {
  return (
    <section className="artist-section">
      <div className="artist-section__inner">
        <div className="artist-section__portrait-wrap">
          <div className="artist-section__portrait">
            <img src={artist.portraitUrl} alt={artist.name} />
          </div>
          <div className="artist-section__portrait-corner" />
        </div>

        <div className="artist-section__content">
          <p className="artist-section__eyebrow">Despre artist</p>

          <h2 className="artist-section__name">{artist.name}</h2>
          <p className="artist-section__tagline">{artist.tagline}</p>

          <div className="artist-section__rail" />

          <p className="artist-section__bio">{artist.bio}</p>

          <div className="artist-section__social">
            {artist.social.map(({ label, href, icon: Icon }) => (
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