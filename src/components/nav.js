"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sprig } from "./marks";

const LINKS = [
  { href: "/read", label: "Read" },
  { href: "/write", label: "Write" },
  { href: "/about", label: "About" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <header className="fixed inset-x-0 top-0 z-40 pointer-events-none">
      <div className="nav-scrim" aria-hidden="true" />
      <div className="mx-auto flex max-w-[92rem] items-center justify-between gap-3 px-4 py-4 sm:gap-6 sm:px-8 sm:py-6">
        <Link
          href="/"
          className="pointer-events-auto group flex items-center gap-2.5"
          aria-label="Things I Never Said — home"
        >
          <Sprig
            size={17}
            className="text-[var(--rose)] opacity-60 transition-opacity duration-500 group-hover:opacity-100"
          />
          <span className="display whitespace-nowrap text-[0.85rem] tracking-[0.01em] sm:text-[1.05rem]">
            Things I Never Said
          </span>
        </Link>

        <nav className="pointer-events-auto flex items-center gap-1">
          {LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`relative rounded-full px-2 py-1.5 text-[0.625rem] uppercase tracking-[0.14em] transition-colors duration-500 sm:px-3 sm:text-[0.6875rem] sm:tracking-[0.18em] ${
                  active
                    ? "text-[var(--ink)]"
                    : "text-[var(--ink-3)] hover:text-[var(--ink)]"
                }`}
              >
                {link.label}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-2 -bottom-0.5 h-px sm:inset-x-3 origin-left bg-[var(--rose)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  style={{ transform: `scaleX(${active ? 1 : 0})` }}
                />
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
