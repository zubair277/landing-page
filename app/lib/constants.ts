export const BRAND = {
  name: "Miri | Global Fusion Dining",
  tagline: "A global dining experience in the heart of Miramar",
} as const;

// TODO: replace with your real WhatsApp number (digits only, country code included).
export const WHATSAPP_NUMBER = "15551234567";

export const COUPON = {
  code: "MIRI20",
  discountText: "Get 20% discount on your visit",
  prefilledMessage: "Hi I want a coupon",
} as const;

export function whatsappLink() {
  const text = encodeURIComponent(COUPON.prefilledMessage);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}

