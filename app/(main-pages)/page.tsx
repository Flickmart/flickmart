'use client';
import { useEffect, useState } from 'react';
import OneSignal from 'react-onesignal';
import Delivery from '@/components/Delivery';
import Footer from '@/components/Footer';
import BestSellers from '@/components/home/BestSellers';
import Categories from '@/components/home/Categories';
import NewArrivals from '@/components/home/NewArrivals';
import PopularSection from '@/components/home/PopularSection';
import Slider from '@/components/home/Slider';
import MobileNav from '@/components/MobileNav';
import SearchBox from '@/components/SearchBox';
import SearchOverlay from '@/components/SearchOverlay';

export default function Home() {
  const [searchOpen, setSearchOpen] = useState(false);
  function openSearch(val: boolean) {
    setSearchOpen(val);
  }

  useEffect(() => {
    // Ensure this code runs only on the client side
    if (typeof window !== 'undefined') {
      OneSignal.init({
        appId: '1602d5cc-611d-46a2-a87f-0d711c6e7f99',
        safari_web_id:
          'web.onesignal.auto.38b1a4de-a361-440e-ae28-b71c05790af2',
      });
    }
  }, []);

  return (
    <>
      <MobileNav />
      <SearchOverlay open={searchOpen} openSearch={openSearch} />
      <SearchBox open={searchOpen} openSearch={openSearch} />
      <Slider />
      <div className="min-h-screen space-y-5 px-5 text-white sm:space-y-10 sm:px-10">
        <Categories />
        <BestSellers />
        <NewArrivals />
        <PopularSection />
      </div>
      <Delivery />
      <Footer />
    </>
  );
}
