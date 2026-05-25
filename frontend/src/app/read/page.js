import SiteHeader from "../components/site-header";
import ConfessionCard from "../components/confession-card";
import { sampleConfessions } from "../data/sample-confessions";

export default function ReadPage() {
  return (
    <main className="min-h-screen bg-[#f9eef1] pb-16">
      <SiteHeader currentPage="Read" />
      <section className="mx-auto max-w-6xl px-6 py-12 sm:px-8">
        <div className="flex flex-col gap-4 text-center">
          <p className="uppercase tracking-[0.32em] text-sm text-[#A57A8A]">
            Read the wall
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-[#5D4C54] sm:text-5xl">
            Honest words saved for later.
          </h1>
          <p className="mx-auto max-w-2xl text-base leading-8 text-[#6B6368] sm:text-lg">
            Browse the pieces of writing that feel too true to stay hidden. These confessions are the kind of lines that deserve a quiet, gentle space.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {sampleConfessions.map((item) => (
            <ConfessionCard
              key={item.title}
              title={item.title}
              snippet={item.snippet}
              date={item.date}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
