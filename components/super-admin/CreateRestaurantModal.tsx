"use client";

import { FormEvent, useState } from "react";
import { Card } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";

export function CreateRestaurantModal({
  open,
  onClose,
  onSubmit,
  loading,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    slug: string;
    whatsappNumber: string;
    couponCode: string;
    address: string;
    heroTitle: string;
    heroSubtitle: string;
  }) => Promise<void>;
  loading: boolean;
}) {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    whatsappNumber: "",
    couponCode: "",
    address: "",
    heroTitle: "",
    heroSubtitle: "",
  });
  const [error, setError] = useState<string | null>(null);

  if (!open) {
    return null;
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    try {
      await onSubmit(formData);
      setFormData({
        name: "",
        slug: "",
        whatsappNumber: "",
        couponCode: "",
        address: "",
        heroTitle: "",
        heroSubtitle: "",
      });
    } catch (err: any) {
      setError(err.message || "Failed to create restaurant.");
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto p-4"
      role="dialog"
      aria-modal="true"
    >
      <button
        className="absolute inset-0 bg-black/40"
        aria-label="Close modal"
        onClick={onClose}
      />
      <Card className="relative w-full max-w-[500px] overflow-hidden my-8">
        <div className="p-6 sm:p-8">
          <h2 className="text-xl font-bold text-slate-900">Create Restaurant</h2>
          <p className="mt-1 text-sm text-slate-600">Add a new restaurant to the system</p>

          <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
            <label className="grid gap-1 text-sm text-slate-700">
              Restaurant Name *
              <input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                type="text"
                placeholder="e.g., Miri"
                className="rounded-xl border border-slate-200 px-4 py-2.5 outline-none ring-[#25D366]/40 focus:ring-2"
                required
              />
            </label>

            <label className="grid gap-1 text-sm text-slate-700">
              Slug (URL) *
              <input
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                type="text"
                placeholder="e.g., miri"
                className="rounded-xl border border-slate-200 px-4 py-2.5 outline-none ring-[#25D366]/40 focus:ring-2"
                required
              />
            </label>

            <label className="grid gap-1 text-sm text-slate-700">
              WhatsApp Number *
              <input
                value={formData.whatsappNumber}
                onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                type="text"
                placeholder="e.g., 15551234567"
                className="rounded-xl border border-slate-200 px-4 py-2.5 outline-none ring-[#25D366]/40 focus:ring-2"
                required
              />
            </label>

            <label className="grid gap-1 text-sm text-slate-700">
              Coupon Code *
              <input
                value={formData.couponCode}
                onChange={(e) => setFormData({ ...formData, couponCode: e.target.value })}
                type="text"
                placeholder="e.g., MIRI20"
                className="rounded-xl border border-slate-200 px-4 py-2.5 outline-none ring-[#25D366]/40 focus:ring-2"
                required
              />
            </label>

            <label className="grid gap-1 text-sm text-slate-700">
              Address *
              <input
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                type="text"
                placeholder="e.g., Miramar, Panjim, Goa"
                className="rounded-xl border border-slate-200 px-4 py-2.5 outline-none ring-[#25D366]/40 focus:ring-2"
                required
              />
            </label>

            <label className="grid gap-1 text-sm text-slate-700">
              Hero Title *
              <input
                value={formData.heroTitle}
                onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
                type="text"
                placeholder="e.g., Global Fusion Dining"
                className="rounded-xl border border-slate-200 px-4 py-2.5 outline-none ring-[#25D366]/40 focus:ring-2"
                required
              />
            </label>

            <label className="grid gap-1 text-sm text-slate-700">
              Hero Subtitle *
              <input
                value={formData.heroSubtitle}
                onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
                type="text"
                placeholder="e.g., Experience fine dining"
                className="rounded-xl border border-slate-200 px-4 py-2.5 outline-none ring-[#25D366]/40 focus:ring-2"
                required
              />
            </label>

            {error ? <p className="text-sm text-red-600">{error}</p> : null}

            <div className="flex gap-2 pt-2">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                disabled={loading}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? "Creating..." : "Create"}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}
