 'use client';
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import Link from "next/link";
import { useState } from "react";
import BookedMarkedItem from "@/components/BookMarkedItem";


function useBookmarks(){
    try{
        const  saved = useQuery(api.product.getAllSavedOrWishlist, {type: "saved"})
        const  wishlist = useQuery(api.product.getAllSavedOrWishlist, {type: "wishlist"})
        return { saved, wishlist }
    }catch(err){
        console.log(err)
        return null
    }
}

export default function SavedPage() {
    const [selectedTab, setSelectedTab] = useState(false);
    const bookmarks = useBookmarks()
    const saved = bookmarks?.saved
    const wishlist = bookmarks?.wishlist


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
                <button onClick={toggleWl} className={selectedTab ? `w-full py-5 text-center text-flickmart font-bold` : `w-full py-5 text-center text-flickmart-gray font-bold`}>Wishlist ({wishlist?.length || 0})</button>
            </div>
            {!selectedTab ? (
                <div className="w-[95%] mx-auto flex flex-col gap-3 mt-3">
                    {saved?.map(item=>{
                        return <Link key={item?._id} href={`/product/${item?._id}`}>
                            <BookedMarkedItem type="saved" product={item!}/>
                        </Link>
                        }
                    )}
                </div>
            ):(
                <div className="w-[95%] mx-auto flex flex-col gap-3 mt-3">
                    {wishlist?.map(item=>{
                        return <BookedMarkedItem type="wishlist" product={item!}/>
                        // <Link key={item?._id} href={`/product/${item?._id}`}>
                        // </Link>
                        }
                    )}
                </div>
             )
           }
        </main>
    )
}