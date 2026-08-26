"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { Cross, Seal } from "@/components/marks";
import { moodOf } from "@/lib/moods";
import { formatWhen } from "@/lib/format";
import { approveConfession, removeConfession, unapproveConfession } from "@/lib/admin-actions";

const PAGE = 18;
const REFRESH_CAP = 120; // most rows we'll silently re-pull on a live change

/*
  Pages already fetched, kept across tab switches so flipping between Waiting
  and On the wall is instant. Keyed by view, search, offset and a generation
  counter that is bumped whenever the data underneath changes — which is what
  makes it safe to hold onto at all.
*/
const pageCache = new Map();
let generation = 0;

export function invalidateDeskCache() {
  generation += 1;
  pageCache.clear();
}

function cacheKey(view, search, offset, limit) {
  return `${generation}|${view}|${search}|${offset}|${limit}`;
}

async function fetchPage({ view, search, offset, limit = PAGE, useCache = true }) {
  const key = cacheKey(view, search, offset, limit);
  if (useCache && pageCache.has(key)) return pageCache.get(key);

  const params = new URLSearchParams({ offset: String(offset), limit: String(limit) });
  if (view === "approved") params.set("view", "wall");
  if (search.trim()) params.set("q", search.trim());

  const res = await fetch(`/api/admin/notes?${params}`, { cache: "no-store" });
  if (!res.ok) throw new Error(String(res.status));
  const page = await res.json();
  pageCache.set(key, page);
  return page;
}

/**
 * The grid. Mounted fresh whenever the tab or the search changes, and owner of
 * the list from then on — approving, taking down and deleting all update it in
 * place rather than throwing away how far somebody has scrolled.
 */
export default function DeskList({ first, view, search, scrollRef, onCountsChanged, signal }) {
  const [items, setItems] = useState(first.data);
  const [hasMore, setHasMore] = useState(first.hasMore);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [waiting, setWaiting] = useState(0);
  const [busyId, setBusyId] = useState(null);
  const [, startTransition] = useTransition();
  const sentinelRef = useRef(null);
  const itemsRef = useRef(items);
  itemsRef.current = items;

  const searching = Boolean(search.trim());

  /* The page scrolls inside a container, so a tab or search change has to put
     it back at the top itself — otherwise the sentinel is already in view and
     immediately pulls every remaining page. */
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [scrollRef]);

  /* ------------------------------------------------------------- load more */

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    setFailed(false);
    try {
      const page = await fetchPage({ view, search, offset: itemsRef.current.length });
      setItems((current) => {
        // The offset can shift under us if something was approved elsewhere;
        // de-duplicate rather than render the same confession twice.
        const seen = new Set(current.map((n) => n.id));
        return [...current, ...page.data.filter((n) => !seen.has(n.id))];
      });
      setHasMore(page.hasMore);
    } catch {
      setFailed(true);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, view, search]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { root: scrollRef.current ?? null, rootMargin: "600px 0px" }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loadMore, scrollRef]);

  /* ---------------------------------------------------------------- reload */

  const reload = useCallback(async () => {
    const size = Math.min(Math.max(itemsRef.current.length, PAGE), REFRESH_CAP);
    try {
      const page = await fetchPage({ view, search, offset: 0, limit: 60, useCache: false });
      let data = page.data;
      // Keep the reader roughly where they were when the list is long.
      if (size > data.length && page.hasMore) {
        const rest = await fetchPage({
          view,
          search,
          offset: data.length,
          limit: Math.min(size - data.length, 60),
          useCache: false,
        });
        data = [...data, ...rest.data];
      }
      setItems(data);
      setHasMore(page.total > data.length);
      setWaiting(0);
      setFailed(false);
    } catch {
      setFailed(true);
    }
  }, [view, search]);

  /* A live change arrived. Pull it in quietly if they're at the top of the
     page; otherwise offer it, so nothing moves under their cursor. */
  useEffect(() => {
    if (!signal) return;
    const node = scrollRef.current;
    const atTop = !node || node.scrollTop < 240;
    if (atTop) reload();
    else setWaiting((n) => n + 1);
  }, [signal, reload, scrollRef]);

  /* -------------------------------------------------------------- mutating */

  const act = (note, action) => {
    setBusyId(note.id);
    startTransition(async () => {
      try {
        await action();
        invalidateDeskCache();
        setItems((current) => current.filter((n) => n.id !== note.id));
        onCountsChanged?.();
      } finally {
        setBusyId(null);
      }
    });
  };

  /* ---------------------------------------------------------------- render */

  if (items.length === 0 && !loading) {
    return (
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
    );
  }

  return (
    <>
      {waiting > 0 && (
        <button
          type="button"
          className="new-pill"
          onClick={() => {
            scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
            reload();
          }}
        >
          Something new arrived — show it
        </button>
      )}

      <ul className="desk-grid">
        {items.map((note) => (
          <DeskCard
            key={note.id}
            note={note}
            view={view}
            busy={busyId === note.id}
            onApprove={() => act(note, () => approveConfession(note.id))}
            onTakeDown={() => act(note, () => unapproveConfession(note.id))}
            onDelete={() => act(note, () => removeConfession(note.id))}
          />
        ))}

        {loading && <DeskSkeletons count={6} />}
      </ul>

      {hasMore && !failed && <div ref={sentinelRef} className="h-4" aria-hidden="true" />}

      {failed && (
        <div className="mt-8 text-center">
          <p className="text-[0.85rem] text-[var(--ink-3)]">That didn&apos;t load.</p>
          <button type="button" className="btn btn-sm btn-ghost mt-3" onClick={loadMore}>
            Try again
          </button>
        </div>
      )}

      {!hasMore && items.length > PAGE && (
        <p className="mt-10 text-center text-[0.6875rem] uppercase tracking-[0.18em] text-[var(--ink-3)]">
          That&apos;s all of them
        </p>
      )}
    </>
  );
}

