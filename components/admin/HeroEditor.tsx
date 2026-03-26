"use client";

import { FormEvent, useEffect, useState } from "react";
import { updateRestaurant, uploadImage } from "@/lib/queries";
import type { Restaurant } from "@/types";
import { Button } from "@/app/components/ui/Button";
import { Card } from "@/app/components/ui/Card";

type Props = {
  restaurantId: string;
  initialRestaurant: Restaurant;
  onUpdated?: (next: Restaurant) => void;
};

export function HeroEditor({ restaurantId, initialRestaurant, onUpdated }: Props) {
  const [headerTagline, setHeaderTagline] = useState(initialRestaurant.headerTagline || "");
  const [locationNavLabel, setLocationNavLabel] = useState(
    initialRestaurant.locationNavLabel || ""
  );
  const [contactNavLabel, setContactNavLabel] = useState(
    initialRestaurant.contactNavLabel || ""
  );
  const [heroBadgeText, setHeroBadgeText] = useState(initialRestaurant.heroBadgeText || "");
  const [heroTitle, setHeroTitle] = useState(initialRestaurant.heroTitle);
  const [heroSubtitle, setHeroSubtitle] = useState(initialRestaurant.heroSubtitle);
  const [heroImage, setHeroImage] = useState(initialRestaurant.heroImage || "");
  const [avgWaitText, setAvgWaitText] = useState(initialRestaurant.avgWaitText || "");
  const [offerBadgeText, setOfferBadgeText] = useState(initialRestaurant.offerBadgeText || "");
    const [countryCode, setCountryCode] = useState(initialRestaurant.countryCode || "");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setHeaderTagline(initialRestaurant.headerTagline || "");
    setLocationNavLabel(initialRestaurant.locationNavLabel || "");
    setContactNavLabel(initialRestaurant.contactNavLabel || "");
    setHeroBadgeText(initialRestaurant.heroBadgeText || "");
    setHeroTitle(initialRestaurant.heroTitle);
    setHeroSubtitle(initialRestaurant.heroSubtitle);
    setHeroImage(initialRestaurant.heroImage || "");
    setAvgWaitText(initialRestaurant.avgWaitText || "");
    setOfferBadgeText(initialRestaurant.offerBadgeText || "");
     setCountryCode(initialRestaurant.countryCode || "");
  }, [initialRestaurant]);

  const onSave = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);

    try {
      await updateRestaurant(restaurantId, {
        headerTagline,
        locationNavLabel,
        contactNavLabel,
        heroBadgeText,
        heroTitle,
        heroSubtitle,
        avgWaitText,
        offerBadgeText,
         countryCode,
      });
      onUpdated?.({
        ...initialRestaurant,
        headerTagline,
        locationNavLabel,
        contactNavLabel,
        heroBadgeText,
        heroTitle,
        heroSubtitle,
        heroImage,
        avgWaitText,
        offerBadgeText,
         countryCode,
      });
      setMessage("Hero content updated.");
    } catch {
      setError("Failed to update hero content.");
    } finally {
      setSaving(false);
    }
  };

  const onUploadHero = async (file: File) => {
    setUploading(true);
    setMessage(null);
    setError(null);

    try {
      const imageUrl = await uploadImage(restaurantId, file);
      await updateRestaurant(restaurantId, { heroImage: imageUrl });
      setHeroImage(imageUrl);
      onUpdated?.({ ...initialRestaurant, heroTitle, heroSubtitle, heroImage: imageUrl });
      setMessage("Hero image uploaded.");
    } catch {
      setError("Failed to upload hero image.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="p-6 sm:p-8">
      <h2 className="text-xl font-bold text-slate-900">Homepage Hero Section</h2>
      <form className="mt-5 grid gap-4" onSubmit={onSave}>
        <label className="grid gap-1 text-sm text-slate-700">
          Header Tagline
          <input
            value={headerTagline}
            onChange={(e) => setHeaderTagline(e.target.value)}
            className="rounded-xl border border-slate-200 px-4 py-2.5 outline-none ring-[#25D366]/40 focus:ring-2"
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-1 text-sm text-slate-700">
            Header Location Label
            <input
              value={locationNavLabel}
              onChange={(e) => setLocationNavLabel(e.target.value)}
              className="rounded-xl border border-slate-200 px-4 py-2.5 outline-none ring-[#25D366]/40 focus:ring-2"
            />
          </label>

          <label className="grid gap-1 text-sm text-slate-700">
            Header Contact Label
            <input
              value={contactNavLabel}
              onChange={(e) => setContactNavLabel(e.target.value)}
              className="rounded-xl border border-slate-200 px-4 py-2.5 outline-none ring-[#25D366]/40 focus:ring-2"
            />
          </label>
        </div>

        <label className="grid gap-1 text-sm text-slate-700">
          Hero Badge Text
          <input
            value={heroBadgeText}
            onChange={(e) => setHeroBadgeText(e.target.value)}
            className="rounded-xl border border-slate-200 px-4 py-2.5 outline-none ring-[#25D366]/40 focus:ring-2"
          />
        </label>
        <label className="grid gap-1 text-sm text-slate-700">
          WhatsApp Country Code
          <input
            type="text"
            value={countryCode}
            onChange={(e) => setCountryCode(e.target.value.replace(/[^0-9]/g, ""))}
            placeholder="e.g., 91 (India), 1 (USA), 44 (UK)"
            className="rounded-xl border border-slate-200 px-4 py-2.5 outline-none ring-[#25D366]/40 focus:ring-2"
          />
        </label>

        <label className="grid gap-1 text-sm text-slate-700">
          Hero Title
          <input
            value={heroTitle}
            onChange={(e) => setHeroTitle(e.target.value)}
            className="rounded-xl border border-slate-200 px-4 py-2.5 outline-none ring-[#25D366]/40 focus:ring-2"
            required
          />
        </label>

        <label className="grid gap-1 text-sm text-slate-700">
          Hero Subtitle
          <textarea
            value={heroSubtitle}
            onChange={(e) => setHeroSubtitle(e.target.value)}
            className="rounded-xl border border-slate-200 px-4 py-2.5 outline-none ring-[#25D366]/40 focus:ring-2"
            rows={3}
            required
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-1 text-sm text-slate-700">
            Avg Wait Text
            <input
              value={avgWaitText}
              onChange={(e) => setAvgWaitText(e.target.value)}
              className="rounded-xl border border-slate-200 px-4 py-2.5 outline-none ring-[#25D366]/40 focus:ring-2"
            />
          </label>

          <label className="grid gap-1 text-sm text-slate-700">
            Offer Badge Text
            <input
              value={offerBadgeText}
              onChange={(e) => setOfferBadgeText(e.target.value)}
              className="rounded-xl border border-slate-200 px-4 py-2.5 outline-none ring-[#25D366]/40 focus:ring-2"
            />
          </label>
        </div>

        <div className="grid gap-2">
          <label className="text-sm text-slate-700">Hero Image</label>
          <input
            type="file"
            accept="image/*"
            disabled={uploading}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                void onUploadHero(file);
              }
            }}
          />
          {heroImage ? <p className="text-xs break-all text-slate-500">{heroImage}</p> : null}
        </div>

        {message ? <p className="text-sm text-emerald-600">{message}</p> : null}
        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <div className="flex gap-2">
          <Button type="submit" disabled={saving || uploading} className="w-fit">
            {saving ? "Saving..." : "Save Hero"}
          </Button>
          {uploading ? <p className="text-sm text-slate-500">Uploading image...</p> : null}
        </div>
      </form>
    </Card>
  );
}
