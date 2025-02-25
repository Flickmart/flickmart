"use client";
import { Plus } from "lucide-react";
import React, { useRef, useState } from "react";
import { FormType } from "./InputField";

export default function AddPhoto({ form }: { form: FormType }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | undefined>("");

  const handleBtnClick = () => {
    if (fileRef.current) {
      fileRef.current.click();
    }
  };

  const handleFileChange = (fileName: string | undefined) => {
    setFileName(fileName);
  };

  return (
    <div className="bg-inherit capitalize py-5 text-xs lg:text-sm space-y-5 lg:space-y-3 text-gray-500">
      <h3 className="text-xl font-medium">add photo</h3>
      <p>The first picture would be the face of your advert</p>
      <div
        onClick={handleBtnClick}
        className="cursor-pointer hover:bg-flickmart/80 bg-flickmart duration-200 rounded-lg w-20 h-14 flex justify-center items-center"
      >
        <button className="bg-white rounded-full h-6 w-6 ">
          <Plus className="p-1 text-flickmart" />
          <input
            onChange={(e) => {
              const file = e.target.files?.item(0);
              if (file) {
                form.setValue("image", file);
                handleFileChange(file?.name);
              }
            }}
            ref={fileRef}
            type="file"
            hidden
            accept=".jpg, .png"
          />
        </button>
      </div>
      {fileName && <p className="text-black ">Uploaded: {fileName}</p>}
      <p>Supported formats are * .jpg and *.png</p>
    </div>
  );
}
