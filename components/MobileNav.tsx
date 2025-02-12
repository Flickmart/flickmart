'use client'
import { Bookmark, House, MessageSquareText, Store, UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MobileNav() {

    const pathname = usePathname();

    // Pages where SearchBox should not be shown
    const hiddenPages = ["/sign-in", "/sign-up", "/forgot-password"];

    if (hiddenPages.includes(pathname)) {
        return null; // Don't render any component
    }

    return (
        <header className="z-50 bg-white lg:hidden w-full fixed bottom-0 text-[12px]">
            <div className="relative w-[94%] mx-auto flex justify-between py-3">
                <Link href={'#'} className="flex flex-col items-center justify-center gap-1.5 group">
                    <House className='text-flickmart-gray group-hover:text-flickmart duration-500 h-5 w-5' />
                    <span className='group-hover:text-flickmart duration-500'>Home</span>
                </Link>
                <Link href={'#'} className="flex flex-col items-center justify-center gap-1.5 group">
                    <Bookmark className='text-flickmart-gray group-hover:text-flickmart duration-500 h-5 w-5' />
                    <span className='group-hover:text-flickmart duration-500'>Saved</span>
                </Link>
                <Link href={'#'} className="mx-6 flex flex-col items-center justify-center gap-1.5 group">
                    <div className=" mx-6 absolute -top-10 flex flex-col gap-1.5 items-center bg-white rounded-full p-3">
                        <div className="bg-flickmart p-5 rounded-full flex justify-center items-center text-white shadow-lg shadow-black/20">
                            <Store className=' h-5 w-5' />
                        </div>
                        <span className='group-hover:text-flickmart duration-500'>Sell</span>
                    </div>
                </Link>
                <Link href={'#'} className="flex flex-col items-center justify-center gap-1.5 group">
                    <MessageSquareText className='text-flickmart-gray group-hover:text-flickmart duration-500 h-5 w-5' />
                    <span className='group-hover:text-flickmart duration-500'>Chats</span>
                </Link>
                <Link href={'#'} className="flex flex-col items-center justify-center gap-1.5 group">
                    <UserRound className='text-flickmart-gray group-hover:text-flickmart duration-500 h-5 w-5' />
                    <span className='group-hover:text-flickmart duration-500'>Profile</span>
                </Link>
            </div>
        </header>
    );
}