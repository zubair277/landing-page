import Link from "next/link";
import type { Restaurant, UserProfile } from "@/types";
import { getRedirectPathForUser, isSuperAdmin } from "@/lib/auth-helpers";
import { Button } from "@/app/components/ui/Button";
import { Card } from "@/app/components/ui/Card";

type Props = {
  userProfile: UserProfile | null;
  restaurants: Restaurant[];
  workspacePath: string | null;
};

export function AdminWorkspaceCard({ userProfile, restaurants, workspacePath }: Props) {
  if (userProfile?.role === "super_admin" || userProfile?.role === "restaurant_admin") {
    const isSuper = isSuperAdmin(userProfile);
    const targetPath = isSuper ? "/admin/super" : workspacePath || getRedirectPathForUser(userProfile);

    return (
      <Card className="p-6 sm:p-8">
        <p className="text-sm text-slate-600">
          {isSuper
            ? "You are a Super Admin. Click below to access the platform."
            : "Your restaurant workspace is ready."}
        </p>
        <Link href={targetPath}>
          <Button className="mt-4">{isSuper ? "Open Super Admin" : "Open Restaurant"}</Button>
        </Link>
      </Card>
    );
  }

  return (
    <Card className="p-6 sm:p-8">
      <h2 className="text-xl font-bold text-slate-900">Your Restaurants</h2>
      <p className="mt-1 text-sm text-slate-600">Open a workspace to edit content.</p>

      <div className="mt-5 grid gap-3">
        {restaurants.length === 0 ? (
          <p className="text-sm text-slate-500">No restaurants linked to this account.</p>
        ) : (
          restaurants.map((restaurant) => (
            <Link
              key={restaurant.id}
              href={`/admin/${restaurant.id}`}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-50"
            >
              {restaurant.name} ({restaurant.slug})
            </Link>
          ))
        )}
      </div>
    </Card>
  );
}
