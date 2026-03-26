import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { RestaurantLanding } from "@/app/components/RestaurantLanding";
import { getCachedRestaurantPageData } from "@/lib/server-queries";

export const revalidate = 5;

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await getCachedRestaurantPageData(slug);

  if (!data) {
    return {
      title: "Restaurant Not Found",
      description: "The requested restaurant page does not exist.",
    };
  }

  return {
    title: `${data.restaurant.name} - 20% Off Coupon`,
    description: data.restaurant.heroSubtitle,
  };
}

export default async function RestaurantPage({ params }: Props) {
  const { slug } = await params;
  const data = await getCachedRestaurantPageData(slug);

  if (!data) {
    redirect("/");
  }

  return <RestaurantLanding data={data} />;
}
