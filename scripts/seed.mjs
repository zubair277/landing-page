import { cert, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

function requiredEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing env var: ${name}`);
  }
  return value;
}

initializeApp({
  credential: cert({
    projectId: requiredEnv("FIREBASE_PROJECT_ID"),
    clientEmail: requiredEnv("FIREBASE_CLIENT_EMAIL"),
    privateKey: requiredEnv("FIREBASE_PRIVATE_KEY").replace(/\\n/g, "\n"),
  }),
});

const db = getFirestore();

async function seed() {
  const ownerUid = requiredEnv("FIREBASE_SEED_OWNER_UID");
  const ownerEmail = process.env.FIREBASE_SEED_OWNER_EMAIL || "owner@example.com";

  const restaurantRef = await db.collection("restaurants").add({
    name: "Miri | Global Fusion Dining",
    slug: "miri",
    whatsappNumber: "15551234567",
    couponCode: "MIRI20",
    address: "Miramar Beach Road, near Kala Academy, Panjim, Goa 403001",
    heroTitle: "Experience Global Fusion Like Never Before",
    heroSubtitle:
      "Indulge in curated flavors, signature cocktails, and a vibrant dining atmosphere",
    heroImage: "/images/hero-miri.jpg",
    ownerUid,
  });

  const restaurantId = restaurantRef.id;

  await db.collection("users").doc(ownerUid).set(
    {
      email: ownerEmail,
      role: "owner",
      createdAt: new Date().toISOString(),
    },
    { merge: true }
  );

  const dishes = [
    {
      restaurantId,
      name: "Truffle Mushroom Risotto",
      description: "Creamy arborio, wild mushrooms, truffle oil, parmesan finish.",
      image: "/images/truffle-mushroom-arancini.jpg",
      price: 650,
      category: "Signature Mains",
    },
    {
      restaurantId,
      name: "Peri Peri Chicken Skewers",
      description: "Char-grilled skewers, peri peri glaze, herb dip, pickled onions.",
      image: "/images/peri-peri-chicken-skewers.jpg",
      price: 520,
      category: "Small Plates",
    },
    {
      restaurantId,
      name: "Passionfruit Martini",
      description: "Silky, bright, and balanced - signature Miri cocktail.",
      image: "/images/passionfruit-martini.jpg",
      price: 450,
      category: "Beverages",
    },
  ];

  const testimonials = [
    {
      restaurantId,
      name: "Anika R.",
      review: "Amazing ambience and incredible food - perfect for a night out at Miramar.",
      rating: 5,
    },
    {
      restaurantId,
      name: "Karan D.",
      review: "Loved the cocktails and vibe. Fusion specials are a standout.",
      rating: 4.9,
    },
  ];

  const media = [
    {
      restaurantId,
      type: "hero",
      imageUrl: "/images/hero-miri.jpg",
      title: "Main hero",
    },
    {
      restaurantId,
      type: "offer",
      imageUrl: "/images/paneer-steak-herb-sauce.jpg",
      title: "Coupon offer",
    },
  ];

  await Promise.all(dishes.map((item) => db.collection("dishes").add(item)));
  await Promise.all(testimonials.map((item) => db.collection("testimonials").add(item)));
  await Promise.all(media.map((item) => db.collection("media").add(item)));

  console.log(`Seed complete for restaurantId: ${restaurantId}`);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
