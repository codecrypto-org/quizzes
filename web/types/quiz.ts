export interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  points: number;
}

export interface Quiz {
  id: number;
  title: string;
  description: string;
  category: 'typescript' | 'solidity' | 'docker' | 'javascript' | 'react' | 'nodejs';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  questions: Question[];
  slug: string;
  tags?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface QuizState {
  currentQuestion: number;
  answers: string[];
  score: number;
  isComplete: boolean;
  showResults: boolean;
}
