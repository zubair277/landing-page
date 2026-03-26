"use client";

import { FormEvent, useState } from "react";
import type { Restaurant } from "@/types";
import { Card } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";

export function AssignAdminModal({
  open,
  onClose,
  restaurant,
  onSubmit,
  loading,
}: {
  open: boolean;
  onClose: () => void;
  restaurant: Restaurant | null;
  onSubmit: (email: string) => Promise<void>;
  loading: boolean;
}) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!open || !restaurant) {
    return null;
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    try {
      await onSubmit(email);
      setEmail("");
    } catch (err: any) {
      setError(err.message || "Failed to assign admin.");
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
    >
      <button
        className="absolute inset-0 bg-black/40"
        aria-label="Close modal"
        onClick={onClose}
      />
      <Card className="relative w-full max-w-[420px] overflow-hidden">
        <div className="p-6 sm:p-8">
          <h2 className="text-xl font-bold text-slate-900">Assign Admin</h2>
          <p className="mt-1 text-sm text-slate-600">{restaurant.name}</p>

          <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
            <label className="grid gap-1 text-sm text-slate-700">
              Admin Email
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="admin@example.com"
                className="rounded-xl border border-slate-200 px-4 py-2.5 outline-none ring-[#25D366]/40 focus:ring-2"
                required
              />
              <p className="mt-1 text-xs text-slate-500">
                User must have an account already to be assigned as admin.
              </p>
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
                {loading ? "Assigning..." : "Assign"}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}
