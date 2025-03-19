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
        <Link href={item.path} className="py-3 border-t lg:border-b flex gap-1 items-center justify-between">
            <div className="flex gap-3 items-center">
                <div className="flex h-12 w-12 aspect-square md:hidden justify-center items-center overflow-hidden">
                    <Image src={item.image} width={500} height={500} className="max-w-full max-h-full" alt="category image" />
                </div>
                <div>
                    <h2 className="font-semibold md:font-normal md:tracking-tighter">{item.title}</h2> 
                    <span className="text-[13px] md:text-[10px] text-gray-500">{item.noAds ? `${item.noAds} ads` : ''}</span>
                </div>
            </div>
            <span className="text-gray-500"><ChevronRight /></span>
        </Link>
    );
}