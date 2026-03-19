"use client";

import { ImageWithSkeleton } from "@/app/components/ui/ImageWithSkeleton";

export type MenuItem = {
  name: string;
  description: string;
  priceInr: number;
  image: string;
};

function formatInr(amount: number) {
  return new Intl.NumberFormat("en-IN").format(amount);
}

export function MenuItemCard({ item }: { item: MenuItem }) {
  return (
    <div className="group flex gap-4 rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200 transition-all duration-200 hover:-translate-y-[1px] hover:shadow-md">
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-100 sm:h-24 sm:w-24">
        <ImageWithSkeleton
          src={item.image}
          alt={item.name}
          fill
          sizes="96px"
          imgClassName="object-cover"
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-4">
          <p className="truncate text-sm font-bold text-slate-900 sm:text-base">
            {item.name}
          </p>
          <p className="shrink-0 text-sm font-bold text-slate-900 sm:text-base">
            ₹{formatInr(item.priceInr)}
          </p>
        </div>
        <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-500">
          {item.description}
        </p>
      </div>
    </div>
  );
}

