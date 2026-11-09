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
- **Two art-directed themes.** Midnight Acrylic uses charcoal/blue-gray surfaces with muted blue and teal accents. Frosted Day uses muted gray, ivory, translucent white, and warm earthy washes. The theme toggle runs a slow GSAP light-leak veil over a 1600 ms token interpolation across the whole environment.
- **Acrylic interaction layer.** Header, primary/secondary buttons, chips, labels, dock, menu controls, tags, and metadata strips use translucent gradients with backdrop blur. Content surfaces stay legible; the glass is the material, not a replacement for contrast.

## Editing content

All copy and data live in a single typed file: [`src/lib/portfolio.ts`](src/lib/portfolio.ts). Components read from it; they do not hard-code owner details.

- `owner` — display name, role, headline, bios, availability, location, résumé.
- `links` — GitHub, email, LinkedIn, website. Only GitHub is currently supplied.
- `nav` — section order and labels.
- `interests`, `currentlyLearning`, `toolkit` — About, Hero, and Toolkit content.
- `projects` — an array of case-study entries. The current entries are **explicit placeholders**, not claimed work. Each card has a repository button; set `repositoryUrl` to the real repository and the disabled “Repository link pending” state becomes a live link automatically.
- `sections` — headings, intros, and footer copy.
- `socialLinks` — derived from `links` and rendered in Contact.

Fields typed as `string | null` are hidden from the UI while `null`. Replace them with real values and they appear automatically. No personal facts, projects, metrics, or availability claims have been invented.

### Placeholder inventory

Update or remove these before publishing:

1. **Display name** — `owner.displayName` is the supplied handle `Kisaragilice`; `owner.displayNameLines` is retained for split-text usage.
2. **Projects** — `projects[0..2]` are reserved slots. Replace name, category, description, stack, status, year, links, and set `placeholder: false`. Art variants live in `ProjectArt` (`orbit`, `grid`, `signal`).
3. **Contact links** — `links.email`, `links.linkedin`, and `links.website` are `null`.
4. **Location & availability** — `owner.location` and `owner.availability` are `null`.
5. **Profile image & résumé** — `owner.profileImage` and `owner.resumeUrl` are `null`.

## Project structure

```text
public/
  assets/
    icon.svg           favicon / app icon
    logo-mark.svg      monochrome K mark used by the header and footer
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
```

## Theming

- Tokens live on `:root` (Frosted Day) and `:root[data-theme="dark"]` (Midnight Acrylic) in `src/app/globals.css`.
- Theme is stored in `localStorage` under `kisaragilice-theme`.
- An inline head script applies the stored theme or system preference before first paint, preventing a flash and avoiding provider remounts.
- `ThemeProvider` reads the document's `data-theme` via `useSyncExternalStore`, so the DOM remains the source of truth.
- Toggling runs a slow GSAP light-leak veil (about 2.6 s total) over a 1600 ms token interpolation, so surfaces, type, borders, and accents crossfade instead of switching. With `prefers-reduced-motion: reduce`, switching is instant.
- System dark preference is respected on first visit; an explicit user choice takes precedence afterwards.

## Motion architecture

- `AmbientBackground` drifts blurred light fields and shifts the masked grid on desktop. Phones get the painted wall gradients only: no aurora, noise, or grid layers are composited behind the page.
- `SmoothScrollProvider` owns one Lenis instance on desktop, drives it from the GSAP ticker, and updates ScrollTrigger on scroll. It uses a low `lerp` (0.07) for a long, weighty wheel glide.
- Phones skip Lenis completely and use native scrolling. This removes a per-frame rAF loop, gives the platform's own touch momentum, and leaves only the native scroll thread active.
- Anchor navigation is intercepted so hash links scroll through Lenis on desktop with a 1.85 s eased glide, and use the browser's native smooth scroll on phones while updating the URL. `html { scroll-padding-top }` accounts for the floating header.
- Hero panels enter on a slower staged timeline with split-character name units and gentle looping float on the side windows. Both the float and hero scroll parallax are desktop-only; mobile keeps the staged entrance.
- About, Toolkit, Now, and Contact use a shared `Parallax` component for a quiet scrub-linked depth shift on desktop. Scroll-linked effects use low scrub values so they track the wheel immediately instead of trailing behind it.
- Section labels and the About heading now reveal like the other headings; the footer panel enters on its own reveal. Desktop panels also get a restrained pointer-driven 3D tilt.
- Projects reveal with GSAP ScrollTrigger, use scrub-linked art parallax on desktop, and a pointer tilt on desktop cards.
- Mobile gets one-shot entrances, menu-item entrances, and the slow theme transition, but no scroll-scrubbed transforms, ambient loops, hero float, or word-by-word scrub. Reveals there use one-shot `IntersectionObserver` callbacks instead of ScrollTriggers.
- Mobile optimization is deliberate: native scrolling, no Lenis, nested backdrop blur disabled below 900 px (header included), full-screen ambient layers removed, project-art blur dropped, theme veil hidden when idle, no idle CSS animations, and an opacity-only theme veil.
- All effects clean up timelines, ScrollTriggers, observers, ticker callbacks, and listeners; setup is StrictMode-safe.
- With `prefers-reduced-motion: reduce`: Lenis is not created, ambient drift, reveals, waves, and parallax are disabled, and all content remains visible.

## Accessibility

- Semantic landmarks, a skip link, labeled controls, visible focus styles, and window chrome marked `aria-hidden`.
- Mobile menu is a dialog with focus management, `inert` background, Escape handling, and body scroll lock.
- Theme toggle exposes an accessible name and state.
- Color tokens are tuned for WCAG AA contrast in both themes; the site passes axe (WCAG 2.0/2.1 A and AA) in both themes with zero violations.
- Motion is always optional.

## Deployment

### Vercel

Import the repository and deploy — no environment variables are required. Use `npm run build`.

### Any Node host

```bash
npm ci
npm run build
npm run start
```

The production server listens on port 3000 by default (`npm run start -- -p 8080` to change it).

### Static hosting

The app uses no server actions, route handlers, or dynamic data, so it can be exported. Add the following to `next.config.ts`:

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
