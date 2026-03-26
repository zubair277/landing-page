"use client";

import { FormEvent, useEffect, useState } from "react";
import { updateRestaurant } from "@/lib/queries";
import type { Restaurant } from "@/types";
import { Button } from "@/app/components/ui/Button";
import { Card } from "@/app/components/ui/Card";

type Props = {
  restaurantId: string;
  initialRestaurant: Restaurant;
  onUpdated?: (next: Restaurant) => void;
};

type BasicFormState = {
  name: string;
  whatsappNumber: string;
  address: string;
  couponCode: string;
  headerTagline: string;
  locationNavLabel: string;
  contactNavLabel: string;
  heroBadgeText: string;
  featuredLabel: string;
  offerTitle: string;
  offerEyebrow: string;
  offerSubtitle: string;
  offerTerms: string;
  dishesEyebrow: string;
  dishesTitle: string;
  dishesSubtitle: string;
  locationSubtitle: string;
  locationEyebrow: string;
  locationTitle: string;
  footerCtaText: string;
  footerBrandTitle: string;
  footerPrimaryButtonText: string;
  avgWaitText: string;
  offerBadgeText: string;
  completeMenuEyebrow: string;
  completeMenuTitle: string;
  completeMenuSubtitle: string;
};

function toFormState(restaurant: Restaurant): BasicFormState {
  return {
    name: restaurant.name,
    whatsappNumber: restaurant.whatsappNumber,
    address: restaurant.address,
    couponCode: restaurant.couponCode,
    headerTagline: restaurant.headerTagline || "",
    locationNavLabel: restaurant.locationNavLabel || "",
    contactNavLabel: restaurant.contactNavLabel || "",
    heroBadgeText: restaurant.heroBadgeText || "",
    featuredLabel: restaurant.featuredLabel || "",
    offerTitle: restaurant.offerTitle || "",
    offerEyebrow: restaurant.offerEyebrow || "",
    offerSubtitle: restaurant.offerSubtitle || "",
    offerTerms: restaurant.offerTerms || "",
    dishesEyebrow: restaurant.dishesEyebrow || "",
    dishesTitle: restaurant.dishesTitle || "",
    dishesSubtitle: restaurant.dishesSubtitle || "",
    locationSubtitle: restaurant.locationSubtitle || "",
    locationEyebrow: restaurant.locationEyebrow || "",
    locationTitle: restaurant.locationTitle || "",
    footerCtaText: restaurant.footerCtaText || "",
    footerBrandTitle: restaurant.footerBrandTitle || "",
    footerPrimaryButtonText: restaurant.footerPrimaryButtonText || "",
    avgWaitText: restaurant.avgWaitText || "",
    offerBadgeText: restaurant.offerBadgeText || "",
    completeMenuEyebrow: restaurant.completeMenuEyebrow || "",
    completeMenuTitle: restaurant.completeMenuTitle || "",
    completeMenuSubtitle: restaurant.completeMenuSubtitle || "",
  };
}

function isSameFormState(a: BasicFormState, b: BasicFormState): boolean {
  const keys = Object.keys(a) as Array<keyof BasicFormState>;
  return keys.every((key) => a[key] === b[key]);
}

