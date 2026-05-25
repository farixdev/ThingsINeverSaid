"use client";

import { useState } from "react";
import SiteHeader from "../components/site-header";

export default function WritePage() {
  const [text, setText] = useState("");
  const [author, setAuthor] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!text.trim()) {
      setStatus("Please write something before sending.");
      return;
    }

    setStatus("Sending your note...");

    try {
      await fetch("http://localhost:3333/confessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, author: author.trim() || "Anonymous" }),
      });

      setText("");
      setAuthor("");
      setStatus("Your note was pinned. Refresh the read page to see it next.");
    } catch (error) {
      setStatus(
        "Could not send your note. Make sure the backend is running at http://localhost:3333."
      );
    }
  };

  return (
    <main className="min-h-screen bg-[#f9eef1] pb-16">
      <SiteHeader currentPage="Write" />

      <section className="mx-auto max-w-5xl px-6 py-12 sm:px-8 lg:py-16">
        <div className="rounded-[40px] border border-[#F6DDE1] bg-white/80 p-8 shadow-[0_30px_90px_rgba(214,150,163,0.16)] sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_0.7fr]">
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.32em] text-[#A57A8A]">
                Write your truth
              </p>
              <h1 className="text-3xl font-semibold tracking-tight text-[#5D4C54] sm:text-4xl">
                Pin the confession you never said.
              </h1>
              <p className="text-base leading-7 text-[#6B6368] sm:text-lg">
                Use this page to capture the message that’s been waiting in the wings. When the backend is running, the note will be stored in the shared confessions collection.
              </p>
            </div>

            <div className="rounded-[28px] bg-[#FDF3F6] p-6 shadow-[0_18px_50px_rgba(213,138,170,0.12)]">
              <p className="font-semibold text-[#7F5D69]">Quick tips</p>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-[#7B6670]">
                <li>Write honestly, even if it feels small.</li>
                <li>Use the author field when you want to sign your note.</li>
                <li>If the backend is not running, the note will still appear in the UI placeholder.</li>
              </ul>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-10 space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#5D4C54]">
                Your name (optional)
              </label>
              <input
                value={author}
                onChange={(event) => setAuthor(event.target.value)}
                placeholder="Anonymous"
                className="w-full rounded-3xl border border-[#E4D3D8] bg-[#fff7f8] px-5 py-3 text-sm text-[#634e5a] outline-none transition focus:border-[#d4b1bf] focus:ring-2 focus:ring-[#F6DDE1]"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#5D4C54]">
                Your confession
              </label>
              <textarea
                value={text}
                onChange={(event) => setText(event.target.value)}
                placeholder="Write anything you ever wanted to say..."
                rows={10}
                className="w-full rounded-[28px] border border-[#E4D3D8] bg-[#fff7f8] px-6 py-5 text-base leading-7 text-[#634e5a] outline-none transition focus:border-[#d4b1bf] focus:ring-2 focus:ring-[#F6DDE1]"
              />
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm leading-6 text-[#7B6670]">
                Backend endpoint: http://localhost:3333/confessions
              </p>
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-full bg-[#F6DDE1] px-7 py-3 text-sm font-semibold text-[#8A5E6C] transition hover:bg-[#e8c8d4]"
              >
                Pin it to the wall
              </button>
            </div>

            {status ? (
              <p className="rounded-3xl border border-[#E7D4DB] bg-[#fff1f4] px-6 py-4 text-sm text-[#755a6b]">
                {status}
              </p>
            ) : null}
          </form>
        </div>
      </section>
    </main>
  );
}
