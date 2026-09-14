"use client";

// The oven arch from the brandbook. Stone and logs are static; only the fire
// moves.
//
// Real flame does three things at once, so this draws three layers that never
// line up: an outer body that leans and breathes, a hotter core inside it on a
// different clock, and an ember glow on a third. The edges are then pushed
// around by animated turbulence, which is what stops it reading as a shape
// being scaled. Every duration is a different prime-ish length, so the loop
// takes about two minutes to repeat visibly.
const FLAME =
  "M223.64,186.27c-2.37-.01-9.2-.37-14.86-5.36-8.03-7.06-7.46-17.92-7.38-19.11.59-8.65,5.77-10.85,6.88-21.24.51-4.83-.13-8.87-.71-11.43,1.19.88,2.56,2.09,3.84,3.74,3.26,4.2,3.96,8.69,4.15,10.92.52-2.8,1.34-6.98,2.53-12.03,2.49-10.63,3.79-16.05,6.78-21.03,1.74-2.91,4.88-7.24,10.52-11.43-.89,2.51-1.8,6.25-1.11,10.52,1.06,6.57,5.32,10.65,8.19,13.95,4.12,4.74,9.21,12.31,12.74,24.37.41-2.08,1.25-5.08,3.14-8.29,1.47-2.51,3.12-4.38,4.45-5.66-.68,6.71.24,11.71,1.21,15.07,1,3.43,1.96,4.79,2.19,7.88.39,5.43-1.98,9.71-3.35,12.19-5.98,10.8-17.84,16.15-21.49,17.66.88-.72,7.16-6.09,7.18-15.07.02-8.16-5.15-13.28-6.07-14.16.25,1,.48,2.39.4,4.05-.09,2.15-.65,3.86-1.11,4.95-.83-3.22-2.51-8.02-6.07-12.94-2.34-3.23-4.82-5.61-6.88-7.28.39,3.57.55,9.96-2.34,16.99-1.32,3.21-2.96,5.76-4.43,7.68.05-1.13,0-3.19-1.01-5.46-.68-1.53-1.56-2.63-2.22-3.34.19,1.35.38,3.43.2,5.97-.29,3.97-1.25,5.51-1.31,7.69-.07,2.36.9,5.82,5.97,10.21Z";

