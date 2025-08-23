'use client';
import { ChevronDown } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';

export default function Footer() {
  const [isExpanded, setIsExpanded] = useState(false);
  const pathname = usePathname();

  // Pages where Footer should not be shown
  const hiddenPages = [
    '/sign-in',
    '/sign-up',
    '/forgot-password',
    '/notifications',
    '/settings',
    'post-ad',
    '/create-store',
    '/saved',
    '/chat',
    '/business',
  ];

  if (hiddenPages.includes(pathname)) {
    return null; // Don't render any component
  }

  const toggleExpanded = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <Accordion collapsible type="single">
      <footer className="w-full bg-black font-light text-sm text-white">
        <div className="mx-auto flex w-10/12 flex-col py-6 lg:py-12">
          <AccordionItem value="footer">
            <article className="flex flex-col justify-between lg:flex-row">
              <article className="mb-8 w-full lg:w-6/12">
                <AccordionTrigger className="flex items-center hover:no-underline [&>svg]:xl:hidden">
                  <Link className="flex items-center gap-2" href={'/'}>
                    <Image
                      alt=""
                      className="h-12 w-12"
                      height={500}
                      src="/flickmart-logo.svg"
                      width={500}
                    />
                    <h1 className="font-bold text-2xl">
                      Flick<span className="text-flickmart">Mart</span>
                    </h1>
                  </Link>
                </AccordionTrigger>
                <p className="mb-3 lg:mt-6">What you order is what you get.</p>
              </article>
              <AccordionContent>
                <article className="mb-3 flex w-full flex-col justify-between lg:mb-9 lg:hidden lg:w-6/12 lg:flex-row">
                  <div className="flex w-full items-start border-t py-6 lg:w-3/6 lg:border-none">
                    <div className="flex flex-col gap-5">
                      <h1 className="mb-2 text-lg">Info</h1>
                      <Link className="" href="#">
                        Shipping Policy
                      </Link>
                      <Link className="" href="#">
                        Return & Refund
                      </Link>
                      <Link className="" href="#">
                        Support
                      </Link>
                      <Link className="" href="#">
                        FAQs
                      </Link>
                    </div>
                  </div>
                  <div className="flex w-full items-start border-t pt-6 lg:w-3/6 lg:border-none">
                    <div className="flex flex-col gap-5">
                      <h1 className="mb-2 text-lg">Office</h1>
                      <span className="">University of Nigeria, Nsukka,</span>
                      <span className="">Enugu state,</span>
                      <span className="">Nigeria.</span>
                      <Link className="" href="mailto:support@flickmart.app">
                        support@flickmart.app
                      </Link>
                    </div>
                  </div>
                  <div className="mt-5 border-t pt-5">
                    <h1 className="text-lg">Connect with us</h1>
                    <div className="mt-2 flex gap-3">
                      <Link
                        className="group"
                        href={
                          'https://www.instagram.com/flickmartofficial?igsh=cDQwaWk3cHVkdndl'
                        }
                        target="_blank"
                      >
                        <Image
                          alt="Instagram"
                          className="h-6 w-6 transition-all duration-500 group-hover:scale-105"
                          height={30}
                          src="/ig.png"
                          width={30}
                        />
                      </Link>
                      <Link className="group" href={'#'} target="_blank">
                        <Image
                          alt="Facebook"
                          className="h-6 w-6 transition-all duration-500 group-hover:scale-105"
                          height={26}
                          src="/x.png"
                          width={26}
                        />
                      </Link>
                      <Link className="group" href={'#'} target="_blank">
                        <Image
                          alt="Facebook"
                          className="h-6 w-6 transition-all duration-500 group-hover:scale-105"
                          height={30}
                          src="/wa.png"
                          width={30}
                        />
                      </Link>
                    </div>
                  </div>
                </article>
              </AccordionContent>
            </article>
          </AccordionItem>

          <div className="flex flex-col justify-center gap-4">
            <div className="hidden pt-5 xl:block">
              <h1 className="text-lg">Connect with us</h1>
              <div className="mt-2 flex gap-3">
                <Link
                  className="group"
                  href={
                    'https://www.instagram.com/flickmartofficial?igsh=cDQwaWk3cHVkdndl'
                  }
                  target="_blank"
                >
                  <Image
                    alt="Instagram"
                    className="h-6 w-6 transition-all duration-500 group-hover:scale-105"
                    height={30}
                    src="/ig.png"
                    width={30}
                  />
                </Link>
                <Link className="group" href={'#'} target="_blank">
                  <Image
                    alt="Facebook"
                    className="h-6 w-6 transition-all duration-500 group-hover:scale-105"
                    height={26}
                    src="/x.png"
                    width={26}
                  />
                </Link>
                <Link className="group" href={'#'} target="_blank">
                  <Image
                    alt="Facebook"
                    className="h-6 w-6 transition-all duration-500 group-hover:scale-105"
                    height={30}
                    src="/wa.png"
                    width={30}
                  />
                </Link>
              </div>
            </div>
            <article className="mt-3 mb-2 flex w-full flex-col-reverse items-center gap-3 pt-9 text-[12px] lg:mb-0 lg:flex-row">
              <span>
                Copyright &copy; {new Date().getFullYear()} FlickMart. All
                rights reserved
              </span>
              <span className="hidden lg:block">|</span>
              <span className="flex items-center gap-3">
                <Link className="" href="/privacy-policy">
                  Privacy Policy
                </Link>
                <Link className="" href="/terms-of-service">
                  Terms & Conditions
                </Link>
              </span>
              <div className="flex gap-5 justify-self-end">
                <Image
                  alt="visa"
                  className="size-7 object-cover"
                  height={500}
                  src="/visa.png"
                  width={500}
                />
                <Image
                  alt="master"
                  className="size-7 object-cover"
                  height={500}
                  src="/master.png"
                  width={500}
                />
              </div>
            </article>
          </div>
        </div>
      </footer>
    </Accordion>
  );
}
