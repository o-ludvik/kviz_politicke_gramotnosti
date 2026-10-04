import { useEffect, useRef, useState } from 'react';
import { formatDate, REPORT_URL, t } from './copy';
import { HomePage } from './pages/HomePage';
import { QuizPage } from './pages/QuizPage';
import { findQuiz } from './quizzes/registry';
import { navigate, useHashRoute } from './router';

export const DATA_AS_OF = '2026-10-03';

export function App() {
  const route = useHashRoute();
  const [notice, setNotice] = useState<string | null>(null);

  const invalid = route.name === 'notFound' || (route.name === 'quiz' && !findQuiz(route.quizId));

  useEffect(() => {
    if (invalid) {
      setNotice(t('notFound'));
      navigate('/');
    }
  }, [invalid]);

  // Po změně stránky přesunout fokus na nadpis a scroll nahoru.
  const routeKey = route.name === 'quiz' ? `quiz:${route.quizId}` : route.name;
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    window.scrollTo?.(0, 0);
    // Kvíz se načítá asynchronně; když nadpis ještě není, dostane fokus <main>.
    const target = document.querySelector<HTMLElement>('main h1') ?? document.querySelector<HTMLElement>('main');
    target?.focus({ preventScroll: true });
    if (routeKey !== 'home' && !invalid) setNotice(null);
  }, [routeKey, invalid]);

  return (
    <>
      <main className={route.name === 'quiz' && !invalid ? 'page page--wide' : 'page'} tabIndex={-1}>
        {notice && route.name === 'home' && (
          <p className="notice" role="status">
            {notice}
          </p>
        )}
        {route.name === 'quiz' && !invalid ? <QuizPage key={route.quizId} quizId={route.quizId} /> : <HomePage />}
      </main>
      <footer className="page-footer">
        <p>
          {t('footer.asOf', { datum: formatDate(DATA_AS_OF) })}{' '}
          {REPORT_URL ? <a href={REPORT_URL}>{t('footer.report')}</a> : t('footer.report')}
        </p>
      </footer>
    </>
  );
}
