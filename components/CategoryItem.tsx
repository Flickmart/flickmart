import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function CatItem() {
    return (
        <Link href={'#'} className="py-3 border-t flex gap-1 items-center justify-between">
            <div className="flex gap-3 items-center">
                <div className="h-12 w-12 aspect-square flex justify-center items-center overflow-hidden">
                    <Image src='/toaster.jpg' width={500} height={500} className="max-w-full max-h-full" alt="category image" />
                </div>
                <div>
                    <h2 className="font-semibold">Television set</h2> 
                    <span>201 Ads</span>
                </div>
            </div>
            <span className="text-gray-500"><ChevronRight /></span>
        </Link>
    );
}