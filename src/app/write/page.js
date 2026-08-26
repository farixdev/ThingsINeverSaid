import AmbientWall from "@/components/ambient-wall";
import Compose from "@/components/compose";
import { getWall } from "@/lib/confessions";

export const revalidate = 300;

export const metadata = {
  title: "Write",
  description:
    "Say the thing you never said. Anonymous, unsigned, and left on a wall with everyone else's.",
};

export default async function WritePage() {
  let notes = [];
  try {
    notes = await getWall();
  } catch (error) {
    console.error("Write page could not reach the wall:", error);
  }

  return (
    <main className="fit-screen relative flex items-center justify-center px-4 pt-20 pb-8 sm:px-6">
      <AmbientWall notes={notes} count={7} className="opacity-60" />
      <Compose />
    </main>
  );
}
