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

const SECTION_CONFIG = [
  { id: "basic", title: "Basic Info", subtitle: "Name, contact, labels, and offer copy" },
  { id: "hero", title: "Hero", subtitle: "Top fold messaging and hero media" },
  { id: "carousel", title: "Carousel", subtitle: "Highlight photos on homepage" },
  { id: "premium", title: "Premium Dishes", subtitle: "Featured menu items" },
  { id: "testimonials", title: "Testimonials", subtitle: "Social proof and customer quotes" },
] as const;

type SectionId = (typeof SECTION_CONFIG)[number]["id"];

const SECTION_IDS = new Set<string>(SECTION_CONFIG.map((section) => section.id));

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

  const [activeSection, setActiveSection] = useState<SectionId>("basic");

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

  useEffect(() => {
    if (typeof window === "undefined") return;

    const syncFromHash = () => {
      const next = window.location.hash.replace("#", "");
      if (SECTION_IDS.has(next)) {
        setActiveSection((prev) => (prev === next ? prev : (next as SectionId)));
      }
    };

    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash !== `#${activeSection}`) {
      window.history.replaceState(null, "", `#${activeSection}`);
    }
  }, [activeSection]);

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
    <main className="min-h-screen bg-[radial-gradient(1050px_540px_at_2%_0%,rgba(17,182,110,0.17),transparent_55%),radial-gradient(1100px_560px_at_100%_100%,rgba(8,145,178,0.12),transparent_60%)] px-3 py-4 sm:px-6 sm:py-6">
      <div className="mx-auto grid w-full max-w-[1320px] gap-4 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="h-fit rounded-[28px] border border-slate-200/80 bg-white/95 p-5 shadow-xl lg:sticky lg:top-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-lg font-black text-emerald-700">
              R
            </div>
            <div>
              <p className="text-base font-black tracking-tight text-slate-900">Restaurant CMS</p>
              <p className="text-xs text-slate-500">{restaurant.slug}</p>
            </div>
          </div>

          <div className="mt-7 space-y-1">
            <p className="px-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Sections</p>
            {SECTION_CONFIG.map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() => setActiveSection(section.id)}
                className={`flex w-full items-center rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
                  activeSection === section.id
                    ? "bg-emerald-50 font-semibold text-emerald-700"
                    : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-700"
                }`}
              >
                {section.title}
              </button>
            ))}
          </div>

          <div className="mt-8 space-y-2">
            <Link
              href="/admin/dashboard"
              className="block rounded-xl border border-slate-200 bg-white px-4 py-2 text-center text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
            >
              Back to dashboard
            </Link>
            <Link
              href={`/${restaurant.slug}`}
              className="block rounded-xl bg-[linear-gradient(135deg,#0c8f55,#11b66e)] px-4 py-2 text-center text-sm font-semibold text-white transition hover:brightness-110"
            >
              Open public page
            </Link>
          </div>
        </aside>

        <section className="rounded-[28px] border border-slate-200/80 bg-slate-50/80 p-4 shadow-xl sm:p-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">Restaurant Workspace</p>
            <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
              <h1 className="text-3xl font-black tracking-tight text-slate-900">{restaurant.name}</h1>
              <span className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
                /{restaurant.slug}
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-600">Manage copy, media, premium dishes, and social proof in one place.</p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl border border-emerald-600/30 bg-[linear-gradient(135deg,#0c8f55,#11b66e)] p-4 text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] opacity-80">Editor Sections</p>
                <p className="mt-1 text-4xl font-black leading-none">{SECTION_CONFIG.length}</p>
                <p className="mt-2 text-xs opacity-80">Workspace modules</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 text-slate-900">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Premium Dishes</p>
                <p className="mt-1 text-4xl font-black leading-none">{dishes.filter((d) => d.section === "premium").length}</p>
                <p className="mt-2 text-xs text-slate-500">Featured menu items</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 text-slate-900">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Testimonials</p>
                <p className="mt-1 text-4xl font-black leading-none">{testimonials.length}</p>
                <p className="mt-2 text-xs text-slate-500">Social proof cards</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 text-slate-900">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Data Status</p>
                <p className="mt-1 text-2xl font-black leading-none text-emerald-700">Connected</p>
                <p className="mt-2 text-xs text-slate-500">Live Firebase sync</p>
              </div>
            </div>
          </div>

          <section id={activeSection} className="mt-4 rounded-3xl border border-slate-200 bg-white p-4 sm:p-5">
            <div className="mb-3">
              <h2 className="text-xl font-black tracking-tight text-slate-900">
                {SECTION_CONFIG.find((section) => section.id === activeSection)?.title}
              </h2>
              <p className="text-sm text-slate-600">
                {SECTION_CONFIG.find((section) => section.id === activeSection)?.subtitle}
              </p>
            </div>

            {activeSection === "basic" ? (
              <BasicInfoForm
                restaurantId={restaurantId}
                initialRestaurant={restaurant}
                onUpdated={(next) => setRestaurant(next)}
              />
            ) : null}

            {activeSection === "hero" ? (
              <HeroEditor
                restaurantId={restaurantId}
                initialRestaurant={restaurant}
                onUpdated={(next) => setRestaurant(next)}
              />
            ) : null}

            {activeSection === "carousel" ? (
              <CarouselImageManager
                restaurantId={restaurantId}
                initialRestaurant={restaurant}
                onUpdated={(next) => setRestaurant(next)}
              />
            ) : null}

            {activeSection === "premium" ? (
              <PremiumDishesManager
                restaurantId={restaurantId}
                initialPremiumDishes={dishes.filter((d) => d.section === "premium")}
                onUpdated={(nextPremium) => {
                  setDishes((prev) => {
                    const nonPremium = prev.filter((dish) => dish.section !== "premium");
                    return [...nonPremium, ...nextPremium];
                  });
                }}
              />
            ) : null}

            {activeSection === "testimonials" ? (
              <TestimonialManager
                restaurantId={restaurantId}
                initialData={testimonials}
                onUpdated={setTestimonials}
              />
            ) : null}
          </section>
        </section>
      </div>
    </main>
  );
}
