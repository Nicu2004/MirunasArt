import type { CSSProperties } from 'react';
import { useState, useEffect } from 'react';
import { useAuth } from '../authpage/Authcontext';
import './Exhibitions.css';

const API_URL = import.meta.env.VITE_API_URL;

interface Exhibition {
  status: 'now' | 'upcoming' | 'past';
  title: string;
  date: string;
  location: string;
  description: string;
}

interface Ember {
  top: string;
  left: number;
  size: number;
  delay: number;
  duration: number;
}

const EMBERS: Ember[] = [
  { top: '3%', left: -3, size: 3, delay: 0, duration: 3.1 },
  { top: '9%', left: 4, size: 2, delay: 0.9, duration: 2.6 },
  { top: '16%', left: -5, size: 2.5, delay: 1.8, duration: 3.4 },
  { top: '23%', left: 2, size: 3.5, delay: 0.3, duration: 2.9 },
  { top: '31%', left: -2, size: 2, delay: 2.4, duration: 3.6 },
  { top: '38%', left: 5, size: 3, delay: 1.1, duration: 2.7 },
  { top: '46%', left: -4, size: 2.5, delay: 0.6, duration: 3.2 },
  { top: '53%', left: 3, size: 2, delay: 2.9, duration: 2.8 },
  { top: '61%', left: -3, size: 3.5, delay: 1.5, duration: 3.5 },
  { top: '68%', left: 4, size: 2.5, delay: 0.2, duration: 3 },
  { top: '76%', left: -5, size: 2, delay: 2.1, duration: 2.6 },
  { top: '83%', left: 2, size: 3, delay: 1.3, duration: 3.3 },
  { top: '90%', left: -2, size: 2.5, delay: 0.7, duration: 2.9 },
  { top: '96%', left: 3, size: 2, delay: 2.6, duration: 3.1 },
];

const STATUS_LABEL: Record<Exhibition['status'], string> = {
  now: 'Now Showing',
  upcoming: 'Upcoming',
  past: 'Past Exhibition',
};

export default function Exhibitions() {
  const { authFetch } = useAuth();
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  async function loadExhibitions() {
    const res = await authFetch(`${API_URL}/api/exhibitions`);
    if (!res.ok) {
      setError('error fetching the exhibitions');
      return;
    }
    const json = await res.json();
    setExhibitions(json.data);
  }

  useEffect(() => {
    loadExhibitions();
  }, []);

  const visibleExhibitions = showAll ? exhibitions : exhibitions.slice(0, 3);
  const hasMore = !showAll && exhibitions.length > 3;

  return (
    <section id="exhibitions" className="exh-section">
      <div className="exh-heading">
        <span className="exh-eyebrow">Exhibitions</span>
        <h2 className="exh-title">Past, Present &amp; Coming</h2>
        <div className="exh-rule" />
      </div>

      <div className="exh-timeline">
        <div className="exh-spine" aria-hidden="true" />

        <div className="exh-particles" aria-hidden="true">
          {EMBERS.map((ember, i) => (
            <span
              key={i}
              className="exh-particle"
              style={
                {
                  top: ember.top,
                  '--ember-left': `${ember.left}px`,
                  width: ember.size,
                  height: ember.size,
                  animationDelay: `${ember.delay}s`,
                  animationDuration: `${ember.duration}s`,
                } as CSSProperties
              }
            />
          ))}
        </div>

        {error != null && <h3>{error}</h3>}

        {visibleExhibitions.map((exhibition, i) => (
          <article className={`exh-entry exh-${exhibition.status}`} key={i}>
            <div className="exh-node" aria-hidden="true" />

            <div className="exh-card">
              <span className={`exh-status exh-status-${exhibition.status}`}>
                {STATUS_LABEL[exhibition.status]}
              </span>
              <h3 className="exh-entry-title">{exhibition.title}</h3>
              <p className="exh-meta">
                {exhibition.date} &middot; {exhibition.location}
              </p>
              <p className="exh-description">{exhibition.description}</p>
            </div>
          </article>
        ))}
      </div>

      {hasMore && (
        <button className="exh-show-all-btn" onClick={() => setShowAll(true)}>
          <span>Vezi toate expozițiile</span>
          <span className="exh-show-all-arrow" aria-hidden="true">
            <svg viewBox="0 0 24 12" fill="none">
              <path
                d="M2 2L12 10L22 2"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </button>
      )}
    </section>
  );
}