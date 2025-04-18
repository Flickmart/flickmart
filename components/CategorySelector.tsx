'use client';
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft } from "lucide-react";

type Subcategory = {
  id: number;
  title: string;
  path: string;
  image: string;
  noAds: number;
};

interface CategorySelectorProps {
  subcategories: Subcategory[];
  onClick: () => void;
}

export default function CategorySelector({ subcategories, onClick }: CategorySelectorProps) {

  return (
    <section className="h-screen fixed inset-0 bg-white z-40 w-full lg:hidden">
        <header className="w-full shadow-lg py-3 border-t">
            <div className="w-[98%] mx-auto">
                <button onClick={onClick} className="flex font-light items-center transition-colors text-flickmart-gray hover:text-flickmart duration-300 capitalize text-sm">
                    <ChevronLeft size={35} strokeWidth={1.5} />
                    <span className=''>Find&nbsp;Category</span>
                </button>
            </div>
        </header>
        <div className="w-[95%] mx-auto flex flex-col">
            {subcategories.map((sub) => (
                <Link key={sub.id} href={sub.path} className="py-3 lg:border-b text-black">
                    <div className="flex gap-2 items-center">
                        <div className="flex h-12 w-12 aspect-square md:hidden justify-center items-center overflow-hidden">
                            <Image src={sub.image} width={500} height={500} className="max-w-full max-h-full" alt={sub.title} />
                        </div>
                        <div className="text-left">
                            <h2 className="text-[16px] lg:text-sm font-medium md:font-normal md:tracking-tighter">{sub.title}</h2> 
                            <span className="text-[14px] lg:text-[10px] text-gray-500">{sub.noAds} ads</span>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    </section>
  );
}