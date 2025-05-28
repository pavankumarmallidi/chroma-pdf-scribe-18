
import { Card } from "@/components/ui/card";
import { FileText } from "lucide-react";

interface PdfAnalysisData {
  summary: string;
  totalPages: number;
  totalWords: number;
  language: string;
}

interface DocumentSidebarProps {
  pdfAnalysisData: PdfAnalysisData;
}

const DocumentSidebar = ({ pdfAnalysisData }: DocumentSidebarProps) => {
  return (
    <div className="lg:col-span-1 order-2 lg:order-1">
      <Card className="bg-[#1e1e1e]/50 border-gray-700 shadow-2xl backdrop-blur-sm h-full">
        <div className="p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] flex items-center justify-center">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white">Document Summary</h2>
          </div>
          
          <div className="space-y-3 sm:space-y-4">
            <div className="p-3 sm:p-4 rounded-xl bg-[#2a2a2a]/50 border border-gray-600/30 backdrop-blur-sm">
              <h3 className="text-[#6366f1] font-semibold mb-2 sm:mb-3 text-xs sm:text-sm uppercase tracking-wide">Analysis</h3>
              <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                {pdfAnalysisData.summary}
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-2 sm:gap-3">
              <div className="p-3 sm:p-4 rounded-xl bg-gradient-to-r from-[#6366f1]/10 to-[#8b5cf6]/10 border border-[#6366f1]/20 backdrop-blur-sm">
                <p className="text-gray-300 text-xs mb-1 uppercase tracking-wide">Pages</p>
                <p className="text-[#6366f1] font-bold text-xl sm:text-2xl">{pdfAnalysisData.totalPages}</p>
              </div>
              <div className="p-3 sm:p-4 rounded-xl bg-gradient-to-r from-[#8b5cf6]/10 to-[#6366f1]/10 border border-[#8b5cf6]/20 backdrop-blur-sm">
                <p className="text-gray-300 text-xs mb-1 uppercase tracking-wide">Words</p>
                <p className="text-white font-bold text-xl sm:text-2xl">{pdfAnalysisData.totalWords.toLocaleString()}</p>
              </div>
              <div className="p-3 sm:p-4 rounded-xl bg-[#2a2a2a]/50 border border-gray-600/30 backdrop-blur-sm">
                <p className="text-gray-300 text-xs mb-1 uppercase tracking-wide">Language</p>
                <p className="text-white font-semibold text-base sm:text-lg">{pdfAnalysisData.language}</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DocumentSidebar;
