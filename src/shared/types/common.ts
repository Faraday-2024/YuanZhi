// ============================================================================
// Global Type Definitions
// ============================================================================

import { AnalysisResult } from '../services/geminiService';

// Mode Types
export enum ModeType {
  HOME = 'home',
  EXAM_PREP = 'exam-prep',
  TOPIC = 'topic',
  EXPLORATION = 'exploration'
}

// Application Configuration
export interface AppConfig {
  apiKey: string;
  enableAnalytics: boolean;
  theme: 'light' | 'dark' | 'auto';
}

// User Progress Tracking
export interface UserProgress {
  examPrepHistory: ExamPrepSession[];
  topicProgress: TopicProgress[];
  explorationProgress: ExplorationProgress;
  lastUpdated: number;
}

export interface ExamPrepSession {
  id: string;
  timestamp: number;
  imageUrl: string;
  result: AnalysisResult;
}

export interface TopicProgress {
  topicId: string;
  completedLessons: string[];
  score: number;
  lastAccessed: number;
}

export interface ExplorationProgress {
  completedScenes: string[];
  tychoTrust: number;
  dataHeistSuccess: boolean;
  lastScene: string;
}

// Route Configuration
export interface RouteConfig {
  path: string;
  title: string;
  description: string;
  icon?: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Loading States
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

// Generic Error Type
export interface AppError {
  message: string;
  code?: string;
  retryable?: boolean;
}
