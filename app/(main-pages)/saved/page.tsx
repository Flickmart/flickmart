 'use client';
import SavedItem from "@/components/SavedItem";
import WishItem from "@/components/WishItem";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import Link from "next/link";
import { useState } from "react";


function useBookmarks(){
    try{
        const  saved = useQuery(api.product.getSavedByUserId, {})

        return { saved }
    }catch(err){
        console.log(err)
        return null
    }
}

export default function SavedPage() {
    const [selectedTab, setSelectedTab] = useState(false);
    const bookmarks = useBookmarks()
    const saved = bookmarks?.saved
    console.log(saved)


    const toggleAd = () => {
        setSelectedTab(false);
    }

    const toggleWl = () => {
        setSelectedTab(true);
    }
    return (
        <main className="w-full bg-gray-100 pb-12">
            <div className="w-full flex shadow-lg">
                <button onClick={toggleAd} className={selectedTab ? `w-full py-5 text-center text-flickmart-gray font-bold` : `w-full py-5 text-center text-flickmart font-bold`}>Saved ({saved?.length || 0})</button>
                <button onClick={toggleWl} className={selectedTab ? `w-full py-5 text-center text-flickmart font-bold` : `w-full py-5 text-center text-flickmart-gray font-bold`}>Wishlist (5)</button>
            </div>
            {!selectedTab ? (
                <div className="w-[95%] mx-auto flex flex-col gap-3 mt-3">
                    {saved?.map(item=>{
                        const {title, condition, price, images, location} = item ?? {}
                        return <Link key={item?._id} href={`/product/${item?._id}`}>
                        </Link>
                        }
                    )}
                </div>
            ):(
                <div className="w-[95%] mx-auto flex flex-col gap-3 mt-3">
                    <WishItem />
                    <WishItem />
                    <WishItem />
                    <WishItem />
                </div>
            )}
        </main>
    );
}