/** Shimmering placeholders in the shape of a real card. */
export function DeskSkeletons({ count = 6 }) {
  return Array.from({ length: count }, (_, index) => (
    <li key={`skeleton-${index}`} className="desk-card desk-card-ghost" aria-hidden="true">
      <span className="skeleton h-4 w-3/5" />
      <span className="skeleton mt-4 h-3 w-full" />
      <span className="skeleton mt-2 h-3 w-11/12" />
      <span className="skeleton mt-2 h-3 w-4/5" />
      <span className="mt-auto flex items-center justify-between pt-5">
        <span className="skeleton h-3 w-24" />
        <span className="skeleton h-7 w-28 !rounded-full" />
      </span>
    </li>
  ));
}

function DeskCard({ note, view, busy, onApprove, onTakeDown, onDelete }) {
  const [open, setOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const mood = moodOf(note.mood);
  const long = note.text.length > 200;

  return (
    <li className="desk-card" style={{ "--mood": mood.color }} data-busy={busy || undefined}>
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-[0.98rem] leading-[1.3]">{note.title}</h2>
        <span className="desk-mood">
          <span className="mood-dot" />
          {mood.label}
        </span>
      </div>

      <p className={`desk-card-body ${open ? "is-open" : ""}`}>{note.text}</p>

      {long && (
        <button
          type="button"
          className="mt-2 self-start text-[0.7rem] tracking-[0.06em] text-[var(--rose)] underline underline-offset-4"
          onClick={() => setOpen((was) => !was)}
        >
          {open ? "Show less" : "Read all of it"}
        </button>
      )}

      <p className="mt-auto pt-4 text-[0.625rem] uppercase tracking-[0.14em] text-[var(--ink-3)]">
        {formatWhen(note.createdAt)}
        <span className="mx-1.5" aria-hidden="true">
          ·
        </span>
        <span className="hand text-[0.9rem] normal-case tracking-normal">{note.author}</span>
      </p>

      <div className="desk-card-actions">
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
          <>
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
              <Cross size={12} />
            </button>
          </>
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
    </li>
  );
}
