import { Paperclip, Mic, Sticker } from "lucide-react";

const SendMessage = () => {
  return (
    <section className=" w-full grid grid-cols-[30px_30px_1fr_30px] gap-1 sm:gap-2 md:gap-1 px-2 justify-between py-3 bg-white shadow-[0_-4px_8px_#00000010] fixed bottom-0 md:absolute">
      <button
        type="button"
        className="transition-colors duration-300 hover:text-flickmart text-black/65"
      >
        <Sticker size={26} />
      </button>
      <button
        type="button"
        className="transition-colors duration-300 hover:text-flickmart text-black/65"
      >
        <Paperclip />
      </button>
      <label className="absolute left-[-9999px]" htmlFor="message">
        message
      </label>
      <textarea
        placeholder="Message..."
        className="border border-black/60 rounded-full pl-3 py-1 font-light text-sm focus:outline-flickmart transition-colors duration-300 h-8"
        name="message"
        id="message"
      ></textarea>
      <button
        type="button"
        className="transition-colors duration-300 hover:text-flickmart text-black/65"
      >
        <Mic />
      </button>
    </section>
  );
};
export default SendMessage;
