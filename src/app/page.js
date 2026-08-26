import Link from "next/link";
import AmbientWall from "@/components/ambient-wall";
import { Arrow, Sprig } from "@/components/marks";
import { getWall } from "@/lib/confessions";
import { since } from "@/lib/format";

export const revalidate = 300;

export default async function HomePage() {
  let notes = [];
  try {
    notes = await getWall();
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
        {newest && (
          /* The only live thing on this page: proof the wall is still being
             added to. A fragment, when it was left, and a way in. */
          <Link
            href="/read"
            className="newest"
            aria-label={`The most recent confession, left ${since(newest.createdAt)}. Go to the wall.`}
          >
            <span className="newest-quote">&ldquo;{newest.title}&rdquo;</span>
            <span className="newest-when">left here {since(newest.createdAt)}</span>
          </Link>
        )}
      </div>
    </main>
  );
}
