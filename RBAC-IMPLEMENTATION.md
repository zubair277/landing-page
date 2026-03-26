# Role-Based Access Control (RBAC) Implementation Guide

## Overview

This document describes the professional RBAC system implemented for the Next.js + Firebase multi-tenant restaurant CMS. The system supports two distinct roles:

- **Super Admin**: Platform owner with access to all restaurants and administrative functions
- **Restaurant Admin**: Restaurant owner with access only to their assigned restaurant

## Architecture

### Type System

Updated in [`types/index.ts`](types/index.ts):

```typescript
export type UserRole = "super_admin" | "restaurant_admin";

export type UserProfile = {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  restaurantId?: string; // Only for restaurant_admin
  createdAt?: string;
};
```

### Core Modules

#### 1. **lib/auth-helpers.ts** - Access Control Logic
Helper functions for role-based access checks:

- `getRedirectPathForUser(user)` - Returns appropriate redirect path based on role
- `isSuperAdmin(user)` - Checks if user is super admin
- `isRestaurantAdmin(user)` - Checks if user is restaurant admin
- `canAccessRestaurant(user, restaurantId)` - Validates access to specific restaurant
- `canManageAdmins(user)` - Checks if user can manage administrators
- `canViewAllRestaurants(user)` - Checks if user can view all restaurants

#### 2. **lib/auth-queries.ts** - User & Role Operations
Client-side Firebase queries for user management:

- `getUserProfileByUid(uid)` - Fetch user profile by UID
- `upsertUserProfile(input)` - Create or update user with role
- `getAllUserProfiles()` - Fetch all users
- `getUserByEmail(email)` - Find user by email
- `getRestaurantAdmins()` - Fetch all restaurant admins
- `getRestaurantAdmin(restaurantId)` - Get admin for specific restaurant
- `assignRestaurantAdmin(email, restaurantId)` - Assign restaurant to admin

#### 3. **lib/queries.ts** - Updated with Auth Integration
Re-exports auth functions and maintains backward compatibility.

## User Flows

### 1. Super Admin Flow

```
Login (/admin) 
  → Check user role
  → If role = "super_admin"
    → Redirect to /admin/super
```

**Super Admin Dashboard** (`/admin/super`):
- View all restaurants in the system
- Create new restaurants
- Assign/reassign restaurant admins
- Edit any restaurant details
- View platform statistics

### 2. Restaurant Admin Flow

```
Login (/admin)
  → Check user role
  → If role = "restaurant_admin"
    → Redirect to /admin/{restaurantId}
```

**Restaurant Admin Workspace** (`/admin/{restaurantId}`):
- Edit assigned restaurant only
- Manage menu items, testimonials, media
- Cannot access other restaurants
- Access denied for unauthorized restaurants

## Access Control

### Firestore Rules

Updated in [`firestore.rules`](firestore.rules):

Helper functions ensure secure access:

```firestore
function isSuperAdmin() {
  return isAuth() && getUser().role == "super_admin";
}

function isRestaurantAdmin(restaurantId) {
  return isAuth() && getUser().role == "restaurant_admin" && 
         getUser().restaurantId == restaurantId;
}
```

**Access Levels:**
- **Read**: Super Admin + Restaurant Admin + Public (for landing pages)
- **Write**: Super Admin + Restaurant Owner (by ownerUid)
- **Create**: Super Admin only

### Client-Side Route Protection

Routes are protected in components:

1. **`/admin`** - Login page (public)
2. **`/admin/super`** - Super Admin only
3. **`/admin/{restaurantId}`** - Super Admin + matching Restaurant Admin

## Components

### Super Admin Dashboard Components

#### RestaurantList (`components/super-admin/RestaurantList.tsx`)
Displays all restaurants with:
- Restaurant name, slug, address
- Admin assignment status
- Quick links to edit or assign admin

#### CreateRestaurantModal (`components/super-admin/CreateRestaurantModal.tsx`)
Modal form to create new restaurants with fields:
- Restaurant name
- URL slug
- WhatsApp number
- Coupon code
- Address
- Hero title & subtitle

#### AssignAdminModal (`components/super-admin/AssignAdminModal.tsx`)
Modal to assign or change restaurant admin by:
- Email lookup
- Validates user exists
- Updates user's restaurantId

## Admin Assignment Flow

### Prerequisites
User must already exist in the system (must have signed up/created account).

### Steps

1. Super Admin navigates to `/admin/super`
2. Clicks "Assign Admin" on a restaurant
3. Enters admin's email address
4. System validates email exists
5. Links restaurant to user via `restaurantId`
6. User assigned as `restaurant_admin` role
7. User can now access `/admin/{restaurantId}`

### Error Handling

The system validates:
- User exists (created account before assignment)
- Email format is valid
- Restaurant exists
- Proper Firebase permissions

## Firestore Schema

### users collection

```javascript
users/{uid}
{
  email: "admin@restaurant.com",
  name: "John Manager",
  role: "restaurant_admin" | "super_admin",
  restaurantId: "rest-123", // Only for restaurant_admin
  createdAt: timestamp
}
```

### restaurants collection

