import React from "react";
import Logo from "./multipage/Logo";
import { Button } from "./ui/button";

interface Props {
  handleInstallClick: () => void;
}

export default function AddToMobileChrome(props: Props) {
  const {  handleInstallClick } = props;


  return (
    <div
      className="relative mx-2 my-4 flex h-28 w-full items-center justify-between rounded-xl bg-white px-6 lg:w-2/4"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      className="bg-white flex justify-between px-6 items-center h-24 my-4 mx-2 rounded-xl w-full lg:w-2/4 relative"
    >
      {/* <div
        onClick={closePrompt}
        className="border-none hover:border  rounded-lg hover:border-flickmart absolute right-3 top-3 "
      >
        <X />
      </div> */}
      <div className="flex items-center">
        <Logo />
      </div>
      <Button
        className="lg:!p-6 mt-1 font-semibold text-sm capitalize lg:text-base"
        onClick={handleInstallClick}
      >
        install app
      </Button>
    </div>
  );
}
