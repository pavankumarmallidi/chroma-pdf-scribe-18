
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { FileText, ArrowLeft } from "lucide-react";

interface AuthPageProps {
  onBackToHome?: () => void;
  onSuccess?: () => void;
}

const AuthPage = ({ onBackToHome, onSuccess }: AuthPageProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { signIn, signUp } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    console.log('Login attempt for email:', email);

    const { data, error } = await signIn(email, password);
    
    if (error) {
      console.error('Login error:', error);
      
      let errorMessage = error.message;
      
      if (error.message.includes('email_not_confirmed')) {
        errorMessage = "Please check your email and click the confirmation link before logging in.";
      } else if (error.message.includes('Invalid login credentials')) {
        errorMessage = "Invalid email or password. Please check your credentials and try again.";
      }
      
      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive",
      });
    } else if (data.user) {
      console.log('Login successful:', data.user);
      toast({
        title: "Welcome back!",
        description: "You've successfully logged in.",
      });
      onSuccess?.();
    }
    
    setIsLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const fullName = formData.get('fullName') as string;

    console.log('Registration attempt for email:', email);

    const { data, error } = await signUp(email, password, fullName);
    
    if (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      console.log('Registration successful:', data);
      toast({
        title: "Account created!",
        description: "Please check your email to confirm your account before logging in.",
      });
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#16213e] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%236366f1" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
      
      {/* Back button */}
      {onBackToHome && (
        <Button
          onClick={onBackToHome}
          variant="ghost"
          className="absolute top-6 left-6 text-gray-300 hover:text-white z-20"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
      )}

      <Card className="w-full max-w-md bg-[#1e1e1e]/50 border-gray-700 shadow-2xl relative z-10 backdrop-blur-sm">
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white">PDF Analyzer</h1>
            </div>
            <p className="text-gray-300 text-base">AI-powered document analysis</p>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-[#2a2a2a]/50 border-gray-600">
              <TabsTrigger 
                value="login" 
                className="text-gray-300 data-[state=active]:bg-[#6366f1] data-[state=active]:text-white"
              >
                Login
              </TabsTrigger>
              <TabsTrigger 
                value="register" 
                className="text-gray-300 data-[state=active]:bg-[#6366f1] data-[state=active]:text-white"
              >
                Register
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4 mt-6">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white text-base">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    disabled={isLoading}
                    className="bg-[#2a2a2a]/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-[#6366f1] text-sm"
                    placeholder="Enter your email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white text-base">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    disabled={isLoading}
                    className="bg-[#2a2a2a]/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-[#6366f1] text-sm"
                    placeholder="Enter your password"
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] hover:from-[#5855eb] hover:to-[#7c3aed] text-white border-0 py-6 text-base"
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register" className="space-y-4 mt-6">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-white text-base">Full Name</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    disabled={isLoading}
                    className="bg-[#2a2a2a]/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-[#6366f1] text-sm"
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-email" className="text-white text-base">Email</Label>
                  <Input
                    id="reg-email"
                    name="email"
                    type="email"
                    required
                    disabled={isLoading}
                    className="bg-[#2a2a2a]/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-[#6366f1] text-sm"
                    placeholder="Enter your email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-password" className="text-white text-base">Password</Label>
                  <Input
                    id="reg-password"
                    name="password"
                    type="password"
                    required
                    disabled={isLoading}
                    className="bg-[#2a2a2a]/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-[#6366f1] text-sm"
                    placeholder="Create a password"
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] hover:from-[#5855eb] hover:to-[#7c3aed] text-white border-0 py-6 text-base"
                >
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </Card>
    </div>
  );
};

export default AuthPage;
