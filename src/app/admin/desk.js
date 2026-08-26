"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Arrow, Cross, Seal } from "@/components/marks";
import { moodOf } from "@/lib/moods";
import { formatWhen } from "@/lib/format";
import {
  approveConfession,
  removeConfession,
  signOut,
  unapproveConfession,
} from "@/lib/admin-actions";

export default function Desk({ notes, counts, view, error }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState(null);
  const [, startTransition] = useTransition();

  const run = (id, action) => {
    setBusyId(id);
    startTransition(async () => {
      try {
        await action();
        router.refresh();
      } finally {
        setBusyId(null);
      }
    });
  };

  return (
    <main className="scroll-surface">
      <div className="mx-auto w-full max-w-[52rem] px-5 pb-24 pt-16 sm:px-8 sm:pt-20">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">the desk</p>
            <h1 className="display mt-2 text-[clamp(1.8rem,1.4rem+1.8vw,2.6rem)]">
              What people never said.
            </h1>
          </div>
          <form action={signOut}>
            <button type="submit" className="btn btn-ghost">
              Sign out
            </button>
          </form>
        </header>

        <nav className="mt-9 flex items-center gap-1 border-b border-[var(--line-soft)]">
          <DeskTab href="/admin" active={view === "pending"} count={counts.pending}>
            Waiting
          </DeskTab>
          <DeskTab href="/admin?view=wall" active={view === "approved"} count={counts.approved}>
            On the wall
          </DeskTab>
          <Link
            href="/read"
            className="ml-auto pb-3 text-[0.6875rem] uppercase tracking-[0.16em] text-[var(--ink-3)] transition-colors hover:text-[var(--ink)]"
          >
            View the wall <Arrow size={13} className="ml-1 inline-block align-[-1px]" />
          </Link>
        </nav>

        {error && (
          <p className="notice mt-8" role="alert">
            {error}
          </p>
        )}

        {!error && notes.length === 0 && (
          <div className="mt-20 text-center">
            <Seal size={40} className="mx-auto text-[var(--rose)] opacity-35" />
            <p className="mt-6 text-[0.95rem] text-[var(--ink-3)]">
              {view === "pending"
                ? "Nothing is waiting. Everything written so far has been read."
                : "Nothing is on the wall yet."}
            </p>
          </div>
        )}

        <ul className="mt-8 space-y-4">
          {notes.map((note) => (
            <DeskNote
              key={note.id}
              note={note}
              view={view}
              busy={busyId === note.id}
              onApprove={() => run(note.id, () => approveConfession(note.id))}
              onTakeDown={() => run(note.id, () => unapproveConfession(note.id))}
              onDelete={() => run(note.id, () => removeConfession(note.id))}
            />
          ))}
        </ul>

        {notes.length >= 200 && (
          <p className="mt-8 text-center text-[0.75rem] text-[var(--ink-3)]">
            Showing the most recent 200. Clear some of these to see the rest.
          </p>
        )}
      </div>
    </main>
  );
}

function DeskTab({ href, active, count, children }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`relative -mb-px border-b px-3 pb-3 text-[0.75rem] uppercase tracking-[0.14em] transition-colors ${
        active
          ? "border-[var(--rose)] text-[var(--ink)]"
          : "border-transparent text-[var(--ink-3)] hover:text-[var(--ink)]"
      }`}
    >
      {children}
      <span className="ml-2 tabular-nums text-[var(--ink-4)]">{count}</span>
    </Link>
  );
}

function DeskNote({ note, view, busy, onApprove, onTakeDown, onDelete }) {
  const [open, setOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const mood = moodOf(note.mood);
  const long = note.text.length > 260;

  return (
    <li className="paper rounded-[4px] p-5 sm:p-6" style={{ "--mood": mood.color }}>
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h2 className="text-[1.05rem]">{note.title}</h2>
        <span className="flex items-center gap-1.5 text-[0.6875rem] uppercase tracking-[0.14em] text-[var(--ink-3)]">
          <span className="mood-dot" />
          {mood.label}
        </span>
      </div>

      <p
        className={`mt-3 whitespace-pre-wrap text-[0.9rem] leading-[1.75] text-[var(--ink-2)] ${
          open ? "" : "line-clamp-3"
        }`}
      >
        {note.text}
      </p>

      {long && (
        <button
          type="button"
          className="mt-2 text-[0.75rem] tracking-[0.06em] text-[var(--rose)] underline underline-offset-4"
          onClick={() => setOpen((was) => !was)}
        >
          {open ? "Show less" : "Read all of it"}
        </button>
      )}

      <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--line-soft)] pt-4">
        <p className="text-[0.6875rem] uppercase tracking-[0.14em] text-[var(--ink-3)]">
          {formatWhen(note.createdAt)}
          <span className="mx-2" aria-hidden="true">
            ·
          </span>
          <span className="hand text-[0.95rem] normal-case tracking-normal">{note.author}</span>
        </p>

        <div className="flex flex-wrap items-center gap-2">
          {view === "pending" ? (
            <button type="button" className="btn btn-sm" onClick={onApprove} disabled={busy}>
              Put it on the wall
            </button>
          ) : (
            <button type="button" className="btn btn-sm btn-ghost" onClick={onTakeDown} disabled={busy}>
              Take it down
            </button>
          )}

          {confirming ? (
            <span className="flex items-center gap-2">
              <button
                type="button"
                className="btn btn-sm btn-danger"
                onClick={onDelete}
                disabled={busy}
              >
                {busy ? "Deleting…" : "Delete for good"}
              </button>
              <button
                type="button"
                className="dock-btn h-8 min-w-8"
                onClick={() => setConfirming(false)}
                aria-label="Cancel"
              >
                <Cross size={13} />
              </button>
            </span>
          ) : (
            <button
              type="button"
              className="btn btn-sm btn-ghost"
              onClick={() => setConfirming(true)}
              disabled={busy}
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </li>
  );
}
