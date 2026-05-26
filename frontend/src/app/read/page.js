"use client";

import { useState, useEffect } from "react";
import SiteHeader from "@/components/site-header";
import ConfessionCard from "@/components/confession-card";
import { sampleConfessions } from "@/data/sample-confessions";

const svgConfessions = [
  {
    title: "You Never Knew",
    snippet: "Deep down, she will be the last. This time was different. She wasn't a passing image or a distant idea. She existed in my life longer than anyone else I've loved. I saw her often. She stayed in my world. And yes I even talked to her. More than once. Which, for me, felt like a miracle. So what went wrong?",
    author: "Anonymous",
    date: "May 2026",
    isSvg: true,
    src: "/you never knew.svg",
    id: "svg_1",
  },
  {
    title: "Loved Her Silently",
    snippet: "I loved her silently, and now it hurts to watch her go. She was the one who got away, the story I kept locked inside my chest. Love has nothing to do with facial features or height—love is about the soul, and her soul pulled me in with a violent, beautiful force that I was too afraid to act upon.",
    author: "Anonymous",
    date: "May 2026",
    isSvg: true,
    src: "/Loved her silently and now it hurts.svg",
    id: "svg_2",
  },
  {
    title: "I Miss Who We Used To Be",
    snippet: "I miss who we used to be. The effortless laughter, the tiny inside jokes, the endless late-night chats that felt like they would never end. We became strangers so slowly that I didn't even notice the cold silence settling in, until one day I realized we had nothing left to say.",
    author: "Anonymous",
    date: "April 2026",
    isSvg: true,
    src: "/i miss who we used to be.svg",
    id: "svg_3",
  },
  {
    title: "I Regret Not Saying It",
    snippet: "I regret not choosing honesty over safety when you were standing right in front of me. The truth was on the very tip of my tongue, but my fear made me swallow it back down. Now I'm left with a hollow chest and the infinite, exhausting weight of 'what if'.",
    author: "Anonymous",
    date: "March 2026",
    isSvg: true,
    src: "/i regret not saying it.svg",
    id: "svg_4",
  },
  {
    title: "I Watch You Love Someone Else",
    snippet: "I watch you love someone else. It is simultaneously the most beautiful and painful sight I have ever witnessed. I wish with everything in me that I was the one making you smile like that, but I will settle for observing your happiness from the quiet edges of your life.",
    author: "Anonymous",
    date: "February 2026",
    isSvg: true,
    src: "/i watch you love somone else.svg",
    id: "svg_5",
  },
  {
    title: "I Wish You Fought For Me",
    snippet: "I wish you fought for me. Even just a little bit. Even a small, simple sign that you cared enough not to let me slip away so easily into the dark. But your absolute silence spoke louder than any words ever could, showing me exactly where I stood in your heart.",
    author: "Anonymous",
    date: "January 2026",
    isSvg: true,
    src: "/i wish you fought for me.svg",
    id: "svg_6",
  },
  {
    title: "I Lied To Protect Your Feelings",
    snippet: "I lied to protect your feelings. But in the end, it was my own heart that lay completely shattered on the floor. A clean, silent sacrifice that you will never know about, and one that I would probably make all over again if it meant keeping your world intact.",
    author: "Anonymous",
    date: "December 2025",
    isSvg: true,
    src: "/i lied to protect your feelings.svg",
    id: "svg_7",
  },
  {
    title: "I'm Scared I Always Feel Alone",
    snippet: "I'm scared because I always feel alone. Even in a crowded room, surrounded by warmth and laughter. It feels like watching life through a thick pane of glass—never fully present, never fully alive, just a silent observer waiting to finally wake up.",
    author: "Anonymous",
    date: "November 2025",
    isSvg: true,
    src: "/im scared i always feel alone.svg",
    id: "svg_8",
  },
];

export default function ReadPage() {
  const [confessions, setConfessions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeConfession, setActiveConfession] = useState(null);

  useEffect(() => {
    // Merge predefined sample confessions, SVGs, and localStorage user confessions
    const localData = localStorage.getItem("tins_local_confessions");
    const userConfessions = localData ? JSON.parse(localData) : [];

    const formattedSampleText = sampleConfessions.map((c, i) => ({
      ...c,
      author: "Anonymous",
      isSvg: false,
      id: `sample_${i}`,
    }));

    // Order: User Confessions (newest first) -> SVG Calligraphy -> Predefined Samples
    setConfessions([...userConfessions, ...svgConfessions, ...formattedSampleText]);
  }, []);

  const filteredConfessions = confessions.filter((item) => {
    return (
      searchQuery.trim() === "" ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.snippet.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.author && item.author.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

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
        {filteredConfessions.length > 0 ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 items-start">
            {filteredConfessions.map((item) => (
              <ConfessionCard
                key={item.id}
                title={item.title}
                snippet={item.snippet}
                author={item.author}
                date={item.date}
                isSvg={item.isSvg}
                src={item.src}
                onClick={() => setActiveConfession(item)}
              />
            ))}
          </div>
        ) : (
          <div className="mt-16 text-center space-y-4 py-12 rounded-[32px] border border-[#f5dde1]/60 bg-white/40 backdrop-blur-xs">
            <div className="text-3xl">☕</div>
            <h3 className="font-semibold text-[#5D4C54] text-lg">No confessions found</h3>
            <p className="text-xs text-[#6B6368] max-w-sm mx-auto leading-5">
              We couldn't find any confessions matching your current search criteria. Try write one yourself to pin it on the wall!
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
                <span>{activeConfession.date}</span>
                {activeConfession.author && (
                  <>
                    <span className="text-[#eecad2]">•</span>
                    <span className="italic text-[#A57A8A]">by {activeConfession.author}</span>
                  </>
                )}
              </div>

              <div className="flex w-full items-center justify-center rounded-[24px] bg-[#fffafb] border border-[#F6DDE1] shadow-inner max-h-[60vh] overflow-y-auto">
                {activeConfession.isSvg ? (
                  <div className="p-4 flex justify-center">
                    <img
                      src={activeConfession.src}
                      alt={activeConfession.title}
                      className="max-h-[50vh] max-w-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="writing-paper w-full p-6 text-[#5D4C54] text-base font-serif leading-relaxed md:p-8 whitespace-pre-wrap">
                    {activeConfession.snippet}
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
