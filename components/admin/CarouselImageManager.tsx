"use client";

import { useEffect, useState } from "react";
import { updateRestaurant, uploadImage } from "@/lib/queries";
import type { Restaurant } from "@/types";
import { Button } from "@/app/components/ui/Button";
import { Card } from "@/app/components/ui/Card";

type Props = {
  restaurantId: string;
  initialRestaurant: Restaurant;
  onUpdated?: (next: Restaurant) => void;
};

export function CarouselImageManager({ restaurantId, initialRestaurant, onUpdated }: Props) {
  const [carouselImages, setCarouselImages] = useState<string[]>(
    initialRestaurant.carouselImages || []
  );
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isSameImages = (a: string[], b: string[]) =>
    a.length === b.length && a.every((value, index) => value === b[index]);

  useEffect(() => {
    const nextImages = initialRestaurant.carouselImages || [];
    setCarouselImages((prev) => (isSameImages(prev, nextImages) ? prev : nextImages));
  }, [initialRestaurant]);

  const onUploadCarouselImage = async (file: File, index: number) => {
    setUploading(true);
    setMessage(null);
    setError(null);

    try {
      const imageUrl = await uploadImage(restaurantId, file);
      const updatedImages = [...carouselImages];
      updatedImages[index] = imageUrl;

      await updateRestaurant(restaurantId, { carouselImages: updatedImages });
      setCarouselImages(updatedImages);
      onUpdated?.({
        ...initialRestaurant,
        carouselImages: updatedImages,
      });
      setMessage(`Carousel image ${index + 1} uploaded successfully.`);
    } catch {
      setError(`Failed to upload carousel image ${index + 1}.`);
    } finally {
      setUploading(false);
    }
  };

  const onRemoveCarouselImage = async (index: number) => {
    setMessage(null);
    setError(null);

    try {
      const updatedImages = carouselImages.filter((_, i) => i !== index);
      await updateRestaurant(restaurantId, { carouselImages: updatedImages });
      setCarouselImages(updatedImages);
      onUpdated?.({
        ...initialRestaurant,
        carouselImages: updatedImages,
      });
      setMessage(`Carousel image removed.`);
    } catch {
      setError("Failed to remove carousel image.");
    }
  };

  return (
    <Card className="p-6 sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Carousel Images (iPhone Mockup)</h2>
          <p className="mt-2 text-sm text-slate-600">
            Upload up to 3 images that will auto-slide in the iPhone mockup carousel.
          </p>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
          {carouselImages.length}/3 images uploaded
        </div>
      </div>

      <div className="mt-6 grid gap-4">
        {[0, 1, 2].map((index) => (
          <div key={index} className="rounded-2xl border border-slate-200 bg-gradient-to-r from-white to-slate-50 p-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-slate-700">
                Carousel Image {index + 1}
              </label>
              {carouselImages[index] && (
                <button
                  type="button"
                  onClick={() => void onRemoveCarouselImage(index)}
                  className="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Remove
                </button>
              )}
            </div>

            {carouselImages[index] ? (
              <div className="mt-3 flex flex-col gap-2">
                <div className="relative h-32 w-full overflow-hidden rounded-lg bg-slate-100">
                  <img
                    src={carouselImages[index]}
                    alt={`Carousel ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </div>
                <p className="text-xs break-all text-slate-500">{carouselImages[index]}</p>
              </div>
            ) : (
              <div className="mt-3 rounded-xl border border-dashed border-slate-300 bg-white/80 px-3 py-4 text-center text-sm text-slate-500">
                No image uploaded yet
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              disabled={uploading}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  void onUploadCarouselImage(file, index);
                }
              }}
              className="mt-3 block w-full text-sm text-slate-500 file:mr-4 file:rounded-lg file:border-0 file:bg-slate-900 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-slate-800"
            />
            <p className="mt-1 text-xs text-slate-500">Recommended: ratio 4:3, less than 2MB.</p>
          </div>
        ))}
      </div>

      {message ? <p className="mt-4 text-sm text-emerald-600 font-medium">{message}</p> : null}
      {error ? <p className="mt-4 text-sm text-red-600 font-medium">{error}</p> : null}

      {uploading && (
        <p className="mt-4 text-sm text-slate-600">
          Uploading carousel image...
        </p>
      )}
    </Card>
  );
}
