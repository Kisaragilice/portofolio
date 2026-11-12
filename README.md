# Kisaragilice — Portfolio

An immersive developer portfolio built as a **riced desktop workspace**: floating acrylic panels, ambient wallpaper light, monospace system metadata, and fluid GSAP-driven motion. The dark theme, *Midnight Acrylic*, is the primary art direction; the light theme, *Frosted Day*, is a separate, carefully tuned environment rather than an inversion.

## Stack

| Concern      | Choice                                                |
| ------------ | ----------------------------------------------------- |
| Framework    | Next.js 16 (App Router), React 19                     |
| Language     | TypeScript 5.9 (strict)                               |
| Animation    | GSAP 3 + ScrollTrigger, Lenis smooth scrolling        |
| Styling      | CSS Modules + global design tokens in `globals.css`   |
| Icons        | Lucide React                                          |
| Type         | Space Grotesk, DM Sans, IBM Plex Mono (via `next/font`) |

## Requirements

- Node.js 20.9 or newer
- npm 10 or newer
- Docker Engine with the Compose plugin (only for the container deployment)

## Getting started

```bash
npm install
npm run dev
```

The site is served at <http://localhost:3000>. `npm run dev` first prints every LAN IPv4 address (for example `http://192.168.x.x:3000`) and then binds Next.js to `0.0.0.0`, so a phone on the same Wi-Fi can open that URL. If the phone cannot connect, allow Node.js through the Windows firewall for private networks.

### Scripts

| Command             | Purpose                         |
| ------------------- | ------------------------------- |
| `npm run dev`       | Start the development server    |
| `npm run build`     | Create a production build       |
| `npm run start`     | Serve the production build      |
| `npm run lint`      | Run ESLint                      |
| `npm run typecheck` | Run TypeScript without emitting |

## Design direction

- **Acrylic material system.** Panels use translucent gradients, `backdrop-filter`, soft borders, inset highlights, and layered shadows. Content surfaces are kept opaque enough for readable text; transparency is reserved for the material, not the information.
- **Floating waybar navigation.** A detached rounded bar with an active-section pill, local clock, theme switch, and a mobile command-sheet menu.
- **Hero as a desktop.** A compact `~/kisaragilice — profile` window, side widgets for current focus and toolkit, a GitHub card, and a small workspace dock. The name is intentionally compact rather than a full-screen type poster.
- **Section language.** About uses profile/interests windows, Toolkit is a package grid, Projects is a featured project window followed by a clean two-up case-study grid, Now is an activity monitor, and Contact is a terminal-like channel panel.
- **Two art-directed themes.** Midnight Acrylic uses charcoal/blue-gray surfaces with muted blue and teal accents. Frosted Day uses muted gray, ivory, translucent white, and warm earthy washes. The theme toggle runs a slow GSAP light-leak veil over a 1600 ms crossfade; only the elements that own a surface, text colour, border, or shadow participate in the interpolation.
- **Acrylic interaction layer.** Header, primary/secondary buttons, chips, labels, dock, menu controls, tags, and metadata strips use translucent gradients with backdrop blur. Content surfaces stay legible; the glass is the material, not a replacement for contrast.
- **Arch Linux mark.** The header and footer render the Arch Linux logo as a monochrome mask, and the favicon uses the same mark on an Arch-blue tile.

## Editing content

All copy and data live in a single typed file: [`src/lib/portfolio.ts`](src/lib/portfolio.ts). Components read from it; they do not hard-code owner details.

- `owner` — display name, role, headline, bios, availability, location, résumé.
- `links` — GitHub, email, LinkedIn, website. GitHub and email are live; LinkedIn and website are `null`.
- `nav` — section order and labels.
- `interests`, `currentlyLearning`, `toolkit` — About, Hero, and Toolkit content.
- `projects` — an array of case-study entries. The current entries contain real project data; set `placeholder: false` to change the card label from “placeholder” to “case study”. Art variants live in `ProjectArt` (`orbit`, `grid`, `signal`).
- `sections` — headings, intros, and footer copy.
- `socialLinks` — contact channels (GitHub, Discord, Facebook) rendered in Contact.

