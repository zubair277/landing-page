"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  getDishesByRestaurant,
  getRestaurantById,
  getTestimonialsByRestaurant,
  getUserProfileByUid,
} from "@/lib/queries";
import { canAccessRestaurant } from "@/lib/auth-helpers";
import type { Dish, Restaurant, Testimonial, UserProfile } from "@/types";
import { Card } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { BasicInfoForm } from "@/components/admin/BasicInfoForm";
import { HeroEditor } from "@/components/admin/HeroEditor";
import { CarouselImageManager } from "@/components/admin/CarouselImageManager";
import { PremiumDishesManager } from "@/components/admin/PremiumDishesManager";
import { TestimonialManager } from "@/components/admin/TestimonialManager";

type RouteParams = {
  id?: string | string[];
};

export default function RestaurantAdminPage() {
  const params = useParams<RouteParams>();
  const router = useRouter();
  const restaurantId = (Array.isArray(params.id) ? params.id[0] : params.id) ?? "";

  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  const sections = [
    { id: "basic", title: "Basic Info", subtitle: "Name, contact, labels, and offer copy" },
    { id: "hero", title: "Hero", subtitle: "Top fold messaging and hero media" },
    { id: "carousel", title: "Carousel", subtitle: "Highlight photos on homepage" },
    { id: "premium", title: "Premium Dishes", subtitle: "Featured menu items" },
    { id: "testimonials", title: "Testimonials", subtitle: "Social proof and customer quotes" },
  ] as const;

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser);

      if (nextUser) {
        try {
          const profile = await getUserProfileByUid(nextUser.uid);
          setUserProfile(profile);
        } catch (err) {
          console.error("Error loading user profile:", err);
        }
      }

      setAuthLoading(false);
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    const load = async () => {
      if (!restaurantId) {
        setError("Restaurant id is missing from the URL.");
        setLoading(false);
        return;
      }

      if (!user) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const [restaurantData, dishesData, testimonialsData] = await Promise.all([
          getRestaurantById(restaurantId),
          getDishesByRestaurant(restaurantId),
          getTestimonialsByRestaurant(restaurantId),
        ]);

        if (!restaurantData) {
          setError("Restaurant was not found.");
          setLoading(false);
          return;
        }

        // Check access: either owner via ownerUid or restaurant admin with matching restaurantId
        const hasAccess =
          restaurantData.ownerUid === user.uid || canAccessRestaurant(userProfile, restaurantId);

        if (!hasAccess) {
          setError("You are not allowed to access this restaurant.");
          setLoading(false);
          return;
        }

        setRestaurant(restaurantData);
        setDishes(dishesData);
        setTestimonials(testimonialsData);
      } catch {
        setError("Failed to load restaurant data.");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [restaurantId, user, userProfile]);

  if (authLoading) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-10 sm:px-8">
        <p className="text-sm text-slate-600">Checking authentication...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-10 sm:px-8">
        <Card className="p-6">
          <p className="text-sm text-slate-700">You must be signed in to access this page.</p>
          <Link href="/admin" className="mt-4 inline-block text-sm font-semibold text-slate-900 underline">
            Go to admin login
          </Link>
        </Card>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-10 sm:px-8">
        <p className="text-sm text-slate-600">Loading restaurant workspace...</p>
      </main>
    );
  }

  if (!restaurant || error) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-10 sm:px-8">
        <Card className="p-6">
          <p className="text-sm text-red-600">{error || "Unexpected error"}</p>
          <Link href="/admin/dashboard" className="mt-4 inline-block text-sm font-semibold text-slate-900 underline">
            Back to admin
          </Link>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(900px_460px_at_0%_0%,rgba(37,211,102,0.16),transparent_55%),radial-gradient(1000px_520px_at_100%_0%,rgba(16,185,129,0.12),transparent_55%)] px-4 py-8 sm:px-8 sm:py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 rounded-3xl border border-emerald-100 bg-white/90 p-6 shadow-lg backdrop-blur sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                Restaurant Workspace
              </p>
              <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900">{restaurant.name}</h1>
              <p className="mt-1 text-sm text-slate-600">Slug: {restaurant.slug}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/admin/dashboard"
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
              >
                Back to dashboard
              </Link>
              <Link
                href={`/${restaurant.slug}`}
                className="rounded-xl border border-slate-900 bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-700"
              >
                Open public page
              </Link>
            </div>
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
              <p className="text-xs uppercase tracking-wider text-slate-500">Editor Sections</p>
              <p className="mt-1 text-lg font-extrabold text-slate-900">{sections.length}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
              <p className="text-xs uppercase tracking-wider text-slate-500">Premium Dishes</p>
              <p className="mt-1 text-lg font-extrabold text-slate-900">
                {dishes.filter((d) => d.section === "premium").length}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
              <p className="text-xs uppercase tracking-wider text-slate-500">Testimonials</p>
              <p className="mt-1 text-lg font-extrabold text-slate-900">{testimonials.length}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
          <Card className="h-fit p-4 lg:sticky lg:top-6">
            <p className="px-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Jump To Section
            </p>
            <div className="mt-3 grid gap-1">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="rounded-lg px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-emerald-50 hover:text-emerald-700"
                >
                  {section.title}
                </a>
              ))}
            </div>
          </Card>

          <div className="grid gap-6">
            <section id="basic" className="scroll-mt-24">
              <div className="mb-3 px-1">
                <h2 className="text-lg font-bold text-slate-900">Basic Info</h2>
                <p className="text-sm text-slate-600">Name, contact, labels, and offer copy.</p>
              </div>
              <BasicInfoForm
                restaurantId={restaurantId}
                initialRestaurant={restaurant}
                onUpdated={(next) => setRestaurant(next)}
              />
            </section>

            <section id="hero" className="scroll-mt-24">
              <div className="mb-3 px-1">
                <h2 className="text-lg font-bold text-slate-900">Hero</h2>
                <p className="text-sm text-slate-600">Top fold messaging and hero media.</p>
              </div>
              <HeroEditor
                restaurantId={restaurantId}
                initialRestaurant={restaurant}
                onUpdated={(next) => setRestaurant(next)}
              />
            </section>

            <section id="carousel" className="scroll-mt-24">
              <div className="mb-3 px-1">
                <h2 className="text-lg font-bold text-slate-900">Carousel</h2>
                <p className="text-sm text-slate-600">Highlight photos on homepage.</p>
              </div>
              <CarouselImageManager
                restaurantId={restaurantId}
                initialRestaurant={restaurant}
                onUpdated={(next) => setRestaurant(next)}
              />
            </section>

            <section id="premium" className="scroll-mt-24">
              <div className="mb-3 px-1">
                <h2 className="text-lg font-bold text-slate-900">Premium Dishes</h2>
                <p className="text-sm text-slate-600">Manage featured menu items.</p>
              </div>
              <PremiumDishesManager
                restaurantId={restaurantId}
                initialPremiumDishes={dishes.filter((d) => d.section === "premium")}
              />
            </section>

            <section id="testimonials" className="scroll-mt-24">
              <div className="mb-3 px-1">
                <h2 className="text-lg font-bold text-slate-900">Testimonials</h2>
                <p className="text-sm text-slate-600">Control social proof shown on the website.</p>
              </div>
              <TestimonialManager restaurantId={restaurantId} initialData={testimonials} />
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
