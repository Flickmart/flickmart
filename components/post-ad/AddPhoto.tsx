"use client";
import { Plus, X } from "lucide-react";
import React, { useRef, useState } from "react";
import { useOthersStore } from "@/store/useOthersStore";
import Image from "next/image";

export default function AddPhoto() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string>("");
  const [filePath, setFilePath] = useState<string | null>(null);
  const storeImage = useOthersStore((state) => state.storeImage);

  const handleBtnClick = () => {
    if (fileRef.current) {
      fileRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.item(0);
    if (file) {
      setFilePath(URL.createObjectURL(file));
      setFileName(file.name);
      storeImage(file);
    }
  };
  const handleImageRemove = () => {
    setFilePath(null);
    setFileName("");
    storeImage(null);
  };

  return (
    <div className="bg-inherit capitalize py-5 text-xs lg:text-sm space-y-5 lg:space-y-3 text-gray-500">
      <h3 className="text-xl font-medium">add photo</h3>
      <p>The first picture would be the face of your advert</p>
      <div className="flex space-x-5  items-center">
        <div
          onClick={handleBtnClick}
          className="cursor-pointer hover:bg-flickmart/80 bg-flickmart duration-200 rounded-lg w-20 h-14 flex justify-center items-center"
        >
          <button type="button" className="bg-white rounded-full h-6 w-6 ">
            <Plus className="p-1 text-flickmart" />
            <input
              onChange={handleFileChange}
              ref={fileRef}
              type="file"
              hidden
              accept=".jpg, .png"
            />
          </button>
        </div>
        {filePath && fileName ? (
          <div className="relative p-2 rounded-lg w-24 h-24 border border-gray-200">
            <X
              className="absolute right-1 top-1 cursor-pointer p-0.5"
              onClick={handleImageRemove}
            />
            <Image
              src={filePath}
              alt={fileName}
              width={300}
              height={300}
              className="h-full w-full object-cover"
            />
          </div>
        ) : null}
      </div>
      {fileName && <p className="text-black ">Uploaded: {fileName}</p>}
      <p>Supported formats are * .jpg and *.png</p>
    </div>
  );
}
