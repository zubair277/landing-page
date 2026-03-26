import { redirect } from "next/navigation";
import { getCachedRestaurantBySlug } from "@/lib/server-queries";

export default async function PizzaAdminEntryPage() {
  const restaurant = await getCachedRestaurantBySlug("pizza");

  if (!restaurant) {
    redirect("/admin/dashboard");
  }

  redirect(`/admin/${restaurant.id}`);
}
