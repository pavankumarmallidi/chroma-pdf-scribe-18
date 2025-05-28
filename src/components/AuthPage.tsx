
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { FileText, ArrowLeft } from "lucide-react";

interface AuthPageProps {
  onBackToHome?: () => void;
  onSuccess?: () => void;
}

interface FloatingInputProps {
  id: string;
  name: string;
  type: string;
  placeholder: string;
  required?: boolean;
  disabled?: boolean;
}

const FloatingInput = ({ id, name, type, placeholder, required = false, disabled = false }: FloatingInputProps) => {
  const [focused, setFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  return (
    <div className="relative mb-6">
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        disabled={disabled}
        className="peer w-full px-0 py-3 bg-transparent border-0 border-b-2 border-gray-600 text-white placeholder-transparent focus:border-[#6366f1] focus:outline-none transition-colors"
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={(e) => {
          setFocused(false);
          setHasValue(e.target.value !== '');
        }}
        onChange={(e) => setHasValue(e.target.value !== '')}
      />
      <label
        htmlFor={id}
        className={`absolute left-0 transition-all duration-200 pointer-events-none ${
          focused || hasValue
            ? '-top-6 text-sm text-[#6366f1]'
            : 'top-3 text-gray-400'
        }`}
      >
        {placeholder}
      </label>
    </div>
  );
};

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
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#16213e] relative overflow-hidden">
      {/* Background decoration - matching home page */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234f46e5' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      ></div>

      {/* Back button */}
      {onBackToHome && (
        <Button
          onClick={onBackToHome}
          variant="ghost"
          className="absolute top-6 left-6 text-gray-300 hover:text-white hover:bg-gray-800/50 z-20"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
      )}

      <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
        <Card className="w-full max-w-md bg-[#1e1e1e]/50 border-gray-700 shadow-2xl backdrop-blur-sm">
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-white">PDF Analyzer</h1>
              </div>
              <p className="text-gray-300 text-sm">AI-powered document analysis</p>
            </div>

            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-gray-800/50 mb-8">
                <TabsTrigger 
                  value="login" 
                  className="text-gray-300 data-[state=active]:bg-[#6366f1] data-[state=active]:text-white data-[state=active]:shadow-sm"
                >
                  LOGIN
                </TabsTrigger>
                <TabsTrigger 
                  value="register" 
                  className="text-gray-300 data-[state=active]:bg-[#6366f1] data-[state=active]:text-white data-[state=active]:shadow-sm"
                >
                  SIGN UP
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="mt-0">
                <form onSubmit={handleLogin} className="space-y-6">
                  <FloatingInput
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Email Address"
                    required
                    disabled={isLoading}
                  />
                  <FloatingInput
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Password"
                    required
                    disabled={isLoading}
                  />
                  
                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center text-gray-300">
                      <input type="checkbox" className="mr-2 w-4 h-4 text-[#6366f1] rounded border-gray-500 focus:ring-[#6366f1] bg-gray-700" />
                      Remember me
                    </label>
                    <a href="#" className="text-[#6366f1] hover:underline">Forgot your password?</a>
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] hover:from-[#5855eb] hover:to-[#7c3aed] text-white py-3 rounded-full text-base font-medium mt-8"
                  >
                    {isLoading ? "Signing in..." : "LOGIN"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register" className="mt-0">
                <form onSubmit={handleRegister} className="space-y-6">
                  <FloatingInput
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="Full Name"
                    required
                    disabled={isLoading}
                  />
                  <FloatingInput
                    id="reg-email"
                    name="email"
                    type="email"
                    placeholder="Email Address"
                    required
                    disabled={isLoading}
                  />
                  <FloatingInput
                    id="reg-password"
                    name="password"
                    type="password"
                    placeholder="Password"
                    required
                    disabled={isLoading}
                  />
                  
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] hover:from-[#5855eb] hover:to-[#7c3aed] text-white py-3 rounded-full text-base font-medium mt-8"
                  >
                    {isLoading ? "Creating account..." : "SIGN UP"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;
