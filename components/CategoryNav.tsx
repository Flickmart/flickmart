'use client';
import { ChevronLeft } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

function getLastPathSegment(pathname: string): string {
    return pathname.substring(pathname.lastIndexOf("/") + 1);
}

type CategoryNavProps = {
    togglePanel?: () => void; // Accepting togglePanel
}

export default function CategoryNav({ togglePanel }: CategoryNavProps) {
    const router = useRouter();
    const cPath = usePathname();
    // an array of paths where the styles should be applied
    const activePaths = [`/`,];
    
    // Check if the current pathname is in the array
    const isActive = activePaths.includes(cPath);
    return (
        <header className="w-full shadow-lg py-3 border-t">
            <div className="w-[98%] mx-auto">
                {isActive ? (
                    <button onClick={()=> togglePanel?.()} className="flex font-light items-center transition-colors text-flickmart-gray hover:text-flickmart duration-300 capitalize text-sm">
                        <ChevronLeft size={35} strokeWidth={1.5} />
                        <span className=''>Find&nbsp;Category</span>
                    </button>
                ):(
                    <button onClick={()=> router.back()} className="flex font-light items-center transition-colors text-flickmart-gray hover:text-flickmart duration-300 capitalize text-sm">
                        <ChevronLeft size={35} strokeWidth={1.5} />
                        <span className="">Find&nbsp;{getLastPathSegment(cPath)}</span>
                    </button>
                )}
            </div>
        </header>
    )
}