'use client';

import { useState } from 'react';
import { Quiz } from '@/types/quiz';
import { useWallet } from '@/hooks/useWallet';
import CertificateSVG from './CertificateSVG';

interface ClaimCertificateProps {
  quiz: Quiz;
  score: number;
  totalQuestions: number;
}

export default function ClaimCertificate({ quiz, score, totalQuestions }: ClaimCertificateProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isClaimed, setIsClaimed] = useState(false);
  const [tokenId, setTokenId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { address, isConnected, isConnecting, connectWallet, signMessage, error: walletError } = useWallet();

  const handleClaim = async () => {
    if (!isConnected || !address) {
      setError('Por favor conecta tu wallet primero');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Crear mensaje para firmar con los resultados del quiz
      const message = JSON.stringify({
        quiz: quiz.title,
        score: score,
        totalQuestions: totalQuestions,
        percentage: Math.round((score / totalQuestions) * 100),
        difficulty: quiz.difficulty,
        category: quiz.category,
        timestamp: Date.now(),
      });

      // Firmar el mensaje con la wallet del usuario
      const signature = await signMessage(message);

      // Enviar a la API para mintear el certificado
      const response = await fetch('/api/mint-certificate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipientAddress: address,
          quizName: quiz.title,
          score,
          totalQuestions,
          difficulty: quiz.difficulty,
          category: quiz.category,
          message,
          signature,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al reclamar certificado');
      }

      setTokenId(data.tokenId);
      setIsClaimed(true);
    } catch (err: any) {
      setError(err.message || 'Error al reclamar certificado');
    } finally {
      setIsLoading(false);
    }
  };

  const percentage = Math.round((score / totalQuestions) * 100);
  const isEligible = percentage >= 60;

  if (!isEligible) {
    return (
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 text-center">
        <div className="text-4xl mb-3">📚</div>
        <p className="text-yellow-800 dark:text-yellow-200 font-medium mb-2">
          Necesitas al menos 60% para reclamar un certificado NFT
        </p>
        <p className="text-sm text-yellow-700 dark:text-yellow-300">
          Has obtenido {percentage}%. ¡Inténtalo de nuevo!
        </p>
      </div>
    );
  }

  if (isClaimed) {
    const certificateData = {
      quizName: quiz.title,
      score: score,
      totalQuestions: totalQuestions,
      timestamp: Math.floor(Date.now() / 1000),
      difficulty: quiz.difficulty,
      category: quiz.category,
    };

    return (
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg overflow-hidden">
        <div className="text-center p-6">
          <div className="text-5xl mb-4">🎉</div>
          <h3 className="text-2xl font-bold text-green-800 dark:text-green-200 mb-2">
            ¡Certificado Reclamado!
          </h3>
          <p className="text-green-700 dark:text-green-300 mb-6">
            Tu certificado NFT ha sido creado exitosamente
          </p>
        </div>

        {/* SVG Preview */}
        <div className="bg-gray-900 p-6 flex items-center justify-center">
          <CertificateSVG
            certificate={certificateData}
            tokenId={tokenId || undefined}
            className="w-full max-w-lg"
          />
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-green-200 dark:border-green-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Token ID</p>
            <p className="text-2xl font-mono font-bold text-gray-900 dark:text-white">
              #{tokenId}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-green-200 dark:border-green-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Tu Wallet</p>
            <p className="text-xs font-mono text-gray-900 dark:text-white break-all">
              {address}
            </p>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            Este es un Soulbound Token (SBT) - no puede ser transferido
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
      <div className="flex items-start mb-4">
        <div className="text-4xl mr-4">🏆</div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            ¡Reclama tu Certificado NFT!
          </h3>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Has obtenido {percentage}% de respuestas correctas. Conecta tu wallet, firma tus resultados
            y reclama tu certificado como NFT en la blockchain.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg mb-4 border border-blue-100 dark:border-blue-900">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
          <span className="mr-2">📋</span>
          Detalles del Certificado
        </h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Quiz:</span>
            <span className="font-medium text-gray-900 dark:text-white">{quiz.title}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Puntaje:</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {score}/{totalQuestions} ({percentage}%)
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Dificultad:</span>
            <span className="font-medium text-gray-900 dark:text-white capitalize">
              {quiz.difficulty}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Categoría:</span>
            <span className="font-medium text-gray-900 dark:text-white capitalize">
              {quiz.category}
            </span>
          </div>
        </div>
      </div>

      {!isConnected ? (
        <div className="space-y-3">
          <div className="bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-sm text-blue-800 dark:text-blue-200 mb-2 flex items-center">
              <span className="mr-2">🔐</span>
              <span className="font-medium">Conecta tu wallet para continuar</span>
            </p>
            <p className="text-xs text-blue-700 dark:text-blue-300">
              Necesitamos que conectes tu wallet de MetaMask para firmar tus resultados y
              reclamar tu certificado NFT.
            </p>
          </div>

          <button
            onClick={connectWallet}
            disabled={isConnecting}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center"
          >
            {isConnecting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Conectando...
              </>
            ) : (
              <>
                <span className="mr-2">🦊</span>
                Conectar Wallet (MetaMask)
              </>
            )}
          </button>

          {walletError && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
              <p className="text-sm text-red-800 dark:text-red-200">{walletError}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <p className="text-sm text-green-800 dark:text-green-200 mb-2 flex items-center">
              <span className="mr-2">✅</span>
              <span className="font-medium">Wallet Conectada</span>
            </p>
            <p className="text-xs font-mono text-green-700 dark:text-green-300 break-all">
              {address}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
              <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}

          <button
            onClick={handleClaim}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-all shadow-lg hover:shadow-xl"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Firmando y Mintando...
              </span>
            ) : (
              <>
                <span className="mr-2">✍️</span>
                Firmar y Reclamar Certificado NFT
              </>
            )}
          </button>
        </div>
      )}

      <div className="mt-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-3">
        <p className="text-xs text-gray-600 dark:text-gray-400 flex items-start">
          <span className="mr-2">ℹ️</span>
          <span>
            Al reclamar, firmarás tus resultados del quiz con tu wallet. El certificado será un
            Soulbound Token (SBT) que no puede ser transferido y quedará asociado a tu dirección
            de wallet permanentemente.
          </span>
        </p>
      </div>
    </div>
  );
}
