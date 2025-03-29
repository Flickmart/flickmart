import { ChangeEvent, Dispatch, useRef, useState } from "react";
import Image from "next/image";
import { Camera, Loader2 } from "lucide-react";
import { useUploadThing } from "@/utils/uploadthing";
import { toast } from "sonner";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const StageThree = ({ setStage }: { setStage: Dispatch<1 | 2 | 3 | 4> }) => {
  const imagePickerRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const userStore = useQuery(api.store.getStoresByUserId);
  const mutate = useMutation(api.store.updateStore);

  const { startUpload } = useUploadThing("imageUploader");

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);

      // Upload to UploadThing
      const res = await startUpload([file]);

      if (res && res.length > 0 && userStore && userStore[0]) {
        // Update with the actual uploaded URL

        toast.success("Image uploaded successfully");
        await mutate({
          id: userStore[0]._id!,
          image: res[0].ufsUrl,
        });
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to upload image"
      );
    } finally {
      setIsUploading(false);
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
          className="mx-auto size-24 relative cursor-pointer mt-10 md:mb-10"
        >
          <input
            ref={imagePickerRef}
            onChange={handleImageUpload}
            type="file"
            id="avatar"
            name="avatar"
            accept="image/png, image/jpeg"
            className="absolute invisible w-0"
            disabled={isUploading}
          />
          {userStore && userStore[0] && userStore[0].image ? (
            <Image
              src={userStore[0].image}
              className="w-full h-full object-cover inline-block rounded-full hover:outline hover:outline-2 hover:outline-offset-2"
              height={60}
              width={60}
              alt="default profile"
            />
          ) : (
            <Avatar>
              <AvatarImage src="/default-profile.png" alt="default profile" />
              <AvatarFallback>
                {userStore && userStore[0] && userStore[0].name
                  ? userStore[0].name.charAt(0)
                  : "U"}
              </AvatarFallback>
            </Avatar>
          )}
          {isUploading && (
            <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center">
              <div className="text-white text-xs">Uploading...</div>
            </div>
          )}
          <span className="inline-block bg-flickmart p-1 rounded-full absolute bottom-0 right-0">
            <Camera color="white" size={15} />
          </span>
        </div>
        {userStore && userStore[0] && userStore[0].image && (
          <button
            onClick={() => {
              mutate({
                id: userStore[0]._id!,
                image: undefined,
              });
            }}
            type="button"
            className="mt-4 text-sm text-flickmart font-semibold hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isUploading}
          >
            Remove Avatar
          </button>
        )}
      </div>

      <button
        onClick={() => {
          setStage(4);
        }}
        className="submit-btn flex items-center justify-center text-white rounded-lg capitalize mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isUploading}
      >
        next{" "}
        {isUploading && <Loader2 className="animate-spin ml-2" size={20} />}
      </button>
    </form>
  );
};
export default StageThree;
