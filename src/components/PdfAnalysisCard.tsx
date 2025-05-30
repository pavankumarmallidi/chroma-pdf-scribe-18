
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, MessageCircle, BookOpen, Globe, Hash, Type } from "lucide-react";

interface PdfAnalysisData {
  summary: string;
  totalPages: number;
  totalWords: number;
  language: string;
}

interface PdfAnalysisCardProps {
  pdfName: string;
  analysisData: PdfAnalysisData;
  onStartChat: () => void;
  onBackToUpload: () => void;
}

const PdfAnalysisCard = ({ pdfName, analysisData, onStartChat, onBackToUpload }: PdfAnalysisCardProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#16213e] relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/20 via-transparent to-transparent"></div>
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236366f1' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      ></div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4 sm:p-6">
        <Card className="w-full max-w-4xl bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl shadow-black/20 rounded-3xl overflow-hidden">
          <CardHeader className="text-center py-8 px-8 bg-gradient-to-r from-violet-500/10 to-purple-600/10 border-b border-white/10">
            <div className="w-20 h-20 bg-gradient-to-r from-violet-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-violet-500/25">
              <FileText className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold text-white mb-3 tracking-tight">
              PDF Analysis Complete
            </CardTitle>
            <p className="text-xl text-gray-300 font-medium">{pdfName}</p>
            <p className="text-gray-400 mt-2">Your document has been successfully processed and analyzed</p>
          </CardHeader>

          <CardContent className="p-8">
            {/* Summary Section */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="w-6 h-6 text-violet-400" />
                <h3 className="text-xl font-semibold text-white">Summary</h3>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <p className="text-gray-300 leading-relaxed text-lg">
                  {analysisData.summary || "No summary available for this document."}
                </p>
              </div>
            </div>

            {/* Metadata Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/20">
                <div className="flex items-center gap-3 mb-3">
                  <Hash className="w-5 h-5 text-blue-400" />
                  <span className="text-blue-300 font-medium">Pages</span>
                </div>
                <p className="text-2xl font-bold text-white">{analysisData.totalPages}</p>
              </div>

              <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 backdrop-blur-sm rounded-2xl p-6 border border-green-500/20">
                <div className="flex items-center gap-3 mb-3">
                  <Type className="w-5 h-5 text-green-400" />
                  <span className="text-green-300 font-medium">Words</span>
                </div>
                <p className="text-2xl font-bold text-white">{analysisData.totalWords.toLocaleString()}</p>
              </div>

              <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20">
                <div className="flex items-center gap-3 mb-3">
                  <Globe className="w-5 h-5 text-purple-400" />
                  <span className="text-purple-300 font-medium">Language</span>
                </div>
                <p className="text-2xl font-bold text-white capitalize">{analysisData.language}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={onStartChat}
                className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-lg py-6 px-8"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Start Chatting with Document
              </Button>
              
              <Button
                onClick={onBackToUpload}
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/30 backdrop-blur-sm text-lg py-6 px-8"
              >
                Upload Another PDF
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PdfAnalysisCard;
