// import type { OurFileRouter } from "@/app/api/uploadthing/core";
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import { genUploader } from "uploadthing/client";

const categories = [
  {
    category: "pets",
    subcategories: [
      { title: "dogs", image: "/categories/dogs.png", size: 456 },
      { title: "cats", image: "/categories/cats.png", size: 456 },
      {
        title: "pet accessories",
        image: "/categories/pet-accessories.png",
        size: 456,
      },
      { title: "others", image: "/categories/others.png", size: 456 },
    ],
  },
  {
    category: "food",
    subcategories: [
      { title: "food stuffs", image: "/categories/food-stuffs.png", size: 456 },
      { title: "provision", image: "/categories/provision.png", size: 456 },
      { title: "pastries", image: "/categories/pastries.png", size: 456 },
      { title: "wine", image: "/categories/wine.png", size: 456 },
      { title: "others", image: "/categories/others.png", size: 456 },
    ],
  },
  {
    category: "services",
    subcategories: [
      {
        title: "classes and courses",
        image: "/categories/courses.png",
        size: 456,
      },
      {
        title: "Home services: painting, e.t.c",
        image: "/categories/home-services.png",
        size: 456,
      },
      {
        title: "Event services: dj, ushering, e.t.c",
        image: "/categories/event-services.png",
        size: 456,
      },
      {
        title: "Logistics & cab services",
        image: "/categories/logistics-services.png",
        size: 456,
      },
      {
        title: "Programming & designs",
        image: "/categories/programming-services.png",
        size: 456,
      },
      {
        title: "Beauty services: makeup, e.t.c",
        image: "/categories/beauty-services.png",
        size: 456,
      },
      {
        title: "Writing & projects",
        image: "/categories/courses.png",
        size: 456,
      },
      { title: "Others", image: "/categories/others.png", size: 456 },
    ],
  },
  {
    category: "fashion",
    subcategories: [
      { title: "bags", image: "/categories/bags.png", size: 456 },
      {
        title: "men's clothing",
        image: "/categories/men-clothing.png",
        size: 456,
      },
      {
        title: "women's clothing",
        image: "/categories/women-clothing.png",
        size: 456,
      },
      { title: "male shoes", image: "/categories/male-shoes.png", size: 456 },
      {
        title: "female shoes",
        image: "/categories/female-shoes.png",
        size: 456,
      },
      { title: "watches", image: "/categories/watches.png", size: 456 },
      { title: "others", image: "/categories/others.png", size: 456 },
    ],
  },
  {
    category: "homes",
    subcategories: [
      { title: "single room", image: "/categories/single-room.png", size: 456 },
      {
        title: "self contain",
        image: "/categories/self-contain.png",
        size: 456,
      },
      { title: "flat", image: "/categories/flat.png", size: 456 },
      { title: "others", image: "/categories/others.png", size: 456 },
    ],
  },
  {
    category: "beauty",
    subcategories: [
      { title: "skincare", image: "/categories/skincare.png", size: 456 },
      { title: "hair care", image: "/categories/hair-care.png", size: 456 },
      { title: "make up", image: "/categories/make-up.png", size: 456 },
      { title: "fragrance", image: "/categories/fragrance.png", size: 456 },
      {
        title: "medical supplies and equipment",
        image: "/categories/medical-supplies.png",
        size: 456,
      },
      {
        title: "vitamins and supplements",
        image: "/categories/vitamins.png",
        size: 456,
      },
      { title: "soaps", image: "/categories/soaps.png", size: 456 },
      { title: "gym equipments", image: "/categories/gym.png", size: 456 },
      { title: "others", image: "/categories/others.png", size: 456 },
    ],
  },
  {
    category: "vehicles",
    subcategories: [
      { title: "car", image: "/categories/car.png", size: 456 },
      { title: "motorcycle", image: "/categories/motorcycle.png", size: 456 },
      { title: "tricycles", image: "/categories/tricycles.png", size: 456 },
      { title: "buses", image: "/categories/buses.png", size: 456 },

      { title: "others", image: "/categories/others.png", size: 456 },
    ],
  },
  {
    category: "mobiles",
    subcategories: [
      {
        title: "android phones",
        image: "/categories/android-phones.png",
        size: 456,
      },
      {
        title: "apple phones",
        image: "/categories/apple-phones.png",
        size: 456,
      },
      { title: "tablets", image: "/categories/tablets.png", size: 456 },
      {
        title: "Phones & Tablets Accessories",
        image: "/categories/phone-accessories.png",
        size: 456,
      },
      { title: "others", image: "/categories/others.png", size: 456 },
    ],
  },
  {
    category: "electronics",
    subcategories: [
      {
        title: "Television & Home Entertainment",
        image: "/categories/television.png",
        size: 456,
      },
      {
        title: "Speakers & audio",
        image: "/categories/speakers.png",
        size: 456,
      },
      {
        title: "apple computers",
        image: "/categories/apple-computers.png",
        size: 456,
      },
      {
        title: "window computers",
        image: "/categories/windows-computers.png",
        size: 456,
      },
      { title: "desktops", image: "/categories/desktops.png", size: 456 },
      {
        title: "gaming electronics",
        image: "/categories/gaming-electronics.png",
        size: 456,
      },
      { title: "others", image: "/categories/others.png", size: 456 },
    ],
  },
  {
    category: "appliances",
    subcategories: [
      {
        title: "kitchen appliances",
        image: "/categories/kitchen.png",
        size: 456,
      },
      { title: "furnitures", image: "/categories/furnitures.png", size: 456 },
      {
        title: "home accessories",
        image: "/categories/home-accessories.png",
        size: 456,
      },
      {
        title: "household chemicals",
        image: "/categories/household-chemicals.png",
        size: 456,
      },
      {
        title: "cleaning appliances",
        image: "categories/cleaning-services.png",
        size: 456,
      },
      { title: "others", image: "/categories/others.png", size: 456 },
    ],
  },
];

export async function addCategories(category: string) {
  // Upload images

  const [current] = categories.filter((item) => item.category === category);
  const currentImages = current.subcategories.map((item) => item.image);

  const { uploadFiles } = genUploader<OurFileRouter>();

  // Convert to files
  const files = await Promise.all(
    currentImages.map(async (fileUrl) => {
      const response = await fetch(fileUrl);

      if (!response.ok) {
        throw new Error("Failed to fetch the image");
      }

      const blob = await response.blob();
      const fileName = fileUrl.split("/").pop() || "image.png";
      const fileType = blob.type || "image/png";

      return new File([blob], fileName, { type: fileType });
    })
  );

  // Upload to uploadthing
  const uploaded = await uploadFiles("imageUploader", {
    files,
  });

  const uploadedUrl = uploaded.map((item) => item.ufsUrl);

  uploadedUrl.map((item, index) => {
    current.subcategories[index].image = item;
  });

  // Upload current to database
  return current;
}
