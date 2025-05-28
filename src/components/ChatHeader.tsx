
import { MessageCircle } from "lucide-react";

const ChatHeader = () => {
  return (
    <div className="p-4 sm:p-6 border-b border-gray-700/50 flex-shrink-0">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] flex items-center justify-center">
          <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-white">AI Assistant</h2>
          <p className="text-gray-400 text-xs sm:text-sm">Ask anything about your document</p>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
