# Multi-Tenant Restaurant CMS (Next.js + Firebase)

This project is a reusable multi-tenant restaurant landing template.

Public tenant pages:
- /miri
- /kfc
- /dominos

Admin routes:
- /admin
- /admin/[restaurantId]

## Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- Framer Motion
- Firebase Auth
- Firestore
- Firebase Storage

## What Changed

- Landing page converted from static to tenant-driven routing with /[slug]
- Hardcoded content moved to Firestore data
- Existing UI layout and animations preserved
- Added admin dashboard for CRUD operations
- Added Firebase Auth ownership checks (ownerUid)
- Added Firestore and Storage rules
- Added seed script for sample tenant data

## Required Environment Variables

Copy .env.example to .env.local and fill values.

Client SDK (browser):
- NEXT_PUBLIC_FIREBASE_API_KEY
- NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
- NEXT_PUBLIC_FIREBASE_PROJECT_ID
- NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
- NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
- NEXT_PUBLIC_FIREBASE_APP_ID

Admin SDK (server side):
- FIREBASE_PROJECT_ID
- FIREBASE_CLIENT_EMAIL
- FIREBASE_PRIVATE_KEY

Optional for seeding:
- FIREBASE_SEED_OWNER_UID

## Firestore Collections

restaurants:
- name
- slug
- whatsappNumber
- couponCode
- address
- heroTitle
- heroSubtitle
- heroImage
- ownerUid

dishes:
- restaurantId
- name
- description
- image
- price
- category

testimonials:
- restaurantId
- name
- review
- rating

media:
- restaurantId
- type (hero | dish | offer | review | gallery)
- imageUrl
- title
- subtitle
- description

## Firebase Rules

- Firestore rules file: firestore.rules
- Storage rules file: storage.rules

Deploy these rules using Firebase CLI.

## Local Development

1. Install dependencies:
   npm install
2. Configure .env.local
3. Run dev server:
   npm run dev
4. Open:
   - http://localhost:3000/miri
   - http://localhost:3000/admin

## Seed Sample Data

1. Set Admin SDK env vars and FIREBASE_SEED_OWNER_UID
2. Run:
   npm run seed

This creates one sample tenant with slug miri and related menu/testimonials/media.

## Routing and Rendering

- /[slug] is a server route that fetches tenant data from Firestore via Firebase Admin SDK
- Route output is cached with revalidation (60 seconds)
- UI rendering is handled by a reusable RestaurantLanding client component

## Admin Dashboard Features

/ admin:
- Email/password login
- Shows restaurants assigned to current user (ownerUid)

/ admin/[restaurantId]:
- Edit basic info and hero copy
- Upload hero image
- Add/edit/delete dishes
- Add/edit/delete testimonials
- Add/edit/delete media items
- Upload dish and media images to Firebase Storage

## File Map

- app/[slug]/page.tsx
- app/admin/page.tsx
- app/admin/[id]/page.tsx
- app/components/RestaurantLanding.tsx
- lib/firebase.ts
- lib/firebase-admin.ts
- lib/queries.ts
- lib/server-queries.ts
- types/index.ts
