// ============================================================================
// Topic Mode Type Definitions
// ============================================================================

export enum Difficulty {
  Basic = 'Basic',
  Intermediate = 'Intermediate',
  Advanced = 'Advanced'
}

export interface Topic {
  id: string;
  title: string;
  subject: string;
  description: string;
  difficulty: Difficulty;
  progress: number;
  imageUrl: string;
}

export interface ExamStat {
  subject: string;
  score: number;
  classAverage: number;
  gradeAverage: number;
  date: string;
}

export interface GeneratedProblem {
  question: string;
  hints: string[];
  solution: string;
}

export enum ViewState {
  Dashboard = 'Dashboard',
  MethodDetail = 'MethodDetail',
  LocalExam = 'LocalExam'
}
