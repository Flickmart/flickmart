'use client';
import emailjs from '@emailjs/browser';
import { ChevronRight, Mail, MapPinned } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';

export default function Contact() {
  const form = useRef<HTMLFormElement | null>(null);
  const isMobile = useIsMobile();
  const [loading, setLoading] = useState(false);

  const sendEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.current) {
      return;
    }

    setLoading(true);

    try {
      await emailjs.sendForm(
        'service_mohe9sr',
        'template_sk6vvs4',
        form.current,
        { publicKey: 'nHB5uJpaUsmzbJIJX' }
      );

      toast.success('Message sent successfully!');
      form.current.reset(); // cleanup the form
    } catch (error) {
      console.error('FAILED...', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="w-full text-center">
      <div className="mx-auto my-6 w-11/12">
        <h1 className="mb-3 font-extrabold text-3xl text-gray-800 lg:text-5xl">
          Contact Us
        </h1>
        <p className="leading-relaxed">
          Have questions? Your shopping experience matters to us.Whether it’s
          about a product, a seller, or your account, we are here to help here
          at Flickmart.
        </p>
      </div>
      <section className="mb-12 flex w-full flex-col gap-6 md:mx-auto md:w-11/12 md:flex-row">
        <form
          className="mx-auto mt-6 w-11/12 flex-col justify-center gap-7 rounded-md border border-gray-300 p-4 md:mx-0 md:mt-0 md:w-6/12 lg:flex"
          onSubmit={sendEmail}
          ref={form}
        >
          <div className="mb-4 text-left">
            <h1 className="mb-2 font-bold text-3xl lg:text-6xl">
              <span className="text-flickmart">Get</span> in touch
            </h1>
            <p className="leading-tight md:mt-4">
              Prefer not to chat? You can also reach us directly by filling out
              the form below
            </p>
          </div>
          <div>
            <input
              className="w-full rounded-md border border-gray-300 p-2 py-3 lg:h-14"
              id="name"
              name="name"
              placeholder="Fullname"
              required
              type="text"
            />
          </div>
          <div className="mt-4">
            <input
              className="w-full rounded-md border border-gray-300 p-2 py-3 lg:h-14"
              id="email"
              name="email"
              placeholder="Email"
              required
              type="email"
            />
          </div>
          <div className="mt-4">
            <textarea
              className="w-full rounded-md border border-gray-300 p-2 py-3 leading-tight"
              id="message"
              name="message"
              placeholder="Your message..."
              required
              rows={isMobile ? 5 : 10}
            />
          </div>
          <button
            className="mt-4 w-full rounded-md bg-flickmart px-4 py-4 text-white transition-all duration-300 hover:scale-105 disabled:opacity-50 lg:h-14"
            disabled={loading}
            type="submit"
          >
            {loading ? 'Sending...' : 'Send Message'}
          </button>
        </form>

        <div className="w-full md:w-6/12 md:rounded-md md:border">
          <div className="mx-auto my-4 h-32 w-full md:mt-0 md:h-44 md:rounded-t-md">
            <Image
              alt="Contact Us"
              className="h-full w-full object-cover md:rounded-t-md"
              height={1000}
              src="/ct-banner.jpg"
              width={1000}
            />
          </div>
          <div className="w-full bg-flickmart-chat-orange py-4 text-center text-white">
            <h1 className="font-bold text-2xl">For further inquiries</h1>
          </div>
          <div className="flex w-full flex-col">
            <div className="mx-auto my-4 grid w-11/12 grid-cols-2 gap-4">
              <div className="rounded-lg border p-3 shadow-sm">
                <div className="mx-auto mb-2 h-12 w-12">
                  <Image
                    alt="WhatsApp Icon"
                    className="object-contain"
                    height={50}
                    src="/whatsapp.png"
                    width={50}
                  />
                </div>
                <h1 className="mb-2 font-semibold text-sm">
                  Still Have Questions?
                </h1>
                <p className="text-[10px] leading-tight md:text-xs">
                  we are here to help - quick and easy. Start a Whatsapp chat
                  with us and get instant support.{' '}
                </p>
                <Link
                  className="mt-4 inline-block w-full rounded-md bg-flickmart-chat-orange px-4 py-3 font-medium text-sm text-white"
                  href={
                    'https://chat.whatsapp.com/ENMHsidxkfgBCyckFkKluD?mode=ems_copy_c'
                  }
                  target="_blank"
                >
                  Chat With Us
                </Link>
              </div>
              <div className="rounded-lg border p-3 shadow-sm">
                <div className="mx-auto mb-2 h-11 w-11">
                  <Image
                    alt="Call Icon"
                    className="object-contain"
                    height={50}
                    src="/call.png"
                    width={50}
                  />
                </div>
                <h1 className="mb-2 font-semibold text-sm">Prefer to Talk?</h1>
                <p className="text-[10px] leading-tight md:text-xs">
                  Give us a quick call. Our support team is happy to assist you
                  with any questions you have.{' '}
                </p>
                <Link
                  className="mt-5 inline-block w-full rounded-md bg-flickmart-chat-orange px-4 py-3 font-medium text-sm text-white"
                  href={'tel:phonenumber'}
                  target="_blank"
                >
                  Give Us a Call
                </Link>
              </div>
            </div>
            <div className="mx-auto mb-8 flex w-11/12 flex-col gap-4">
              <Link
                className="group flex w-full items-center justify-between rounded-lg border p-3"
                href={'mailto:Flickmart2024@gmail.com'}
                target="_blank"
              >
                <div className="mb-2 flex items-center gap-4">
                  <Mail className="h-8 w-8" />
                  <span className="text-left leading-tight tracking-tight">
                    <h1 className="font-semibold text-lg">E-mail Address</h1>
                    <p className="text-gray-500 text-sm leading-tight">
                      Flickmart2024@gmail.com
                    </p>
                  </span>
                </div>
                <ChevronRight className="transition-transform duration-500 group-hover:translate-x-1" />
              </Link>
              <Link
                className="group flex w-full items-center justify-between rounded-lg border p-3"
                href={'#'}
                target="_blank"
              >
                <div className="mb-2 flex items-center gap-4">
                  <MapPinned className="h-8 w-8" />
                  <span className="text-left leading-tight tracking-tight">
                    <h1 className="font-semibold text-lg">Office Address</h1>
                    <p className="text-gray-500 text-sm leading-tight">
                      Customer service center Address
                    </p>
                  </span>
                </div>
                <ChevronRight className="transition-transform duration-500 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
