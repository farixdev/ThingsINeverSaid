import Link from "next/link";

export default function SiteHeader({ currentPage }) {
  // Dynamically determine navigation links based on current page
  let navItems = [];
  
  if (currentPage === "Home") {
    navItems = [{ href: "/about", label: "About" }];
  } else if (currentPage === "Read") {
    navItems = [
      { href: "/write", label: "Write" },
      { href: "/about", label: "About" },
    ];
  } else if (currentPage === "Write") {
    navItems = [
      { href: "/read", label: "Read" },
      { href: "/about", label: "About" },
    ];
  } else if (currentPage === "About") {
    navItems = [
      { href: "/read", label: "Read" },
      { href: "/write", label: "Write" },
    ];
  }

  return (
    <header className="sticky top-0 z-40 bg-transparent  backdrop-blur-xl shadow-[0_2px_20px_rgba(214,150,163,0.06)]">
      <div className="mx-auto flex max-w-7xl flex-row items-center justify-between gap-4 px-6 py-4 sm:px-8">
        <Link
          href="/"
          className="text-lg font-semibold tracking-wider text-[#5D4C54] font-serif hover:text-[#8A5E6C] transition duration-300 sm:text-xl whitespace-nowrap"
        >
          Things I Never Said
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all duration-300 text-[#6B6368] hover:bg-[#F6DDE1]/60 hover:text-[#8A5E6C] border border-[#fbe9ee]/30 cursor-pointer"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
