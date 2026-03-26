"use client";

import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { UserProfile, UserRole } from "@/types";

/**
 * Fetch user profile by UID
 */
export async function getUserProfileByUid(uid: string): Promise<UserProfile | null> {
  const snapshot = await getDoc(doc(db, "users", uid));
  if (!snapshot.exists()) return null;
  return {
    id: snapshot.id,
    ...(snapshot.data() as Omit<UserProfile, "id">),
  };
}

/**
 * Create or update user profile with role
 */
export async function upsertUserProfile(input: {
  uid: string;
  email: string;
  role: UserRole;
  name?: string;
  restaurantId?: string;
}): Promise<void> {
  const data: any = {
    email: input.email,
    role: input.role,
    name: input.name ?? "",
    createdAt: serverTimestamp(),
  };

  if (input.restaurantId) {
    data.restaurantId = input.restaurantId;
  }

  await setDoc(doc(db, "users", input.uid), data, { merge: true });
}

/**
 * Fetch all user profiles
 */
export async function getAllUserProfiles(): Promise<UserProfile[]> {
  const snapshot = await getDocs(collection(db, "users"));
  return snapshot.docs.map((item) => ({
    id: item.id,
    ...(item.data() as Omit<UserProfile, "id">),
  }));
}

/**
 * Find user by email (for admin assignment)
 */
export async function getUserByEmail(email: string): Promise<UserProfile | null> {
  const snapshot = await getDocs(
    query(collection(db, "users"), where("email", "==", email.toLowerCase()))
  );

  if (snapshot.docs.length === 0) return null;

  const doc = snapshot.docs[0];
  return {
    id: doc.id,
    ...(doc.data() as Omit<UserProfile, "id">),
  };
}

/**
 * Get all restaurant admins
 */
export async function getRestaurantAdmins(): Promise<UserProfile[]> {
  const snapshot = await getDocs(
    query(collection(db, "users"), where("role", "==", "restaurant_admin"))
  );
  return snapshot.docs.map((item) => ({
    id: item.id,
    ...(item.data() as Omit<UserProfile, "id">),
  }));
}

/**
 * Get restaurant admin for a specific restaurant
 */
export async function getRestaurantAdmin(restaurantId: string): Promise<UserProfile | null> {
  const snapshot = await getDocs(
    query(
      collection(db, "users"),
      where("role", "==", "restaurant_admin"),
      where("restaurantId", "==", restaurantId)
    )
  );

  if (snapshot.docs.length === 0) return null;

  const doc = snapshot.docs[0];
  return {
    id: doc.id,
    ...(doc.data() as Omit<UserProfile, "id">),
  };
}

/**
 * Assign a restaurant to an admin user
 */
export async function assignRestaurantAdmin(
  userEmail: string,
  restaurantId: string,
  role: "restaurant_admin" = "restaurant_admin"
): Promise<UserProfile | null> {
  // Check if email-based lookup can find (not by UID, by email)
  const existing = await getUserByEmail(userEmail);
  
  if (!existing) {
    return null; // User must exist first
  }

  // Update user's restaurantId and ensure role is set correctly
  await updateDoc(doc(db, "users", existing.id), {
    role,
    restaurantId,
  });

  return {
    ...existing,
    role,
    restaurantId,
  };
}
