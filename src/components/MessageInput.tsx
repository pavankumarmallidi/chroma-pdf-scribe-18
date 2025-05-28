
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

interface MessageInputProps {
  inputMessage: string;
  setInputMessage: (message: string) => void;
  onSendMessage: (e: React.FormEvent) => void;
  isLoading: boolean;
}

const MessageInput = ({ inputMessage, setInputMessage, onSendMessage, isLoading }: MessageInputProps) => {
  return (
    <div className="p-4 sm:p-6 border-t border-gray-700/50 flex-shrink-0">
      <form onSubmit={onSendMessage} className="flex gap-2 sm:gap-3">
        <div className="flex-1 relative">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask anything about your PDF..."
            className="bg-[#2a2a2a]/70 border-gray-600/30 text-white placeholder:text-gray-400 focus:border-[#6366f1] focus:ring-[#6366f1]/20 text-sm rounded-lg sm:rounded-xl backdrop-blur-sm transition-all duration-300"
            disabled={isLoading}
          />
        </div>
        <Button
          type="submit"
          disabled={isLoading || !inputMessage.trim()}
          className="bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] hover:from-[#5855eb] hover:to-[#7c3aed] text-white border-0 px-4 sm:px-6 rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
        </Button>
      </form>
      
      <p className="text-center text-xs text-gray-500 mt-2 sm:mt-3">
        AI can make mistakes. Please verify important information.
      </p>
    </div>
  );
};

export default MessageInput;
