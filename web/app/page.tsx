import Link from "next/link";
import { getAllQuizzes } from "@/lib/api";

export default async function Home() {
  const quizzes = await getAllQuizzes();
  const categories = [...new Set(quizzes.map(q => q.category))];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-black dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Quizzes Interactivos
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Pon a prueba tus conocimientos en TypeScript, Solidity, Docker y más.
            Aprende mientras te diviertes y reclama certificados NFT.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/quizzes"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
            >
              Comenzar ahora →
            </Link>
            <Link
              href="/certificates"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-800 border-2 border-blue-600 dark:border-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors shadow-lg hover:shadow-xl"
            >
              Ver mis certificados 🏆
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              {quizzes.length}
            </div>
            <div className="text-gray-600 dark:text-gray-400">
              Quizzes Disponibles
            </div>
          </div>
          <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              {categories.length}
            </div>
            <div className="text-gray-600 dark:text-gray-400">
              Categorías
            </div>
          </div>
          <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              {quizzes.reduce((sum, q) => sum + (q.questions?.length || 0), 0)}
            </div>
            <div className="text-gray-600 dark:text-gray-400">
              Preguntas
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Categorías Disponibles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map(category => {
              const categoryQuizzes = quizzes.filter(q => q.category === category);
              const totalQuestions = categoryQuizzes.reduce((sum, q) => sum + (q.questions?.length || 0), 0);

              const categoryIcons: Record<string, string> = {
                typescript: '📘',
                solidity: '⛓️',
                docker: '🐳',
                javascript: '📙',
                react: '⚛️',
                nodejs: '🟢',
              };

              return (
                <Link
                  key={category}
                  href={`/quizzes?category=${category}`}
                  className="group p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl hover:border-blue-500 dark:hover:border-blue-400 transition-all"
                >
                  <div className="text-4xl mb-4">{categoryIcons[category] || '📚'}</div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 capitalize group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {category}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                    {categoryQuizzes.length} quizzes • {totalQuestions} preguntas
                  </p>
                  <div className="text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform inline-flex items-center">
                    Explorar →
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Aprende Haciendo
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Practica con preguntas interactivas y obtén feedback inmediato
            </p>
          </div>
          <div className="text-center p-6">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Sigue tu Progreso
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Ve tus resultados y mejora tus conocimientos
            </p>
          </div>
          <div className="text-center p-6">
            <div className="text-4xl mb-4">🏆</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Múltiples Niveles
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Desde principiante hasta avanzado
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
