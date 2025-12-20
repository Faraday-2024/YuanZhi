import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnalysisResult, AnalysisStep, AppState } from '../types';
import MarkdownRenderer from './MarkdownRenderer';
import { ArrowLeft, Activity, Image as ImageIcon, ChevronDown, ChevronUp, Layers, CheckCircle, Rotate3D, BookOpen } from 'lucide-react';
import { createTutorSession } from '@shared/services/geminiService';
import { ROUTES } from '@/config/constants';
import ChatWidget from './ChatWidget';

interface ResultViewProps {
  originalImage: string;
  analysis: AnalysisResult | null;
  state: AppState;
  onReset: () => void;
}

const ResultView: React.FC<ResultViewProps> = ({ 
  originalImage, 
  analysis, 
  state, 
  onReset 
}) => {
  const navigate = useNavigate();
  // Only expand when analysis is complete
  const [isOriginalExpanded, setIsOriginalExpanded] = useState(false);
  const [chatSession, setChatSession] = useState<any>(null);

  const isLoading = state === AppState.ANALYZING || state === AppState.GENERATING_VISUAL;

  // Auto-expand when analysis is complete
  useEffect(() => {
    if (state === AppState.COMPLETE && analysis) {
      setIsOriginalExpanded(true);
    }
  }, [state, analysis]);

  useEffect(() => {
    if (analysis && state === AppState.COMPLETE) {
      createTutorSession(analysis).then(session => {
        setChatSession(session);
      }).catch(err => console.error("Failed to init chat", err));
    }
  }, [analysis, state]);

  const handleSendMessage = async (text: string): Promise<string> => {
    if (!chatSession) return "聊天服务正在初始化，请稍等...";
    try {
      const result = await chatSession.sendMessage({ message: text });
      return result.text || "我无法理解您的问题，请重试。";
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  const renderVisual = (step: AnalysisStep) => {
    if (step.visualType === 'html_3d' && step.htmlCode) {
      return (
        <div className="mt-4 mb-2 bg-slate-50 rounded-xl border border-slate-200 shadow-sm overflow-hidden group">
           <div className="bg-slate-100 px-3 py-1.5 text-[10px] text-indigo-600 border-b border-slate-200 flex items-center justify-between">
             <div className="flex items-center gap-1">
               <Rotate3D size={12} className="text-indigo-600" /> 
               <span className="font-semibold">3D 交互 / 物理仿真</span>
             </div>
             <span className="text-slate-400">可拖动 / 自动演示</span>
           </div>
           <div className="w-full h-64 md:h-80 relative bg-[#f8fafc]">
             <iframe 
               title={`visual-${step.stepId}`}
               srcDoc={step.htmlCode}
               className="w-full h-full border-0"
               sandbox="allow-scripts allow-popups allow-forms allow-same-origin"
             />
             <div className="absolute top-2 right-2 pointer-events-none">
                <span className="px-2 py-1 bg-black/10 backdrop-blur rounded text-[10px] text-slate-500">
                  Interactive
                </span>
             </div>
           </div>
        </div>
      );
    }

    if (step.visualType === 'svg' && step.svgCode) {
      return (
        <div className="mt-4 mb-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden group">
           <div className="bg-slate-50 px-3 py-1 text-[10px] text-slate-500 border-b border-slate-100 flex items-center gap-1">
             <Activity size={10} className="text-indigo-500" /> 
             <span>动态演示 (SVG Engine)</span>
           </div>
           <div 
             className="w-full p-4 flex justify-center [&>svg]:w-full [&>svg]:max-w-md [&>svg]:h-auto"
             dangerouslySetInnerHTML={{ __html: step.svgCode }} 
           />
        </div>
      );
    }

    if (step.visualType === 'image' && step.generatedImageUrl) {
      return (
        <div className="mt-4 mb-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-slate-50 px-3 py-1 text-[10px] text-slate-500 border-b border-slate-100 flex items-center gap-1">
             <ImageIcon size={10} className="text-purple-500" /> 
             <span>AI 生成图示 (Generative)</span>
           </div>
          <img src={step.generatedImageUrl} alt="Visual Aid" className="w-full h-auto object-cover max-h-80" />
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <button 
          onClick={onReset}
          className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 transition-colors font-medium text-sm"
        >
          <ArrowLeft size={18} />
          <span>返回</span>
        </button>
        <div className="text-center">
          <h1 className="text-sm font-bold text-slate-800">
             {analysis?.title || (isLoading ? "智能解析中..." : "解析结果")}
          </h1>
        </div>
        <div className="w-8"></div>
      </header>

      <main className="flex-1 overflow-auto relative">
        <div className="max-w-3xl mx-auto p-4 md:p-8 space-y-8 pb-32">
          
          {/* Original Problem Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-all duration-300">
            <div 
              className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex justify-between items-center cursor-pointer hover:bg-slate-100"
              onClick={() => setIsOriginalExpanded(!isOriginalExpanded)}
            >
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <Layers size={14} /> 原始题目
              </span>
              {isOriginalExpanded ? <ChevronUp size={16} className="text-slate-400"/> : <ChevronDown size={16} className="text-slate-400"/>}
            </div>
            {isOriginalExpanded && (
               <div className="p-4 flex justify-center bg-slate-100/50 animate-fadeIn">
                 <img src={originalImage} alt="Original Problem" className="max-h-64 object-contain rounded-lg" />
               </div>
            )}
            {!isOriginalExpanded && (
              <div className="h-1 bg-indigo-500 w-full opacity-10"></div>
            )}
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="py-20 flex flex-col items-center justify-center space-y-6 text-center">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-slate-200 rounded-full"></div>
                <div className="w-16 h-16 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin absolute top-0 left-0"></div>
              </div>
              <div className="space-y-2">
                 <h3 className="text-lg font-medium text-slate-800 animate-pulse">
                   {state === AppState.ANALYZING ? 'Gemini AI 正在深度拆解...' : '正在绘制教学图示...'}
                 </h3>
                 <p className="text-sm text-slate-400">AI Thinking Process</p>
              </div>
            </div>
          )}

          {/* Result Content */}
          {analysis && !isLoading && (
            <div className="space-y-8 animate-fadeIn">
              
              {/* Summary */}
              <div className="bg-gradient-to-br from-indigo-50 to-white rounded-2xl p-6 border border-indigo-100 shadow-sm">
                 <h2 className="text-lg font-bold text-indigo-900 mb-2">💡 核心思路</h2>
                 <p className="text-slate-700 leading-relaxed">{analysis.summary}</p>
                 <div className="mt-4 flex flex-wrap gap-2">
                   {analysis.keyConcepts.map((tag, i) => (
                     <span key={i} className="px-2.5 py-0.5 bg-white border border-indigo-100 text-indigo-600 text-xs rounded-full font-medium">
                       {tag}
                     </span>
                   ))}
                 </div>
              </div>

              {/* Steps Timeline */}
              <div className="relative pl-4 md:pl-8 border-l-2 border-slate-200 space-y-12">
                {analysis.steps.map((step, index) => (
                  <div key={index} className="relative">
                    <div className="absolute -left-[25px] md:-left-[41px] top-0 w-8 h-8 rounded-full bg-white border-2 border-indigo-500 flex items-center justify-center text-indigo-700 font-bold text-sm shadow-sm z-10">
                      {index + 1}
                    </div>

                    <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-slate-100">
                      <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                        {step.stepTitle}
                      </h3>
                      
                      <MarkdownRenderer content={step.stepExplanation} />
                      
                      {renderVisual(step)}
                    </div>
                  </div>
                ))}

                <div className="relative">
                   <div className="absolute -left-[25px] md:-left-[41px] top-0 w-8 h-8 rounded-full bg-green-500 border-2 border-white flex items-center justify-center text-white shadow-sm z-10">
                      <CheckCircle size={16} />
                   </div>
                   <div className="pt-1 pl-1 text-slate-400 font-medium text-sm">解析完成</div>
                </div>
              </div>

              {/* Bottom Action Buttons */}
              <div className="flex flex-col md:flex-row justify-center gap-4 pt-8 pb-4">
                <button
                  onClick={onReset}
                  className="flex-1 max-w-md px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center justify-center gap-3"
                >
                  <ImageIcon size={20} />
                  <span>再拍一题</span>
                </button>
                <button
                  onClick={() => navigate(ROUTES.TOPIC)}
                  className="flex-1 max-w-md px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center justify-center gap-3"
                >
                  <BookOpen size={20} />
                  <span>学习相应专题</span>
                </button>
              </div>

            </div>
          )}
        </div>
        
        {analysis && !isLoading && (
          <ChatWidget onSendMessage={handleSendMessage} />
        )}

      </main>
    </div>
  );
};

export default ResultView;
