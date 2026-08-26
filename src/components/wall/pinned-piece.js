"use client";

import Image from "next/image";
import { Fastener } from "@/components/marks";
import { moodOf } from "@/lib/moods";
import { formatWhen } from "@/lib/format";

const PETAL_RENDER_WIDTH = 150;

/**
 * Pale paper colours for sticky notes, keyed to the feeling the note was filed
 * under — the same meaning as the mood dot, but legible across the wall.
 */
const STICKY_PAPER = {
  love: "#F5DFDC",
  regret: "#E1E2EE",
  grief: "#DCE5E5",
  hope: "#E2E9D6",
  thanks: "#F6EDC8",
  unspoken: "#EFE4D4",
};

/**
 * One piece of paper on the wall. Rendered as a button so the whole card is a
 * single, keyboard-reachable target. `data-piece` lets the wall resolve a tap
 * back to this note — the click event itself is unreliable while the wall holds
 * pointer capture for dragging.
 */
export default function PinnedPiece({ cell, onOpen, canFocus }) {
  const { piece, fastener, paper } = cell;

  if (piece.kind === "petal") {
    return (
      <span className="petal" aria-hidden="true">
        {/* Sized to how it actually renders, so Next serves a ~150px WebP
            rather than the full-size PNG. */}
        <Image
          src={piece.data.src}
          alt=""
          width={PETAL_RENDER_WIDTH}
          height={Math.round((PETAL_RENDER_WIDTH * piece.data.h) / piece.data.w)}
          draggable={false}
        />
      </span>
    );
  }

  const mood = moodOf(piece.data.mood);
  const common = {
    type: "button",
    tabIndex: canFocus ? 0 : -1,
    "aria-hidden": canFocus ? undefined : true,
    "data-piece": cell.key,
    onClick: () => onOpen(piece),
    style: { "--mood": mood.color },
  };

  const note = piece.data;
  const when = formatWhen(note.createdAt);
  const label = `Confession: ${note.title}`;

  if (paper === "sticky") {
    return (
      <button
        {...common}
        className="paper-piece sticky"
        aria-label={label}
        style={{
          ...common.style,
          "--sticky": STICKY_PAPER[note.mood] ?? STICKY_PAPER.unspoken,
        }}
      >
        <Fastener kind={fastener} color={mood.color} />
        <span className="sticky-body">{note.preview}</span>
        <span className="sticky-sign">— {note.author}</span>
      </button>
    );
  }

  if (paper === "scrap") {
    return (
      <button {...common} className="paper-piece scrap" aria-label={label}>
        <Fastener kind={fastener} color={mood.color} />
        <span className="scrap-body">{note.preview}</span>
        <span className="note-meta">
          <span className="mood-dot" />
          <span className="note-sign">{note.author}</span>
        </span>
      </button>
    );
  }

  if (paper === "card") {
    return (
      <button {...common} className="paper-piece card" aria-label={label}>
        <Fastener kind={fastener} color={mood.color} />
        <span className="card-rule" aria-hidden="true" />
        <span className="note-title">{note.title}</span>
        <span className="note-body">{note.preview}</span>
        <span className="note-meta">
          <span className="mood-dot" />
          <span>{when}</span>
          <span aria-hidden="true">·</span>
          <span className="note-sign">{note.author}</span>
        </span>
      </button>
    );
  }

  return (
    <button {...common} className="paper-piece note" aria-label={label}>
      <Fastener kind={fastener} color={mood.color} />
      <span className="note-title">{note.title}</span>
      <span className="note-body">{note.preview}</span>
      <span className="note-meta">
        <span className="mood-dot" />
        <span>{when}</span>
        <span aria-hidden="true">·</span>
        <span className="note-sign">{note.author}</span>
      </span>
    </button>
  );
}
