import React, { createContext, useContext, ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { AppConfig, UserProgress, ModeType } from '../types/common';

interface AppContextType {
  config: AppConfig;
  updateConfig: (config: Partial<AppConfig>) => void;
  userProgress: UserProgress;
  updateUserProgress: (progress: Partial<UserProgress>) => void;
  currentMode: ModeType;
  setCurrentMode: (mode: ModeType) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const getApiKey = (): string => {
  try {
    return import.meta.env?.VITE_GEMINI_API_KEY || '';
  } catch {
    return '';
  }
};

const defaultConfig: AppConfig = {
  apiKey: getApiKey(),
  enableAnalytics: false,
  theme: 'light',
};

const defaultProgress: UserProgress = {
  examPrepHistory: [],
  topicProgress: [],
  explorationProgress: {
    completedScenes: [],
    tychoTrust: 0,
    dataHeistSuccess: false,
    lastScene: '',
  },
  lastUpdated: Date.now(),
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [config, setConfig] = useLocalStorage<AppConfig>('yuanzhi-config', defaultConfig);
  const [userProgress, setUserProgress] = useLocalStorage<UserProgress>('yuanzhi-progress', defaultProgress);
  const [currentMode, setCurrentMode] = useLocalStorage<ModeType>('yuanzhi-current-mode', ModeType.HOME);

  const updateConfig = (newConfig: Partial<AppConfig>) => {
    setConfig({ ...config, ...newConfig });
  };

  const updateUserProgress = (newProgress: Partial<UserProgress>) => {
    setUserProgress({
      ...userProgress,
      ...newProgress,
      lastUpdated: Date.now(),
    });
  };

  return (
    <AppContext.Provider
      value={{
        config,
        updateConfig,
        userProgress,
        updateUserProgress,
        currentMode,
        setCurrentMode,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};
