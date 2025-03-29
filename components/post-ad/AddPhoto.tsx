"use client";
import { Plus, X } from "lucide-react";
import React, { useRef, useState } from "react";
import { useOthersStore } from "@/store/useOthersStore";
import Image from "next/image";

export default function AddPhoto() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<Array<string>>([]);
  const [filePath, setFilePath] = useState<Array<string | null>>([]);
  const storeImage = useOthersStore((state) => state.storeImage);
  const [error, setError] = useState<string>("")

  const handleBtnClick = () => {
    if (fileRef.current) {
      fileRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.files)
    const files = e.target.files;
    if (!files || files.length < 2 || files.length > 5) {
      setError("*Images must not be less than two or greater than five")
    }else{
      setError("")
      const imageFilesArr = Array.from(files)
      imageFilesArr.map( file => {
        setFilePath(prev=> [...prev, URL.createObjectURL(file)]);
        setFileName(prev => [...prev, file.name]);
        storeImage(file);
      })
    
    }
  };
  const handleImageRemove = (index: number) => {
     const newFilePath = filePath.filter((_ , i) => i !== index )
     const newFileName = fileName.filter((_, i)=> i !== index)

    setFilePath(newFilePath);
    setFileName(newFileName);
    storeImage(null);
  };

  return (
    <div className="bg-inherit capitalize py-5 text-xs lg:text-sm space-y-5 lg:space-y-3 text-gray-500">
      <h3 className="text-xl font-medium">add photo</h3>
      <p>The first picture would be the face of your advert</p>
      <div className="flex space-x-3 overflow-x-auto flex-wrap  items-center">
        <div
          onClick={handleBtnClick}
          className="cursor-pointer hover:bg-flickmart/80 bg-flickmart duration-200 rounded-lg w-20 h-14 flex justify-center items-center"
        >
          <button type="button" className="bg-white rounded-full h-6 w-6 ">
            <Plus className="p-1 text-flickmart" />
            <input
              multiple
              onChange={handleFileChange}
              ref={fileRef}
              type="file"
              hidden
              accept=".jpg, .png"
            />
          </button>
        </div>
        {filePath && fileName ? 
        Array.from({length: filePath.length}).map((_, index)=>{
          return(
            <div key={index} className="relative p-2 rounded-lg w-24 h-24 border border-gray-200">
              <X
                className="absolute right-1 top-1 cursor-pointer p-0.5"
                onClick={()=>handleImageRemove(index)}
              />
              <Image
                id={index.toString()}
                src={filePath[index] || ''}
                alt={fileName[index]}
                width={300}
                height={300}
                className="h-full w-full object-cover"
              />
            </div>
          ) 
        }) : null}
      </div>
      {fileName && <p className="text-black ">{fileName.length? `Uploaded: ${fileName.map(item=> `${item}, `)}`: null}</p>}
      <p>Supported formats are * .jpg and *.png</p>
      <p className="text-red-500 font-medium text-xs normal-case">{error}</p>
    </div>
  );
}
