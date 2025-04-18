// data/categories.ts

export type Subcategory = {
    id: number;
    title: string;
    path: string;
    image: string;
    noAds: number;
  };
  
  export type Category = {
    id: number;
    title: string;
    image: string;
    subcategories: Subcategory[];
  };
  
//   dummy category data
export const categories: Category[] = [
{
    id: 1,
    title: "homes",
    image: "/homes.png",
    subcategories: [
    { id: 1, title: "Apartments", path: "/categories/apartments", image: "/homes.png", noAds: 10 },
    { id: 2, title: "Self-Contains", path: "/categories/self-contains", image: "/homes.png", noAds: 10 },
    { id: 3, title: "Shared Rooms", path: "/categories/shared-rooms", image: "/homes.png", noAds: 10 },
    { id: 4, title: "Hostels", path: "/categories/hostels", image: "/homes.png", noAds: 10 },
    { id: 5, title: "Bungalows", path: "/categories/bungalows", image: "/homes.png", noAds: 10 },
    { id: 6, title: "Duplexes", path: "/categories/duplexes", image: "/homes.png", noAds: 10 },
    { id: 7, title: "Land for Sale", path: "/categories/land", image: "/homes.png", noAds: 10 },
    ],
},
{
    id: 2,
    title: "mobiles",
    image: "/mobiles.png",
    subcategories: [
    { id: 1, title: "iPhones", path: "/categories/iphones", image: "/mobiles.png", noAds: 10 },
    { id: 2, title: "Samsung", path: "/categories/samsung", image: "/mobiles.png", noAds: 10 },
    { id: 3, title: "Infinix", path: "/categories/infinix", image: "/mobiles.png", noAds: 10 },
    { id: 4, title: "Tecno", path: "/categories/tecno", image: "/mobiles.png", noAds: 10 },
    { id: 5, title: "Itel", path: "/categories/itel", image: "/mobiles.png", noAds: 10 },
    { id: 6, title: "Xiaomi", path: "/categories/xiaomi", image: "/mobiles.png", noAds: 10 },
    { id: 7, title: "Nokia", path: "/categories/nokia", image: "/mobiles.png", noAds: 10 },
    ],
},
{
    id: 3,
    title: "food",
    image: "/food.png",
    subcategories: [
    { id: 1, title: "Jollof Rice", path: "/categories/jollof", image: "/food.png", noAds: 10 },
    { id: 2, title: "Fried Rice", path: "/categories/friedrice", image: "/food.png", noAds: 10 },
    { id: 3, title: "Shawarma", path: "/categories/shawarma", image: "/food.png", noAds: 10 },
    { id: 4, title: "Pizza", path: "/categories/pizza", image: "/food.png", noAds: 10 },
    { id: 5, title: "Local Dishes", path: "/categories/localdishes", image: "/food.png", noAds: 10 },
    { id: 6, title: "Snacks", path: "/categories/snacks", image: "/food.png", noAds: 10 },
    { id: 7, title: "Drinks", path: "/categories/drinks", image: "/food.png", noAds: 10 },
    ],
},
{
    id: 4,
    title: "electronics",
    image: "/electronics.png",
    subcategories: [
    { id: 1, title: "TVs", path: "/categories/tvs", image: "/electronics.png", noAds: 10 },
    { id: 2, title: "Sound Systems", path: "/categories/sound", image: "/electronics.png", noAds: 10 },
    { id: 3, title: "Game Consoles", path: "/categories/consoles", image: "/electronics.png", noAds: 10 },
    { id: 4, title: "Projectors", path: "/categories/projectors", image: "/electronics.png", noAds: 10 },
    { id: 5, title: "Monitors", path: "/categories/monitors", image: "/electronics.png", noAds: 10 },
    { id: 6, title: "CCTV", path: "/categories/cctv", image: "/electronics.png", noAds: 10 },
    { id: 7, title: "Inverters", path: "/categories/inverters", image: "/electronics.png", noAds: 10 },
    ],
},
{
    id: 5,
    title: "services",
    image: "/services.png",
    subcategories: [
    { id: 1, title: "Tutoring", path: "/categories/tutoring", image: "/services.png", noAds: 10 },
    { id: 2, title: "Laundry", path: "/categories/laundry", image: "/services.png", noAds: 10 },
    { id: 3, title: "Repair Services", path: "/categories/repairs", image: "/services.png", noAds: 10 },
    { id: 4, title: "Photography", path: "/categories/photography", image: "/services.png", noAds: 10 },
    { id: 5, title: "Event Planning", path: "/categories/events", image: "/services.png", noAds: 10 },
    { id: 6, title: "Home Cleaning", path: "/categories/cleaning", image: "/services.png", noAds: 10 },
    { id: 7, title: "Makeup Services", path: "/categories/makeup", image: "/services.png", noAds: 10 },
    ],
},
{
    id: 6,
    title: "pets",
    image: "/pets.png",
    subcategories: [
    { id: 1, title: "Dogs", path: "/categories/dogs", image: "/pets.png", noAds: 10 },
    { id: 2, title: "Cats", path: "/categories/cats", image: "/pets.png", noAds: 10 },
    { id: 3, title: "Birds", path: "/categories/birds", image: "/pets.png", noAds: 10 },
    { id: 4, title: "Fish", path: "/categories/fish", image: "/pets.png", noAds: 10 },
    { id: 5, title: "Pet Food", path: "/categories/petfood", image: "/pets.png", noAds: 10 },
    { id: 6, title: "Accessories", path: "/categories/accessories", image: "/pets.png", noAds: 10 },
    { id: 7, title: "Vet Services", path: "/categories/vet", image: "/pets.png", noAds: 10 },
    ],
},
{
    id: 7,
    title: "fashion",
    image: "/fashion.png",
    subcategories: [
    { id: 1, title: "T-Shirts", path: "/categories/tshirts", image: "/fashion.png", noAds: 10 },
    { id: 2, title: "Trousers", path: "/categories/trousers", image: "/fashion.png", noAds: 10 },
    { id: 3, title: "Shoes", path: "/categories/shoes", image: "/fashion.png", noAds: 10 },
    { id: 4, title: "Gowns", path: "/categories/gowns", image: "/fashion.png", noAds: 10 },
    { id: 5, title: "Watches", path: "/categories/watches", image: "/fashion.png", noAds: 10 },
    { id: 6, title: "Bags", path: "/categories/bags", image: "/fashion.png", noAds: 10 },
    { id: 7, title: "Glasses", path: "/categories/glasses", image: "/fashion.png", noAds: 10 },
    ],
},
{
    id: 8,
    title: "beauty",
    image: "/beauty.png",
    subcategories: [
    { id: 1, title: "Skincare", path: "/categories/skincare", image: "/beauty.png", noAds: 10 },
    { id: 2, title: "Haircare", path: "/categories/haircare", image: "/beauty.png", noAds: 10 },
    { id: 3, title: "Perfumes", path: "/categories/perfumes", image: "/beauty.png", noAds: 10 },
    { id: 4, title: "Makeup", path: "/categories/makeup", image: "/beauty.png", noAds: 10 },
    { id: 5, title: "Nails", path: "/categories/nails", image: "/beauty.png", noAds: 10 },
    { id: 6, title: "Beard Care", path: "/categories/beards", image: "/beauty.png", noAds: 10 },
    { id: 7, title: "Spa", path: "/categories/spa", image: "/beauty.png", noAds: 10 },
    ],
},
{
    id: 9,
    title: "appliances",
    image: "/appliances.png",
    subcategories: [
    { id: 1, title: "Fridges", path: "/categories/fridges", image: "/appliances.png", noAds: 10 },
    { id: 2, title: "Freezers", path: "/categories/freezers", image: "/appliances.png", noAds: 10 },
    { id: 3, title: "Blenders", path: "/categories/blenders", image: "/appliances.png", noAds: 10 },
    { id: 4, title: "Microwaves", path: "/categories/microwaves", image: "/appliances.png", noAds: 10 },
    { id: 5, title: "Fans", path: "/categories/fans", image: "/appliances.png", noAds: 10 },
    { id: 6, title: "AC Units", path: "/categories/ac", image: "/appliances.png", noAds: 10 },
    { id: 7, title: "Cookers", path: "/categories/cookers", image: "/appliances.png", noAds: 10 },
    ],
},
{
    id: 10,
    title: "vehicles",
    image: "/vehicles.png",
    subcategories: [
    { id: 1, title: "Cars", path: "/categories/cars", image: "/vehicles.png", noAds: 10 },
    { id: 2, title: "Bikes", path: "/categories/bikes", image: "/vehicles.png", noAds: 10 },
    { id: 3, title: "Tricycles", path: "/categories/tricycles", image: "/vehicles.png", noAds: 10 },
    { id: 4, title: "Trucks", path: "/categories/trucks", image: "/vehicles.png", noAds: 10 },
    { id: 5, title: "Buses", path: "/categories/buses", image: "/vehicles.png", noAds: 10 },
    { id: 6, title: "Car Parts", path: "/categories/carparts", image: "/vehicles.png", noAds: 10 },
    { id: 7, title: "Vehicle Services", path: "/categories/vehicleservices", image: "/vehicles.png", noAds: 10 },
    ],
},
];
  
export default categories;
  