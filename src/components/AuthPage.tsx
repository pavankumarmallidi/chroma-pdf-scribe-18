
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

    const { error } = await signIn(email, password);
    
    if (error) {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
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

    const { error } = await signUp(email, password, fullName);
    
    if (error) {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Account created!",
        description: "Welcome to PDF CONTENT EXTRACTOR.",
      });
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-teal-900 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      ></div>
      
      <Card className="w-full max-w-md backdrop-blur-lg bg-white/10 border-white/20 shadow-2xl">
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-teal-300 to-purple-300 bg-clip-text text-transparent">
              PDF CONTENT EXTRACTOR
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
                    disabled={isLoading}
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
                    disabled={isLoading}
                    className="backdrop-blur-sm bg-white/10 border-white/20 text-white placeholder:text-white/60"
                    placeholder="Enter your password"
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-teal-500 to-purple-600 hover:from-teal-600 hover:to-purple-700 text-white border-0"
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
                    disabled={isLoading}
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
                    disabled={isLoading}
                    className="backdrop-blur-sm bg-white/10 border-white/20 text-white placeholder:text-white/60"
                    placeholder="Create a password"
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-500 to-teal-600 hover:from-purple-600 hover:to-teal-700 text-white border-0"
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
