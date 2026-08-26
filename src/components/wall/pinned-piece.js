"use client";

import Image from "next/image";
import { Fastener } from "@/components/marks";
import { moodOf } from "@/lib/moods";
import { formatWhen } from "@/lib/format";

const PETAL_RENDER_WIDTH = 150;

/**
 * One piece of paper on the wall. Rendered as a button so the whole card is a
 * single, keyboard-reachable target.
 */
export default function PinnedPiece({ cell, onOpen, canFocus }) {
  const { piece, fastener } = cell;
  const mood = moodOf(piece.data.mood);
  const common = {
    type: "button",
    tabIndex: canFocus ? 0 : -1,
    "aria-hidden": canFocus ? undefined : true,
    onClick: () => onOpen(piece),
    style: { "--mood": mood.color },
  };

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

  if (piece.kind === "letter") {
    return (
      <button
        {...common}
        className="letter"
        aria-label={`Hand-lettered piece: ${piece.data.title}`}
      >
        <Fastener kind={fastener} color={mood.color} />
        {/* Hand-lettered SVG: next/image would need dangerouslyAllowSVG and cannot optimise it anyway. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={piece.data.src}
          alt=""
          loading="lazy"
          decoding="async"
          draggable="false"
        />
        <span className="letter-caption">{piece.data.title}</span>
      </button>
    );
  }

  const note = piece.data;
  return (
    <button {...common} className="note" aria-label={`Confession: ${note.title}`}>
      <Fastener kind={fastener} color={mood.color} />
      <span className="note-title">{note.title}</span>
      <span className="note-body">{note.preview}</span>
      <span className="note-meta">
        <span className="mood-dot" />
        <span>{formatWhen(note.createdAt)}</span>
        <span aria-hidden="true">·</span>
        <span className="note-sign">{note.author}</span>
      </span>
    </button>
  );
}
