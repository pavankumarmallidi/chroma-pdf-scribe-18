
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, User, Sparkles } from "lucide-react";
import { useEffect, useRef, forwardRef } from "react";

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
  onScroll?: () => void;
}

const MessageList = forwardRef<HTMLDivElement, MessageListProps>(
  ({ messages, isLoading, messagesEndRef, onScroll }, ref) => {
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when new messages are added
    useEffect(() => {
      if (scrollAreaRef.current) {
        const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (scrollContainer) {
          scrollContainer.scrollTop = scrollContainer.scrollHeight;
          if (onScroll) {
            scrollContainer.addEventListener('scroll', onScroll);
            return () => scrollContainer.removeEventListener('scroll', onScroll);
          }
        }
      }
    }, [messages, isLoading, onScroll]);

    return (
      <ScrollArea 
        ref={scrollAreaRef} 
        className="flex-1 px-6 py-4 min-h-0 custom-scrollbar"
      >
        <div className="space-y-6 pb-4" ref={ref}>
          {messages.map((message, index) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} items-end gap-3 group animate-[fade-in_0.5s_ease-out]`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {!message.isUser && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-violet-500/25 group-hover:shadow-violet-500/40 transition-all duration-300">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}
              
              <div
                className={`max-w-[85%] ${
                  message.isUser
                    ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-[24px_24px_6px_24px] shadow-lg shadow-violet-600/25'
                    : 'bg-white/10 backdrop-blur-sm text-white rounded-[24px_24px_24px_6px] border border-white/10 shadow-lg shadow-black/10'
                } px-4 py-3 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:shadow-violet-600/30`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                  {message.text}
                </p>
                
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/10">
                  <p className="text-xs opacity-70">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  
                  {!message.isUser && message.relevanceScore !== undefined && (
                    <div className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-violet-400" />
                      <span className="text-xs text-violet-400 font-medium">
                        {message.relevanceScore.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              {message.isUser && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-gray-600 to-gray-700 flex items-center justify-center flex-shrink-0 shadow-lg shadow-gray-600/25 group-hover:shadow-gray-600/40 transition-all duration-300">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start items-end gap-3 animate-[fade-in_0.3s_ease-out]">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/10 px-4 py-3 rounded-[24px_24px_24px_6px] shadow-lg">
                <div className="flex items-center gap-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                  <span className="text-xs text-gray-300 ml-2">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}
          
          {/* Invisible div for auto-scrolling */}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
    );
  }
);

MessageList.displayName = "MessageList";

export default MessageList;
