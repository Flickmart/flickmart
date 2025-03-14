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
        <div className="w-full p-3 relative bg-white flex flex-col gap-3">
            <div className="z-20 absolute top-2 right-1.5">
                <button onClick={toggleDelete} className="text-flickmart hover:bg-orange-100 rounded-full p-1.5 relative" tabIndex={0} onBlur={() => setIsDelOpen(false)}><EllipsisVertical /></button>
                {isDelOpen && (
                    <button className="z-30 absolute top-0 right-7 py-2 px-6 bg-white text-black border rounded-sm text-sm">Delete</button>
                )}
            </div>
            
            <div className="flex gap-3 ">
                <div className="w-4/12 lg:w-3/12 h-32 lg:h-56">
                    <Image src='/car.jpeg' className="object-cover h-full w-full rounded-sm" alt="" height={1000} width={1000} />
                </div>
                <div className="w-8/12 lg:w-5/12 flex flex-col justify-between">
                    <div className="flex flex-col gap-2 lg:gap-5">
                        <h1 className="text-lg lg:text-2xl font-bold">Mercedes-Benz C-Class</h1>
                        <span className="font-bold text-sm">₦750,000,000</span>
                        <span className="">
                            <span className="bg-flickmart text-white py-1.5 px-2 rounded-sm text-[10px] lg:text-sm">Brand New</span>
                        </span>
                    </div>
                    <div className="flex flex-col gap-4">
                        <span className="flex gap-1 items-center text-flickmart-gray text-sm">
                            <MapPin className="h-4 w-4" />
                            <span>Enugu, UNEC</span>
                        </span>
                        <div className="hidden lg:flex gap-3 items-center text-sm">
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