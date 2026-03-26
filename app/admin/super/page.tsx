"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  getAllRestaurants,
  getUserProfileByUid,
  createRestaurant,
  assignRestaurantAdmin,
  getUserByEmail,
} from "@/lib/queries";
import { isSuperAdmin } from "@/lib/auth-helpers";
import type { Restaurant, UserProfile } from "@/types";
import { Button } from "@/app/components/ui/Button";
import { Card } from "@/app/components/ui/Card";
import { RestaurantList } from "@/components/super-admin/RestaurantList";
import { QuickSetupWizard } from "@/components/super-admin/QuickSetupWizard";
import { AssignAdminModal } from "@/components/super-admin/AssignAdminModal";

const SUPER_ADMIN_EMAIL = process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL?.trim().toLowerCase() || "";

export default function SuperAdminPage() {
  const router = useRouter();
  const [authLoading, setAuthLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [restaurantAdmins, setRestaurantAdmins] = useState<Map<string, UserProfile>>(new Map());
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check auth state and fetch profile
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser);

      if (!nextUser) {
        setAuthLoading(false);
        router.push("/admin");
        return;
      }

      try {
        const userProfile = await getUserProfileByUid(nextUser.uid);
        setProfile(userProfile);

        // Check if user is super admin
        if (!isSuperAdmin(userProfile)) {
          router.push("/admin");
          return;
        }

        // Load restaurants and admins
        const allRestaurants = await getAllRestaurants();
        setRestaurants(allRestaurants);

        // Build admin map
        const adminMap = new Map<string, UserProfile>();
        // You'd need to implement getRestaurantAdmin to populate this
        // For now, leaving as empty - can be enhanced later
        setRestaurantAdmins(adminMap);
      } catch (err) {
        console.error("Error loading profile:", err);
        setError("Failed to load profile.");
      } finally {
        setAuthLoading(false);
      }
    });

    return () => unsub();
  }, [router]);

  const handleCreateRestaurant = async (data: any) => {
    setLoading(true);
    setError(null);

    try {
      if (!user) {
        throw new Error("Not authenticated");
      }

      // Use template to fill in defaults
      const { generateRestaurantTemplate } = await import("@/lib/restaurant-template");
      const restaurantData = generateRestaurantTemplate({
        name: data.name,
        slug: data.slug,
        address: data.address,
        whatsappNumber: data.whatsappNumber,
        couponCode: data.couponCode,
        heroTitle: data.heroTitle,
        heroSubtitle: data.heroSubtitle,
        ownerUid: user.uid,
      });

      const restaurantId = await createRestaurant(restaurantData);

      // Reload restaurants
      const updatedRestaurants = await getAllRestaurants();
      setRestaurants(updatedRestaurants);
      setShowCreateModal(false);
    } catch (err: any) {
      setError(err.message || "Failed to create restaurant");
    } finally {
      setLoading(false);
    }
  };

  const handleAssignAdmin = async (email: string) => {
    setLoading(true);
    setError(null);

    try {
      if (!selectedRestaurant) {
        throw new Error("No restaurant selected");
      }

      // Check if user exists
      const existingUser = await getUserByEmail(email);
      if (!existingUser) {
        throw new Error("User with this email does not exist. User must sign up first.");
      }

      // Assign the restaurant to the user
      await assignRestaurantAdmin(email, selectedRestaurant.id, "restaurant_admin");

      // Update restaurants (in case ownerUid changed)
      const updatedRestaurants = await getAllRestaurants();
      setRestaurants(updatedRestaurants);
      
      setShowAssignModal(false);
      setSelectedRestaurant(null);
    } catch (err: any) {
      setError(err.message || "Failed to assign admin");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/admin");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  if (authLoading) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-10 sm:px-8">
        <p className="text-sm text-slate-600">Loading super admin dashboard...</p>
      </main>
    );
  }

  if (!user || !profile || !isSuperAdmin(profile)) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-10 sm:px-8">
        <Card className="p-6 sm:p-8">
          <p className="text-sm text-red-600">
            Access denied. Only super admins can access this page.
          </p>
          <Link href="/admin">
            <Button className="mt-4">Back to Admin</Button>
          </Link>
        </Card>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-10 sm:px-8">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Super Admin</h1>
          <p className="mt-2 text-sm text-slate-600">
            Manage all restaurants and platform administrators
          </p>
        </div>
        <Button variant="secondary" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      {error ? (
        <Card className="mb-6 border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-800">{error}</p>
          <button
            onClick={() => setError(null)}
            className="mt-2 text-xs text-red-600 underline hover:text-red-700"
          >
            Dismiss
          </button>
        </Card>
      ) : null}

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        <Card className="p-6">
          <p className="text-sm text-slate-600">Total Restaurants</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{restaurants.length}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-slate-600">User Email</p>
          <p className="mt-2 truncate text-base font-semibold text-slate-900">{profile.email}</p>
        </Card>
      </div>

      {/* Restaurant List */}
      <RestaurantList
        restaurants={restaurants}
        restaurantAdmins={restaurantAdmins}
        onCreateClick={() => setShowCreateModal(true)}
        onAssignClick={(restaurantId) => {
          const restaurant = restaurants.find((r) => r.id === restaurantId);
          if (restaurant) {
            setSelectedRestaurant(restaurant);
            setShowAssignModal(true);
          }
        }}
      />

      {/* Modals */}
      <QuickSetupWizard
        open={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setError(null);
        }}
        onSubmit={handleCreateRestaurant}
        loading={loading}
      />

      <AssignAdminModal
        open={showAssignModal}
        onClose={() => {
          setShowAssignModal(false);
          setSelectedRestaurant(null);
          setError(null);
        }}
        restaurant={selectedRestaurant}
        onSubmit={handleAssignAdmin}
        loading={loading}
      />
    </main>
  );
}
