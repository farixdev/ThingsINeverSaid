import FeatureCard from "./components/feature-card";
import SiteHeader from "./components/site-header";

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

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#f9eef1]">
      <SiteHeader currentPage="Home" />

      <section className="mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="space-y-6">
            <p className="text-sm uppercase tracking-[0.32em] text-[#A57A8A]">
              Welcome to the wall
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-[#5D4C54] sm:text-5xl">
              The place for the words you never said.
            </h1>
            <p className="max-w-2xl text-base leading-8 text-[#6B6368] sm:text-lg">
              This site is designed for feeling, honesty, and quiet courage. Write something that has been stuck in your chest, then come back later and read it from a softer place.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <a
                href="/write"
                className="inline-flex items-center justify-center rounded-full bg-[#F6DDE1] px-7 py-3 text-sm font-semibold text-[#8A5E6C] transition hover:bg-[#e8c8d4]"
              >
                Write something
              </a>
              <a
                href="/read"
                className="inline-flex items-center justify-center rounded-full border border-[#F6DDE1] bg-white px-7 py-3 text-sm font-semibold text-[#6B6368] transition hover:bg-[#f8eef1]"
              >
                Read the wall
              </a>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[32px] border border-[#F6DDE1] bg-white/80 p-8 shadow-[0_30px_90px_rgba(214,150,163,0.16)]">
            <div className="absolute -right-16 top-10 h-40 w-40 rounded-full bg-[#F7D4DE]/80 blur-3xl" />
            <div className="absolute -left-20 bottom-12 h-32 w-32 rounded-full bg-[#FBE9EE]/80 blur-3xl" />
            <div className="relative">
              <p className="text-sm uppercase tracking-[0.32em] text-[#A57A8A]">
                A soft journal
              </p>
              <h2 className="mt-4 text-3xl font-semibold text-[#5D4C54]">
                A responsive writing experience for every screen.
              </h2>
              <p className="mt-4 text-base leading-7 text-[#6B6368]">
                The UI is kept calm and readable, with intentional spacing and gentle colors so your words always feel important.
              </p>
              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                <div className="rounded-[24px] bg-[#FDF3F6] p-4 shadow-[0_14px_40px_rgba(214,150,163,0.12)]">
                  <p className="font-semibold text-[#7F5D69]">Write freely</p>
                  <p className="mt-2 text-sm leading-6 text-[#7B6670]">A clean page for thoughts, honest and private.</p>
                </div>
                <div className="rounded-[24px] bg-[#FDF3F6] p-4 shadow-[0_14px_40px_rgba(214,150,163,0.12)]">
                  <p className="font-semibold text-[#7F5D69]">Read gently</p>
                  <p className="mt-2 text-sm leading-6 text-[#7B6670]">A curated wall of confessions without distraction.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {features.map((feature) => (
            <FeatureCard key={feature.title} title={feature.title}>
              <p>{feature.description}</p>
            </FeatureCard>
          ))}
        </div>
      </section>
    </main>
  );
}
