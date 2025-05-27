import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Upload, FileText, User, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { uploadToWebhook } from "@/services/webhookService";
import ChatSummary from "@/components/ChatSummary";
import AuthPage from "@/components/AuthPage";

const Index = () => {
  const { user, loading, signOut } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showChat, setShowChat] = useState(false);
  const [pdfSummary, setPdfSummary] = useState("");
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
      await uploadToWebhook(file, setUploadProgress);
      
      // Simulate getting summary from webhook response
      setPdfSummary("Your PDF document has been successfully analyzed. The document contains important information about project management strategies and best practices. Key topics include team collaboration, resource allocation, and timeline management.");
      setShowChat(true);
      
      toast({
        title: "PDF uploaded successfully!",
        description: "Your PDF has been processed and analyzed.",
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
    setPdfSummary("");
    toast({
      title: "Logged out",
      description: "See you next time!",
    });
  };

  const handleBackToHome = () => {
    setShowChat(false);
    setPdfSummary("");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-teal-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-teal-400"></div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  if (showChat) {
    return <ChatSummary onBackToHome={handleBackToHome} pdfSummary={pdfSummary} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-teal-900 relative">
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      ></div>
      
      {/* Header */}
      <div className="relative z-10 p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold text-white bg-gradient-to-r from-teal-300 to-purple-300 bg-clip-text text-transparent">
            PDF CONTENT EXTRACTOR
          </h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-white/90">
              <User className="w-5 h-5" />
              <span>{user.email}</span>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="backdrop-blur-sm bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center p-6" style={{ minHeight: 'calc(100vh - 120px)' }}>
        {isUploading ? (
          <Card className="w-full max-w-md backdrop-blur-lg bg-white/10 border-white/20 shadow-2xl">
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-teal-400 mx-auto mb-4"></div>
              <h2 className="text-2xl font-bold text-white mb-2">Uploading...</h2>
              <p className="text-white/80 mb-4">Please wait while we upload and analyze your document.</p>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-teal-400 to-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-white/60 text-sm mt-2">{uploadProgress}%</p>
            </div>
          </Card>
        ) : (
          <Card className="w-full max-w-lg backdrop-blur-lg bg-white/10 border-white/20 shadow-2xl">
            <div className="p-8 text-center">
              <div className="mb-8">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-teal-400 to-purple-500 flex items-center justify-center">
                  <FileText className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Upload Your PDF</h2>
                <p className="text-white/80">Select a PDF file to extract and analyze its content</p>
              </div>

              <div className="space-y-4">
                <div className="border-2 border-dashed border-white/30 rounded-lg p-8 transition-all hover:border-white/50 hover:bg-white/5">
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
                    <Upload className="w-12 h-12 text-white/60" />
                    <div className="text-white">
                      <p className="font-medium">Click to upload PDF</p>
                      <p className="text-sm text-white/60">or drag and drop</p>
                    </div>
                  </label>
                </div>

                <Button className="w-full bg-gradient-to-r from-teal-500 to-purple-600 hover:from-teal-600 hover:to-purple-700 text-white border-0">
                  <Upload className="w-4 h-4 mr-2" />
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
