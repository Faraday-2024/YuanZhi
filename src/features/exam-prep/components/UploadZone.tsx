import React, { useRef } from 'react';
import { Camera, Upload, Sparkles, BookOpen } from 'lucide-react';

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
}

const UploadZone: React.FC<UploadZoneProps> = ({ onFileSelect }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
      <div className="max-w-md w-full text-center space-y-12">
        
        <div className="space-y-4 animate-fadeIn">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600 text-white shadow-xl mb-4">
            <BookOpen size={32} />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
            备考模式
            <span className="block text-lg font-medium text-indigo-600 mt-2">AI 智能助考系统</span>
          </h1>
          <p className="text-slate-500 text-lg">
            上传题目，获取 Gemini AI 深度思考后的可视化全解。
          </p>
        </div>

        <div className="relative group cursor-pointer" onClick={triggerUpload}>
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-200"></div>
          <div className="relative bg-white rounded-2xl p-10 shadow-2xl border border-slate-100 flex flex-col items-center gap-6 hover:scale-[1.02] transition-transform duration-200">
            <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center">
              <Camera size={40} />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-800">拍照或上传题目</h3>
              <p className="text-sm text-slate-400">支持数学、物理、化学及各类理科题目</p>
            </div>
            
            <button className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-full shadow-lg flex items-center gap-2 transition-colors">
              <Upload size={18} />
              选择图片
            </button>
          </div>
        </div>

        <div className="flex justify-center gap-6 text-xs text-slate-400 font-medium">
          <span className="flex items-center gap-1"><Sparkles size={12} className="text-yellow-500"/> Gemini AI</span>
          <span className="flex items-center gap-1"><Sparkles size={12} className="text-purple-500"/> Visual Learning</span>
        </div>

      </div>
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />
    </div>
  );
};

export default UploadZone;
