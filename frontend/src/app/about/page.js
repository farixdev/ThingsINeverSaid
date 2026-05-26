import SiteHeader from "@/components/site-header";
import FeatureCard from "@/components/feature-card";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#f9eef1] pb-16 relative overflow-hidden">
      {/* Soft background glow */}
      <div className="absolute -right-40 top-10 h-[500px] w-[500px] rounded-full bg-[#f4ccd7]/25 blur-3xl" />
      <div className="absolute -left-40 bottom-10 h-[500px] w-[500px] rounded-full bg-[#faedf2]/45 blur-3xl" />

      {/* Decorative ambient flower images */}
      <div className="absolute right-12 top-24 w-24 opacity-25 select-none pointer-events-none md:w-36 animate-float">
        <img src="/flower 3.png" alt="" className="w-full" />
      </div>
      <div className="absolute left-8 bottom-32 w-28 opacity-25 select-none pointer-events-none md:w-44 animate-float" style={{ animationDelay: "-2.5s" }}>
        <img src="/flower4.png" alt="" className="w-full" />
      </div>

      <SiteHeader currentPage="About" />

      <section className="mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:py-16 relative">
        <div className="space-y-6 text-center">
          <p className="text-xs uppercase tracking-[0.32em] text-[#A57A8A]">About this project</p>
          <h1 className="text-4xl font-semibold tracking-tight text-[#5D4C54] sm:text-5xl lg:text-6xl font-serif">
            Why this site <span className="italic text-[#8A5E6C]">exists</span>.
          </h1>
          <p className="mx-auto max-w-3xl text-base leading-8 text-[#6B6368] sm:text-lg">
            This project is built to hold the words that feel too heavy to speak out loud. Every page is created for calm interaction, soft visuals, and slow breathing.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="mt-16 grid gap-8 md:grid-cols-2">
          <FeatureCard title="A gentle writing flow">
            <p className="text-[#6B6368] leading-relaxed">
              The writing experience is clean and responsive, with a page layout that adapts to every screen. It keeps the focus on your message, not the interface.
            </p>
          </FeatureCard>

          <FeatureCard title="A room to read quietly">
            <p className="text-[#6B6368] leading-relaxed">
              The read wall presents honest lines in a calm card layout so every confession feels held and respected.
            </p>
          </FeatureCard>

          <FeatureCard title="Made for reflection">
            <p className="text-[#6B6368] leading-relaxed">
              The site supports a gentle emotional rhythm: write when you’re ready, then return later to read your words with distance.
            </p>
          </FeatureCard>

          <FeatureCard title="Built for persistence">
            <p className="text-[#6B6368] leading-relaxed">
              Your words are safely retained using local state mechanisms and client-side memory fallbacks, ensuring they won't disappear even when offline.
            </p>
          </FeatureCard>
        </div>

        {/* Featured Letter Section (Fixed & Restored) */}
        <div className="mt-20">
          <div className="rounded-[40px] border border-[#F6DDE1] bg-white/75 backdrop-blur-md p-8 shadow-[0_30px_90px_rgba(214,150,163,0.14)] md:p-12">
            <div className="mx-auto max-w-3xl">
              <div className="text-center mb-10 space-y-2">
                <span className="text-[10px] uppercase tracking-[0.4em] text-[#A57A8A] font-semibold">✦ Featured Story ✦</span>
                <h2 className="text-3xl font-semibold text-[#5D4C54] font-serif italic">You Never Knew</h2>
                <p className="text-sm text-[#9B8C93]">A letter preserved on the quiet edges of the wall.</p>
              </div>

              {/* Lined paper / journaling styled container */}
              <div className="writing-paper rounded-[24px] border border-[#fbe5e9] bg-[#fffafb] p-6 text-[#5D4C54] shadow-inner md:p-8 font-serif leading-relaxed text-sm md:text-base space-y-6">
                <p>
                  Deep down, she will be the last. This time was different.
                  She wasn’t a passing image or a distant idea. She existed in
                  my life longer than anyone else I’ve loved. I saw her often.
                  She stayed in my world. And yes, I even talked to her. More
                  than once. Which, for me, felt like a miracle.
                </p>
                <p>
                  So what went wrong? I live with a strange illness—a constant feeling that
                  nothing is real, that everything is a dream. Derealization,
                  I think it’s called. It feels like watching life through
                  glass, never fully inside it, never fully awake. It makes
                  connection terrifying, because everything already feels like
                  it’s slipping away. Still… this girl.
                </p>
                <p>
                  I swear to you, she is the most beautiful and purest person I’ve ever seen. And I
                  don’t say that just because I love her. I say it because
                  after loving so many women in silence, I’ve learned
                  something important: love has nothing to do with facial
                  features, height, or body. Love is about the soul.
                </p>
                <p>
                  And she had both—the kind of beauty anyone could admire, and a soul
                  that pulled me in with violent force. The reason I never
                  confessed is simple: I knew she wasn’t interested in me. I
                  can read faces. I can feel energy. I can tell when someone’s
                  heart is closed to me. Her behavior, the way she interacted
                  with other boys, the way she existed around me—it all told
                  me enough. So I did what I always do. I stepped back. I
                  created distance. I chose pain I could control over
                  rejection I couldn’t survive.
                </p>
                <p>
                  Now life feels like hell again, like it always does. This time, though, I made a promise to
                  myself. I will live like this forever. I won’t chase what I
                  want. I won’t marry. I won’t build dreams that require hope.
                  I will grieve. I will read. I will write. And I will exist
                  quietly on the edge of everything.
                </p>
                <p>
                  You might think, “What a jerk, falling in love with everyone. Love is meant to be with
                  one person for life.” And I believe that too, but maybe only
                  for the charming, funny, good-looking guys. For people like
                  me, love has no boundaries and no ending. It comes without
                  permission and leaves without closure.
                </p>
                <p>
                  And maybe, if life ever decides to be kind to me, someone will love me the way
                  I love others. But until then, loving does not stop just
                  because it hurts. I don’t see this as tragedy anymore, and I
                  don’t hate the world for it either. Some people are built to
                  observe life instead of participating in it, to feel
                  everything without ever being allowed to keep it.
                </p>
                <p>
                  I learned early that wanting something doesn’t mean you deserve it,
                  and loving someone doesn’t guarantee you will ever be
                  chosen. So I write not to change anything, but to keep my
                  feelings from disappearing completely, to leave proof that
                  they once existed. Maybe one day she will read these words,
                  maybe she won’t, but either way they remain, breathing
                  quietly on the page. Over time, hope became exhausting, so I
                  let it go without making a scene. Now I move through life
                  with low expectations, not because I’m bitter, but because I
                  understand how easily things slip away. This is not a phase
                  or a wound waiting to heal—it’s simply the shape my life
                  took, and I’ve stopped arguing with it.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
