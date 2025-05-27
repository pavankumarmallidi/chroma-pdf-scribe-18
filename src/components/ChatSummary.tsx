
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Home, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatSummaryProps {
  onBackToHome: () => void;
  pdfSummary?: string;
}

const ChatSummary = ({ onBackToHome, pdfSummary = "Your PDF has been successfully processed and analyzed." }: ChatSummaryProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Welcome to pdfocrextractor. We've analyzed your PDF. You can ask me questions about it.",
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

    // Simulate API call to webhook - replace with actual webhook call after Supabase integration
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "Thank you for your question. I've analyzed your PDF and here's what I found...",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botResponse]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-teal-900 relative">
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      ></div>
      
      <div className="relative z-10 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-white bg-gradient-to-r from-teal-300 to-purple-300 bg-clip-text text-transparent">
              PDF Analysis Results
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Summary Panel */}
            <div className="lg:col-span-1">
              <Card className="backdrop-blur-lg bg-white/10 border-white/20 shadow-2xl h-fit">
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="w-5 h-5 text-teal-400" />
                    <h2 className="text-xl font-semibold text-white">PDF Summary</h2>
                  </div>
                  <div className="text-white/90 space-y-3">
                    <p className="text-sm leading-relaxed">
                      {pdfSummary}
                    </p>
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                      <p className="text-xs text-white/70 mb-1">Document Stats:</p>
                      <ul className="text-sm space-y-1">
                        <li>• Pages: 12</li>
                        <li>• Words: ~2,400</li>
                        <li>• Language: English</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Chat Panel */}
            <div className="lg:col-span-2">
              <Card className="backdrop-blur-lg bg-white/10 border-white/20 shadow-2xl h-[600px] flex flex-col">
                <div className="p-4 border-b border-white/10">
                  <h2 className="text-lg font-semibold text-white">Chat with your PDF</h2>
                  <p className="text-sm text-white/70">Ask questions about your document</p>
                </div>

                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] p-3 rounded-lg ${
                            message.isUser
                              ? 'bg-gradient-to-r from-teal-500 to-purple-600 text-white'
                              : 'backdrop-blur-sm bg-white/20 text-white border border-white/20'
                          }`}
                        >
                          <p className="text-sm">{message.text}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {message.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="backdrop-blur-sm bg-white/20 text-white border border-white/20 p-3 rounded-lg">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>

                <div className="p-4 border-t border-white/10">
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <Input
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder="Ask a question about your PDF..."
                      className="flex-1 backdrop-blur-sm bg-white/10 border-white/20 text-white placeholder:text-white/60"
                      disabled={isLoading}
                    />
                    <Button
                      type="submit"
                      disabled={isLoading || !inputMessage.trim()}
                      className="bg-gradient-to-r from-teal-500 to-purple-600 hover:from-teal-600 hover:to-purple-700 text-white border-0"
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
              className="backdrop-blur-lg bg-white/10 border-white/20 text-white hover:bg-white/20 shadow-2xl"
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
