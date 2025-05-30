
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface LoadingStateProps {
  uploadProgress: number;
}

const LoadingState = ({ uploadProgress }: LoadingStateProps) => {
  const getLoadingMessage = () => {
    if (uploadProgress < 20) return "Uploading your PDF...";
    if (uploadProgress < 40) return "Processing document...";
    if (uploadProgress < 60) return "Extracting text content...";
    if (uploadProgress < 80) return "Analyzing document structure...";
    if (uploadProgress < 95) return "Generating summary...";
    return "Finalizing analysis...";
  };

  return (
    <div className="relative z-10 flex items-center justify-center p-4 sm:p-6" style={{ minHeight: 'calc(100vh - 120px)' }}>
      <div className="text-center max-w-md">
        <div className="mb-8">
          <LoadingSpinner 
            size="xl" 
            variant="gradient" 
            className="mb-6"
          />
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Processing Your PDF
          </h2>
          <p className="text-lg text-gray-300 mb-6">
            {getLoadingMessage()}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-700 rounded-full h-3 mb-4 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-violet-500 to-purple-600 rounded-full transition-all duration-500 ease-out relative"
            style={{ width: `${uploadProgress}%` }}
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
          </div>
        </div>
        
        <p className="text-sm text-gray-400">
          {uploadProgress}% complete
        </p>

        {uploadProgress > 50 && (
          <div className="mt-6 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
            <p className="text-sm text-gray-300">
              🔍 Our AI is analyzing your document content, structure, and generating insights...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingState;
