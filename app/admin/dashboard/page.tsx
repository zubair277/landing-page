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

  const dashboardStats = useMemo(
    () => [
      {
        label: "Total Restaurants",
        value: restaurants.length,
        accent: "bg-[linear-gradient(135deg,#0c8f55,#11b66e)] text-white border-emerald-600/30",
        note: "All restaurant workspaces",
      },
      {
        label: "Visible Results",
        value: filteredRestaurants.length,
        accent: "bg-white text-slate-900 border-slate-200",
        note: "After search filter",
      },
      {
        label: "Admins",
        value: isSuperAdmin ? admins.length : 1,
        accent: "bg-white text-slate-900 border-slate-200",
        note: isSuperAdmin ? "Managed users" : "Your active role",
      },
      {
        label: "Quick Actions",
        value: isSuperAdmin ? 3 : 2,
        accent: "bg-white text-slate-900 border-slate-200",
        note: "Create, edit, launch",
      },
    ],
    [admins.length, filteredRestaurants.length, isSuperAdmin, restaurants.length],
  );

  const load = async (nextUser: User) => {
    setError(null);
    setLoading(true);
    try {
      const role: UserRole =
        nextUser.email?.toLowerCase() === SUPER_ADMIN_EMAIL ? "super_admin" : "restaurant_admin";

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
    <main className="min-h-screen bg-[radial-gradient(1050px_540px_at_2%_0%,rgba(17,182,110,0.17),transparent_55%),radial-gradient(1100px_560px_at_100%_100%,rgba(8,145,178,0.12),transparent_60%)] px-3 py-4 sm:px-6 sm:py-6">
      <div className="mx-auto grid w-full max-w-[1280px] gap-4 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="rounded-[28px] border border-slate-200/80 bg-white/95 p-5 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-lg font-black text-emerald-700">
              D
            </div>
            <div>
              <p className="text-base font-black tracking-tight text-slate-900">Donezo CMS</p>
              <p className="text-xs text-slate-500">Admin control</p>
            </div>
          </div>

          <div className="mt-7 space-y-1">
            <p className="px-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Menu</p>
            <a href="#overview" className="flex items-center rounded-xl bg-emerald-50 px-3 py-2.5 text-sm font-semibold text-emerald-700">
              Dashboard
            </a>
            <a href="#create" className="flex items-center rounded-xl px-3 py-2.5 text-sm text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900">
              Create Workspace
            </a>
            <a href="#restaurants" className="flex items-center rounded-xl px-3 py-2.5 text-sm text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900">
              Restaurants
            </a>
            {isSuperAdmin ? (
              <a href="#admins" className="flex items-center rounded-xl px-3 py-2.5 text-sm text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900">
                Admin Accounts
              </a>
            ) : null}
          </div>

          <div className="mt-8 rounded-2xl bg-[linear-gradient(160deg,#063820,#0c8f55)] p-4 text-emerald-50">
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-200">Profile</p>
            <p className="mt-1 truncate text-sm font-semibold">{user.email}</p>
            <p className="mt-1 text-xs text-emerald-100/80">Role: {profile?.role ?? "loading"}</p>
            <div className="mt-3 flex gap-2">
              {isSuperAdmin ? (
                <Link href="/admin/superadmin" className="rounded-lg border border-emerald-300/40 px-2.5 py-1.5 text-xs font-semibold text-emerald-50 transition-colors hover:bg-emerald-400/10">
                  Super Admin
                </Link>
              ) : null}
              <button
                type="button"
                onClick={() => signOut(auth)}
                className="rounded-lg border border-emerald-300/40 px-2.5 py-1.5 text-xs font-semibold text-emerald-50 transition-colors hover:bg-emerald-400/10"
              >
                Sign out
              </button>
            </div>
          </div>
        </aside>

        <section className="rounded-[28px] border border-slate-200/80 bg-slate-50/70 p-4 shadow-xl sm:p-6" id="overview">
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_260px]">
            <div className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <label className="w-full max-w-md">
                  <span className="sr-only">Search restaurants</span>
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search restaurant by name or slug"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none ring-emerald-300/60 transition focus:ring-2"
                  />
                </label>
                <div className="flex items-center gap-2">
                  <a
                    href="#create"
                    className="rounded-xl bg-[linear-gradient(135deg,#0c8f55,#11b66e)] px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:brightness-110"
                  >
                    Add Workspace
                  </a>
                  {!isSuperAdmin && restaurants.length === 1 ? (
                    <Link
                      href={`/admin/${restaurants[0].id}`}
                      className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                    >
                      Open CMS
                    </Link>
                  ) : null}
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {dashboardStats.map((stat) => (
                  <div key={stat.label} className={`rounded-2xl border p-4 ${stat.accent}`}>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] opacity-70">{stat.label}</p>
                    <p className="mt-1 text-4xl font-black leading-none">{stat.value}</p>
                    <p className="mt-2 text-xs opacity-80">{stat.note}</p>
                  </div>
                ))}
              </div>

              {error ? (
                <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              ) : null}
            </div>

            <div className="grid gap-4">
              <Card className="rounded-3xl border border-slate-200 bg-white p-5 shadow-none">
                <p className="text-sm font-bold text-slate-900">Reminders</p>
                <div className="mt-3 space-y-3">
                  {(filteredRestaurants.length > 0 ? filteredRestaurants : restaurants)
                    .slice(0, 4)
                    .map((restaurant) => (
                      <div key={restaurant.id} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                        <p className="text-sm font-semibold text-slate-900">{restaurant.name}</p>
                        <p className="text-xs text-slate-500">/{restaurant.slug}</p>
                      </div>
                    ))}
                  {restaurants.length === 0 ? (
                    <p className="text-xs text-slate-500">No restaurants yet. Create your first workspace.</p>
                  ) : null}
                </div>
              </Card>

              <Card className="rounded-3xl border border-slate-200 bg-[linear-gradient(160deg,#052e1b,#0b6c43)] p-5 text-emerald-50 shadow-none">
                <p className="text-sm font-bold">Session</p>
                <p className="mt-2 text-3xl font-black tracking-tight">{loading ? "Syncing..." : "Online"}</p>
                <p className="mt-1 text-xs text-emerald-100/80">Firebase data connected</p>
              </Card>
            </div>
          </div>

          <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
            <div id="create">
            <Card className="rounded-3xl border border-slate-200 bg-white p-5 shadow-none">
              <h2 className="text-xl font-black tracking-tight text-slate-900">Create Restaurant Landing Page</h2>
              <p className="mt-1 text-sm text-slate-600">Add a new tenant page available at /[slug].</p>
              <form className="mt-4 grid gap-3 sm:grid-cols-2" onSubmit={onCreateRestaurant}>
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
                  className="rounded-xl border border-slate-200 px-4 py-2.5 sm:col-span-2"
                  required
                />
                <input
                  placeholder="Hero Title"
                  value={newRestaurant.heroTitle}
                  onChange={(e) => setNewRestaurant((p) => ({ ...p, heroTitle: e.target.value }))}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 sm:col-span-2"
                  required
                />
                <textarea
                  rows={3}
                  placeholder="Hero Subtitle"
                  value={newRestaurant.heroSubtitle}
                  onChange={(e) => setNewRestaurant((p) => ({ ...p, heroSubtitle: e.target.value }))}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 sm:col-span-2"
                  required
                />
                <Button type="submit" className="w-fit sm:col-span-2" disabled={createLoading || loading}>
                  {createLoading ? "Creating..." : "Create Restaurant"}
                </Button>
              </form>
            </Card>
            </div>

            <div id="restaurants">
            <Card className="rounded-3xl border border-slate-200 bg-white p-5 shadow-none">
              <h2 className="text-lg font-black tracking-tight text-slate-900">
                {isSuperAdmin ? "All Restaurants" : "Your Restaurants"}
              </h2>
              <p className="mt-1 text-sm text-slate-600">Quick list for direct access.</p>
              <div className="mt-4 space-y-3">
                {filteredRestaurants.slice(0, 6).map((restaurant) => (
                  <div key={restaurant.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <p className="text-sm font-semibold text-slate-900">{restaurant.name}</p>
                    <p className="text-xs text-slate-500">/{restaurant.slug}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <Link
                        href={`/admin/${restaurant.id}`}
                        className="rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs font-semibold text-slate-800 transition-colors hover:bg-white"
                      >
                        Edit
                      </Link>
                      <Link
                        href={`/${restaurant.slug}`}
                        className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-white"
                      >
                        Visit
                      </Link>
                    </div>
                  </div>
                ))}
                {filteredRestaurants.length === 0 ? (
                  <p className="text-sm text-slate-500">No restaurants linked to this account.</p>
                ) : null}
              </div>
            </Card>
            </div>
          </div>

          {isSuperAdmin ? (
            <div id="admins">
            <Card className="mt-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-none">
              <h2 className="text-xl font-black tracking-tight text-slate-900">All Admin Accounts</h2>
              <p className="mt-1 text-sm text-slate-600">Owner accounts with assigned restaurant count.</p>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {admins.map((a) => (
                  <div key={a.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm font-semibold text-slate-900">{a.email}</p>
                    <p className="mt-1 text-xs text-slate-600">
                      UID: {a.id} | Role: {a.role} | Restaurants: {restaurantsByOwner.get(a.id) || 0}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}

