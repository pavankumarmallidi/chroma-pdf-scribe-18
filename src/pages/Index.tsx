
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, FileText, User, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ChatSummary from "@/components/ChatSummary";

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [pdfSummary, setPdfSummary] = useState("");
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const email = (e.target as HTMLFormElement).email.value;
    setUserEmail(email);
    setIsLoggedIn(true);
    toast({
      title: "Welcome back!",
      description: "You've successfully logged in.",
    });
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const email = (e.target as HTMLFormElement).email.value;
    setUserEmail(email);
    setIsLoggedIn(true);
    toast({
      title: "Account created!",
      description: "Welcome to pdfocrextractor.",
    });
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

    setIsUploading(true);
    
    // Simulate upload process - replace with actual webhook call after Supabase integration
    setTimeout(() => {
      setIsUploading(false);
      setPdfSummary("Your PDF document has been successfully analyzed. The document contains important information about project management strategies and best practices. Key topics include team collaboration, resource allocation, and timeline management.");
      setShowChat(true);
      toast({
        title: "PDF uploaded successfully!",
        description: "Your PDF has been processed and analyzed.",
      });
    }, 3000);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserEmail("");
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

  if (showChat) {
    return <ChatSummary onBackToHome={handleBackToHome} pdfSummary={pdfSummary} />;
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-teal-900 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        
        <Card className="w-full max-w-md backdrop-blur-lg bg-white/10 border-white/20 shadow-2xl">
          <div className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-teal-300 to-purple-300 bg-clip-text text-transparent">
                pdfocrextractor
              </h1>
              <p className="text-white/80">Extract insights from your PDFs</p>
            </div>

            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 backdrop-blur-sm bg-white/10 border-white/20">
                <TabsTrigger value="login" className="text-white data-[state=active]:bg-white/20">
                  Login
                </TabsTrigger>
                <TabsTrigger value="register" className="text-white data-[state=active]:bg-white/20">
                  Register
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4 mt-6">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="backdrop-blur-sm bg-white/10 border-white/20 text-white placeholder:text-white/60"
                      placeholder="Enter your email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-white">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      required
                      className="backdrop-blur-sm bg-white/10 border-white/20 text-white placeholder:text-white/60"
                      placeholder="Enter your password"
                    />
                  </div>
                  <Button type="submit" className="w-full bg-gradient-to-r from-teal-500 to-purple-600 hover:from-teal-600 hover:to-purple-700 text-white border-0">
                    Sign In
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register" className="space-y-4 mt-6">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-white">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      className="backdrop-blur-sm bg-white/10 border-white/20 text-white placeholder:text-white/60"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-email" className="text-white">Email</Label>
                    <Input
                      id="reg-email"
                      name="email"
                      type="email"
                      required
                      className="backdrop-blur-sm bg-white/10 border-white/20 text-white placeholder:text-white/60"
                      placeholder="Enter your email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-password" className="text-white">Password</Label>
                    <Input
                      id="reg-password"
                      name="password"
                      type="password"
                      required
                      className="backdrop-blur-sm bg-white/10 border-white/20 text-white placeholder:text-white/60"
                      placeholder="Create a password"
                    />
                  </div>
                  <Button type="submit" className="w-full bg-gradient-to-r from-purple-500 to-teal-600 hover:from-purple-600 hover:to-teal-700 text-white border-0">
                    Create Account
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-teal-900 relative">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
      
      {/* Header */}
      <div className="relative z-10 p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold text-white bg-gradient-to-r from-teal-300 to-purple-300 bg-clip-text text-transparent">
            pdfocrextractor
          </h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-white/90">
              <User className="w-5 h-5" />
              <span>{userEmail}</span>
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
              <h2 className="text-2xl font-bold text-white mb-2">Processing your PDF...</h2>
              <p className="text-white/80">Please wait while we extract and analyze your document.</p>
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
