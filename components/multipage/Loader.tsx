"use client";
import React from "react";
import { SyncLoader } from "react-spinners";

export default function Loader() {
  return (
    <div className="backdrop-blur-md h-[80vh]  flex justify-center items-center">
      <SyncLoader color="#FF8100" />
    </div>
  );
}
