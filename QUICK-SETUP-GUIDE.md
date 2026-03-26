# Quick Setup Guide - Create Restaurants in 5 Minutes

## 🚀 The New Way (5 minutes vs 30 minutes)

### Old Way (Slow ❌)
```
Create restaurant → Fill 20+ fields → Upload images → Add menu → Add testimonials
❌ Takes 30 minutes per restaurant
```

### New Way (Fast ✅)
```
Super Admin Dashboard → Quick Setup Wizard → Done!
✅ Takes 5 minutes per restaurant
```

---

## 🎯 Step-by-Step: Creating Your First Restaurant

### Step 1: Login to Super Admin (Already Done ✅)
```
You should be at: http://localhost:3000/admin/super
```

### Step 2: Click "+ New Restaurant"
```
Button location: Top right of "All Restaurants" section
This opens the Quick Setup Wizard ✨
```

### Step 3: Fill Restaurant Info (1 minute)
**The wizard asks for 5 things:**

```
1️⃣ Restaurant Name
   Example: "Miri" or "Pizza Palace"
   This appears on the landing page

2️⃣ Slug (URL)
   Example: "miri" → website.com/miri
   Keep it lowercase, no spaces

3️⃣ Address
   Example: "Miramar, Panjim, Goa"
   Shown in footer and location section

4️⃣ WhatsApp Number
   Example: "15551234567"
   Used for WhatsApp chat link
   Include country code (no hyphens)

5️⃣ Coupon Code
   Example: "MIRI20"
   Show in modal when user clicks coupon
```

### Step 4: Fill Hero Section (30 seconds)
**The wizard then asks:**

```
Hero Title
  Example: "Global Fusion Dining"
  Main headline on landing page

Hero Subtitle
  Example: "Experience fine dining at its best"
  Under the main title

💡 TIP: Hero image? You'll upload it from the dashboard later.
```

### Step 5: Review (Optional Sections)
```
Menu
  You can add dishes after creation
  Start with your top 5-10 items

Testimonials
  Add 3-5 reviews after launch
  Builds credibility

🎉 That's it! Restaurant is live!
```

---

## ✅ What You Get Automatically

When you create a restaurant, **30+ fields are automatically filled** with smart defaults:

```
✅ Navigation labels → "Menu", "Location", "Contact"
✅ Section titles → "Our Dishes", "What People Say"
✅ CTA text → "Reserve Now", "Order on WhatsApp"
✅ Badge text → "Featured Dish", "Offer"
✅ Footer text → Your restaurant name
✅ All button text → Pre-configured
✅ ...and 20+ more!
```

**Restaurant admin can edit any of these later from the dashboard.**

---

## 🌐 After Creating: Your Restaurant is Live!

Immediately available at:
```
http://localhost:3000/miri
```

Shows:
✅ Navigation header
✅ Hero section (title + subtitle)
✅ Menu section (empty until you add dishes)
✅ Testimonials carousel (empty until you add reviews)
✅ Location section
✅ CTA sticky bar with WhatsApp button
✅ Coupon modal
✅ Footer

---

## 📝 Next: Add Content (Optional)

### Add Menu Items (5-10 minutes)

1. Go to dashboard: `/admin/miri`
2. Click "Menu Manager"
3. Add dishes:
   - Dish name
   - Description
   - Price
   - Category (e.g., "Appetizers", "Mains")
   - Upload image
4. Save

Result: Menu appears on landing page automatically

### Add Testimonials (2-5 minutes)

1. In dashboard: `/admin/miri`
2. Click "Testimonial Manager"
3. Add review:
   - Customer name
   - Review text
   - Rating (1-5 stars)
4. Save

Result: Carousel populates with real reviews

### Upload Hero Image (1 minute)

1. In dashboard: `/admin/miri`
2. Click "Hero Editor"
3. Upload image
4. Save

Result: Hero section now has background image

---

## 🎨 Customize (Optional)

All defaults can be changed from dashboard:

- [ ] Change hero title/subtitle
- [ ] Update address
- [ ] Modify all text/labels
- [ ] Change coupon details
- [ ] Upload hero image
- [ ] Add menu items
- [ ] Add testimonials
- [ ] Upload media gallery

**Everything is customizable - defaults are just for faster launch!**

---

## 📊 Example: Create 3 Restaurants

### Restaurant 1: "Miri" (5 min)
```
Step 1 (1 min): Miri, miri, Miramar Panjim, 1234567890, MIRI20
Step 2 (30 sec): Global Fusion Dining, Experience fine dining
Result: ✅ Live at /miri
```

### Restaurant 2: "Pizza Palace" (5 min)
```
Step 1 (1 min): Pizza Palace, pizza-palace, Downtown NY, 9876543210, PIZZA25
Step 2 (30 sec): Authentic Italian Pizza, Baked fresh daily
Result: ✅ Live at /pizza-palace
```

