import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ChatInputProps {
  input: string;
  setInput: (input: string) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function ChatInput({ input, setInput, handleSubmit }: ChatInputProps) {
  return (
    <div className="p-3 md:p-4 bg-background border-t sticky bottom-0 w-full z-10">
      <form onSubmit={handleSubmit} className="flex items-center space-x-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message"
          className="flex-1"
        />
        <Button
          type="submit"
          size="icon"
          disabled={!input.trim()}
          className="bg-orange-500 hover:bg-orange-600"
        >
          <Send className="h-5 w-5" />
        </Button>
      </form>
    </div>
  );
} 