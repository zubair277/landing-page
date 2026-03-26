export type Restaurant = {
	id: string;
	name: string;
	slug: string;
	whatsappNumber: string;
		countryCode?: string; // e.g., "91" for India, "1" for USA
	couponCode: string;
	address: string;
	heroTitle: string;
	heroSubtitle: string;
	heroImage?: string;
	carouselImages?: string[]; // Array of up to 3 carousel image URLs
	headerTagline?: string;
	locationNavLabel?: string;
	contactNavLabel?: string;
	heroBadgeText?: string;
	featuredLabel?: string;
	offerTitle?: string;
	offerTerms?: string;
	offerEyebrow?: string;
	offerSubtitle?: string;
	locationSubtitle?: string;
	locationEyebrow?: string;
	locationTitle?: string;
	dishesEyebrow?: string;
	dishesTitle?: string;
	dishesSubtitle?: string;
	footerCtaText?: string;
	footerBrandTitle?: string;
	footerPrimaryButtonText?: string;
	avgWaitText?: string;
	offerBadgeText?: string;
	completeMenuEyebrow?: string;
	completeMenuTitle?: string;
	completeMenuSubtitle?: string;
	ownerUid: string;
};

export type UserRole = "super_admin" | "restaurant_admin";

export type UserProfile = {
	id: string;
	email: string;
	name?: string;
	role: UserRole;
	restaurantId?: string; // Only for restaurant_admin
	createdAt?: string;
};

export type Dish = {
	id: string;
	restaurantId: string;
	name: string;
	image: string;
	price: number;
	category: string;
	description: string;
	section?: "premium" | "menu";
};

export type Testimonial = {
	id: string;
	restaurantId: string;
	name: string;
	review: string;
	rating?: number;
};

export type MediaType = "hero" | "dish" | "offer" | "review" | "gallery";

export type MediaItem = {
	id: string;
	restaurantId: string;
	type: MediaType;
	imageUrl: string;
	title?: string;
	subtitle?: string;
	description?: string;
};

export type RestaurantPageData = {
	restaurant: Restaurant;
	dishes: Dish[];
	testimonials: Testimonial[];
	media: MediaItem[];
};

export type RestaurantUpdateInput = Partial<
	Omit<Restaurant, "id" | "ownerUid" | "slug">
>;

export type CreateDishInput = Omit<Dish, "id">;
export type UpdateDishInput = Partial<Omit<Dish, "id" | "restaurantId">>;

export type CreateTestimonialInput = Omit<Testimonial, "id">;
export type UpdateTestimonialInput = Partial<
	Omit<Testimonial, "id" | "restaurantId">
>;

export type CreateMediaInput = Omit<MediaItem, "id">;
export type UpdateMediaInput = Partial<Omit<MediaItem, "id" | "restaurantId">>;

export type CreateRestaurantInput = Omit<Restaurant, "id">;
