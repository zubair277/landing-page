"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  addTestimonial,
  deleteTestimonial,
  getTestimonialsByRestaurant,
  updateTestimonial,
} from "@/lib/queries";
import type { Testimonial } from "@/types";
import { Button } from "@/app/components/ui/Button";
import { Card } from "@/app/components/ui/Card";

type Props = {
  restaurantId: string;
  initialData: Testimonial[];
};

export function TestimonialManager({ restaurantId, initialData }: Props) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialData);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [newTestimonial, setNewTestimonial] = useState({
    name: "",
    review: "",
    rating: "5",
  });

  useEffect(() => {
    setTestimonials(initialData);
  }, [initialData]);

  const reload = async () => {
    const next = await getTestimonialsByRestaurant(restaurantId);
    setTestimonials(next);
  };

  const onCreate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);

    try {
      await addTestimonial({
        restaurantId,
        name: newTestimonial.name,
        review: newTestimonial.review,
        rating: Number(newTestimonial.rating),
      });
      setNewTestimonial({ name: "", review: "", rating: "5" });
      await reload();
      setMessage("Testimonial added.");
    } catch {
      setError("Failed to add testimonial.");
    } finally {
      setSaving(false);
    }
  };

  const onSave = async (item: Testimonial) => {
    setSaving(true);
    setMessage(null);
    setError(null);

    try {
      await updateTestimonial(item.id, {
        name: item.name,
        review: item.review,
        rating: item.rating,
      });
      setMessage("Testimonial updated.");
    } catch {
      setError("Failed to update testimonial.");
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (id: string) => {
    setSaving(true);
    setMessage(null);
    setError(null);

    try {
      await deleteTestimonial(id);
      await reload();
      setMessage("Testimonial deleted.");
    } catch {
      setError("Failed to delete testimonial.");
    } finally {
      setSaving(false);
    }
  };

  const getStars = (rating: number) => {
    const safeRating = Math.max(1, Math.min(5, Math.round(rating)));
    return "★".repeat(safeRating) + "☆".repeat(5 - safeRating);
  };

  return (
    <Card className="p-6 sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Testimonials</h2>
          <p className="mt-1 text-sm text-slate-600">Collect and edit social proof shown on the public website.</p>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
          {testimonials.length} total reviews
        </div>
      </div>

      <form className="mt-5 grid gap-3 rounded-2xl border border-slate-200 bg-gradient-to-r from-white to-slate-50 p-4" onSubmit={onCreate}>
        <p className="text-sm font-semibold text-slate-800">Add Testimonial</p>
        <input
          placeholder="Guest name"
          value={newTestimonial.name}
          onChange={(e) => setNewTestimonial((prev) => ({ ...prev, name: e.target.value }))}
          className="rounded-xl border border-slate-200 px-4 py-2.5"
          required
        />
        <textarea
          rows={3}
          placeholder="Review"
          value={newTestimonial.review}
          onChange={(e) => setNewTestimonial((prev) => ({ ...prev, review: e.target.value }))}
          className="rounded-xl border border-slate-200 px-4 py-2.5"
          required
        />
        <input
          type="number"
          min={1}
          max={5}
          step="0.1"
          value={newTestimonial.rating}
          onChange={(e) => setNewTestimonial((prev) => ({ ...prev, rating: e.target.value }))}
          className="rounded-xl border border-slate-200 px-4 py-2.5"
          required
        />
        <Button type="submit" className="w-fit" disabled={saving}>
          {saving ? "Saving..." : "Add Testimonial"}
        </Button>
      </form>

      {message ? <p className="mt-4 text-sm text-emerald-600">{message}</p> : null}
      {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

      <div className="mt-6 grid gap-3">
        {testimonials.map((item) => (
          <div key={item.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-amber-600">
              {getStars(item.rating ?? 5)}
            </p>
            <input
              value={item.name}
              onChange={(e) =>
                setTestimonials((prev) =>
                  prev.map((x) => (x.id === item.id ? { ...x, name: e.target.value } : x))
                )
              }
              className="w-full rounded-lg border border-slate-200 px-3 py-2"
            />
            <textarea
              rows={2}
              value={item.review}
              onChange={(e) =>
                setTestimonials((prev) =>
                  prev.map((x) => (x.id === item.id ? { ...x, review: e.target.value } : x))
                )
              }
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2"
            />
            <input
              type="number"
              min={1}
              max={5}
              step="0.1"
              value={item.rating ?? 5}
              onChange={(e) =>
                setTestimonials((prev) =>
                  prev.map((x) =>
                    x.id === item.id ? { ...x, rating: Number(e.target.value) } : x
                  )
                )
              }
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2"
            />
            <div className="mt-3 flex gap-2">
              <Button variant="secondary" disabled={saving} onClick={() => void onSave(item)}>
                Save
              </Button>
              <Button variant="ghost" disabled={saving} onClick={() => void onDelete(item.id)}>
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
