"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Container from "./Container";
import { cn } from "@/lib/utils";

/*
 * Navbar — sticky chrome on every page.
 *
 * Two visual states (spec §5.6):
 *   - Idle: transparent, no border, no blur
 *   - Scrolled (>12 px from top): material-thick background + backdrop-blur
 *     + hairline border-bottom
 *
 * The transition is opacity/background only — position stays `sticky top-0`
 * the whole time. No layout shift.
 *
 * Mobile: shadcn Sheet menu, full-height side drawer. Desktop: inline nav.
 *
 * "Book a call" is the only accent surface in the navbar — every page in v1
 * funnels here (spec §0 North Star).
 */

const NAV_ITEMS = [
  { href: "/work", label: "Work" },
  { href: "/services", label: "Services" },
  { href: "/workshops", label: "Workshops" },
  { href: "/sessions", label: "Sessions" },
  { href: "/lab", label: "Lab" },
  { href: "/about", label: "About" },
] as const;

function useScrolled(threshold = 12): boolean {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > threshold);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [threshold]);
  return scrolled;
}

/* True when the current pathname starts with the link's href (so /work and
 * /work/meetplanner both light up the Work tab). */
function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Navbar() {
  const pathname = usePathname();
  const scrolled = useScrolled();
  const [open, setOpen] = useState(false);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-[background-color,backdrop-filter,border-color] duration-[var(--dur-med)]",
        scrolled
          ? "border-separator border-b bg-[var(--material-thick)] backdrop-saturate-150 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <Container as="nav" aria-label="Primary" className="flex items-center justify-between py-3">
        <Link href="/" aria-label="Abdul Wahab — Home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="Abdul." width={116} height={28} className="dark:hidden" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-white.svg" alt="Abdul." width={116} height={28} className="hidden dark:block brightness-110" />
        </Link>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-8 md:flex" role="list">
          {NAV_ITEMS.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "text-footnote font-medium transition-colors duration-[var(--dur-fast)]",
                    active ? "text-ink" : "text-ink-secondary hover:text-ink",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Desktop CTA */}
        <Link
          href="/contact"
          className="bg-accent text-primary-foreground hover:bg-accent-hover plausible-event-name=cta_book_call hidden rounded-pill px-4 py-2 text-footnote font-medium transition-colors duration-[var(--dur-fast)] md:inline-flex"
        >
          Book a call
        </Link>

        {/* Mobile menu trigger */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            aria-label="Open menu"
            className="text-ink hover:bg-surface-secondary inline-flex h-10 w-10 items-center justify-center rounded-md transition-colors md:hidden"
          >
            <Menu size={20} strokeWidth={1.75} aria-hidden />
          </SheetTrigger>
          <SheetContent side="right" className="bg-surface-elevated w-full max-w-sm">
            <SheetHeader>
              <SheetTitle className="serif text-title3">Menu</SheetTitle>
            </SheetHeader>
            <ul className="mt-8 flex flex-col gap-2 px-6" role="list">
              {NAV_ITEMS.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <li key={item.href}>
                    <SheetClose
                      render={
                        <Link
                          href={item.href}
                          aria-current={active ? "page" : undefined}
                          className={cn(
                            "block rounded-md px-3 py-3 text-title3",
                            active
                              ? "text-ink bg-surface-secondary"
                              : "text-ink-secondary hover:text-ink",
                          )}
                        >
                          {item.label}
                        </Link>
                      }
                    />
                  </li>
                );
              })}
            </ul>
            <div className="mt-6 px-6">
              <SheetClose
                render={
                  <Link
                    href="/contact"
                    className="bg-accent text-primary-foreground hover:bg-accent-hover plausible-event-name=cta_book_call inline-flex w-full items-center justify-center rounded-pill px-4 py-3 text-callout font-medium"
                  >
                    Book a call
                  </Link>
                }
              />
            </div>
          </SheetContent>
        </Sheet>
      </Container>
    </header>
  );
}
