import "server-only";

import { unstable_cache } from "next/cache";
import { getAdminDb } from "@/lib/firebase-admin";
import type { Dish, MediaItem, Restaurant, RestaurantPageData, Testimonial } from "@/types";

async function readRestaurantBySlug(slug: string): Promise<Restaurant | null> {
  const adminDb = getAdminDb();
  const snapshot = await adminDb
    .collection("restaurants")
    .where("slug", "==", slug)
    .limit(1)
    .get();

  if (snapshot.empty) {
    return null;
  }

  const doc = snapshot.docs[0];
  const data = doc.data() as Omit<Restaurant, "id">;
  return { id: doc.id, ...data };
}

export async function getCachedRestaurantBySlug(slug: string) {
  const cached = unstable_cache(
    async (restaurantSlug: string) => readRestaurantBySlug(restaurantSlug),
    ["restaurant-by-slug", slug],
    { revalidate: 5, tags: [`restaurant:${slug}`] }
  );

  return cached(slug);
}

async function readDefaultRestaurantSlug(): Promise<string | null> {
  const adminDb = getAdminDb();
  const snapshot = await adminDb.collection("restaurants").limit(1).get();

  if (snapshot.empty) {
    return null;
  }

  const data = snapshot.docs[0].data() as Partial<Restaurant>;
  const slug = data.slug?.trim();
  return slug ? slug : null;
}

async function readDishes(restaurantId: string): Promise<Dish[]> {
  const adminDb = getAdminDb();
  const snapshot = await adminDb
    .collection("dishes")
    .where("restaurantId", "==", restaurantId)
    .get();

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Dish, "id">),
  }));
}

async function readTestimonials(restaurantId: string): Promise<Testimonial[]> {
  const adminDb = getAdminDb();
  const snapshot = await adminDb
    .collection("testimonials")
    .where("restaurantId", "==", restaurantId)
    .get();

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Testimonial, "id">),
  }));
}

async function readMedia(restaurantId: string): Promise<MediaItem[]> {
  const adminDb = getAdminDb();
  const snapshot = await adminDb
    .collection("media")
    .where("restaurantId", "==", restaurantId)
    .get();

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<MediaItem, "id">),
  }));
}

export async function getRestaurantPageData(slug: string): Promise<RestaurantPageData | null> {
  const restaurant = await readRestaurantBySlug(slug);
  if (!restaurant) {
    return null;
  }

  const [dishes, testimonials, media] = await Promise.all([
    readDishes(restaurant.id),
    readTestimonials(restaurant.id),
    readMedia(restaurant.id),
  ]);

  return {
    restaurant,
    dishes,
    testimonials,
    media,
  };
}

export async function getCachedRestaurantPageData(slug: string) {
  const cached = unstable_cache(
    async (restaurantSlug: string) => getRestaurantPageData(restaurantSlug),
    ["restaurant-page", slug],
    { revalidate: 5, tags: [`restaurant:${slug}`] }
  );

  return cached(slug);
}

export async function getCachedDefaultRestaurantSlug() {
  const cached = unstable_cache(async () => readDefaultRestaurantSlug(), ["restaurant-default-slug"], {
    revalidate: 5,
    tags: ["restaurants"],
  });

  return cached();
}
