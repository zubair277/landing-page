"use client";

import { useMemo } from "react";
import { Reveal } from "@/app/components/ui/Reveal";
import { TestimonialCard, type Testimonial } from "@/app/components/testimonials/TestimonialCard";

export function TestimonialSlider({
  title = "What people say about us",
  subtitle = "Quick feedback from real visitors",
}: {
  title?: string;
  subtitle?: string;
}) {
  const testimonials: Testimonial[] = useMemo(
    () => [
      {
        name: "Anika R.",
        text: "Amazing ambience and incredible food — perfect for a night out at Miramar.",
        rating: 5.0,
      },
      {
        name: "Karan D.",
        text: "Loved the cocktails and the vibe. The fusion specials are a standout — definitely coming back.",
        rating: 4.9,
      },
      {
        name: "Priya S.",
        text: "One of the best dining experiences in Goa. Beautiful plating, bold flavors, and top-notch service.",
        rating: 5.0,
      },
      {
        name: "Rohan M.",
        text: "Signature mains were exceptional. The lemon butter fish was cooked perfectly.",
        rating: 4.8,
      },
      {
        name: "Meera K.",
        text: "A premium global dining vibe with music, cocktails, and an atmosphere that feels elevated.",
        rating: 4.9,
      },
      {
        name: "Dev P.",
        text: "The service is warm and attentive. Perfect spot for celebrations and sunset dinners.",
        rating: 4.8,
      },
    ],
    []
  );

  // Duplicate for seamless loop
  const loop = useMemo(() => [...testimonials, ...testimonials], [testimonials]);

  return (
    <section id="testimonials" className="bg-white">
      <div className="mx-auto max-w-6xl px-6 py-14 sm:px-8 sm:py-20">
        <Reveal>
          <div className="text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              {title}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-base text-slate-500 sm:text-lg">
              {subtitle}
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.06} className="mt-10">
          <div className="testimonial-slider relative overflow-hidden">
            {/* Gradient fades */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-white to-transparent sm:w-20"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-white to-transparent sm:w-20"
            />

            {/* STRICT marquee structure: overflow-hidden outer + flex row inner */}
            <div className="py-2">
              <div className="testimonial-track flex w-max gap-6 will-change-transform">
                {loop.map((t, idx) => (
                  <TestimonialCard key={`${t.name}-${idx}`} t={t} />
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

