"use client";

import { useMemo, useState, useEffect } from "react";
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
  const [carouselIndex, setCarouselIndex] = useState(0);

  const carouselItems = useMemo(
    () => [
      {
        title: "Daily Brief",
        subtitle: "Government Shutdown Standoff",
        desc: "Lawmakers clash over deportations amid unpaid federal workers.",
        accent: "from-[#8aa4f5] to-[#6f84d8]",
        image: "/images/grilled-fish-lemon-butter.jpg",
        category: "Politics",
      },
      {
        title: "Daily Brief",
        subtitle: "Markets Rally On Tech Earnings",
        desc: "Global indices rise as major tech firms beat expectations.",
        accent: "from-[#78b0ff] to-[#4f7fdf]",
        image: "/images/peri-peri-chicken-skewers.jpg",
        category: "Business",
      },
      {
        title: "Daily Brief",
        subtitle: "World Leaders Meet For Climate",
        desc: "Nations push for faster transition and stricter carbon targets.",
        accent: "from-[#a889f0] to-[#cc60ae]",
        image: "/images/paneer-steak-herb-sauce.jpg",
        category: "World",
      },
      {
        title: "Daily Brief",
        subtitle: "Health Breakthrough In Vaccine Research",
        desc: "Researchers report stronger immunity response in trials.",
        accent: "from-[#63c3ea] to-[#5b87df]",
        image: "/images/passionfruit-martini.jpg",
        category: "Health",
      },
      {
        title: "Daily Brief",
        subtitle: "Team USA Dominates Winter Event",
        desc: "Athletes claim decisive wins across multiple disciplines.",
        accent: "from-[#6db4ea] to-[#3d79d8]",
        image: "/images/truffle-mushroom-arancini.jpg",
        category: "Sports",
      },
    ],
    []
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % carouselItems.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [carouselItems.length]);

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
      <header className="border-b border-slate-200 bg-white">
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
          <div className="mx-auto max-w-6xl px-0 pb-12 sm:px-8 sm:pt-12 sm:pb-16">
            <div className="grid items-center gap-8 lg:grid-cols-2">
              <div className="order-2 px-6 lg:order-1 lg:px-0">
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

              <Reveal delay={0.08} className="relative order-1 lg:order-2">
                <div className="overflow-hidden sm:rounded-2xl sm:border sm:border-slate-200 sm:bg-white sm:shadow-md">
                  <div className="relative aspect-[4/3] sm:aspect-[16/12]">
                    <ImageWithSkeleton
                      src="/images/hero-miri.jpg"
                      alt="Global fusion dining"
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      imgClassName="object-cover transition-transform duration-500 hover:scale-[1.02]"
                    />
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* iPhone app preview placeholder - TODO: add new content here */}
        <section className="bg-slate-50">
          <div className="mx-auto max-w-6xl px-6 py-14 sm:px-8 sm:py-20">
            {/* Placeholder space for new content */}
          </div>
        </section>

        {/* Carousel in iPhone Mockup Section */}
        <section className="bg-white py-12 sm:py-16">
          <div className="mx-auto max-w-6xl px-6 sm:px-8">
            <div className="flex justify-center">
              {/* iPhone Mockup Wrapper */}
              <div className="relative mx-auto" style={{ width: "800px", maxWidth: "95vw" }}>
                {/* Screen viewport (under frame) */}
                <div
                  className="absolute z-10 overflow-hidden"
                  style={{
                    left: "35.25%",
                    top: "16%",
                    width: "29.5%",
                    bottom: "14.8%",
                    borderRadius: "34px",
                  }}
                >
                  <div
                    className="h-full w-full flex transition-transform duration-700 ease-out"
                    style={{ transform: `translateX(-${carouselIndex * 100}%)` }}
                  >
                    {carouselItems.map((item, index) => {
                      const prevItem =
                        carouselItems[
                          (index - 1 + carouselItems.length) % carouselItems.length
                        ];
                      const nextItem = carouselItems[(index + 1) % carouselItems.length];

                      return (
                        <div
                          key={index}
                          className={`relative h-full w-full shrink-0 overflow-hidden bg-gradient-to-b ${item.accent}`}
                        >
                          <div className="absolute -left-[36%] top-[46%] h-[52%] w-[58%] rounded-[22px] border border-white/30 bg-black/25 opacity-75">
                            <img
                              src={prevItem.image}
                              alt={prevItem.subtitle}
                              className="h-full w-full object-cover"
                            />
                          </div>

                          <div className="absolute -right-[36%] top-[46%] h-[52%] w-[58%] rounded-[22px] border border-white/30 bg-black/25 opacity-75">
                            <img
                              src={nextItem.image}
                              alt={nextItem.subtitle}
                              className="h-full w-full object-cover"
                            />
                          </div>

                          <div className="relative z-10 flex h-full flex-col px-3 pt-3 pb-2">
                            <div className="flex items-start justify-between text-slate-900">
                              <div className="flex items-center gap-2">
                                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-cyan-100 text-[10px] font-black text-cyan-700">
                                  d
                                </span>
                                <div>
                                  <p className="text-[14px] font-extrabold leading-none">deblurAI</p>
                                  <p className="mt-0.5 text-[9px] text-slate-500">Next digest in 17h</p>
                                </div>
                              </div>
                              <p className="text-lg leading-none text-slate-400">≡</p>
                            </div>

                            <div className="mt-3 flex flex-1 items-center justify-center">
                              <div className="relative aspect-[9/16] h-full overflow-hidden rounded-[22px] border border-white/35 bg-white/20 p-2 backdrop-blur-[1px]">
                                <div className="relative h-full overflow-hidden rounded-[18px]">
                                  <img
                                    src={item.image}
                                    alt={item.subtitle}
                                    className="h-full w-full object-cover"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-900/70" />
                                  <div className="absolute inset-x-0 bottom-0 p-3 text-center text-white">
                                    <p className="text-lg font-black leading-tight">{item.subtitle}</p>
                                    <p className="mt-1 text-[11px] leading-4 text-white/85">{item.desc}</p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="mt-2 flex items-center justify-center gap-1.5 text-[11px] font-semibold text-slate-700">
                              <span className="h-2 w-2 rounded-full bg-blue-500" />
                              {item.category}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{ boxShadow: "inset 0 0 20px rgba(0, 0, 0, 0.08)" }}
                  />
                </div>

                {/* iPhone frame (over viewport) */}
                <img
                  src="/images/iphone.png"
                  alt="iPhone Mockup"
                  className="pointer-events-none relative z-20 h-auto w-full"
                />

                {/* Navigation Arrows - Outside phone */}
                <div className="pointer-events-none absolute left-0 right-0 top-1/2 z-30 flex -translate-y-1/2 justify-between">
                  <button
                    onClick={() =>
                      setCarouselIndex(
                        (prev) => (prev - 1 + carouselItems.length) % carouselItems.length
                      )
                    }
                    className="pointer-events-auto -translate-x-14 text-slate-400 transition-colors hover:text-slate-700 sm:-translate-x-20"
                  >
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  <button
                    onClick={() => setCarouselIndex((prev) => (prev + 1) % carouselItems.length)}
                    className="pointer-events-auto translate-x-14 text-slate-400 transition-colors hover:text-slate-700 sm:translate-x-20"
                  >
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
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
