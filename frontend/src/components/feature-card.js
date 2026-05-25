export default function FeatureCard({ title, children }) {
  return (
    <article className="rounded-[32px] border border-[#F6DDE1] bg-white/75 p-8 shadow-[0_24px_80px_rgba(212,158,178,0.14)] sm:p-10">
      <h3 className="mb-4 text-2xl font-semibold text-[#5D4C54]">{title}</h3>
      <div className="space-y-4 text-base leading-8 text-[#6B6368]">{children}</div>
    </article>
  );
}
