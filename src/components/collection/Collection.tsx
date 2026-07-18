import { useMemo } from 'react';
import './Collection.css';

// Reuses the same glob pattern as the carousel so any image dropped into
// src/assets as image-component-{n}.ext shows up here automatically.
const imageModules = import.meta.glob('/src/assets/image-component-*.{png,jpg,jpeg,svg,webp,gif}', {
  eager: true,
  import: 'default',
}) as Record<string, string>;

const extractNumber = (path: string): number => {
  const match = path.match(/image-component-(\d+)\./);
  return match ? parseInt(match[1], 10) : 0;
};

// Placeholder metadata — replace title/artist/year per piece, or swap this
// for data pulled from a CMS / API once you have real catalogue info.
interface PieceMeta {
  title: string;
  artist: string;
  year: string;
}

const DEFAULT_META: PieceMeta = {
  title: 'Untitled',
  artist: 'Unknown Artist',
  year: 'n.d.',
};

// Map specific image numbers to real metadata as you get it, e.g.:
// const META_BY_NUMBER: Record<number, PieceMeta> = {
//   1: { title: 'Pastoral Crossing', artist: 'P. Zeller', year: '1878' },
// };
const META_BY_NUMBER: Record<number, PieceMeta> = {};

export default function Collection() {
  const pieces = useMemo(() => {
    return Object.entries(imageModules)
      .sort(([a], [b]) => extractNumber(a) - extractNumber(b))
      .map(([path, src]) => {
        const number = extractNumber(path);
        const meta = META_BY_NUMBER[number] ?? DEFAULT_META;
        return { number, src, ...meta };
      });
  }, []);

  return (
    <section id="collection" className="collection-section">
      <div className="collection-heading">
        <span className="collection-eyebrow">The Collection</span>
        <h2 className="collection-title">Works on View</h2>
        <div className="collection-rule" />
      </div>

      {pieces.length === 0 ? (
        <p className="collection-empty">No pieces to display yet.</p>
      ) : (
        <div className="collection-grid">
          {pieces.map((piece) => (
            <figure className="collection-card" key={piece.number}>
              <div className="collection-frame">
                <img src={piece.src} alt={piece.title} loading="lazy" />
              </div>
              <figcaption className="collection-caption">
                <span className="collection-piece-title">{piece.title}</span>
                <span className="collection-piece-meta">
                  {piece.artist} &middot; {piece.year}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      )}
    </section>
  );
}