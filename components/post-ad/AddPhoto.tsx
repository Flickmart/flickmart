"use client";
import imageCompression from "browser-image-compression";
import { Plus, Upload, X } from "lucide-react";
import Image from "next/image";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { MoonLoader } from "react-spinners";
import { toast } from "sonner";
import { useUpload } from "@/hooks/useUpload";
import { useOthersStore } from "@/store/useOthersStore";
import { deleteUploadThing } from "@/app/action/delete-uploadthing";

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
  const imagesKey = useOthersStore((state) => state.images);
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

  useEffect(() => {
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
  }, [isUploading, isSubmitted, clear]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };

    if (
      !files ||
      files.length + imagesKey.length < 2 ||
      files.length + imagesKey.length > 5
    ) {
      setError("*You must add between 2 and 5 images.");
    } else {
      setError("");

      try {
        // Convert FileList to File array
        const imageFiles = Array.from(files);
        setImageFilesArr((prev) => [...prev, ...imageFiles]);

        // Compress files
        const compressedPromises = imageFiles.map(async (file) => {
          const compressedFile = await imageCompression(file, options);
          setFilePath((prev) => [...prev, URL.createObjectURL(file)]);
          setFileName((prev) => [...prev, file.name]);
          return compressedFile;
        });

        const compressedFiles = await Promise.all(compressedPromises);

        setImageFilesArr((prev) => [...prev, ...compressedFiles]);

        const uploadedImg = await startUpload(compressedFiles);
        const images = [
          ...imagesKey,
          ...(uploadedImg?.map((item) => item.ufsUrl) || []),
        ];

        if (images.length > 5) {
          toast.error("Image length exceeded, You can only upload 5 images");
          return;
        }
        if (images) {
          storeImage(images);
        }
      } catch (err) {
        toast.error(err as string);
      }
    }
  };
  const handleImageRemove = async (index: number) => {
    const newFilePath = filePath.filter((_, i) => i !== index);
    const newFileName = fileName.filter((_, i) => i !== index);
    const loadingId = toast.loading("Deleting Image...");

    const u = new URL(imagesKey[index]);
    const key = u.pathname.split("/").pop()!; // e.g. "abc123_image.jpg"
    const response = await deleteUploadThing(key);
    if (response.ok) {
      toast.dismiss(loadingId);
      toast.success("Image deleted successfully");
    }

    setFilePath(newFilePath);
    setFileName(newFileName);
    storeImage([...imagesKey.filter((_, i) => i !== index)]);
  };

  return (
    <div className="space-y-5 bg-inherit py-5 text-gray-500 text-xs capitalize lg:space-y-3 lg:text-sm">
      <h3 className="font-medium text-xl">add photo</h3>
      <p>The first picture would be the face of your advert</p>
      <div className="flex flex-wrap items-center space-x-3 overflow-x-auto">
        <div
          className={`cursor-pointer ${isUploading ? "bg-flickmart/20" : "bg-flickmart hover:bg-flickmart/80"} flex h-14 w-20 items-center justify-center rounded-lg duration-200`}
          onClick={handleBtnClick}
        >
          <button
            className="h-6 w-6 rounded-full bg-white"
            disabled={isUploading}
            type="button"
          >
            <Plus
              className={`p-1 ${isUploading ? "text-flickmart/20" : "text-flickmart"}`}
            />
            <input
              accept=".jpg, .png"
              hidden
              multiple
              onChange={handleFileChange}
              ref={fileRef}
              type="file"
            />
          </button>
        </div>
        {imagesKey.length
          ? Array.from({ length: imagesKey.length }).map((_, index) => {
              return (
                <div
                  className="relative h-24 w-24 rounded-lg border border-gray-200 p-2"
                  key={index}
                >
                  {isUploading ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <X
                        className="absolute top-1 right-1 cursor-pointer p-0.5"
                        onClick={() => handleImageRemove(index)}
                      />
                      <MoonLoader size={35} />
                    </div>
                  ) : (
                    <>
                      <X
                        className="absolute top-1 transition-all duration-300 hover:text-white hover:bg-orange-400 rounded-full right-1 z-20 cursor-pointer p-0.5"
                        onClick={() => handleImageRemove(index)}
                      />
                      {isError ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Upload
                            className="cursor-pointer"
                            onClick={async () => {
                              const uploadedImg =
                                await startUpload(imageFilesArr);

                              if (
                                uploadedImg?.length === imageFilesArr.length
                              ) {
                                setIsError(false);
                              }
                            }}
                            size={35}
                          />
                        </div>
                      ) : (
                        <Image
                          alt={fileName[index] || imagesKey[index]}
                          className="h-full w-full object-cover"
                          height={300}
                          id={index.toString()}
                          src={imagesKey[index]}
                          width={300}
                        />
                      )}
                    </>
                  )}
                </div>
              );
            })
          : null}
      </div>
      {fileName && (
        <p className="text-black">
          {fileName.length
            ? `Uploaded: ${fileName.map((item) => ` ${item}`)}`
            : null}
        </p>
      )}
      <div className="space-y-1 font-medium text-sm">
        <p>Supported formats are * .jpg and *.png</p>
        <p className="normal-case">Max image size allowed is 2MB</p>
      </div>
      <p className="font-medium text-red-500 text-xs normal-case">{error}</p>
    </div>
  );
}
