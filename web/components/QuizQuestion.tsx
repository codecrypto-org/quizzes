'use client';

import { Question } from '@/types/quiz';

interface QuizQuestionProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  selectedAnswer: string | null;
  onSelectAnswer: (answer: string) => void;
  showResult: boolean;
}

export default function QuizQuestion({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  onSelectAnswer,
  showResult,
}: QuizQuestionProps) {
  const isCorrect = selectedAnswer === question.correctAnswer;

  return (
    <div className="w-full max-w-3xl">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Pregunta {questionNumber} de {totalQuestions}
          </span>
          <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
            {question.points} puntos
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
        {question.question}
      </h2>

      <div className="space-y-3">
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === option;
          const isCorrectOption = option === question.correctAnswer;

          let buttonClasses = 'w-full text-left p-4 rounded-lg border-2 transition-all ';

          if (!showResult) {
            buttonClasses += isSelected
              ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400'
              : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600';
          } else {
            if (isCorrectOption) {
              buttonClasses += 'border-green-600 bg-green-50 dark:bg-green-900/20 dark:border-green-400';
            } else if (isSelected && !isCorrect) {
              buttonClasses += 'border-red-600 bg-red-50 dark:bg-red-900/20 dark:border-red-400';
            } else {
              buttonClasses += 'border-gray-200 dark:border-gray-700';
            }
          }

          return (
            <button
              key={index}
              onClick={() => !showResult && onSelectAnswer(option)}
              disabled={showResult}
              className={buttonClasses}
            >
              <div className="flex items-center">
                <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full border-2 border-current mr-3">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="text-gray-900 dark:text-white">{option}</span>
                {showResult && isCorrectOption && (
                  <span className="ml-auto text-green-600 dark:text-green-400">✓</span>
                )}
                {showResult && isSelected && !isCorrect && (
                  <span className="ml-auto text-red-600 dark:text-red-400">✗</span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {showResult && (
        <div className="mt-6 p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
            {isCorrect ? '¡Correcto!' : 'Incorrecto'}
          </h3>
          <p className="text-gray-700 dark:text-gray-300">{question.explanation}</p>
        </div>
      )}
    </div>
  );
}
