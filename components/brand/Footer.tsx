import Link from "next/link";
import Container from "./Container";
import ThemeToggle from "./ThemeToggle";
import {
  YouTubeIcon,
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  TikTokIcon,
} from "./SocialIcons";

// Build-time constant — Cache Components forbids `new Date()` in server
// trees without a cache directive. Captured at module load (build time);
// roll forward by re-deploying once a year.
const COPYRIGHT_YEAR = new Date().getFullYear();

/*
 * Footer — three-column desktop, stacked mobile (spec §6).
 *
 * Columns:
 *  1. Brand wordmark + short positioning line + copyright
 *  2. Site map (IA per spec §4)
 *  3. Contact + theme toggle + /ur locale stub
 *
 * The /ur link is a v1 stub that goes to a "coming soon" page (spec §0 +
 * plan §2 Day 2 — keeps the link from being a broken 404). Full Urdu UI is
 * v2 scope per spec §1.2.
 *
 * Contact email: aidevabdul@gmail.com
 */

const SITE_MAP = [
  { href: "/work", label: "Work" },
  { href: "/services", label: "Services" },
  { href: "/workshops", label: "Workshops" },
  { href: "/lab", label: "Lab Notes" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

const SOCIAL = [
  { href: "https://www.youtube.com/@AiDevAbdul", label: "YouTube", Icon: YouTubeIcon },
  { href: "https://www.facebook.com/AiDevAbdul", label: "Facebook", Icon: FacebookIcon },
  { href: "https://www.instagram.com/AiDevAbdul", label: "Instagram", Icon: InstagramIcon },
  { href: "https://www.linkedin.com/in/abdulwahab/", label: "LinkedIn", Icon: LinkedInIcon },
  { href: "https://www.tiktok.com/@AiDevAbdul", label: "TikTok", Icon: TikTokIcon },
] as const;

export default function Footer() {
  return (
    <footer className="border-separator border-t mt-30">
      <Container className="py-15">
        <div className="grid gap-12 md:grid-cols-3 md:gap-10">
          {/* Column 1 — brand + line */}
          <div>
            <Link
              href="/"
              className="serif text-ink text-headline -tracking-[0.01em]"
            >
              Abdul Wahab
            </Link>
            <p className="text-ink-secondary text-footnote mt-3 max-w-[26ch] leading-[1.5]">
              AI workflow systems for operators, teams, and communities.
            </p>
          </div>

          {/* Column 2 — site map */}
          <nav aria-label="Footer" className="md:justify-self-center">
            <p className="text-ink-secondary text-eyebrow tracking-[0.06em] uppercase mb-4">
              Site
            </p>
            <ul className="space-y-2.5" role="list">
              {SITE_MAP.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-ink-secondary hover:text-ink text-footnote transition-colors duration-[var(--dur-fast)]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Column 3 — contact + toggle */}
          <div className="md:justify-self-end">
            <p className="text-ink-secondary text-eyebrow tracking-[0.06em] uppercase mb-4">
              Contact
            </p>
            <div className="space-y-2">
              <a
                href="mailto:aidevabdul@gmail.com"
                className="text-ink-secondary hover:text-ink text-footnote block transition-colors duration-[var(--dur-fast)]"
              >
                aidevabdul@gmail.com
              </a>
              <a
                href="https://wa.me/923489848136"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink-secondary hover:text-ink text-footnote block transition-colors duration-[var(--dur-fast)]"
              >
                +92 348 984 8136
              </a>
            </div>
            <ul className="mt-4 flex gap-3" role="list">
              {SOCIAL.map((s) => (
                <li key={s.href}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="text-ink-secondary hover:text-ink transition-colors duration-[var(--dur-fast)] block"
                  >
                    <s.Icon size={18} />
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <ThemeToggle />
            </div>
          </div>
        </div>

        <div className="border-separator mt-15 flex flex-col-reverse items-start justify-between gap-4 border-t pt-6 sm:flex-row sm:items-center">
          <p className="text-ink-secondary text-caption">
            © {COPYRIGHT_YEAR} Abdul Wahab. All rights reserved.
          </p>
          <Link
            href="/ur"
            className="text-ink-secondary hover:text-ink text-caption transition-colors duration-[var(--dur-fast)]"
            aria-label="اردو — coming soon"
          >
            اردو
          </Link>
        </div>
      </Container>
    </footer>
  );
}
