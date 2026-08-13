import { Camera, Paperclip, Send, X } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { Spinner } from '@/components/Spinner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const MAX_TEXTAREA_HEIGHT = 128;

type ChatInputProps = {
  input: string;
  setInput: (input: string) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  selectedImages?: File[];
  setSelectedImages?: React.Dispatch<React.SetStateAction<File[]>>;
  isUploading?: boolean;
  extraIcons?: boolean;
};

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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
  }, []);

  // Auto-grow the textarea as the user types multiple lines, capped so it
  // never pushes the send button off-screen (overflow scrolls internally
  // past that cap). Keyed off `input` rather than just the change handler
  // so it also shrinks back down when the parent clears the field after
  // sending.
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) {
      return;
    }
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, MAX_TEXTAREA_HEIGHT)}px`;
  }, [input]);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter sends the message, like every mainstream chat app; Shift+Enter
    // (or Enter on mobile, where there's no shift key to combo with) drops
    // to a new line via the textarea's own default behavior.
    if (e.key === 'Enter' && !e.shiftKey && !isMobile) {
      e.preventDefault();
      e.currentTarget.form?.requestSubmit();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && setSelectedImages) {
      const newImages = Array.from(files);
      setSelectedImages((prev) => [...prev, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    if (!setSelectedImages) {
      return;
    }
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed right-0 bottom-0 left-0 z-10 border-t bg-background md:left-[360px] md:mb-0">
      {isUploading && (
        <div className="flex items-center justify-center bg-orange-50 p-2">
          <Spinner className="mr-2" size="sm" />
          <span className="text-orange-500 text-sm">Uploading images...</span>
        </div>
      )}
      {selectedImages && selectedImages.length > 0 && (
        <div className="flex gap-2 overflow-x-auto p-2">
          {selectedImages?.map((image, index) => (
            <div className="relative" key={index}>
              <div className="relative h-20 w-20">
                <Image
                  alt={`Selected image ${index + 1}`}
                  className="rounded-md object-cover"
                  fill
                  src={URL.createObjectURL(image)}
                />
              </div>
              <button
                className="-top-2 -right-2 absolute rounded-full"
                onClick={() => removeImage(index)}
              >
                <X className="h-3 w-3 text-white" />
              </button>
            </div>
          ))}
        </div>
      )}
      <form className="flex items-center space-x-2 p-3" onSubmit={handleSubmit}>
        {extraIcons && (
          <>
            <label className="cursor-pointer" htmlFor="open-camera">
              <Camera className="h-6 w-6 text-flickmart" />
            </label>
            <input
              accept="image/*"
              capture={isMobile ? 'environment' : undefined}
              className="hidden"
              id="open-camera"
              onChange={handleFileChange}
              type="file"
            />
            <Input
              accept="image/*"
              className="hidden"
              id="file-upload"
              multiple
              onChange={handleFileChange}
              type="file"
            />
            <label className="cursor-pointer" htmlFor="file-upload">
              <Paperclip className="h-6 w-6 text-flickmart" />
            </label>
          </>
        )}
        <Textarea
          className="max-h-32 min-h-0 flex-1 resize-none py-2 leading-normal"
          disabled={isUploading}
          enterKeyHint="send"
          onChange={handleTextareaChange}
          onKeyDown={handleKeyDown}
          placeholder="Type a message"
          ref={textareaRef}
          rows={1}
          value={input}
        />
        <Button
          className="bg-orange-500 hover:bg-orange-600"
          disabled={
            (!input.trim() && selectedImages?.length === 0) || isUploading
          }
          size="icon"
          type="submit"
        >
          <Send className="h-5 w-5" />
        </Button>
      </form>
    </div>
  );
}
