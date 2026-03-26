"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  createRestaurant,
  getAllRestaurants,
  getAllUserProfiles,
  getRestaurantsByOwnerUid,
  getUserProfileByUid,
  upsertUserProfile,
} from "@/lib/queries";
import type { Restaurant, UserProfile, UserRole } from "@/types";
import { Button } from "@/app/components/ui/Button";
import { Card } from "@/app/components/ui/Card";

const SUPER_ADMIN_EMAIL =
  process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL?.trim().toLowerCase() || "";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [authLoading, setAuthLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [admins, setAdmins] = useState<UserProfile[]>([]);
  const [search, setSearch] = useState("");
  const [newRestaurant, setNewRestaurant] = useState({
    name: "",
    slug: "",
    whatsappNumber: "",
    couponCode: "",
    address: "",
    heroTitle: "",
    heroSubtitle: "",
  });
  const [createLoading, setCreateLoading] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setAuthLoading(false);
    });
    return () => unsub();
  }, []);

  const isSuperAdmin = profile?.role === "super_admin";

  const restaurantsByOwner = useMemo(() => {
    const map = new Map<string, number>();
    restaurants.forEach((r) => map.set(r.ownerUid, (map.get(r.ownerUid) || 0) + 1));
    return map;
  }, [restaurants]);

  const filteredRestaurants = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return restaurants;

    return restaurants.filter((restaurant) => {
      return (
        restaurant.name.toLowerCase().includes(query) ||
        restaurant.slug.toLowerCase().includes(query)
      );
    });
  }, [restaurants, search]);

  const load = async (nextUser: User) => {
    setError(null);
    setLoading(true);
    try {
      const role: UserRole =
        nextUser.email?.toLowerCase() === SUPER_ADMIN_EMAIL ? "super_admin" : "owner";

      await upsertUserProfile({
        uid: nextUser.uid,
        email: nextUser.email || "",
        role,
        name: nextUser.displayName || "",
      });

      const me = await getUserProfileByUid(nextUser.uid);
      setProfile(me);

      if (me?.role === "super_admin") {
        const [allRestaurants, allAdmins] = await Promise.all([
          getAllRestaurants(),
          getAllUserProfiles(),
        ]);
        setRestaurants(allRestaurants);
        setAdmins(allAdmins);
      } else {
        const result = await getRestaurantsByOwnerUid(nextUser.uid);
        setRestaurants(result);
        setAdmins([]);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown Firebase error";
      if (message.toLowerCase().includes("permission")) {
        setError("Permission denied. Publish Firestore rules, then try again.");
      } else {
        setError("Dashboard failed to load. Check Firebase config and Firestore setup.");
      }
      setRestaurants([]);
      setAdmins([]);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setRestaurants([]);
      setAdmins([]);
      return;
    }
    void load(user);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    if (loading || authLoading) {
      return;
    }

    if (!user || isSuperAdmin) {
      return;
    }

    if (restaurants.length === 1) {
      router.replace(`/admin/${restaurants[0].id}`);
    }
  }, [authLoading, isSuperAdmin, loading, restaurants, router, user]);

  const onCreateRestaurant = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    setCreateLoading(true);
    try {
      await createRestaurant({
        ownerUid: user.uid,
        name: newRestaurant.name,
        slug: newRestaurant.slug.toLowerCase().trim(),
        whatsappNumber: newRestaurant.whatsappNumber,
        couponCode: newRestaurant.couponCode,
        address: newRestaurant.address,
        heroTitle: newRestaurant.heroTitle,
        heroSubtitle: newRestaurant.heroSubtitle,
      });
      setNewRestaurant({
        name: "",
        slug: "",
        whatsappNumber: "",
        couponCode: "",
        address: "",
        heroTitle: "",
        heroSubtitle: "",
      });
      await load(user);
    } finally {
      setCreateLoading(false);
    }
  };

  if (authLoading) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-10 sm:px-8">
        <p className="text-sm text-slate-600">Loading dashboard...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-10 sm:px-8">
        <Card className="p-6">
          <p className="text-sm text-slate-700">You are signed out.</p>
          <Link className="mt-3 inline-block text-sm font-semibold underline" href="/admin">
            Go to login
          </Link>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(1200px_500px_at_0%_0%,rgba(37,211,102,0.17),transparent_55%),radial-gradient(900px_420px_at_100%_10%,rgba(16,185,129,0.13),transparent_55%)] px-4 py-8 sm:px-8 sm:py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 rounded-3xl border border-emerald-100 bg-white/90 p-6 shadow-lg backdrop-blur sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                Admin Workspace
              </p>
              <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
                Dashboard
              </h1>
              <p className="mt-2 text-sm text-slate-600">
                Manage restaurants, menu content, media assets, and publishing workflows from one place.
              </p>
            </div>
            <div className="grid min-w-[220px] grid-cols-2 gap-2 text-sm">
              <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                <p className="text-xs uppercase tracking-wider text-slate-500">Restaurants</p>
                <p className="mt-1 text-xl font-extrabold text-slate-900">{restaurants.length}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                <p className="text-xs uppercase tracking-wider text-slate-500">Admins</p>
                <p className="mt-1 text-xl font-extrabold text-slate-900">{isSuperAdmin ? admins.length : 1}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6">
        <Card className="p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm text-slate-600">Signed in as</p>
              <p className="text-base font-semibold text-slate-900">{user.email}</p>
              <p className="mt-1 text-xs uppercase tracking-wider text-slate-500">
                Role: {profile?.role ?? "loading"}
              </p>
              {!isSuperAdmin && restaurants.length === 1 ? (
                <p className="mt-2 text-xs text-slate-600">
                  Opening your restaurant CMS editor automatically...
                </p>
              ) : null}
            </div>
            <div className="flex items-center gap-2">
              {isSuperAdmin ? (
                <Link
                  href="/admin/superadmin"
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-50"
                >
                  Super Admin
                </Link>
              ) : null}
              {!isSuperAdmin && restaurants.length === 1 ? (
                <Link
                  href={`/admin/${restaurants[0].id}`}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-50"
                >
                  Open CMS
                </Link>
              ) : null}
              <Button variant="secondary" onClick={() => signOut(auth)}>
                Sign out
              </Button>
            </div>
          </div>
        </Card>

        {error ? (
          <Card className="p-6">
            <p className="text-sm text-red-600">{error}</p>
          </Card>
        ) : null}

        {isSuperAdmin ? (
          <Card className="p-6 sm:p-8">
            <h2 className="text-xl font-bold text-slate-900">All Admins (Super Admin View)</h2>
            <p className="mt-1 text-sm text-slate-600">
              You can view all owner accounts and their restaurant count.
            </p>
            <div className="mt-5 grid gap-3">
              {admins.map((a) => (
                <div key={a.id} className="rounded-xl border border-slate-200 bg-white p-4">
                  <p className="text-sm font-semibold text-slate-900">{a.email}</p>
                  <p className="mt-1 text-xs text-slate-600">
                    UID: {a.id} • Role: {a.role} • Restaurants: {restaurantsByOwner.get(a.id) || 0}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        ) : null}

        <Card className="p-6 sm:p-8">
          <h2 className="text-xl font-bold text-slate-900">Create Restaurant Landing Page</h2>
          <p className="mt-1 text-sm text-slate-600">
            Add a new tenant page. This will be available at /[slug].
          </p>
          <form className="mt-5 grid gap-3" onSubmit={onCreateRestaurant}>
            <input
              placeholder="Restaurant Name"
              value={newRestaurant.name}
              onChange={(e) => setNewRestaurant((p) => ({ ...p, name: e.target.value }))}
              className="rounded-xl border border-slate-200 px-4 py-2.5"
              required
            />
            <input
              placeholder="Slug (example: miri)"
              value={newRestaurant.slug}
              onChange={(e) => setNewRestaurant((p) => ({ ...p, slug: e.target.value }))}
              className="rounded-xl border border-slate-200 px-4 py-2.5"
              required
            />
            <input
              placeholder="WhatsApp Number"
              value={newRestaurant.whatsappNumber}
              onChange={(e) =>
                setNewRestaurant((p) => ({ ...p, whatsappNumber: e.target.value }))
              }
              className="rounded-xl border border-slate-200 px-4 py-2.5"
              required
            />
            <input
              placeholder="Coupon Code"
              value={newRestaurant.couponCode}
              onChange={(e) => setNewRestaurant((p) => ({ ...p, couponCode: e.target.value }))}
              className="rounded-xl border border-slate-200 px-4 py-2.5"
              required
            />
            <input
              placeholder="Address"
              value={newRestaurant.address}
              onChange={(e) => setNewRestaurant((p) => ({ ...p, address: e.target.value }))}
              className="rounded-xl border border-slate-200 px-4 py-2.5"
              required
            />
            <input
              placeholder="Hero Title"
              value={newRestaurant.heroTitle}
              onChange={(e) => setNewRestaurant((p) => ({ ...p, heroTitle: e.target.value }))}
              className="rounded-xl border border-slate-200 px-4 py-2.5"
              required
            />
            <textarea
              rows={3}
              placeholder="Hero Subtitle"
              value={newRestaurant.heroSubtitle}
              onChange={(e) => setNewRestaurant((p) => ({ ...p, heroSubtitle: e.target.value }))}
              className="rounded-xl border border-slate-200 px-4 py-2.5"
              required
            />
            <Button type="submit" className="w-fit" disabled={createLoading || loading}>
              {createLoading ? "Creating..." : "Create Restaurant"}
            </Button>
          </form>
        </Card>

        <Card className="p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {isSuperAdmin ? "All Restaurants" : "Your Restaurants"}
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Open a restaurant workspace to edit dynamic content, menu, and images.
              </p>
            </div>
            <div className="w-full sm:w-72">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or slug"
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none ring-[#25D366]/40 focus:ring-2"
              />
            </div>
          </div>

          <div className="mt-5 grid gap-3">
            {filteredRestaurants.length === 0 ? (
              <p className="text-sm text-slate-500">No restaurants linked to this account.</p>
            ) : (
              filteredRestaurants.map((restaurant) => (
                <div
                  key={restaurant.id}
                  className="rounded-2xl border border-slate-200 bg-gradient-to-r from-white to-emerald-50/30 px-4 py-3 shadow-sm"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{restaurant.name}</p>
                      <p className="text-xs text-slate-600">Slug: {restaurant.slug}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/${restaurant.id}`}
                        className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-800 transition-colors hover:bg-slate-50"
                      >
                        Edit Content
                      </Link>
                      <Link
                        href={`/${restaurant.slug}`}
                        className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                      >
                        Open Website
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
        </div>
      </div>
    </main>
  );
}

