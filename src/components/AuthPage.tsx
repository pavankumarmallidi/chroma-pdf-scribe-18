
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

const AuthPage = () => {
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
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Netflix-style background */}
      <div className="absolute inset-0 bg-gradient-to-b from-red-900/20 via-black to-black"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/10 to-blue-900/10"></div>
      
      <Card className="w-full max-w-md bg-gray-900/90 border-gray-700 shadow-2xl backdrop-blur-sm relative z-10">
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              <span className="bg-gradient-to-r from-red-500 to-purple-500 bg-clip-text text-transparent">
                PDF ANALYZER
              </span>
            </h1>
            <p className="text-gray-300">AI-powered document analysis</p>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-800 border-gray-700">
              <TabsTrigger value="login" className="text-gray-300 data-[state=active]:bg-red-600 data-[state=active]:text-white">
                Login
              </TabsTrigger>
              <TabsTrigger value="register" className="text-gray-300 data-[state=active]:bg-red-600 data-[state=active]:text-white">
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
                    disabled={isLoading}
                    className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 focus:border-red-500"
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
                    disabled={isLoading}
                    className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 focus:border-red-500"
                    placeholder="Enter your password"
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-700 hover:to-purple-700 text-white border-0 py-6"
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register" className="space-y-4 mt-6">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-white">Full Name</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    disabled={isLoading}
                    className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 focus:border-red-500"
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
                    disabled={isLoading}
                    className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 focus:border-red-500"
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
                    disabled={isLoading}
                    className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 focus:border-red-500"
                    placeholder="Create a password"
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-red-600 hover:from-purple-700 hover:to-red-700 text-white border-0 py-6"
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
