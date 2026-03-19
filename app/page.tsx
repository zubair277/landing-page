"use client";

import { useMemo, useState } from "react";
import { BRAND, COUPON, whatsappLink } from "@/app/lib/constants";
import { CouponModal } from "@/app/components/CouponModal";
import { StickyCtaBar } from "@/app/components/StickyCtaBar";
import { Card } from "@/app/components/ui/Card";
import {
  ExternalButtonLink,
  Button,
  ButtonLink,
} from "@/app/components/ui/Button";
import { Reveal } from "@/app/components/ui/Reveal";
import { Section } from "@/app/components/ui/Section";
import { ImageWithSkeleton } from "@/app/components/ui/ImageWithSkeleton";
import { MenuSection } from "@/app/components/menu/MenuSection";
import { TestimonialSlider } from "@/app/components/testimonials/TestimonialSlider";

type Dish = {
  name: string;
  desc: string;
  image: string;
};

export default function Home() {
  const [couponOpen, setCouponOpen] = useState(false);

  const dishes: Dish[] = useMemo(
    () => [
      {
        name: "Truffle Mushroom Risotto",
        desc: "Creamy arborio, wild mushrooms, truffle oil, parmesan finish.",
        image: "/images/truffle-mushroom-arancini.jpg",
      },
      {
        name: "Peri Peri Chicken Skewers",
        desc: "Char-grilled skewers, peri peri glaze, herb dip, pickled onions.",
        image: "/images/peri-peri-chicken-skewers.jpg",
      },
      {
        name: "Paneer Steak with Herb Sauce",
        desc: "Seared paneer steak, herb jus, roasted vegetables, citrus microgreens.",
        image: "/images/paneer-steak-herb-sauce.jpg",
      },
      {
        name: "Grilled Fish with Lemon Butter",
        desc: "Fresh catch, lemon butter glaze, charred greens, caper notes.",
        image: "/images/grilled-fish-lemon-butter.jpg",
      },
      {
        name: "Passionfruit Martini",
        desc: "Silky, bright, and balanced — signature Miri cocktail.",
        image: "/images/passionfruit-martini.jpg",
      },
      {
        name: "Classic Mojito",
        desc: "Fresh mint, lime, sparkling soda — clean and crisp.",
        image: "/images/classic-mojito.jpg",
      },
    ],
    []
  );

  // Testimonials are now handled by `TestimonialSlider` (infinite marquee).

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <CouponModal open={couponOpen} onClose={() => setCouponOpen(false)} />
      <StickyCtaBar onCoupon={() => setCouponOpen(true)} />

      {/* Navbar */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 sm:px-8">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white">
              🍕
            </span>
            <div className="leading-tight">
              <p
                className="text-sm font-black tracking-tight text-slate-900"
                style={{ fontFamily: "var(--font-dm-serif)" }}
              >
                {BRAND.name}
              </p>
              <p className="text-xs text-slate-600">{BRAND.tagline}</p>
            </div>
          </div>

          <nav className="flex items-center gap-2">
            <ButtonLink href="#location" variant="ghost">
              Location
            </ButtonLink>
            <ExternalButtonLink href={whatsappLink()} variant="secondary">
              Contact
            </ExternalButtonLink>
          </nav>
        </div>
      </header>

      <main>
        {/* 1) HERO */}
        <section className="bg-slate-50">
          <div className="mx-auto max-w-6xl px-6 py-12 sm:px-8 sm:py-16">
            <div className="grid items-center gap-10 lg:grid-cols-2">
              <div>
                <Reveal>
                  <p className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#25D366]" />
                    Limited-time coupon
                  </p>
                </Reveal>

                <Reveal delay={0.05} className="mt-4">
                  <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
                    Experience Global Fusion Like Never Before
                  </h1>
                  <p className="mt-4 max-w-xl text-lg leading-8 text-slate-600">
                    Indulge in curated flavors, signature cocktails, and a
                    vibrant dining atmosphere
                  </p>
                </Reveal>

                <Reveal delay={0.1} className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <ExternalButtonLink href={whatsappLink()} className="sm:w-auto">
                    WhatsApp Now <span className="text-xs opacity-90">↗</span>
                  </ExternalButtonLink>
                  <Button
                    variant="secondary"
                    className="sm:w-auto"
                    onClick={() => setCouponOpen(true)}
                  >
                    Get Coupon Code
                  </Button>
                </Reveal>

                <Reveal delay={0.15} className="mt-8 grid grid-cols-3 gap-3">
                  {[
                    { k: "4.9★", v: "Rating" },
                    { k: "10–15m", v: "Avg wait" },
                    { k: "20%", v: "Coupon" },
                  ].map((s) => (
                    <Card key={s.v} className="p-4">
                      <p className="text-xl font-black text-slate-900">{s.k}</p>
                      <p className="mt-1 text-xs text-slate-600">{s.v}</p>
                    </Card>
                  ))}
                </Reveal>
              </div>

              <Reveal delay={0.08} className="relative">
                <Card className="overflow-hidden">
                  <div className="relative aspect-[16/12]">
                    <ImageWithSkeleton
                      src="/images/hero-miri.jpg"
                      alt="Global fusion dining"
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      imgClassName="object-cover transition-transform duration-500 hover:scale-[1.02]"
                    />
                  </div>
                </Card>
              </Reveal>
            </div>
          </div>
        </section>

        {/* 2) BEST DISHES */}
        <Section
          id="dishes"
          eyebrow="Best dishes"
          title="What are our best dishes"
          subtitle="A curated selection of crowd favorites — bold flavors, premium ingredients."
        >
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {dishes.slice(0, 6).map((dish, i) => (
              <Reveal key={dish.name} delay={i * 0.03}>
                <Card className="group overflow-hidden">
                  <div className="relative aspect-[4/3]">
                    <ImageWithSkeleton
                      src={dish.image}
                      alt={dish.name}
                      fill
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      imgClassName="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="p-5">
                    <p className="text-base font-bold text-slate-900">
                      {dish.name}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {dish.desc}
                    </p>
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-8">
            <ButtonLink href="#offer" variant="secondary">
              View Full Menu
            </ButtonLink>
          </Reveal>
        </Section>

        {/* Premium full menu accordion */}
        <MenuSection />

        {/* 3) OFFER (repeat CTA) */}
        <Section
          id="offer"
          eyebrow="Offer"
          title="Get 20% off on your visit"
          subtitle="Claim your code on WhatsApp, then show it at checkout."
          className="bg-slate-50"
        >
          <Reveal>
            <Card className="overflow-hidden">
              <div className="p-6 sm:p-8">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-lg font-bold text-slate-900">
                      {COUPON.code}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      Works on dine-in. One code per table. Limited time.
                    </p>
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <ExternalButtonLink href={whatsappLink()}>
                      WhatsApp Now <span className="text-xs opacity-90">↗</span>
                    </ExternalButtonLink>
                    <Button
                      variant="secondary"
                      onClick={() => setCouponOpen(true)}
                    >
                      Get Coupon Code
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </Reveal>
        </Section>

        {/* 4) TESTIMONIALS (auto-scrolling marquee) */}
        <TestimonialSlider />

        {/* 5) LOCATION */}
        <Section
          id="location"
          eyebrow="Location"
          title="Where to find us"
          subtitle="Miramar, Panjim, Goa — easy to reach for sunset dinners and late-night cocktails."
          className="bg-slate-50"
        >
          <Reveal>
            <Card className="overflow-hidden">
              <div className="relative aspect-[16/8] bg-slate-100">
                <iframe
                  title="Map"
                  className="absolute inset-0 h-full w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src="https://www.google.com/maps?output=embed&q=Miri%20%7C%20Global%20Fusion%20Dining%20Miramar%2C%20Panjim%2C%20Goa"
                />
              </div>
              <div className="p-6">
                <p className="text-base font-bold text-slate-900">
                  {BRAND.name}
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Miramar Beach Road, near Kala Academy, Panjim, Goa 403001
                </p>
                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <ExternalButtonLink href="https://www.google.com/maps/place/Miri+%7C+Global+Fusion+Dining+%7C+Miramar,+Panjim/">
                    Get Directions <span className="text-xs opacity-90">↗</span>
                  </ExternalButtonLink>
                  <ExternalButtonLink
                    href="tel:+15551234567"
                    variant="secondary"
                  >
                    Call Now
                  </ExternalButtonLink>
                </div>
              </div>
            </Card>
          </Reveal>
        </Section>

        {/* 6) FOOTER / APP PROMO */}
        <section className="px-6 pb-28 pt-10 sm:px-8 sm:pb-10">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md sm:p-8">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      Powered by Deblur
                    </p>
                    <p className="mt-2 text-sm text-slate-600">
                      Want this funnel for your restaurant? Launch in days.
                    </p>
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <ButtonLink href="#offer" variant="secondary">
                      Get Offer
                    </ButtonLink>
                    <ExternalButtonLink href={whatsappLink()}>
                      WhatsApp Now <span className="text-xs opacity-90">↗</span>
                    </ExternalButtonLink>
                  </div>
                </div>
              </div>
            </Reveal>

            <p className="mt-8 text-center text-xs text-slate-500">
              © {new Date().getFullYear()} {BRAND.name}. All rights reserved.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