export function BasicInfoForm({ restaurantId, initialRestaurant, onUpdated }: Props) {
  const [form, setForm] = useState<BasicFormState>(() => toFormState(initialRestaurant));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const nextForm = toFormState(initialRestaurant);
    setForm((prev) => (isSameFormState(prev, nextForm) ? prev : nextForm));
  }, [initialRestaurant]);

  const onSave = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);

    try {
      await updateRestaurant(restaurantId, {
        name: form.name,
        whatsappNumber: form.whatsappNumber,
        address: form.address,
        couponCode: form.couponCode,
        headerTagline: form.headerTagline,
        locationNavLabel: form.locationNavLabel,
        contactNavLabel: form.contactNavLabel,
        heroBadgeText: form.heroBadgeText,
        featuredLabel: form.featuredLabel,
        offerTitle: form.offerTitle,
        offerEyebrow: form.offerEyebrow,
        offerSubtitle: form.offerSubtitle,
        offerTerms: form.offerTerms,
        dishesEyebrow: form.dishesEyebrow,
        dishesTitle: form.dishesTitle,
        dishesSubtitle: form.dishesSubtitle,
        locationSubtitle: form.locationSubtitle,
        locationEyebrow: form.locationEyebrow,
        locationTitle: form.locationTitle,
        footerCtaText: form.footerCtaText,
        footerBrandTitle: form.footerBrandTitle,
        footerPrimaryButtonText: form.footerPrimaryButtonText,
        avgWaitText: form.avgWaitText,
        offerBadgeText: form.offerBadgeText,
        completeMenuEyebrow: form.completeMenuEyebrow,
        completeMenuTitle: form.completeMenuTitle,
        completeMenuSubtitle: form.completeMenuSubtitle,
      });

      const nextRestaurant = { ...initialRestaurant, ...form };
      onUpdated?.(nextRestaurant);
      setMessage("Basic information saved.");
    } catch {
      setError("Failed to save basic information.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="p-6 sm:p-8">
      <h2 className="text-xl font-bold text-slate-900">Basic Info</h2>
      <form className="mt-5 grid gap-4" onSubmit={onSave}>
        <label className="grid gap-1 text-sm text-slate-700">
          Restaurant Name
          <input
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            className="rounded-xl border border-slate-200 px-4 py-2.5 outline-none ring-[#25D366]/40 focus:ring-2"
            required
          />
        </label>

        <label className="grid gap-1 text-sm text-slate-700">
          WhatsApp Number
          <input
            value={form.whatsappNumber}
            onChange={(e) => setForm((prev) => ({ ...prev, whatsappNumber: e.target.value }))}
            className="rounded-xl border border-slate-200 px-4 py-2.5 outline-none ring-[#25D366]/40 focus:ring-2"
            required
          />
        </label>

        <label className="grid gap-1 text-sm text-slate-700">
          Address
          <input
            value={form.address}
            onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))}
            className="rounded-xl border border-slate-200 px-4 py-2.5 outline-none ring-[#25D366]/40 focus:ring-2"
            required
          />
        </label>

        <label className="grid gap-1 text-sm text-slate-700">
          Coupon Code
          <input
            value={form.couponCode}
            onChange={(e) => setForm((prev) => ({ ...prev, couponCode: e.target.value }))}
            className="rounded-xl border border-slate-200 px-4 py-2.5 outline-none ring-[#25D366]/40 focus:ring-2"
            required
          />
        </label>

        <label className="grid gap-1 text-sm text-slate-700">
          Header Tagline
          <input
            value={form.headerTagline}
            onChange={(e) => setForm((prev) => ({ ...prev, headerTagline: e.target.value }))}
            className="rounded-xl border border-slate-200 px-4 py-2.5 outline-none ring-[#25D366]/40 focus:ring-2"
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-1 text-sm text-slate-700">
            Header Location Label
            <input
              value={form.locationNavLabel}
              onChange={(e) => setForm((prev) => ({ ...prev, locationNavLabel: e.target.value }))}
              className="rounded-xl border border-slate-200 px-4 py-2.5 outline-none ring-[#25D366]/40 focus:ring-2"
            />
          </label>

          <label className="grid gap-1 text-sm text-slate-700">
            Header Contact Label
            <input
              value={form.contactNavLabel}
              onChange={(e) => setForm((prev) => ({ ...prev, contactNavLabel: e.target.value }))}
              className="rounded-xl border border-slate-200 px-4 py-2.5 outline-none ring-[#25D366]/40 focus:ring-2"
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-1 text-sm text-slate-700">
            Hero Badge Text
            <input
              value={form.heroBadgeText}
              onChange={(e) => setForm((prev) => ({ ...prev, heroBadgeText: e.target.value }))}
              className="rounded-xl border border-slate-200 px-4 py-2.5 outline-none ring-[#25D366]/40 focus:ring-2"
            />
          </label>

          <label className="grid gap-1 text-sm text-slate-700">
            Carousel Featured Label
            <input
              value={form.featuredLabel}
              onChange={(e) => setForm((prev) => ({ ...prev, featuredLabel: e.target.value }))}
              className="rounded-xl border border-slate-200 px-4 py-2.5 outline-none ring-[#25D366]/40 focus:ring-2"
            />
          </label>
        </div>

        <label className="grid gap-1 text-sm text-slate-700">
          Dishes Section Eyebrow
          <input
            value={form.dishesEyebrow}
            onChange={(e) => setForm((prev) => ({ ...prev, dishesEyebrow: e.target.value }))}
            className="rounded-xl border border-slate-200 px-4 py-2.5 outline-none ring-[#25D366]/40 focus:ring-2"
          />
        </label>

        <label className="grid gap-1 text-sm text-slate-700">
          Dishes Section Title
          <input
            value={form.dishesTitle}
            onChange={(e) => setForm((prev) => ({ ...prev, dishesTitle: e.target.value }))}
            className="rounded-xl border border-slate-200 px-4 py-2.5 outline-none ring-[#25D366]/40 focus:ring-2"
          />
        </label>

        <label className="grid gap-1 text-sm text-slate-700">
          Dishes Section Subtitle
          <textarea
            value={form.dishesSubtitle}
            onChange={(e) => setForm((prev) => ({ ...prev, dishesSubtitle: e.target.value }))}
            className="rounded-xl border border-slate-200 px-4 py-2.5 outline-none ring-[#25D366]/40 focus:ring-2"
            rows={2}
          />
        </label>

        <label className="grid gap-1 text-sm text-slate-700">
          Complete Menu Eyebrow
          <input
            value={form.completeMenuEyebrow}
            onChange={(e) => setForm((prev) => ({ ...prev, completeMenuEyebrow: e.target.value }))}
            className="rounded-xl border border-slate-200 px-4 py-2.5 outline-none ring-[#25D366]/40 focus:ring-2"
          />
        </label>

        <label className="grid gap-1 text-sm text-slate-700">
          Complete Menu Title
          <input
            value={form.completeMenuTitle}
            onChange={(e) => setForm((prev) => ({ ...prev, completeMenuTitle: e.target.value }))}
            className="rounded-xl border border-slate-200 px-4 py-2.5 outline-none ring-[#25D366]/40 focus:ring-2"
          />
        </label>

        <label className="grid gap-1 text-sm text-slate-700">
          Complete Menu Subtitle
          <textarea
            value={form.completeMenuSubtitle}
            onChange={(e) => setForm((prev) => ({ ...prev, completeMenuSubtitle: e.target.value }))}
            className="rounded-xl border border-slate-200 px-4 py-2.5 outline-none ring-[#25D366]/40 focus:ring-2"
            rows={2}
          />
        </label>

        <label className="grid gap-1 text-sm text-slate-700">
          Offer Title
          <input
            value={form.offerTitle}
            onChange={(e) => setForm((prev) => ({ ...prev, offerTitle: e.target.value }))}
            className="rounded-xl border border-slate-200 px-4 py-2.5 outline-none ring-[#25D366]/40 focus:ring-2"
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-1 text-sm text-slate-700">
            Offer Eyebrow
            <input
              value={form.offerEyebrow}
              onChange={(e) => setForm((prev) => ({ ...prev, offerEyebrow: e.target.value }))}
              className="rounded-xl border border-slate-200 px-4 py-2.5 outline-none ring-[#25D366]/40 focus:ring-2"
            />
          </label>

          <label className="grid gap-1 text-sm text-slate-700">
            Offer Subtitle
            <input
              value={form.offerSubtitle}
              onChange={(e) => setForm((prev) => ({ ...prev, offerSubtitle: e.target.value }))}
              className="rounded-xl border border-slate-200 px-4 py-2.5 outline-none ring-[#25D366]/40 focus:ring-2"
            />
          </label>
        </div>

        <label className="grid gap-1 text-sm text-slate-700">
          Offer Terms
          <textarea
            value={form.offerTerms}
            onChange={(e) => setForm((prev) => ({ ...prev, offerTerms: e.target.value }))}
            className="rounded-xl border border-slate-200 px-4 py-2.5 outline-none ring-[#25D366]/40 focus:ring-2"
            rows={2}
          />
        </label>

        <label className="grid gap-1 text-sm text-slate-700">
          Location Section Subtitle
          <textarea
            value={form.locationSubtitle}
            onChange={(e) => setForm((prev) => ({ ...prev, locationSubtitle: e.target.value }))}
            className="rounded-xl border border-slate-200 px-4 py-2.5 outline-none ring-[#25D366]/40 focus:ring-2"
            rows={2}
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-1 text-sm text-slate-700">
            Location Section Eyebrow
            <input
              value={form.locationEyebrow}
              onChange={(e) => setForm((prev) => ({ ...prev, locationEyebrow: e.target.value }))}
              className="rounded-xl border border-slate-200 px-4 py-2.5 outline-none ring-[#25D366]/40 focus:ring-2"
            />
          </label>

          <label className="grid gap-1 text-sm text-slate-700">
            Location Section Title
            <input
              value={form.locationTitle}
              onChange={(e) => setForm((prev) => ({ ...prev, locationTitle: e.target.value }))}
              className="rounded-xl border border-slate-200 px-4 py-2.5 outline-none ring-[#25D366]/40 focus:ring-2"
            />
          </label>
        </div>

        <label className="grid gap-1 text-sm text-slate-700">
          Footer CTA Text
          <input
            value={form.footerCtaText}
            onChange={(e) => setForm((prev) => ({ ...prev, footerCtaText: e.target.value }))}
            className="rounded-xl border border-slate-200 px-4 py-2.5 outline-none ring-[#25D366]/40 focus:ring-2"
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-1 text-sm text-slate-700">
            Footer Brand Title
            <input
              value={form.footerBrandTitle}
              onChange={(e) => setForm((prev) => ({ ...prev, footerBrandTitle: e.target.value }))}
              className="rounded-xl border border-slate-200 px-4 py-2.5 outline-none ring-[#25D366]/40 focus:ring-2"
            />
          </label>

          <label className="grid gap-1 text-sm text-slate-700">
            Footer Primary Button Label
            <input
              value={form.footerPrimaryButtonText}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, footerPrimaryButtonText: e.target.value }))
              }
              className="rounded-xl border border-slate-200 px-4 py-2.5 outline-none ring-[#25D366]/40 focus:ring-2"
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-1 text-sm text-slate-700">
            Avg Wait Text
            <input
              value={form.avgWaitText}
              onChange={(e) => setForm((prev) => ({ ...prev, avgWaitText: e.target.value }))}
              className="rounded-xl border border-slate-200 px-4 py-2.5 outline-none ring-[#25D366]/40 focus:ring-2"
            />
          </label>

          <label className="grid gap-1 text-sm text-slate-700">
            Coupon Badge Text
            <input
              value={form.offerBadgeText}
              onChange={(e) => setForm((prev) => ({ ...prev, offerBadgeText: e.target.value }))}
              className="rounded-xl border border-slate-200 px-4 py-2.5 outline-none ring-[#25D366]/40 focus:ring-2"
            />
          </label>
        </div>

        {message ? <p className="text-sm text-emerald-600">{message}</p> : null}
        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <Button type="submit" disabled={saving} className="w-fit">
          {saving ? "Saving..." : "Save Basic Info"}
        </Button>
      </form>
    </Card>
  );
}
