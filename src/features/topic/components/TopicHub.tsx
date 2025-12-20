import React from 'react';
import { ArrowRight, Brain, School, Sparkles, Zap, Layers, ChevronRight } from 'lucide-react';
import { ViewState } from '../types';

interface TopicHubProps {
  onNavigate: (view: ViewState) => void;
}

const TopicHub: React.FC<TopicHubProps> = ({ onNavigate }) => {
  return (
    <div className="h-full overflow-y-auto bg-[#F9FAFB]">
      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* Hero Section */}
        <div className="mb-16 text-center space-y-4">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-xs font-bold tracking-wide mb-2 border border-orange-100">
            <Sparkles className="w-3 h-3 mr-1" />
            AI 驱动的深度学习
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            打破题海战术，<br className="md:hidden"/>回归<span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">思维本质</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto font-light">
            我们为您提炼了学科通法与本地化考情，不仅教你怎么做题，更教你怎么思考。
          </p>
        </div>

        {/* Feature Cards - Modern Bento Grid Style */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          
          {/* Card 1: Method Mastery (Focus on Notes) */}
          <div 
            onClick={() => onNavigate(ViewState.MethodDetail)}
            className="group relative bg-white rounded-3xl p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-50 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="relative z-10">
              <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-orange-100">
                <Brain className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">思维通法专题</h2>
              <p className="text-slate-500 mb-8 leading-relaxed">
                基于数百万道题目的解构，AI 为你生成最精华的<span className="font-semibold text-slate-800">智能讲义</span>。从"核心考点"到"解题通法"，一站式打通思维堵点。
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 group-hover:bg-orange-50/30 group-hover:border-orange-100 transition-colors">
                  <div className="flex items-center">
                     <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mr-3"></span>
                     <span className="text-sm font-medium text-slate-700">数学 · 二次函数动点问题 (热门)</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 opacity-60">
                   <div className="flex items-center">
                     <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mr-3"></span>
                     <span className="text-sm font-medium text-slate-700">物理 · 力学受力分析模型</span>
                   </div>
                   <div className="text-[10px] bg-slate-200 text-slate-500 px-2 py-0.5 rounded">建设中</div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Local Exam (Premium) */}
          <div 
            onClick={() => onNavigate(ViewState.LocalExam)}
            className="group relative bg-slate-900 rounded-3xl p-8 shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden text-white"
          >
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/50 to-transparent"></div>
            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl -mr-20 -mt-20"></div>

            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                  <School className="w-6 h-6 text-blue-300" />
                </div>
                <span className="bg-gradient-to-r from-amber-200 to-yellow-400 text-amber-900 text-xs font-bold px-3 py-1 rounded-full">
                  会员尊享
                </span>
              </div>
              
              <h2 className="text-2xl font-bold mb-2">本地化考情分析</h2>
              <p className="text-slate-300 mb-8 leading-relaxed">
                上传你们学校的试卷，AI 帮你分析出题风格。完全贴合本校考情的<span className="text-white font-semibold">定制化密卷</span>，让每一次月考都更有把握。
              </p>

              <div className="grid grid-cols-2 gap-3">
                 <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <div className="text-2xl font-bold text-blue-400 mb-1">98%</div>
                    <div className="text-xs text-slate-400">出题风格拟合度</div>
                 </div>
                 <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <div className="text-2xl font-bold text-emerald-400 mb-1">3.2k</div>
                    <div className="text-xs text-slate-400">本校真题库</div>
                 </div>
              </div>
            </div>
          </div>

        </div>

        {/* Section: Why use ZhiTu */}
        <div className="border-t border-slate-200 pt-12">
           <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-8 text-center">学习闭环 Methodology</h3>
           <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: Layers, title: "结构化讲义", desc: "AI 自动生成结构清晰的知识图谱，告别碎片化学习。" },
                { icon: Sparkles, title: "个性化分析", desc: "不仅看分数，更看你的知识盲区，精准定位薄弱点。" },
                { icon: Zap, title: "针对性训练", desc: "每一道推送的题目，都是为了解决你当下的思维卡点。" }
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center text-center">
                   <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-700 shadow-sm border border-slate-100 mb-4">
                     <item.icon className="w-5 h-5" />
                   </div>
                   <h4 className="font-bold text-slate-900 mb-2">{item.title}</h4>
                   <p className="text-sm text-slate-500 max-w-xs">{item.desc}</p>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default TopicHub;
