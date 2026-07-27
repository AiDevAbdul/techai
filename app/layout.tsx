import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Fraunces, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navbar from "@/components/brand/Navbar";
import Footer from "@/components/brand/Footer";
import SkipLink from "@/components/brand/SkipLink";
import { Toaster } from "@/components/ui/sonner";

/*
 * Plausible — only emitted when NEXT_PUBLIC_PLAUSIBLE_DOMAIN is set (set in
 * Day 0 once the property exists). Self-hosted endpoint is the default
 * plausible.io script; switch to a CNAME later if we proxy through Vercel.
 */
const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

/*
 * Google Analytics (gtag.js) — only emitted when NEXT_PUBLIC_GA_MEASUREMENT_ID
 * is set. Runs alongside Plausible; Plausible stays the primary
 * privacy-friendly analytics source, GA is supplemental.
 */
const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

/*
 * Fraunces — hero H1 + case-study titles only (spec §5.3).
 * Weights 400/500 only (600 and italic dropped for mobile LCP).
 * Variable font; optical sizing engaged via `font-variation-settings: "opsz" auto`
 * in app/globals.css via the `.serif` utility.
 */
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal"],
  display: "swap",
  preload: true,
});

/*
 * JetBrains Mono — code blocks + Pill chips (spec §5.3).
 * Weights 400/500 only; no italic.
 */
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  preload: false,
});

/*
 * Inline theme bootstrap — runs synchronously before paint to prevent a
 * light/dark flash on hydration. Reads localStorage.theme (set by the
 * footer toggle, see components/brand/ThemeToggle.tsx) and applies the
 * matching data-theme to <html>. Bare-bones, intentionally not minified
 * so it stays auditable.
 */
const themeBootstrap = `(function () {
  try {
    var stored = localStorage.getItem('theme');
    var theme = stored === 'light' || stored === 'dark' ? stored : 'system';
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'system');
  }
})();`;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://abdulwahabai.com";

/*
 * Sitewide Organization JSON-LD — gives every page a baseline entity graph
 * for AI/search crawlers. /about and /services carry more specific
 * Person/Service schema on top of this.
 */
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Abdul Wahab",
  url: siteUrl,
  founder: {
    "@type": "Person",
    name: "Abdul Wahab",
  },
  email: "mailto:aidevabdul@gmail.com",
  description:
    "Audits, builds, and workshops that turn AI from a buzzword into routed, observable workflows.",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Abdul Wahab — AI workflow systems for operators, teams, and communities",
    template: "%s · Abdul Wahab",
  },
  description:
    "Audits, builds, and workshops that turn AI from a buzzword into routed, observable workflows.",
  openGraph: {
    type: "website",
    siteName: "Abdul Wahab",
    locale: "en_US",
    images: [
      {
        url: "/og/default?title=AI%20workflow%20systems%20for%20operators%2C%20teams%2C%20and%20communities",
        width: 1200,
        height: 630,
        alt: "Abdul Wahab — AI workflow systems",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [
      "/og/default?title=AI%20workflow%20systems%20for%20operators%2C%20teams%2C%20and%20communities",
    ],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FBFBFD" },
    { media: "(prefers-color-scheme: dark)", color: "#0B0B0D" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${jetbrainsMono.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="bg-surface text-ink flex min-h-full flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
        {plausibleDomain && (
          <script
            defer
            data-domain={plausibleDomain}
            src="https://plausible.io/js/script.tagged-events.outbound-links.js"
          />
        )}
        {gaMeasurementId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${gaMeasurementId}');`}
            </Script>
          </>
        )}
        <SkipLink />
        <TooltipProvider delay={350}>
          <Navbar />
          {children}
          <Footer />
        </TooltipProvider>
        <Toaster />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
