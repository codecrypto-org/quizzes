'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { ANVIL_RPC_URL, ANVIL_CHAIN_ID } from '@/contracts/config';

export function useWallet() {
  const [address, setAddress] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      return;
    }

    try {
      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await browserProvider.listAccounts();

      if (accounts.length > 0) {
        const signer = await browserProvider.getSigner();
        const address = await signer.getAddress();
        setAddress(address);
        setProvider(browserProvider);
        setSigner(signer);
        setIsConnected(true);
      }
    } catch (err) {
      console.error('Error checking connection:', err);
    }
  };

  const connectWallet = async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      setError('MetaMask no está instalado. Por favor, instala MetaMask o usa una dirección de Anvil.');
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      // Solicitar conexión
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      const signer = await browserProvider.getSigner();
      const address = await signer.getAddress();

      // Verificar si estamos en la red correcta (Anvil)
      const network = await browserProvider.getNetwork();

      if (Number(network.chainId) !== ANVIL_CHAIN_ID) {
        // Intentar cambiar a Anvil
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: `0x${ANVIL_CHAIN_ID.toString(16)}` }],
          });
        } catch (switchError: any) {
          // Si la red no existe, agregarla
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: `0x${ANVIL_CHAIN_ID.toString(16)}`,
                chainName: 'Anvil Local',
                nativeCurrency: {
                  name: 'Ether',
                  symbol: 'ETH',
                  decimals: 18,
                },
                rpcUrls: [ANVIL_RPC_URL],
              }],
            });
          } else {
            throw switchError;
          }
        }
      }

      setAddress(address);
      setProvider(browserProvider);
      setSigner(signer);
      setIsConnected(true);
    } catch (err: any) {
      console.error('Error connecting wallet:', err);
      setError(err.message || 'Error al conectar wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setAddress('');
    setIsConnected(false);
    setProvider(null);
    setSigner(null);
    setError(null);
  };

  const signMessage = async (message: string): Promise<string> => {
    if (!signer) {
      throw new Error('Wallet no conectada');
    }

    try {
      const signature = await signer.signMessage(message);
      return signature;
    } catch (err: any) {
      console.error('Error signing message:', err);
      throw new Error(err.message || 'Error al firmar mensaje');
    }
  };

  return {
    address,
    isConnected,
    isConnecting,
    error,
    provider,
    signer,
    connectWallet,
    disconnectWallet,
    signMessage,
  };
}

// Declaración de tipos para window.ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}
