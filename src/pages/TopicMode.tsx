import React, { useState } from 'react';
import { ViewState } from '../features/topic/types';
import TopicHub from '../features/topic/components/TopicHub';
import MethodDetail from '../features/topic/components/MethodDetail';
import LocalExam from '../features/topic/components/LocalExam';

/**
 * Topic Mode Page
 * Manages view state for topic learning mode
 */
const TopicMode: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.Dashboard);

  const renderContent = () => {
    switch (currentView) {
      case ViewState.Dashboard:
        return <TopicHub onNavigate={setCurrentView} />;
      case ViewState.MethodDetail:
        return <MethodDetail onBack={() => setCurrentView(ViewState.Dashboard)} />;
      case ViewState.LocalExam:
        return <LocalExam onBack={() => setCurrentView(ViewState.Dashboard)} />;
      default:
        return <TopicHub onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="h-screen bg-[#FDFDFD] font-sans text-slate-800 pt-16">
      {renderContent()}
    </div>
  );
};

export default TopicMode;
