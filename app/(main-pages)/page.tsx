"use client";
import BestSellers from "@/components/home/BestSellers";
import Categories from "@/components/home/Categories";
import NewArrivals from "@/components/home/NewArrivals";
import Slider from "@/components/home/Slider";
import Footer from "@/components/Footer";
import Delivery from "@/components/Delivery";
import SearchBox from "@/components/SearchBox";
import MobileNav from "@/components/MobileNav";
import SearchOverlay from "@/components/SearchOverlay";
import { useState } from "react";

export default function Home() {
  const [searchOpen, setSearchOpen] = useState(false);
  function openSearch(val: boolean) {
    setSearchOpen(val);
  }
  return (
    <>
      <MobileNav />
      <SearchOverlay openSearch={openSearch} open={searchOpen} />
      <SearchBox openSearch={openSearch} open={searchOpen} />
      <Slider />
      <div className="sm:px-10 px-5 min-h-screen text-white sm:space-y-10 space-y-5">
        <Categories />
        <BestSellers />
        <NewArrivals />
      </div>
      <Delivery />
      <Footer />
    </>
  );
}
