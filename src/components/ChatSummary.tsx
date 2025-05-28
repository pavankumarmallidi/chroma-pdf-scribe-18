
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Home, FileText, Sparkles, Bot, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
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
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    // TODO: Replace with actual Webhook Trigger 2 call
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "Based on your PDF analysis, I can help you understand the key concepts and details from your document. Could you be more specific about what aspect you'd like me to elaborate on?",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botResponse]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Netflix-style background */}
      <div className="absolute inset-0 bg-gradient-to-b from-red-900/20 via-black to-black"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/10 to-blue-900/10"></div>
      
      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-white">
              <span className="bg-gradient-to-r from-red-500 to-purple-500 bg-clip-text text-transparent">
                PDF Analysis Complete
              </span>
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Enhanced Summary Panel */}
            <div className="lg:col-span-1">
              <Card className="bg-gray-900/90 border-gray-700 shadow-2xl backdrop-blur-sm h-fit">
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-red-500 to-purple-500 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-white">Document Analysis</h2>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-gradient-to-r from-red-500/10 to-purple-500/10 border border-red-500/20">
                      <h3 className="text-red-400 font-semibold mb-2">Summary</h3>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {pdfAnalysisData.summary}
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-lg bg-gray-800/50 border border-gray-700">
                        <p className="text-gray-400 text-xs mb-1">Pages</p>
                        <p className="text-red-400 font-bold text-lg">{pdfAnalysisData.totalPages}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-gray-800/50 border border-gray-700">
                        <p className="text-gray-400 text-xs mb-1">Words</p>
                        <p className="text-purple-400 font-bold text-lg">{pdfAnalysisData.totalWords.toLocaleString()}</p>
                      </div>
                    </div>
                    
                    <div className="p-3 rounded-lg bg-gray-800/50 border border-gray-700">
                      <p className="text-gray-400 text-xs mb-1">Language</p>
                      <p className="text-blue-400 font-semibold">{pdfAnalysisData.language}</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Enhanced Chat Panel */}
            <div className="lg:col-span-2">
              <Card className="bg-gray-900/90 border-gray-700 shadow-2xl backdrop-blur-sm h-[600px] flex flex-col">
                <div className="p-6 border-b border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-red-500 to-purple-500 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">AI Assistant</h2>
                      <p className="text-sm text-gray-400">Ask questions about your document</p>
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
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-red-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                            <Bot className="w-4 h-4 text-white" />
                          </div>
                        )}
                        
                        <div
                          className={`max-w-[75%] ${
                            message.isUser
                              ? 'bg-gradient-to-r from-red-600 to-purple-600 text-white rounded-l-2xl rounded-tr-2xl'
                              : 'bg-gray-800 text-gray-100 rounded-r-2xl rounded-tl-2xl border border-gray-700'
                          } p-4 shadow-lg`}
                        >
                          <p className="text-sm leading-relaxed">{message.text}</p>
                          <p className="text-xs opacity-70 mt-2">
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        
                        {message.isUser && (
                          <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
                            <User className="w-4 h-4 text-gray-300" />
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {isLoading && (
                      <div className="flex justify-start items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-red-500 to-purple-500 flex items-center justify-center">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                        <div className="bg-gray-800 border border-gray-700 p-4 rounded-r-2xl rounded-tl-2xl">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>

                <div className="p-6 border-t border-gray-700">
                  <form onSubmit={handleSendMessage} className="flex gap-3">
                    <Input
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder="Ask anything about your PDF..."
                      className="flex-1 bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 focus:border-red-500"
                      disabled={isLoading}
                    />
                    <Button
                      type="submit"
                      disabled={isLoading || !inputMessage.trim()}
                      className="bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-700 hover:to-purple-700 text-white border-0 px-6"
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
              className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700 shadow-2xl backdrop-blur-sm"
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
