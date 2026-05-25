export default function ConfessionCard({ title, snippet, date }) {
  return (
    <article className="rounded-[28px] border border-[#F6DDE1] bg-white/85 p-6 shadow-[0_18px_50px_rgba(213,138,170,0.12)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h4 className="text-xl font-semibold text-[#5D4C54]">{title}</h4>
          <p className="mt-1 text-sm uppercase tracking-[0.24em] text-[#AB8B96]">
            {date}
          </p>
        </div>
      </div>
      <p className="mt-5 text-base leading-7 text-[#6B6368]">{snippet}</p>
    </article>
  );
}
