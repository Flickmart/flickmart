'use client';
import SavedItem from "@/components/SavedItem";
import { useState } from "react";

export default function SavedPage() {

    const [selectedTab, setSelectedTab] = useState(false);

    const toggleAd = () => {
        setSelectedTab(false);
    }

    const toggleWl = () => {
        setSelectedTab(true);
    }

    return (
        <main className="w-full bg-gray-100 pb-12">
            <div className="w-full flex shadow-lg">
                <button onClick={toggleAd} className={selectedTab ? `w-full py-5 text-center text-flickmart-gray font-bold` : `w-full py-5 text-center text-flickmart font-bold`}>Adverts (7)</button>
                <button onClick={toggleWl} className={selectedTab ? `w-full py-5 text-center text-flickmart font-bold` : `w-full py-5 text-center text-flickmart-gray font-bold`}>Wishlist (5)</button>
            </div>
            {!selectedTab ? (
                <div className="w-[95%] mx-auto flex flex-col gap-3 mt-3">
                    <SavedItem />
                    <SavedItem />
                    <SavedItem />
                    <SavedItem />
                </div>
            ):(
                <div className="flex flex-col gap-5">

                </div>
            )}
        </main>
    );
}