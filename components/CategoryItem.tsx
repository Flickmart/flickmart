"use client"
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import Image from "next/image";
import Link from "next/link";

type Category = {
    title: string;
    size?: number;
    image?: string;
    path?: string;
};

type CategoryItemProps = {
    item: Category;
};

export const useProductsByCategory = (category: string) => {
    try {
        return useQuery(api.product.getProductsByCategory, { category });
    } catch (error) {
        console.log("Error fetching products:", error);
        return null;
    }
};

export default function CatItem({ item }: CategoryItemProps) {
    const productsByCat = useProductsByCategory(item.title);
    return (
        <Link href={item.path || "#"} className="py-3 lg:border-b text-black">
            <div className="flex gap-2 items-center lg:pl-5">
                <div className="flex h-12 w-12 aspect-square md:hidden justify-center items-center overflow-hidden">
                    {item.image && <Image src={item.image} width={500} height={500} className="max-w-full max-h-full" alt="category image" />}
                </div>
                <div className="text-left">
                    <h2 className="text-[16px] lg:text-sm font-medium md:font-normal capitalize md:tracking-tighter">{item.title}</h2> 
                    <span className="text-[14px] lg:text-[10px] text-gray-500">{ `${productsByCat?.length} ads`}</span>
                </div>
            </div>
        </Link>
    );
}