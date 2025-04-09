import CategoryItem from "@/components/CategoryItem";
import CategoryNav from "@/components/CategoryNav";
import { Bookmark, ChevronDown, ChevronRight, LayoutGrid, LayoutPanelLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Metadata, ResolvingMetadata } from 'next'

type PageProps = {
    params: Promise<{ slug: string }>
};

type Category = {
    id: number;
    title: string;
    noAds?: number;
    image: string;
    path: string;
};

export async function generateMetadata(
    { params }: PageProps,
    parent: ResolvingMetadata
  ): Promise<Metadata> {
    // read route params
    const { slug } = await params;
   
    // fetch data
    try {
        // const product = await fetch(`https://.../${slug}`).then((res) => res.json())
        
    } catch (error) {
        console.log(error);
    }
    
   
    // optionally access and extend (rather than replace) parent metadata
    const previousImages = (await parent).openGraph?.images || []
   
    // return {
    // //   title: product.title,
    // }
  }

const categoryData: Category[] = [
    { id: 1, title: "Apple Phones", noAds: 202, image: "/mobiles.png", path: "/categories/applephones" },
    { id: 2, title: "Android Phones", noAds: 180, image: "/mobiles.png", path: "/categories/androidphones" },
    { id: 3, title: "Tablets", noAds: 600, image: "/mobiles.png", path: "/categories/tablets" },
    { id: 4, title: "Phones & Tablets Accessories", noAds: 452, image: "/mobiles.png", path: "/categories/accessories" },
];
  
export default async function DetailedCategoryPage ({ params }: PageProps) {

    const { slug } = await params;

    return (
        <>
            <main className="w-[95%] mx-auto flex gap-12 min-h-screen">
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
                                {categoryData.map((item) =>(
                                    <CategoryItem key={item.id} item={item} />
                                ))}
                                <Link href={'#'} className="py-3 border-b flex flex-col">
                                    <span>Headphones</span>
                                    <span className="text-[10px] text-gray-500">119 Ads</span>
                                </Link>
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
                <section className="lg:block lg:mt-12 w-[95%] mx-auto lg:w-9/12 text-sm mb-12 pt-3">
                    <h1 className="hidden lg:block font-semibold text-lg capitalize">{slug} in Nigeria</h1>
                    
                    <div className="lg:hidden flex flex-wrap text-[12px] gap-2 items-center mb-2">
                        <button className="border rounded-md p-2 text-gray-500 flex items-center justify-between gap-2">
                            <span>Category</span> <ChevronDown className="h-3 w-3" />
                        </button>
                        <button className="border rounded-md p-2 text-gray-500 flex items-center justify-between gap-2">
                            <span>Location</span> <ChevronDown className="h-3 w-3" />
                        </button>
                        <button className="border rounded-md p-2 text-gray-500 flex items-center justify-between gap-2">
                            <span>Price</span> <ChevronDown className="h-3 w-3" />
                        </button>
                        <button className="border rounded-md p-2 text-gray-500 flex items-center justify-between gap-2">
                            <span>Agent Fee</span> <ChevronDown className="h-3 w-3" />
                        </button>
                    </div>
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
                        <div className="mt-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-5">
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
        </>
        
    );
}; 