Fields typed as `string | null` are hidden from the UI while `null`. Replace them with real values and they appear automatically.

### Placeholder inventory

Update or remove these before publishing:

1. **Display name** — `owner.displayName` is the supplied handle `Kisaragilice`; `owner.displayNameLines` is retained for split-text usage.
2. **Project flags** — `projects[0..2]` contain real content but still have `placeholder: true`, so their cards are labeled “placeholder”. Set the flag to `false` once each entry is final.
3. **Optional links** — `links.linkedin` and `links.website` are `null`.
4. **Location & availability** — `owner.location` and `owner.availability` are `null`.
5. **Profile image & résumé** — `owner.profileImage` and `owner.resumeUrl` are `null`.

## Project structure

```text
public/
  assets/
    icon.svg           Arch Linux favicon / app icon
    logo-mark.svg      monochrome Arch Linux mark used by the header and footer
scripts/
  dev-network.mjs      prints phone-friendly LAN URLs before `next dev` starts
src/
  app/
    globals.css        design tokens, acrylic system, base styles, Lenis, theme transition
    layout.tsx         fonts, metadata, theme-init script, providers, ambient layer, chrome
    page.tsx           section composition
  components/
    layout/            AmbientBackground, Header + mobile menu, ThemeToggle, ScrollProgress, Footer
    providers/         ThemeProvider, SmoothScrollProvider (Lenis + ScrollTrigger)
    ui/                SplitText, Reveal, RevealHeading, ScrollText, Parallax, ProjectArt, SectionLabel
  lib/
    portfolio.ts       single source of truth for content
    gsap.ts            GSAP registration and shared defaults
    motion.ts          motion helpers (reduced motion, hover capability)
  sections/            Hero, About, Toolkit, Projects, Now, Contact
Dockerfile             multi-stage production image using Next.js standalone output
docker-compose.yml     production service, port mapping, and health check
.dockerignore          keeps build context small
```

## Theming

- Tokens live on `:root` (Frosted Day) and `:root[data-theme="dark"]` (Midnight Acrylic) in `src/app/globals.css`.
- Theme is stored in `localStorage` under `kisaragilice-theme`.
- An inline head script applies the stored theme or system preference before first paint, preventing a flash and avoiding provider remounts.
- `ThemeProvider` reads the document's `data-theme` via `useSyncExternalStore`, so the DOM remains the source of truth.
- Toggling runs a slow GSAP light-leak veil (about 2.6 s total) over a 1600 ms token crossfade, so surfaces, type, borders, and shadows crossfade instead of switching. The transition is interruptible: another click kills and replaces the running timeline, continues from the veil's current frame, and flips the pending target so rapid toggles always land on the right theme. With `prefers-reduced-motion: reduce`, switching is instant.
- System dark preference is respected on first visit; an explicit user choice takes precedence afterwards.

## Motion architecture

