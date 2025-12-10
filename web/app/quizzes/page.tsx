import { getAllQuizzes } from '@/lib/api';
import QuizCard from '@/components/QuizCard';
import Link from 'next/link';

export default async function QuizzesPage() {
  const quizzes = await getAllQuizzes();

  const categories = [...new Set(quizzes.map(q => q.category))];
  const difficulties = ['beginner', 'intermediate', 'advanced'] as const;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <Link
            href="/"
            className="text-blue-600 dark:text-blue-400 hover:underline mb-4 inline-block"
          >
            ← Volver al inicio
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Quizzes Disponibles
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Pon a prueba tus conocimientos con nuestros quizzes interactivos
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-800">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              {quizzes.length}
            </div>
            <div className="text-gray-600 dark:text-gray-400">
              Quizzes disponibles
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-800">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              {categories.length}
            </div>
            <div className="text-gray-600 dark:text-gray-400">
              Categorías
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-800">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              {quizzes.reduce((sum, q) => sum + (q.questions?.length || 0), 0)}
            </div>
            <div className="text-gray-600 dark:text-gray-400">
              Preguntas totales
            </div>
          </div>
        </div>

        {/* Categories */}
        {categories.map(category => {
          const categoryQuizzes = quizzes.filter(q => q.category === category);

          return (
            <div key={category} className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 capitalize">
                {category}
              </h2>

              {difficulties.map(difficulty => {
                const filteredQuizzes = categoryQuizzes.filter(q => q.difficulty === difficulty);

                if (filteredQuizzes.length === 0) return null;

                return (
                  <div key={difficulty} className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4 capitalize">
                      {difficulty}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredQuizzes.map(quiz => (
                        <QuizCard key={quiz.id} quiz={quiz} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}

        {quizzes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              No hay quizzes disponibles en este momento.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
