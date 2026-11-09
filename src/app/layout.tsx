import type { Metadata, Viewport } from "next";
import { DM_Sans, IBM_Plex_Mono, Space_Grotesk } from "next/font/google";
import { portfolio } from "@/lib/portfolio";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { AmbientBackground } from "@/components/layout/AmbientBackground";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const displayFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const bodyFont = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const monoFont = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://kisaragilice.example.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Kisaragilice — Informatics Student & Developer",
    template: "%s — Kisaragilice",
  },
  description: portfolio.owner.shortBio,
  applicationName: "Kisaragilice Portfolio",
  authors: [{ name: portfolio.owner.displayName }],
  creator: portfolio.owner.displayName,
  keywords: [
    "Kisaragilice",
    "Informatics student",
    "developer portfolio",
    "software development",
    "Linux",
    "Arch Linux",
    "open source",
    "self-hosting",
    "local AI",
  ],
  openGraph: {
    type: "website",
    title: "Kisaragilice — Informatics Student & Developer",
    description: portfolio.owner.headline,
    siteName: "Kisaragilice",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kisaragilice — Informatics Student & Developer",
    description: portfolio.owner.headline,
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [{ url: "/assets/icon.svg", type: "image/svg+xml" }],
    shortcut: "/assets/icon.svg",
    apple: "/assets/icon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#E7E9EC" },
    { media: "(prefers-color-scheme: dark)", color: "#070A0F" },
  ],
};

const themeInitScript = `(function(){try{var key="kisaragilice-theme";var stored=localStorage.getItem(key);var theme=stored==="light"||stored==="dark"?stored:(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");var root=document.documentElement;root.dataset.theme=theme;root.style.colorScheme=theme;}catch(error){}})();`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={[
        displayFont.variable,
        bodyFont.variable,
        monoFont.variable,
      ].join(" ")}
    >
      <head>
        <script
          id="theme-init"
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
        />
      </head>
      <body>
        <ThemeProvider>
          <SmoothScrollProvider>
            <AmbientBackground />
            <a href="#main" className="skip-link">
              Skip to content
            </a>
            <Header />
            <main id="main">{children}</main>
            <Footer />
          </SmoothScrollProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
