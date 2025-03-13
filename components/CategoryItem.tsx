import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type Category = {
    id: number | string;
    name: string;
    path: string;
    img: string;
};

type CategoryProps = {
    item: Category;
};

export default function CatItem({ item }: CategoryProps) {
    return (
        <Link href={item.path} className="py-3 border-t flex gap-1 items-center justify-between">
            <div className="flex gap-3 items-center">
                <div className="h-12 w-12 aspect-square flex justify-center items-center overflow-hidden">
                    <Image src={item.img} width={500} height={500} className="max-w-full max-h-full" alt="category image" />
                </div>
                <div>
                    <h2 className="font-semibold">{item.name}</h2> 
                    <span></span>
                </div>
            </div>
            <span className="text-gray-500"><ChevronRight /></span>
        </Link>
    );
}