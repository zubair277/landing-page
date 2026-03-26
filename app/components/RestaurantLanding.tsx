"use client";

import { useMemo, useState, useEffect } from "react";
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
import type { Dish, RestaurantPageData } from "@/types";

type CarouselItem = {
  title: string;
  subtitle: string;
  desc: string;
  accent: string;
  image: string;
  category: string;
};

const accents = [
  "from-[#8aa4f5] to-[#6f84d8]",
  "from-[#78b0ff] to-[#4f7fdf]",
  "from-[#a889f0] to-[#cc60ae]",
  "from-[#63c3ea] to-[#5b87df]",
  "from-[#6db4ea] to-[#3d79d8]",
] as const;

const accentColors = [
  "#6f84d8",
  "#4f7fdf",
  "#cc60ae",
  "#5b87df",
  "#3d79d8",
] as const;

const categoryColors: Record<string, string> = {
  Veg: "bg-gradient-to-r from-pink-400 to-pink-500",
  Non_Veg: "bg-gradient-to-r from-red-400 to-red-500",
  Offer: "bg-gradient-to-r from-yellow-400 to-yellow-500",
  Reviews: "bg-gradient-to-r from-purple-400 to-purple-500",
};

const DEBLUR_MARK_PATH = "/images/deblur-logo.png";

function normalizeWhatsappNumber(value: string) {
  return value.replace(/[^0-9]/g, "");
}

function getWhatsappLink(number: string, message: string, countryCode?: string) {
  const normalized = normalizeWhatsappNumber(number);
  const fullNumber = countryCode ? `${countryCode}${normalized}` : normalized;
  const text = encodeURIComponent(message);
  return `https://wa.me/${fullNumber}?text=${text}`;
}

function mapTestimonials(data: RestaurantPageData["testimonials"]) {
  return data.map((item) => ({
    name: item.name,
    text: item.review,
    rating: item.rating ?? 5,
  }));
}

function buildCarouselItems(data: RestaurantPageData): CarouselItem[] {
  // Use uploaded carousel images if available
  const carouselImageUrls = data.restaurant.carouselImages && data.restaurant.carouselImages.length > 0
    ? data.restaurant.carouselImages
    : [
        "/images/biryani1.jpg",
        "/images/biryani2.jpg",
        "/images/biryani3.jpg",
        "/images/biryani4.jpg",
      ];

  // Create carousel items from images
  const carouselCards = carouselImageUrls.slice(0, 3).map((image, index) => {
    const dish = data.dishes[index];
    return {
      title: "Chef Special",
      subtitle: dish?.name || `Featured Dish ${index + 1}`,
      desc: dish?.description || "Premium dining experience",
      accent: accents[index % accents.length],
      image,
      category: dish?.category || "Special",
    };
  });

  const offerCard: CarouselItem = {
    title: "Limited Time Offer",
    subtitle: `${data.restaurant.couponCode} - Claim 20% Off`,
    desc: "Tap WhatsApp to lock your coupon before your table booking.",
     accent: accents[3],
     image: carouselImageUrls[0] || "/images/biryani1.jpg",
     category: "Offer",
   };

   const reviewCard: CarouselItem = {
     title: "Guest Favorite",
     subtitle: data.testimonials[0]?.name || "Loved by diners",
     desc:
       data.testimonials[0]?.review ||
       "Premium global dining with standout cocktails and warm service.",
    accent: accents[4],
    image: carouselImageUrls[1] || "/images/biryani2.jpg",
    category: "Reviews",
  };

  return [...carouselCards, offerCard, reviewCard].slice(0, 5);
}

