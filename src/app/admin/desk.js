"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Arrow, Cross, Glass, Seal } from "@/components/marks";
import { moodOf } from "@/lib/moods";
import { formatWhen } from "@/lib/format";
import {
  approveConfession,
  refreshWall,
  removeConfession,
  signOut,
  unapproveConfession,
} from "@/lib/admin-actions";

const POLL_MS = 6000;
const SEARCH_DEBOUNCE_MS = 350;

export default function Desk({ notes, pulse, view, search, error }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState(null);
  const [, startTransition] = useTransition();
  const [term, setTerm] = useState(search);
  const [live, setLive] = useState(true);

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

  /* ---------------------------------------------------------------- search */

  const applySearch = useCallback(
    (value) => {
      const params = new URLSearchParams();
      if (view === "approved") params.set("view", "wall");
      if (value.trim()) params.set("q", value.trim());
      const query = params.toString();
      router.replace(query ? `/admin?${query}` : "/admin", { scroll: false });
    },
    [router, view]
  );

  useEffect(() => {
    if (term === search) return undefined;
    const timer = setTimeout(() => applySearch(term), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [term, search, applySearch]);

  /* ------------------------------------------------------------------ live
     A six-second heartbeat against a counts-only endpoint. It pulls fresh data
     only when the numbers actually move, so a new confession lands on the desk
     on its own without hammering the database.
     ---------------------------------------------------------------------- */

  const signature = useRef(`${pulse.pending}:${pulse.approved}:${pulse.latest}`);

  useEffect(() => {
    let stopped = false;
    let timer;

    const beat = async () => {
      if (document.visibilityState === "visible") {
        try {
          const res = await fetch("/api/admin/pulse", { cache: "no-store" });
          if (res.ok) {
            const next = await res.json();
            const stamp = `${next.pending}:${next.approved}:${next.latest}`;
            if (signature.current !== stamp) {
              signature.current = stamp;
              router.refresh();
            }
            if (!stopped) setLive(true);
          } else if (res.status === 401) {
            router.refresh(); // the session expired — fall back to the login form
            return;
          }
        } catch {
          if (!stopped) setLive(false);
        }
      }
      if (!stopped) timer = setTimeout(beat, POLL_MS);
    };

    timer = setTimeout(beat, POLL_MS);
    const onVisible = () => {
      if (document.visibilityState === "visible") beat();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      stopped = true;
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [router]);

  /* Keep the heartbeat in step after our own actions change the numbers. */
  useEffect(() => {
    signature.current = `${pulse.pending}:${pulse.approved}:${pulse.latest}`;
  }, [pulse.pending, pulse.approved, pulse.latest]);

  /* ---------------------------------------------------------------- render */

  const searching = Boolean(search.trim());

  return (
    <main className="scroll-surface">
      <div className="mx-auto w-full max-w-[52rem] px-5 pb-24 pt-16 sm:px-8 sm:pt-20">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow flex items-center gap-2">
              the desk
              <span
                className="pulse-dot"
                data-off={live ? undefined : "true"}
                title={live ? "Updating automatically" : "Not updating — connection lost"}
              />
            </p>
            <h1 className="display mt-2 text-[clamp(1.8rem,1.4rem+1.8vw,2.6rem)]">
              What people never said.
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="btn btn-sm btn-ghost"
              onClick={() =>
                startTransition(async () => {
                  await refreshWall();
                  router.refresh();
                })
              }
              title="Rebuild the wall from the database"
            >
              Rebuild wall
            </button>
            <form action={signOut}>
              <button type="submit" className="btn btn-ghost">
                Sign out
              </button>
            </form>
          </div>
        </header>

        <nav className="mt-9 flex flex-wrap items-center gap-x-1 gap-y-3 border-b border-[var(--line-soft)]">
          <DeskTab href={tabHref("pending", search)} active={view === "pending"} count={pulse.pending}>
            Waiting
          </DeskTab>
          <DeskTab href={tabHref("approved", search)} active={view === "approved"} count={pulse.approved}>
            On the wall
          </DeskTab>

          <div className="desk-search ml-auto">
            <Glass size={15} />
            <input
              value={term}
              onChange={(event) => setTerm(event.target.value)}
              placeholder="search these…"
              aria-label="Search confessions"
              spellCheck={false}
            />
            {term && (
              <button type="button" onClick={() => setTerm("")} aria-label="Clear search">
                <Cross size={12} />
              </button>
            )}
          </div>

          <Link
            href="/read"
            className="pb-3 pl-4 text-[0.6875rem] uppercase tracking-[0.16em] text-[var(--ink-3)] transition-colors hover:text-[var(--ink)]"
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
              {searching
                ? `Nothing here matches “${search.trim()}”.`
                : view === "pending"
                  ? "Nothing is waiting. Everything written so far has been read."
                  : "Nothing is on the wall yet."}
            </p>
          </div>
        )}

        {searching && notes.length > 0 && (
          <p className="mt-7 text-[0.75rem] uppercase tracking-[0.14em] text-[var(--ink-3)]">
            {notes.length} matching “{search.trim()}”
          </p>
        )}

        <ul className="mt-6 space-y-4">
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
            Showing the most recent 200. Search to reach the rest.
          </p>
        )}
      </div>
    </main>
  );
}

function tabHref(view, search) {
  const params = new URLSearchParams();
  if (view === "approved") params.set("view", "wall");
  if (search.trim()) params.set("q", search.trim());
  const query = params.toString();
  return query ? `/admin?${query}` : "/admin";
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
            <button
              type="button"
              className="btn btn-sm btn-ghost"
              onClick={onTakeDown}
              disabled={busy}
            >
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
