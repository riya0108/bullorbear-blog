# Bull or Bear Blogs

Independent coverage of AI, Tech, Money, Finance, Politics, and Personal Finance — built with [Astro](https://astro.build), Tailwind CSS v4, and a handful of React islands for the heavier interactions.

## Stack

- **Astro 7** (static output) with **MDX** content collections
- **Tailwind CSS v4** (`@tailwindcss/vite`, CSS-first `@theme` config in `src/styles/global.css`)
- **React + Framer Motion** for exactly two islands: the card pop/highlight interaction (`CardInteractionLayer`) and the animated stat counters (`StatCounters`)
- **Fuse.js** for client-side fuzzy search (`/search/`, backed by `/search-index.json`)
- Everything else — scroll reveal, reading-progress ring, text-to-speech, language switcher, dark mode, share — is plain TypeScript, no framework

## Commands

| Command                | Action                                       |
| :---------------------- | :-------------------------------------------- |
| `npm install`            | Install dependencies                          |
| `astro dev --background` | Start the dev server in the background        |
| `astro dev stop`         | Stop the background dev server                |
| `astro dev status`       | Check whether the dev server is running       |
| `astro dev logs`         | Tail the background dev server's logs         |
| `npm run build`          | Build the production site to `./dist/`        |
| `npm run preview`        | Preview the production build locally          |

## Content

Blog posts live in `src/content/posts/*.mdx`; categories are defined in `src/content/categories.json`. Add a new post by dropping an `.mdx` file with the frontmatter shape defined in `src/content.config.ts`.

## Things to wire up before launch

- **Comments** — copy `.env.example` to `.env`, create a GitHub repo with Discussions enabled, and fill in the `PUBLIC_GISCUS_*` values from [giscus.app](https://giscus.app). Until then, post pages show a "comments aren't connected yet" placeholder.
- **Newsletter form / contact form** — currently client-side only (shows a success state, sends nothing). Wire up to a real email provider or endpoint.
- **Social links** — `src/lib/siteConfig.ts` has placeholder Instagram/YouTube/Facebook/Threads/X handles; replace with the real accounts.
- **Thumbnails** — posts use generated abstract gradient art (`src/components/Thumbnail.astro`) rather than photography. Add a `heroImage` to a post's frontmatter (and wire it into the schema) if you want real images later.
- **Translation** — the language switcher drives the Google Translate widget (free, client-side, no API key). Swap in DeepL/Cloud Translate later for higher quality.
