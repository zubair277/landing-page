"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Reveal } from "@/app/components/ui/Reveal";
import { MenuItemRow, type MenuListItem } from "@/app/components/menu/MenuItemRow";

type MenuCategoryData = {
  title: string;
  id: string;
  items: MenuListItem[];
};

export function MenuSection() {
  const categories: MenuCategoryData[] = useMemo(
    () => [
      {
        title: "Small Plates",
        id: "small-plates",
        items: [
          {
            name: "Peri Peri Chicken Skewers",
            description:
              "Char-grilled skewers, peri peri glaze, pickled onions, herb dip.",
            priceInr: 520,
          },
          {
            name: "Truffle Mushroom Arancini",
            description:
              "Crisp risotto bites, truffle aroma, parmesan snow, garlic aioli.",
            priceInr: 460,
          },
          {
            name: "Asian Glazed Cauliflower",
            description:
              "Sticky soy-sesame glaze, scallions, toasted sesame crunch.",
            priceInr: 420,
          },
          {
            name: "Crispy Prawn Tempura",
            description:
              "Light tempura batter, yuzu mayo, chili-lime dust, micro herbs.",
            priceInr: 540,
          },
          {
            name: "Avocado & Citrus Salad",
            description:
              "Avocado, citrus segments, toasted seeds, honey-lime dressing.",
            priceInr: 390,
          },
          {
            name: "Charred Corn Ribs",
            description:
              "Miso butter, lime zest, chili flakes, smoky finish.",
            priceInr: 360,
          },
        ],
      },
      {
        title: "Signature Mains",
        id: "signature-mains",
        items: [
          {
            name: "Truffle Mushroom Risotto",
            description:
              "Creamy arborio, wild mushrooms, truffle oil, parmesan finish.",
            priceInr: 650,
          },
          {
            name: "Paneer Steak with Herb Sauce",
            description:
              "Seared paneer steak, herb jus, roasted vegetables, citrus microgreens.",
            priceInr: 580,
          },
          {
            name: "Grilled Fish with Lemon Butter",
            description:
              "Fresh catch, lemon butter glaze, charred greens, caper notes.",
            priceInr: 720,
          },
          {
            name: "Slow-Cooked Lamb Shank",
            description:
              "Red wine reduction, creamy mash, seasonal vegetables, jus.",
            priceInr: 920,
          },
        ],
      },
      {
        title: "Fusion Specials",
        id: "fusion-specials",
        items: [
          {
            name: "Sushi Taco Trio",
            description:
              "Crispy shells, tuna & avocado, salmon & yuzu, veg tempura crunch.",
            priceInr: 690,
          },
          {
            name: "Korean BBQ Short Rib",
            description:
              "Gochujang glaze, sesame, scallions, kimchi slaw on the side.",
            priceInr: 850,
          },
          {
            name: "Thai Basil Burrata",
            description:
              "Burrata, Thai basil oil, heirloom tomatoes, chili-lime crunch.",
            priceInr: 610,
          },
        ],
      },
      {
        title: "Beverages & Cocktails",
        id: "beverages-cocktails",
        items: [
          {
            name: "Classic Mojito",
            description: "Fresh mint, lime, sparkling soda — clean and crisp.",
            priceInr: 350,
          },
          {
            name: "Passionfruit Martini",
            description:
              "Passionfruit, vanilla notes, silky finish — signature Miri vibe.",
            priceInr: 450,
          },
          {
            name: "Smoked Old Fashioned",
            description:
              "Bourbon, bitters, orange oils, served with a subtle smoke veil.",
            priceInr: 520,
          },
        ],
      },
    ],
    []
  );

  const [activeId, setActiveId] = useState(categories[0]?.id ?? "menu");
  const scrollerRef = useRef<HTMLDivElement | null>(null);

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
            <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Our Complete Menu
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-base text-slate-500 sm:text-lg">
              Explore our full range of delicious offerings
            </p>
          </div>
        </Reveal>

        {/* Sticky category tabs */}
        <div className="sticky top-[72px] z-20 -mx-6 mt-10 border-y border-slate-200 bg-slate-50/95 px-6 py-3 backdrop-blur sm:-mx-8 sm:px-8">
          <div
            ref={scrollerRef}
            className="flex gap-3 overflow-x-auto overscroll-x-contain [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {categories.map((c) => {
              const active = activeId === c.id;
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
      </div>
    </section>
  );
}

