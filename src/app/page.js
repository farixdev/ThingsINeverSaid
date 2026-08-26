import Link from "next/link";
import AmbientWall from "@/components/ambient-wall";
import { Arrow, Sprig } from "@/components/marks";
import { getStats, getWall } from "@/lib/confessions";
import { numbers } from "@/lib/format";

export const revalidate = 300;

export default async function HomePage() {
  let notes = [];
  let stats = { total: 0, latest: null };
  try {
    [notes, stats] = await Promise.all([getWall(), getStats()]);
  } catch (error) {
    console.error("Home could not reach the wall:", error);
  }

  const newest = notes[0];

  return (
    <main className="fit-screen relative">
      <AmbientWall notes={notes} count={11} />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <Sprig
          size={40}
          className="mb-7 text-[var(--rose)] opacity-45 rise"
          style={{ animationDelay: "0.1s" }}
        />

        <p className="eyebrow rise" style={{ animationDelay: "0.18s" }}>
          anonymous · unsigned · unjudged
        </p>

        <h1
          className="display mt-6 text-[clamp(2.6rem,1.6rem+5.4vw,5.6rem)] rise"
          style={{ animationDelay: "0.26s" }}
        >
          Say it here.
          <br />
          <em className="italic text-[var(--rose)]">Not out loud.</em>
        </h1>

        <p
          className="mt-7 max-w-[34rem] text-[0.975rem] leading-[1.75] text-[var(--ink-2)] rise sm:text-[1.05rem]"
          style={{ animationDelay: "0.34s" }}
        >
          A wall for the words that never made it out of your chest. Leave one,
          drift through everybody else&apos;s, and let it stay unfinished.
        </p>

        <div
          className="mt-10 flex flex-col items-center gap-3 rise sm:flex-row"
          style={{ animationDelay: "0.42s" }}
        >
          <Link href="/write" className="btn">
            Write something
            <Arrow />
          </Link>
          <Link href="/read" className="btn btn-ghost">
            Walk the wall
          </Link>
        </div>
      </div>

      <div
        className="absolute inset-x-0 bottom-0 z-10 px-6 pb-6 rise"
        style={{ animationDelay: "0.6s" }}
      >
        <div className="mx-auto flex max-w-[92rem] flex-col-reverse items-center gap-3 text-[0.6875rem] uppercase tracking-[0.2em] text-[var(--ink-4)] sm:flex-row sm:justify-between">
          <p>{numbers.format(stats.total)} held here</p>
          {newest ? (
            <p className="max-w-[30rem] truncate normal-case tracking-normal">
              <span className="hand text-[0.95rem] text-[var(--ink-3)]">
                &ldquo;{newest.title}&rdquo;
              </span>
              <span className="ml-2 text-[var(--ink-4)]">— the most recent</span>
            </p>
          ) : (
            <p>nothing here yet</p>
          )}
        </div>
      </div>
    </main>
  );
}
