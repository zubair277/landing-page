"use client";

import { motion, type MotionProps } from "framer-motion";
import { type ReactNode } from "react";

export function Reveal({
  children,
  className = "",
  delay = 0,
  ...props
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
} & MotionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: "easeOut", delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

