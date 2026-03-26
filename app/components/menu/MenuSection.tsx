"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Reveal } from "@/app/components/ui/Reveal";
import { MenuItemRow, type MenuListItem } from "@/app/components/menu/MenuItemRow";
import type { Dish } from "@/types";

type MenuCategoryData = {
  title: string;
  id: string;
  items: MenuListItem[];
};

function slugifyCategory(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export function MenuSection({
  dishes,
  eyebrow,
  title,
  subtitle,
}: {
  dishes: Dish[];
  eyebrow?: string;
  title?: string;
  subtitle?: string;
}) {
  const categories: MenuCategoryData[] = useMemo(
    () => {
      const byCategory = dishes.reduce<Record<string, MenuListItem[]>>((acc, dish) => {
        const key = dish.category?.trim() || "Menu";
        const list = acc[key] ?? [];
        list.push({
          name: dish.name,
          description: dish.description,
          priceInr: dish.price,
        });
        acc[key] = list;
        return acc;
      }, {});

      return Object.entries(byCategory).map(([title, items]) => ({
        title,
        id: slugifyCategory(title),
        items,
      }));
    },
    [dishes]
  );

  const [activeId, setActiveId] = useState(categories[0]?.id ?? "menu");
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const resolvedActiveId = categories.some((item) => item.id === activeId)
    ? activeId
    : (categories[0]?.id ?? "menu");

  useEffect(() => {
    const elements = categories
      .map((c) => document.getElementById(c.id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the most visible section
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0))[0];

        if (visible?.target?.id) setActiveId(visible.target.id);
      },
      {
        // Treat a section as "active" when it crosses near the top area
        root: null,
        threshold: [0.12, 0.25, 0.5],
        rootMargin: "-25% 0px -65% 0px",
      }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [categories]);

  return (
    <section id="menu" className="bg-slate-50">
      <div className="mx-auto max-w-6xl px-6 py-14 sm:px-8 sm:py-20">
        <Reveal>
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{eyebrow || "Menu"}</p>
            <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              {title || "Our Complete Menu"}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-base text-slate-500 sm:text-lg">
              {subtitle || "Explore our full range of delicious offerings"}
            </p>
          </div>
        </Reveal>

        {categories.length === 0 ? (
          <Reveal className="mt-8">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
              No complete menu items added yet.
            </div>
          </Reveal>
        ) : null}

        {categories.length > 0 ? (
          <>
            {/* Sticky category tabs */}
            <div className="sticky top-[72px] z-20 -mx-6 mt-10 border-y border-slate-200 bg-slate-50/95 px-6 py-3 backdrop-blur sm:-mx-8 sm:px-8">
              <div
                ref={scrollerRef}
                className="flex gap-3 overflow-x-auto overscroll-x-contain [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
              >
                {categories.map((c) => {
                  const active = resolvedActiveId === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        document.getElementById(c.id)?.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        });
                        setActiveId(c.id);
                      }}
                      className={[
                        "shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                        "ring-1 ring-slate-200",
                        active
                          ? "bg-slate-900 text-white ring-slate-900"
                          : "bg-white text-slate-700 hover:bg-slate-50",
                      ].join(" ")}
                    >
                      {c.title}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Continuous menu list */}
            <div className="mt-8 space-y-10">
              {categories.map((cat, idx) => (
                <Reveal key={cat.id} delay={idx * 0.04}>
                  <section id={cat.id} className="scroll-mt-[160px]">
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="text-lg font-bold text-slate-900 sm:text-xl">
                        {cat.title}
                      </h3>
                    </div>

                    <div className="mt-4 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white px-5">
                      {cat.items.map((item) => (
                        <MenuItemRow key={item.name} item={item} />
                      ))}
                    </div>
                  </section>
                </Reveal>
              ))}
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
}

