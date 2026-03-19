"use client";

import { ExternalButtonLink, Button } from "@/app/components/ui/Button";
import { COUPON, whatsappLink } from "@/app/lib/constants";

export function StickyCtaBar({ onCoupon }: { onCoupon: () => void }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 px-4 pb-safe sm:hidden">
      <div className="mx-auto max-w-6xl rounded-2xl bg-white/90 ring-1 ring-slate-200 shadow-lg backdrop-blur">
        <div className="flex items-center gap-3 p-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-slate-900">
              {COUPON.discountText}
            </p>
            <p className="truncate text-[11px] text-slate-600">
              Tap to claim on WhatsApp
            </p>
          </div>
          <ExternalButtonLink
            href={whatsappLink()}
            className="whitespace-nowrap px-4 py-2.5 text-sm"
          >
            WhatsApp Now
          </ExternalButtonLink>
          <Button
            variant="secondary"
            className="whitespace-nowrap px-4 py-2.5 text-sm"
            onClick={onCoupon}
          >
            Code
          </Button>
        </div>
      </div>
    </div>
  );
}

