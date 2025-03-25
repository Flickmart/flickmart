import { ChangeEvent, Dispatch, useRef, useState } from "react";
import Image from "next/image";
import { Camera } from "lucide-react";

const StageThree = ({
  setStage,
  setAvatar,
  avatar,
}: {
  setStage: Dispatch<1 | 2 | 3 | 4>;
  setAvatar: Dispatch<string | null>;
  avatar: string | null;
}) => {
  const imagePickerRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const currentFiles = e.target.files;
    if (currentFiles?.length) {
      let src = URL.createObjectURL(currentFiles?.[0]);
      setAvatar(src as string);
    }
  };
  return (
    <form>
      <div className="mb-[40vh] md:mb-10">
        <h2 className="font-medium text-xl mb-3 sm:text-3xl lg:text-[40px]">
          Profile Info
        </h2>
        <label className="text-sm font-light md:text-base" htmlFor="avatar">
          Add a picture that represents you or your brand
        </label>
        <div
          onClick={() => {
            imagePickerRef.current?.click();
          }}
          className="mx-auto size-24 relative  cursor-pointer mt-10 md:mb-10"
        >
          <input
            ref={imagePickerRef}
            onChange={(e) => {
              handleImageUpload(e);
            }}
            type="file"
            id="avatar"
            name="avatar"
            accept="image/png, image/jpeg"
            className="absolute invisible w-0"
          />
          <Image
            src={avatar || "/default-profile.png"}
            className="w-full h-full object-cover inline-block rounded-full hover:outline hover:outline-2 hover:outline-offset-2"
            height={60}
            width={60}
            alt="default profile"
          ></Image>
          <span className="inline-block bg-flickmart p-1 rounded-full absolute bottom-0 right-0">
            <Camera color="white" size={15} />
          </span>
        </div>
        {avatar && (
          <button
            onClick={() => {
              setAvatar(null);
            }}
            type="button"
            className="mt-4 text-sm text-flickmart font-semibold hover:underline"
          >
            Remove Avatar
          </button>
        )}
      </div>

      <button
        onClick={() => {
          setStage(4);
        }}
        className="submit-btn text-white rounded-lg capitalize mb-4"
      >
        next
      </button>
    </form>
  );
};
export default StageThree;
