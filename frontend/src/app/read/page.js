"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import SiteHeader from "@/components/site-header";
import ConfessionCard from "@/components/confession-card";
import ShimmerCard from "@/components/shimmer-card";

const API_BASE = "http://localhost:3333";
const PAGE_SIZE = 12;

export default function ReadPage() {
  const [confessions, setConfessions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeConfession, setActiveConfession] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const sentinelRef = useRef(null);

  // Debounce the search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset pagination when search changes
  useEffect(() => {
    setPage(1);
    setConfessions([]);
    setHasMore(true);
    setLoading(true);
  }, [debouncedSearch]);

  // Fetch confessions from API
  const fetchConfessions = useCallback(async (pageNum, search) => {
    try {
      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: PAGE_SIZE.toString(),
      });
      if (search.trim()) {
        params.set("search", search.trim());
      }

      const res = await fetch(`${API_BASE}/confessions?${params}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const json = await res.json();
      return json;
    } catch (err) {
      console.error("API fetch error:", err);
      return null;
    }
  }, []);

  // Initial load and search-triggered reload
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const result = await fetchConfessions(1, debouncedSearch);
      if (cancelled) return;

      if (result) {
        setConfessions(result.data);
        setHasMore(result.hasMore);
        setPage(1);
      } else {
        setConfessions([]);
        setHasMore(false);
      }
      setLoading(false);
    };

    load();
    return () => { cancelled = true; };
  }, [debouncedSearch, fetchConfessions]);

  // Load more (next page)
  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);

    const nextPage = page + 1;
    const result = await fetchConfessions(nextPage, debouncedSearch);

    if (result) {
      setConfessions((prev) => [...prev, ...result.data]);
      setHasMore(result.hasMore);
      setPage(nextPage);
    }
    setLoadingMore(false);
  }, [loadingMore, hasMore, page, debouncedSearch, fetchConfessions]);

  // IntersectionObserver for infinite scroll
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && !loading) {
          loadMore();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loadingMore, loading, loadMore]);

  // Click on a card → fetch full confession
  const handleCardClick = async (item) => {
    setActiveConfession({ ...item, fullText: null });
    setLoadingDetail(true);

    try {
      const res = await fetch(`${API_BASE}/confessions/${item.id}`);
      if (!res.ok) throw new Error("Failed to fetch detail");
      const full = await res.json();
      setActiveConfession({
        id: full.id,
        title: full.title,
        text: full.text,
        author: full.author,
        date: full.createdAt,
        fullText: full.text,
      });
    } catch {
      // Fallback to the snippet we already have
      setActiveConfession((prev) => prev ? { ...prev, fullText: prev.text || prev.snippet } : null);
    }
    setLoadingDetail(false);
  };

  // Format date for display
  const formatDate = (dateStr) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <main className="min-h-screen bg-[#f9eef1] pb-16 relative overflow-hidden">
      {/* Background blurs */}
      <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-[#f4ccd7]/30 blur-3xl" />
      <div className="absolute -right-40 bottom-10 h-96 w-96 rounded-full bg-[#faedf2]/40 blur-3xl" />

      {/* Decorative ambient flower images */}
      <div className="absolute right-6 top-32 w-20 opacity-20 select-none pointer-events-none md:w-32 animate-float">
        <img src="/flower 2.png" alt="" className="w-full" />
      </div>
      <div className="absolute left-6 bottom-40 w-24 opacity-20 select-none pointer-events-none md:w-36 animate-float" style={{ animationDelay: "-3.5s" }}>
        <img src="/flower 3.png" alt="" className="w-full" />
      </div>

      <SiteHeader currentPage="Read" />

      <section className="mx-auto max-w-7xl px-6 py-12 sm:px-8 relative animate-fade-in-up">
        <div className="flex flex-col gap-4 text-center">
          <p className="uppercase tracking-[0.32em] text-xs text-[#A57A8A] font-semibold">
            Read the wall
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-[#5D4C54] sm:text-5xl font-serif">
            Honest words <span className="italic text-[#8A5E6C]">saved</span> for later.
          </h1>
          <p className="mx-auto max-w-2xl text-sm leading-7 text-[#6B6368] sm:text-base">
            Browse the pieces of writing that feel too true to stay hidden. These confessions are the kind of lines that deserve a quiet, gentle space.
          </p>
        </div>

        {/* Controls Layout */}
        <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[#f4dee2] pb-6">
          <h2 className="text-xl font-semibold text-[#5D4C54] font-serif">All Confessions</h2>

          {/* Search Box */}
          <div className="relative min-w-[260px] sm:max-w-xs w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search confessions..."
              className="w-full rounded-full border border-[#E4D3D8] bg-white/70 backdrop-blur-md px-5 py-2.5 pl-10 text-xs text-[#634e5a] outline-none transition focus:border-[#dca7b5] focus:bg-white focus:ring-2 focus:ring-[#f6dde1]"
            />
            <span className="absolute left-4 top-3.5 text-xs text-[#A57A8A]">
              🔍
            </span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-2 text-xs font-semibold text-[#A57A8A] hover:text-[#8A5E6C]"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Grid Wall */}
        {loading ? (
          /* Initial loading: show 12 shimmer cards */
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 items-start">
            {Array.from({ length: 6 }).map((_, i) => (
              <ShimmerCard key={`shimmer-init-${i}`} />
            ))}
          </div>
        ) : confessions.length > 0 ? (
          <>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 items-start">
              {confessions.map((item) => (
                <ConfessionCard
                  key={item.id}
                  title={item.title}
                  snippet={item.text || item.snippet}
                  author={item.author}
                  date={formatDate(item.createdAt || item.date)}
                  isSvg={false}
                  onClick={() => handleCardClick(item)}
                />
              ))}

              {/* Shimmer cards for loading more */}
              {loadingMore &&
                Array.from({ length: 3 }).map((_, i) => (
                  <ShimmerCard key={`shimmer-more-${i}`} />
                ))}
            </div>

            {/* Sentinel for IntersectionObserver */}
            {hasMore && <div ref={sentinelRef} className="h-4 w-full" />}

            {!hasMore && confessions.length > PAGE_SIZE && (
              <p className="text-center text-xs text-[#AB8B96] mt-10 italic">
                You&apos;ve reached the end of the wall ✦
              </p>
            )}
          </>
        ) : (
          <div className="mt-16 text-center space-y-4 py-12 rounded-[32px] border border-[#f5dde1]/60 bg-white/40 backdrop-blur-xs">
            <div className="text-3xl">☕</div>
            <h3 className="font-semibold text-[#5D4C54] text-lg">No confessions found</h3>
            <p className="text-xs text-[#6B6368] max-w-sm mx-auto leading-5">
              We couldn&apos;t find any confessions matching your current search criteria. Try write one yourself to pin it on the wall!
            </p>
            <a
              href="/write"
              className="inline-flex items-center justify-center rounded-full bg-[#f6dde1] px-6 py-2.5 text-xs font-semibold text-[#8a5e6c] hover:bg-[#e8c8d4] transition mt-2"
            >
              Write a confession
            </a>
          </div>
        )}
      </section>

      {/* Lightbox / Focus Reader Modal */}
      {activeConfession && (
        <div
          onClick={() => setActiveConfession(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-md p-4 animate-fade-in-up"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl overflow-hidden rounded-[36px] border border-white bg-white/95 p-6 shadow-2xl md:p-8"
          >
            <button
              onClick={() => setActiveConfession(null)}
              className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-[#fbe9ee] text-[#8a5e6c] font-semibold transition hover:bg-[#f6dde1]"
            >
              ✕
            </button>

            <div className="flex flex-col">
              <h3 className="text-2xl font-semibold text-[#5D4C54] mb-1 pr-12 font-serif">{activeConfession.title}</h3>
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-[#AB8B96] mb-6">
                <span>{formatDate(activeConfession.date || activeConfession.createdAt)}</span>
                {activeConfession.author && (
                  <>
                    <span className="text-[#eecad2]">•</span>
                    <span className="italic text-[#A57A8A]">by {activeConfession.author}</span>
                  </>
                )}
              </div>

              <div className="flex w-full items-center justify-center rounded-[24px] bg-[#fffafb] border border-[#F6DDE1] shadow-inner max-h-[60vh] overflow-y-auto">
                {loadingDetail ? (
                  <div className="w-full p-6 md:p-8 space-y-3">
                    <div className="h-4 w-full rounded-full shimmer-bg" />
                    <div className="h-4 w-11/12 rounded-full shimmer-bg" />
                    <div className="h-4 w-4/5 rounded-full shimmer-bg" />
                    <div className="h-4 w-9/12 rounded-full shimmer-bg" />
                    <div className="h-4 w-3/5 rounded-full shimmer-bg" />
                  </div>
                ) : (
                  <div className="writing-paper w-full p-6 text-[#5D4C54] text-base font-serif leading-relaxed md:p-8 whitespace-pre-wrap">
                    {activeConfession.fullText || activeConfession.text || activeConfession.snippet}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
