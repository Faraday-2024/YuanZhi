// ============================================================================
// Exam Prep Mode Type Definitions
// ============================================================================

export enum AppState {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  GENERATING_VISUAL = 'GENERATING_VISUAL',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR'
}

export interface AnalysisStep {
  stepId: number;
  stepTitle: string;
  stepExplanation: string;
  visualType: 'svg' | 'image' | 'html_3d' | 'none';
  svgCode?: string;
  htmlCode?: string;
  imagePrompt?: string;
  generatedImageUrl?: string;
}

export interface AnalysisResult {
  title: string;
  summary: string;
  steps: AnalysisStep[];
  keyConcepts: string[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
