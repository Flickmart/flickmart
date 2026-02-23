import { useState } from "react";
import { toast } from "sonner";
import { useUploadThing } from "@/utils/uploadthing";

export function useUpload() {
  const [isError, setIsError] = useState<boolean>(false);

  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onClientUploadComplete: () => {
      toast.success("Images Uploaded");
    },
    onUploadError: (err) => {
      setIsError(true);
      console.log(err);
      toast.error("Upload Error");
    },
  });

  return { startUpload, isUploading, isError, setIsError };
}
