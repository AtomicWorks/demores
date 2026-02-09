import Image from "next/image";

import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { menuData } from "@/data/menu";

export default function MenuPage() {
  return (
    <div className="bg-background text-textPrimary">
      <Navbar />
      <main className="section-pad">
        <div className="section-wrap">
          <Reveal className="py-16">
            <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
              <div>
                <p className="section-kicker">Menu</p>
                <h1 className="mt-4 font-display text-4xl uppercase tracking-[0.14em] sm:text-5xl">
                  Crafted for slow mornings
                </h1>
                <p className="mt-4 max-w-xl text-sm text-textSecondary">
                  Edit the menu in src/data/menu.ts. Each category keeps the layout consistent across devices.
                </p>
              </div>
              <div className="relative">
                <Image
                  src="/images/feature-2.svg"
                  alt="Menu preview"
                  width={520}
                  height={400}
                  className="h-full w-full rounded-[32px] border border-line object-cover"
                />
              </div>
            </div>
          </Reveal>

          {menuData.map((category) => (
            <Reveal key={category.category} className="py-10">
              <div className="grid gap-6 lg:grid-cols-[0.3fr_0.7fr]">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-accent">
                    {category.category}
                  </p>
                </div>
                <div className="space-y-6">
                  {category.items.map((item) => (
                    <div
                      key={item.name}
                      className="rounded-3xl border border-line bg-soft/70 p-6"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <h3 className="font-display text-lg uppercase tracking-[0.14em]">
                          {item.name}
                        </h3>
                        <span className="text-sm font-semibold text-accent">
                          {item.price}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-textSecondary">
                        {item.description}
                      </p>
                      {item.tags ? (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {item.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full border border-line px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-textSecondary"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
