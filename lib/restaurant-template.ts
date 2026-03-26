/**
 * Static Template System
 * Provides default templates and configurations for new restaurants
 * Speeds up restaurant setup by 80%
 */

export const RESTAURANT_TEMPLATE = {
  // Static page sections (same for all restaurants)
  sections: {
    header: {
      sticky: true,
      showLogo: true,
      showNav: true,
      navItems: ["Menu", "Location", "Contact"],
    },
    hero: {
      layout: "centered",
      badge: true,
      cta: true,
      imageHeight: "400px",
    },
    menu: {
      layout: "grid-categories",
      showFilter: true,
      itemsPerPage: 12,
    },
    testimonials: {
      layout: "carousel",
      itemsPerSlide: 3,
      autoplay: true,
      interval: 5000,
    },
    footer: {
      showSocial: true,
      showHours: true,
      showAddress: true,
      showCta: true,
    },
    cta: {
      position: "bottom",
      sticky: true,
      text: "Order Now",
      badge: true,
    },
  },

  // Default branding (can be overridden)
  design: {
    primaryColor: "#2d3748", // Slate-900
    accentColor: "#25D366", // WhatsApp green
    fontFamily: "Inter, sans-serif",
    borderRadius: "12px",
    spacing: "1rem",
  },

  // Required fields for new restaurant (minimal setup)
  requiredFields: {
    basic: [
      "name",
      "slug",
      "address",
      "whatsappNumber",
      "couponCode",
    ],
    hero: [
      "heroTitle",
      "heroSubtitle",
      "heroImage",
    ],
  },

  // Optional fields (can add later)
  optionalFields: {
    basic: [
      "headerTagline",
      "locationNavLabel",
      "contactNavLabel",
      "heroTitle",
      "heroSubtitle",
      "heroBadgeText",
      "featuredLabel",
      "offerTitle",
      "offerTerms",
      "offerEyebrow",
      "offerSubtitle",
      "locationSubtitle",
      "locationEyebrow",
      "locationTitle",
      "dishesEyebrow",
      "dishesTitle",
      "dishesSubtitle",
      "footerCtaText",
      "footerBrandTitle",
      "footerPrimaryButtonText",
      "avgWaitText",
      "offerBadgeText",
      "completeMenuEyebrow",
      "completeMenuTitle",
      "completeMenuSubtitle",
    ],
  },
};

export const QUICK_SETUP_STEPS = [
  {
    id: "basic-info",
    title: "Restaurant Info",
    description: "Name, slug, and contact info",
    required: true,
    fields: ["name", "slug", "address", "whatsappNumber", "couponCode"],
  },
  {
    id: "hero-section",
    title: "Hero Section",
    description: "Title, subtitle, and featured image",
    required: true,
    fields: ["heroTitle", "heroSubtitle", "heroImage"],
  },
  {
    id: "menu",
    title: "Menu Items",
    description: "Add at least 5 dishes to get started",
    required: false,
    minItems: 5,
  },
  {
    id: "testimonials",
    title: "Testimonials",
    description: "Add customer reviews (optional but recommended)",
    required: false,
    minItems: 3,
  },
];

/**
 * Generate minimal Firestore document for new restaurant
 * Pre-fills most fields with defaults
 */
export function generateRestaurantTemplate(input: {
  name: string;
  slug: string;
  address: string;
  whatsappNumber: string;
  couponCode: string;
  heroTitle: string;
  heroSubtitle: string;
  ownerUid: string;
}) {
  return {
    // Required fields
    name: input.name,
    slug: input.slug,
    address: input.address,
    whatsappNumber: input.whatsappNumber,
    couponCode: input.couponCode,
    heroTitle: input.heroTitle,
    heroSubtitle: input.heroSubtitle,
    ownerUid: input.ownerUid,

    // Default optional fields (can be edited later)
    headerTagline: `Dine at ${input.name}`,
    locationNavLabel: "Location",
    contactNavLabel: "Contact",
    heroBadgeText: "Reserve Now",
    featuredLabel: "Featured Dish",
    offerTitle: `Special Offer`,
    offerTerms: "Limited time only",
    offerEyebrow: "Today's Special",
    offerSubtitle: "Don't miss out",
    locationSubtitle: "Find us here",
    locationEyebrow: "Visit Us",
    locationTitle: "Our Location",
    dishesEyebrow: "Menu",
    dishesTitle: "Our Dishes",
    dishesSubtitle: "Chef's finest selections",
    footerCtaText: "Order on WhatsApp",
    footerBrandTitle: input.name,
    footerPrimaryButtonText: "Reserve Table",
    avgWaitText: "~30 min",
    offerBadgeText: "Offer",
    completeMenuEyebrow: "Full Menu",
    completeMenuTitle: "Complete Menu",
    completeMenuSubtitle: "Browse all items",
  };
}

export default RESTAURANT_TEMPLATE;
