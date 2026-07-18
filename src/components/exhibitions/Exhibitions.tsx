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