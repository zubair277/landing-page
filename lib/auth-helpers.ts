import type { UserProfile } from "@/types";

/**
 * Get the redirect path based on user role
 * - Super Admin → /admin/super
 * - Restaurant Admin → /admin/{restaurantId}
 */
export function getRedirectPathForUser(user: UserProfile): string {
  if (user.role === "super_admin") {
    return "/admin/super";
  }
  if (user.role === "restaurant_admin" && user.restaurantId) {
    return `/admin/${user.restaurantId}`;
  }
  // Fallback - shouldn't happen if data is correct
  return "/admin";
}

/**
 * Check if a user is a super admin
 */
export function isSuperAdmin(user: UserProfile | null): boolean {
  return user?.role === "super_admin";
}

/**
 * Check if a user is a restaurant admin
 */
export function isRestaurantAdmin(user: UserProfile | null): boolean {
  return user?.role === "restaurant_admin";
}

/**
 * Check if user can access a specific restaurant
 */
export function canAccessRestaurant(
  user: UserProfile | null,
  restaurantId: string
): boolean {
  if (!user) return false;
  if (user.role === "super_admin") return true;
  if (user.role === "restaurant_admin") {
    return user.restaurantId === restaurantId;
  }
  return false;
}

/**
 * Check if user can manage admins (only super admin)
 */
export function canManageAdmins(user: UserProfile | null): boolean {
  return isSuperAdmin(user);
}

/**
 * Check if user can view all restaurants (only super admin)
 */
export function canViewAllRestaurants(user: UserProfile | null): boolean {
  return isSuperAdmin(user);
}
