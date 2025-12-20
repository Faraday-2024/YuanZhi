import React, { useState, useRef } from 'react';
import { ChevronLeft, FileText, PlayCircle, Lightbulb, PenTool, Check, RefreshCw, Bookmark, Sparkles, Upload, ExternalLink, Maximize2 } from 'lucide-react';
import { generateTopicContent } from '@shared/services/geminiService';
import { GeneratedProblem } from '../types';
import Latex from './Latex';

interface MethodDetailProps {
  onBack: () => void;
}

const MethodDetail: React.FC<MethodDetailProps> = ({ onBack }) => {
  const [problem, setProblem] = useState<GeneratedProblem | null>(null);
  const [loading, setLoading] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  
  // Tabs: 'ai' (Smart Note) or 'pdf' (Original File)
  const [viewMode, setViewMode] = useState<'ai' | 'pdf'>('ai');
  
  // PDF State - Default to the project PDF
  const [pdfUrl, setPdfUrl] = useState<string | null>('/不定积分计算专题手稿(2).pdf');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGenerateProblem = async () => {
    setLoading(true);
    setShowSolution(false);
    const result = await generateTopicContent("不定积分计算（有理分式或三角换元）");
    setProblem(result);
    setLoading(false);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      const url = URL.createObjectURL(file);
      setPdfUrl(url);
    } else {
      alert("请选择有效的 PDF 文件");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA]">
      
      <div className="flex-1">
        <div className="max-w-7xl mx-auto w-full p-4 md:p-6 flex flex-col md:flex-row gap-6 min-h-screen">
          
          {/* LEFT COLUMN: Main Content (Split View) - 60% width */}
          <div className="md:w-[60%] flex-shrink-0 flex flex-col gap-4">
             {/* Header Navigation & Tabs */}
             <div className="flex items-center justify-between flex-shrink-0">
                <button onClick={onBack} className="flex items-center text-slate-400 hover:text-slate-700 transition-colors text-sm font-medium">
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  返回专题库
                </button>

                <div className="flex bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
                   <button 
                     onClick={() => setViewMode('ai')}
                     className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all flex items-center ${viewMode === 'ai' ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                   >
                     <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                     AI 智能讲义
                   </button>
                   <button 
                     onClick={() => setViewMode('pdf')}
                     className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all flex items-center ${viewMode === 'pdf' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                   >
                     <FileText className="w-3.5 h-3.5 mr-1.5" />
                     原版 PDF
                   </button>
                </div>
             </div>

             {/* Dynamic Content Area */}
             {viewMode === 'ai' ? (
                // AI MODE: Vertical Split Layout
                <div className="flex-1 flex flex-col gap-4">
                   
                   {/* TOP: Scrollable Note Area */}
                   <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden relative flex flex-col">
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-purple-400 z-10"></div>
                      <div className="p-8">
                         {/* Note Header */}
                         <div className="border-b border-slate-100 pb-6 mb-6">
                            <div className="flex items-center space-x-2 mb-3">
                                <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider rounded">高等数学</span>
                                <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-wider rounded">考研重点</span>
                            </div>
                            <h1 className="text-2xl font-serif font-bold text-slate-900 mb-2">
                              不定积分计算体系构建
                            </h1>
                            <div className="flex items-center text-slate-400 text-xs">
                              <FileText className="w-3 h-3 mr-1.5" />
                              <span>AI 深度提炼 (基于 125 页讲义)</span>
                            </div>
                         </div>

                         {/* Note Content */}
                         <div className="space-y-10 text-sm leading-relaxed text-slate-700">
                           <section>
                             <h2 className="text-base font-bold text-slate-900 mb-3 flex items-center">
                               <span className="w-1 h-5 bg-blue-600 rounded-full mr-2"></span>
                               一、有理分式积分 (Rational Integration)
                             </h2>
                             <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 text-slate-600">
                               <p className="mb-2 font-semibold text-slate-800">核心策略：裂项与配凑优先。</p>
                               <ul className="list-disc pl-4 space-y-1">
                                 <li><strong>裂项配凑：</strong> 观察分母导数是否在分子。</li>
                                 <li><strong>部分分式展开：</strong> 对于复杂分式，设为多个简单分式之和。</li>
                               </ul>
                             </div>
                           </section>

                           <section>
                             <h2 className="text-base font-bold text-slate-900 mb-3 flex items-center">
                               <span className="w-1 h-5 bg-purple-600 rounded-full mr-2"></span>
                               二、含根式积分与三角换元
                             </h2>
                             <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div className="bg-white border border-slate-200 rounded-lg p-3 text-center shadow-sm">
                                  <div className="font-serif font-bold text-slate-800 mb-1">√(a²-x²)</div>
                                  <div className="text-xs text-purple-600 bg-purple-50 py-1 rounded">令 x = a·sin(t)</div>
                                </div>
                                <div className="bg-white border border-slate-200 rounded-lg p-3 text-center shadow-sm">
                                  <div className="font-serif font-bold text-slate-800 mb-1">√(a²+x²)</div>
                                  <div className="text-xs text-purple-600 bg-purple-50 py-1 rounded">令 x = a·tan(t)</div>
                                </div>
                                <div className="bg-white border border-slate-200 rounded-lg p-3 text-center shadow-sm">
                                  <div className="font-serif font-bold text-slate-800 mb-1">√(x²-a²)</div>
                                  <div className="text-xs text-purple-600 bg-purple-50 py-1 rounded">令 x = a·sec(t)</div>
                                </div>
                             </div>
                             <div className="mt-3 flex items-start bg-amber-50 p-3 rounded-lg border border-amber-100">
                               <Lightbulb className="w-4 h-4 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                               <span className="text-xs text-amber-900">
                                 <strong>欧拉代换：</strong> 当根式无法配方时，若 a&gt;0，令 √(...) = √a·x+t。
                               </span>
                             </div>
                           </section>

                           <section>
                             <h2 className="text-base font-bold text-slate-900 mb-3 flex items-center">
                               <span className="w-1 h-5 bg-emerald-600 rounded-full mr-2"></span>
                               三、分部积分 (Integration by Parts)
                             </h2>
                             <div className="bg-white border border-slate-200 rounded-lg p-4">
                                <p className="text-xs text-slate-500 mb-3">
                                  口诀：<strong>反对幂指三</strong>。使用表格法可以快速计算。
                                </p>
                                <div className="bg-slate-50 p-3 rounded text-xs text-slate-600">
                                  例如：∫ x²·e^(2x) dx，将 x² 不断求导，e^(2x) 不断积分，交叉相乘求和。
                                </div>
                             </div>
                           </section>
                           
                           <div className="h-4"></div>
                         </div>
                      </div>
                   </div>

                   {/* BOTTOM: Video Player */}
                   <div className="h-96 bg-slate-900 rounded-xl overflow-hidden shadow-lg border border-slate-800 relative group flex-shrink-0">
                      <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent z-20 pointer-events-none">
                         <div className="flex items-center justify-between">
                            <div>
                               <h3 className="text-white font-bold text-sm tracking-wide">第一讲 · 积分技巧顶层设计</h3>
                               <p className="text-slate-400 text-xs">讲师：张宇 (AI 模拟)</p>
                            </div>
                            <div className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                              LIVE
                            </div>
                         </div>
                      </div>

                      <div className="w-full h-full relative">
                          <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-900 to-black flex flex-col items-center justify-center text-white">
                             <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 mb-2 cursor-pointer hover:scale-105 hover:bg-white/20 transition-all shadow-xl group-hover:w-16 group-hover:h-16">
                                <PlayCircle className="w-6 h-6 text-white ml-1 fill-white/20" />
                             </div>
                             <p className="text-xs text-slate-500">点击播放课程视频</p>
                          </div>
                      </div>

                      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/90 to-transparent px-4 flex items-center justify-between z-20">
                         <div className="flex items-center space-x-3 text-white/90">
                            <PlayCircle className="w-4 h-4 cursor-pointer hover:text-white" />
                            <span className="text-[10px] font-mono">12:30 / 45:20</span>
                         </div>
                         <div className="h-1 bg-white/30 rounded-full flex-1 mx-4 relative overflow-hidden cursor-pointer group/progress">
                           <div className="absolute left-0 top-0 bottom-0 w-[30%] group-hover/progress:w-[31%] transition-all bg-blue-500"></div>
                         </div>
                         <div className="flex items-center space-x-3 text-white/90">
                            <span className="text-[10px] font-bold border border-white/30 rounded px-1 cursor-pointer">1.0x</span>
                            <Maximize2 className="w-4 h-4 cursor-pointer hover:text-white" />
                         </div>
                      </div>
                   </div>

                </div>
             ) : (
                // PDF MODE
                <div className="min-h-[800px] bg-slate-900 rounded-xl shadow-sm border border-slate-700 overflow-hidden relative flex flex-col">
                   {!pdfUrl ? (
                      <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8">
                        <Upload className="w-12 h-12 mb-4 opacity-50" />
                        <h3 className="text-white font-bold text-base mb-2">加载本地讲义</h3>
                        <p className="text-sm mb-6 text-center max-w-md">选择本地 PDF 文件进行预览</p>
                        <input type="file" accept=".pdf" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                        <button 
                          onClick={() => fileInputRef.current?.click()}
                          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-sm transition-colors"
                        >
                          选择文件
                        </button>
                      </div>
                   ) : (
                      <div className="flex flex-col h-full">
                         <div className="h-10 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-4 text-white flex-shrink-0">
                            <span className="text-xs text-slate-300 truncate">Preview Mode</span>
                            <div className="flex gap-2">
                                <a href={pdfUrl} target="_blank" rel="noreferrer" className="text-xs bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded flex items-center">
                                  <ExternalLink className="w-3 h-3 mr-1" /> 新窗口
                                </a>
                                <button onClick={() => setPdfUrl(null)} className="text-xs bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded">关闭</button>
                            </div>
                         </div>
                         <iframe src={pdfUrl} className="w-full h-[700px] border-none bg-white" title="PDF"></iframe>
                      </div>
                   )}
                </div>
             )}
          </div>

          {/* RIGHT COLUMN: AI Tutor - 40% width */}
          <div className="md:w-[40%] flex-shrink-0 flex flex-col gap-4">
             {/* AI Problem Card */}
             <div className="bg-slate-900 rounded-2xl p-5 text-white shadow-xl relative overflow-hidden flex-shrink-0">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/30 rounded-full blur-3xl -mt-10 -mr-10"></div>
                 <div className="relative z-10">
                   <div className="flex items-center space-x-2 mb-3">
                      <Sparkles className="w-4 h-4 text-indigo-400" />
                      <h3 className="font-bold text-sm">AI 随堂练</h3>
                   </div>
                   <p className="text-slate-300 text-xs mb-4 leading-relaxed">
                     AI 准备了一道关于<strong>不定积分</strong>的练习题。
                   </p>
                   
                   {!problem ? (
                     <button 
                       onClick={handleGenerateProblem}
                       disabled={loading}
                       className="w-full py-2.5 bg-white text-slate-900 rounded-lg font-bold text-xs hover:bg-slate-100 transition-colors flex items-center justify-center"
                     >
                       {loading ? <RefreshCw className="w-3 h-3 mr-2 animate-spin" /> : <PenTool className="w-3 h-3 mr-2" />}
                       {loading ? 'Thinking...' : '生成题目'}
                     </button>
                   ) : (
                     <div className="space-y-3 animate-fadeIn">
                       <div className="bg-white/10 rounded-lg p-3 border border-white/10">
                         <div className="text-xs font-serif leading-relaxed text-slate-100">
                           <Latex>{problem.question}</Latex>
                         </div>
                       </div>
                       
                       <div className="flex gap-1.5 flex-wrap">
                         {problem.hints.map((hint, i) => (
                           <span key={i} className="text-[10px] bg-indigo-500/20 px-1.5 py-0.5 rounded text-indigo-200 border border-indigo-500/30">
                             <Latex>{hint}</Latex>
                           </span>
                         ))}
                       </div>

                       {!showSolution ? (
                         <button onClick={() => setShowSolution(true)} className="w-full py-2 border border-white/30 rounded-lg text-xs text-white hover:bg-white/10">
                           查看解析
                         </button>
                       ) : (
                          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3">
                             <div className="flex items-center text-emerald-400 mb-1">
                                <Check className="w-3 h-3 mr-1" />
                                <span className="text-[10px] font-bold">参考答案</span>
                             </div>
                             <div className="text-[10px] text-emerald-100 font-mono">
                               <Latex>{problem.solution}</Latex>
                             </div>
                             <button onClick={handleGenerateProblem} className="mt-2 text-[10px] text-emerald-300 underline opacity-80 hover:opacity-100">
                               再练一题
                             </button>
                          </div>
                       )}
                     </div>
                   )}
                 </div>
              </div>

              {/* Review Points Card */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
                <h4 className="font-bold text-slate-800 text-xs mb-3 flex items-center sticky top-0 bg-white pb-2">
                  <Bookmark className="w-3 h-3 mr-2 text-slate-400" />
                  复习要点
                </h4>
                <ul className="text-xs text-slate-500 space-y-2">
                  <li className="flex items-start p-2 bg-slate-50 rounded border border-slate-100">
                    <span className="w-1 h-1 bg-blue-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                    <span>配凑优先级 &gt; 留数法</span>
                  </li>
                  <li className="flex items-start p-2 bg-slate-50 rounded border border-slate-100">
                    <span className="w-1 h-1 bg-blue-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                    <span>区间再现公式</span>
                  </li>
                  <li className="flex items-start p-2 bg-slate-50 rounded border border-slate-100">
                    <span className="w-1 h-1 bg-blue-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                    <span>分部积分: 反对幂指三</span>
                  </li>
                  <li className="flex items-start p-2 bg-slate-50 rounded border border-slate-100">
                    <span className="w-1 h-1 bg-blue-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                    <span>Wallis 公式推广</span>
                  </li>
                </ul>
              </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default MethodDetail;
