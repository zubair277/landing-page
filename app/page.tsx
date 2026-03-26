import { redirect } from "next/navigation";
import { getCachedDefaultRestaurantSlug } from "@/lib/server-queries";

export default async function HomePage() {
  const slug = await getCachedDefaultRestaurantSlug();

  if (slug) {
    redirect(`/${slug}`);
  }

  redirect("/admin");
}
