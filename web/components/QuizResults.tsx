'use client';

import Link from 'next/link';
import { Quiz } from '@/types/quiz';
import ClaimCertificate from './ClaimCertificate';

interface QuizResultsProps {
  quiz: Quiz;
  score: number;
  totalQuestions: number;
  answers: string[];
}

export default function QuizResults({ quiz, score, totalQuestions, answers }: QuizResultsProps) {
  const percentage = Math.round((score / totalQuestions) * 100);
  const maxScore = quiz.questions.reduce((sum, q) => sum + q.points, 0);

  let resultMessage = '';
  let resultColor = '';

  if (percentage >= 80) {
    resultMessage = '¡Excelente trabajo!';
    resultColor = 'text-green-600 dark:text-green-400';
  } else if (percentage >= 60) {
    resultMessage = '¡Buen trabajo!';
    resultColor = 'text-blue-600 dark:text-blue-400';
  } else if (percentage >= 40) {
    resultMessage = 'Puedes mejorar';
    resultColor = 'text-yellow-600 dark:text-yellow-400';
  } else {
    resultMessage = 'Sigue practicando';
    resultColor = 'text-red-600 dark:text-red-400';
  }

  return (
    <div className="w-full max-w-3xl">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-blue-100 dark:bg-blue-900 mb-4">
          <span className="text-4xl font-bold text-blue-600 dark:text-blue-400">
            {percentage}%
          </span>
        </div>
        <h2 className={`text-3xl font-bold mb-2 ${resultColor}`}>
          {resultMessage}
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Has completado: {quiz.title}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 text-center">
          <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            {score}/{totalQuestions}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Respuestas correctas
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 text-center">
          <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            {quiz.questions.reduce((sum, q, i) => {
              return answers[i] === q.correctAnswer ? sum + q.points : sum;
            }, 0)}/{maxScore}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Puntos obtenidos
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 text-center">
          <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            {percentage}%
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Porcentaje
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Resumen de respuestas
        </h3>
        <div className="space-y-3">
          {quiz.questions.map((question, index) => {
            const isCorrect = answers[index] === question.correctAnswer;
            return (
              <div
                key={index}
                className={`flex items-start p-3 rounded-lg ${
                  isCorrect
                    ? 'bg-green-50 dark:bg-green-900/20'
                    : 'bg-red-50 dark:bg-red-900/20'
                }`}
              >
                <span
                  className={`flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full mr-3 ${
                    isCorrect
                      ? 'bg-green-600 text-white'
                      : 'bg-red-600 text-white'
                  }`}
                >
                  {isCorrect ? '✓' : '✗'}
                </span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Pregunta {index + 1}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {question.question}
                  </p>
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {isCorrect ? `+${question.points}` : '0'} pts
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sección de Certificado NFT */}
      <div className="mb-6">
        <ClaimCertificate quiz={quiz} score={score} totalQuestions={totalQuestions} />
      </div>

      <div className="flex gap-4">
        <Link
          href="/quizzes"
          className="flex-1 flex items-center justify-center h-12 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-medium transition-colors"
        >
          Ver todos los quizzes
        </Link>
        <button
          onClick={() => window.location.reload()}
          className="flex-1 flex items-center justify-center h-12 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
        >
          Reintentar
        </button>
      </div>
    </div>
  );
}
