import { useMutation, useQuery } from 'convex/react';
import { Camera, Loader2 } from 'lucide-react';
import { type ChangeEvent, type Dispatch, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { api } from 'backend/convex/_generated/api';
import { useUploadThing } from '@/utils/uploadthing';

const StageThree = ({ setStage }: { setStage: Dispatch<1 | 2 | 3 | 4> }) => {
  const imagePickerRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const userStore = useQuery(api.store.getStoresByUserId);
  const mutate = useMutation(api.store.addImage);

  const { startUpload } = useUploadThing('imageUploader');

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    try {
      setIsUploading(true);

      // Upload to UploadThing
      const res = await startUpload([file]);

      if (res && res.length > 0 && userStore && userStore.data) {
        // Update with the actual uploaded URL

        toast.success('Image uploaded successfully');
        await mutate({
          storeId: userStore.data._id!,
          image: res[0].ufsUrl,
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to upload image'
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form>
      <div className="mb-[40vh] md:mb-10">
        <h2 className="mb-3 font-medium text-xl sm:text-3xl lg:text-[40px]">
          Profile Info
        </h2>
        <label className="font-light text-sm md:text-base" htmlFor="avatar">
          Add a picture that represents you or your brand
        </label>
        <div
          className="relative mx-auto mt-10 size-24 cursor-pointer md:mb-10"
          onClick={() => {
            imagePickerRef.current?.click();
          }}
        >
          <input
            accept="image/png, image/jpeg"
            className="invisible absolute w-0"
            disabled={isUploading}
            id="avatar"
            name="avatar"
            onChange={handleImageUpload}
            ref={imagePickerRef}
            type="file"
          />
          <Avatar className="h-full w-full">
            <AvatarImage
              alt="default profile"
              className="inline-block h-full w-full rounded-full object-cover hover:outline hover:outline-2 hover:outline-offset-2"
              height={60}
              src={userStore?.data?.image}
              width={60}
            />
            <AvatarFallback className="bg-[#38CB89] font-medium text-5xl text-white uppercase">
              {userStore?.data?.name ? userStore?.data?.name.charAt(0) : 'U'}
            </AvatarFallback>
          </Avatar>
          {isUploading && (
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/30">
              <div className="text-white text-xs">Uploading...</div>
            </div>
          )}
          <span className="absolute right-0 bottom-0 inline-block rounded-full bg-flickmart p-1">
            <Camera color="white" size={15} />
          </span>
        </div>
        {userStore?.data?.image && (
          <button
            className="mt-4 font-semibold text-flickmart text-sm hover:underline disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isUploading}
            onClick={() => {
              mutate({
                storeId: userStore?.data._id!,
                image: '',
              });
              toast.success('Image removed successfully');
            }}
            type="button"
          >
            Remove Avatar
          </button>
        )}
      </div>

      <button
        className="submit-btn mb-4 flex items-center justify-center rounded-lg text-white capitalize disabled:cursor-not-allowed disabled:opacity-50"
        disabled={isUploading}
        onClick={() => {
          setStage(4);
        }}
      >
        next{' '}
        {isUploading && <Loader2 className="ml-2 animate-spin" size={20} />}
      </button>
    </form>
  );
};
export default StageThree;
