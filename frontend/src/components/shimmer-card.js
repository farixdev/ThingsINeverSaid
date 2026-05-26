export default function ShimmerCard() {
  return (
    <article className="glass-card rounded-[32px] p-6 shadow-[0_18px_50px_rgba(213,138,170,0.08)] flex flex-col justify-between border-[#F6DDE1] bg-white/85 animate-pulse">
      <div>
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2 w-full">
            {/* Title shimmer */}
            <div className="h-5 w-3/5 rounded-full shimmer-bg" />
            {/* Date shimmer */}
            <div className="h-3 w-2/5 rounded-full shimmer-bg" />
          </div>
        </div>

        {/* Snippet shimmer - two lines */}
        <div className="mt-4 space-y-2">
          <div className="h-3.5 w-full rounded-full shimmer-bg" />
          <div className="h-3.5 w-4/5 rounded-full shimmer-bg" />
        </div>
      </div>

      {/* Footer shimmer */}
      <div className="mt-5">
        <div className="h-3 w-28 rounded-full shimmer-bg" />
      </div>
    </article>
  );
}

