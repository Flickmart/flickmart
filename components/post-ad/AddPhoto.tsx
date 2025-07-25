"use client";
import { Plus, Upload, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useOthersStore } from "@/store/useOthersStore";
import Image from "next/image";
import { toast } from "sonner";
import { MoonLoader } from "react-spinners";
import imageCompression from "browser-image-compression";
import { useUpload } from "@/hooks/useUpload";

export default function AddPhoto({
  isSubmitted,
  setIsSubmitted,
  clear,
  setClear,
}: {
  isSubmitted: boolean;
  setIsSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
  clear: boolean;
  setClear: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<Array<string>>([]);
  const [filePath, setFilePath] = useState<Array<string | null>>([]);
  const storeImage = useOthersStore((state) => state.storeImage);
  const [error, setError] = useState<string>("");
  const [imageFilesArr, setImageFilesArr] = useState<Array<File>>([]);
  const { startUpload, isUploading, isError, setIsError } = useUpload();

  const handleBtnClick = () => {
    if (fileRef.current && !isUploading) {
      setFilePath([]);
      setFileName([]);
      fileRef.current.click();
    }
  };

  useEffect(
    function () {
      if (isSubmitted || clear) {
        setFilePath([]);
        setFileName([]);
        storeImage([]);
        clear && setClear(false);
        isSubmitted && setIsSubmitted(false);
        return;
      }
      let toastId: ReturnType<typeof toast.loading>;
      if (isUploading) {
        toastId = toast.loading("Uploading Images...");
      }
      return () => {
        if (toastId) {
          toast.dismiss(toastId);
        }
      };
    },
    [isUploading, isSubmitted, clear]
  );

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };

    if (!files || files.length < 2 || files.length > 5) {
      setError("*Images must not be less than two or greater than five");
    } else {
      setError("");

      try {
        const imageFiles = Array.from(files);
        setImageFilesArr(imageFiles);

        const compressedPromises = imageFiles.map(async (file) => {
          const compressedFile = await imageCompression(file, options);
          setFilePath((prev) => [...prev, URL.createObjectURL(file)]);
          setFileName((prev) => [...prev, file.name]);
          return compressedFile;
        });

        const compressedFiles = await Promise.all(compressedPromises);
        setImageFilesArr(compressedFiles);

        const uploadedImg = await startUpload(compressedFiles);
        const images = uploadedImg?.map((item) => item.ufsUrl);
        if (images) {
          storeImage(images);
        }
      } catch (err) {
        toast.error(err as string);
      }
    }
  };
  const handleImageRemove = (index: number) => {
    const newFilePath = filePath.filter((_, i) => i !== index);
    const newFileName = fileName.filter((_, i) => i !== index);

    setFilePath(newFilePath);
    setFileName(newFileName);
    storeImage([]);
  };

  return (
    <div className="bg-inherit capitalize py-5 text-xs lg:text-sm space-y-5 lg:space-y-3 text-gray-500">
      <h3 className="text-xl font-medium">add photo</h3>
      <p>The first picture would be the face of your advert</p>
      <div className="flex space-x-3 overflow-x-auto flex-wrap  items-center">
        <div
          onClick={handleBtnClick}
          className={`cursor-pointer ${isUploading ? "bg-flickmart/20" : "bg-flickmart hover:bg-flickmart/80"}   duration-200 rounded-lg w-20 h-14 flex justify-center items-center`}
        >
          <button
            disabled={isUploading}
            type="button"
            className="bg-white rounded-full h-6 w-6 "
          >
            <Plus
              className={`p-1 ${isUploading ? "text-flickmart/20" : "text-flickmart"}`}
            />
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
        {filePath && fileName
          ? Array.from({ length: filePath.length }).map((_, index) => {
              return (
                <div
                  key={index}
                  className="relative p-2 rounded-lg w-24 h-24 border border-gray-200"
                >
                  {isUploading ? (
                    <div className="absolute inset-0 flex justify-center items-center ">
                      <X
                        className="absolute right-1 top-1 cursor-pointer p-0.5"
                        onClick={() => handleImageRemove(index)}
                      />
                      <MoonLoader size={35} />
                    </div>
                  ) : (
                    <>
                      <X
                        className="absolute z-20 right-1 top-1 cursor-pointer p-0.5"
                        onClick={() => handleImageRemove(index)}
                      />
                      {!isError ? (
                        <Image
                          id={index.toString()}
                          src={filePath[index] || ""}
                          alt={fileName[index]}
                          width={300}
                          height={300}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex justify-center items-center ">
                          <Upload
                            className="cursor-pointer"
                            size={35}
                            onClick={async () => {
                              const uploadedImg =
                                await startUpload(imageFilesArr);
                              if (
                                uploadedImg?.length === imageFilesArr.length
                              ) {
                                setIsError(false);
                              }
                            }}
                          />
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })
          : null}
      </div>
      {fileName && (
        <p className="text-black ">
          {fileName.length
            ? `Uploaded: ${fileName.map((item) => ` ${item}`)}`
            : null}
        </p>
      )}
      <div className="space-y-1 font-medium text-sm">
        <p>Supported formats are * .jpg and *.png</p>
        <p className="normal-case">Max image size allowed is 2MB</p>
      </div>
      <p className="text-red-500 font-medium text-xs normal-case">{error}</p>
    </div>
  );
}
