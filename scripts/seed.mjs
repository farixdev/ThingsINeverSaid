/**
 * Seeds the wall with a starting set of confessions so a fresh database isn't
 * an empty room.
 *
 *   npm run seed          — add them (skips if the wall already has rows)
 *   npm run seed -- --force   — add them anyway
 *   npm run seed:clear    — remove only the seeded rows
 *
 * Seeded rows are tagged with ip_hash = 'seed' so clearing never touches
 * anything a real person wrote.
 */

import { neon } from "@neondatabase/serverless";

const SEED_MARK = "seed";

const CONFESSIONS = [
  {
    title: "I kept the voicemail",
    mood: "grief",
    author: "still listening",
    text: "You called to say you'd be late and that the traffic was awful and that you loved me, in that order, like it was nothing. Eleven seconds. I have listened to it more times than I have told anyone about, and I have never told anyone about it.\n\nI am afraid of the day the phone dies and takes your voice with it.",
  },
  {
    title: "You were the reason I stayed",
    mood: "love",
    author: "Anonymous",
    text: "That whole year I told everyone I was staying in the city for work. It wasn't work. It was the chance that I might run into you at the shop on the corner on a Sunday. I did, twice. You said hello like it cost you nothing.",
  },
  {
    title: "I read the message before I deleted it",
    mood: "regret",
    author: "Anonymous",
    text: "You wrote four paragraphs. I read them standing in a car park with the engine still running. Then I deleted the thread so I wouldn't be able to answer at two in the morning.\n\nI have spent three years trying to remember the third paragraph.",
  },
  {
    title: "Dad, I forgave you",
    mood: "thanks",
    author: "your son",
    text: "You were not a good father for a long time and then you were, and nobody in the family knows how to talk about the part in between. I forgave you somewhere around the time you started calling on Sundays for no reason. I never said it out loud because I thought it would make you cry, and I don't know what I'd do with that.",
  },
  {
    title: "I only applied because you said I couldn't",
    mood: "thanks",
    author: "Anonymous",
    text: "You meant it kindly. You said it was a long shot and that I should have a backup. I have never been so motivated by anything in my life. I got it. I never told you that you were the reason.",
  },
  {
    title: "I am tired in a way sleep doesn't fix",
    mood: "hope",
    author: "Anonymous",
    text: "Everyone thinks I'm fine because I answer quickly and I show up and I make the jokes. I am so tired. Not sad exactly. Just running on the last bar for about two years now.\n\nWriting that down is the first time it has left my head.",
  },
  {
    title: "The dog knew before I did",
    mood: "grief",
    author: "Anonymous",
    text: "She stopped sleeping by the door about a week before you moved out. I thought she was ill. She was just getting ready.",
  },
  {
    title: "I never wanted the promotion",
    mood: "regret",
    author: "Anonymous",
    text: "I wanted to be asked. There is an enormous difference and I found it out at thirty-four, in an office with a glass wall, holding a laptop I did not want to open.",
  },
  {
    title: "To the nurse on the night shift",
    mood: "thanks",
    author: "room 214",
    text: "You sat with me for maybe six minutes at three in the morning and you did not say anything useful and it was the single kindest thing anybody has ever done for me. I never got your name. I have thought about you every year since.",
  },
  {
    title: "I lied about being over it",
    mood: "love",
    author: "Anonymous",
    text: "At the wedding, when your cousin asked, I said it was ancient history and I laughed. I had rehearsed that laugh in the car.",
  },
  {
    title: "I am the friend who drifted",
    mood: "regret",
    author: "Anonymous",
    text: "It wasn't a falling out. There was no moment. I just answered slower and slower until answering felt strange, and then it felt too late, and then it had been four years.\n\nI think about you constantly. I still don't text.",
  },
  {
    title: "You looked happy",
    mood: "grief",
    author: "Anonymous",
    text: "I saw the photos. You looked genuinely, uncomplicatedly happy, in a way you never quite managed with me. I wanted to be angry about it. Mostly I was relieved, which was worse.",
  },
  {
    title: "I am not who they think I am at work",
    mood: "hope",
    author: "Anonymous",
    text: "Nine years of being the calm one. The safe pair of hands. I fake almost all of it and I have never once been caught, which frightens me more than being caught would.",
  },
  {
    title: "Thank you for the sandwich",
    mood: "thanks",
    author: "Anonymous",
    text: "Year eight. I had no lunch for the third day and you slid half of yours across the table without looking up, like it was an accident, so I wouldn't have to say anything. I am thirty-one. I still think about that when I want to be a better person.",
  },
  {
    title: "I chose the safe one",
    mood: "regret",
    author: "Anonymous",
    text: "Everyone told me I'd chosen well. They were right, on paper. Some nights I stand in the kitchen at midnight with the fridge open and I am not hungry at all.",
  },
  {
    title: "Mum, I know about the money",
    mood: "love",
    author: "Anonymous",
    text: "I found the statements when we cleared the flat. I know you went without for years so it never looked like we were going without. You never once made it feel like a debt. I don't know how you did that.",
  },
  {
    title: "I never stopped checking",
    mood: "love",
    author: "Anonymous",
    text: "Not obsessively. Once a month, maybe, when something reminds me. Just to see that you are alive and doing well somewhere. That's all I want from it. That's all I've ever wanted from it.",
  },
  {
    title: "I was jealous of you for a decade",
    mood: "regret",
    author: "your brother",
    text: "You never knew because I made sure of it. Turns out you spent the same decade convinced I was the one who had it easy. We could have just said something.",
  },
  {
    title: "The last thing I said to her was about parking",
    mood: "grief",
    author: "Anonymous",
    text: "Not I love you. Not anything. I said the car park charges after six and she said she knew, and that was it, that was the last one.\n\nI have made my peace with almost everything else.",
  },
  {
    title: "I don't miss the city, I miss being 22 in it",
    mood: "hope",
    author: "Anonymous",
    text: "I keep planning to move back. I understand now that the thing I'm homesick for isn't a place, and no amount of rent will get me there.",
  },
  {
    title: "You made me feel ordinary and I loved it",
    mood: "love",
    author: "Anonymous",
    text: "Everybody else wanted me to be impressive. You wanted me to be on time. I have never felt safer than I did being mildly annoying to you on a Tuesday.",
  },
  {
    title: "I said yes because the room was watching",
    mood: "regret",
    author: "Anonymous",
    text: "Everyone had their phones out. It would have taken more courage than I had to say the true thing in front of forty people, so I said the easy thing and then I lived inside it for six years.",
  },
  {
    title: "I still set two alarms",
    mood: "grief",
    author: "Anonymous",
    text: "One for me and one for the side of the bed nobody is on. It has been fourteen months. I know how it sounds. I am not ready to turn it off.",
  },
  {
    title: "You didn't ruin my life",
    mood: "thanks",
    author: "Anonymous",
    text: "I told a lot of people that you did, for about a year, and I want it on record somewhere that it wasn't true. You were nineteen and so was I and neither of us knew anything.",
  },
  {
    title: "I want to be a father and I'm terrified of it",
    mood: "hope",
    author: "Anonymous",
    text: "Not because of the money or the sleep. Because I have his temper and I have felt it move in me exactly once, years ago, and I have never forgotten how easy it was.",
  },
  {
    title: "I'm the one who left the flowers",
    mood: "love",
    author: "Anonymous",
    text: "Every April. You have probably assumed it was somebody from her work. It wasn't. She was the only person who ever asked me a second question.",
  },
  {
    title: "I laughed along",
    mood: "regret",
    author: "Anonymous",
    text: "You were fifteen and they were relentless and I laughed along because it was cheaper than being next. I have apologised to you in my head about four hundred times. Never once out loud.",
  },
  {
    title: "The house is quiet in a good way now",
    mood: "hope",
    author: "Anonymous",
    text: "For two years the quiet was the worst part. Somewhere this spring it turned into something else. I made coffee this morning and did not brace for anything.",
  },
  {
    title: "I kept your book",
    mood: "love",
    author: "Anonymous",
    text: "You said keep it, so technically it's mine, but we both know you meant it as a way of leaving something behind. Your handwriting is in the margin on page 140. I've never lent it to anyone.",
  },
  {
    title: "I don't believe what I say I believe",
    mood: "hope",
    author: "Anonymous",
    text: "I stopped about four years ago and I have kept going every week because of what it would do to my mother. I don't know whether that makes me a coward or a good son. Probably both.",
  },
  {
    title: "You were right about him",
    mood: "regret",
    author: "Anonymous",
    text: "You said it once, gently, and I did not speak to you for a year for saying it. You were right. I have never given you the satisfaction and it is one of my meanest secrets.",
  },
  {
    title: "Nobody has touched me in three years",
    mood: "grief",
    author: "Anonymous",
    text: "Not badly. Not at all. I shook a colleague's hand in March and thought about it for the rest of the week, and I don't know who I would even tell that to.",
  },
  {
    title: "I gave up the seat and it changed my year",
    mood: "thanks",
    author: "Anonymous",
    text: "You were maybe eighty and you said thank you, love, in a way that suggested people had stopped doing that. I had been thinking about giving up on quite a lot that week. It sounds ridiculous. It worked.",
  },
  {
    title: "I loved you in the way of a fourteen-year-old",
    mood: "love",
    author: "Anonymous",
    text: "Which is to say completely, badly, and about somebody I had invented. I'm not sorry. It was the first time I understood that I had that much in me.",
  },
  {
    title: "I have his number saved as something else",
    mood: "regret",
    author: "Anonymous",
    text: "Under a name that means nothing to anyone who might pick up my phone. It has been there for two years and I have never used it and I have never deleted it and I know exactly what that means.",
  },
  {
    title: "You are the reason I write",
    mood: "thanks",
    author: "Anonymous",
    text: "You wrote three lines on an essay when I was sixteen. Three lines. I have made a living off the belief you handed me in a margin, and you almost certainly do not remember my name.",
  },
  {
    title: "I asked to be moved off the project",
    mood: "regret",
    author: "Anonymous",
    text: "I told them it was capacity. It was you. You were unbearable to be near and I could not say why without saying everything, so I took a worse job in a worse team to get out of the room.",
  },
  {
    title: "It's been ten years and I still rehearse it",
    mood: "grief",
    author: "Anonymous",
    text: "The speech I would give if I ever saw you again. It's about four minutes long. It's very good. It's the most polished thing I own and it will never be used.",
  },
  {
    title: "I'm proud of you and I've never said it plainly",
    mood: "love",
    author: "Anonymous",
    text: "I make jokes instead. I send the article instead. I ask about the car instead. I am so proud of you it embarrasses me, and I have decided that this is where I'll say it.",
  },
  {
    title: "I go back to that summer more than is healthy",
    mood: "hope",
    author: "Anonymous",
    text: "Nothing happened in it. That's the point. No crisis, no decision, no consequence. Just about eleven weeks of nothing being wrong, which I did not recognise as remarkable at the time.",
  },
  {
    title: "I never told you I saw you cry",
    mood: "love",
    author: "Anonymous",
    text: "In the car, before you came in and made dinner and asked about my day. You were so good at it that for years I thought I had imagined the car.",
  },
  {
    title: "I'm the one who told",
    mood: "regret",
    author: "Anonymous",
    text: "Everyone assumed it was someone else and I let them. It was the right thing to do and I would do it again and I have still never admitted it, which I think means it cost me something after all.",
  },
  {
    title: "Thank you for not asking",
    mood: "thanks",
    author: "Anonymous",
    text: "You sat next to me for the whole hour and did not once ask what was wrong. I have never been so grateful for a question that didn't come.",
  },
  {
    title: "I hope you're doing well",
    mood: "hope",
    author: "Anonymous",
    text: "Genuinely. Not the polite version. I hope it worked out, I hope she's kind to you, I hope you stopped doing the thing with your hands when you're nervous. I hope you never think about me at all.",
  },
];

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is missing. Run this through `npm run seed`.");
  process.exit(1);
}

