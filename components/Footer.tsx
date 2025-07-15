"use client";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

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
    <Accordion type="single" collapsible>
      <footer className="w-full bg-black text-white text-sm font-light">
        <div className="w-10/12 mx-auto flex flex-col py-6 lg:py-12">
          <AccordionItem value="footer">
            <article className="flex flex-col lg:flex-row justify-between">
              <article className="w-full  lg:w-6/12 mb-8">
                <AccordionTrigger className="hover:no-underline flex items-center ">
                  <Link href={"/"} className="flex gap-2  items-center">
                    <Image
                      src="/flickmart-logo.svg"
                      width={500}
                      height={500}
                      className="h-12 w-12"
                      alt=""
                    />
                    <h1 className="font-bold text-2xl">
                      Flick<span className="text-flickmart">Mart</span>
                    </h1>
                  </Link>
                </AccordionTrigger>
                <p className=" lg:mt-6 mb-3">What you order is what you get.</p>
              </article>
              <AccordionContent>
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
                      <span className="">University of Nigeria, Nsukka,</span>
                      <span className="">Enugu state,</span>
                      <span className="">Nigeria.</span>
                      <Link href="mailto:support@flickmart.app" className="">
                        support@flickmart.app
                      </Link>
                    </div>
                  </div>
                </article>
              </AccordionContent>
            </article>
          </AccordionItem>

          <div className="flex flex-col justify-center gap-4">
            <div>
              <h1 className="text-lg">Connect with us</h1>
              <div className="flex gap-3 mt-2">
                <Link
                  href={
                    "https://www.instagram.com/flickmartofficial?igsh=cDQwaWk3cHVkdndl"
                  }
                  target="_blank"
                  className="group"
                >
                  <Image
                    src="/ig.png"
                    alt="Instagram"
                    className="h-6 w-6 group-hover:scale-105 transition-all duration-500"
                    width={30}
                    height={30}
                  />
                </Link>
                <Link href={"#"} target="_blank" className="group">
                  <Image
                    src="/x.png"
                    alt="Facebook"
                    className="h-6 w-6 group-hover:scale-105 transition-all duration-500"
                    width={26}
                    height={26}
                  />
                </Link>
                <Link href={"#"} target="_blank" className="group">
                  <Image
                    src="/wa.png"
                    alt="Facebook"
                    className="h-6 w-6 group-hover:scale-105 transition-all duration-500"
                    width={30}
                    height={30}
                  />
                </Link>
              </div>
            </div>
            <article className="mt-3 w-full flex flex-col-reverse lg:flex-row gap-3 text-[12px] items-center  border-t pt-9 mb-2 lg:mb-0">
              <span>
                Copyright &copy; {new Date().getFullYear()} FlickMart. All
                rights reserved
              </span>
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
              </div>
            </article>
          </div>
        </div>
      </footer>
    </Accordion>
  );
}
