"use client";

import { FormEvent, useEffect, useState } from "react";
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
  initialPremiumDishes: Dish[];
  onUpdated?: (dishes: Dish[]) => void;
};

type NewDishForm = {
  name: string;
  description: string;
  price: string;
  category: string;
  image: string;
};

const EMPTY_NEW_DISH: NewDishForm = {
  name: "",
  description: "",
  price: "",
  category: "",
  image: "",
};

function getErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof Error && err.message) return err.message;
  return fallback;
}

function isSameDishList(a: Dish[], b: Dish[]): boolean {
  if (a.length !== b.length) return false;
  return a.every((dish, index) => {
    const next = b[index];
    return (
      dish.id === next.id &&
      dish.name === next.name &&
      dish.description === next.description &&
      dish.price === next.price &&
      dish.category === next.category &&
      dish.image === next.image
    );
  });
}

export function PremiumDishesManager({
  restaurantId,
  initialPremiumDishes,
  onUpdated,
}: Props) {
  const [premiumDishes, setPremiumDishes] = useState<Dish[]>(
    initialPremiumDishes.slice(0, 6)
  );
  const [editing, setEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<Record<number, Partial<Dish>>>({});
  const [newDish, setNewDish] = useState<NewDishForm>(EMPTY_NEW_DISH);

  useEffect(() => {
    const next = initialPremiumDishes.slice(0, 6);
    setPremiumDishes((prev) => (isSameDishList(prev, next) ? prev : next));
  }, [initialPremiumDishes]);

  const onUploadImage = async (file: File, index: number) => {
    setUploading(true);
    setMessage(null);
    setError(null);

    try {
      const imageUrl = await uploadImage(restaurantId, file);
      setFormData((prev) => ({
        ...prev,
        [index]: {
          ...prev[index],
          image: imageUrl,
        },
      }));
      setMessage(`Image uploaded for dish ${index + 1}.`);
    } catch (err) {
      setError(
        getErrorMessage(err, `Failed to upload image for dish ${index + 1}. Check Storage rules.`)
      );
    } finally {
      setUploading(false);
    }
  };

  const onSaveDish = async (e: FormEvent<HTMLFormElement>, index: number) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);

    try {
      const dish = premiumDishes[index];
      const updates = formData[index];

      if (!dish) {
        setError("Dish not found.");
        return;
      }

      const updatedDish = {
        name: updates.name || dish.name,
        description: updates.description || dish.description,
        price: updates.price ?? dish.price,
        category: updates.category || dish.category,
        image: updates.image || dish.image,
      };

      await updateDish(dish.id, updatedDish);

      const nextDishes = [...premiumDishes];
      nextDishes[index] = { ...dish, ...updatedDish };
      setPremiumDishes(nextDishes);
      setFormData((prev) => ({ ...prev, [index]: {} }));
      onUpdated?.(nextDishes);
      setMessage(`Dish ${index + 1} saved successfully.`);
    } catch (err) {
      setError(getErrorMessage(err, `Failed to save dish ${index + 1}.`));
    } finally {
      setSaving(false);
    }
  };

  const onDeleteDish = async (index: number) => {
    if (!confirm("Delete this dish?")) return;

    setMessage(null);
    setError(null);

    try {
      const dish = premiumDishes[index];
      if (!dish) return;

      await deleteDish(dish.id);
      const nextDishes = premiumDishes.filter((_, i) => i !== index);
      setPremiumDishes(nextDishes);
      onUpdated?.(nextDishes);
      setMessage("Dish deleted.");
    } catch (err) {
      setError(getErrorMessage(err, "Failed to delete dish."));
    }
  };

  const onUploadNewDishImage = async (file: File) => {
    setUploading(true);
    setMessage(null);
    setError(null);

    try {
      const imageUrl = await uploadImage(restaurantId, file);
      setNewDish((prev) => ({ ...prev, image: imageUrl }));
      setMessage("Image uploaded for new premium dish.");
    } catch (err) {
      setError(getErrorMessage(err, "Failed to upload image for new dish. Check Storage rules."));
    } finally {
      setUploading(false);
    }
  };

  const onAddDish = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!newDish.image) {
      setError("Please upload dish image first and wait for upload to complete.");
      return;
    }

    if (premiumDishes.length >= 6) {
      setError("You can only configure up to 6 premium dishes.");
      return;
    }

    setCreating(true);
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
        section: "premium",
      });

      const refreshed = await getDishesByRestaurant(restaurantId);
      const nextPremium = refreshed.filter((dish) => dish.section === "premium").slice(0, 6);
      setPremiumDishes(nextPremium);
      onUpdated?.(nextPremium);
      setNewDish(EMPTY_NEW_DISH);
      setMessage("New premium dish added.");
    } catch (err) {
      setError(getErrorMessage(err, "Failed to add premium dish. Check Firestore rules."));
    } finally {
      setCreating(false);
    }
  };

  return (
    <Card className="p-6 sm:p-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Best Dishes (Premium)</h2>
          <p className="mt-1 text-sm text-slate-600">
            Manage up to 6 of your best dishes with images
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 font-semibold text-slate-700">
              {premiumDishes.length}/6 dishes configured
            </span>
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 font-semibold text-emerald-700">
              {editing ? "Edit mode" : "Preview mode"}
            </span>
          </div>
        </div>
        <Button
          type="button"
          variant={editing ? "secondary" : "primary"}
          onClick={() => setEditing(!editing)}
        >
          {editing ? "Done Editing" : "Edit Dishes"}
        </Button>
      </div>

      {!editing ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {premiumDishes.map((dish, index) => (
            <div key={dish.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              {dish.image && (
                <div className="relative h-32 w-full bg-slate-100">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <div className="p-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Dish {index + 1}</p>
                <p className="font-semibold text-slate-900">{dish.name}</p>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                  {dish.description}
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-sm font-bold text-slate-900">₹{dish.price}</p>
                  <p className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-600">
                    {dish.category}
                  </p>
                </div>
              </div>
            </div>
          ))}
          {premiumDishes.length < 6 && (
            <div className="flex items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/60 p-6">
              <p className="text-sm text-slate-500 text-center">
                Add {6 - premiumDishes.length} more dish{premiumDishes.length !== 5 ? "es" : ""}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-6 grid gap-6">
          {premiumDishes.map((dish, index) => (
            <div key={dish.id} className="rounded-2xl border border-slate-200 bg-gradient-to-r from-white to-slate-50 p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-semibold text-slate-900">Dish {index + 1}</p>
                  <p className="text-xs text-slate-500">Update details, price, and image.</p>
                </div>
                <button
                  type="button"
                  onClick={() => void onDeleteDish(index)}
                  className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100"
                >
                  Delete
                </button>
              </div>

              <form onSubmit={(e) => void onSaveDish(e, index)} className="grid gap-3">
                <label className="grid gap-1 text-sm text-slate-700">
                  Name
                  <input
                    type="text"
                    defaultValue={formData[index]?.name || dish.name}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        [index]: { ...prev[index], name: e.target.value },
                      }))
                    }
                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-[#25D366]/40 focus:ring-2"
                    required
                  />
                </label>

                <label className="grid gap-1 text-sm text-slate-700">
                  Description
                  <textarea
                    defaultValue={formData[index]?.description || dish.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        [index]: { ...prev[index], description: e.target.value },
                      }))
                    }
                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-[#25D366]/40 focus:ring-2"
                    rows={2}
                    required
                  />
                </label>

                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="grid gap-1 text-sm text-slate-700">
                    Price (₹)
                    <input
                      type="number"
                      min="0"
                      defaultValue={formData[index]?.price || dish.price}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          [index]: { ...prev[index], price: Number(e.target.value) },
                        }))
                      }
                      className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-[#25D366]/40 focus:ring-2"
                      required
                    />
                  </label>

                  <label className="grid gap-1 text-sm text-slate-700">
                    Category
                    <input
                      type="text"
                      defaultValue={formData[index]?.category || dish.category}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          [index]: { ...prev[index], category: e.target.value },
                        }))
                      }
                      className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-[#25D366]/40 focus:ring-2"
                      required
                    />
                  </label>
                </div>

                <div className="grid gap-2">
                  <label className="text-sm text-slate-700">
                    Image {formData[index]?.image ? "✓" : ""}
                  </label>
                  {(formData[index]?.image || dish.image) && (
                    <div className="relative h-24 w-full rounded-lg bg-slate-100 overflow-hidden">
                      <img
                        src={formData[index]?.image || dish.image}
                        alt={dish.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    disabled={uploading}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) void onUploadImage(file, index);
                    }}
                    className="block text-sm text-slate-500 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-900 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-slate-800"
                  />
                </div>

                <Button type="submit" disabled={saving || uploading} className="w-full">
                  {saving ? "Saving..." : "Save Dish"}
                </Button>
              </form>
            </div>
          ))}
        </div>
      )}

      {message && <p className="mt-4 text-sm text-emerald-600 font-medium">{message}</p>}
      {error && <p className="mt-4 text-sm text-red-600 font-medium">{error}</p>}

      <div className="mt-6 rounded-2xl border border-slate-200 bg-gradient-to-r from-white to-slate-50 p-4">
        <div className="mb-3">
          <h3 className="text-base font-bold text-slate-900">Add New Premium Dish</h3>
          <p className="text-sm text-slate-600">Create a new dish with image for this premium section.</p>
        </div>

        <form onSubmit={onAddDish} className="grid gap-3">
          <label className="grid gap-1 text-sm text-slate-700">
            Dish Name
            <input
              value={newDish.name}
              onChange={(e) => setNewDish((prev) => ({ ...prev, name: e.target.value }))}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-[#25D366]/40 focus:ring-2"
              required
            />
          </label>

          <label className="grid gap-1 text-sm text-slate-700">
            Description
            <textarea
              value={newDish.description}
              onChange={(e) => setNewDish((prev) => ({ ...prev, description: e.target.value }))}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-[#25D366]/40 focus:ring-2"
              rows={2}
              required
            />
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1 text-sm text-slate-700">
              Price (₹)
              <input
                type="number"
                min="0"
                value={newDish.price}
                onChange={(e) => setNewDish((prev) => ({ ...prev, price: e.target.value }))}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-[#25D366]/40 focus:ring-2"
                required
              />
            </label>

            <label className="grid gap-1 text-sm text-slate-700">
              Category
              <input
                value={newDish.category}
                onChange={(e) => setNewDish((prev) => ({ ...prev, category: e.target.value }))}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-[#25D366]/40 focus:ring-2"
                required
              />
            </label>
          </div>

          <div className="grid gap-2">
            <label className="text-sm text-slate-700">Dish Image {newDish.image ? "✓ Uploaded" : "(required)"}</label>
            {newDish.image ? (
              <div className="relative h-24 w-full overflow-hidden rounded-lg bg-slate-100">
                <img src={newDish.image} alt="New dish preview" className="h-full w-full object-cover" />
              </div>
            ) : null}
            <input
              type="file"
              accept="image/*"
              disabled={uploading || creating}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void onUploadNewDishImage(file);
              }}
              className="block text-sm text-slate-500 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-900 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-slate-800"
            />
          </div>

          <Button
            type="submit"
            disabled={creating || uploading || premiumDishes.length >= 6}
            className="w-fit"
          >
            {creating ? "Adding..." : "Add Premium Dish"}
          </Button>
          {uploading ? <p className="text-xs text-slate-500">Uploading image...</p> : null}
          {!newDish.image ? <p className="text-xs text-slate-500">Select an image and wait for upload before adding.</p> : null}
          {premiumDishes.length >= 6 ? (
            <p className="text-xs text-slate-500">Maximum of 6 premium dishes reached.</p>
          ) : null}
        </form>
      </div>
    </Card>
  );
}
