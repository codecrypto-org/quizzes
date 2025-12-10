import Link from 'next/link';
import { Quiz } from '@/types/quiz';

interface QuizCardProps {
  quiz: Quiz;
}

const difficultyColors = {
  beginner: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  intermediate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  advanced: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

const categoryColors = {
  typescript: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  solidity: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  docker: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200',
  javascript: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
  react: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
  nodejs: 'bg-lime-100 text-lime-800 dark:bg-lime-900 dark:text-lime-200',
};

export default function QuizCard({ quiz }: QuizCardProps) {
  return (
    <Link href={`/quizzes/${quiz.id}`}>
      <div className="group cursor-pointer rounded-lg border border-gray-200 p-6 transition-all hover:shadow-lg hover:border-gray-300 dark:border-gray-800 dark:hover:border-gray-700 bg-white dark:bg-gray-900">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {quiz.title}
          </h3>
        </div>

        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
          {quiz.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${categoryColors[quiz.category]}`}>
            {quiz.category}
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${difficultyColors[quiz.difficulty]}`}>
            {quiz.difficulty}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <span>{quiz.questions?.length || 0} preguntas</span>
          <span className="text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform">
            Comenzar →
          </span>
        </div>
      </div>
    </Link>
  );
}
