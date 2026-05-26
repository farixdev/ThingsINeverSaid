export default function FeatureCard({ title, children }) {
  return (
    <article className="glass-card rounded-[32px] p-8 shadow-[0_24px_80px_rgba(212,158,178,0.1)] sm:p-10 flex flex-col justify-between">
      <div>
        <h3 className="mb-4 text-2xl font-semibold text-[#5D4C54] font-serif group-hover:text-[#8A5E6C] transition duration-300">
          {title}
        </h3>
        <div className="space-y-4 text-sm leading-6 text-[#6B6368] sm:text-base sm:leading-7">
          {children}
        </div>
      </div>
    </article>
  );
}
