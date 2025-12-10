'use client';

import { CertificateData } from '@/lib/certificate';

interface CertificateSVGProps {
  certificate: CertificateData;
  tokenId?: string;
  className?: string;
}

export default function CertificateSVG({ certificate, tokenId, className = '' }: CertificateSVGProps) {
  const percentage = Math.round((certificate.score / certificate.totalQuestions) * 100);
  const color = percentage >= 80 ? '#10b981' : percentage >= 60 ? '#3b82f6' : '#f59e0b';

  return (
    <svg
      width="500"
      height="400"
      viewBox="0 0 500 400"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background */}
      <rect width="500" height="400" fill="#1f2937" />

      {/* Border */}
      <rect
        x="10"
        y="10"
        width="480"
        height="380"
        fill="none"
        stroke={color}
        strokeWidth="3"
      />

      {/* Title */}
      <text
        x="250"
        y="60"
        fontFamily="Arial, sans-serif"
        fontSize="28"
        fill="white"
        textAnchor="middle"
        fontWeight="bold"
      >
        Quiz Certificate
      </text>

      {/* Quiz Name */}
      <text
        x="250"
        y="120"
        fontFamily="Arial, sans-serif"
        fontSize="18"
        fill={color}
        textAnchor="middle"
        fontWeight="bold"
      >
        {certificate.quizName}
      </text>

      {/* Score */}
      <text
        x="250"
        y="180"
        fontFamily="Arial, sans-serif"
        fontSize="16"
        fill="#9ca3af"
        textAnchor="middle"
      >
        Score: {certificate.score}/{certificate.totalQuestions} ({percentage}%)
      </text>

      {/* Difficulty */}
      <text
        x="250"
        y="220"
        fontFamily="Arial, sans-serif"
        fontSize="14"
        fill="#9ca3af"
        textAnchor="middle"
      >
        Difficulty: {certificate.difficulty}
      </text>

      {/* Category */}
      <text
        x="250"
        y="250"
        fontFamily="Arial, sans-serif"
        fontSize="14"
        fill="#9ca3af"
        textAnchor="middle"
      >
        Category: {certificate.category}
      </text>

      {/* Token ID */}
      {tokenId && (
        <text
          x="250"
          y="290"
          fontFamily="Arial, sans-serif"
          fontSize="12"
          fill="#6b7280"
          textAnchor="middle"
        >
          Token #{tokenId}
        </text>
      )}

      {/* Footer */}
      <text
        x="250"
        y="330"
        fontFamily="Arial, sans-serif"
        fontSize="12"
        fill="#6b7280"
        textAnchor="middle"
      >
        Issued on blockchain
      </text>

      <text
        x="250"
        y="350"
        fontFamily="Arial, sans-serif"
        fontSize="12"
        fill="#6b7280"
        textAnchor="middle"
      >
        Soulbound Token - Non-Transferable
      </text>
    </svg>
  );
}
