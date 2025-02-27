import { Dispatch } from "react";
import {
  ChevronLeft,
  Search,
  MessageSquareText,
  Phone,
  Share,
  Bookmark,
  Ban,
  OctagonAlert,
} from "lucide-react";
import { Profile } from "@/app/chats/page";
import { notFound } from "next/navigation";
import Image from "next/image";
import {
  Carousel,
  CarouselItem,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { poppins } from "@/app/fonts";

const ProfileTab = ({
  currentProfile,
  setCurrentProfile,
}: {
  currentProfile: Profile | undefined;
  setCurrentProfile: Dispatch<null | string>;
}) => {
  if (!currentProfile) {
    notFound();
  }
  const { avatar, name, desc, products } = currentProfile;
  return (
    <section className="md:h-full md:overflow-scroll">
      <header className="py-4 shadow-lg">
        <div className="items-center gap bg-flickmart-chat-gray mx-4 pl-2 pr-4 rounded-2xl border border-flickmart-chat-gray focus-within:border-flickmart transition-all duration-300 gap-3 grid grid-cols-[20px_1fr_20px]">
          <button
            onClick={() => {
              setCurrentProfile(null);
            }}
            className="text-flickmart-gray transition-all duration-300 hover:text-flickmart"
          >
            <ChevronLeft size={30} />
          </button>
          <input
            type="text"
            className="outline-none py-3 text-sm bg-transparent peer"
            placeholder="What are you looking for?"
          />
          <button className="hover:bg-black/5 duration-500 py-2 rounded-md flex justify-center items-center text-flickmart-gray peer-focus:text-flickmart">
            <Search className="h-5 w-5" />
          </button>
        </div>
      </header>
      <section className="pt-5 text-center">
        <Image
          src={avatar}
          alt={name}
          width={88}
          height={47}
          className="w-20 mx-auto mb-3"
        />
        <h2 className={poppins.className}>{name}</h2>
        <span className="text-flickmart text-[13px]">Online</span>
        <p className="text-[13px] px-[15%] mt-3">{desc}</p>
      </section>
      <section className="bg-[#EDEDED] mt-9 py-9">
        <div className="flex gap-11 justify-center mb-9">
          <button
            type="button"
            className="bg-flickmart text-white text-xs w-16 py-[6px] rounded-lg flex flex-col items-center gap-[5px] shadow-[0_2px_4px_#00000035]"
          >
            <MessageSquareText />
            Message
          </button>
          <button
            type="button"
            className="bg-flickmart text-white text-xs w-16 py-[6px] rounded-lg flex flex-col items-center gap-[5px] shadow-[0_2px_4px_#00000035]"
          >
            <Phone />
            Call
          </button>
          <button
            type="button"
            className="bg-flickmart text-white text-xs w-16 py-[6px] rounded-lg flex flex-col items-center gap-[5px] shadow-[0_2px_4px_#00000035]"
          >
            <Share />
            Share
          </button>
        </div>
        <section className="grid grid-cols-2 px-8 gap-3 sm:grid-cols-3 md:block md:w-[90%] md:mx-auto">
          {products.map((_, index) => (
            <div
              key={index}
              className="flex flex-col justify-between min-h-72 rounded-md border border-gray-200 relative shadow-lg md:hidden"
            >
              <span className="absolute bg-white uppercase px-3 py-1 top-4 lg:top-5 lg:left-5 left-3 lg:text-base text-sm font-bold text-black rounded-sm">
                hot
              </span>
              <span className=" p-1  bg-white absolute top-4 lg:top-5 lg:right-5 right-3 rounded-full">
                <Bookmark className="fill-gray-500     " />
              </span>
              <Image
                src="/jacket.png"
                alt="jacket"
                width={500}
                height={500}
                className="flex-grow p-0.5 rounded-md"
              />
              <div className="flex flex-col p-3 space-y-2 text-left text-gray-800 font-semibold">
                <span className="lg:text-base text-sm">
                  Freestyle Crew Racer leather jacket
                </span>
                <span className="text-flickmart lg:text-sm text-xs">
                  $149.99
                </span>
              </div>
            </div>
          ))}
          <Carousel className="hidden md:block">
            <CarouselContent>
              {products.map((_, index) => (
                <CarouselItem key={index} className="basis-1/2 lg:basis-1/3 xl:basis-1/4">
                  <div className="flex flex-col justify-between min-h-72 rounded-md border border-gray-200 relative shadow-lg">
                    <span className="absolute bg-white uppercase px-3 py-1 top-4 lg:top-5 lg:left-5 left-3 lg:text-base text-sm font-bold text-black rounded-sm">
                      hot
                    </span>
                    <span className=" p-1  bg-white absolute top-4 lg:top-5 lg:right-5 right-3 rounded-full">
                      <Bookmark className="fill-gray-500     " />
                    </span>
                    <Image
                      src="/jacket.png"
                      alt="jacket"
                      width={500}
                      height={500}
                      className="flex-grow p-0.5 rounded-md"
                    />
                    <div className="flex flex-col p-3 space-y-2 text-left text-gray-800 font-semibold">
                      <span className="lg:text-base text-sm">
                        Freestyle Crew Racer leather jacket
                      </span>
                      <span className="text-flickmart lg:text-sm text-xs">
                        $149.99
                      </span>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </section>
        <button
          type="button"
          className="bg-white px-2 py-1 mt-5 mx-auto block border-2 border-black/30 text-black/60 rounded-lg hover:text-flickmart hover:border-flickmart transition-all duration-300 md:hidden"
        >
          See more
        </button>
      </section>
      <section className="bg-[#EDEDED] mt-4 px-8 pt-8 pb-12">
        <button
          type="button"
          className="text-red-600 flex items-center gap-4 mb-7"
        >
          <Ban />
          Block {name}
        </button>
        <button type="button" className="text-red-600 flex items-center gap-4">
          <OctagonAlert />
          Report {name}
        </button>
      </section>
    </section>
  );
};
export default ProfileTab;
