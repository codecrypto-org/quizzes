import { NextRequest, NextResponse } from 'next/server';
import { mintCertificate } from '@/lib/certificate';
import { ethers } from 'ethers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { recipientAddress, quizName, score, totalQuestions, difficulty, category, message, signature } = body;

    // Validaciones
    if (!recipientAddress || !quizName || score === undefined || !totalQuestions || !difficulty || !category) {
      return NextResponse.json(
        { error: 'Faltan parámetros requeridos' },
        { status: 400 }
      );
    }

    if (!/^0x[a-fA-F0-9]{40}$/.test(recipientAddress)) {
      return NextResponse.json(
        { error: 'Dirección de wallet inválida' },
        { status: 400 }
      );
    }

    if (score > totalQuestions) {
      return NextResponse.json(
        { error: 'El puntaje no puede ser mayor que el total de preguntas' },
        { status: 400 }
      );
    }

    // Verificar la firma si está presente
    if (message && signature) {
      try {
        // Recuperar la dirección del firmante
        const recoveredAddress = ethers.verifyMessage(message, signature);

        // Verificar que la dirección firmante coincida con la dirección del destinatario
        if (recoveredAddress.toLowerCase() !== recipientAddress.toLowerCase()) {
          return NextResponse.json(
            { error: 'La firma no coincide con la dirección del destinatario' },
            { status: 403 }
          );
        }

        // Verificar que los datos del mensaje coincidan con los parámetros
        const messageData = JSON.parse(message);
        if (
          messageData.quiz !== quizName ||
          messageData.score !== score ||
          messageData.totalQuestions !== totalQuestions ||
          messageData.difficulty !== difficulty ||
          messageData.category !== category
        ) {
          return NextResponse.json(
            { error: 'Los datos firmados no coinciden con los parámetros enviados' },
            { status: 403 }
          );
        }

        // Verificar que la firma no sea muy antigua (por ejemplo, máximo 5 minutos)
        const now = Date.now();
        const messageTimestamp = messageData.timestamp;
        const fiveMinutes = 5 * 60 * 1000;

        if (now - messageTimestamp > fiveMinutes) {
          return NextResponse.json(
            { error: 'La firma ha expirado. Por favor, intenta nuevamente.' },
            { status: 403 }
          );
        }

        console.log('✅ Firma verificada exitosamente para:', recoveredAddress);
      } catch (error) {
        console.error('Error verificando firma:', error);
        return NextResponse.json(
          { error: 'Firma inválida' },
          { status: 403 }
        );
      }
    }

    // Mintear el certificado
    const result = await mintCertificate(
      recipientAddress,
      quizName,
      score,
      totalQuestions,
      difficulty,
      category
    );

    console.log('✅ Certificado minteado:', {
      tokenId: result.tokenId.toString(),
      recipient: recipientAddress,
      quiz: quizName,
    });

    return NextResponse.json({
      success: true,
      tokenId: result.tokenId.toString(),
      transactionHash: result.transactionHash,
      message: 'Certificado NFT creado exitosamente',
    });
  } catch (error: any) {
    console.error('Error minting certificate:', error);
    return NextResponse.json(
      { error: error.message || 'Error al mintear certificado' },
      { status: 500 }
    );
  }
}
