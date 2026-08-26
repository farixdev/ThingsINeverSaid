/**
 * The five feelings a confession can be pinned under.
 * Colours are deliberately desaturated — on the wall they only ever appear as a
 * hairline along the top edge of a note and a 5px dot beside the signature.
 */
export const MOODS = [
  { id: "love", label: "Love", hint: "Something tender", color: "#C08079" },
  { id: "regret", label: "Regret", hint: "Something too late", color: "#8D89A0" },
  { id: "grief", label: "Grief", hint: "Something lost", color: "#78888B" },
  { id: "hope", label: "Hope", hint: "Something still ahead", color: "#95A47C" },
  { id: "thanks", label: "Gratitude", hint: "Something owed", color: "#BFA067" },
];

export const DEFAULT_MOOD = "unspoken";

const BY_ID = new Map(MOODS.map((mood) => [mood.id, mood]));

export function moodOf(id) {
  return BY_ID.get(id) ?? { id: DEFAULT_MOOD, label: "Unspoken", hint: "", color: "#B3A79E" };
}

export function isMood(id) {
  return id === DEFAULT_MOOD || BY_ID.has(id);
}
