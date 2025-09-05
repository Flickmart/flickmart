import React, { useEffect, useRef, useState } from "react";
import Logo from "./multipage/Logo";
import { Button } from "./ui/button";

interface Props {
  closePrompt: () => void;
  doNotShowAgain: () => void;
  handleInstallClick: () => void;
}

export default function AddToMobileChrome(props: Props) {
  const { closePrompt, doNotShowAgain, handleInstallClick } = props;

  const installRef = useRef<HTMLButtonElement | null>(null);

  return (
    <div
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      className="bg-white flex justify-between px-6 items-center h-28 m-4 rounded-xl w-full lg:w-2/4 relative"
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
        onClick={handleInstallClick}
        className="capitalize !p-6 mt-1 text-base font-semibold"
      >
        install flickmart
      </Button>
    </div>
  );
}
