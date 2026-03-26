"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  type User,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  getUserProfileByUid,
  getRestaurantsByOwnerUid,
  upsertUserProfile,
} from "@/lib/queries";
import { getRedirectPathForUser } from "@/lib/auth-helpers";
import type { Restaurant, UserProfile } from "@/types";
import { AdminPageHeader } from "@/components/admin/home/AdminPageHeader";
import { AdminLoginCard } from "@/components/admin/home/AdminLoginCard";
import { AdminAccountCard } from "@/components/admin/home/AdminAccountCard";
import { AdminWorkspaceCard } from "@/components/admin/home/AdminWorkspaceCard";

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
        <AdminPageHeader />

        {!user ? (
          <AdminLoginCard
            email={email}
            password={password}
            loading={loading}
            error={error}
            onEmailChange={setEmail}
            onPasswordChange={setPassword}
            onSubmit={onSubmit}
          />
        ) : (
          <div className="grid gap-6">
            <AdminAccountCard user={user} userProfile={userProfile} />
            <AdminWorkspaceCard
              userProfile={userProfile}
              restaurants={restaurants}
              workspacePath={workspacePath}
            />
          </div>
        )}
      </div>
    </main>
  );
}
