/** Decorative torn-paper edge (CFJ-style hero transition) */
export default function TornEdge({ className = '' }) {
  return (
    <div className={`torn-edge ${className}`.trim()} aria-hidden="true">
      <svg
        className="torn-edge__svg"
        viewBox="0 0 1440 48"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="currentColor"
          d="M0,0 L1440,0 L1440,18 C1320,8 1200,28 1080,12 960,32 840,14 720,26 600,10 480,30 360,16 240,28 120,14 0,22 Z"
        />
      </svg>
    </div>
  );
}
