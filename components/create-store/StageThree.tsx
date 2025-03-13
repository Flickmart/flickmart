import { ChangeEvent, Dispatch, useRef, useState } from "react";
import Image from "next/image";
import { Camera } from "lucide-react";

const StageThree = ({
  setStage,
  setAvatar,
  avatar,
}: {
  setStage: Dispatch<number>;
  setAvatar: Dispatch<string | null | undefined | ArrayBuffer>;
  avatar: string | null | undefined | ArrayBuffer;
}) => {
  const imagePickerRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const currentFiles = e.target.files;
    if (currentFiles?.length) {
      let src = URL.createObjectURL(currentFiles?.[0]);
      setAvatar(src);
    }
  };
  return (
    <div>
      <h2 className="font-medium text-xl mb-3 md:text-3xl lg:text-[40px]">
        Profile Info
      </h2>
      <label className="text-sm font-light md:text-base" htmlFor="avatar">
        Add a picture that represents you or your brand
      </label>
      <div
        onClick={() => {
          imagePickerRef.current?.click();
        }}
        className="mx-auto size-24 relative mb-[40vh] cursor-pointer mt-10 md:mb-10"
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
          className="absolute invisible"
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
      <button
        onClick={() => {
          setStage(4);
        }}
        className="submit-btn text-white rounded-lg capitalize mb-4"
      >
        next
      </button>
    </div>
  );
};
export default StageThree;
