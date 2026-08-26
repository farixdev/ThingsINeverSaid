"use client";

import { useEffect, useRef } from "react";
import { Cross, Seal } from "@/components/marks";
import { moodOf } from "@/lib/moods";
import { formatWhen } from "@/lib/format";

/**
 * The focus reader. Opening one holds everything else still: the wall behind
 * blurs, the page keeps its place, and Escape or a click outside lets go.
 */
export default function Reader({ piece, onClose }) {
  const sheetRef = useRef(null);
  const closeRef = useRef(null);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (event) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;
      const focusables = sheetRef.current?.querySelectorAll(
        'button, a[href], [tabindex]:not([tabindex="-1"])'
      );
      if (!focusables?.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey, true);
    return () => document.removeEventListener("keydown", onKey, true);
  }, [onClose]);

  const data = piece.data;
  const mood = moodOf(data.mood);

  return (
    <div
      className="reader"
      role="dialog"
      aria-modal="true"
      aria-label={data.title}
      onPointerDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="reader-sheet" ref={sheetRef}>
        <button ref={closeRef} className="reader-close" onClick={onClose} aria-label="Close">
          <Cross />
        </button>

        <header className="pr-10">
          <p className="eyebrow" style={{ color: mood.color }}>
            {mood.label}
          </p>
          <h2 className="display mt-2 text-[clamp(1.6rem,1.2rem+1.6vw,2.5rem)]">
            {data.title}
          </h2>
          <p className="mt-3 text-[0.75rem] tracking-[0.14em] uppercase text-[var(--ink-3)]">
            {formatWhen(data.createdAt)}
            <span className="mx-2" aria-hidden="true">
              ·
            </span>
            <span className="hand normal-case tracking-normal text-[0.95rem] text-[var(--ink-3)]">
              {data.author}
            </span>
          </p>
        </header>

        <hr className="rule my-6" />

        <div className="reader-scroll">
          <p className="reader-body">{data.text}</p>
        </div>

        <footer className="mt-7 flex items-center justify-between gap-4 text-[var(--ink-4)]">
          <Seal size={30} />
          <p className="text-[0.6875rem] tracking-[0.2em] uppercase">
            Held without judgement
          </p>
        </footer>
      </div>
    </div>
  );
}