export function WoodFire({ className = "" }) {
  return (
    <svg
      viewBox="0 0 463.46 225.03"
      role="img"
      aria-label="Wood-fired oven"
      className={className}
    >
      <defs>
        <linearGradient id="poca-flame-body" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="var(--sugo)" />
          <stop offset="38%" stopColor="var(--ember)" />
          <stop offset="100%" stopColor="var(--forno)" />
        </linearGradient>

        <linearGradient id="poca-flame-core" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="var(--ember)" />
          <stop offset="55%" stopColor="var(--forno)" />
          <stop offset="100%" stopColor="#fff6d8" />
        </linearGradient>

        <radialGradient id="poca-glow" cx="50%" cy="55%" r="50%">
          <stop offset="0%" stopColor="var(--ember)" stopOpacity="0.5" />
          <stop offset="60%" stopColor="var(--ember)" stopOpacity="0.16" />
          <stop offset="100%" stopColor="var(--ember)" stopOpacity="0" />
        </radialGradient>

        {/* Animated noise pushes the outline around a couple of units. This is
            what makes it look like burning rather than pulsing. */}
        <filter id="poca-wobble" x="-40%" y="-40%" width="180%" height="180%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.021 0.055"
            numOctaves="2"
            seed="7"
            result="noise"
          >
            <animate
              attributeName="baseFrequency"
              dur="7.3s"
              values="0.021 0.055;0.030 0.044;0.018 0.061;0.021 0.055"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="3.4"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>

        <filter id="poca-wobble-core" x="-40%" y="-40%" width="180%" height="180%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.035 0.07"
            numOctaves="2"
            seed="23"
            result="noise"
          >
            <animate
              attributeName="baseFrequency"
              dur="4.9s"
              values="0.035 0.07;0.026 0.081;0.035 0.07"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="2.1"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>

      {/* arch */}
      <g fill="currentColor">
        <path d="M104.3,39.21l52.42-24.44c6.06-2.83,13.24.27,15.34,6.62l19.19,57.92c1.78,5.39-.75,11.25-5.89,13.65l-39.57,18.45c-5.14,2.4-11.26.56-14.24-4.26l-32.03-51.93c-3.51-5.69-1.27-13.18,4.79-16.01Z" />
        <path d="M19.97,106.55l40.39-48.13c4.67-5.57,13.16-5.81,18.14-.53l45.49,48.22c4.23,4.48,4.43,11.42.47,16.15l-30.49,36.34c-3.96,4.72-10.83,5.73-15.98,2.34l-55.39-36.42c-6.07-3.99-7.3-12.39-2.63-17.96Z" />
        <path d="M.34,204.83l13.19-49.24c1.53-5.7,7.68-8.79,13.16-6.61l49.98,19.86c4.65,1.85,7.17,6.88,5.88,11.71l-9.96,37.17c-1.29,4.83-6,7.93-10.95,7.2l-53.21-7.79c-5.83-.85-9.62-6.61-8.09-12.3Z" />
        <path d="M263.15,0h-62.83c-7.27,0-12.91,6.34-12.07,13.56l7.7,65.84c.72,6.12,5.9,10.74,12.07,10.74h47.43c6.16,0,11.35-4.62,12.07-10.74l7.7-65.84C276.06,6.34,270.42,0,263.15,0Z" />
        <path d="M359.16,39.09l-52.42-24.44c-6.06-2.83-13.24.27-15.34,6.62l-19.19,57.92c-1.78,5.39.75,11.25,5.89,13.65l39.57,18.45c5.14,2.4,11.26.56,14.24-4.26l32.03-51.93c3.51-5.69,1.27-13.18-4.79-16.01Z" />
        <path d="M443.49,106.44l-40.39-48.13c-4.67-5.57-13.16-5.81-18.14-.53l-45.49,48.22c-4.23,4.48-4.43,11.42-.47,16.15l30.49,36.34c3.96,4.72,10.83,5.73,15.98,2.34l55.39-36.42c6.07-3.99,7.3-12.39,2.63-17.96Z" />
        <path d="M463.12,204.72l-13.19-49.24c-1.53-5.7-7.68-8.79-13.16-6.61l-49.98,19.86c-4.65,1.85-7.17,6.88-5.88,11.71l9.96,37.17c1.29,4.83,6,7.93,10.95,7.2l53.21-7.79c5.83-.85,9.62-6.61,8.09-12.3Z" />
      </g>

      <ellipse className="poca-glow" cx="233" cy="168" rx="76" ry="56" fill="url(#poca-glow)" />

      {/* outer body */}
      <g className="poca-flame-body">
        <path d={FLAME} fill="url(#poca-flame-body)" filter="url(#poca-wobble)" />
      </g>

      {/* hotter core, sitting on the same base point */}
      <g transform="translate(233 187) scale(0.58) translate(-233 -187)">
        <g className="poca-flame-core">
          <path d={FLAME} fill="url(#poca-flame-core)" filter="url(#poca-wobble-core)" />
        </g>
      </g>

      {/* logs */}
      <g fill="currentColor">
        <path d="M202.37,200.46c8.76-2.22,17.53-4.45,26.29-6.67-10.34-2.49-20.67-4.99-31.01-7.48-.17.06-4.21,1.44-5.06,5.46-.69,3.28,1.29,5.74,1.62,6.14,1.89,2.28,5.05,3.25,8.16,2.56Z" />
        <path d="M182.72,206.83c-.37.86-2.49,6.01.06,11.3,1.36,2.84,3.46,4.46,4.6,5.22,7.11-2.2,14.22-4.4,21.34-6.61-.17,1.89-.34,3.78-.51,5.66.43.18,1.04.37,1.8.42,1.3.09,2.32-.28,2.85-.52l7.75-15.2.13,5.87c16.13-4.81,32.27-9.62,48.4-14.43.3-.91.87-3.13.14-5.76-.48-1.73-1.34-2.95-1.92-3.64-4.48.94-8.97,1.88-13.45,2.81,1.53-1.86,3.06-3.72,4.59-5.58,0-.18-.02-1.23-.88-2.02-1-.93-2.29-.7-2.43-.67l-8.97,8.16c-21.17,5-42.34,10-63.51,15Z" />
        <path d="M235.98,210.37c8.93-2.76,17.87-5.53,26.8-8.29,5.58,1.35,11.17,2.7,16.75,4.04.4,1.64.81,3.28,1.21,4.92-2.11-.09-4.22-.18-6.34-.27,1.99,1.08,3.98,2.16,5.97,3.24-.14,1-.54,2.84-1.82,4.75-1.19,1.77-2.6,2.81-3.44,3.34l-39.13-11.73Z" />
      </g>
    </svg>
  );
}
