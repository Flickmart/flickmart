"use client";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Footer() {
  const [isExpanded, setIsExpanded] = useState(false);
  const pathname = usePathname();

  // Pages where Footer should not be shown
  const hiddenPages = [
    "/sign-in",
    "/sign-up",
    "/forgot-password",
    "/notifications",
    "/settings",
    "post-ad",
    "/create-store",
    "/saved",
    "/chats",
    "/business",
  ];

  if (hiddenPages.includes(pathname)) {
    return null; // Don't render any component
  }

  const toggleExpanded = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <footer className="w-full bg-black text-white text-sm font-light">
      <div className="w-10/12 mx-auto flex flex-col py-6 lg:py-12">
        <article className="flex flex-col lg:flex-row justify-between">
          <article className="w-full lg:w-6/12 mb-8">
            <div className="lg:hidden flex justify-between items-center">
              <Link href={"/"} className="flex gap-1 items-center">
                <Image
                  src="/flickmart-logo.svg"
                  width={500}
                  height={500}
                  className="h-12 w-12"
                  alt=""
                />
                <h1 className="font-bold text-2xl mt-2">
                  Flick<span className="text-flickmart">Mart</span>
                </h1>
              </Link>
              <button onClick={toggleExpanded}>
                <ChevronDown />
              </button>
            </div>
            <div className="hidden lg:flex gap-1 items-center">
              <Image
                src="/flickmart-logo.svg"
                width={500}
                height={500}
                className="h-12 w-12"
                alt=""
              />
              <h1 className="font-bold text-2xl mt-2">
                Flick<span className="text-flickmart">Mart</span>
              </h1>
            </div>
            <p className="mt-7 lg:mt-6 mb-3">What you order is what you get.</p>
          </article>
          {isExpanded && (
            <article className="lg:hidden w-full lg:w-6/12 flex flex-col lg:flex-row justify-between mb-9">
              <div className="w-full lg:w-3/6 flex items-start border-t lg:border-none py-6">
                <div className="flex flex-col gap-5">
                  <h1 className="text-lg mb-2">Info</h1>
                  <Link href="#" className="">
                    Shipping Policy
                  </Link>
                  <Link href="#" className="">
                    Return & Refund
                  </Link>
                  <Link href="#" className="">
                    Support
                  </Link>
                  <Link href="#" className="">
                    FAQs
                  </Link>
                </div>
              </div>
              <div className="w-full lg:w-3/6 flex items-start border-t lg:border-none pt-6">
                <div className="flex flex-col gap-5">
                  <h1 className="text-lg mb-2">Office</h1>
                  <Link href="#" className="">
                    43111 Hai Trieu street,
                  </Link>
                  <Link href="#" className="">
                    District 1, HCMC
                  </Link>
                  <Link href="#" className="">
                    Vietnam
                  </Link>
                  <Link href="#" className="">
                    84-756-3237
                  </Link>
                </div>
              </div>
            </article>
          )}
          <article className="hidden w-full lg:w-6/12 lg:flex flex-col lg:flex-row justify-between mb-9">
            <div className="w-full lg:w-3/6 flex items-start border-t lg:border-none py-6">
              <div className="flex flex-col gap-5">
                <h1 className="text-lg mb-2">Info</h1>
                <Link href="#" className="">
                  Shipping Policy
                </Link>
                <Link href="#" className="">
                  Return & Refund
                </Link>
                <Link href="#" className="">
                  Support
                </Link>
                <Link href="#" className="">
                  FAQs
                </Link>
              </div>
            </div>
            <div className="w-full lg:w-3/6 flex items-start border-t lg:border-none pt-6">
              <div className="flex flex-col gap-5">
                <h1 className="text-lg mb-2">Office</h1>
                <Link href="#" className="">
                  43111 Hai Trieu street,
                </Link>
                <Link href="#" className="">
                  District 1, HCMC
                </Link>
                <Link href="#" className="">
                  Vietnam
                </Link>
                <Link href="#" className="">
                  84-756-3237
                </Link>
              </div>
            </div>
          </article>
        </article>

        <article className="mt-3 w-full flex flex-col-reverse lg:flex-row gap-3 text-[12px] items-center border-[#6C7275] border-t pt-9 mb-2 lg:mb-0">
          <span>Copyright &copy; {new Date().getFullYear()} FlickMart. All rights reserved</span>
          <span className="hidden lg:block">|</span>
          <span className="flex items-center gap-3 ">
            <Link href="#" className="">
              Privacy Policy
            </Link>
            <Link href="#" className="">
              Terms & Conditions
            </Link>
          </span>
          <div className=" flex gap-5 justify-self-end">
            <Image
              src="/visa.png"
              alt="visa"
              className=" size-7 object-cover"
              width={500}
              height={500}
            />
            <Image
              src="/master.png"
              alt="master"
              className=" size-7 object-cover"
              width={500}
              height={500}
            />
            <Image
              src="/visa.png"
              alt="visa"
              className=" size-7 object-cover"
              width={500}
              height={500}
            />
          </div>
        </article>
      </div>
    </footer>
  );
}
