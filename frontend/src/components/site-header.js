import Link from "next/link";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/read", label: "Read" },
  { href: "/write", label: "Write" },
  { href: "/about", label: "About" },
];

export default function SiteHeader({ currentPage }) {
  return (
    <header className="sticky top-0 z-20 border-b border-white/50 bg-white/80 backdrop-blur-xl shadow-sm shadow-pink-100">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4 sm:px-8">
        <Link
          href="/"
          className="text-xl font-semibold tracking-tight text-[#6B6368]"
        >
          Things I Never Said
        </Link>

        <nav className="flex flex-wrap items-center gap-2 sm:gap-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-full px-3 py-2 text-sm font-medium transition ${
                currentPage === item.label
                  ? "bg-[#F6DDE1] text-[#8A5E6C]"
                  : "text-[#6B6368] hover:bg-[#F6DDE1] hover:text-[#8A5E6C]"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
