import { useState, useEffect } from "react";
import { Send, Paperclip, Camera, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Spinner } from "@/components/Spinner";

interface ChatInputProps {
  input: string;
  setInput: (input: string) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  selectedImages?: File[];
  setSelectedImages?: React.Dispatch<React.SetStateAction<File[]>>;
  isUploading?: boolean;
  extraIcons?: boolean;
}

export default function ChatInput({
  input,
  setInput,
  handleSubmit,
  selectedImages,
  setSelectedImages,
  isUploading,
  extraIcons = true,
}: ChatInputProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && setSelectedImages) {
      const newImages = Array.from(files);
      setSelectedImages((prev) => [...prev, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    if (!setSelectedImages) return;
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed bottom-0 md:left-[320px] left-0 right-0 bg-background border-t z-10 md:mb-0">
      {isUploading && (
        <div className="flex justify-center items-center p-2 bg-orange-50">
          <Spinner size="sm" className="mr-2" />
          <span className="text-sm text-orange-500">Uploading images...</span>
        </div>
      )}
      {selectedImages && selectedImages.length > 0 && (
        <div className="flex gap-2 p-2 overflow-x-auto">
          {selectedImages?.map((image, index) => (
            <div key={index} className="relative">
              <div className="w-20 h-20 relative">
                <Image
                  src={URL.createObjectURL(image)}
                  alt={`Selected image ${index + 1}`}
                  fill
                  className="object-cover rounded-md"
                />
              </div>
              <button
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 hover:bg-red-600"
              >
                <X className="w-3 h-3 text-white" />
              </button>
            </div>
          ))}
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex items-center space-x-2 p-3">
        {extraIcons && (
          <>
            <label htmlFor="open-camera" className="cursor-pointer">
              <Camera className="h-6 w-6 text-flickmart" />
            </label>
            <input
              type="file"
              id="open-camera"
              className="hidden"
              accept="image/*"
              capture={isMobile ? "environment" : undefined}
              onChange={handleFileChange}
            />
            <Input
              type="file"
              className="hidden"
              id="file-upload"
              accept="image/*"
              multiple
              onChange={handleFileChange}
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <Paperclip className="text-flickmart w-6 h-6" />
            </label>
          </>
        )}
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message"
          className="flex-1"
          disabled={isUploading}
        />
        <Button
          type="submit"
          size="icon"
          disabled={
            (!input.trim() && selectedImages?.length === 0) || isUploading
          }
          className="bg-orange-500 hover:bg-orange-600"
        >
          <Send className="h-5 w-5" />
        </Button>
      </form>
    </div>
  );
}
