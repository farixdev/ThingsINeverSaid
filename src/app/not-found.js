import Link from "next/link";
import { Arrow, Sprig } from "@/components/marks";

export const metadata = { title: "Not here" };

export default function NotFound() {
  return (
    <main className="fit-screen relative flex flex-col items-center justify-center px-6 py-24 text-center">
      <Sprig size={40} className="text-[var(--rose)] opacity-40" />
      <p className="eyebrow mt-7">nothing at this address</p>
      <h1 className="display mt-5 text-[clamp(2rem,1.5rem+2.6vw,3.2rem)]">
        This one was never said either.
      </h1>
      <Link href="/read" className="btn mt-9">
        Back to the wall
        <Arrow />
      </Link>
    </main>
  );
}
