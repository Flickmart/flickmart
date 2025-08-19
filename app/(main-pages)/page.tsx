"use client";
import { useState , useEffect} from "react";
import BestSellers from "@/components/home/BestSellers";
import Categories from "@/components/home/Categories";
import NewArrivals from "@/components/home/NewArrivals";
import Slider from "@/components/home/Slider";
import Footer from "@/components/Footer";
import Delivery from "@/components/Delivery";
import SearchBox from "@/components/SearchBox";
import MobileNav from "@/components/MobileNav";
import SearchOverlay from "@/components/SearchOverlay";
import OneSignal from 'react-onesignal';

export default function Home() {
  const [searchOpen, setSearchOpen] = useState(false);
  function openSearch(val: boolean) {
    setSearchOpen(val);
  }

  useEffect(() => {
    // Ensure this code runs only on the client side
    if (typeof window !== 'undefined') {
      OneSignal.init({
        appId: "1602d5cc-611d-46a2-a87f-0d711c6e7f99",
        safari_web_id: "web.onesignal.auto.38b1a4de-a361-440e-ae28-b71c05790af2",
      });
    }
  }, []);

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
