'use client';
import { ChevronUp, Mail } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Footer() {
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

  return (
    <>
      <section className="section-px my-10">
        <Image
          alt="wave"
          className="w-full"
          height={390}
          src={'/footer-image.png'}
          width={1010}
        />
      </section>
      <footer className="section-px relative rounded-t-[25px] bg-black py-5 text-white xl:pt-10">
        <section className="xl:flex xl:justify-between">
          <div>
            <div className="mb-3 flex items-center justify-between">
              <Image
                alt="Logo"
                className="w-56 object-contain lg:w-64"
                height={50}
                src="/icons/logo-dark.svg"
                width={150}
              />
              <a
                className="rounded-full bg-white/10 p-3 transition hover:bg-white/20 xl:absolute xl:top-5 xl:right-5"
                href="#top"
              >
                <ChevronUp className="text-white" />
              </a>
            </div>

            <p className="mb-5 text-center text-gray-300 italic">
              "One flick, endless choices."
            </p>
          </div>

          {/* Main Footer Grid */}
          <div className="grid grid-cols-1 gap-6 border-white/20 border-t pt-5 text-center sm:flex sm:justify-between sm:gap-0 sm:text-left xl:w-[65%] xl:border-0">
            {/* Quick Links */}
            <div>
              <h3 className="mb-3 font-semibold text-lg">Quick Links</h3>
              <ul className="space-y-1 text-gray-400">
                <li>
                  <Link className="hover:text-white" href="/">
                    Home
                  </Link>
                </li>
                <li>
                  <Link className="hover:text-white" href="/post-ad">
                    Sell
                  </Link>
                </li>
                <li>
                  <Link className="hover:text-white" href="/settings/personal">
                    Profile
                  </Link>
                </li>
                <li>
                  <Link className="hover:text-white" href="/chats">
                    Chats
                  </Link>
                </li>
                <li>
                  <Link className="hover:text-white" href="/contact">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-3 font-semibold text-lg">Email</h3>
              <p className="flex items-center justify-center gap-2 text-gray-400 sm:justify-start">
                <Mail className="h-5 w-5 flex-shrink-0 text-white" />
                <a
                  className="hover:text-white"
                  href="mailto:flickmart2024@gmail.com"
                >
                  flickmart2024@gmail.com
                </a>
              </p>
            </div>

            {/* Social Links */}
            <div>
              <h3 className="mb-4 font-semibold text-lg">Follow Us</h3>
              <div className="flex items-center justify-center gap-4 sm:justify-start">
                <a
                  className="rounded-[8px] bg-[#FF8100] p-3 transition hover:bg-white/20"
                  href="https://web.facebook.com/profile.php?id=61580235660893"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <Image
                    alt="Facebook"
                    className="size-[22px]"
                    height={2084}
                    src={'/social-icons/facebook-white.png'}
                    width={2084}
                  />
                </a>
                <a
                  className="rounded-[8px] bg-[#FF8100] p-3 transition hover:bg-white/20"
                  href="https://x.com/flickmartoffici"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <Image
                    alt="Instagram"
                    className="size-[22px]"
                    height={4320}
                    src={'/social-icons/instagram-white.png'}
                    width={4332}
                  />
                </a>
                <a
                  className="rounded-[8px] bg-[#FF8100] p-3 transition hover:bg-white/20"
                  href="https://www.instagram.com/flickmartofficial/"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <Image
                    alt="x/twitter"
                    className="size-[22px]"
                    height={2453}
                    src={'/social-icons/x-white.png'}
                    width={2400}
                  />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom Note */}
        <div className="mt-5 border-white/20 border-t pt-5 text-center sm:flex sm:flex-row-reverse sm:items-center sm:justify-between">
          <ul className="mb-3 flex items-center justify-center gap-3 font-bold text-sm text-white sm:mb-0 sm:gap-6">
            <li>
              <Link
                className="transition-colors hover:text-flickmart"
                href="/privacy-policy"
              >
                Privacy Policy
              </Link>
            </li>
            <li className="h-[20px] border-white/50 border-l-[1.5px] sm:hidden" />
            <li>
              <Link
                className="transition-colors hover:text-flickmart"
                href="/terms-of-service"
              >
                Terms of Service
              </Link>
            </li>
          </ul>
          <p className="text-gray-500 text-sm sm:text-white">
            © {new Date().getFullYear()} FlickMart. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}
