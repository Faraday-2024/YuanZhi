// Application constants

export const APP_NAME = '元知';
export const APP_NAME_EN = 'YuanZhi';
export const APP_DESCRIPTION = '解决学习中遇到的任何困难，提供智能辅助学习体验。';

// API Configuration
export const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
export const USE_OPENAI_COMPATIBLE = import.meta.env.VITE_USE_OPENAI_COMPATIBLE === 'true';
export const OPENAI_API_BASE = import.meta.env.VITE_OPENAI_API_BASE || 'https://xh.v1api.cc';
export const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || '';

// Model names
export const GEMINI_TEXT_MODEL = 'gemini-2.0-flash-exp';
export const GEMINI_IMAGE_MODEL = 'gemini-2.0-flash-exp';
export const OPENAI_MODEL = 'gemini-2.5-pro'; // Gemini 2.5 Pro via OpenAI compatible API

// Route paths
export const ROUTES = {
  HOME: '/',
  EXAM_PREP: '/exam-prep',
  TOPIC: '/topic',
  EXPLORATION: '/exploration',
} as const;

// Mode metadata
export const MODE_METADATA = {
  EXAM_PREP: {
    id: 'exam-prep',
    title: '智能搜题',
    titleEn: 'Problem Solver',
    description: '上传题目图片，获得详细的解题步骤和可视化辅助',
    color: 'exam-primary',
    path: ROUTES.EXAM_PREP,
  },
  TOPIC: {
    id: 'topic',
    title: '专题模式',
    titleEn: 'Topic Mode',
    description: '系统化学习知识专题，掌握核心概念和方法',
    color: 'topic-primary',
    path: ROUTES.TOPIC,
  },
  EXPLORATION: {
    id: 'exploration',
    title: '探索模式',
    titleEn: 'Exploration Mode',
    description: '沉浸式科学历史体验，通过互动理解科学发展',
    color: 'exploration-primary',
    path: ROUTES.EXPLORATION,
  },
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  USER_PROGRESS: 'yuanzhi_user_progress',
  EXAM_PREP_HISTORY: 'yuanzhi_exam_prep_history',
  TOPIC_PROGRESS: 'yuanzhi_topic_progress',
  EXPLORATION_PROGRESS: 'yuanzhi_exploration_progress',
  APP_CONFIG: 'yuanzhi_app_config',
} as const;

// Error messages
export const ERROR_MESSAGES = {
  API_KEY_MISSING: '请在.env.local文件中配置VITE_GEMINI_API_KEY',
  NETWORK_ERROR: '网络连接失败，请检查网络设置',
  API_ERROR: 'API调用失败，请稍后重试',
  FILE_TOO_LARGE: '文件过大，请选择小于10MB的图片',
  INVALID_FILE_TYPE: '不支持的文件类型，请上传图片文件',
} as const;
