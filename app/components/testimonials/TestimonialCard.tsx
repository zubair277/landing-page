"use client";

import { Card } from "@/app/components/ui/Card";

export type Testimonial = {
  name: string;
  text: string;
  rating?: number;
};

export function TestimonialCard({ t }: { t: Testimonial }) {
  const rating = t.rating ?? 5;

  return (
    <Card className="w-80 shrink-0 p-5 shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-slate-900">{t.name}</p>
          <p className="mt-0.5 text-xs text-slate-500">Verified visit</p>
        </div>
        <div className="flex items-center gap-1 text-slate-700" aria-label={`${rating} star rating`}>
          <span aria-hidden>★</span>
          <span className="text-xs font-semibold">{rating.toFixed(1)}</span>
        </div>
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-700">“{t.text}”</p>
    </Card>
  );
}

