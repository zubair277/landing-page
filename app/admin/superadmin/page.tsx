"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getAllRestaurants, getAllUserProfiles, getUserProfileByUid } from "@/lib/queries";
import type { Restaurant, UserProfile } from "@/types";
import { Button } from "@/app/components/ui/Button";
import { Card } from "@/app/components/ui/Card";

export default function SuperAdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [admins, setAdmins] = useState<UserProfile[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [search, setSearch] = useState("");
  const [creating, setCreating] = useState(false);
  const [deletingUid, setDeletingUid] = useState<string | null>(null);
  const [newAdmin, setNewAdmin] = useState({
    email: "",
    password: "",
    name: "",
  });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setAuthLoading(false);
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    const load = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const me = await getUserProfileByUid(user.uid);
        setProfile(me);

        if (me?.role !== "super_admin") {
          setError("Only super admins can access this page.");
          setLoading(false);
          return;
        }

        const [allAdmins, allRestaurants] = await Promise.all([
          getAllUserProfiles(),
          getAllRestaurants(),
        ]);

        setAdmins(allAdmins);
        setRestaurants(allRestaurants);
      } catch {
        setError("Failed to load super admin data.");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [user]);

  const reload = async () => {
    if (!user) return;
    const [allAdmins, allRestaurants] = await Promise.all([
      getAllUserProfiles(),
      getAllRestaurants(),
    ]);
    setAdmins(allAdmins);
    setRestaurants(allRestaurants);
  };

  const restaurantsByOwner = useMemo(() => {
    const map = new Map<string, Restaurant[]>();
    restaurants.forEach((restaurant) => {
      const list = map.get(restaurant.ownerUid) ?? [];
      list.push(restaurant);
      map.set(restaurant.ownerUid, list);
    });
    return map;
  }, [restaurants]);

  const filteredAdmins = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return admins;
    return admins.filter((admin) => {
      const email = admin.email.toLowerCase();
      const restaurantsText = (restaurantsByOwner.get(admin.id) || [])
        .map((restaurant) => `${restaurant.name} ${restaurant.slug}`.toLowerCase())
        .join(" ");
      return email.includes(q) || restaurantsText.includes(q);
    });
  }, [admins, restaurantsByOwner, search]);

  const onCreateAdmin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    setCreating(true);
    setError(null);
    setMessage(null);

    try {
      const token = await user.getIdToken();
      const response = await fetch("/api/superadmin/admins", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: newAdmin.email,
          password: newAdmin.password,
          name: newAdmin.name,
          role: "owner",
        }),
      });

      const result = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(result.error || "Failed to create admin.");
      }

      setNewAdmin({ email: "", password: "", name: "" });
      await reload();
      setMessage("New admin created successfully.");
    } catch (err) {
      const messageText = err instanceof Error ? err.message : "Failed to create admin.";
      setError(messageText);
    } finally {
      setCreating(false);
    }
  };

  const onDeleteAdmin = async (uid: string) => {
    if (!user) return;
    setDeletingUid(uid);
    setError(null);
    setMessage(null);

    try {
      const token = await user.getIdToken();
      const response = await fetch(`/api/superadmin/admins/${uid}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(result.error || "Failed to remove admin.");
      }

      await reload();
      setMessage("Admin removed successfully.");
    } catch (err) {
      const messageText = err instanceof Error ? err.message : "Failed to remove admin.";
      setError(messageText);
    } finally {
      setDeletingUid(null);
    }
  };

  if (authLoading) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-10 sm:px-8">
        <p className="text-sm text-slate-600">Checking authentication...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-10 sm:px-8">
        <Card className="p-6">
          <p className="text-sm text-slate-700">You must be signed in to access this page.</p>
          <Link href="/admin" className="mt-4 inline-block text-sm font-semibold text-slate-900 underline">
            Go to admin login
          </Link>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-slate-50 to-white p-4 sm:p-6 lg:p-8">
      <section className="w-full">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">Super Admin</h1>
                <p className="mt-1 text-sm text-slate-600">Manage admins and linked restaurants.</p>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href="/admin/dashboard"
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                >
                  Back
                </Link>
                <Button variant="secondary" onClick={() => signOut(auth)}>
                  Sign out
                </Button>
              </div>
            </div>

            {loading ? <p className="text-sm text-slate-600">Loading data...</p> : null}
            {message ? <p className="mb-4 text-sm text-emerald-600">{message}</p> : null}
            {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}

            {!loading && !error && profile?.role === "super_admin" ? (
              <div className="grid gap-5">
                <div className="grid gap-5 xl:grid-cols-[1.1fr_1fr]">
                  <Card className="p-5 sm:p-6">
                    <h2 className="text-lg font-bold text-slate-900">Create Admin</h2>
                    <p className="mt-1 text-sm text-slate-600">Provision a new owner login account.</p>
                    <form className="mt-4 grid gap-3" onSubmit={onCreateAdmin}>
                      <input
                        type="email"
                        value={newAdmin.email}
                        onChange={(e) => setNewAdmin((prev) => ({ ...prev, email: e.target.value }))}
                        placeholder="Admin email"
                        className="rounded-xl border border-slate-200 bg-white px-4 py-2.5"
                        required
                      />
                      <input
                        type="password"
                        value={newAdmin.password}
                        onChange={(e) => setNewAdmin((prev) => ({ ...prev, password: e.target.value }))}
                        placeholder="Temporary password"
                        className="rounded-xl border border-slate-200 bg-white px-4 py-2.5"
                        minLength={6}
                        required
                      />
                      <input
                        value={newAdmin.name}
                        onChange={(e) => setNewAdmin((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="Display name (optional)"
                        className="rounded-xl border border-slate-200 bg-white px-4 py-2.5"
                      />
                      <Button type="submit" className="w-fit" disabled={creating}>
                        {creating ? "Creating..." : "Create Admin"}
                      </Button>
                    </form>
                  </Card>

                  <Card className="p-5 sm:p-6">
                    <h2 className="text-lg font-bold text-slate-900">Directory Filters</h2>
                    <p className="mt-1 text-sm text-slate-600">Filter by admin email, restaurant name or slug.</p>
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search admins or restaurants"
                      className="mt-4 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5"
                    />
                    <p className="mt-3 text-xs text-slate-500">Showing {filteredAdmins.length} admin accounts</p>
                  </Card>
                </div>

                <Card className="overflow-hidden p-0">
                  <div className="overflow-x-auto">
                    <table className="min-w-[920px] w-full border-collapse">
                      <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                        <tr>
                          <th className="px-4 py-3 font-semibold">Admin</th>
                          <th className="px-4 py-3 font-semibold">Role</th>
                          <th className="px-4 py-3 font-semibold">Restaurants</th>
                          <th className="px-4 py-3 font-semibold">Linked Names</th>
                          <th className="px-4 py-3 text-right font-semibold">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredAdmins.map((admin) => {
                          const ownedRestaurants = restaurantsByOwner.get(admin.id) ?? [];
                          const isSelf = admin.id === user.uid;
                          const canDelete = !isSelf && admin.role !== "super_admin" && ownedRestaurants.length === 0;

                          return (
                            <tr key={admin.id} className="border-t border-slate-200 text-sm text-slate-700">
                              <td className="px-4 py-4">
                                <p className="font-semibold text-slate-900">{admin.email}</p>
                                <p className="mt-1 text-xs text-slate-500">UID: {admin.id}</p>
                              </td>
                              <td className="px-4 py-4">
                                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                                  {admin.role}
                                </span>
                              </td>
                              <td className="px-4 py-4 font-semibold">{ownedRestaurants.length}</td>
                              <td className="px-4 py-4">
                                {ownedRestaurants.length === 0 ? (
                                  <span className="text-xs text-slate-500">No restaurants linked</span>
                                ) : (
                                  <div className="flex flex-wrap gap-2">
                                    {ownedRestaurants.map((restaurant) => (
                                      <span
                                        key={restaurant.id}
                                        className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-700"
                                      >
                                        {restaurant.name}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </td>
                              <td className="px-4 py-4 text-right">
                                <div className="inline-flex items-center gap-2">
                                  {ownedRestaurants[0] ? (
                                    <Link
                                      href={`/admin/${ownedRestaurants[0].id}`}
                                      className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                                    >
                                      Open
                                    </Link>
                                  ) : null}
                                  <Button
                                    variant="secondary"
                                    disabled={Boolean(deletingUid) || !canDelete}
                                    onClick={() => void onDeleteAdmin(admin.id)}
                                  >
                                    {deletingUid === admin.id ? "Removing..." : "Remove"}
                                  </Button>
                                </div>
                                {!canDelete ? (
                                  <p className="mt-1 text-xs text-slate-400">
                                    {isSelf
                                      ? "Cannot remove self"
                                      : admin.role === "super_admin"
                                      ? "Cannot remove another super admin"
                                      : "Reassign restaurants first"}
                                  </p>
                                ) : null}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </div>
            ) : null}
      </section>
    </main>
  );
}
