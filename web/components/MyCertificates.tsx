'use client';

import { useState, useEffect } from 'react';
import { getCertificatesOf, getCertificateData, CertificateData } from '@/lib/certificate';
import CertificateSVG from './CertificateSVG';

interface Certificate extends CertificateData {
  tokenId: string;
}

export default function MyCertificates() {
  const [walletAddress, setWalletAddress] = useState('');
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCertificates = async () => {
    if (!walletAddress) {
      setError('Por favor ingresa una dirección de wallet');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const tokenIds = await getCertificatesOf(walletAddress);

      if (tokenIds.length === 0) {
        setCertificates([]);
        setIsLoading(false);
        return;
      }

      const certsData = await Promise.all(
        tokenIds.map(async (tokenId) => {
          const data = await getCertificateData(tokenId);
          return {
            ...data,
            tokenId: tokenId.toString(),
          };
        })
      );

      setCertificates(certsData);
    } catch (err: any) {
      setError(err.message || 'Error al cargar certificados');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-800 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Mis Certificados NFT
        </h2>

        <div className="flex gap-4">
          <input
            type="text"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            placeholder="Dirección de wallet (0x...)"
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
          />
          <button
            onClick={loadCertificates}
            disabled={isLoading || !walletAddress}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
          >
            {isLoading ? 'Cargando...' : 'Buscar'}
          </button>
        </div>

        {error && (
          <div className="mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
            <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}
      </div>

      {certificates.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certificates.map((cert) => {
            const percentage = Math.round((cert.score / cert.totalQuestions) * 100);
            const scoreColor =
              percentage >= 80
                ? 'text-green-600 dark:text-green-400'
                : percentage >= 60
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-yellow-600 dark:text-yellow-400';

            return (
              <div
                key={cert.tokenId}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* SVG Preview */}
                <div className="bg-gray-900 p-4 flex items-center justify-center">
                  <CertificateSVG
                    certificate={cert}
                    tokenId={cert.tokenId}
                    className="w-full max-w-sm"
                  />
                </div>

                {/* Certificate Info */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                        {cert.quizName}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Token #{cert.tokenId}
                      </p>
                    </div>
                    <div className="text-2xl">🏆</div>
                  </div>

                  <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Puntaje:</span>
                    <span className={`text-xl font-bold ${scoreColor}`}>
                      {cert.score}/{cert.totalQuestions}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Porcentaje:</span>
                    <span className={`text-lg font-semibold ${scoreColor}`}>{percentage}%</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                      cert.difficulty
                    )}`}
                  >
                    {cert.difficulty}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 capitalize">
                    {cert.category}
                  </span>
                </div>

                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Emitido el {formatDate(cert.timestamp)}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      Soulbound Token - No transferible
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!isLoading && walletAddress && certificates.length === 0 && !error && (
        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8 text-center">
          <div className="text-6xl mb-4">🎓</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No tienes certificados todavía
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Completa algunos quizzes y reclama tus certificados NFT
          </p>
        </div>
      )}
    </div>
  );
}
