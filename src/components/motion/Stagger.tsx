"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type StaggerProps = {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  y?: number;
};

export function Stagger({ children, className, stagger = 0.12, y = 18 }: StaggerProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reducedMotion = usePrefersReducedMotion();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: reducedMotion ? 0 : stagger }
    }
  };

  const item = {
    hidden: { opacity: 0, y: reducedMotion ? 0 : y },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={container}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
    >
      {Array.isArray(children)
        ? children.map((child, index) => (
            <motion.div key={index} variants={item}>
              {child}
            </motion.div>
          ))
        : children}
    </motion.div>
  );
}
