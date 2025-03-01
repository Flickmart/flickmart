import { Search } from "lucide-react";

const SearchBar = () => {
  return (
    <div className="items-center gap bg-flickmart-chat-gray mx-4 mt-5 px-4 rounded-2xl border border-flickmart-chat-gray focus-within:border-flickmart transition-all duration-300 gap-3 grid grid-cols-[20px_1fr]">
      <input
        type="text"
        className="outline-none py-3 text-sm bg-transparent peer order-2"
        placeholder="Search"
      />
      <button className="hover:bg-black/5 duration-500 py-2 rounded-md flex justify-center items-center text-flickmart-gray peer-focus:text-flickmart">
        <Search className="h-5 w-5" />
      </button>
    </div>
  );
};
export default SearchBar;
