import { Paperclip, Mic, Sticker, Send } from "lucide-react";
import { FormEvent, useState } from "react";

const SendMessage = ({
  setChat,
}: {
  setChat: React.Dispatch<
    React.SetStateAction<
      {
        message: string;
        type: string;
      }[]
    >
  >;
}) => {
  const [inpChange, setInpChange] = useState<string | null>(null);
  const user = JSON.parse(localStorage.getItem("user")!);
  const name = (user?.user_metadata.name as string).split(" ").join("");

  function handleSendMessage(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const target = e.target as HTMLFormElement;
    const chat = target[0] as HTMLTextAreaElement;

    const messageObj = {
      message: chat.value,
      type: "sent",
    };

    setChat((prev: Array<{ message: string; type: string }>) => [
      ...prev,
      messageObj,
    ]);

    setInpChange(null);
  }
  return (
    <section className=" w-full py-5 flex gap-3 px-2 justify-around bg-white shadow-[0_-4px_8px_#00000010] fixed bottom-0 md:absolute">
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
      <button
        type="button"
        className="transition-colors duration-300 hover:text-flickmart text-black/65"
      >
        <Mic />
      </button>
      <form
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleSendMessage(e);
          }
        }}
        onSubmit={handleSendMessage}
        className="flex justify-between pr-3 lg:px-5 flex-grow gap-3"
      >
        <textarea
          value={typeof inpChange === "string" ? inpChange : ""}
          onChange={(e) => setInpChange(e.target.value)}
          placeholder="Message..."
          className="border flex-grow  border-black/60 rounded-2xl pl-3 pt-3   font-light text-sm focus:outline-flickmart/50 transition-colors duration-300 min-h-10"
          name="message"
          id="message"
        ></textarea>
        <button
          type="submit"
          className="transition-colors duration-300 hover:text-flickmart text-black/65"
        >
          <Send />
        </button>
      </form>
    </section>
  );
};
export default SendMessage;
