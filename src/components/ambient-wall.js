import { hash32, mulberry32 } from "@/lib/wall-layout";
import { moodOf } from "@/lib/moods";

/**
 * A still, blurred slice of the wall used as a backdrop on pages that don't
 * carry the real thing. No canvas, no listeners — just paper drifting on CSS.
 */
export default function AmbientWall({ notes = [], count = 9, className = "" }) {
  if (!notes.length) return null;

  const slips = notes.slice(0, count).map((note, index) => {
    const rand = mulberry32(hash32(`ambient:${note.id}:${index}`));
    const columns = Math.max(3, Math.ceil(Math.sqrt(count * 1.6)));
    const col = index % columns;
    const row = Math.floor(index / columns);
    const rows = Math.ceil(count / columns);

    return {
      id: note.id,
      note,
      left: ((col + 0.5) / columns) * 100 + (rand() - 0.5) * 16,
      top: ((row + 0.5) / Math.max(rows, 1)) * 100 + (rand() - 0.5) * 18,
      width: 190 + rand() * 110,
      rotate: (rand() - 0.5) * 9,
      blur: 2.6 + rand() * 5.2,
      opacity: 0.16 + rand() * 0.22,
      drift: 12 + rand() * 12,
      delay: -rand() * 20,
    };
  });

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
      style={{
        maskImage:
          "radial-gradient(90% 82% at 50% 50%, rgba(0,0,0,0.06) 0%, rgba(0,0,0,0.42) 48%, #000 100%)",
        WebkitMaskImage:
          "radial-gradient(90% 82% at 50% 50%, rgba(0,0,0,0.06) 0%, rgba(0,0,0,0.42) 48%, #000 100%)",
      }}
    >
      {slips.map((slip) => (
        <div
          key={slip.id}
          className="absolute"
          style={{
            left: `${slip.left}%`,
            top: `${slip.top}%`,
            width: `${slip.width}px`,
            transform: `translate(-50%, -50%) rotate(${slip.rotate}deg)`,
            filter: `blur(${slip.blur}px)`,
            opacity: slip.opacity,
          }}
        >
          <div
            className="wall-drift"
            style={{ "--drift": `${slip.drift}s`, "--drift-delay": `${slip.delay}s` }}
          >
            <div className="note" style={{ "--mood": moodOf(slip.note.mood).color }}>
              <span className="note-title">{slip.note.title}</span>
              <span className="note-body">{slip.note.preview}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
