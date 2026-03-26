"use client";

import { FormEvent, useState } from "react";
import { Card } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { QUICK_SETUP_STEPS, generateRestaurantTemplate } from "@/lib/restaurant-template";

export function QuickSetupWizard({
  open,
  onClose,
  onSubmit,
  loading,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  loading: boolean;
}) {
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    address: "",
    whatsappNumber: "",
    couponCode: "",
    heroTitle: "",
    heroSubtitle: "",
  });

  if (!open) return null;

  const currentStep = QUICK_SETUP_STEPS[step];
  const isLastStep = step === QUICK_SETUP_STEPS.length - 1;

  const handleNext = async () => {
    setError(null);

    // Validate current step
    if (step === 0) {
      if (
        !formData.name ||
        !formData.slug ||
        !formData.address ||
        !formData.whatsappNumber ||
        !formData.couponCode
      ) {
        setError("Please fill all required fields");
        return;
      }
    } else if (step === 1) {
      if (!formData.heroTitle || !formData.heroSubtitle) {
        setError("Please fill hero title and subtitle");
        return;
      }
    }

    if (isLastStep) {
      // Submit
      try {
        await onSubmit(formData);
        // Reset
        setStep(0);
        setFormData({
          name: "",
          slug: "",
          address: "",
          whatsappNumber: "",
          couponCode: "",
          heroTitle: "",
          heroSubtitle: "",
        });
      } catch (err: any) {
        setError(err.message || "Failed to create restaurant");
      }
    } else {
      setStep(step + 1);
    }
  };

  const handlePrev = () => {
    setError(null);
    if (step > 0) {
      setStep(step - 1);
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
        aria-label="Close wizard"
        onClick={onClose}
      />

      <Card className="relative w-full max-w-[500px] overflow-hidden my-8">
        <div className="p-6 sm:p-8">
          {/* Progress */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <p className="text-sm font-semibold text-slate-900">
                {currentStep.title}
              </p>
              <span className="text-xs text-slate-500">
                {step + 1} of {QUICK_SETUP_STEPS.length}
              </span>
            </div>
            <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-slate-900 transition-all"
                style={{
                  width: `${((step + 1) / QUICK_SETUP_STEPS.length) * 100}%`,
                }}
              />
            </div>
            <p className="text-xs text-slate-600 mt-2">{currentStep.description}</p>
          </div>

          {/* Step 1: Basic Info */}
          {step === 0 && (
            <div className="space-y-4">
              <label className="grid gap-1 text-sm text-slate-700">
                Restaurant Name *
                <input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  type="text"
                  placeholder="e.g., Miri"
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-[#25D366]/40 focus:ring-2"
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
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-[#25D366]/40 focus:ring-2"
                  required
                />
                <p className="text-xs text-slate-500">Used in URL: website.com/{formData.slug}</p>
              </label>

              <label className="grid gap-1 text-sm text-slate-700">
                Address *
                <input
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  type="text"
                  placeholder="e.g., Miramar, Panjim, Goa"
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-[#25D366]/40 focus:ring-2"
                  required
                />
              </label>

              <label className="grid gap-1 text-sm text-slate-700">
                WhatsApp Number *
                <input
                  value={formData.whatsappNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, whatsappNumber: e.target.value })
                  }
                  type="text"
                  placeholder="e.g., 15551234567"
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-[#25D366]/40 focus:ring-2"
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
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-[#25D366]/40 focus:ring-2"
                  required
                />
              </label>
            </div>
          )}

          {/* Step 2: Hero Section */}
          {step === 1 && (
            <div className="space-y-4">
              <label className="grid gap-1 text-sm text-slate-700">
                Hero Title *
                <input
                  value={formData.heroTitle}
                  onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
                  type="text"
                  placeholder="e.g., Global Fusion Dining"
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-[#25D366]/40 focus:ring-2"
                  required
                />
              </label>

              <label className="grid gap-1 text-sm text-slate-700">
                Hero Subtitle *
                <input
                  value={formData.heroSubtitle}
                  onChange={(e) =>
                    setFormData({ ...formData, heroSubtitle: e.target.value })
                  }
                  type="text"
                  placeholder="e.g., Experience fine dining at the heart of the city"
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-[#25D366]/40 focus:ring-2"
                  required
                />
              </label>

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <p className="text-xs text-slate-600">
                  💡 <strong>Tip:</strong> Hero image can be uploaded after restaurant creation
                  from the admin dashboard.
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Menu */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  <strong>Next Step:</strong> After creating the restaurant, you'll add menu items
                  from the dashboard. Start with your top 5 dishes.
                </p>
              </div>
            </div>
          )}

          {/* Step 4: Testimonials */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  <strong>Optional:</strong> Add testimonials later from the admin dashboard.
                  Start with 3-5 reviews to build credibility.
                </p>
              </div>
            </div>
          )}

          {/* Error */}
          {error && <p className="text-sm text-red-600 mt-4 p-2 bg-red-50 rounded">{error}</p>}

          {/* Actions */}
          <div className="flex gap-2 mt-6 pt-6 border-t border-slate-200">
            <Button
              type="button"
              variant="secondary"
              onClick={step === 0 ? onClose : handlePrev}
              disabled={loading}
              className="flex-1"
            >
              {step === 0 ? "Cancel" : "Back"}
            </Button>

            <Button
              type="button"
              onClick={handleNext}
              disabled={loading}
              className="flex-1"
            >
              {loading ? "Creating..." : isLastStep ? "Create Restaurant" : "Next"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
