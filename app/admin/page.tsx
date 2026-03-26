"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  getUserProfileByUid,
  getRestaurantsByOwnerUid,
  upsertUserProfile,
} from "@/lib/queries";
import { getRedirectPathForUser, isSuperAdmin } from "@/lib/auth-helpers";
import type { Restaurant, UserProfile } from "@/types";
import { Button } from "@/app/components/ui/Button";
import { Card } from "@/app/components/ui/Card";

export default function AdminHomePage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [workspacePath, setWorkspacePath] = useState<string | null>(null);

  // Monitor auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser);

      if (!nextUser) {
        setUserProfile(null);
        setAuthLoading(false);
        return;
      }

      try {
        const profile = await getUserProfileByUid(nextUser.uid);
        setUserProfile(profile);

        // Super admin gets immediate redirect.
        if (profile?.role === "super_admin") {
          router.replace(getRedirectPathForUser(profile));
          return;
        }

        // Load owned restaurants for modern + legacy users.
        const ownedRestaurants = await getRestaurantsByOwnerUid(nextUser.uid);
        setRestaurants(ownedRestaurants);

        const rawRole = (profile as { role?: string } | null)?.role;
        const resolvedRestaurantId = profile?.restaurantId || ownedRestaurants[0]?.id;

        // Restaurant admin with an assigned restaurant: go directly to workspace.
        if (profile?.role === "restaurant_admin" && resolvedRestaurantId) {
          const target = `/admin/${resolvedRestaurantId}`;
          setWorkspacePath(target);
          router.replace(target);
          return;
        }

        // Legacy role migration: owner -> restaurant_admin.
        if (rawRole === "owner" && resolvedRestaurantId) {
          await upsertUserProfile({
            uid: nextUser.uid,
            email: nextUser.email || "",
            role: "restaurant_admin",
            name: nextUser.displayName || "",
            restaurantId: resolvedRestaurantId,
          });

          const target = `/admin/${resolvedRestaurantId}`;
          setWorkspacePath(target);
          router.replace(target);
          return;
        }

        // No redirect candidate; keep a usable button target when possible.
        if (resolvedRestaurantId) {
          setWorkspacePath(`/admin/${resolvedRestaurantId}`);
        } else {
          setWorkspacePath(null);
        }
      } catch (err) {
        console.error("Error loading profile:", err);
      } finally {
        setAuthLoading(false);
      }
    });

    return () => unsub();
  }, [router]);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setEmail("");
      setPassword("");
      // Let useEffect handle the redirect based on role
    } catch (err: any) {
      setError(err.message || "Login failed. Check your credentials and try again.");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-10 sm:px-8">
        <p className="text-sm text-slate-600">Loading admin panel...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(1000px_480px_at_0%_0%,rgba(37,211,102,0.18),transparent_55%),radial-gradient(1000px_520px_at_100%_0%,rgba(16,185,129,0.14),transparent_55%)] px-4 py-8 sm:px-8 sm:py-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 rounded-3xl border border-emerald-100 bg-white/90 p-6 shadow-lg backdrop-blur sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
            Admin Access
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900">Dashboard</h1>
          <p className="mt-2 text-sm text-slate-600">
            Manage restaurants, menu items, testimonials, and media content in one streamlined workspace.
          </p>
        </div>

        {!user ? (
        <Card className="p-6 sm:p-8">
          <h2 className="text-xl font-bold text-slate-900">Sign in</h2>
          <p className="mt-1 text-sm text-slate-600">Use your admin account.</p>

          <form onSubmit={onSubmit} className="mt-6 grid gap-4">
            <label className="grid gap-1 text-sm text-slate-700">
              Email
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                className="rounded-xl border border-slate-200 px-4 py-2.5 outline-none ring-[#25D366]/40 focus:ring-2"
                required
              />
            </label>

            <label className="grid gap-1 text-sm text-slate-700">
              Password
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                className="rounded-xl border border-slate-200 px-4 py-2.5 outline-none ring-[#25D366]/40 focus:ring-2"
                required
              />
            </label>

            {error ? <p className="text-sm text-red-600">{error}</p> : null}

            <Button type="submit" disabled={loading} className="w-fit">
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </Card>
        ) : (
        <div className="grid gap-6">
          <Card className="p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm text-slate-600">Signed in as</p>
                <p className="text-base font-semibold text-slate-900">{user.email}</p>
                {userProfile ? (
                  <p className="mt-1 text-xs text-slate-500">Role: {userProfile.role}</p>
                ) : null}
              </div>
              <Button variant="secondary" onClick={() => signOut(auth)}>
                Sign out
              </Button>
            </div>
          </Card>

          {/* Show role status if available, otherwise show old restaurant list */}
          {userProfile?.role === "super_admin" || userProfile?.role === "restaurant_admin" ? (
            <Card className="p-6 sm:p-8">
              <p className="text-sm text-slate-600">
                {isSuperAdmin(userProfile)
                  ? "You are a Super Admin. Click below to access the platform."
                  : "Your restaurant workspace is ready."}
              </p>
              <Link href={isSuperAdmin(userProfile) ? "/admin/super" : (workspacePath || getRedirectPathForUser(userProfile))}>
                <Button className="mt-4">
                  {isSuperAdmin(userProfile) ? "Open Super Admin" : "Open Restaurant"}
                </Button>
              </Link>
            </Card>
          ) : (
            <Card className="p-6 sm:p-8">
              <h2 className="text-xl font-bold text-slate-900">Your Restaurants</h2>
              <p className="mt-1 text-sm text-slate-600">Open a workspace to edit content.</p>

              <div className="mt-5 grid gap-3">
                {restaurants.length === 0 ? (
                  <p className="text-sm text-slate-500">
                    No restaurants linked to this account.
                  </p>
                ) : (
                  restaurants.map((restaurant) => (
                    <Link
                      key={restaurant.id}
                      href={`/admin/${restaurant.id}`}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-50"
                    >
                      {restaurant.name} ({restaurant.slug})
                    </Link>
                  ))
                )}
              </div>
            </Card>
          )}
        </div>
        )}
      </div>
    </main>
  );
}
