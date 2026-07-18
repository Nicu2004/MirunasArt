import TextType from '../TextType';
import './Artquoteoverlay.css';


const ART_QUOTES = [
  '"Every artist dips his brush in his own soul." — Henry Ward Beecher',
  '"Art washes away from the soul the dust of everyday life." — Pablo Picasso',
  '"Color is my day-long obsession, joy and torment." — Claude Monet',
  '"The purpose of art is washing the dust of daily life off our souls."',
  '"I dream of painting and then I paint my dream." — Vincent van Gogh',
];

export default function ArtQuoteOverlay() {
  return (
    <div className="quote-overlay">
      <div className="quote-scrim" />
      <TextType
        as="p"
        className="quote-text"
        text={ART_QUOTES}
        typingSpeed={45}
        deletingSpeed={20}
        pauseDuration={3200}
        initialDelay={600}
        loop
        showCursor
        cursorCharacter="|"
        cursorClassName="quote-cursor"
      />
    </div>
  );
}