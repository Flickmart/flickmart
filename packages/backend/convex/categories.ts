import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

const errorObj = {
  message: 'Could not retrieve user, try logging in',
  status: 401,
  code: 'USER_NOT_FOUND',
};

// Subcategories data for seeding
const subcategoriesData = {
  vehicles: [
    { title: 'car', image: '/categories/car.png', size: 0 },
    { title: 'motorcycle', image: '/categories/motorcycle.png', size: 0 },
    { title: 'tricycle', image: '/categories/tricycle.png', size: 0 },
    { title: 'buses', image: '/categories/buses.png', size: 0 },
  ],
  electronics: [
    { title: 'hp', image: '/categories/hp.png', size: 0 },
    { title: 'apple', image: '/categories/apple.png', size: 0 },
    { title: 'lenovo', image: '/categories/lenovo.png', size: 0 },
    { title: 'acer', image: '/categories/acer.png', size: 0 },
    { title: 'samsung', image: '/categories/samsung.png', size: 0 },
    { title: 'xiaomi', image: '/categories/xiaomi.png', size: 0 },
    { title: 'asus', image: '/categories/asus.png', size: 0 },
    { title: 'dell', image: '/categories/dell.png', size: 0 },
  ],
  beauty: [
    { title: 'make up', image: '/categories/make up.png', size: 0 },
    { title: 'skin care', image: '/categories/skin care.png', size: 0 },
    { title: 'soaps', image: '/categories/soaps.png', size: 0 },
    { title: 'hair beauty', image: '/categories/hair beauty.png', size: 0 },
    {
      title: 'gym equipment',
      image: '/categories/gym equipments.png',
      size: 0,
    },
  ],
  fashion: [
    { title: 'bags', image: '/categories/bags.png', size: 0 },
    {
      title: "men's clothing",
      image: "/categories/men's clothing.png",
      size: 0,
    },
    {
      title: "women's clothing",
      image: "/categories/women's clothing.png",
      size: 0,
    },
    { title: "men's shoe", image: '/categories/male shoes.png', size: 0 },
    { title: "women's shoe", image: '/categories/female shoes.png', size: 0 },
    { title: 'watches', image: '/categories/watches.png', size: 0 },
  ],
  homes: [
    { title: 'single room', image: '/categories/single room.png', size: 0 },
    { title: 'self contain', image: '/categories/self contain.png', size: 0 },
    { title: 'flat', image: '/categories/flat.png', size: 0 },
    { title: 'duplex', image: '/categories/duplex.png', size: 0 },
    { title: 'bungalow', image: '/categories/bungalow.png', size: 0 },
  ],
  mobiles: [
    { title: 'apple phones', image: '/categories/apple phones.png', size: 0 },
    {
      title: 'android phones',
      image: '/categories/android phones.png',
      size: 0,
    },
    { title: 'tablet', image: '/categories/tablet.png', size: 0 },
    {
      title: 'phones & tablets accessories',
      image: '/categories/phones and tablets accessories.png',
      size: 0,
    },
  ],
  pets: [
    { title: 'dogs', image: '/categories/dogs.png', size: 0 },
    { title: 'cats', image: '/categories/cats.png', size: 0 },
    {
      title: 'pets accessories',
      image: '/categories/pet accessories.png',
      size: 0,
    },
  ],
  food: [
    { title: 'food stuffs', image: '/categories/food stuffs.png', size: 0 },
    { title: 'provision', image: '/categories/provision.png', size: 0 },
    { title: 'pastries', image: '/categories/pastries.png', size: 0 },
  ],
  appliances: [
    {
      title: 'cleaning appliances',
      image: '/categories/cleaning appliances.png',
      size: 0,
    },
    {
      title: 'kitchen appliances',
      image: '/categories/kitchen appliances.png',
      size: 0,
    },
    {
      title: 'gaming electronics',
      image: '/categories/gaming electronics.png',
      size: 0,
    },
    {
      title: 'speakers and audio',
      image: '/categories/speakers and audio.png',
      size: 0,
    },
  ],
  services: [
    {
      title: 'beauty services',
      image: '/categories/beauty services.png',
      size: 0,
    },
    {
      title: 'event services',
      image: '/categories/event services.png',
      size: 0,
    },
    { title: 'home services', image: '/categories/home services.png', size: 0 },
    {
      title: 'logistics and cab services',
      image: '/categories/logistics and cab services.png',
      size: 0,
    },
    {
      title: 'classes and courses',
      image: '/categories/classes and courses.png',
      size: 0,
    },
    {
      title: 'programming and designs',
      image: '/categories/programming and designs.png',
      size: 0,
    },
  ],
};

// Create | Insert a new Category
export const insertSubCategory = mutation({
  args: {
    category: v.string(),
    subcategories: v.array(
      v.object({
        title: v.string(),
        image: v.string(),
        size: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    try {
      // check if category has already been inserted
      const catExists = await ctx.db
        .query('subcategories')
        .filter((q) => q.eq(q.field('category'), args.category))
        .first();

      // Update category if it already exists
      if (catExists?.category) {
        const catId = await ctx.db.patch(catExists._id, {
          items: args.subcategories,
        });
        return {
          error: null,
          success: true,
          data: catId,
        };
      }

      const data = await ctx.db.insert('subcategories', {
        category: args.category,
        items: args.subcategories,
      });

      return {
        error: null,
        success: true,
        data,
      };
    } catch (err) {
      const error = err as Error;
      return {
        error: { ...errorObj, message: error.message },
        success: false,
        data: null,
      };
    }
  },
});

// Query | Retrieve a particular category
export const getCategory = query({
  args: {
    category: v.string(),
  },
  handler: async (ctx, args) => {
    const category = await ctx.db
      .query('subcategories')
      .filter((q) => q.eq(q.field('category'), args.category))
      .first();

    // If category doesn't exist in database, return default data
    if (!category) {
      const defaultItems =
        subcategoriesData[args.category as keyof typeof subcategoriesData];
      if (defaultItems) {
        return {
          category: args.category,
          items: defaultItems,
        };
      }
    }

    return category;
  },
});
