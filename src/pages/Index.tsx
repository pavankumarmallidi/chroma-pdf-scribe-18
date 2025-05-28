
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Upload, FileText, User, LogOut, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { uploadToWebhook } from "@/services/webhookService";
import ChatSummary from "@/components/ChatSummary";
import AuthPage from "@/components/AuthPage";

interface PdfAnalysisData {
  summary: string;
  totalPages: number;
  totalWords: number;
  language: string;
}

const Index = () => {
  const { user, loading, signOut } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showChat, setShowChat] = useState(false);
  const [pdfAnalysisData, setPdfAnalysisData] = useState<PdfAnalysisData | null>(null);
  const { toast } = useToast();

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

    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      const responseData = await uploadToWebhook(file, setUploadProgress);
      
      // Extract the analysis data from the webhook response
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

  // Get user's full name from metadata or fallback to email
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
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  if (showChat && pdfAnalysisData) {
    return <ChatSummary onBackToHome={handleBackToHome} pdfAnalysisData={pdfAnalysisData} />;
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Netflix-style background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-red-900/20 via-black to-black"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/10 to-blue-900/10"></div>
      
      {/* Header */}
      <div className="relative z-10 p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold text-white">
            <span className="bg-gradient-to-r from-red-500 to-purple-500 bg-clip-text text-transparent">
              PDF ANALYZER
            </span>
          </h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-white">
              <User className="w-5 h-5 text-red-500" />
              <span className="text-lg font-medium">{getUserDisplayName()}</span>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="bg-red-600 border-red-500 text-white hover:bg-red-700 hover:border-red-600"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center p-6" style={{ minHeight: 'calc(100vh - 120px)' }}>
        {isUploading ? (
          <Card className="w-full max-w-md bg-gray-900/90 border-gray-700 shadow-2xl backdrop-blur-sm">
            <div className="p-8 text-center">
              <div className="relative mb-6">
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-red-500 to-purple-500 flex items-center justify-center mb-4">
                  <Sparkles className="w-10 h-10 text-white animate-pulse" />
                </div>
                <div className="absolute -inset-4 bg-gradient-to-r from-red-500/20 to-purple-500/20 rounded-full blur-xl animate-pulse"></div>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">PDF Taken Successfully!</h2>
              <p className="text-gray-300 mb-6">Your document has been analyzed. Please wait while we process the results...</p>
              
              {/* Enhanced progress bar */}
              <div className="w-full bg-gray-700 rounded-full h-3 mb-4 overflow-hidden">
                <div 
                  className="h-3 rounded-full bg-gradient-to-r from-red-500 to-purple-500 transition-all duration-300 relative"
                  style={{ width: `${uploadProgress}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                </div>
              </div>
              <p className="text-red-400 font-bold text-lg">{uploadProgress}%</p>
            </div>
          </Card>
        ) : (
          <Card className="w-full max-w-lg bg-gray-900/90 border-gray-700 shadow-2xl backdrop-blur-sm">
            <div className="p-8 text-center">
              <div className="mb-8">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-red-500 to-purple-500 flex items-center justify-center">
                  <FileText className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Upload Your PDF</h2>
                <p className="text-gray-300">Select a PDF file to extract and analyze its content with AI</p>
              </div>

              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 transition-all hover:border-red-500 hover:bg-red-500/5">
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
                    <Upload className="w-12 h-12 text-gray-400" />
                    <div className="text-white">
                      <p className="font-medium">Click to upload PDF</p>
                      <p className="text-sm text-gray-400">or drag and drop</p>
                    </div>
                  </label>
                </div>

                <Button className="w-full bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-700 hover:to-purple-700 text-white border-0 text-lg py-6">
                  <Upload className="w-5 h-5 mr-2" />
                  Choose PDF File
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;
