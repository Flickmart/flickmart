import { ChevronLeft } from "lucide-react";

const LoginHeader = () => {
  return (
    <header className="shadow-lg py-7 px-2">
      <button className="flex font-light items-center transition-colors text-flickmart-gray hover:text-flickmart duration-300">
        <ChevronLeft size={35} strokeWidth={1.5} />
        Back
      </button>
    </header>   
  );
};
export default LoginHeader;
