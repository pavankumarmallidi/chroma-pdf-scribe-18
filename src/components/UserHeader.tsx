
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { User, Home, LogOut } from "lucide-react";

interface UserHeaderProps {
  getUserDisplayName: () => string;
  onHomeClick: () => void;
  onLogout: () => void;
}

const UserHeader = ({ getUserDisplayName, onHomeClick, onLogout }: UserHeaderProps) => {
  return (
    <div className="relative z-10 p-4 sm:p-6 border-b border-gray-700/30">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Welcome back!</h2>
            <p className="text-gray-300 text-sm">{getUserDisplayName()}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onHomeClick}
                variant="outline"
                size="icon"
                className="bg-transparent border-gray-600 text-gray-300 hover:bg-[#6366f1] hover:border-[#6366f1] hover:text-white transition-all duration-300 hover:scale-105"
              >
                <Home className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Go to Home</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onLogout}
                variant="outline"
                size="icon"
                className="bg-transparent border-red-600/50 text-red-400 hover:bg-red-600 hover:border-red-600 hover:text-white transition-all duration-300 hover:scale-105"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Logout</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default UserHeader;
