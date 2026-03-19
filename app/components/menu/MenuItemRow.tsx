"use client";

export type MenuListItem = {
  name: string;
  description: string;
  priceInr: number;
};

function formatInr(amount: number) {
  return new Intl.NumberFormat("en-IN").format(amount);
}

export function MenuItemRow({ item }: { item: MenuListItem }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <div className="min-w-0">
        <p className="text-sm font-bold text-slate-900 sm:text-base">
          {item.name}
        </p>
        <p className="mt-1 text-sm leading-6 text-slate-600">
          {item.description}
        </p>
      </div>
      <p className="shrink-0 text-sm font-bold text-slate-900 sm:text-base">
        ₹{formatInr(item.priceInr)}
      </p>
    </div>
  );
}

