import { getQuizById } from '@/lib/api';
import { notFound } from 'next/navigation';
import QuizClient from './QuizClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function QuizPage({ params }: PageProps) {
  const { id } = await params;
  const quiz = await getQuizById(id);

  if (!quiz) {
    notFound();
  }

  return <QuizClient quiz={quiz} />;
}
