
import { Button } from "@/components/ui/button";
import { FileText, User, LogOut } from "lucide-react";

interface UserHeaderProps {
  getUserDisplayName: () => string;
  onHomeClick: () => void;
  onLogout: () => void;
}

const UserHeader = ({ getUserDisplayName, onHomeClick, onLogout }: UserHeaderProps) => {
  return (
    <div className="relative z-10 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] rounded-lg flex items-center justify-center">
            <FileText className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">PDF Analyzer</h1>
        </div>
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-2 text-white">
            <User className="w-4 h-4 sm:w-5 sm:h-5 text-[#6366f1]" />
            <span className="text-sm sm:text-lg font-medium truncate max-w-32 sm:max-w-none">{getUserDisplayName()}</span>
          </div>
          <Button
            onClick={onHomeClick}
            variant="outline"
            size="sm"
            className="bg-transparent border-gray-600 text-gray-300 hover:bg-[#6366f1] hover:border-[#6366f1] hover:text-white transition-all duration-300"
          >
            Home
          </Button>
          <div className="relative group">
            <Button
              onClick={onLogout}
              variant="outline"
              size="sm"
              className="bg-transparent border-gray-600 text-gray-300 hover:bg-red-600 hover:border-red-600 hover:text-white transition-all duration-300 transform hover:scale-105"
              title="Logout"
            >
              <LogOut className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>
            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
              Logout
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserHeader;
