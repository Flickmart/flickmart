import { Plus } from "lucide-react";
import React, { useRef } from "react";

export default function AddPhoto() {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleBtnClick = () => {
    if (fileRef.current) {
      fileRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e);
  };

  return (
    <div className="bg-inherit capitalize py-5 text-xs lg:text-sm space-y-5 lg:space-y-3 text-gray-500">
      <h3 className="text-xl font-medium">add photo</h3>
      <p>The first picture would be the face of your advert</p>
      <div className="bg-flickmart/80 rounded-lg w-20 h-14 flex justify-center items-center">
        <button
          className="bg-white rounded-full h-6 w-6 "
          onClick={handleBtnClick}
        >
          <Plus className="p-1 text-flickmart" />
          <input
            ref={fileRef}
            type="file"
            hidden
            accept=".jpg, .png"
            onChange={handleFileChange}
          />
        </button>
      </div>
      <p>Supported formats are * .jpg and *.png</p>
    </div>
  );
}