export function RestaurantLanding({ data }: { data: RestaurantPageData }) {
  const [couponOpen, setCouponOpen] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);

  const avgRating =
    data.testimonials.length > 0
      ? `${(
          data.testimonials.reduce((sum, item) => sum + (item.rating ?? 5), 0) /
          data.testimonials.length
        ).toFixed(1)}★`
      : "4.9★";

  const whatsappHref = getWhatsappLink(
    data.restaurant.whatsappNumber,
     `Hi, I want to claim ${data.restaurant.couponCode}`,
     data.restaurant.countryCode
  );

  const heroImage =
    data.restaurant.heroImage ||
    data.media.find((item) => item.type === "hero")?.imageUrl ||
    "/images/hero-miri.jpg";

  const carouselItems = useMemo(() => buildCarouselItems(data), [data]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % carouselItems.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [carouselItems.length]);

  const dishes: Dish[] = useMemo(() => data.dishes, [data.dishes]);
  const premiumDishes = useMemo(
    () => dishes.filter((dish) => dish.section === "premium"),
    [dishes]
  );
  const testimonials = useMemo(() => mapTestimonials(data.testimonials), [data.testimonials]);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <CouponModal
        open={couponOpen}
        onClose={() => setCouponOpen(false)}
        couponCode={data.restaurant.couponCode}
      />
      <StickyCtaBar
        onCoupon={() => setCouponOpen(true)}
        discountText={`Use ${data.restaurant.couponCode} for 20% off`}
        whatsappHref={whatsappHref}
      />

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
                {data.restaurant.name}
              </p>
              <p className="text-xs text-slate-600">
                {data.restaurant.headerTagline || "A global dining experience in the heart of Miramar"}
              </p>
            </div>
          </div>

          <nav className="flex items-center gap-2">
            <ButtonLink href="#location" variant="ghost">
              {data.restaurant.locationNavLabel || "Location"}
            </ButtonLink>
            <ExternalButtonLink href={whatsappHref} variant="secondary">
              {data.restaurant.contactNavLabel || "Contact"}
            </ExternalButtonLink>
          </nav>
        </div>
      </header>

      <main>
        <section className="bg-slate-50">
          <div className="mx-auto max-w-6xl px-0 pb-12 sm:px-8 sm:pt-12 sm:pb-16">
            <div className="grid items-center gap-8 lg:grid-cols-2">
              <div className="order-2 px-6 lg:order-1 lg:px-0">
                <Reveal>
                  <p className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#25D366]" />
                    {data.restaurant.heroBadgeText || "Limited-time coupon"}
                  </p>
                </Reveal>

                <Reveal delay={0.05} className="mt-4">
                  <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
                    {data.restaurant.heroTitle}
                  </h1>
                  <p className="mt-4 max-w-xl text-lg leading-8 text-slate-600">
                    {data.restaurant.heroSubtitle}
                  </p>
                </Reveal>

                <Reveal delay={0.1} className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <ExternalButtonLink href={whatsappHref} className="sm:w-auto">
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
                    { k: avgRating, v: "Rating" },
                    { k: data.restaurant.avgWaitText || "10–15m", v: "Avg wait" },
                    { k: data.restaurant.offerBadgeText || "20%", v: "Coupon" },
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
                      src={heroImage}
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

        <section className="bg-slate-50">
          <div className="mx-auto max-w-6xl px-6 py-14 sm:px-8 sm:py-20" />
        </section>

        <section className="overflow-x-hidden bg-white py-12 sm:py-16 lg:py-16">
          <div className="mx-auto max-w-6xl px-6 sm:px-8">
            <div className="flex justify-center">
              <div className="relative mx-auto w-[210vw] max-w-[860px] sm:w-full sm:max-w-[560px] lg:max-w-[800px]">
                <div
                  className="absolute z-10 overflow-hidden"
                  style={{
                    left: "35.25%",
                    top: "17.4%",
                    width: "29.5%",
                    bottom: "15.9%",
                    borderRadius: "34px",
                  }}
                >
                  <div className="pointer-events-none absolute inset-x-0 top-0 z-20 border-b border-slate-200/80 bg-white/92 px-3 pb-3 pt-6 backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <img
                          src={DEBLUR_MARK_PATH}
                          alt="Deblur"
                          className="h-12 w-auto object-contain"
                        />
                      </div>
                      <p className="text-base leading-none text-slate-400">≡</p>
                    </div>
                  </div>

                  <div
                    className="flex h-full w-full pt-20 transition-transform duration-700 ease-out"
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
                          className="relative h-full w-full shrink-0 overflow-hidden bg-black"
                        >
                          <div className="absolute -left-[36%] top-[46%] h-[52%] w-[58%] rounded-[22px] border border-white/30 bg-black/25 opacity-0 hidden">
                            <img
                              src={prevItem.image}
                              alt={prevItem.subtitle}
                              className="h-full w-full object-cover"
                            />
                          </div>

                          <div className="absolute -right-[36%] top-[46%] h-[52%] w-[58%] rounded-[22px] border border-white/30 bg-black/25 opacity-0 hidden">
                            <img
                              src={nextItem.image}
                              alt={nextItem.subtitle}
                              className="h-full w-full object-cover"
                            />
                          </div>

                          <div className="relative z-10 flex h-full flex-col px-0 pt-16 pb-8">
                            <div className="flex flex-1 items-center justify-center w-full max-h-[48%]">
                              <div className="relative h-full w-full overflow-hidden rounded-[32px]">
                                <img
                                  src={item.image}
                                  alt={item.subtitle}
                                  className="h-full w-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-900/70" />
                                <div className="absolute inset-x-0 bottom-0 px-4 py-5 text-center text-white">
                                  <p className="text-lg font-black leading-tight">{item.subtitle}</p>
                                  <p className="mt-1.5 text-[12px] leading-5 text-white/85">{item.desc}</p>
                                </div>
                              </div>
                            </div>

                            <div className={`mt-2 flex items-center justify-center gap-2 rounded-md py-2 px-3 ${categoryColors[item.category] || "bg-gradient-to-r from-slate-400 to-slate-500"}`}>
                              <span className="h-2 w-2 rounded-full bg-white" />
                              <span className="text-[12px] font-bold text-white capitalize">{item.category}</span>
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

                <img
                  src="/images/iphone.png"
                  alt="iPhone Mockup"
                  className="pointer-events-none relative z-20 h-auto w-full"
                />

                <div className="pointer-events-none absolute left-0 right-0 top-1/2 z-30 flex -translate-y-1/2 justify-between">
                  <button
                    onClick={() =>
                      setCarouselIndex(
                        (prev) => (prev - 1 + carouselItems.length) % carouselItems.length
                      )
                    }
                    className="pointer-events-auto -translate-x-2 text-slate-400 transition-colors hover:text-slate-700 sm:-translate-x-16"
                  >
                    <svg className="h-8 w-8 sm:h-10 sm:w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  <button
                    onClick={() => setCarouselIndex((prev) => (prev + 1) % carouselItems.length)}
                    className="pointer-events-auto translate-x-2 text-slate-400 transition-colors hover:text-slate-700 sm:translate-x-16"
                  >
                    <svg className="h-8 w-8 sm:h-10 sm:w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Section
          id="dishes"
          eyebrow={data.restaurant.dishesEyebrow || "Best dishes"}
          title={data.restaurant.dishesTitle || "What are our best dishes"}
          subtitle={
            data.restaurant.dishesSubtitle ||
            "A curated selection of crowd favorites - bold flavors, premium ingredients."
          }
        >
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {premiumDishes.slice(0, 6).map((dish, i) => (
              <Reveal key={dish.id} delay={i * 0.03}>
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
                      {dish.description}
                    </p>
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>

          {premiumDishes.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">No premium offering items added yet.</p>
          ) : null}

          <Reveal className="mt-8">
            <ButtonLink href="#offer" variant="secondary">
              View Full Menu
            </ButtonLink>
          </Reveal>
        </Section>

        <Section
          id="offer"
          eyebrow={data.restaurant.offerEyebrow || "Offer"}
          title={data.restaurant.offerTitle || "Get 20% off on your visit"}
          subtitle={
            data.restaurant.offerSubtitle ||
            "Claim your code on WhatsApp, then show it at checkout."
          }
          className="bg-slate-50"
        >
          <Reveal>
            <Card className="overflow-hidden">
              <div className="p-6 sm:p-8">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-lg font-bold text-slate-900">
                      {data.restaurant.couponCode}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      {data.restaurant.offerTerms || "Works on dine-in. One code per table. Limited time."}
                    </p>
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <ExternalButtonLink href={whatsappHref}>
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

        <TestimonialSlider testimonials={testimonials} />

        <Section
          id="location"
          eyebrow={data.restaurant.locationEyebrow || "Location"}
          title={data.restaurant.locationTitle || "Where to find us"}
          subtitle={
            data.restaurant.locationSubtitle ||
            "Miramar, Panjim, Goa — easy to reach for sunset dinners and late-night cocktails."
          }
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
                  src={`https://www.google.com/maps?output=embed&q=${encodeURIComponent(data.restaurant.address)}`}
                />
              </div>
              <div className="p-6">
                <p className="text-base font-bold text-slate-900">
                  {data.restaurant.name}
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  {data.restaurant.address}
                </p>
                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <ExternalButtonLink href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.restaurant.address)}`}>
                    Get Directions <span className="text-xs opacity-90">↗</span>
                  </ExternalButtonLink>
                  <ExternalButtonLink
                    href={`tel:+${data.restaurant.countryCode || ""}${normalizeWhatsappNumber(data.restaurant.whatsappNumber)}`}
                    variant="secondary"
                  >
                    Call Now
                  </ExternalButtonLink>
              </div>
               </div>
            </Card>
          </Reveal>
        </Section>

        <section className="px-6 pb-28 pt-10 sm:px-8 sm:pb-10">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md sm:p-8">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      {data.restaurant.footerBrandTitle || "Powered by Deblur"}
                    </p>
                    <p className="mt-2 text-sm text-slate-600">
                      {data.restaurant.footerCtaText || "Want this funnel for your restaurant? Launch in days."}
                    </p>
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <ButtonLink href="#offer" variant="secondary">
                      {data.restaurant.footerPrimaryButtonText || "Get Offer"}
                    </ButtonLink>
                    <ExternalButtonLink href={whatsappHref}>
                      WhatsApp Now <span className="text-xs opacity-90">↗</span>
                    </ExternalButtonLink>
                  </div>
                </div>
              </div>
            </Reveal>

            <p className="mt-8 text-center text-xs text-slate-500">
              © {new Date().getFullYear()} {data.restaurant.name}. All rights reserved.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
