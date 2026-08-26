"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Arrow, Feather, Seal } from "@/components/marks";
import { MOODS, DEFAULT_MOOD } from "@/lib/moods";
import { submitConfession } from "@/lib/actions";

const LIMIT = 4000;
const EMPTY = { ok: false, message: "", field: null, id: null };

/**
 * "Write another" needs a genuinely clean slate — including the action state,
 * which has no reset of its own — so the sheet is remounted by key.
 */
export default function Compose() {
  const [round, setRound] = useState(0);
  return <Sheet key={round} onAgain={() => setRound((n) => n + 1)} />;
}

function Sheet({ onAgain }) {
  const [state, formAction, pending] = useActionState(submitConfession, EMPTY);
  const [text, setText] = useState("");
  const [mood, setMood] = useState(DEFAULT_MOOD);
  const [folded, setFolded] = useState(false);
  const textRef = useRef(null);

  /* On success the note folds away first, then the page changes underneath it. */
  useEffect(() => {
    if (!state.ok) return undefined;
    const timer = setTimeout(() => setFolded(true), 900);
    return () => clearTimeout(timer);
  }, [state.ok]);

  if (state.ok && folded) {
    return (
      <div className="relative z-10 max-w-[30rem] text-center settle">
        <Seal size={46} className="mx-auto text-[var(--rose)] opacity-55" />
        <h1 className="display mt-7 text-[clamp(1.9rem,1.4rem+2.4vw,3rem)]">
          It&apos;s out of your hands.
        </h1>
        <p className="mt-4 text-[0.95rem] leading-relaxed text-[var(--ink-2)]">
          Somebody reads everything before it goes up, so it may be a little
          while. Nobody knows it was you, and nobody will.
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/read" className="btn">
            Walk the wall
            <Arrow />
          </Link>
          <button type="button" className="btn btn-ghost" onClick={onAgain}>
            Write another
          </button>
        </div>
      </div>
    );
  }

  const nearLimit = text.length > LIMIT * 0.6;

  return (
    <form
      action={formAction}
      className={`compose ${state.ok ? "letgo" : ""}`}
      aria-busy={pending}
    >
      <div className="flex items-start justify-between gap-6">
        <div>
          <p className="eyebrow">write it once</p>
          <h1 className="display mt-2 text-[clamp(1.5rem,1.2rem+1.5vw,2.2rem)]">
            The part you never said.
          </h1>
        </div>
        <Feather size={22} className="mt-1 shrink-0 text-[var(--rose)] opacity-45" />
      </div>

      <hr className="rule my-5" />

      <label htmlFor="text" className="sr-only">
        Your confession
      </label>
      <textarea
        id="text"
        ref={textRef}
        name="text"
        className="compose-text ruled"
        value={text}
        maxLength={LIMIT}
        onChange={(event) => setText(event.target.value)}
        placeholder="Start anywhere. Nobody is going to know it was you…"
        rows={7}
      />

      <input type="hidden" name="mood" value={mood} />
      <input
        className="honeypot"
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      <div className="mt-5 flex flex-wrap items-center gap-1.5">
        <span className="mr-1 text-[0.6875rem] uppercase tracking-[0.18em] text-[var(--ink-3)]">
          how it feels
        </span>
        {MOODS.map((option) => (
          <button
            key={option.id}
            type="button"
            className="chip"
            style={{ "--chip": option.color }}
            aria-pressed={mood === option.id}
            title={option.hint}
            onClick={() =>
              setMood((current) => (current === option.id ? DEFAULT_MOOD : option.id))
            }
          >
            <span className="chip-dot" />
            {option.label}
          </button>
        ))}
      </div>

      <hr className="rule my-5" />

      <div className="flex flex-wrap items-end justify-between gap-5">
        <div className="min-w-[10rem] flex-1">
          <label
            htmlFor="author"
            className="block text-[0.6875rem] uppercase tracking-[0.18em] text-[var(--ink-3)]"
          >
            sign it, or don&apos;t
          </label>
          <input
            id="author"
            name="author"
            className="sign-field mt-1"
            placeholder="Anonymous"
            maxLength={40}
            autoComplete="off"
          />
        </div>

        <div className="flex items-center gap-4">
          <span
            className="text-[0.6875rem] tabular-nums tracking-[0.12em] text-[var(--ink-3)] transition-opacity duration-500"
            style={{ opacity: nearLimit ? 1 : 0 }}
            aria-hidden={!nearLimit}
          >
            {text.length} / {LIMIT}
          </span>
          <button type="submit" className="btn" disabled={pending || text.trim().length < 4}>
            {pending ? "Letting go…" : "Let it go"}
          </button>
        </div>
      </div>

      {state.message && !state.ok && (
        <p className="notice mt-3" role="alert">
          {state.message}
        </p>
      )}
    </form>
  );
}
