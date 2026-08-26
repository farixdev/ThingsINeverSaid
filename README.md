<div align="center">

# Things I Never Said

**An anonymous wall for the words people never had the courage to say.**

No accounts. No likes. No replies. No feed.
Write one sentence, let it go, and drag through everybody else's.

[Next.js 16](https://nextjs.org) · [React 19](https://react.dev) · [Neon Postgres](https://neon.tech) · [Tailwind CSS 4](https://tailwindcss.com)

</div>

---

## The idea

Most of what people feel never gets said, because saying it costs something.
This is a place to put the sentence down anyway.

There is deliberately nothing here to chase — no follower count, no reply box,
no way to know whether anybody read it. Every feature that would have made this
addictive was left out on purpose.

## The wall

`/read` is not a scrolling list. It is an **infinite plane of paper** you drag
through in any direction.

- **Drag anywhere** to move. Let go and it carries, then settles.
- **Scroll or trackpad-swipe** to pan; **arrow keys** work too.
- **`/`** to search. Everything that doesn't match dims away, the wall flies to
  the first match on its own, and `‹` `›` (or `Enter`) step through the rest.
- There is **no zoom**. The scale is derived from the viewport once and left
  alone, which keeps the type crisp and the whole plane on the compositor.
- Leave it alone for a few seconds and it **drifts by itself**, like weather.
- Everything **fades with distance** — near the edges of your attention, paper
  dissolves back into the page.

Under it: one `requestAnimationFrame` loop that writes three transforms a frame,
per-note culling that only re-renders when the camera has actually travelled,
three parallax depth bands, and a deterministic scatter seeded from the note ids
so the layout is identical on the server and in every browser.

Nothing about it is a library. It's `src/lib/wall-layout.js` and
`src/components/wall/wall.js`.

## Running it

```bash
npm install
```

Copy `.env.example` to `.env.local` and fill it in:

```
DATABASE_URL="postgresql://user:password@ep-xxxx-pooler.region.aws.neon.tech/neondb?sslmode=require"
IP_SALT="any-long-random-string"
ADMIN_USER="admin"
ADMIN_PASSWORD="something-long"
```

Then:

```bash
npm run dev
```

The `confessions` table is created on first use — there is no migration step.
To start with something on the wall instead of an empty room:

```bash
npm run seed
```

`npm run seed:clear` removes only the seeded rows and never touches anything a
real person wrote.

## Moderation

Nothing appears on the wall on its own. A new confession is stored as
`pending`, and the writer is told it will go up once somebody has read it.

**`/admin`** is the desk. Sign in with `ADMIN_USER` / `ADMIN_PASSWORD` and you
get two lists — **Waiting** and **On the wall** — with the full text of each
note and three actions: put it on the wall, take it back down, or delete it for
good (behind a confirm). Every change invalidates the wall cache immediately,
so approving a note puts it up on the next page load.

The session is a signed, http-only cookie that lasts 12 hours. It carries no
privileges of its own: every action re-checks the session server-side before
touching a row. Changing `ADMIN_PASSWORD` invalidates every existing session.

## Deploying

Import the repo on [Vercel](https://vercel.com), add `DATABASE_URL`, `IP_SALT`,
`ADMIN_USER` and `ADMIN_PASSWORD` as environment variables, and deploy. There is no other service and no
separate backend — the whole app is one Next.js project.

Optionally set `NEXT_PUBLIC_SITE_URL` to your final domain (`https://example.com`)
so canonical URLs, the sitemap and social cards point at the right place. On
Vercel it is genuinely optional — the deployment domain is picked up on its own —
and anything that isn't a real URL is ignored with a warning rather than failing
the build.

## How it's built

| | |
|---|---|
| **Pages** | `/` home, `/read` the wall, `/write` compose, `/about` the only page that scrolls, `/admin` the moderation desk |
| **Data** | One `confessions` table on Neon, reached over HTTP with `@neondatabase/serverless` |
| **Reads** | Server Components + `unstable_cache`, tagged `wall`, revalidated every 5 minutes |
| **Writes** | A React Server Action — no client-side API layer, no fetch, no loading spinner |
| **Moderation** | Confessions land as `pending` and only reach the wall once approved at `/admin` |
| **Admin auth** | A single account from the environment, held in an HMAC-signed http-only cookie; no user table, no dependency |
| **Invalidation** | `revalidateTag("wall")` on every new confession, so the wall is rebuilt exactly when it changes and never otherwise |
| **Public API** | `GET /api/confessions?limit=&offset=&search=` with `stale-while-revalidate` |
| **Abuse** | A honeypot field, length limits, and a rate limit keyed on a salted one-way hash of the writer's IP |
| **Type** | Instrument Serif, Geist, Caveat — self-hosted through `next/font` |
| **Art** | Grain, glow, icons and the pressed flowers are generated SVG or optimised through `next/image`; the hand-lettered pieces are original artwork |

### Privacy

Confessions are stored with no account, no email and no readable IP. The only
thing kept alongside a note is `sha256(IP_SALT + ip)`, which exists solely so
one person can't flood the wall, and which cannot be turned back into an address.

## Project layout

```
src/
├── app/
│   ├── page.js            home — one screen, no scroll
│   ├── read/page.js       the wall
│   ├── write/page.js      compose
│   ├── about/page.js      the one page that scrolls
│   ├── admin/             the moderation desk
│   ├── api/confessions/   public read API
│   └── *.css              design tokens, wall, forms
├── components/
│   ├── wall/              wall engine, pinned pieces, reader
│   ├── marks.js           every icon, drawn here as SVG
│   ├── atmosphere.js      film grain + slow lights
│   └── compose.js         the writing sheet
└── lib/
    ├── db.js              Neon client + schema bootstrap
    ├── confessions.js     cached queries
    ├── actions.js         the server action that writes
    ├── auth.js            the signed admin session
    ├── admin-actions.js   approve, take down, delete
    └── wall-layout.js     the scatter, tiling and culling maths
```

---

<div align="center">

Made by **[Faris Tahoor](https://github.com/farixdev)**

*Some things are too heavy to keep inside forever.*

</div>
