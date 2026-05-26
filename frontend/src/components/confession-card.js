export default function ConfessionCard({ title, snippet, date, author, isSvg, onClick }) {
  return (
    <article
      onClick={onClick}
      className={`glass-card rounded-[32px] p-6 shadow-[0_18px_50px_rgba(213,138,170,0.08)] flex flex-col justify-between cursor-pointer group ${
        isSvg 
          ? "border-[#f2d3da] bg-white/90 hover:border-[#dca7b5]" 
          : "border-[#F6DDE1] bg-white/85"
      }`}
    >
      <div>
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h4 className="text-lg font-semibold text-[#5D4C54] group-hover:text-[#8A5E6C] transition duration-300">
              {title}
            </h4>
            <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.2em] text-[#AB8B96]">
              <span>{date}</span>
              {author && (
                <>
                  <span className="text-[#e2cad0]">•</span>
                  <span className="italic text-[#A57A8A]">by {author}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Restricted Snippet: Only show 1-2 lines (clamped) with ellipsis */}
        <p className="mt-4 text-sm leading-6 text-[#6B6368] whitespace-pre-wrap line-clamp-2">
          {snippet}
        </p>
      </div>

      {/* Read Full Letter appears on hover */}
      <div className="mt-5 flex items-center justify-between text-xs font-semibold text-[#8A5E6C]/60 opacity-0 group-hover:opacity-100 group-hover:text-[#8A5E6C] group-hover:translate-x-1 transition-all duration-300">
        <span>Read full letter ✦</span>
      </div>
    </article>
  );
}
