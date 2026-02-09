"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

import { Button } from "@/components/ui/button";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export function Hero() {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });
  const reducedMotion = usePrefersReducedMotion();

  const imageScale = useTransform(scrollYProgress, [0, 1], reducedMotion ? [1, 1] : [1, 1.08]);
  const imageOpacity = useTransform(scrollYProgress, [0, 1], reducedMotion ? [1, 1] : [1, 0.5]);
  const textY = useTransform(scrollYProgress, [0, 1], reducedMotion ? [0, 0] : [0, -40]);

  return (
    <section
      id="home"
      ref={ref}
      className="relative overflow-hidden md:h-[calc(100dvh-10px)] md:min-h-[calc(100dvh-10px)]"
    >
      <div className="section-pad h-full">
        <div className="section-wrap grid h-full items-center gap-10 py-20 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.div style={{ y: textY }} className="space-y-6">
            <p className="section-kicker">Specialty Coffee Studio</p>
            <h1 className="font-display text-4xl uppercase tracking-[0.12em] sm:text-5xl lg:text-6xl">
              Redesigned for a broader coffee ritual
            </h1>
            <p className="max-w-xl text-sm leading-relaxed text-textSecondary">
              Atomic Cafe is a slow-bar sanctuary for precision brews, curated
              espresso, and immersive tasting flights. Every pour is tuned for
              balance, clarity, and warmth.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild>
                <a href="/menu">Order Now</a>
              </Button>
              <Button asChild variant="ghost">
                <a href="#contact">Find Us</a>
              </Button>
            </div>
          </motion.div>
          <motion.div
            style={{ scale: imageScale, opacity: imageOpacity }}
            className="relative mx-auto w-full max-w-lg"
          >
            <div className="absolute -left-8 -top-8 h-24 w-24 rounded-full border border-line" />
            <Image
              src="/images/hero.svg"
              alt="Signature espresso machine"
              width={560}
              height={420}
              className="h-auto w-full rounded-[32px] border border-line bg-surface p-4 shadow-glow"
              priority
            />
          </motion.div>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-px bg-line" />
    </section>
  );
}
