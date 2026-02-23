import { mutation } from "./_generated/server";
import { getCurrentUserOrThrow } from "./users";

const demoProducts = [
  {
    title: "Toyota Camry 2020",
    description:
      "Clean Toyota Camry 2020 model. Automatic transmission, brand new engine.",
    category: "vehicles",
    subcategory: "car",
    price: 4_500_000,
    images: ["https://placehold.co/600x400?text=Toyota+Camry"],
    location: "enugu",
    condition: "used",
    plan: "premium",
  },
  {
    title: "MacBook Pro M1",
    description: "MacBook Pro M1 2020, 16GB RAM, 512GB SSD. Space Gray.",
    category: "electronics",
    subcategory: "apple",
    price: 1_200_000,
    images: ["https://placehold.co/600x400?text=MacBook+Pro"],
    location: "nsukka",
    condition: "brand new",
    plan: "pro",
  },
  {
    title: "iPhone 13 Pro Max",
    description: "iPhone 13 Pro Max, 256GB, Sierra Blue. Clean UK used.",
    category: "mobiles",
    subcategory: "apple phones",
    price: 650_000,
    images: ["https://placehold.co/600x400?text=iPhone+13"],
    location: "enugu",
    condition: "used",
    plan: "basic",
  },
  {
    title: "Samsung Galaxy S22 Ultra",
    description: "Samsung Galaxy S22 Ultra, 12GB RAM, 256GB. Phantom Black.",
    category: "mobiles",
    subcategory: "android phones",
    price: 700_000,
    images: ["https://placehold.co/600x400?text=Samsung+S22"],
    location: "nsukka",
    condition: "brand new",
    plan: "free",
  },
  {
    title: "Dell XPS 15",
    description:
      "Dell XPS 15, i7 11th Gen, 16GB RAM, 512GB SSD, NVIDIA GTX 1650.",
    category: "electronics",
    subcategory: "dell",
    price: 950_000,
    images: ["https://placehold.co/600x400?text=Dell+XPS"],
    location: "enugu",
    condition: "brand new",
    plan: "pro",
  },
  {
    title: "Men's Leather Jacket",
    description: "Genuine leather jacket, size L, brown color.",
    category: "fashion",
    subcategory: "men's clothing",
    price: 25_000,
    images: ["https://placehold.co/600x400?text=Leather+Jacket"],
    location: "nsukka",
    condition: "used",
    plan: "free",
  },
  {
    title: "Nike Air Jordan 1",
    description: "Nike Air Jordan 1, size 43. Red and Black.",
    category: "fashion",
    subcategory: "men's shoe",
    price: 45_000,
    images: ["https://placehold.co/600x400?text=Air+Jordan"],
    location: "enugu",
    condition: "brand new",
    plan: "basic",
  },
  {
    title: "3 Bedroom Flat in Independence Layout",
    description: "Spacious 3 bedroom flat, all rooms ensuite, constant power.",
    category: "homes",
    subcategory: "flat",
    price: 1_500_000,
    images: ["https://placehold.co/600x400?text=3+Bedroom+Flat"],
    location: "enugu",
    condition: "used",
    plan: "premium",
  },
  {
    title: "Self Contain at UNN Backgate",
    description: "Clean self contain, tiled, with water and light.",
    category: "homes",
    subcategory: "self contain",
    price: 200_000,
    images: ["https://placehold.co/600x400?text=Self+Contain"],
    location: "nsukka",
    condition: "used",
    plan: "basic",
  },
  {
    title: "German Shepherd Puppy",
    description: "Pure breed German Shepherd puppy, 3 months old, vaccinated.",
    category: "pets",
    subcategory: "dogs",
    price: 150_000,
    images: ["https://placehold.co/600x400?text=German+Shepherd"],
    location: "enugu",
    condition: "brand new",
    plan: "free",
  },
  {
    title: "Bag of Rice (50kg)",
    description: "Foreign rice, stone free, long grain.",
    category: "food",
    subcategory: "food stuffs",
    price: 55_000,
    images: ["https://placehold.co/600x400?text=Rice+Bag"],
    location: "enugu",
    condition: "brand new",
    plan: "free",
  },
  {
    title: "LG Washing Machine",
    description:
      "LG 7kg Front Load Washing Machine. Durable and energy saving.",
    category: "appliances",
    subcategory: "cleaning appliances",
    price: 350_000,
    images: ["https://placehold.co/600x400?text=Washing+Machine"],
    location: "nsukka",
    condition: "brand new",
    plan: "pro",
  },
  {
    title: "Baking Services for Weddings",
    description: "Professional baking services for weddings and large events.",
    category: "services",
    subcategory: "event services",
    price: 200_000,
    images: ["https://placehold.co/600x400?text=Baking+Services"],
    location: "enugu",
    condition: "brand new",
    plan: "basic",
  },
  {
    title: "Mathematics Private Tutor",
    description: "Experienced mathematics tutor for WAEC and JAMB preparation.",
    category: "services",
    subcategory: "classes and courses",
    price: 30_000,
    images: ["https://placehold.co/600x400?text=Math+Tutor"],
    location: "nsukka",
    condition: "brand new",
    plan: "free",
  },
];

export const addDemoProducts = mutation({
  args: {},
  handler: async (ctx) => {
    // 1. Get the currently logged-in user
    const user = await getCurrentUserOrThrow(ctx);

    if (!user) {
      throw new Error("You must be logged in to add demo products");
    }

    // 2. Get or Create a Store for the user
    let store = await ctx.db
      .query("store")
      .withIndex("byUserId", (q) => q.eq("userId", user._id))
      .first();
    if (!store) {
      const storeId = await ctx.db.insert("store", {
        name: `${user.name ?? "User"}'s Store`,
        location: "Enugu",
        description: "The best deals in town",
        userId: user._id,
        phone: user.contact?.phone ?? "08012345678",
      });
      store = await ctx.db.get(storeId);
    }

    if (!store) {
      throw new Error("Could not find or create store");
    }

    // 3. Insert Products
    const results = [];
    for (const prod of demoProducts) {
      const newProduct = {
        userId: user._id,
        title: prod.title,
        description: prod.description,
        images: prod.images,
        price: prod.price,
        businessId: store._id,
        category: prod.category,
        subcategory: prod.subcategory,
        plan: prod.plan as "free" | "basic" | "pro" | "premium",
        condition: prod.condition as "brand new" | "used",
        location: prod.location as "enugu" | "nsukka",
        phone: store.phone || "08012345678",
        store: store.name || `${user.name}'s Store`,
        timeStamp: new Date().toISOString(),
        likes: 0,
        dislikes: 0,
        aiEnabled: false,
        negotiable: true,
        exchange: false,
      };

      const id = await ctx.db.insert("product", newProduct);
      results.push(id);
    }

    return { success: true, count: results.length, productIds: results };
  },
});
