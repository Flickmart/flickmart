import React from "react";
import { ClimbingBoxLoader } from "react-spinners";

export default function loading() {
  return (
    <div className="bg-black/50 flex justify-center items-center z-50 fixed  inset-0">
      <ClimbingBoxLoader color="#f81"/>
    </div>
  );
}
