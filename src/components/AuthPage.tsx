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
        className="peer w-full px-0 py-3 bg-transparent border-0 border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:border-[#8b5cf6] focus:outline-none transition-colors"
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
            ? '-top-6 text-sm text-[#8b5cf6]'
            : 'top-3 text-gray-500'
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
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 bg-white flex items-center justify-center p-8 relative">
        {/* Back button */}
        {onBackToHome && (
          <Button
            onClick={onBackToHome}
            variant="ghost"
            className="absolute top-6 left-6 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        )}

        <div className="w-full max-w-md">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-100 mb-8">
              <TabsTrigger 
                value="login" 
                className="text-gray-600 data-[state=active]:bg-white data-[state=active]:text-[#8b5cf6] data-[state=active]:shadow-sm"
              >
                LOGIN
              </TabsTrigger>
              <TabsTrigger 
                value="register" 
                className="text-gray-600 data-[state=active]:bg-white data-[state=active]:text-[#8b5cf6] data-[state=active]:shadow-sm"
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
                  <label className="flex items-center text-gray-600">
                    <input type="checkbox" className="mr-2 w-4 h-4 text-[#8b5cf6] rounded border-gray-300 focus:ring-[#8b5cf6]" />
                    Remember me
                  </label>
                  <a href="#" className="text-[#8b5cf6] hover:underline">Forgot your password?</a>
                </div>

                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-[#8b5cf6] hover:bg-[#7c3aed] text-white py-3 rounded-full text-base font-medium mt-8"
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
                  className="w-full bg-[#8b5cf6] hover:bg-[#7c3aed] text-white py-3 rounded-full text-base font-medium mt-8"
                >
                  {isLoading ? "Creating account..." : "SIGN UP"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Right Side - Purple Gradient with Decorative Elements */}
      <div className="flex-1 bg-gradient-to-br from-[#d946ef] via-[#8b5cf6] to-[#6366f1] relative overflow-hidden flex items-center justify-center">
        {/* Decorative circles */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full"></div>
        <div className="absolute top-40 left-20 w-20 h-20 bg-white/15 rounded-full"></div>
        <div className="absolute bottom-32 right-32 w-24 h-24 bg-white/10 rounded-full"></div>
        <div className="absolute bottom-20 left-40 w-16 h-16 bg-white/20 rounded-full"></div>
        
        {/* Dotted pattern */}
        <div className="absolute top-8 right-8">
          <div className="grid grid-cols-8 gap-2">
            {Array.from({ length: 32 }).map((_, i) => (
              <div key={i} className="w-1 h-1 bg-white/30 rounded-full"></div>
            ))}
          </div>
        </div>

        {/* Main content */}
        <div className="text-center text-white z-10 px-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <FileText className="w-6 h-6 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold mb-4 leading-tight">
            Welcome to<br />
            PDF Analyzer
          </h1>
          
          <p className="text-white/90 text-lg max-w-sm mx-auto leading-relaxed">
            AI-powered document analysis that transforms how you interact with your PDFs. Join thousands of users already analyzing smarter.
          </p>
        </div>

        {/* Large decorative circle */}
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-gradient-to-br from-white/10 to-transparent rounded-full"></div>
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-gradient-to-tl from-white/10 to-transparent rounded-full"></div>
      </div>
    </div>
  );
};

export default AuthPage;
