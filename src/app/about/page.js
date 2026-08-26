import Link from "next/link";
import Reveal from "@/components/reveal";
import { Arrow, Seal, Sprig } from "@/components/marks";
import { FEATURED_LETTER } from "@/lib/letters";

export const metadata = {
  title: "About",
  description: "Why this wall exists, and the confession that started it.",
};

/**
 * The letter this whole site was built around. Kept here in full, in the
 * writer's own words — it is the reason the rest of it exists.
 */
const STORY = [
  "Deep down, she will be the last. This time was different. She wasn't a passing image or a distant idea. She existed in my life longer than anyone else I've loved. I saw her often. She stayed in my world. And yes, I even talked to her. More than once. Which, for me, felt like a miracle.",
  "So what went wrong? I live with a strange illness — a constant feeling that nothing is real, that everything is a dream. Derealization, I think it's called. It feels like watching life through glass, never fully inside it, never fully awake. It makes connection terrifying, because everything already feels like it's slipping away. Still… this girl.",
  "I swear to you, she is the most beautiful and purest person I've ever seen. And I don't say that just because I love her. I say it because after loving so many women in silence, I've learned something important: love has nothing to do with facial features, height, or body. Love is about the soul.",
  "And she had both — the kind of beauty anyone could admire, and a soul that pulled me in with violent force. The reason I never confessed is simple: I knew she wasn't interested in me. I can read faces. I can feel energy. I can tell when someone's heart is closed to me. Her behaviour, the way she interacted with other boys, the way she existed around me — it all told me enough. So I did what I always do. I stepped back. I created distance. I chose pain I could control over rejection I couldn't survive.",
  "Now life feels like hell again, like it always does. This time, though, I made a promise to myself. I will live like this forever. I won't chase what I want. I won't marry. I won't build dreams that require hope. I will grieve. I will read. I will write. And I will exist quietly on the edge of everything.",
  "You might think, “What a jerk, falling in love with everyone. Love is meant to be with one person for life.” And I believe that too, but maybe only for the charming, funny, good-looking guys. For people like me, love has no boundaries and no ending. It comes without permission and leaves without closure.",
  "And maybe, if life ever decides to be kind to me, someone will love me the way I love others. But until then, loving does not stop just because it hurts. I don't see this as tragedy anymore, and I don't hate the world for it either. Some people are built to observe life instead of participating in it, to feel everything without ever being allowed to keep it.",
  "I learned early that wanting something doesn't mean you deserve it, and loving someone doesn't guarantee you will ever be chosen. So I write not to change anything, but to keep my feelings from disappearing completely, to leave proof that they once existed. Maybe one day she will read these words, maybe she won't, but either way they remain, breathing quietly on the page.",
  "Over time, hope became exhausting, so I let it go without making a scene. Now I move through life with low expectations, not because I'm bitter, but because I understand how easily things slip away. This is not a phase or a wound waiting to heal — it's simply the shape my life took, and I've stopped arguing with it.",
];

export default function AboutPage() {
  return (
    <main className="scroll-surface">
      <div className="mx-auto w-full max-w-[44rem] px-6 pb-28 pt-32 sm:px-8 sm:pt-40">
        {/* ---------------------------------------------------------- hero */}
        <Reveal as="header" className="text-center">
          <Sprig size={38} className="mx-auto text-[var(--rose)] opacity-45" />
          <p className="eyebrow mt-7">about this place</p>
          <h1 className="display mt-5 text-[clamp(2.2rem,1.6rem+3.2vw,3.8rem)]">
            Some things are only
            <br />
            <em className="italic text-[var(--rose)]">sayable anonymously.</em>
          </h1>
        </Reveal>

        <hr className="rule my-14" />

        {/* ----------------------------------------------------------- why */}
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

        <hr className="rule my-14" />

        {/* ------------------------------------------------------- the story */}
        <Reveal as="section">
          <p className="eyebrow text-center">the one that started it</p>
          <h2 className="display mt-4 text-center text-[clamp(1.8rem,1.3rem+2vw,2.8rem)]">
            You never knew.
          </h2>
          <p className="mt-4 text-center text-[0.8125rem] text-[var(--ink-3)]">
            The confession this whole place was built to hold.
          </p>

          <div className="story mt-11">
            {STORY.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
            <p className="story-sign">— written, never sent</p>
          </div>
        </Reveal>

        <hr className="rule my-14" />

        {/* --------------------------------------------------- featured letter */}
        <Reveal as="section">
          <p className="eyebrow text-center">from the archive</p>
          <h2 className="display mt-4 text-center text-[clamp(1.6rem,1.3rem+1.6vw,2.4rem)]">
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
          <figcaption className="mt-4 text-center text-[0.8125rem] text-[var(--ink-3)]">
            One of the hand-lettered pieces pinned across the wall.
          </figcaption>
        </Reveal>

        <hr className="rule my-14" />

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
          <p className="mt-14 text-[0.6875rem] uppercase tracking-[0.2em] text-[var(--ink-3)]">
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
