"use client";

import Link from "next/link";
import { Sprig } from "@/components/marks";

export default function Error({ error, reset }) {
  return (
    <main className="fit-screen relative flex flex-col items-center justify-center px-6 py-24 text-center">
      <Sprig size={40} className="text-[var(--rose)] opacity-40" />
      <p className="eyebrow mt-7">something came loose</p>
      <h1 className="display mt-5 text-[clamp(1.8rem,1.4rem+2.2vw,2.8rem)]">
        The wall didn&apos;t load.
      </h1>
      <p className="mt-4 max-w-[26rem] text-[0.95rem] text-[var(--ink-2)]">
        Usually this means the database is asleep or unreachable. Nothing you
        wrote has been lost.
      </p>
      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
        <button type="button" className="btn" onClick={() => reset()}>
          Try again
        </button>
        <Link href="/" className="btn btn-ghost">
          Go home
        </Link>
      </div>
      {error?.digest && (
        <p className="mt-10 text-[0.6875rem] tracking-[0.16em] text-[var(--ink-4)]">
          {error.digest}
        </p>
      )}
    </main>
  );
}
