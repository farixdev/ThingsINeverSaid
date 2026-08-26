import Wall from "@/components/wall/wall";
import { LETTERS, PETALS } from "@/lib/letters";
import { getStats, getWall } from "@/lib/confessions";
import { formatWhen } from "@/lib/format";

export const revalidate = 300;

export const metadata = {
  title: "The wall",
  description:
    "Drag through the words people never said out loud. No feed, no order, no end.",
};

export default async function ReadPage() {
  let notes = [];
  let stats = { total: 0, latest: null };
  try {
    [notes, stats] = await Promise.all([getWall(), getStats()]);
  } catch (error) {
    console.error("The wall could not be loaded:", error);
  }

  return (
    <>
      <Wall notes={notes} letters={LETTERS} petals={PETALS} total={stats.total} />

      {/*
        The wall itself is a canvas — it means nothing to a crawler or a screen
        reader. This is the same content, in reading order, for both.
      */}
      <section className="sr-only">
        <h1>The wall — {stats.total} anonymous confessions</h1>
        <ol>
          {notes.map((note) => (
            <li key={note.id}>
              <article>
                <h2>{note.title}</h2>
                <p>{note.text}</p>
                <footer>
                  Signed {note.author}, {formatWhen(note.createdAt)}
                </footer>
              </article>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
