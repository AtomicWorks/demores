import Link from "next/link";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Menu", href: "#menu" },
  { label: "About", href: "#about" },
  { label: "Gallery", href: "#gallery" },
  { label: "Contact", href: "#contact" }
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-background/85 backdrop-blur">
      <div className="section-pad">
        <div className="section-wrap flex h-16 items-center justify-between">
          <Link href="/" className="text-sm font-semibold uppercase tracking-[0.4em]">
            Atomic Cafe
          </Link>
          <nav className="hidden items-center gap-8 text-xs uppercase tracking-[0.2em] text-textSecondary md:flex">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="transition hover:text-textPrimary">
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Button asChild size="sm" className="hidden md:inline-flex">
              <Link href="/menu">Order</Link>
            </Button>
            <button
              type="button"
              aria-label="Open menu"
              className="inline-flex items-center justify-center rounded-full border border-line p-2 text-textSecondary transition hover:text-textPrimary md:hidden"
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
