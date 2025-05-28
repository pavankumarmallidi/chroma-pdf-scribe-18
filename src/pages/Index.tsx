
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
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#1DB954]"></div>
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
    <div className="min-h-screen bg-[#121212] relative overflow-hidden">
      {/* Header */}
      <div className="relative z-10 p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold text-white">
            <span className="text-[#1DB954]">
              PDF ANALYZER
            </span>
          </h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-white">
              <User className="w-5 h-5 text-[#1DB954]" />
              <span className="text-lg font-medium">{getUserDisplayName()}</span>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="bg-[#535353] border-[#535353] text-white hover:bg-[#1DB954] hover:border-[#1DB954]"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center p-6" style={{ minHeight: 'calc(100vh - 120px)' }}>
        {isUploading ? (
          <Card className="w-full max-w-md bg-[#1e1e1e] border-[#535353] shadow-2xl">
            <div className="p-8 text-center">
              <div className="relative mb-6">
                <div className="w-20 h-20 mx-auto rounded-full bg-[#1DB954] flex items-center justify-center mb-4">
                  <Sparkles className="w-10 h-10 text-white animate-pulse" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">PDF Taken Successfully!</h2>
              <p className="text-[#b3b3b3] mb-6 text-base">Your document has been analyzed. Please wait while we process the results...</p>
              
              {/* Enhanced progress bar */}
              <div className="w-full bg-[#535353] rounded-full h-3 mb-4 overflow-hidden">
                <div 
                  className="h-3 rounded-full bg-[#1DB954] transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                >
                </div>
              </div>
              <p className="text-[#1DB954] font-bold text-lg">{uploadProgress}%</p>
            </div>
          </Card>
        ) : (
          <Card className="w-full max-w-lg bg-[#1e1e1e] border-[#535353] shadow-2xl">
            <div className="p-8 text-center">
              <div className="mb-8">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#1DB954] flex items-center justify-center">
                  <FileText className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Upload Your PDF</h2>
                <p className="text-[#b3b3b3] text-base">Select a PDF file to extract and analyze its content with AI</p>
              </div>

              <div className="space-y-4">
                <div className="border-2 border-dashed border-[#535353] rounded-lg p-8 transition-all hover:border-[#1DB954] hover:bg-[#1DB954]/5">
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
                    <Upload className="w-12 h-12 text-[#535353]" />
                    <div className="text-white">
                      <p className="font-medium text-base">Click to upload PDF</p>
                      <p className="text-sm text-[#b3b3b3]">or drag and drop</p>
                    </div>
                  </label>
                </div>

                <Button className="w-full bg-[#1DB954] hover:bg-[#1ed760] text-white border-0 text-lg py-6">
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
