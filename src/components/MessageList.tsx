
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, User, Sparkles } from "lucide-react";
import { useEffect, useRef } from "react";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  relevanceScore?: number;
}

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  messagesEndRef?: React.RefObject<HTMLDivElement>;
}

const MessageList = ({ messages, isLoading, messagesEndRef }: MessageListProps) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages, isLoading]);

  return (
    <ScrollArea ref={scrollAreaRef} className="flex-1 p-4 sm:p-6 min-h-0">
      <div className="space-y-4 sm:space-y-6">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} items-start gap-2 sm:gap-4 animate-fade-in`}
          >
            {!message.isUser && (
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] flex items-center justify-center flex-shrink-0 shadow-lg">
                <Bot className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
            )}
            
            <div
              className={`max-w-[85%] sm:max-w-[80%] ${
                message.isUser
                  ? 'bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white rounded-l-xl sm:rounded-l-2xl rounded-tr-xl sm:rounded-tr-2xl shadow-lg'
                  : 'bg-[#2a2a2a]/70 text-white rounded-r-xl sm:rounded-r-2xl rounded-tl-xl sm:rounded-tl-2xl border border-gray-600/30 backdrop-blur-sm shadow-lg'
              } p-3 sm:p-4 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]`}
            >
              <p className="text-xs sm:text-sm leading-relaxed mb-2">{message.text}</p>
              
              <div className="flex items-center justify-between">
                <p className="text-xs opacity-70">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
                
                {!message.isUser && message.relevanceScore !== undefined && (
                  <div className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#6366f1]" />
                    <span className="text-xs text-[#6366f1] font-medium">
                      {message.relevanceScore.toFixed(1)}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            {message.isUser && (
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-gray-600 to-gray-700 flex items-center justify-center flex-shrink-0 shadow-lg">
                <User className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
            )}
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start items-start gap-2 sm:gap-4 animate-fade-in">
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] flex items-center justify-center shadow-lg">
              <Bot className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
            </div>
            <div className="bg-[#2a2a2a]/70 border border-gray-600/30 backdrop-blur-sm p-3 sm:p-4 rounded-r-xl sm:rounded-r-2xl rounded-tl-xl sm:rounded-tl-2xl shadow-lg">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#6366f1] rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-[#8b5cf6] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-[#6366f1] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        {/* Invisible div for auto-scrolling */}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
};

export default MessageList;
