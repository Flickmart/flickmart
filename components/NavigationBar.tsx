'use client';
import { ChevronLeft } from "lucide-react";
import { usePathname } from "next/navigation";

function getLastPathSegment(pathname: string): string {
    return pathname.substring(pathname.lastIndexOf("/") + 1);
}

const NavigationBar = () => {

    const cPath = usePathname();
    return (
        <header className="w-full shadow-lg py-3">
            <div className="w-[98%] mx-auto">
                <button className="flex font-light items-center transition-colors text-flickmart-gray hover:text-flickmart duration-300 capitalize text-sm">
                    <ChevronLeft size={35} strokeWidth={1.5} />
                    {getLastPathSegment(cPath)}<span className="hidden lg:block">&nbsp;In Nigeria.</span>
                </button>
            </div>
            
        </header>
    );
};
export default NavigationBar;