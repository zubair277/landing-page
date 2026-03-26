"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  addDish,
  deleteDish,
  getDishesByRestaurant,
  updateDish,
  uploadImage,
} from "@/lib/queries";
import type { Dish } from "@/types";
import { Button } from "@/app/components/ui/Button";
import { Card } from "@/app/components/ui/Card";

type Props = {
  restaurantId: string;
  initialData: Dish[];
};

type DishSection = "premium" | "menu";

const PUBLIC_IMAGE_OPTIONS = [
  "/images/classic-mojito.jpg",
  "/images/grilled-fish-lemon-butter.jpg",
  "/images/hero-miri.jpg",
  "/images/paneer-steak-herb-sauce.jpg",
  "/images/passionfruit-martini.jpg",
  "/images/peri-peri-chicken-skewers.jpg",
  "/images/truffle-mushroom-arancini.jpg",
];

function getDishSection(dish: Dish): DishSection {
  return dish.section === "premium" ? "premium" : "menu";
}

export function MenuManager({ restaurantId, initialData }: Props) {
  const [dishes, setDishes] = useState<Dish[]>(initialData);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [newDish, setNewDish] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
    section: "premium" as DishSection,
  });

  useEffect(() => {
    setDishes(initialData);
  }, [initialData]);

  const sortedDishes = useMemo(
    () =>
      [...dishes].sort(
        (a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name)
      ),
    [dishes]
  );

  const premiumDishes = useMemo(
    () => sortedDishes.filter((dish) => getDishSection(dish) === "premium"),
    [sortedDishes]
  );

  const completeMenuDishes = useMemo(
    () => sortedDishes.filter((dish) => getDishSection(dish) === "menu"),
    [sortedDishes]
  );

  const reload = async () => {
    const next = await getDishesByRestaurant(restaurantId);
    setDishes(next);
  };

  const onCreateDish = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);

    try {
      await addDish({
        restaurantId,
        name: newDish.name,
        description: newDish.description,
        price: Number(newDish.price),
        category: newDish.category,
        image: newDish.image,
        section: newDish.section,
      });
      setNewDish((prev) => ({
        ...prev,
        name: "",
        description: "",
        price: "",
        category: "",
        image: "",
      }));
      await reload();
      setMessage("Dish added.");
    } catch {
      setError("Failed to create dish.");
    } finally {
      setSaving(false);
    }
  };

  const onDishImageUpload = async (file: File) => {
    setSaving(true);
    setMessage(null);
    setError(null);

    try {
      const image = await uploadImage(restaurantId, file);
      setNewDish((prev) => ({ ...prev, image }));
      setMessage("Dish image uploaded.");
    } catch {
      setError("Failed to upload dish image.");
    } finally {
      setSaving(false);
    }
  };

  const onExistingDishImageUpload = async (dishId: string, file: File) => {
    setSaving(true);
    setMessage(null);
    setError(null);

    try {
      const imageUrl = await uploadImage(restaurantId, file);
      setDishes((prev) =>
        prev.map((item) => (item.id === dishId ? { ...item, image: imageUrl } : item))
      );
      setMessage("Dish image uploaded. Click Save on that dish to persist.");
    } catch {
      setError("Failed to upload existing dish image.");
    } finally {
      setSaving(false);
    }
  };

  const onSaveDish = async (dish: Dish) => {
    setSaving(true);
    setMessage(null);
    setError(null);

    try {
      await updateDish(dish.id, {
        name: dish.name,
        description: dish.description,
        price: dish.price,
        category: dish.category,
        image: dish.image,
        section: getDishSection(dish),
      });
      setMessage("Dish updated.");
    } catch {
      setError("Failed to update dish.");
    } finally {
      setSaving(false);
    }
  };

  const onDeleteDish = async (dishId: string) => {
    setSaving(true);
    setMessage(null);
    setError(null);

    try {
      await deleteDish(dishId);
      await reload();
      setMessage("Dish deleted.");
    } catch {
      setError("Failed to delete dish.");
    } finally {
      setSaving(false);
    }
  };

  const renderDishEditor = (dish: Dish) => (
    <div key={dish.id} className="rounded-xl border border-slate-200 p-4">
      <div className="grid gap-2 sm:grid-cols-2">
        <input
          value={dish.name}
          onChange={(e) =>
            setDishes((prev) =>
              prev.map((item) => (item.id === dish.id ? { ...item, name: e.target.value } : item))
            )
          }
          className="rounded-lg border border-slate-200 px-3 py-2"
        />
        <input
          value={dish.category}
          onChange={(e) =>
            setDishes((prev) =>
              prev.map((item) =>
                item.id === dish.id ? { ...item, category: e.target.value } : item
              )
            )
          }
          className="rounded-lg border border-slate-200 px-3 py-2"
        />
        <input
          type="number"
          value={dish.price}
          onChange={(e) =>
            setDishes((prev) =>
              prev.map((item) =>
                item.id === dish.id ? { ...item, price: Number(e.target.value) } : item
              )
            )
          }
          className="rounded-lg border border-slate-200 px-3 py-2"
        />
        <input
          value={dish.image}
          onChange={(e) =>
            setDishes((prev) =>
              prev.map((item) => (item.id === dish.id ? { ...item, image: e.target.value } : item))
            )
          }
          className="rounded-lg border border-slate-200 px-3 py-2"
          list="public-image-options"
        />
      </div>
      <select
        value={getDishSection(dish)}
        onChange={(e) =>
          setDishes((prev) =>
            prev.map((item) =>
              item.id === dish.id ? { ...item, section: e.target.value as DishSection } : item
            )
          )
        }
        className="mt-2 rounded-lg border border-slate-200 px-3 py-2"
      >
        <option value="premium">Premium Offering Section</option>
        <option value="menu">Complete Menu Section</option>
      </select>
      <input
        type="file"
        accept="image/*"
        disabled={saving}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            void onExistingDishImageUpload(dish.id, file);
          }
        }}
        className="mt-2"
      />
      <textarea
        rows={2}
        value={dish.description}
        onChange={(e) =>
          setDishes((prev) =>
            prev.map((item) =>
              item.id === dish.id ? { ...item, description: e.target.value } : item
            )
          )
        }
        className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2"
      />
      <div className="mt-3 flex gap-2">
        <Button variant="secondary" disabled={saving} onClick={() => void onSaveDish(dish)}>
          Save
        </Button>
        <Button disabled={saving} onClick={() => void onDeleteDish(dish.id)}>
          Delete
        </Button>
      </div>
    </div>
  );

  return (
    <Card className="p-6 sm:p-8">
      <h2 className="text-xl font-bold text-slate-900">Menu Manager</h2>
      <p className="mt-1 text-sm text-slate-600">
        Use separate entries for Premium Offering and Complete Menu.
      </p>

      <form className="mt-5 grid gap-3" onSubmit={onCreateDish}>
        <p className="text-sm font-semibold text-slate-800">Add New Dish</p>
        <input
          placeholder="Name"
          value={newDish.name}
          onChange={(e) => setNewDish((prev) => ({ ...prev, name: e.target.value }))}
          className="rounded-xl border border-slate-200 px-4 py-2.5"
          required
        />
        <input
          placeholder="Category"
          value={newDish.category}
          onChange={(e) => setNewDish((prev) => ({ ...prev, category: e.target.value }))}
          className="rounded-xl border border-slate-200 px-4 py-2.5"
          required
        />
        <input
          placeholder="Price"
          type="number"
          min={1}
          value={newDish.price}
          onChange={(e) => setNewDish((prev) => ({ ...prev, price: e.target.value }))}
          className="rounded-xl border border-slate-200 px-4 py-2.5"
          required
        />
        <textarea
          placeholder="Description"
          rows={2}
          value={newDish.description}
          onChange={(e) => setNewDish((prev) => ({ ...prev, description: e.target.value }))}
          className="rounded-xl border border-slate-200 px-4 py-2.5"
          required
        />
        <input
          placeholder="Image URL"
          value={newDish.image}
          onChange={(e) => setNewDish((prev) => ({ ...prev, image: e.target.value }))}
          className="rounded-xl border border-slate-200 px-4 py-2.5"
          list="public-image-options"
          required
        />
        <select
          value={newDish.section}
          onChange={(e) =>
            setNewDish((prev) => ({ ...prev, section: e.target.value as DishSection }))
          }
          className="rounded-xl border border-slate-200 px-4 py-2.5"
        >
          <option value="premium">Premium Offering Section</option>
          <option value="menu">Complete Menu Section</option>
        </select>
        <input
          type="file"
          accept="image/*"
          disabled={saving}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              void onDishImageUpload(file);
            }
          }}
        />
        <Button type="submit" disabled={saving} className="w-fit">
          {saving ? "Saving..." : "Add Dish"}
        </Button>
      </form>

      {message ? <p className="mt-4 text-sm text-emerald-600">{message}</p> : null}
      {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

      <div className="mt-6 grid gap-6">
        <div>
          <h3 className="text-sm font-semibold text-slate-800">Premium Offering Items</h3>
          <div className="mt-3 grid gap-3">
            {premiumDishes.map(renderDishEditor)}
            {premiumDishes.length === 0 ? (
              <p className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
                No premium offering items yet.
              </p>
            ) : null}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-800">Complete Menu Items</h3>
          <div className="mt-3 grid gap-3">
            {completeMenuDishes.map(renderDishEditor)}
            {completeMenuDishes.length === 0 ? (
              <p className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
                No complete menu items yet.
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <datalist id="public-image-options">
        {PUBLIC_IMAGE_OPTIONS.map((imagePath) => (
          <option key={imagePath} value={imagePath} />
        ))}
      </datalist>
    </Card>
  );
}
