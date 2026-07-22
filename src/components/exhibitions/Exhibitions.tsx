import type { CSSProperties } from 'react';
import './Exhibitions.css';

type ExhibitionStatus = 'now' | 'upcoming' | 'past';

interface Exhibition {
  status: ExhibitionStatus;
  title: string;
  dates: string;
  location: string;
  description: string;
}

// Replace with real exhibition data as it's confirmed.
const EXHIBITIONS: Exhibition[] = [
  {
    status: 'now',
    title: 'Light on Water',
    dates: 'July 12 — September 3, 2026',
    location: 'Main Gallery',
    description:
      'A survey of landscape works exploring how painters have rendered reflected and diffused light across two centuries.',
  },
  {
    status: 'upcoming',
    title: 'The Pastoral Eye',
    dates: 'September 20 — November 15, 2026',
    location: 'East Wing',
    description:
      'Rural scenes and working landscapes, tracing how the countryside has been depicted as both labor and retreat.',
  },
  {
    status: 'past',
    title: 'Alpine Perspectives',
    dates: 'March 2 — June 20, 2026',
    location: 'Main Gallery',
    description:
      'Mountain and lake views from the 19th century, considering scale, distance, and the sublime in landscape painting.',
  },
];

const STATUS_LABEL: Record<ExhibitionStatus, string> = {
  now: 'Now Showing',
  upcoming: 'Upcoming',
  past: 'Past Exhibition',
};

// Sparks flickering off the spine at scattered points along its length —
// fixed values (not Math.random()) so the layout is stable across renders
// and doesn't shift on re-render.
interface Ember {
  top: string;
  left: number; // px offset from the spine
  size: number; // px
  delay: number; // s
  duration: number; // s
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

export default function Exhibitions() {
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

        {EXHIBITIONS.map((ex) => (
          <article className={`exh-entry exh-${ex.status}`} key={ex.title}>
            <div className="exh-node" aria-hidden="true" />

            <div className="exh-card">
              <span className={`exh-status exh-status-${ex.status}`}>
                {STATUS_LABEL[ex.status]}
              </span>
              <h3 className="exh-entry-title">{ex.title}</h3>
              <p className="exh-meta">
                {ex.dates} &middot; {ex.location}
              </p>
              <p className="exh-description">{ex.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}