```javascript
restaurants/{restaurantId}
{
  id: "rest-123",
  name: "Miri",
  slug: "miri",
  ownerUid: "user-uid-123",  // Backward compatibility
  whatsappNumber: "15551234567",
  couponCode: "MIRI20",
  address: "Miramar, Panjim, Goa",
  heroTitle: "Global Fusion Dining",
  heroSubtitle: "Experience fine dining",
  // ... other restaurant fields
}
```

## Security Model

### Authentication
- Firebase Authentication (email/password)
- Session maintained via auth state listener

### Authorization
- **Database Rules**: Enforce access at Firestore level
- **Client Checks**: Validate roles before showing UI
- **Server Checks**: Could add backend validation if needed

### Backward Compatibility
- System checks both `ownerUid` and `restaurantId`
- Old user data (without role) continues to work
- Migration: Assign roles to existing users via super admin dashboard

## Environment Variables

Required `.env.local`:

```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...

# Optional: For local admin creation
NEXT_PUBLIC_SUPER_ADMIN_EMAIL=admin@example.com
```

## Testing Flows

### Test 1: Super Admin Login
1. Login with super admin email (matches `NEXT_PUBLIC_SUPER_ADMIN_EMAIL`)
2. Should redirect to `/admin/super`
3. Should display all restaurants
4. Should show "Create Restaurant" button

### Test 2: Restaurant Admin Login
1. Login with restaurant admin email
2. Should redirect to `/admin/{restaurantId}`
3. Can edit only that restaurant
4. Cannot access other restaurant IDs

### Test 3: Unauthorized Access
1. Login as Restaurant Admin for Restaurant A
2. Try to access `/admin/restaurant-b-id`
3. Should show "Access denied" error
4. Cannot perform any operations

### Test 4: Public Landing Pages
1. Public pages (`/{slug}`) remain accessible without login
2. All restaurant data readable anonymously
3. Admin features completely hidden from public

## Migration Guide

### For Existing Databases

1. **Users without roles:**
   - Login once to create Firestore user record
   - Will have empty `role` field
   - Super Admin must assign via dashboard

2. **Assign roles:**
   - Use Super Admin dashboard (`/admin/super`)
   - Create restaurant admin assignments
   - Existing `ownerUid` relationships continue working

3. **Gradual rollout:**
   - Both role-based and ownerUid checks work
   - No data migration needed
   - Roles take precedence when available

## API Reference

### Auth Helpers

```typescript
import { 
  getRedirectPathForUser,
  isSuperAdmin,
  isRestaurantAdmin,
  canAccessRestaurant,
  canManageAdmins,
  canViewAllRestaurants
} from "@/lib/auth-helpers";

// Example usage
const user = await getUserProfileByUid(authUser.uid);
if (isSuperAdmin(user)) {
  // Show super admin UI
}

const path = getRedirectPathForUser(user);
router.push(path); // Redirects to correct dashboard
```

### Auth Queries

```typescript
import {
  getUserProfileByUid,
  upsertUserProfile,
  assignRestaurantAdmin,
  getUserByEmail,
  getRestaurantAdmins,
} from "@/lib/auth-queries";

// Create new super admin user
await upsertUserProfile({
  uid: "user-123",
  email: "admin@platform.com",
  role: "super_admin",
});

// Assign restaurant to user
await assignRestaurantAdmin("owner@restaurant.com", "rest-123");
```

## Future Enhancements

- [ ] Restaurant analytics dashboard for super admin
- [ ] Bulk admin assignment features
- [ ] Role invitation system (email invites)
- [ ] Activity logging for audit trail
- [ ] Permission-based menu system
- [ ] Multi-restaurant admin capability
- [ ] Custom role creation

## Support & Troubleshooting

### Issue: User cannot login

**Solution**: Verify Firebase config and auth is enabled

### Issue: Role not detected

**Solution**: Check `NEXT_PUBLIC_SUPER_ADMIN_EMAIL` matches login email

### Issue: Firestore permission denied

**Solution**: Deploy updated Firestore rules:
```bash
firebase deploy --only firestore:rules
```

### Issue: Restaurant admin redirects incorrectly

**Solution**: Verify user has `restaurantId` field matching restaurant ID in Firestore

## Files Modified/Created

### New Files
- `lib/auth-helpers.ts`
- `lib/auth-queries.ts`
- `app/admin/super/page.tsx`
- `components/super-admin/RestaurantList.tsx`
- `components/super-admin/CreateRestaurantModal.tsx`
- `components/super-admin/AssignAdminModal.tsx`

### Modified Files
- `types/index.ts` - Updated UserRole and UserProfile
- `lib/queries.ts` - Re-exports auth functions
- `app/admin/page.tsx` - Role-based redirect logic
- `app/admin/[id]/page.tsx` - Access control checking
- `firestore.rules` - RBAC-aware security rules

## Conclusion

This RBAC implementation provides:

✅ Professional SaaS structure with role hierarchy
✅ Secure access control at database level
✅ Clean routing with no redirect loops
✅ Backward compatible with existing data
✅ Scalable multi-tenant architecture
✅ Type-safe TypeScript throughout

The system is production-ready for deployment and can be extended with additional features as needed.
