import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type Category = {
    id: number;
    title: string;
    noAds?: number;
    image: string;
    path: string;
};

type CategoryItemProps = {
    item: Category;
};

export default function CatItem({ item }: CategoryItemProps) {
    return (
        <Link href={item.path} className="py-3 lg:border-b text-black">
            <div className="flex gap-2 items-center">
                <div className="flex h-12 w-12 aspect-square md:hidden justify-center items-center overflow-hidden">
                    <Image src={item.image} width={500} height={500} className="max-w-full max-h-full" alt="category image" />
                </div>
                <div className="text-left">
                    <h2 className="text-[16px] lg:text-sm font-medium md:font-normal md:tracking-tighter">{item.title}</h2> 
                    <span className="text-[14px] lg:text-[10px] text-gray-500">{item.noAds ? `${item.noAds} ads` : ``}</span>
                </div>
            </div>
        </Link>
    );
}