const sql = neon(url);
const args = new Set(process.argv.slice(2));

async function main() {
  if (args.has("--clear")) {
    const removed = await sql`DELETE FROM confessions WHERE ip_hash = ${SEED_MARK} RETURNING id`;
    console.log(`Removed ${removed.length} seeded confessions. Anything real was left alone.`);
    return;
  }

  const [{ n }] = await sql`SELECT COUNT(*)::int AS n FROM confessions`;
  if (n > 0 && !args.has("--force")) {
    console.log(`The wall already holds ${n} confessions. Nothing seeded. Use --force to add anyway.`);
    return;
  }

  // Spread the timestamps over the last few months so the wall doesn't look
  // like it was filled in one afternoon.
  const now = Date.now();
  let written = 0;
  for (let i = 0; i < CONFESSIONS.length; i += 1) {
    const c = CONFESSIONS[i];
    const daysAgo = Math.round(((CONFESSIONS.length - i) / CONFESSIONS.length) * 150 + (i % 7));
    const when = new Date(now - daysAgo * 86400000 - (i % 11) * 3600000);
    await sql`
      INSERT INTO confessions (title, text, author, mood, ip_hash, status, "createdAt")
      VALUES (${c.title}, ${c.text}, ${c.author}, ${c.mood}, ${SEED_MARK}, 'approved', ${when.toISOString()})
    `;
    written += 1;
  }
  console.log(`Pinned ${written} confessions to the wall.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
