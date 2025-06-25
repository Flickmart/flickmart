import { ChevronRight, Mail, MapPinned } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Contact() {
    
    return (
        <main className="w-full text-center">
            <div className="w-11/12 mx-auto my-6">
                <h1 className='text-3xl font-bold mb-3'>Contact Us</h1>
                <p className="leading-relaxed">Have questions? Your shopping experience matters to us.Whether it’s about a product, a seller, or your account, we are here to help here at Flickmart.</p>
            </div>
            <section className="w-full md:w-11/12 md:mx-auto flex flex-col md:flex-row gap-6 mb-12">
                
                <form className="w-11/12 md:w-6/12 mx-auto md:mx-0 mt-6 md:mt-0 rounded-md p-4 border border-gray-300">
                    <div className="mb-4 text-left">
                        <h1 className="text-3xl font-bold mb-2"><span className="text-flickmart">Get</span> in touch</h1>
                        <p className="leading-tight">Prefer not to chat? You can  also reach us directly by filling out the form below</p>
                    </div>
                    <div>
                        <input type="text" id="name" placeholder="Fullname" className="border border-gray-300 rounded-md py-3 p-2 w-full" />
                    </div>
                    <div className="mt-4">
                        <input type="email" id="email" placeholder="Email" className="border border-gray-300 rounded-md py-3 p-2 w-full" />
                    </div>
                    <div className="mt-4">
                        <textarea id="message" className="leading-tight border border-gray-300 rounded-md py-3 p-2 w-full" rows={5} placeholder="Your message..."></textarea>
                    </div>
                    <button type="submit" className="w-full mt-4 bg-flickmart text-white py-4 px-4 rounded-md">Send Message</button>
                </form>
                
                <div className="w-full md:w-6/12 md:border md:rounded-md">
                    <div className="h-32 md:h-44 md:rounded-t-md w-full mx-auto my-4 md:mt-0">
                        <Image src="/ct-banner.jpg" alt="Contact Us" width={1000} height={1000} className="object-cover h-full w-full md:rounded-t-md" />
                    </div>
                    <div className="w-full bg-flickmart-chat-orange text-white py-4 text-center">
                        <h1 className="capitalize text-2xl font-bold">Still need help?</h1>
                    </div>
                    <div className="w-full flex flex-col">
                        <div className="w-11/12 mx-auto grid grid-cols-2 gap-4 my-4">
                            <div className="rounded-lg border shadow-sm p-3">
                                <div className="w-12 h-12 mx-auto mb-2">
                                    <Image src="/whatsapp.png" alt="WhatsApp Icon" width={50} height={50} className="object-contain" />
                                </div>
                                <h1 className="text-sm font-semibold mb-2">Still Have Questions?</h1>
                                <p className="text-[10px] md:text-xs leading-tight">we are  here to help - quick and easy. Start a Whatsapp chat with us and get instant support. </p>
                                <Link href={"https://wa.me/phonenumber"} target="_blank" className="w-full mt-4 inline-block bg-flickmart-chat-orange text-white text-sm font-medium py-3 px-4 rounded-md">Chat With Us</Link>
                            </div>
                            <div className="rounded-lg border shadow-sm p-3">
                                <div className="w-11 h-11 mx-auto mb-2">
                                    <Image src="/call.png" alt="Call Icon" width={50} height={50} className="object-contain" />
                                </div>
                                <h1 className="text-sm font-semibold mb-2">Prefer to Talk?</h1>
                                <p className="text-[10px] md:text-xs leading-tight">Give us a quick call. Our support team is happy to assist you with any questions you have. </p>
                                <Link href={"tel:phonenumber"} target="_blank" className="w-full mt-4 inline-block bg-flickmart-chat-orange text-white text-sm font-medium py-3 px-4 rounded-md">Give Us a Call</Link>
                            </div>
                        </div>
                        <div className="w-11/12 mx-auto flex flex-col gap-4 mb-8">
                            <Link href={'mailto:Flickmart2024@gmail.com'} target="_blank" className="group w-full border rounded-lg p-3 items-center flex justify-between">
                                <div className="flex items-center gap-4 mb-2">
                                    <Mail className="h-8 w-8" />
                                    <span className="text-left leading-tight tracking-tight">
                                        <h1 className="text-lg font-semibold">E-mail Address</h1>
                                        <p className="text-sm leading-tight text-gray-500">Flickmart2024@gmail.com</p>
                                    </span>
                                </div>
                                <ChevronRight className="group-hover:translate-x-1 transition-transform duration-500" />
                            </Link>
                            <Link href={'#'} target="_blank" className="group w-full border rounded-lg p-3 items-center flex justify-between">
                                <div className="flex items-center gap-4 mb-2">
                                    <MapPinned className="h-8 w-8" />
                                    <span className="text-left leading-tight tracking-tight">
                                        <h1 className="text-lg font-semibold">Office Address</h1>
                                        <p className="text-sm leading-tight text-gray-500">Customer service center Address</p>
                                    </span>
                                </div>
                                <ChevronRight className="group-hover:translate-x-1 transition-transform duration-500" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}