import Wall from "@/components/wall/wall";
import { PETALS } from "@/lib/letters";
import { getWall } from "@/lib/confessions";
import { formatWhen } from "@/lib/format";

export const revalidate = 300;

export const metadata = {
  title: "The wall",
  description:
    "Drag through the words people never said out loud. No feed, no order, no end.",
};

export default async function ReadPage() {
  let notes = [];
  try {
    notes = await getWall();
  } catch (error) {
    console.error("The wall could not be loaded:", error);
  }

  return (
    <>
      <Wall notes={notes} petals={PETALS} />

      {/*
        The wall itself is a canvas — it means nothing to a crawler or a screen
        reader. This is the same content, in reading order, for both.
      */}
      <section className="sr-only">
        <h1>The wall — anonymous confessions</h1>
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
