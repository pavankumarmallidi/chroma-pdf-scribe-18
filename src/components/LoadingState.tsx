
import { Card } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

interface LoadingStateProps {
  uploadProgress: number;
}

const LoadingState = ({ uploadProgress }: LoadingStateProps) => {
  return (
    <div className="relative z-10 flex items-center justify-center p-4 sm:p-6" style={{ minHeight: 'calc(100vh - 120px)' }}>
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
    </div>
  );
};

export default LoadingState;
