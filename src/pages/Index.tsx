
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, FileText, User, LogOut, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { uploadToWebhook } from "@/services/webhookService";
import ChatSummary from "@/components/ChatSummary";
import AuthPage from "@/components/AuthPage";
import HomePage from "@/components/HomePage";

interface PdfAnalysisData {
  summary: string;
  totalPages: number;
  totalWords: number;
  language: string;
}

const Index = () => {
  const { user, loading, signOut } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [showApp, setShowApp] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showChat, setShowChat] = useState(false);
  const [pdfAnalysisData, setPdfAnalysisData] = useState<PdfAnalysisData | null>(null);
  const { toast } = useToast();

  const handleGetStarted = () => {
    if (user) {
      setShowApp(true);
    } else {
      setShowAuth(true);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || file.type !== "application/pdf") {
      toast({
        title: "Invalid file",
        description: "Please select a PDF file.",
        variant: "destructive",
      });
      return;
    }

    if (!user?.email) {
      toast({
        title: "Authentication required",
        description: "Please log in to upload files.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      const responseData = await uploadToWebhook(file, user.email, setUploadProgress);
      
      if (responseData && responseData.length > 0 && responseData[0].output) {
        const analysisData = responseData[0].output;
        setPdfAnalysisData({
          summary: analysisData.summary,
          totalPages: analysisData.totalPages,
          totalWords: analysisData.totalWords,
          language: analysisData.language
        });
        setShowChat(true);
      }
      
      toast({
        title: "PDF analyzed successfully!",
        description: "Your PDF has been processed and is ready for questions.",
      });
    } catch (error) {
      console.error("Upload failed:", error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "An error occurred during upload.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleLogout = async () => {
    await signOut();
    setShowAuth(false);
    setShowApp(false);
    setShowChat(false);
    setPdfAnalysisData(null);
    toast({
      title: "Logged out",
      description: "See you next time!",
    });
  };

  const handleBackToHome = () => {
    setShowChat(false);
    setPdfAnalysisData(null);
  };

  const handleBackToApp = () => {
    setShowApp(true);
    setShowAuth(false);
  };

  const getUserDisplayName = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name;
    }
    if (user?.user_metadata?.first_name) {
      const firstName = user.user_metadata.first_name;
      const lastName = user.user_metadata.last_name || '';
      return `${firstName} ${lastName}`.trim();
    }
    return user?.email || 'User';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#16213e] flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#6366f1]"></div>
      </div>
    );
  }

  if (showAuth) {
    return <AuthPage onBackToHome={() => setShowAuth(false)} onSuccess={handleBackToApp} />;
  }

  if (showChat && pdfAnalysisData) {
    return <ChatSummary onBackToHome={handleBackToHome} pdfAnalysisData={pdfAnalysisData} />;
  }

  if (showApp && user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#16213e] relative overflow-hidden">
        {/* Header */}
        <div className="relative z-10 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-white">PDF Analyzer</h1>
            </div>
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex items-center gap-2 text-white">
                <User className="w-4 h-4 sm:w-5 sm:h-5 text-[#6366f1]" />
                <span className="text-sm sm:text-lg font-medium truncate max-w-32 sm:max-w-none">{getUserDisplayName()}</span>
              </div>
              <Button
                onClick={() => setShowApp(false)}
                variant="outline"
                size="sm"
                className="bg-transparent border-gray-600 text-gray-300 hover:bg-[#6366f1] hover:border-[#6366f1] hover:text-white transition-all duration-300"
              >
                Home
              </Button>
              <div className="relative group">
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="bg-transparent border-gray-600 text-gray-300 hover:bg-red-600 hover:border-red-600 hover:text-white transition-all duration-300 transform hover:scale-105"
                  title="Logout"
                >
                  <LogOut className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                  Logout
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 flex items-center justify-center p-4 sm:p-6" style={{ minHeight: 'calc(100vh - 120px)' }}>
          {isUploading ? (
            <Card className="w-full max-w-sm sm:max-w-md bg-[#1e1e1e]/50 border-gray-700 shadow-2xl backdrop-blur-sm">
              <div className="p-6 sm:p-8 text-center">
                <div className="relative mb-6">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] flex items-center justify-center mb-4">
                    <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-white animate-pulse" />
                  </div>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">PDF Analysis in Progress!</h2>
                <p className="text-gray-300 mb-6 text-sm sm:text-base">Your document is being processed with advanced AI. Please wait while we extract insights...</p>
                
                <div className="w-full bg-gray-700 rounded-full h-3 mb-4 overflow-hidden">
                  <div 
                    className="h-3 rounded-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  >
                  </div>
                </div>
                <p className="text-[#6366f1] font-bold text-base sm:text-lg">{uploadProgress}%</p>
              </div>
            </Card>
          ) : (
            <Card className="w-full max-w-sm sm:max-w-lg bg-[#1e1e1e]/50 border-gray-700 shadow-2xl backdrop-blur-sm">
              <div className="p-6 sm:p-8 text-center">
                <div className="mb-6 sm:mb-8">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] flex items-center justify-center">
                    <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Upload Your PDF</h2>
                  <p className="text-gray-300 text-sm sm:text-base">Select a PDF file to extract and analyze its content with AI</p>
                </div>

                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 sm:p-8 transition-all hover:border-[#6366f1] hover:bg-[#6366f1]/5">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="pdf-upload"
                    />
                    <label
                      htmlFor="pdf-upload"
                      className="cursor-pointer flex flex-col items-center gap-3"
                    >
                      <Upload className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" />
                      <div className="text-white">
                        <p className="font-medium text-sm sm:text-base">Click to upload PDF</p>
                        <p className="text-xs sm:text-sm text-gray-400">or drag and drop</p>
                      </div>
                    </label>
                  </div>

                  <Button className="w-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] hover:from-[#5855eb] hover:to-[#7c3aed] text-white border-0 text-base sm:text-lg py-4 sm:py-6">
                    <Upload className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Choose PDF File
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    );
  }

  return <HomePage onGetStarted={handleGetStarted} />;
};

export default Index;