- `AmbientBackground` drifts ambient light fields and shifts the masked grid on desktop. Phones get the painted wallpaper gradients only: no aurora, noise, or grid layers are composited behind the page.
- `SmoothScrollProvider` owns one Lenis instance on desktop, drives it from the GSAP ticker, and updates ScrollTrigger on scroll. It uses `lerp: 0.09` and `wheelMultiplier: 0.96` so wheel bursts stay responsive without a long tail.
- Phones skip Lenis completely and use native scrolling. This removes a per-frame rAF loop, gives the platform's own touch momentum, and leaves only the native scroll thread active.
- Anchor navigation is intercepted so hash links scroll through Lenis on desktop with a 1.85 s eased glide, and use the browser's native smooth scroll on phones while updating the URL. `html { scroll-padding-top }` accounts for the floating header.
- Hero panels enter on a slower staged timeline with split-character name units and gentle looping float on the side windows. Both the float and hero scroll parallax are desktop-only; mobile keeps the staged entrance.
- About, Toolkit, Now, and Contact use a shared `Parallax` component for a quiet scrub-linked depth shift on desktop. Scroll-linked effects use low scrub values so they track the wheel immediately instead of trailing behind it.
- Section labels and the About heading now reveal like the other headings; the footer panel enters on its own reveal. Desktop panels also get a restrained pointer-driven 3D tilt.
- Projects reveal with GSAP ScrollTrigger, use scrub-linked art parallax on desktop, and a pointer tilt on desktop cards. The orbit, grid, and signal artwork loops use transform/opacity-only animation and pause while a card is outside the viewport.
- Mobile gets one-shot entrances, menu-item entrances, and the slow theme transition, but no scroll-scrubbed transforms, ambient loops, hero float, or word-by-word scrub. Reveals there use one-shot `IntersectionObserver` callbacks instead of ScrollTriggers.
- Mobile optimization is deliberate: native scrolling, no Lenis, nested backdrop blur disabled below 900 px (header included), full-screen ambient layers removed, project-art blur dropped, theme veil hidden when idle, and an opacity-only theme veil. Colour transitions are limited to text near the viewport, refreshed by an `IntersectionObserver` with one screen of scroll headroom. The small hero, Now, and project-art loops remain enabled but pause offscreen.
- All effects clean up timelines, ScrollTriggers, observers, ticker callbacks, and listeners; setup is StrictMode-safe.
- With `prefers-reduced-motion: reduce`: Lenis is not created, ambient drift, reveals, waves, parallax, and project-art loops are disabled, and all content remains visible.

## Accessibility

- Semantic landmarks, a skip link, labeled controls, visible focus styles, and window chrome marked `aria-hidden`.
- Mobile menu is a dialog with focus management, `inert` background, Escape handling, and body scroll lock.
- Theme toggle exposes an accessible name and state.
- Color tokens are tuned for WCAG AA contrast in both themes; the site passes axe (WCAG 2.0/2.1 A and AA) in both themes with zero violations.
- Motion is always optional.

## Deployment

### Docker Compose

`Dockerfile` builds Next.js with `BUILD_STANDALONE=1`, producing a minimal standalone output, then runs it as a non-root user on port `3000`. Compose publishes it on `APP_PORT` and includes a health check.

Set `NEXT_PUBLIC_SITE_URL` to the final public URL before building. Next.js bakes it into metadata and Open Graph tags, so rebuild after changing it. You can pass it inline or put it in a `.env` file next to `docker-compose.yml`:

```dotenv
NEXT_PUBLIC_SITE_URL=https://portfolio.example.com
APP_PORT=3000
```

```bash
docker compose up -d --build
docker compose logs -f web
```

Open `http://server-ip:3000` or the port set in `APP_PORT`. Stop the service with:

```bash
docker compose down
```

To deploy an update:

```bash
git pull
docker compose up -d --build
```

or

```bash
docker compose up -d --force-recreate
```

The build downloads the `next/font` files, so the Docker build needs network access. If the site sits behind a reverse proxy, point it at the host port from `APP_PORT`, not at the container directly.

### Vercel

Import the repository and deploy with `npm run build`. Set `NEXT_PUBLIC_SITE_URL` to the production URL so canonical and Open Graph metadata are correct.

### Any Node host

```bash
npm ci
NEXT_PUBLIC_SITE_URL=https://portfolio.example.com npm run build
npm run start
```

The production server listens on port 3000 by default (`npm run start -- -p 8080` to change it). `NEXT_PUBLIC_SITE_URL` is read during the build.

### Static hosting

The app uses no server actions, route handlers, or dynamic data, so it can be exported. Set the output in `next.config.ts` (replacing the conditional Docker standalone option):

```ts
const nextConfig: NextConfig = {
  output: "export",
  // ...
};
```

Run `npm run build`; the static site is written to `out/`. `next/font` downloads fonts at build time, so the build machine needs network access.

## Quality checks

```bash
npm run lint
npm run typecheck
npm run build
```

All three pass on the current tree.
