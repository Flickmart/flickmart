"use client";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronUp, Mail, Facebook, Twitter, Instagram } from "lucide-react";

export default function Footer() {
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
    "/chat",
    "/business",
  ];

  if (hiddenPages.includes(pathname)) {
    return null; // Don't render any component
  }

  return (
    <>
      <section className="section-px mb-10">
        <Image
          src={"/footer-image.png"}
          alt="wave"
          width={1010}
          height={390}
          className="w-full"
        />
      </section>
      <footer className="bg-black relative text-white rounded-t-[25px] section-px py-5 xl:pt-10 ">
        <section className="xl:flex xl:justify-between">
          <div>
            <div className="flex justify-between items-center mb-3">
              <Image
                src="/icons/logo-dark.svg"
                alt="Logo"
                width={150}
                height={50}
                className="object-contain w-56 lg:w-64"
              />
              <a
                href="#top"
                className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition xl:absolute xl:top-5 xl:right-5"
              >
                <ChevronUp className="text-white" />
              </a>
            </div>

            <p className="text-center text-gray-300 mb-5 italic">
              "One flick, endless choices."
            </p>
          </div>

          {/* Main Footer Grid */}
          <div className="grid text-center gap-6 border-t border-white/20 pt-5 grid-cols-1 sm:flex sm:justify-between  sm:text-left sm:gap-0 xl:w-[65%] xl:border-0">
            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
              <ul className="space-y-1 text-gray-400">
                <li>
                  <Link href="/" className="hover:text-white">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/post-ad" className="hover:text-white">
                    Sell
                  </Link>
                </li>
                <li>
                  <Link href="/settings/personal" className="hover:text-white">
                    Profile
                  </Link>
                </li>
                <li>
                  <Link href="/chats" className="hover:text-white">
                    Chats
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Email</h3>
              <p className="flex items-center gap-2 text-gray-400 justify-center sm:justify-start">
                <Mail className="w-5 h-5 text-white flex-shrink-0" />
                <a
                  href="mailto:flickmart2024@gmail.com"
                  className="hover:text-white"
                >
                  flickmart2024@gmail.com
                </a>
              </p>
            </div>

            {/* Social Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
              <div className="flex gap-4 justify-center items-center sm:justify-start">
                <a
                  href="https://web.facebook.com/profile.php?id=61580235660893"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-[#FF8100] rounded-[8px] hover:bg-white/20 transition"
                >
                  <Image
                    src={"/social-icons/facebook-white.png"}
                    alt="Facebook"
                    width={2084}
                    height={2084}
                    className="size-[22px]"
                  />
                </a>
                <a
                  href="https://x.com/flickmartoffici"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-[#FF8100] rounded-[8px] hover:bg-white/20 transition"
                >
                  <Image
                    src={"/social-icons/instagram-white.png"}
                    alt="Instagram"
                    width={4332}
                    height={4320}
                    className="size-[22px]"
                  />
                </a>
                <a
                  href="https://www.instagram.com/flickmartofficial/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-[#FF8100] rounded-[8px] hover:bg-white/20 transition"
                >
                  <Image
                    src={"/social-icons/x-white.png"}
                    alt="x/twitter"
                    width={2400}
                    height={2453}
                    className="size-[22px]"
                  />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom Note */}
        <div className="mt-5 border-t border-white/20 pt-5 text-center sm:flex sm:items-center sm:justify-between sm:flex-row-reverse">
          <ul className="text-white flex items-center justify-center gap-3 mb-3 text-sm font-bold sm:mb-0 sm:gap-6">
            <li>
              <Link
                href="/privacy-policy"
                className="hover:text-flickmart transition-colors"
              >
                Privacy Policy
              </Link>
            </li>
            <li className="h-[20px] border-l-[1.5px] border-white/50 sm:hidden"></li>
            <li>
              <Link
                href="/terms-of-service"
                className="hover:text-flickmart transition-colors"
              >
                Terms of Service
              </Link>
            </li>
          </ul>
          <p className="text-sm text-gray-500 sm:text-white">
            © {new Date().getFullYear()} FlickMart. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}
