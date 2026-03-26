import { redirect } from "next/navigation";
import { getCachedRestaurantBySlug } from "@/lib/server-queries";

export default async function MiriAdminEntryPage() {
  const restaurant = await getCachedRestaurantBySlug("miri");

  if (!restaurant) {
    redirect("/admin/dashboard");
  }

  redirect(`/admin/${restaurant.id}`);
}
