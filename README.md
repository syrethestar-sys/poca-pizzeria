# Poca Pizzeria — website

Wood-fired sourdough pizza, Ulaanbaatar. Bilingual (EN / МН) menu, ordering and a
staff admin panel.

Next.js 16 (App Router, JavaScript) + Tailwind v4. Talks to the API in
[poca-pizzeria-server](https://github.com/syrethestar-sys/poca-pizzeria-server).

**Live:** _add the Vercel URL here once deployed_
**Deploying:** see [DEPLOY.md](./DEPLOY.md)

## Run it

```bash
npm install
cp .env.example .env.local     # point NEXT_PUBLIC_API_URL at poca-server
npm run dev                    # http://localhost:3000
```

Start `poca-server` first, or the menu pages render their empty state.

## Routes

| Route | What it is |
|---|---|
| `/` | Hero, four facts, three signature pizzas, the craft block |
| `/menu` | The full menu — Food / Drinks tabs, legend, item dialog |
| `/story` | Sourdough, wood fire, honest ingredients + photo slots |
| `/visit` | Address, hours, phone, and the wayfinding schematic |
| `/checkout` | Delivery or pickup, order summary, places the order |
| `/orders` | A signed-in customer's own orders and their status |
| `/login`, `/signup` | react-hook-form + zod |
| `/admin/menu` | Item CRUD, availability toggle, categories — admin only |
| `/admin/orders` | The kitchen queue, refreshes every 30s — admin only |

`/` and `/menu` are `force-dynamic`: the kitchen toggles items during service and
a baked-at-build menu would go stale.

## Both languages

Every menu string is `{ en, mn }` in the database. `LanguageProvider` holds the
choice (persisted to localStorage), `lib/i18n.js` carries the interface copy, and
`pick()` in `lib/format.js` falls back to English when a Mongolian string is
empty — so a half-translated menu still renders.

**The Mongolian copy needs an owner proofread.** It was translated for the site,
not taken from the printed menu.

## Brand

`globals.css` holds the Edition 01 tokens — Forno Yellow, Sugo Red, Carbone,
Semola, Ember, Cenere — as `--forno`, `--sugo` and so on, exposed to Tailwind as
`bg-forno`, `text-sugo`, `border-border`. Type is Prata (display) / IBM Plex Sans
(body) / IBM Plex Mono (prices, labels), all loaded with Cyrillic subsets.

Prata is a **stand-in** for the wordmark's real typeface — swap it in
`src/app/layout.js` when the owner provides the licensed face.

## Still to do

- The oven on the home page and the two photo slots on `/story` are drawn and
  marked placeholders. Replace them with the real photo library.
- `Logo.js` sets the wordmark in type. Swap it for the vector wordmark when the
  SVG exists.
- Admin routes are guarded in the browser only — the API has no auth on its write
  routes yet. Do not deploy the admin publicly until that is fixed.
- Cloudinary upload needs `NEXT_PUBLIC_CLOUDINARY_*` set, same as the reference
  project.
