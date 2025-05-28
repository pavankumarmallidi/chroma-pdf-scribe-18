
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Home, FileText, Sparkles, Bot, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { sendChatMessage } from "@/services/chatService";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  relevanceScore?: number;
}

interface PdfAnalysisData {
  summary: string;
  totalPages: number;
  totalWords: number;
  language: string;
}

interface ChatSummaryProps {
  onBackToHome: () => void;
  pdfAnalysisData: PdfAnalysisData;
}

const ChatSummary = ({ onBackToHome, pdfAnalysisData }: ChatSummaryProps) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Welcome! I've successfully analyzed your PDF document. I can answer any questions you have about its content. What would you like to know?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !user?.email) return;

    const messageToSend = inputMessage;
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await sendChatMessage(messageToSend, user.email);
      
      // Only add messages after receiving backend confirmation
      const userMessage: Message = {
        id: Date.now().toString(),
        text: messageToSend,
        isUser: true,
        timestamp: new Date(),
      };

      // Parse the webhook response format
      let botMessageText = "Based on your PDF analysis, I can help you understand the key concepts and details from your document. Could you be more specific about what aspect you'd like me to elaborate on?";
      let relevanceScore: number | undefined;

      if (response && Array.isArray(response) && response.length > 0 && response[0].output) {
        const output = response[0].output;
        if (output.answer) {
          botMessageText = output.answer;
        }
        if (output.relevanceScore !== undefined) {
          relevanceScore = output.relevanceScore;
        }
      }

      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: botMessageText,
        isUser: false,
        timestamp: new Date(),
        relevanceScore: relevanceScore,
      };
      
      // Add both messages only after successful response
      setMessages(prev => [...prev, userMessage, botResponse]);
    } catch (error) {
      console.error("Chat message failed:", error);
      toast({
        title: "Message failed",
        description: "Unable to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] relative overflow-hidden">
      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-white">
              <span className="text-[#1DB954]">
                PDF Analysis Complete
              </span>
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Enhanced Summary Panel */}
            <div className="lg:col-span-1">
              <Card className="bg-[#1e1e1e] border-[#535353] shadow-2xl h-fit">
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-[#1DB954] flex items-center justify-center">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-white">Document Analysis</h2>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-[#2a2a2a] border border-[#535353]">
                      <h3 className="text-[#1DB954] font-semibold mb-2 text-base">Summary</h3>
                      <p className="text-[#b3b3b3] text-sm leading-relaxed">
                        {pdfAnalysisData.summary}
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-lg bg-[#2a2a2a] border border-[#535353]">
                        <p className="text-[#b3b3b3] text-xs mb-1">Pages</p>
                        <p className="text-[#1DB954] font-bold text-lg">{pdfAnalysisData.totalPages}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-[#2a2a2a] border border-[#535353]">
                        <p className="text-[#b3b3b3] text-xs mb-1">Words</p>
                        <p className="text-white font-bold text-lg">{pdfAnalysisData.totalWords.toLocaleString()}</p>
                      </div>
                    </div>
                    
                    <div className="p-3 rounded-lg bg-[#2a2a2a] border border-[#535353]">
                      <p className="text-[#b3b3b3] text-xs mb-1">Language</p>
                      <p className="text-white font-semibold">{pdfAnalysisData.language}</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Enhanced Chat Panel */}
            <div className="lg:col-span-2">
              <Card className="bg-[#1e1e1e] border-[#535353] shadow-2xl h-[600px] flex flex-col">
                <div className="p-6 border-b border-[#535353]">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#1DB954] flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">AI Assistant</h2>
                      <p className="text-sm text-[#b3b3b3]">Ask questions about your document</p>
                    </div>
                  </div>
                </div>

                <ScrollArea className="flex-1 p-6">
                  <div className="space-y-6">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} items-start gap-3`}
                      >
                        {!message.isUser && (
                          <div className="w-8 h-8 rounded-full bg-[#1DB954] flex items-center justify-center flex-shrink-0">
                            <Bot className="w-4 h-4 text-white" />
                          </div>
                        )}
                        
                        <div
                          className={`max-w-[75%] ${
                            message.isUser
                              ? 'bg-[#1DB954] text-white rounded-l-2xl rounded-tr-2xl'
                              : 'bg-[#2a2a2a] text-white rounded-r-2xl rounded-tl-2xl border border-[#535353]'
                          } p-4 shadow-lg`}
                        >
                          <p className="text-base leading-relaxed">{message.text}</p>
                          
                          {/* Display relevance score for bot messages */}
                          {!message.isUser && message.relevanceScore !== undefined && (
                            <div className="flex items-center gap-1 mt-2 pt-2 border-t border-[#535353]">
                              <span className="text-xs text-[#b3b3b3]">
                                🔎 Relevance: {message.relevanceScore.toFixed(1)}
                              </span>
                            </div>
                          )}
                          
                          <p className="text-xs opacity-70 mt-2">
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        
                        {message.isUser && (
                          <div className="w-8 h-8 rounded-full bg-[#535353] flex items-center justify-center flex-shrink-0">
                            <User className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {isLoading && (
                      <div className="flex justify-start items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#1DB954] flex items-center justify-center">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                        <div className="bg-[#2a2a2a] border border-[#535353] p-4 rounded-r-2xl rounded-tl-2xl">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-[#1DB954] rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-[#1DB954] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>

                <div className="p-6 border-t border-[#535353]">
                  <form onSubmit={handleSendMessage} className="flex gap-3">
                    <Input
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder="Ask anything about your PDF..."
                      className="flex-1 bg-[#2a2a2a] border-[#535353] text-white placeholder:text-[#b3b3b3] focus:border-[#1DB954] text-sm"
                      disabled={isLoading}
                    />
                    <Button
                      type="submit"
                      disabled={isLoading || !inputMessage.trim()}
                      className="bg-[#1DB954] hover:bg-[#1ed760] text-white border-0 px-6"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </form>
                </div>
              </Card>
            </div>
          </div>

          {/* Back to Home Button */}
          <div className="fixed bottom-6 right-6">
            <Button
              onClick={onBackToHome}
              className="bg-[#535353] border-[#535353] text-white hover:bg-[#1DB954] shadow-2xl"
            >
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatSummary;
