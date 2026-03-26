# Quick Start Guide - RBAC System

## Setup (5 minutes)

### 1. Set Environment Variables

Add to `.env.local`:

```env
# Set this to the super admin's email (used for first setup)
NEXT_PUBLIC_SUPER_ADMIN_EMAIL=your-admin-email@example.com
```

### 2. Deploy Firestore Rules

```bash
firebase deploy --only firestore:rules
```

### 3. Start Development Server

```bash
npm run dev
```

## Usage

### First Time Super Admin Setup

1. **Sign up** with your super admin email at `http://localhost:3000/admin`
2. System creates your user with `super_admin` role (via email match)
3. **Automatically redirects** to `/admin/super`
4. Dashboard shows: Total restaurants (0 initially), your email

### Create Your First Restaurant

1. From Super Admin dashboard, click **"+ New Restaurant"**
2. Fill in:
   - Restaurant name (e.g., "Miri")
   - Slug (e.g., "miri") - used for public URL
   - WhatsApp number
   - Coupon code
   - Address
   - Hero title & subtitle
3. Click **"Create"** → Restaurant added to system

### Invite Restaurant Admin

1. **User must sign up first** at `/admin` 
   - They'll get `restaurant_admin` role if not assigned
   - They won't see anything (no restaurant assigned)

2. From `/admin/super`, click **"Assign Admin"** on restaurant

3. Enter the user's **email address**

4. System validates email exists and links restaurant:
   - Updates user's `restaurantId`
   - Sets user's role to `restaurant_admin`

5. User logs out/back in:
   - System detects `restaurant_admin` role
   - **Redirects to `/admin/{restaurantId}`**
   - Can now edit restaurant

### Restaurant Admin Workflow

**Restaurant Admin logs in:**
1. Enters email/password on `/admin`
2. System checks role = `restaurant_admin`
3. Gets their assigned `restaurantId`
4. Redirects to `/admin/{restaurantId}`
5. Can edit:
   - Basic info
   - Hero section
   - Menu items
   - Testimonials
   - Media

**Cannot access:**
- Other restaurants
- `/admin/super`
- Any unauthorized routes

## Role Comparison

| Feature | Public | Restaurant Admin | Super Admin |
|---------|--------|-----------------|------------|
| View landing page | ✅ | ✅ | ✅ |
| Edit own restaurant | ❌ | ✅ | ✅ |
| Edit any restaurant | ❌ | ❌ | ✅ |
| Create restaurant | ❌ | ❌ | ✅ |
| Assign admins | ❌ | ❌ | ✅ |
| View all restaurants | ❌ | ❌ | ✅ |

## Common Flows

### Flow 1: Set Up Pizza Restaurant

```
1. Login as Super Admin
   → Go to /admin/super

2. Click "+ New Restaurant"
   → Fill: name="Pizza Place", slug="pizza", etc
   → Click Create

3. Restaurant created with 0 admin

4. Click "Assign Admin" on Pizza Place

5. Enter "pizzamanager@pizza.com"
   → System checks email exists
   → Links them to Pizza Place
   → Sets their role to restaurant_admin

6. Pizza manager logs in
   → Redirected to /admin/pizza-rest-id
   → Can edit menu, testimonials, etc
```

### Flow 2: Add New Pizza Place Manager

```
1. Pizza manager user (already exists in system) at /admin

2. Super Admin goes to /admin/super

3. Sees current manager, clicks "Assign Admin"

4. Enters new manager's email

5. New assignment replaces old one

6. New manager can edit Pizza Place
   (Old manager loses access)
```

### Flow 3: Public User Visits Restaurant

```
1. Public browser → website.com/pizza

2. Server-side rendering fetches restaurant data

3. Displays menu, testimonials, media

4. No admin UI shown to public

5. If user has account, they see /admin link
```

## Files Reference

### For Super Admin Features
- `app/admin/super/page.tsx` - Dashboard
- `components/super-admin/*.tsx` - UI components

### For Restaurant Admin Features
- `app/admin/[id]/page.tsx` - Restaurant workspace

### For Auth Logic
- `lib/auth-helpers.ts` - Role checks
- `lib/auth-queries.ts` - User queries

### Security
- `firestore.rules` - Database access control

## Debugging

**Check if redirect is working:**
```bash
# Open browser console, goto /admin
# Should auto-redirect based on role
# Check console logs for any errors
```

**Verify role in Firestore:**
```bash
firebase console
→ Firestore Database
→ users collection
→ Click a user
→ See "role" and "restaurantId" fields
```

**Test Firestore rules:**
```bash
firebase emulator:start  # Or test in Firebase Console
```

## What's Protected?

### Frontend Routes
- `/admin` - Login (everyone)
- `/admin/super` - Super Admin only
- `/admin/{id}` - Super Admin + matching Restaurant Admin

### Database (Firestore)
- Can read restaurant data (public)
- Can write only if authorized
- Rules enforced at database level

### User Data
- Users can read/write own profile
- Super Admin can manage all users

## Next Steps

1. ✅ Create super admin account
2. ✅ Create first restaurant
3. ✅ Invite restaurant managers
4. ✅ Test public landing pages
5. ✅ Deploy to production
6. 🚀 Add analytics dashboard

## Support

For issues or questions, check:
- `RBAC-IMPLEMENTATION.md` - Full documentation
- `firestore.rules` - Security rules
- `lib/auth-helpers.ts` - Access control logic

---

**System is production-ready! 🎉**
