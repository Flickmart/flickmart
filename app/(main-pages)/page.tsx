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
import { useAppPresence } from '@/hooks/useAppPresence';

export default function Home() {
  const [searchOpen, setSearchOpen] = useState(false);
  function openSearch(val: boolean) {
    setSearchOpen(val);
  }

  const { presenceState } = useAppPresence();

  console.log('Presense state', presenceState);

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

  function _urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  return (
    <section className="lg:flex lg:justify-end lg:bg-[#F8F8F8]">
      <div className="lg:hidden">
        <SearchOverlay open={searchOpen} openSearch={openSearch} />
        <SearchBox open={searchOpen} openSearch={openSearch} />
      </div>
      <section className="lg:w-[75%]">
        <Slider />
        <div className="min-h-screen space-y-10 section-px">
          <Categories />
          <BestSellers />
          <NewArrivals />
          <PopularSection />
        </div>
        <Footer />
      </section>
      <MobileNav />
    </section>
  );
}
