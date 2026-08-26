"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Arrow, Cross, Glass } from "@/components/marks";
import { refreshWall, signOut } from "@/lib/admin-actions";
import DeskList, { DeskSkeletons, invalidateDeskCache } from "./desk-list";

const POLL_MS = 6000;
const SEARCH_DEBOUNCE_MS = 350;

export default function Desk({ first, pulse, view, search, error }) {
  const router = useRouter();
  const scrollRef = useRef(null);
  const [term, setTerm] = useState(search);
  const [live, setLive] = useState(true);
  const [counts, setCounts] = useState({ pending: pulse.pending, approved: pulse.approved });
  const [signal, setSignal] = useState(0);
  const [navigating, startNavigation] = useTransition();
  const [, startAction] = useTransition();

  /* ---------------------------------------------------------------- search */

  const applySearch = useCallback(
    (value) => {
      const params = new URLSearchParams();
      if (view === "approved") params.set("view", "wall");
      if (value.trim()) params.set("q", value.trim());
      const query = params.toString();
      startNavigation(() => {
        router.replace(query ? `/admin?${query}` : "/admin", { scroll: false });
      });
    },
    [router, view]
  );

  useEffect(() => {
    if (term === search) return undefined;
    const timer = setTimeout(() => applySearch(term), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [term, search, applySearch]);

  /* ------------------------------------------------------------------ live
     A six-second heartbeat against a counts-only endpoint. When the numbers
     move, the cached pages are dropped and the grid is told to pull fresh
     data — no full page reload, so nobody loses their place.
     ---------------------------------------------------------------------- */

  const signature = useRef(`${pulse.pending}:${pulse.approved}:${pulse.latest}`);

  const beatOnce = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/pulse", { cache: "no-store" });
      if (res.status === 401) {
        router.refresh(); // the session expired — fall back to the login form
        return;
      }
      if (!res.ok) throw new Error(String(res.status));
      const next = await res.json();
      const stamp = `${next.pending}:${next.approved}:${next.latest}`;
      setLive(true);
      setCounts({ pending: next.pending, approved: next.approved });
      if (signature.current !== stamp) {
        signature.current = stamp;
        invalidateDeskCache();
        setSignal((n) => n + 1);
      }
    } catch {
      setLive(false);
    }
  }, [router]);

  useEffect(() => {
    let stopped = false;
    let timer;
    const loop = async () => {
      if (document.visibilityState === "visible") await beatOnce();
      if (!stopped) timer = setTimeout(loop, POLL_MS);
    };
    timer = setTimeout(loop, POLL_MS);
    const onVisible = () => {
      if (document.visibilityState === "visible") beatOnce();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      stopped = true;
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [beatOnce]);

  /* ---------------------------------------------------------------- render */

  const searching = Boolean(search.trim());

  return (
    <main className="scroll-surface" ref={scrollRef}>
      <div className="mx-auto w-full max-w-[76rem] px-5 pb-24 pt-16 sm:px-8 sm:pt-20">
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
                startAction(async () => {
                  await refreshWall();
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
          <DeskTab href={tabHref("pending", search)} active={view === "pending"} count={counts.pending}>
            Waiting
          </DeskTab>
          <DeskTab href={tabHref("approved", search)} active={view === "approved"} count={counts.approved}>
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

        {error ? (
          <p className="notice mt-8" role="alert">
            {error}
          </p>
        ) : navigating ? (
          <ul className="desk-grid mt-8">
            <DeskSkeletons count={9} />
          </ul>
        ) : (
          <div className="mt-8">
            {searching && first.total > 0 && (
              <p className="mb-6 text-[0.75rem] uppercase tracking-[0.14em] text-[var(--ink-3)]">
                {first.total} matching “{search.trim()}”
              </p>
            )}
            <DeskList
              key={`${view}|${search}`}
              first={first}
              view={view}
              search={search}
              scrollRef={scrollRef}
              signal={signal}
              onCountsChanged={beatOnce}
            />
          </div>
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
      {children}{" "}
      <span className="ml-1 tabular-nums text-[var(--ink-4)]">{count}</span>
    </Link>
  );
}
