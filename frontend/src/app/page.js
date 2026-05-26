"use client";

import { useState } from "react";
import FeatureCard from "@/components/feature-card";
import SiteHeader from "@/components/site-header";

const features = [
  {
    title: "A quieter place to say it",
    description:
      "Create, read, and keep the words you never said in a calm, gentle interface. This is a space built for tenderness, not noise.",
  },
  {
    title: "A canvas for every feeling",
    description:
      "Whether you want to pin a private thought or browse the wall of honest lines, each page is designed to feel soft, focused, and easy to use.",
  },
];

const svgConfessions = [
  {
    src: "/you never knew.svg",
    title: "You Never Knew",
    desc: "A confession of derealization and silent adoration.",
  },
  {
    src: "/i miss who we used to be.svg",
    title: "I Miss Who We Used To Be",
    desc: "A soft lament on the version of us lost to time.",
  },
  {
    src: "/i regret not saying it.svg",
    title: "I Regret Not Saying It",
    desc: "Choosing safety over honesty in the final hours.",
  },
  {
    src: "/i watch you love somone else.svg",
    title: "I Watch You Love Someone Else",
    desc: "Finding comfort in observation, and grief in silence.",
  },
  {
    src: "/Loved her silently and now it hurts.svg",
    title: "Loved Her Silently",
    desc: "A pure love that was never spoken.",
  },
  {
    src: "/i lied to protect your feelings.svg",
    title: "I Lied To Protect Your Feelings",
    desc: "A painful deception built on fear.",
  },
];

export default function HomePage() {
  const [activeSvg, setActiveSvg] = useState(null);

  return (
    <main className="relative min-h-screen bg-[#f9eef1] overflow-hidden">
      {/* Ambient background blur elements */}
      <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-[#f4ccd7]/30 blur-3xl animate-pulse-slow" />
      <div className="absolute -right-40 top-80 h-96 w-96 rounded-full bg-[#fbe7ec]/50 blur-3xl animate-pulse-slow" />

      {/* Delicate Flower Elements */}
      <div className="absolute left-6 top-32 w-16 opacity-30 select-none pointer-events-none md:left-12 md:top-40 md:w-28 animate-float">
        <img src="/flower 1.png" alt="" className="w-full" />
      </div>
      <div className="absolute right-6 bottom-40 w-20 opacity-30 select-none pointer-events-none md:right-16 md:bottom-28 md:w-36 animate-float" style={{ animationDelay: "-3s" }}>
        <img src="/flower 2.png" alt="" className="w-full" />
      </div>

      <SiteHeader currentPage="Home" />

      {/* Prominent centered main hero container */}
      <section className="relative mx-auto max-w-4xl px-6 py-20 sm:px-8 lg:py-28 animate-fade-in-up text-center flex flex-col items-center">
        <div className="space-y-8 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#f5d5dd] bg-[#faebed]/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-[#A57A8A]">
            <span>✦</span> Welcome to the wall
          </div>
          <h1 className="text-4xl font-semibold tracking-tight text-[#5D4C54] sm:text-5xl lg:text-6xl leading-[1.2] max-w-3xl">
            The place for the <span className="text-[#8A5E6C] italic font-serif font-light">words</span> you never said.
          </h1>
          <p className="max-w-2xl text-base leading-8 text-[#6B6368] sm:text-lg">
            This site is designed for feeling, honesty, and quiet courage. Write something that has been stuck in your chest, then come back later and read it from a softer place.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-center pt-2">
            <a
              href="/write"
              className="inline-flex items-center justify-center rounded-full bg-[#8A5E6C] px-8 py-3.5 text-sm font-semibold text-white shadow-md shadow-pink-200/50 transition duration-300 hover:bg-[#724c58] hover:translate-y-[-2px] hover:shadow-lg cursor-pointer"
            >
              Write something
            </a>
            <a
              href="/read"
              className="inline-flex items-center justify-center rounded-full border border-[#eecad2] bg-white/70 backdrop-blur-md px-8 py-3.5 text-sm font-semibold text-[#6B6368] transition duration-300 hover:bg-white hover:translate-y-[-2px] hover:border-[#a57a8a] cursor-pointer"
            >
              Read the wall
            </a>
          </div>
        </div>
      </section>

      {/* Featured Handwritten Confessions Gallery */}
      <section className="mx-auto max-w-7xl px-6 py-12 sm:px-8 border-t border-[#f4dee2]/60">
        <div className="mb-10 space-y-3 text-center sm:text-left">
          <p className="text-xs uppercase tracking-[0.32em] text-[#A57A8A]">Selected Pieces</p>
          <h2 className="text-3xl font-semibold text-[#5D4C54]">Featured Letters</h2>
          <p className="text-[#6B6368] max-w-xl">
            Some confessions are saved as beautifully handwritten designs. Hover and click to read their full letters.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {svgConfessions.map((svg, idx) => (
            <div
              key={idx}
              onClick={() => setActiveSvg(svg)}
              className="group relative cursor-pointer overflow-hidden rounded-[28px] border border-[#F6DDE1] bg-white/90 p-5 shadow-[0_18px_50px_rgba(213,138,170,0.08)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_24px_60px_rgba(213,138,170,0.15)] hover:border-[#dca7b5]"
            >
              <div className="relative flex aspect-[4/3] items-center justify-center rounded-[20px] bg-[#fbf5f7] overflow-hidden group-hover:bg-[#faf1f4] transition duration-300">
                <img
                  src={svg.src}
                  alt={svg.title}
                  className="max-h-[85%] max-w-[85%] object-contain opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-pink-500/10 to-transparent opacity-0 group-hover:opacity-100 transition duration-350" />
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-[#5D4C54] group-hover:text-[#8A5E6C] transition duration-300">{svg.title}</h4>
                  <p className="text-xs text-[#9B8C93] mt-1 line-clamp-1">{svg.desc}</p>
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f6dde1] text-[#8a5e6c] opacity-0 group-hover:opacity-100 transition duration-300 transform translate-x-2 group-hover:translate-x-0">
                  ✦
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Cards Info */}
      <section className="mx-auto max-w-7xl px-6 py-12 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {features.map((feature) => (
            <FeatureCard key={feature.title} title={feature.title}>
              <p className="text-[#6B6368]">{feature.description}</p>
            </FeatureCard>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-xs tracking-wider text-[#A57A8A]/80 border-t border-[#f4dee2]/60 bg-white/30 backdrop-blur-sm">
        <p>© 2026 Things I Never Said. Built for feeling and gentle reflection.</p>
      </footer>

      {/* Lightbox Modal for SVGs */}
      {activeSvg && (
        <div
          onClick={() => setActiveSvg(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md p-4 animate-fade-in-up"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl overflow-hidden rounded-[36px] border border-white bg-white/95 p-6 shadow-2xl md:p-8"
          >
            <button
              onClick={() => setActiveSvg(null)}
              className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-[#fbe9ee] text-[#8a5e6c] font-semibold transition hover:bg-[#f6dde1]"
            >
              ✕
            </button>
            <div className="flex flex-col items-center">
              <h3 className="text-2xl font-semibold text-[#5D4C54] mb-1">{activeSvg.title}</h3>
              <p className="text-sm text-[#A57A8A] tracking-[0.16em] uppercase mb-6">{activeSvg.desc}</p>
              
              <div className="flex w-full items-center justify-center rounded-[24px] bg-[#fdfafb] p-4 border border-[#F6DDE1] shadow-inner max-h-[70vh] overflow-y-auto">
                <img
                  src={activeSvg.src}
                  alt={activeSvg.title}
                  className="max-h-[60vh] max-w-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
