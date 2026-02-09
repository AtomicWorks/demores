import Link from "next/link";
import { Instagram, Facebook, ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { siteContact } from "@/data/site";

export function Footer() {
  return (
    <footer id="contact" className="border-t border-line bg-surface">
      <div className="section-pad py-16">
        <div className="section-wrap grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="section-kicker">Get in touch</p>
            <h3 className="mt-4 font-display text-3xl uppercase tracking-[0.14em]">
              Atomic Cafe
            </h3>
            <p className="mt-4 text-sm text-textSecondary">
              {siteContact.address}
            </p>
            <p className="mt-2 text-sm text-textSecondary">+1 (213) 555-0117</p>
            <p className="mt-2 text-sm text-textSecondary">hello@atomiccafe.com</p>
            <div className="mt-6 flex items-center gap-4">
              <Link
                href="https://instagram.com"
                aria-label="Instagram"
                className="rounded-full border border-line p-2 text-textSecondary transition hover:text-textPrimary"
              >
                <Instagram className="h-4 w-4" />
              </Link>
              <Link
                href="https://facebook.com"
                aria-label="Facebook"
                className="rounded-full border border-line p-2 text-textSecondary transition hover:text-textPrimary"
              >
                <Facebook className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-textSecondary">Hours</p>
            <ul className="mt-4 space-y-3 text-sm text-textSecondary">
              <li>Mon - Thu: 7:00am - 7:00pm</li>
              <li>Fri: 7:00am - 9:00pm</li>
              <li>Sat: 8:00am - 9:00pm</li>
              <li>Sun: 8:00am - 6:00pm</li>
            </ul>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-textSecondary">Newsletter</p>
            <p className="mt-4 text-sm text-textSecondary">
              Join our roast drops, tasting events, and seasonal releases.
            </p>
            <form className="mt-6 flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                placeholder="Email address"
                aria-label="Email address"
                className="h-11 flex-1 rounded-full border border-line bg-background px-4 text-sm text-textPrimary placeholder:text-textSecondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              />
              <Button type="submit" size="sm" className="h-11">
                Subscribe
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-line pt-6 text-xs uppercase tracking-[0.3em] text-textSecondary sm:flex-row">
          <span>? 2026 Atomic Cafe. All rights reserved.</span>
          <div className="flex gap-6">
            <Link href="/menu" className="transition hover:text-textPrimary">
              Menu
            </Link>
            <Link href="#home" className="transition hover:text-textPrimary">
              Back to top
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
