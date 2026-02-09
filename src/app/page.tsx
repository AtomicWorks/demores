import Image from "next/image";
import Link from "next/link";

import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Navbar } from "@/components/Navbar";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger } from "@/components/motion/Stagger";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { faqItems } from "@/data/faq";
import { siteContact } from "@/data/site";
import { testimonials } from "@/data/testimonials";

const stats = [
  { label: "Single-origin lots", value: "18" },
  { label: "Guest rating", value: "4.9/5" },
  { label: "Pour styles", value: "12" }
];

const products = [
  {
    title: "Aurora Blend",
    subtitle: "Chocolate, hazelnut, dried fig",
    price: "$18",
    image: "/images/product-1.svg"
  },
  {
    title: "Midnight Bloom",
    subtitle: "Plum, cacao nib, cedar",
    price: "$22",
    image: "/images/product-2.svg"
  },
  {
    title: "Drift Reserve",
    subtitle: "Honey, stone fruit, jasmine",
    price: "$24",
    image: "/images/product-3.svg"
  },
  {
    title: "Autumn Roast",
    subtitle: "Toffee, spice, smoke",
    price: "$20",
    image: "/images/product-4.svg"
  },
  {
    title: "Nocturne Decaf",
    subtitle: "Caramel, orange peel",
    price: "$19",
    image: "/images/product-5.svg"
  },
  {
    title: "Solstice Filter",
    subtitle: "Citrus, cane sugar",
    price: "$17",
    image: "/images/product-6.svg"
  }
];

const gallery = [
  {
    title: "Slow Bar Ritual",
    image: "/images/gallery-1.svg"
  },
  {
    title: "Reserve Flight",
    image: "/images/gallery-2.svg"
  },
  {
    title: "Roast Lab",
    image: "/images/gallery-3.svg"
  }
];

