import { useEffect, useState } from 'react';
import type { OrderingQuiz as OrderingQuizData } from '../data/schema';
import { OrderingQuiz } from '../quizzes/ordering/OrderingQuiz';
import { findQuiz } from '../quizzes/registry';
import { navigate } from '../router';

type LoadState = { status: 'loading' } | { status: 'ready'; quiz: OrderingQuizData } | { status: 'error' };

/** Načte data kvízu a podle typu vybere komponentu. */
export function QuizPage({ quizId }: { quizId: string }) {
  const [state, setState] = useState<LoadState>({ status: 'loading' });

  useEffect(() => {
    let alive = true;
    const entry = findQuiz(quizId);
    entry
      ?.load()
      .then((quiz) => alive && setState({ status: 'ready', quiz }))
      .catch((err: unknown) => {
        console.error(err);
        if (alive) setState({ status: 'error' });
      });
    return () => {
      alive = false;
    };
  }, [quizId]);

  if (state.status === 'loading') return <p className="loading">Načítám kvíz…</p>;
  if (state.status === 'error')
    return (
      <p className="notice" role="alert">
        Kvíz se nepodařilo načíst. Zkus obnovit stránku.
      </p>
    );

  switch (state.quiz.type) {
    case 'ordering':
      return <OrderingQuiz quiz={state.quiz} onExit={() => navigate('/')} />;
  }
}
