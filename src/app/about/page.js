import Link from "next/link";
import Reveal from "@/components/reveal";
import { Arrow, Seal, Sprig } from "@/components/marks";
import { FEATURED_LETTER } from "@/lib/letters";
import { getStats } from "@/lib/confessions";
import { numbers } from "@/lib/format";

export const revalidate = 300;

export const metadata = {
  title: "About",
  description:
    "Why this wall exists, what happens to what you write, and how it was built.",
};

const HOW = [
  {
    n: "01",
    title: "You write it",
    body: "One box, no account, no email. The only thing the site asks for is the sentence you have been carrying.",
  },
  {
    n: "02",
    title: "It goes on the wall",
    body: "Not a feed. A plane you drag through in any direction, where your note sits beside a stranger's with no ranking between them.",
  },
  {
    n: "03",
    title: "Nothing happens next",
    body: "No likes, no replies, no notifications, no way to find out who read it. That absence is the whole point.",
  },
];

const BUILT = [
  ["Framework", "Next.js 16, App Router, React Server Components"],
  ["Database", "Neon — serverless Postgres over HTTP"],
  ["Writing", "React Server Actions, no client-side API layer"],
  ["Caching", "Tag-invalidated data cache; the wall is only rebuilt when it changes"],
  ["The wall", "A hand-written pan/zoom engine — culling, parallax and inertia in one rAF loop"],
  ["Type", "Instrument Serif, Geist, Caveat"],
];

export default async function AboutPage() {
  let stats = { total: 0, latest: null };
  try {
    stats = await getStats();
  } catch (error) {
    console.error("About could not read the wall stats:", error);
  }

  return (
    <main className="scroll-surface">
      <div className="mx-auto w-full max-w-[46rem] px-6 pb-28 pt-32 sm:px-8 sm:pt-40">
        {/* ---------------------------------------------------------- hero */}
        <Reveal as="header" className="text-center">
          <Sprig size={38} className="mx-auto text-[var(--rose)] opacity-45" />
          <p className="eyebrow mt-7">about this place</p>
          <h1 className="display mt-5 text-[clamp(2.2rem,1.6rem+3.2vw,3.8rem)]">
            Some things are only
            <br />
            <em className="italic text-[var(--rose)]">sayable anonymously.</em>
          </h1>
          <p className="mx-auto mt-7 max-w-[32rem] text-[1.02rem] leading-[1.8] text-[var(--ink-2)]">
            {numbers.format(stats.total)} of them are sitting on the wall right
            now, left by people you will never meet and who will never know you
            read them.
          </p>
        </Reveal>

        <hr className="rule my-16" />

        {/* ---------------------------------------------------------- essay */}
        <Reveal as="section" className="space-y-6 text-[1.02rem] leading-[1.85]">
          <p>
            Most of what we feel never gets said. Not because it does not
            matter — because saying it costs something. It would embarrass
            somebody, or reopen something, or arrive years too late to be
            useful. So it stays in, and it keeps its weight.
          </p>
          <p>
            This site does not fix that. It just gives the sentence somewhere to
            go. You write it once, without your name on it, and it stops being
            only yours. That is a smaller thing than closure and a bigger thing
            than nothing.
          </p>
          <p>
            There is deliberately nothing here to chase. No follower count, no
            reply box, no way to know whether anyone saw it. Every feature that
            would have made this addictive was left out on purpose. What is left
            is a quiet room with other people&apos;s handwriting on the walls.
          </p>
          <p className="text-[var(--ink-3)]">
            Be gentle in here. Every note is real, and somebody is still living
            inside the situation they wrote about.
          </p>
        </Reveal>

        <hr className="rule my-16" />

        {/* ------------------------------------------------------ how it works */}
        <section>
          <Reveal>
            <p className="eyebrow">how it works</p>
          </Reveal>
          <div className="mt-8 space-y-8">
            {HOW.map((step, index) => (
              <Reveal key={step.n} delay={index * 90}>
                <div className="flex gap-5 sm:gap-7">
                  <span className="mt-1 shrink-0 font-[family-name:var(--font-display)] text-[1.4rem] text-[var(--rose)] opacity-55">
                    {step.n}
                  </span>
                  <div>
                    <h2 className="text-[1.25rem]">{step.title}</h2>
                    <p className="mt-2 leading-[1.8] text-[var(--ink-2)]">{step.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <hr className="rule my-16" />

        {/* --------------------------------------------------- featured letter */}
        <Reveal as="section">
          <p className="eyebrow text-center">from the archive</p>
          <h2 className="display mt-4 text-center text-[clamp(1.7rem,1.3rem+1.8vw,2.6rem)]">
            {FEATURED_LETTER.title}
          </h2>
          <figure className="paper mt-9 flex max-h-[70vh] justify-center overflow-hidden rounded-[4px] p-4 sm:p-7">
            {/* Hand-lettered SVG: next/image would need dangerouslyAllowSVG and cannot optimise it anyway. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={FEATURED_LETTER.src}
              alt={`Hand-lettered piece: ${FEATURED_LETTER.title}`}
              className="h-auto max-h-[62vh] w-auto max-w-full object-contain mix-blend-multiply"
              loading="lazy"
              decoding="async"
            />
          </figure>
          <figcaption className="mt-4 text-center text-[0.8125rem] text-[var(--ink-4)]">
            One of the hand-lettered pieces pinned across the wall.
          </figcaption>
        </Reveal>

        <hr className="rule my-16" />

        {/* -------------------------------------------------------- the build */}
        <section>
          <Reveal>
            <p className="eyebrow">how it&apos;s built</p>
            <p className="mt-4 max-w-[34rem] leading-[1.8] text-[var(--ink-2)]">
              One Next.js app, one Postgres table, no client-side API layer, and
              a wall renderer written by hand rather than pulled off a shelf.
            </p>
          </Reveal>
          <dl className="mt-9 divide-y divide-[var(--line-soft)] border-y border-[var(--line-soft)]">
            {BUILT.map(([term, detail], index) => (
              <Reveal key={term} delay={index * 60}>
                <div className="flex flex-col gap-1 py-4 sm:flex-row sm:gap-8">
                  <dt className="w-[9rem] shrink-0 text-[0.6875rem] uppercase tracking-[0.18em] text-[var(--ink-4)]">
                    {term}
                  </dt>
                  <dd className="text-[0.95rem] leading-[1.7]">{detail}</dd>
                </div>
              </Reveal>
            ))}
          </dl>
        </section>

        <hr className="rule my-16" />

        {/* ------------------------------------------------------------- close */}
        <Reveal as="section" className="text-center">
          <Seal size={40} className="mx-auto text-[var(--rose)] opacity-45" />
          <h2 className="display mt-6 text-[clamp(1.6rem,1.3rem+1.6vw,2.4rem)]">
            There is space on the wall.
          </h2>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/write" className="btn">
              Write something
              <Arrow />
            </Link>
            <Link href="/read" className="btn btn-ghost">
              Walk the wall
            </Link>
          </div>
          <p className="mt-14 text-[0.6875rem] uppercase tracking-[0.2em] text-[var(--ink-4)]">
            Made by{" "}
            <a
              href="https://github.com/farixdev"
              className="underline decoration-[var(--line)] underline-offset-4 transition-colors hover:text-[var(--rose)]"
              target="_blank"
              rel="noreferrer"
            >
              Faris Tahoor
            </a>
          </p>
        </Reveal>
      </div>
    </main>
  );
}
