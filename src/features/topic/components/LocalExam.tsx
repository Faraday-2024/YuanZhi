import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { UploadCloud, FileText, Lock, TrendingUp, School, ChevronLeft, AlertCircle } from 'lucide-react';

const data = [
  { name: '第一次月考', score: 85, avg: 78 },
  { name: '期中考试', score: 82, avg: 75 },
  { name: '第二次月考', score: 91, avg: 79 },
  { name: '期末模拟', score: 94, avg: 81 },
];

interface LocalExamProps {
  onBack: () => void;
}

const LocalExam: React.FC<LocalExamProps> = ({ onBack }) => {
  return (
    <div className="h-full bg-[#F8F9FA] overflow-y-auto">
       <div className="max-w-6xl mx-auto px-6 py-10">
         
         <button onClick={onBack} className="flex items-center text-slate-400 hover:text-slate-700 transition-colors mb-8 text-sm font-medium">
            <ChevronLeft className="w-4 h-4 mr-1" />
            返回首页
         </button>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           
           {/* Header & Main Upload Area */}
           <div className="lg:col-span-3">
              <div className="flex flex-col md:flex-row justify-between items-end mb-8">
                <div>
                  <h1 className="text-3xl font-extrabold text-slate-900 mb-2">本地化考情分析</h1>
                  <p className="text-slate-500">
                    基于北京四中、人大附中等名校历年真题库，AI 深度还原出题逻辑。
                  </p>
                </div>
                <div className="mt-4 md:mt-0 px-3 py-1 bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 rounded-full text-xs font-bold border border-amber-200 flex items-center">
                  <Lock className="w-3 h-3 mr-1" />
                  高级会员功能
                </div>
              </div>

              {/* Selector Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row gap-4 items-center">
                 <div className="flex-1 w-full">
                    <label className="text-xs font-bold text-slate-400 mb-1.5 block">选择学校</label>
                    <div className="relative">
                      <School className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <select className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-blue-500 transition-colors appearance-none">
                        <option>北京四中 (本部)</option>
                        <option>人大附中</option>
                        <option>清华附中</option>
                      </select>
                    </div>
                 </div>
                 <div className="flex-1 w-full">
                    <label className="text-xs font-bold text-slate-400 mb-1.5 block">目标考试</label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <select className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-blue-500 transition-colors appearance-none">
                        <option>高一 · 上学期 · 期末考试</option>
                        <option>高二 · 下学期 · 期中考试</option>
                      </select>
                    </div>
                 </div>
                 <div className="w-full md:w-auto mt-auto pt-5 md:pt-0">
                    <button className="w-full md:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg shadow-blue-200 transition-all text-sm">
                      开始分析
                    </button>
                 </div>
              </div>
           </div>

           {/* Left: Charts */}
           <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                 <div className="flex justify-between items-center mb-6">
                   <h3 className="font-bold text-slate-800 flex items-center">
                     <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
                     校内排名趋势
                   </h3>
                 </div>
                 <div className="h-64">
                   <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={data}>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                       <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                       <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                       <Tooltip 
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} 
                          cursor={{fill: '#f8fafc'}}
                       />
                       <Bar dataKey="score" name="我的成绩" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={24} />
                       <Bar dataKey="avg" name="年级平均" fill="#e2e8f0" radius={[4, 4, 0, 0]} barSize={24} />
                     </BarChart>
                   </ResponsiveContainer>
                 </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h3 className="font-bold text-slate-800 mb-4">本校高频考点 (AI 识别)</h3>
                <div className="space-y-4">
                  {[
                    { name: '二次函数动点 (必考)', score: 65, color: 'bg-red-500' },
                    { name: '三角恒等变换', score: 78, color: 'bg-amber-500' },
                    { name: '平面向量', score: 92, color: 'bg-emerald-500' }
                  ].map((item) => (
                    <div key={item.name}>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="font-medium text-slate-700">{item.name}</span>
                        <span className="text-slate-500">掌握度 {item.score}%</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.score}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
           </div>

           {/* Right: Actions */}
           <div className="space-y-6">
              
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-xl p-6 text-white relative overflow-hidden group cursor-pointer">
                 <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl -mt-10 -mr-10 transition-all group-hover:bg-blue-500/30"></div>
                 
                 <div className="relative z-10">
                   <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-4 border border-white/10">
                     <FileText className="w-6 h-6 text-blue-300" />
                   </div>
                   <h3 className="font-bold text-lg mb-2">生成「北京四中」风格模拟卷</h3>
                   <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                     AI 已分析该校过去 3 年期末试卷，预测本次考试有 85% 概率考察 "参数取值范围"。
                   </p>
                   <button className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-sm transition-colors flex items-center justify-center">
                     <Lock className="w-3 h-3 mr-2" />
                     立即生成试卷
                   </button>
                 </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 border-dashed border-2 hover:border-blue-200 transition-colors cursor-pointer text-center py-10 group">
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <UploadCloud className="w-8 h-8 text-blue-500" />
                  </div>
                  <h3 className="font-bold text-slate-800 text-sm">上传最近试卷</h3>
                  <p className="text-xs text-slate-400 mt-2 px-4">
                    拍照或上传 PDF，AI 自动整理错题并分析考点。
                  </p>
              </div>

           </div>

         </div>
       </div>
    </div>
  );
};

export default LocalExam;
