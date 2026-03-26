"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  addMedia,
  deleteMedia,
  getMediaByRestaurant,
  updateMedia,
  uploadImage,
} from "@/lib/queries";
import type { MediaItem, MediaType } from "@/types";
import { Button } from "@/app/components/ui/Button";
import { Card } from "@/app/components/ui/Card";

type Props = {
  restaurantId: string;
  initialData: MediaItem[];
};

const PUBLIC_IMAGE_LIBRARY = [
  "/images/classic-mojito.jpg",
  "/images/grilled-fish-lemon-butter.jpg",
  "/images/hero-miri.jpg",
  "/images/paneer-steak-herb-sauce.jpg",
  "/images/passionfruit-martini.jpg",
  "/images/peri-peri-chicken-skewers.jpg",
  "/images/truffle-mushroom-arancini.jpg",
];

function inferMediaType(path: string): MediaType {
  if (path.includes("hero")) return "hero";
  if (path.includes("review")) return "review";
  if (path.includes("offer") || path.includes("paneer")) return "offer";
  return "gallery";
}

function inferTitle(path: string) {
  return path
    .replace("/images/", "")
    .replace(/\.[^/.]+$/, "")
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function MediaUploader({ restaurantId, initialData }: Props) {
  const [media, setMedia] = useState<MediaItem[]>(initialData);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [newMedia, setNewMedia] = useState({
    type: "gallery" as MediaType,
    title: "",
    subtitle: "",
    description: "",
    imageUrl: "",
  });

  useEffect(() => {
    setMedia(initialData);
  }, [initialData]);

  const reload = async () => {
    const next = await getMediaByRestaurant(restaurantId);
    setMedia(next);
  };

  const onCreate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);

    try {
      await addMedia({
        restaurantId,
        type: newMedia.type,
        imageUrl: newMedia.imageUrl,
        title: newMedia.title,
        subtitle: newMedia.subtitle,
        description: newMedia.description,
      });
      setNewMedia({
        type: "gallery",
        title: "",
        subtitle: "",
        description: "",
        imageUrl: "",
      });
      await reload();
      setMessage("Media item added.");
    } catch {
      setError("Failed to add media item.");
    } finally {
      setSaving(false);
    }
  };

  const onUploadMedia = async (file: File) => {
    setSaving(true);
    setMessage(null);
    setError(null);

    try {
      const imageUrl = await uploadImage(restaurantId, file);
      setNewMedia((prev) => ({ ...prev, imageUrl }));
      setMessage("Media image uploaded.");
    } catch {
      setError("Failed to upload media image.");
    } finally {
      setSaving(false);
    }
  };

  const onExistingMediaImageUpload = async (mediaId: string, file: File) => {
    setSaving(true);
    setMessage(null);
    setError(null);

    try {
      const imageUrl = await uploadImage(restaurantId, file);
      setMedia((prev) =>
        prev.map((item) => (item.id === mediaId ? { ...item, imageUrl } : item))
      );
      setMessage("Media image uploaded. Click Save on that row to persist.");
    } catch {
      setError("Failed to upload existing media image.");
    } finally {
      setSaving(false);
    }
  };

  const onImportPublicImages = async () => {
    setSaving(true);
    setMessage(null);
    setError(null);

    try {
      const existing = new Set(media.map((item) => item.imageUrl));
      const missing = PUBLIC_IMAGE_LIBRARY.filter((path) => !existing.has(path));

      await Promise.all(
        missing.map((imagePath) =>
          addMedia({
            restaurantId,
            type: inferMediaType(imagePath),
            imageUrl: imagePath,
            title: inferTitle(imagePath),
            subtitle: "",
            description: "",
          })
        )
      );

      await reload();
      setMessage(
        missing.length === 0
          ? "All public images are already present."
          : `Imported ${missing.length} public image(s).`
      );
    } catch {
      setError("Failed to import public images.");
    } finally {
      setSaving(false);
    }
  };

  const onSave = async (item: MediaItem) => {
    setSaving(true);
    setMessage(null);
    setError(null);

    try {
      await updateMedia(item.id, {
        type: item.type,
        imageUrl: item.imageUrl,
        title: item.title,
        subtitle: item.subtitle,
        description: item.description,
      });
      setMessage("Media item updated.");
    } catch {
      setError("Failed to update media item.");
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (id: string) => {
    setSaving(true);
    setMessage(null);
    setError(null);

    try {
      await deleteMedia(id);
      await reload();
      setMessage("Media item deleted.");
    } catch {
      setError("Failed to delete media item.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="p-6 sm:p-8">
      <h2 className="text-xl font-bold text-slate-900">Media / Gallery</h2>

      <form className="mt-5 grid gap-3" onSubmit={onCreate}>
        <p className="text-sm font-semibold text-slate-800">Add Media Item</p>
        <select
          value={newMedia.type}
          onChange={(e) => setNewMedia((prev) => ({ ...prev, type: e.target.value as MediaType }))}
          className="rounded-xl border border-slate-200 px-4 py-2.5"
        >
          <option value="hero">hero</option>
          <option value="dish">dish</option>
          <option value="offer">offer</option>
          <option value="review">review</option>
          <option value="gallery">gallery</option>
        </select>
        <input
          placeholder="Title"
          value={newMedia.title}
          onChange={(e) => setNewMedia((prev) => ({ ...prev, title: e.target.value }))}
          className="rounded-xl border border-slate-200 px-4 py-2.5"
        />
        <input
          placeholder="Subtitle"
          value={newMedia.subtitle}
          onChange={(e) => setNewMedia((prev) => ({ ...prev, subtitle: e.target.value }))}
          className="rounded-xl border border-slate-200 px-4 py-2.5"
        />
        <textarea
          rows={2}
          placeholder="Description"
          value={newMedia.description}
          onChange={(e) => setNewMedia((prev) => ({ ...prev, description: e.target.value }))}
          className="rounded-xl border border-slate-200 px-4 py-2.5"
        />
        <input
          placeholder="Image URL"
          value={newMedia.imageUrl}
          onChange={(e) => setNewMedia((prev) => ({ ...prev, imageUrl: e.target.value }))}
          className="rounded-xl border border-slate-200 px-4 py-2.5"
          list="public-media-library"
          required
        />
        <input
          type="file"
          accept="image/*"
          disabled={saving}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              void onUploadMedia(file);
            }
          }}
        />
        <Button type="submit" className="w-fit" disabled={saving}>
          {saving ? "Saving..." : "Add Media"}
        </Button>
        <Button type="button" variant="secondary" className="w-fit" disabled={saving} onClick={() => void onImportPublicImages()}>
          Import Public Images
        </Button>
      </form>

      {message ? <p className="mt-4 text-sm text-emerald-600">{message}</p> : null}
      {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

      <div className="mt-6 grid gap-3">
        {media.map((item) => (
          <div key={item.id} className="rounded-xl border border-slate-200 p-4">
            <div className="grid gap-2 sm:grid-cols-2">
              <select
                value={item.type}
                onChange={(e) =>
                  setMedia((prev) =>
                    prev.map((x) => (x.id === item.id ? { ...x, type: e.target.value as MediaType } : x))
                  )
                }
                className="rounded-lg border border-slate-200 px-3 py-2"
              >
                <option value="hero">hero</option>
                <option value="dish">dish</option>
                <option value="offer">offer</option>
                <option value="review">review</option>
                <option value="gallery">gallery</option>
              </select>
              <input
                value={item.imageUrl}
                onChange={(e) =>
                  setMedia((prev) =>
                    prev.map((x) => (x.id === item.id ? { ...x, imageUrl: e.target.value } : x))
                  )
                }
                className="rounded-lg border border-slate-200 px-3 py-2"
                list="public-media-library"
              />
              <input
                value={item.title || ""}
                onChange={(e) =>
                  setMedia((prev) =>
                    prev.map((x) => (x.id === item.id ? { ...x, title: e.target.value } : x))
                  )
                }
                className="rounded-lg border border-slate-200 px-3 py-2"
                placeholder="Title"
              />
              <input
                value={item.subtitle || ""}
                onChange={(e) =>
                  setMedia((prev) =>
                    prev.map((x) => (x.id === item.id ? { ...x, subtitle: e.target.value } : x))
                  )
                }
                className="rounded-lg border border-slate-200 px-3 py-2"
                placeholder="Subtitle"
              />
            </div>
            <input
              type="file"
              accept="image/*"
              disabled={saving}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  void onExistingMediaImageUpload(item.id, file);
                }
              }}
              className="mt-2"
            />
            <textarea
              rows={2}
              value={item.description || ""}
              onChange={(e) =>
                setMedia((prev) =>
                  prev.map((x) => (x.id === item.id ? { ...x, description: e.target.value } : x))
                )
              }
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2"
              placeholder="Description"
            />
            <div className="mt-3 flex gap-2">
              <Button variant="secondary" disabled={saving} onClick={() => void onSave(item)}>
                Save
              </Button>
              <Button disabled={saving} onClick={() => void onDelete(item.id)}>
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      <datalist id="public-media-library">
        {PUBLIC_IMAGE_LIBRARY.map((imagePath) => (
          <option key={imagePath} value={imagePath} />
        ))}
      </datalist>
    </Card>
  );
}
