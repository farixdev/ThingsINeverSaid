/**
 * Everything that makes the page feel like paper rather than a screen:
 * a fixed film grain, and three very slow lights behind the content.
 * Both are pure SVG/CSS generated here — no image requests.
 */

export function Grain() {
  return (
    <svg className="grain" aria-hidden="true" focusable="false">
      <filter id="tins-grain">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.82"
          numOctaves="4"
          stitchTiles="stitch"
          result="noise"
        />
        <feColorMatrix in="noise" type="saturate" values="0" result="mono" />
        <feComponentTransfer in="mono">
          <feFuncR type="linear" slope="0.34" intercept="0.66" />
          <feFuncG type="linear" slope="0.34" intercept="0.66" />
          <feFuncB type="linear" slope="0.34" intercept="0.66" />
        </feComponentTransfer>
      </filter>
      <rect width="100%" height="100%" filter="url(#tins-grain)" />
    </svg>
  );
}

const LIGHTS = [
  { size: 46, top: "-14%", left: "-10%", color: "#e9d7d0", delay: "0s" },
  { size: 38, top: "44%", left: "68%", color: "#e2dac7", delay: "-11s" },
  { size: 30, top: "72%", left: "12%", color: "#dcd3e0", delay: "-22s" },
];

export function Aurora() {
  return (
    <div className="aurora" aria-hidden="true">
      {LIGHTS.map((light) => (
        <span
          key={light.left + light.top}
          style={{
            width: `${light.size}vmax`,
            height: `${light.size}vmax`,
            top: light.top,
            left: light.left,
            background: light.color,
            animationDelay: light.delay,
          }}
        />
      ))}
    </div>
  );
}
