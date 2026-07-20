import "./Scrollindicator.css";

interface ScrollIndicatorProps {
  label?: string;
}

export default function ScrollIndicator({ label = "Descoperă" }: ScrollIndicatorProps) {
  return (
    <div className="scroll-indicator" aria-hidden="true">
      {label && <span className="scroll-indicator__label">{label}</span>}
      <div className="scroll-indicator__chevrons">
        <svg
          className="scroll-indicator__chevron scroll-indicator__chevron--1"
          viewBox="0 0 24 12"
          fill="none"
        >
          <path
            d="M2 2L12 10L22 2"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <svg
          className="scroll-indicator__chevron scroll-indicator__chevron--2"
          viewBox="0 0 24 12"
          fill="none"
        >
          <path
            d="M2 2L12 10L22 2"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}