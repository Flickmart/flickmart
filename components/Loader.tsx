"use client";

import { useOthersStore } from "@/store/useOthersStore";
import React from "react";
import { MoonLoader } from "react-spinners";

export default function Loader({ open }: { open?: boolean }) {
  const loading = useOthersStore((state) => state.loading);
  return (
    (loading || open) && (
      <div className="bg-black/50 flex justify-center items-center z-50 fixed  inset-0">
        <MoonLoader />
      </div>
    )
  );
}
