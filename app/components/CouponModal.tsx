"use client";

import { useEffect } from "react";
import { COUPON } from "@/app/lib/constants";
import { Button } from "@/app/components/ui/Button";
import { Card } from "@/app/components/ui/Card";

export function CouponModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
    >
      <button
        className="absolute inset-0 bg-black/40"
        aria-label="Close coupon modal"
        onClick={onClose}
      />
      <Card className="relative w-full max-w-[420px] overflow-hidden">
        <div
          className="absolute inset-0 opacity-80"
          style={{
            background:
              "radial-gradient(90% 80% at 20% 0%, rgba(37,211,102,0.18) 0%, transparent 55%), radial-gradient(70% 70% at 100% 20%, rgba(15,23,42,0.08) 0%, transparent 55%)",
          }}
        />
        <div className="relative p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                Coupon code
              </p>
              <p className="mt-2 text-2xl font-black tracking-tight text-slate-900">
                {COUPON.code}
              </p>
              <p className="mt-1 text-sm text-slate-600">
                Show this at the counter to get 20% off.
              </p>
            </div>
            <button
              className="rounded-xl bg-white px-3 py-2 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
              onClick={onClose}
            >
              Close
            </button>
          </div>

          <div className="mt-4 flex gap-3">
            <Button
              className="flex-1"
              onClick={async () => {
                await navigator.clipboard.writeText(COUPON.code);
              }}
            >
              Copy Code
            </Button>
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => {
                const el = document.getElementById("location");
                el?.scrollIntoView({ behavior: "smooth", block: "start" });
                onClose();
              }}
            >
              Visit Us
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

