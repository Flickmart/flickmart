import CatItem from "@/components/CategoryItem";
import { Bookmark, ChevronRight, LayoutGrid, LayoutPanelLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

function findCategoryBySlug(slug: string): Category | undefined {
    return categories.find(category => 
        category.name.toLowerCase().replace(/\s+/g, "-") === slug.toLowerCase()
    );
}

type CategoryPageProps = {
    params: {
        slug: string;
    };
};

type SubItem = {
    id: number;
    name: string;
    adAmount: string;
};

type Category = {
    id: number;
    name: string;
    path: string;
    img: string;
    subItems?: SubItem[];
};

const categories: Category[] = [
    {
        id: 1,
        name: "Food",
        path: "#food",
        img: "/food.png",
        subItems: [
            { id: 1, name: "Television set", adAmount: "119" },
            { id: 2, name: "Headphones", adAmount: "202" }
        ]
    },
    {
        id: 2,
        name: "Mobile Phones",
        path: "#mood_phones",
        img: "/mobiles.png",
        subItems: [
            { id: 1, name: "Television set", adAmount: "119" },
            { id: 2, name: "Headphones", adAmount: "202" }
        ]
    },
    {
        id: 3,
        name: "Vehicles",
        path: "#vehicles",
        img: "/vehicles.png",
        subItems: [
            { id: 1, name: "Television set", adAmount: "119" },
            { id: 2, name: "Headphones", adAmount: "202" }
        ]
    },
    {
        id: 4,
        name: "Home Appliances",
        path: "#home_appliances",
        img: "/appliances.png",
        subItems: [
            { id: 1, name: "Television set", adAmount: "119" },
            { id: 2, name: "Headphones", adAmount: "202" }
        ]
    },
    {
        id: 5,
        name: "Pets",
        path: "#pets",
        img: "/pets.png",
        subItems: [
            { id: 1, name: "Television set", adAmount: "119" },
            { id: 2, name: "Headphones", adAmount: "202" }
        ]
    },
    {
        id: 6,
        name: "Fashion",
        path: "#fashion",
        img: "/fashion.png",
        subItems: [
            { id: 1, name: "Television set", adAmount: "119" },
            { id: 2, name: "Headphones", adAmount: "202" }
        ]
    },
    {
        id: 7,
        name: "Electronics",
        path: "#electronics",
        img: "/electronics.png",
        subItems: [
            { id: 1, name: "Television set", adAmount: "119" },
            { id: 2, name: "Headphones", adAmount: "202" }
        ]
    },
    {
        id: 8,
        name: "Services",
        path: "#services",
        img: "/services.png",
        subItems: [
            { id: 1, name: "Television set", adAmount: "119" },
            { id: 2, name: "Headphones", adAmount: "202" }
        ]
    },
]

export default async function CategoryPage({ params }: CategoryPageProps) {
    const { slug } = await params;
    const selected = findCategoryBySlug(slug);
    return (
        <main className="w-[95%] mx-auto flex gap-12 min-h-screen">
            <section className="w-full flex lg:hidden flex-col">
                {categories.map((item) => (
                    <CatItem key={item.id} item={item} />
                ))}
            </section>
            <section className="lg:mt-12 hidden lg:block w-2/12 mb-12">
                <div className="w-full flex flex-col gap-12">
                    <div className="">
                        <div className="mb-3">
                            <h2 className="font-semibold text-flickmart-chat-orange">Categories</h2>
                        </div>
                        <h2 className="font-semibold text-sm capitalize">
                            {slug}
                        </h2>
                        <div className="flex flex-col text-sm text-gray-800">
                            {selected?.subItems?.map((el) => (
                                <Link key={el.id} href={'#'} className="py-3 border-b flex flex-col">
                                    <span>{el.name}</span>
                                    <span className="text-[10px] text-gray-500">{el.adAmount} Ads</span>
                                </Link>
                            ))}
                        </div>
                        <div className="w-full flex justify-end text-[12px]">
                            <Link href={'#'} className="text-flickmart-chat-orange mt-2">Show More</Link>
                        </div>
                    </div>
                    <button className="w-full shadow-md p-2 flex justify-between items-center">
                        <span className="flex flex-col items-start">
                            <h2 className="font-semibold text-sm">Select Location</h2>
                            <span className="text-[10px] text-gray-500">All Nigeria</span>
                        </span>
                        <ChevronRight className="text-gray-500" />
                    </button>
                    <div className="w-full text-sm">
                        <h2 className="font-semibold">Add Price</h2>
                        <div className="mt-2 flex justify-between items-center">
                            <div className="w-5/12 flex flex-col items-start">
                                <span className="text-[10px] text-gray-700">Min</span>
                                <input type="text" className="w-full border border-flickmart-chat-orange p-2" />
                            </div>
                            <div className="w-5/12 flex flex-col items-start">
                                <span className="text-[10px] text-gray-700">Max</span>
                                <input type="text" className="w-full border border-flickmart-chat-orange p-2" />
                            </div>
                        </div>
                        <div className="flex flex-col text-sm mt-6">
                            <div className="flex justify-between items-center border-b py-1">
                                <div className="">
                                    <h2 className="">Below 100k</h2>
                                    <span className="text-[10px]">452 ads</span>
                                </div>
                                <input name="price_form" type="radio" className="text-flickmart-chat-orange bg-flickmart-chat-orange" />
                            </div>
                            <div className="flex justify-between items-center border-b py-1">
                                <div className="">
                                    <h2 className="">100k - 500k</h2>
                                    <span className="text-[10px]">452 ads</span>
                                </div>
                                <input name="price_form" type="radio" className="text-flickmart-chat-orange bg-flickmart-chat-orange" />
                            </div>
                            <div className="flex justify-between items-center border-b py-1">
                                <div className="">
                                    <h2 className="">500k - 1.5m</h2>
                                    <span className="text-[10px]">452 ads</span>
                                </div>
                                <input name="price_form" type="radio" className="text-flickmart-chat-orange bg-flickmart-chat-orange" />
                            </div>
                            <div className="flex justify-between items-center border-b py-1">
                                <div className="">
                                    <h2 className="">1.5m - 3.5m</h2>
                                    <span className="text-[10px]">452 ads</span>
                                </div>
                                <input name="price_form" type="radio" className="text-flickmart-chat-orange bg-flickmart-chat-orange" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="hidden lg:block lg:mt-12 w-9/12 text-sm mb-12">
                <h1 className="font-semibold text-lg capitalize">{slug} in Nigeria</h1>
                <div className="mt-3">
                    <div className="flex justify-between items-center">
                        <span>Sort By:</span>
                        <div className="flex gap-2">
                            <button>
                                <LayoutGrid className="text-flickmart-chat-orange h-5 w-5" />    
                            </button>
                            <button>
                                <LayoutPanelLeft className="text-gray-500 h-5 w-5" />
                            </button>
                        </div>
                    </div>
                    <div className="mt-2 grid lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        <div className="border relative">
                            <div className="h-56 w-full overflow-hidden flex justify-center items-center">
                                <Image src='/toaster.png' width={500} height={500} alt="category image" className="" />
                            </div>
                            <div className="px-2 mt-1 tracking-tight">
                                <h2 className="font-semibold">Freestyle Crew Racer leather jacket</h2>
                                <span className="text-flickmart-chat-orange font-semibold text-[12px] mt-1">$595.00</span>
                            </div>
                            <Link href={'#'} className="z-10 absolute inset-0 h-full w-full"></Link>
                            <div className="w-[95%] mx-auto right-0 left-0 absolute top-1 z-20 flex justify-between items-center">
                                <span className="px-2 py-0.5 font-semibold bg-white rounded-sm text-[12px] uppercase">Hot</span>
                                <button className="bg-white rounded-full flex justify-center items-center p-1.5">
                                    <Bookmark className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                        <div className="border relative">
                            <div className="h-56 w-full overflow-hidden flex justify-center items-center">
                                <Image src='/beige-lamp.png' width={500} height={500} alt="category image" className="" />
                            </div>
                            <div className="px-2 mt-1 tracking-tight">
                                <h2 className="font-semibold">Freestyle Crew Racer leather jacket</h2>
                                <span className="text-flickmart-chat-orange font-semibold text-[12px] mt-1">$595.00</span>
                            </div>
                            <Link href={'#'} className="z-10 absolute inset-0 h-full w-full"></Link>
                            <div className="w-[95%] mx-auto right-0 left-0 absolute top-1 z-20 flex justify-between items-center">
                                <span className="px-2 py-0.5 font-semibold bg-white rounded-sm text-[12px] uppercase">Hot</span>
                                <button className="bg-white rounded-full flex justify-center items-center p-1.5">
                                    <Bookmark className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                        <div className="border relative">
                            <div className="h-56 w-full overflow-hidden flex justify-center items-center">
                                <Image src='/generic-lamp.png' width={500} height={500} alt="category image" className="" />
                            </div>
                            <div className="px-2 mt-1 tracking-tight">
                                <h2 className="font-semibold">Freestyle Crew Racer leather jacket</h2>
                                <span className="text-flickmart-chat-orange font-semibold text-[12px] mt-1">$595.00</span>
                            </div>
                            <Link href={'#'} className="z-10 absolute inset-0 h-full w-full"></Link>
                            <div className="w-[95%] mx-auto right-0 left-0 absolute top-1 z-20 flex justify-between items-center">
                                <span className="px-2 py-0.5 font-semibold bg-white rounded-sm text-[12px] uppercase">Hot</span>
                                <button className="bg-white rounded-full flex justify-center items-center p-1.5">
                                    <Bookmark className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                        <div className="border relative">
                            <div className="h-56 w-full overflow-hidden flex justify-center items-center">
                                <Image src='/electronics.png' width={500} height={500} alt="category image" className="" />
                            </div>
                            <div className="px-2 mt-1 tracking-tight">
                                <h2 className="font-semibold">Freestyle Crew Racer leather jacket</h2>
                                <span className="text-flickmart-chat-orange font-semibold text-[12px] mt-1">$595.00</span>
                            </div>
                            <Link href={'#'} className="z-10 absolute inset-0 h-full w-full"></Link>
                            <div className="w-[95%] mx-auto right-0 left-0 absolute top-1 z-20 flex justify-between items-center">
                                <span className="px-2 py-0.5 font-semibold bg-white rounded-sm text-[12px] uppercase">Hot</span>
                                <button className="bg-white rounded-full flex justify-center items-center p-1.5">
                                    <Bookmark className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                        <div className="border relative">
                            <div className="h-56 w-full overflow-hidden flex justify-center items-center">
                                <Image src='/toaster.png' width={500} height={500} alt="category image" className="" />
                            </div>
                            <div className="px-2 mt-1 tracking-tight">
                                <h2 className="font-semibold">Freestyle Crew Racer leather jacket</h2>
                                <span className="text-flickmart-chat-orange font-semibold text-[12px] mt-1">$595.00</span>
                            </div>
                            <Link href={'#'} className="z-10 absolute inset-0 h-full w-full"></Link>
                            <div className="w-[95%] mx-auto right-0 left-0 absolute top-1 z-20 flex justify-between items-center">
                                <span className="px-2 py-0.5 font-semibold bg-white rounded-sm text-[12px] uppercase">Hot</span>
                                <button className="bg-white rounded-full flex justify-center items-center p-1.5">
                                    <Bookmark className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}