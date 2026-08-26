/**
 * Hand-lettered pieces that live on the wall alongside the written notes.
 * They are treated as first-class confessions with a `kind` of "letter" so the
 * wall renderer can give them a wider, quieter frame.
 */
export const LETTERS = [
  {
    id: "letter-you-never-knew",
    src: "/letters/you-never-knew.svg",
    title: "You never knew",
    line: "I loved you through glass, and you never once looked up.",
    mood: "love",
  },
  {
    id: "letter-i-miss-who-we-used-to-be",
    src: "/letters/i-miss-who-we-used-to-be.svg",
    title: "I miss who we used to be",
    line: "Not you. Not me. The two of us, before we learned to be careful.",
    mood: "grief",
  },
  {
    id: "letter-i-regret-not-saying-it",
    src: "/letters/i-regret-not-saying-it.svg",
    title: "I regret not saying it",
    line: "I chose the safe silence and paid for it every day since.",
    mood: "regret",
  },
  {
    id: "letter-i-watch-you-love-someone-else",
    src: "/letters/i-watch-you-love-somone-else.svg",
    title: "I watch you love someone else",
    line: "You are happy. I keep that fact like a stone in my pocket.",
    mood: "grief",
  },
  {
    id: "letter-loved-her-silently",
    src: "/letters/loved-her-silently-and-now-it-hurts.svg",
    title: "Loved her silently",
    line: "A whole love with no witnesses. It still counted.",
    mood: "love",
  },
  {
    id: "letter-i-lied-to-protect-your-feelings",
    src: "/letters/i-lied-to-protect-your-feelings.svg",
    title: "I lied to protect your feelings",
    line: "It was kindness when I said it. It was cowardice by morning.",
    mood: "regret",
  },
  {
    id: "letter-im-scared-i-always-feel-alone",
    src: "/letters/im-scared-i-always-feel-alone.svg",
    title: "I'm scared I always feel alone",
    line: "In a full room, in a good year, in the middle of being loved.",
    mood: "hope",
  },
];

/**
 * Pressed flowers. Purely decorative — scattered between the notes on the wall
 * and out in the margins of the About page, never interactive.
 */
export const PETALS = [
  { id: "petal-1", src: "/petals/flower-1.png", w: 287, h: 284 },
  { id: "petal-2", src: "/petals/flower-2.png", w: 287, h: 284 },
  { id: "petal-3", src: "/petals/flower-3.png", w: 380, h: 376 },
  { id: "petal-4", src: "/petals/flower4.png", w: 287, h: 284 },
  { id: "petal-5", src: "/petals/flower5.png", w: 461, h: 456 },
  { id: "petal-6", src: "/petals/flower6.png", w: 511, h: 572 },
];
