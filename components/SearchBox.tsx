'use client'
import { MapPin, Search } from "lucide-react"
import { usePathname } from "next/navigation";

export default function SearchBox() {

    const pathname = usePathname();

    // Pages where SearchBox should not be shown
    const hiddenPages = ["/sign-in", "/sign-up", "/forgot-password"];

    if (hiddenPages.includes(pathname)) {
        return null; // Don't render any component
    }

    return (
        <div className="w-full bg-flickmartLight py-32 flex justify-center text-base">
            <div className="w-11/12 lg:w-6/12 flex flex-col justify-center items-center gap-4">
                <div className="w-full flex items-center justify-center gap-2">
                    <span className="font-medium">Find anything in</span>
                    <button className="flex items-center gap-1 rounded-md py-2 px-4 bg-black text-white">
                        <MapPin className="h-4 w-4" /><span>All Nigeria</span>
                    </button>
                </div>
                <div className="w-full">
                    <div className="w-full flex items-center gap-1 rounded-md bg-white text-black">
                        <input type="text" className="w-11/12 outline-none ps-4 py-3 rounded-md text-sm text-flickmart-gray" placeholder="What are you looking for?" />
                        <button className="hover:bg-black/5 duration-500 py-2 rounded-md w-1/12 flex justify-center items-center me-2"><Search className="h-5 w-5 text-flickmart-gray" /></button>
                    </div>
                </div>
            </div>
        </div>
    );
}