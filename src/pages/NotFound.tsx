import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import Button from '@shared/components/Button';

/**
 * 404 Not Found Page
 */
const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
      <div className="max-w-md w-full text-center space-y-8">
        {/* 404 Illustration */}
        <div className="relative">
          <h1 className="text-9xl font-bold text-slate-200">404</h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center">
              <span className="text-4xl">🤔</span>
            </div>
          </div>
        </div>

        {/* Message */}
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-slate-900">页面未找到</h2>
          <p className="text-slate-600">
            抱歉，您访问的页面不存在或已被移除
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="outline"
            icon={<ArrowLeft size={18} />}
            onClick={() => navigate(-1)}
          >
            返回上一页
          </Button>
          <Button
            variant="primary"
            icon={<Home size={18} />}
            onClick={() => navigate('/')}
          >
            返回首页
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
