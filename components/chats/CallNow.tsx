import { Phone } from "lucide-react";
import Image from "next/image";

const CallNow = () => {
  return (
    <div className="py-4 flex items-center justify-between px-4 bg-white shadow-lg">
      <div className="flex items-center gap-5">
        <Image
          className="w-20 h-12 object-cover rounded-lg"
          src="/sofa.png"
          alt="sofa"
          width={262}
          height={350}
        />
        <div>
          <p className="font-light text-[13px]">Chelsea Boots Shoes</p>
          <span className="text-[12px] font-medium">#350,000</span>
        </div>
      </div>
      <button className="bg-flickmart text-white flex py-[6px] px-3 text-xs gap-2 font-semibold">
        <Phone size={15} />
        Call now
      </button>
    </div>
  );
};
export default CallNow;
