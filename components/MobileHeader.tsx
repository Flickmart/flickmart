"use client";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

const MobileHeader = ({
  children,
  title,
}: {
  title: string;
  children?: ReactNode;
}) => {
  const router = useRouter();

  return (
    <header className="shadow-lg sticky top-0 h-[77px] flex items-center z-50 bg-white pl-2 pr-5 justify-between text-sm sm:hidden">
      <button
        onClick={() => router.back()}
        className="flex items-center transition-colors text-flickmart-gray hover:text-flickmart duration-300 text-sm"
      >
        <ChevronLeft size={30} strokeWidth={1.5} />
        {title}
      </button>
      {children}
    </header>
  );
};
export default MobileHeader;
