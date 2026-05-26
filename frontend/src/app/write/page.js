"use client";

import { useState } from "react";
import SiteHeader from "@/components/site-header";

export default function WritePage() {
  const [text, setText] = useState("");
  const [author, setAuthor] = useState("");
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("");
  const [statusType, setStatusType] = useState("info"); // 'info', 'success', 'error'

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!text.trim()) {
      setStatus("Please write something before pinning.");
      setStatusType("error");
      return;
    }

    const trimmedAuthor = author.trim() || "Anonymous";
    const trimmedTitle = title.trim() || text.trim().substring(0, 25) + (text.length > 25 ? "..." : "");
    const dateStr = new Date().toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });

    const newConfession = {
      title: trimmedTitle,
      snippet: text.trim(),
      author: trimmedAuthor,
      date: dateStr,
      id: "local_" + Date.now(),
    };

    setStatus("Sending your note to the wall...");
    setStatusType("info");

    try {
      // Attempt backend post
      const response = await fetch("http://localhost:3333/confessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: trimmedTitle,
          text: text.trim(),
          author: trimmedAuthor,
        }),
      });

      if (response.ok) {
        setText("");
        setAuthor("");
        setTitle("");
        setStatus("Your note was pinned to the online wall successfully!");
        setStatusType("success");
      } else {
        throw new Error("Backend rejected request");
      }
    } catch (error) {
      // LocalStorage fallback
      console.warn("Backend unavailable. Storing confession locally.");
      
      try {
        const localData = localStorage.getItem("tins_local_confessions");
        const existingConfessions = localData ? JSON.parse(localData) : [];
        existingConfessions.unshift(newConfession);
        localStorage.setItem("tins_local_confessions", JSON.stringify(existingConfessions));
        
        setText("");
        setAuthor("");
        setTitle("");
        setStatus("Could not connect to backend server, but your note has been saved safely in your local journal. Visit the 'Read' page to see it pinned!");
        setStatusType("success");
      } catch (storageError) {
        setStatus("Could not pin your note. Please try again later.");
        setStatusType("error");
      }
    }
  };

  return (
    <main className="min-h-screen bg-[#f9eef1] pb-16 relative overflow-hidden">
      {/* Background radial effects */}
      <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-[#f4ccd7]/35 blur-3xl" />
      <div className="absolute -right-40 bottom-10 h-96 w-96 rounded-full bg-[#faedf2]/45 blur-3xl" />

      {/* Decorative ambient flower images */}
      <div className="absolute right-6 top-36 w-16 opacity-30 select-none pointer-events-none md:right-12 md:w-28 animate-float">
        <img src="/flower5.png" alt="" className="w-full" />
      </div>
      <div className="absolute left-6 bottom-16 w-20 opacity-30 select-none pointer-events-none md:left-12 md:w-32 animate-float" style={{ animationDelay: "-4.5s" }}>
        <img src="/flower6.png" alt="" className="w-full" />
      </div>

      <SiteHeader currentPage="Write" />

      <section className="mx-auto max-w-5xl px-6 py-12 sm:px-8 lg:py-16 relative">
        <div className="rounded-[40px] border border-[#F6DDE1] bg-white/75 backdrop-blur-md p-8 shadow-[0_30px_90px_rgba(214,150,163,0.16)] sm:p-10 md:p-12">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.32em] text-[#A57A8A]">
                Write your truth
              </p>
              <h1 className="text-3xl font-semibold tracking-tight text-[#5D4C54] sm:text-4xl">
                Pin the confession <br className="hidden sm:inline" />
                you never said.
              </h1>
              <p className="text-sm leading-6 text-[#6B6368] sm:text-base">
                Use this page to capture the message that’s been waiting in the wings. Your words will be saved safely on the reading wall.
              </p>
            </div>

            <div className="rounded-[28px] bg-[#FDF3F6]/90 border border-[#fcecee] p-6 shadow-[0_18px_50px_rgba(213,138,170,0.06)] flex flex-col justify-center">
              <h3 className="font-semibold text-[#7F5D69] text-base mb-3 flex items-center gap-2">
                <span>✦</span> Gentle Writing Guidelines
              </h3>
              <ul className="space-y-2 text-xs leading-5 text-[#7B6670]">
                <li>• Write honestly, from a place of patience and breathing.</li>
                <li>• Give it an optional title to encapsulate your thoughts.</li>
                <li>• Use an author name or leave it blank to remain anonymous.</li>
                <li>• If offline, your letters are securely stored on your device.</li>
              </ul>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-10 space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#5D4C54]">
                  Title (optional)
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="e.g. A truth I never said"
                  className="w-full rounded-2xl border border-[#E4D3D8] bg-[#fff7f8] px-5 py-3 text-sm text-[#634e5a] outline-none transition duration-300 focus:border-[#dca7b5] focus:ring-2 focus:ring-[#f6dde1]"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#5D4C54]">
                  Your signature (optional)
                </label>
                <input
                  type="text"
                  value={author}
                  onChange={(event) => setAuthor(event.target.value)}
                  placeholder="Anonymous"
                  className="w-full rounded-2xl border border-[#E4D3D8] bg-[#fff7f8] px-5 py-3 text-sm text-[#634e5a] outline-none transition duration-300 focus:border-[#dca7b5] focus:ring-2 focus:ring-[#f6dde1]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#5D4C54]">
                Your confession
              </label>
              <textarea
                value={text}
                onChange={(event) => setText(event.target.value)}
                placeholder="Write anything you ever wanted to say..."
                rows={8}
                className="writing-paper w-full rounded-[28px] border border-[#E4D3D8] px-6 py-5 text-base text-[#634e5a] outline-none transition duration-300 focus:border-[#dca7b5] focus:ring-2 focus:ring-[#f6dde1]"
              />
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pt-2">
              <p className="text-xs text-[#7B6670] italic">
                All posts are confidential and held gently.
              </p>
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-full bg-[#8A5E6C] px-8 py-3.5 text-sm font-semibold text-white shadow-md shadow-pink-200/50 transition duration-300 hover:bg-[#724c58] hover:translate-y-[-2px] hover:shadow-lg cursor-pointer"
              >
                Pin it to the wall
              </button>
            </div>

            {status && (
              <div
                className={`mt-4 rounded-2xl border px-6 py-4 text-sm transition-all duration-300 ${
                  statusType === "success"
                    ? "border-[#c4e3cb] bg-[#f0faf2] text-[#2e5d3c]"
                    : statusType === "error"
                    ? "border-[#f7cdd5] bg-[#fff0f3] text-[#7d3c48]"
                    : "border-[#e7d4db] bg-[#fff7f9] text-[#755a6b]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">
                    {statusType === "success" ? "✓" : statusType === "error" ? "⚠" : "ℹ"}
                  </span>
                  <p>{status}</p>
                </div>
              </div>
            )}
          </form>
        </div>
      </section>
    </main>
  );
}
