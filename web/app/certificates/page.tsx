import Link from 'next/link';
import MyCertificates from '@/components/MyCertificates';
import { ANVIL_TEST_ACCOUNTS } from '@/contracts/config';

export default function CertificatesPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link
            href="/"
            className="text-blue-600 dark:text-blue-400 hover:underline mb-4 inline-block"
          >
            ← Volver al inicio
          </Link>
        </div>

        <MyCertificates />

        {/* Test Accounts Info */}
        <div className="mt-12 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Cuentas de Prueba (Anvil)
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
            Usa estas direcciones para probar la funcionalidad de certificados:
          </p>
          <div className="space-y-2">
            {ANVIL_TEST_ACCOUNTS.slice(0, 3).map((account, index) => (
              <div
                key={account.address}
                className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-blue-200 dark:border-blue-700"
              >
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  Cuenta #{index + 1}
                </p>
                <p className="font-mono text-sm text-gray-900 dark:text-white break-all">
                  {account.address}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
