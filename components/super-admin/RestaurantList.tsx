"use client";

import Link from "next/link";
import type { Restaurant, UserProfile } from "@/types";
import { Card } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";

export function RestaurantList({
  restaurants,
  restaurantAdmins,
  onCreateClick,
  onAssignClick,
}: {
  restaurants: Restaurant[];
  restaurantAdmins: Map<string, UserProfile>;
  onCreateClick: () => void;
  onAssignClick: (restaurantId: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">All Restaurants</h2>
          <p className="mt-1 text-sm text-slate-600">{restaurants.length} restaurant(s) in the system</p>
        </div>
        <Button onClick={onCreateClick}>+ New Restaurant</Button>
      </div>

      {restaurants.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-sm text-slate-600">No restaurants yet. Create one to get started.</p>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {restaurants.map((restaurant) => {
            const admin = restaurantAdmins.get(restaurant.id);
            return (
              <Card key={restaurant.id} className="p-6">
                <div className="mb-4 flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-bold text-slate-900">{restaurant.name}</h3>
                    <p className="text-sm text-slate-600">/{restaurant.slug}</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4 text-sm">
                  <p>
                    <span className="text-slate-600">Address:</span>{" "}
                    <span className="font-medium text-slate-900">{restaurant.address}</span>
                  </p>
                  <p>
                    <span className="text-slate-600">Admin:</span>{" "}
                    <span className="font-medium text-slate-900">
                      {admin?.name || admin?.email || "Not assigned"}
                    </span>
                  </p>
                  <p>
                    <span className="text-slate-600">WhatsApp:</span>{" "}
                    <span className="font-medium text-slate-900">{restaurant.whatsappNumber}</span>
                  </p>
                </div>

                <div className="flex gap-2">
                  <Link href={`/admin/${restaurant.id}`}>
                    <Button variant="secondary" className="text-sm">
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="secondary"
                    className="text-sm"
                    onClick={() => onAssignClick(restaurant.id)}
                  >
                    Assign Admin
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
