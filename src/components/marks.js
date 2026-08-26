/**
 * Hand-drawn marks. Every one is authored here as SVG geometry so the whole
 * icon set weighs nothing and inherits the ink colour.
 */

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.25,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export function Sprig({ size = 96, className = "", style }) {
  return (
    <svg
      width={size}
      height={size * 1.35}
      viewBox="0 0 100 135"
      className={className}
      style={style}
      aria-hidden="true"
      focusable="false"
    >
      <g {...stroke} strokeWidth="1.1">
        <path d="M50 132C50 108 47 88 49 68C50 56 52 47 52 40" />
        <path d="M49 104C36 101 27 92 25 79C38 79 47 88 49 104Z" />
        <path d="M50 88C63 84 72 74 73 61C60 62 51 72 50 88Z" />
        <path d="M50 72C39 68 32 59 32 48C43 49 49 58 50 72Z" />
        {[0, 72, 144, 216, 288].map((angle) => (
          <ellipse
            key={angle}
            cx="52"
            cy="26"
            rx="6.5"
            ry="12"
            transform={`rotate(${angle} 52 38)`}
          />
        ))}
        <circle cx="52" cy="38" r="3.2" />
      </g>
    </svg>
  );
}

export function Seal({ size = 44, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <g {...stroke}>
        <circle cx="24" cy="24" r="20" strokeDasharray="1.5 3.4" />
        <circle cx="24" cy="24" r="15" />
        <path d="M18 29c2-8 4-12 6-12s2 5-1 9 3 3 7-4" />
      </g>
    </svg>
  );
}

export function Envelope({ size = 26, className = "" }) {
  return (
    <svg
      width={size}
      height={size * 0.72}
      viewBox="0 0 32 23"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <g {...stroke}>
        <rect x="1" y="1" width="30" height="21" rx="2.5" />
        <path d="M1.8 3 16 13 30.2 3" />
      </g>
    </svg>
  );
}

export function Feather({ size = 26, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 26 26"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <g {...stroke}>
        <path d="M4 22C4 22 5.5 14 11 8.5 15 4.6 21 3 21 3s-.6 6.4-4.5 10.4C11 19 4 22 4 22Z" />
        <path d="M2.5 23.5 9 17" />
      </g>
    </svg>
  );
}

export function Glass({ size = 18, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <g {...stroke}>
        <circle cx="8.6" cy="8.6" r="6.1" />
        <path d="m13.2 13.2 4.3 4.3" />
      </g>
    </svg>
  );
}

export function Cross({ size = 16, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <g {...stroke}>
        <path d="m3.5 3.5 9 9M12.5 3.5l-9 9" />
      </g>
    </svg>
  );
}

export function Target({ size = 18, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <g {...stroke}>
        <circle cx="10" cy="10" r="6.4" />
        <circle cx="10" cy="10" r="1.5" />
        <path d="M10 1v2.2M10 16.8V19M1 10h2.2M16.8 10H19" />
      </g>
    </svg>
  );
}

export function Expand({ size = 18, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <g {...stroke}>
        <path d="M8 2.5H2.5V8M12 2.5h5.5V8M8 17.5H2.5V12M12 17.5h5.5V12" />
      </g>
    </svg>
  );
}

export function Collapse({ size = 18, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <g {...stroke}>
        <path d="M2.5 7.5H8V2M17.5 7.5H12V2M2.5 12.5H8V18M17.5 12.5H12V18" />
      </g>
    </svg>
  );
}

export function Arrow({ size = 16, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <g {...stroke}>
        <path d="M2.5 8h11M9.5 4l4 4-4 4" />
      </g>
    </svg>
  );
}

/** The little paper fasteners that hold notes to the wall. */
export function Fastener({ kind, color }) {
  if (kind === "pin") {
    return (
      <span className="fastener fastener-pin" aria-hidden="true">
        <svg viewBox="0 0 18 18" width="18" height="18">
          <circle cx="9" cy="9" r="5.4" fill={color} opacity="0.9" />
          <circle cx="7.3" cy="7.2" r="1.7" fill="#fff" opacity="0.55" />
        </svg>
      </span>
    );
  }
  if (kind === "thread") {
    return (
      <span className="fastener fastener-thread" aria-hidden="true">
        <svg viewBox="0 0 44 14" width="44" height="14">
          <path
            d="M1 1c7 9 14 11 21 11s14-2 21-11"
            fill="none"
            stroke={color}
            strokeWidth="1.1"
            opacity="0.55"
          />
        </svg>
      </span>
    );
  }
  return <span className="fastener fastener-tape" aria-hidden="true" />;
}
