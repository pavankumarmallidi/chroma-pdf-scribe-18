
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Home, FileText, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { sendChatMessage } from "@/services/chatService";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import DocumentSidebar from "./DocumentSidebar";

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
  const { user, signOut } = useAuth();
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

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logged out successfully",
        description: "See you next time!",
      });
      onBackToHome();
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Logout failed",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !user?.email) return;

    const messageToSend = inputMessage;
    setInputMessage("");

    // Immediately add user message to chat
    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageToSend,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await sendChatMessage(messageToSend, user.email);
      
      let botMessageText = "I understand you'd like to know more about your PDF. Could you be more specific about what aspect you'd like me to elaborate on?";
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
      
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error("Chat message failed:", error);
      
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      
      toast({
        title: "Message failed",
        description: errorMessage,
        variant: "destructive",
      });

      // Add error message to chat
      const errorResponse: Message = {
        id: (Date.now() + 2).toString(),
        text: `Sorry, I encountered an error: ${errorMessage}. Please try again.`,
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f23] via-[#1a1a2e] to-[#16213e] relative overflow-hidden">
      {/* Enhanced background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/20 via-transparent to-transparent"></div>
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236366f1' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      ></div>

      {/* Header */}
      <div className="relative z-10 backdrop-blur-xl bg-white/5 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-500/25">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">PDF Analysis Chat</h1>
                <p className="text-gray-300 text-sm">Intelligent document analysis and Q&A</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={onBackToHome}
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/30 backdrop-blur-sm transition-all duration-300 hover:scale-105"
              >
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="bg-red-500/20 border-red-500/30 text-red-300 hover:bg-red-500/30 hover:border-red-500/40 backdrop-blur-sm transition-all duration-300 hover:scale-105"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Two Panel Layout */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="h-[calc(100vh-140px)] flex flex-col lg:flex-row gap-6">
          
          {/* Left Panel - Document Sidebar */}
          <div className="lg:w-80 flex-shrink-0">
            <DocumentSidebar pdfAnalysisData={pdfAnalysisData} />
          </div>

          {/* Right Panel - Chat Interface */}
          <div className="flex-1 min-w-0">
            <Card className="h-full flex flex-col bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl shadow-black/20 rounded-3xl overflow-hidden">
              {/* Chat Header */}
              <div className="p-6 border-b border-white/10 bg-white/5 backdrop-blur-sm">
                <h2 className="text-lg font-semibold text-white">Chat with your document</h2>
                <p className="text-gray-400 text-sm">Ask questions about the content and get intelligent answers</p>
              </div>
              
              {/* Chat Messages Area - Fixed Height with Scrollbar */}
              <div className="flex-1 min-h-0 overflow-hidden">
                <MessageList 
                  messages={messages} 
                  isLoading={isLoading}
                />
              </div>

              {/* Message Input */}
              <MessageInput
                inputMessage={inputMessage}
                setInputMessage={setInputMessage}
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
              />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatSummary;
