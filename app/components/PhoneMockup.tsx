"use client";

import { ImageWithSkeleton } from "@/app/components/ui/ImageWithSkeleton";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export function PhoneMockup() {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["0 1", "1 0"] });
  const y = useTransform(scrollYProgress, [0, 1], [8, -18]);

  return (
    <div ref={ref} className="relative mx-auto w-full max-w-[360px]">
      <div className="relative aspect-square w-full">
        {/* Screen crop inside phone */}
        <motion.div
          style={{ y }}
          className="absolute inset-0"
        >
          <div
            className="absolute overflow-hidden rounded-[18%]"
            style={{
              top: "12.6%",
              left: "23.3%",
              right: "23.3%",
              bottom: "4.9%",
            }}
          >
            <ImageWithSkeleton
              src="/pizza_mockup.png"
              alt="Preview"
              fill
              sizes="360px"
              imgClassName="object-cover object-top"
              priority
            />
          </div>
        </motion.div>

        <ImageWithSkeleton
          src="/iphone.png"
          alt="iPhone frame"
          fill
          sizes="360px"
          imgClassName="drop-shadow-[0_40px_80px_rgba(0,0,0,0.65)]"
          style={{ mixBlendMode: "multiply" }}
          priority
        />
      </div>
    </div>
  );
}