export default function HomePage() {
  return (
    <div className="bg-background text-textPrimary">
      <Navbar />
      <main>
        <Hero />

        <Reveal className="bg-surface">
          <section className="section-pad">
            <div className="section-wrap grid gap-6 py-10 sm:grid-cols-3">
              {stats.map((stat) => (
                <div key={stat.label} className="card-surface text-center">
                  <p className="text-3xl font-display tracking-[0.12em]">
                    {stat.value}
                  </p>
                  <p className="mt-3 text-xs uppercase tracking-[0.3em] text-textSecondary">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </Reveal>

        <Reveal className="section-pad">
          <section id="menu" className="section-wrap py-20">
            <SectionHeading
              kicker="Best Sellers"
              title="Curated beans and house blends"
              description="Seasonal roasts, dialed for clarity. Each lot is cupped weekly to keep the profile precise."
            />
            <Stagger className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <article key={product.title} className="card-surface group">
                  <div className="overflow-hidden rounded-2xl border border-line bg-background">
                    <Image
                      src={product.image}
                      alt={product.title}
                      width={420}
                      height={420}
                      className="h-52 w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                    />
                  </div>
                  <div className="mt-5 flex items-center justify-between">
                    <div>
                      <h3 className="font-display text-lg uppercase tracking-[0.14em]">
                        {product.title}
                      </h3>
                      <p className="mt-2 text-xs uppercase tracking-[0.3em] text-textSecondary">
                        {product.subtitle}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-accent">{product.price}</span>
                  </div>
                </article>
              ))}
            </Stagger>
            <div className="mt-10 flex justify-start">
              <Button asChild variant="ghost">
                <Link href="/menu">View Full Menu</Link>
              </Button>
            </div>
          </section>
        </Reveal>

        <Reveal>
          <section className="section-pad">
            <div className="section-wrap grid gap-10 rounded-[36px] border border-line bg-[radial-gradient(circle_at_top,#1f1f23,#121214)] px-8 py-16 text-center">
              <p className="section-kicker">Signature Experience</p>
              <h2 className="font-display text-3xl uppercase tracking-[0.12em] sm:text-4xl">
                Explore the power of simplicity
              </h2>
              <p className="mx-auto max-w-3xl text-sm text-textSecondary">
                A focused bar with precise pressure, temperature, and grind control.
                We highlight origin character while keeping the ritual intimate.
              </p>
              <Button asChild size="lg" className="mx-auto">
                <a href="#about">Book a tasting</a>
              </Button>
            </div>
          </section>
        </Reveal>

        <Reveal className="section-pad">
          <section id="about" className="section-wrap grid gap-12 py-20 lg:grid-cols-2">
            <div className="space-y-6">
              <SectionHeading
                kicker="Our Craft"
                title="Timeless, tactile, and tuned"
                description="We source direct-trade lots and roast in micro batches. Every brew profile is logged, shared, and tasted daily."
              />
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="card-surface">
                  <p className="text-sm uppercase tracking-[0.3em] text-accent">Origin</p>
                  <p className="mt-3 text-sm text-textSecondary">
                    We work with farms in Ethiopia, Colombia, and Panama with traceable harvests.
                  </p>
                </div>
                <div className="card-surface">
                  <p className="text-sm uppercase tracking-[0.3em] text-accent">Technique</p>
                  <p className="mt-3 text-sm text-textSecondary">
                    A slow extraction approach for clarity and depth in every cup.
                  </p>
                </div>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/images/feature-1.svg"
                alt="Slow bar" 
                width={560}
                height={520}
                className="h-full w-full rounded-[32px] border border-line object-cover"
              />
            </div>
          </section>
        </Reveal>

        <Reveal className="section-pad">
          <section className="section-wrap grid gap-12 py-20 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="relative order-2 lg:order-1">
              <Image
                src="/images/feature-2.svg"
                alt="Reserve series" 
                width={560}
                height={520}
                className="h-full w-full rounded-[32px] border border-line object-cover"
              />
            </div>
            <div className="order-1 space-y-6 lg:order-2">
              <SectionHeading
                kicker="Reserve Series"
                title="A more eco-friendly approach"
                description="Our packaging and barware are compostable. We keep our environmental impact low while preserving the craft."
              />
              <Button asChild variant="ghost">
                <a href="#gallery">Learn More</a>
              </Button>
            </div>
          </section>
        </Reveal>

        <Reveal className="section-pad">
          <section id="gallery" className="section-wrap py-20">
            <SectionHeading
              kicker="Gallery"
              title="Sync and control simply"
              description="A premium environment for quiet work, deep conversation, and slow pours."
            />
            <Stagger className="mt-10 grid gap-6 lg:grid-cols-3">
              {gallery.map((item) => (
                <article key={item.title} className="card-surface">
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={360}
                    height={360}
                    className="h-56 w-full rounded-2xl border border-line object-cover"
                  />
                  <h3 className="mt-5 text-sm font-semibold uppercase tracking-[0.3em]">
                    {item.title}
                  </h3>
                </article>
              ))}
            </Stagger>
            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {testimonials.map((item) => (
                <div key={item.name} className="card-surface">
                  <p className="text-sm text-textSecondary">"{item.quote}"</p>
                  <p className="mt-4 text-xs uppercase tracking-[0.3em] text-accent">
                    {item.name} ? {item.role}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </Reveal>

        <Reveal className="section-pad">
          <section className="section-wrap py-20">
            <SectionHeading
              kicker="FAQs"
              title="Frequently asked questions"
              description="Need a quick answer? Here is everything you need to know before you visit."
            />
            <div className="mt-8 grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
              <Accordion type="single" collapsible className="space-y-2">
                {faqItems.map((item) => (
                  <AccordionItem key={item.question} value={item.question}>
                    <AccordionTrigger>{item.question}</AccordionTrigger>
                    <AccordionContent>{item.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              <div className="card-surface grid-lines">
                <p className="text-sm uppercase tracking-[0.3em] text-accent">Visit</p>
                <p className="mt-4 text-sm text-textSecondary">
                  {siteContact.address}
                </p>
                <div className="mt-6">
                  <Button asChild variant="ghost">
                    <a href={siteContact.mapsUrl} target="_blank" rel="noopener noreferrer">
                      Get Directions
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </Reveal>
      </main>
      <Footer />
    </div>
  );
}