### Restaurant 3: "Burger Spot" (5 min)
```
Step 1 (1 min): Burger Spot, burger-spot, Main St Chicago, 5551234567, BURGER20
Step 2 (30 sec): Gourmet Burgers, Premium ingredients
Result: ✅ Live at /burger-spot
```

**Total time: 15 minutes for 3 fully functional restaurant sites! 🚀**

---

## 🔑 Key Features (All Pre-Configured)

✅ **Responsive Design** - Works on mobile, tablet, desktop
✅ **WhatsApp Integration** - One-click WhatsApp links
✅ **Coupon Modal** - Pop-up for discount codes
✅ **Testimonials** - Auto-rotating carousel
✅ **Menu Section** - Category filters, grid layout
✅ **Location Map** - Address display ready
✅ **CTA Bar** - Sticky bottom bar on mobile
✅ **Analytics Ready** - Track page views, clicks

All of this comes **for free** with every restaurant created!

---

## 📱 Public Page Structure

Every restaurant automatically gets this layout:

```
┌─────────────────────────────┐
│  Header (sticky)            │ ← Static
├─────────────────────────────┤
│  Hero Section               │ ← Dynamic (title/subtitle/image)
├─────────────────────────────┤
│  Menu Section               │ ← Dynamic (dishes you add)
├─────────────────────────────┤
│  Testimonials Carousel      │ ← Dynamic (reviews you add)
├─────────────────────────────┤
│  Location Section           │ ← Dynamic (address)
├─────────────────────────────┤
│  CTA Sticky Bar (mobile)    │ ← Static
├─────────────────────────────┤
│  Footer                     │ ← Mostly static
└─────────────────────────────┘
```

---

## 🛠️ If You Need to Change Defaults

**For ONE restaurant:**
- Use the admin dashboard to edit fields
- No code changes needed

**For ALL restaurants:**
- Edit `lib/restaurant-template.ts`
- Apply to all new restaurants created after
- Existing restaurants not affected (can edit individually)

---

## ⚠️ Important Notes

### Must-Fill Fields (Required)
These 7 fields are **required** to create a restaurant:
1. Restaurant Name
2. Slug (URL)
3. Address
4. WhatsApp Number
5. Coupon Code
6. Hero Title
7. Hero Subtitle

Without these, a restaurant can't be created.

### Optional Content (Add Later)
These can be added anytime from the dashboard:
- Menu items (dishes)
- Testimonials (reviews)
- Hero image
- Gallery media
- Any of the 30+ text fields

### Public vs Admin
- **Public pages** (`/miri`) - See by clicking restaurant name from dashboard
- **Admin dashboard** (`/admin/miri`) - Edit and manage content
- **Super admin** (`/admin/super`) - Create and assign restaurants

---

## 💡 Pro Tips

### Tip 1: Use Clear Slugs
```
✅ Good: /miri, /pizza-palace, /burger-spot
❌ Bad: /rest123, /r1, /restaurant-a
```

### Tip 2: Test Immediately
After creating a restaurant, check at `/{slug}` to verify it worked.

### Tip 3: Add Menu Soon
Restaurant looks incomplete without menu items. Add 5-10 dishes ASAP.

### Tip 4: Invite Admin Early
Create the restaurant → Add basics → Invite restaurant admin
Then admin adds menu/testimonials.

### Tip 5: Keep URLs Consistent
If public is `/miri`, make sure slug is exactly "miri".

---

## ✨ What's Included (No Extra Code Needed)

Every restaurant automatically comes with:

✅ Hero section with background image support
✅ Sticky header with navigation
✅ Menu section with categories and filters
✅ Testimonials carousel (auto-rotating)
✅ Location section with address
✅ WhatsApp integration (one-click calls)
✅ Coupon modal with copy-to-clipboard
✅ Mobile phone mockup (optional section)
✅ Responsive design (mobile-first)
✅ Smooth animations (Framer Motion)
✅ Dark mode friendly
✅ SEO optimized
✅ Fast loading (optimized images)

**That's a LOT of features, all pre-configured! 🎉**

---

## 🚀 You're Ready!

You now have a system that:
- Creates full restaurant websites in **5 minutes**
- Uses **smart defaults** for rapid setup
- Allows **full customization** later
- Looks **professional** out of the box
- Scales to **hundreds of restaurants**

**Go create restaurants! 🎊**

---

## Need More Help?

- `STATIC-VS-DYNAMIC.md` - Architecture details
- `IMPLEMENTATION-SUMMARY.md` - Complete system overview
- `QUICK-START-RBAC.md` - Role-based access control
- `RBAC-IMPLEMENTATION.md` - Full technical guide

---

**Questions?** The system is self-explanatory - just follow the wizard! 🧙
