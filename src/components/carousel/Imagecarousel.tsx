import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ArtQuoteOverlay from '../artquoteoverlay/Artquoteoverlay'
import './Imagecarousel.css';

const imageModules = import.meta.glob('/src/assets/image-component-*.{png,jpg,jpeg,svg,webp,gif}', {
  eager: true,
  import: 'default',
}) as Record<string, string>;

// Extracts the numeric part of "image-component-{number}.ext" for correct numeric sorting
// (plain alphabetical sort would put "image-component-10" before "image-component-2").
const extractNumber = (path: string): number => {
  const match = path.match(/image-component-(\d+)\./);
  return match ? parseInt(match[1], 10) : 0;
};

const images: { src: string; name: string }[] = Object.entries(imageModules)
  .sort(([a], [b]) => extractNumber(a) - extractNumber(b))
  .map(([path, src]) => ({
    src,
    name: path.split('/').pop() ?? 'image',
  }));

interface ImageCarouselProps {
  autoPlay?: boolean;
  autoPlayInterval?: number; // ms
}

export default function ImageCarousel({ autoPlay = false, autoPlayInterval = 4000 }: ImageCarouselProps) {
  const [index, setIndex] = useState(0);

  const goPrev = useCallback(() => {
    setIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  }, []);

  const goNext = useCallback(() => {
    setIndex((i) => (i === images.length - 1 ? 0 : i + 1));
  }, []);

  // optional autoplay
  useEffect(() => {
    if (!autoPlay || images.length <= 1) return;
    const timer = setInterval(goNext, autoPlayInterval);
    return () => clearInterval(timer);
  }, [autoPlay, autoPlayInterval, goNext]);

  // keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [goPrev, goNext]);

  if (images.length === 0) {
    return <div className="carousel-empty">No images found in src/assets</div>;
  }

  return (
    <div className="carousel-viewport">
      <div className="carousel-wrapper">
        <button
          className="carousel-btn carousel-btn-left"
          onClick={goPrev}
          aria-label="Previous image"
        >
          <ChevronLeft size={28} />
        </button>

        <div className="carousel-track">
          {images.map((img, i) => (
            <img
              key={img.name}
              src={img.src}
              alt={img.name}
              className={`carousel-image ${i === index ? 'active' : ''}`}
              style={{ transform: `translateX(${(i - index) * 100}%)` }}
            />
          ))}
        </div>

        <ArtQuoteOverlay />

        <button
          className="carousel-btn carousel-btn-right"
          onClick={goNext}
          aria-label="Next image"
        >
          <ChevronRight size={28} />
        </button>

        <div className="carousel-dots">
          {images.map((img, i) => (
            <button
              key={img.name}
              className={`carousel-dot ${i === index ? 'active' : ''}`}
              onClick={() => setIndex(i)}
              aria-label={`Go to image ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}