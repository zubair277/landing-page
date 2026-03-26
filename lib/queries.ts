"use client";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import type {
  CreateDishInput,
  CreateMediaInput,
  CreateRestaurantInput,
  CreateTestimonialInput,
  Dish,
  MediaItem,
  Restaurant,
  RestaurantUpdateInput,
  Testimonial,
  UpdateDishInput,
  UpdateMediaInput,
  UpdateTestimonialInput,
  UserProfile,
} from "@/types";
import {
  upsertUserProfile,
  getUserProfileByUid,
  getAllUserProfiles,
  getUserByEmail,
  getRestaurantAdmins,
  getRestaurantAdmin,
  assignRestaurantAdmin,
} from "@/lib/auth-queries";

// Re-export auth queries for backward compatibility
export {
  upsertUserProfile,
  getUserProfileByUid,
  getAllUserProfiles,
  getUserByEmail,
  getRestaurantAdmins,
  getRestaurantAdmin,
  assignRestaurantAdmin,
} from "@/lib/auth-queries";

export async function createRestaurant(payload: CreateRestaurantInput): Promise<string> {
  const docRef = await addDoc(collection(db, "restaurants"), payload);
  return docRef.id;
}

export async function getAllRestaurants(): Promise<Restaurant[]> {
  const snapshot = await getDocs(collection(db, "restaurants"));
  return snapshot.docs.map((item) => ({
    id: item.id,
    ...(item.data() as Omit<Restaurant, "id">),
  }));
}

export async function getRestaurantsByOwnerUid(ownerUid: string): Promise<Restaurant[]> {
  const snapshot = await getDocs(
    query(collection(db, "restaurants"), where("ownerUid", "==", ownerUid))
  );

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...(item.data() as Omit<Restaurant, "id">),
  }));
}

export async function getRestaurantById(restaurantId: string): Promise<Restaurant | null> {
  const snapshot = await getDoc(doc(db, "restaurants", restaurantId));
  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...(snapshot.data() as Omit<Restaurant, "id">),
  };
}

export async function updateRestaurant(
  restaurantId: string,
  payload: RestaurantUpdateInput
): Promise<void> {
  await updateDoc(doc(db, "restaurants", restaurantId), payload);
}

export async function getDishesByRestaurant(restaurantId: string): Promise<Dish[]> {
  const snapshot = await getDocs(
    query(collection(db, "dishes"), where("restaurantId", "==", restaurantId))
  );

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...(item.data() as Omit<Dish, "id">),
  }));
}

export async function addDish(payload: CreateDishInput): Promise<void> {
  await addDoc(collection(db, "dishes"), payload);
}

export async function updateDish(dishId: string, payload: UpdateDishInput): Promise<void> {
  await updateDoc(doc(db, "dishes", dishId), payload);
}

export async function deleteDish(dishId: string): Promise<void> {
  await deleteDoc(doc(db, "dishes", dishId));
}

export async function getTestimonialsByRestaurant(restaurantId: string): Promise<Testimonial[]> {
  const snapshot = await getDocs(
    query(collection(db, "testimonials"), where("restaurantId", "==", restaurantId))
  );

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...(item.data() as Omit<Testimonial, "id">),
  }));
}

export async function addTestimonial(payload: CreateTestimonialInput): Promise<void> {
  await addDoc(collection(db, "testimonials"), payload);
}

export async function updateTestimonial(
  testimonialId: string,
  payload: UpdateTestimonialInput
): Promise<void> {
  await updateDoc(doc(db, "testimonials", testimonialId), payload);
}

export async function deleteTestimonial(testimonialId: string): Promise<void> {
  await deleteDoc(doc(db, "testimonials", testimonialId));
}

export async function getMediaByRestaurant(restaurantId: string): Promise<MediaItem[]> {
  const snapshot = await getDocs(
    query(collection(db, "media"), where("restaurantId", "==", restaurantId))
  );

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...(item.data() as Omit<MediaItem, "id">),
  }));
}

export async function addMedia(payload: CreateMediaInput): Promise<void> {
  await addDoc(collection(db, "media"), payload);
}

export async function updateMedia(mediaId: string, payload: UpdateMediaInput): Promise<void> {
  await updateDoc(doc(db, "media", mediaId), payload);
}

export async function deleteMedia(mediaId: string): Promise<void> {
  await deleteDoc(doc(db, "media", mediaId));
}

export async function uploadImage(restaurantId: string, file: File): Promise<string> {
  const normalizedName = file.name
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9._-]/g, "")
    .toLowerCase();
  const safeName = `${Date.now()}-${normalizedName}`;
  const fileRef = ref(storage, `restaurants/${restaurantId}/${safeName}`);

  await uploadBytes(fileRef, file, {
    contentType: file.type || "application/octet-stream",
    cacheControl: "public,max-age=3600",
  });

  return getDownloadURL(fileRef);
}

// Compatibility exports to avoid breaking existing imports during refactors.
export const getDishes = getDishesByRestaurant;
export const createDish = addDish;
export const getTestimonials = getTestimonialsByRestaurant;
export const createTestimonial = addTestimonial;
export const getMedia = getMediaByRestaurant;
export const createMedia = addMedia;
