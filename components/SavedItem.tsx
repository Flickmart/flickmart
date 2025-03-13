'use client';
import { EllipsisVertical, MapPin, MessageSquareText, Phone } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function SavedItem() {

    const [isDelOpen, setIsDelOpen] = useState(false);  

    const toggleDelete = () => {
        setIsDelOpen(prev => !prev);
    }

    return (
        <div className="w-full p-3 relative bg-white flex flex-col gap-3 text-sm">
            <div className="z-20 absolute top-1.5 right-1">
                <button onClick={toggleDelete} className="text-flickmart hover:bg-orange-100 rounded-full p-1.5 relative" tabIndex={0} onBlur={() => setIsDelOpen(false)}><EllipsisVertical /></button>
                {isDelOpen && (
                    <button className="z-30 absolute top-0 right-7 py-2 px-6 bg-white text-black border rounded-sm text-sm">Delete</button>
                )}
            </div>
            <div className="flex gap-3 ">
                <div className="w-5/12 h-32 lg:w-5/12 lg:h-56 aspect-square overflow-hidden flex justify-center items-center">
                    <Image src='/car.jpeg' className="h-full lg:h-auto w-full lg:w-auto rounded-md object-cover" alt="" height={1000} width={1000} />
                </div>
                <div className="w-7/12 lg:w-5/12 flex flex-col justify-between pe-3">
                    <div className="flex flex-col gap-2 lg:gap-5">
                        <h1 className="text-sm lg:text-xl font-semibold tracking-tighter">Laptop Lenovo 8GB
                        Intel core I5 SSD 256GB</h1>
                        <span className="font-semibold text-[12px] lg:text-sm">₦750,000,000</span>
                        <span className="">
                            <span className="bg-flickmart text-white py-1.5 px-2 rounded-sm text-[8px] lg:text-sm">Brand New</span>
                        </span>
                    </div>
                    <div className="flex flex-col gap-4 mt-3">
                        <span className="flex gap-1 items-center text-flickmart-gray text-[8px] lg:text-sm">
                            <MapPin className="h-4 w-4" />
                            <span>Enugu, UNEC</span>
                        </span>
                        <div className="hidden lg:flex gap-3 items-center text-[8px] lg:text-sm">
                            <button className="bg-flickmart text-white rounded-sm flex items-center gap-2 px-2 py-2"><MessageSquareText className="h-4 w-4" /><span>Chat vendor</span></button>
                            <button className="border border-flickmart flex items-center gap-2 py-2 px-2 rounded-sm text-flickmart"><Phone className="h-4 w-4" /><span>Call vendor</span></button>
                        </div>
                    </div>
                </div> 
            </div>
            <div className="lg:hidden border-t flex gap-3 pt-3">
                <button className="bg-flickmart text-white rounded-sm flex items-center gap-2 px-2 py-2"><MessageSquareText className="h-4 w-4" /><span>Chat vendor</span></button>
                <button className="border border-flickmart flex items-center gap-2 py-2 px-2 rounded-sm text-flickmart"><Phone className="h-4 w-4" /><span>Call vendor</span></button>
            </div>
        </div>
    );
}