
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Home, FileText, Sparkles, Bot, User, MessageCircle } from "lucide-react";
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
      
      const userMessage: Message = {
        id: Date.now().toString(),
        text: messageToSend,
        isUser: true,
        timestamp: new Date(),
      };

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
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#16213e] relative overflow-hidden">
      {/* Background decoration */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234f46e5' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      ></div>

      {/* Header */}
      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">PDF Analysis Complete</h1>
              <p className="text-gray-300 text-sm">Chat with your document using AI</p>
            </div>
          </div>
          <Button
            onClick={onBackToHome}
            variant="outline"
            className="bg-transparent border-gray-600 text-gray-300 hover:bg-[#6366f1] hover:border-[#6366f1] hover:text-white transition-all duration-300"
          >
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-180px)]">
          
          {/* Document Analysis Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-[#1e1e1e]/50 border-gray-700 shadow-2xl backdrop-blur-sm h-full">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] flex items-center justify-center">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Document Summary</h2>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-[#2a2a2a]/50 border border-gray-600/30 backdrop-blur-sm">
                    <h3 className="text-[#6366f1] font-semibold mb-3 text-sm uppercase tracking-wide">Analysis</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {pdfAnalysisData.summary}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-3">
                    <div className="p-4 rounded-xl bg-gradient-to-r from-[#6366f1]/10 to-[#8b5cf6]/10 border border-[#6366f1]/20 backdrop-blur-sm">
                      <p className="text-gray-300 text-xs mb-1 uppercase tracking-wide">Pages</p>
                      <p className="text-[#6366f1] font-bold text-2xl">{pdfAnalysisData.totalPages}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-gradient-to-r from-[#8b5cf6]/10 to-[#6366f1]/10 border border-[#8b5cf6]/20 backdrop-blur-sm">
                      <p className="text-gray-300 text-xs mb-1 uppercase tracking-wide">Words</p>
                      <p className="text-white font-bold text-2xl">{pdfAnalysisData.totalWords.toLocaleString()}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-[#2a2a2a]/50 border border-gray-600/30 backdrop-blur-sm">
                      <p className="text-gray-300 text-xs mb-1 uppercase tracking-wide">Language</p>
                      <p className="text-white font-semibold text-lg">{pdfAnalysisData.language}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-3">
            <Card className="bg-[#1e1e1e]/50 border-gray-700 shadow-2xl backdrop-blur-sm h-full flex flex-col">
              
              {/* Chat Header */}
              <div className="p-6 border-b border-gray-700/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">AI Assistant</h2>
                    <p className="text-gray-400 text-sm">Ask anything about your document</p>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <ScrollArea className="flex-1 p-6">
                <div className="space-y-6">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} items-start gap-4`}
                    >
                      {!message.isUser && (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] flex items-center justify-center flex-shrink-0 shadow-lg">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                      )}
                      
                      <div
                        className={`max-w-[80%] ${
                          message.isUser
                            ? 'bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white rounded-l-2xl rounded-tr-2xl shadow-lg'
                            : 'bg-[#2a2a2a]/70 text-white rounded-r-2xl rounded-tl-2xl border border-gray-600/30 backdrop-blur-sm shadow-lg'
                        } p-4 transition-all duration-300 hover:shadow-xl`}
                      >
                        <p className="text-sm leading-relaxed mb-2">{message.text}</p>
                        
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
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-gray-600 to-gray-700 flex items-center justify-center flex-shrink-0 shadow-lg">
                          <User className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex justify-start items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] flex items-center justify-center shadow-lg">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div className="bg-[#2a2a2a]/70 border border-gray-600/30 backdrop-blur-sm p-4 rounded-r-2xl rounded-tl-2xl shadow-lg">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-[#6366f1] rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-[#8b5cf6] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-[#6366f1] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Input Area */}
              <div className="p-6 border-t border-gray-700/50">
                <form onSubmit={handleSendMessage} className="flex gap-3">
                  <div className="flex-1 relative">
                    <Input
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder="Ask anything about your PDF..."
                      className="bg-[#2a2a2a]/70 border-gray-600/30 text-white placeholder:text-gray-400 focus:border-[#6366f1] focus:ring-[#6366f1]/20 text-sm rounded-xl backdrop-blur-sm transition-all duration-300"
                      disabled={isLoading}
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isLoading || !inputMessage.trim()}
                    className="bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] hover:from-[#5855eb] hover:to-[#7c3aed] text-white border-0 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
                
                <p className="text-center text-xs text-gray-500 mt-3">
                  AI can make mistakes. Please verify important information.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatSummary;
