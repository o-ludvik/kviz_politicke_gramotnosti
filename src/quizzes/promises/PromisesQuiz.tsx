import { useEffect, useMemo, useReducer, useState } from 'react';
import { formatDate, t } from '../../copy';
import type { PromisesQuiz as PromisesQuizData } from '../../data/schema';
import { scoreOf, shuffleIds } from './logic';
import { clearState, loadState, saveState } from './persistence';
import { PromiseAskCard, PromiseFeedbackCard, PromiseReviewCard } from './PromiseCard';
import { SourcesList } from './SourcesList';
import { currentId, newGame, reducer } from './state';

type Props = {
  quiz: PromisesQuizData;
  onExit: () => void;
  rng?: () => number;
};

export function PromisesQuiz({ quiz, onExit, rng = Math.random }: Props) {
  const items = quiz.items;
  const byId = useMemo(() => new Map(items.map((i) => [i.id, i])), [items]);
  const fulfilledById = useMemo(
    () => new Map(items.map((i) => [i.id, i.splnil] as const)),
    [items],
  );
  const ids = useMemo(() => items.map((i) => i.id), [items]);

  const [state, dispatch] = useReducer(
    reducer,
    undefined,
    () => loadState(quiz.id, ids) ?? newGame(shuffleIds(ids, rng)),
  );
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  useEffect(() => {
    saveState(quiz.id, state);
  }, [quiz.id, state]);

  const id = currentId(state);
  const item = id ? byId.get(id) : undefined;
  const n = items.length;
  const progressLabel = t('promises.progress', {
    i: Math.min(state.index + 1, n),
    n,
  });

  const onRestart = () => {
    if (!window.confirm(t('restart.confirm'))) return;
    clearState(quiz.id);
    setExpanded(new Set());
    dispatch({ type: 'RESTART', order: shuffleIds(ids, rng) });
  };

  const toggle = (itemId: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) next.delete(itemId);
      else next.add(itemId);
      return next;
    });

  const score = state.phase === 'done' ? scoreOf(state.answers, fulfilledById) : null;

  return (
    <>
      <header className="quiz-header">
        <a className="back-link" href="#/">
          {t('quiz.back')}
        </a>
        <h1 tabIndex={-1}>{quiz.title}</h1>
        <p className="quiz-header__instructions">{t('promises.instructions')}</p>
        <details className="methodology">
          <summary>{t('promises.methodology.toggle')}</summary>
          <p>{quiz.methodology}</p>
          <p>{t('sources.asOf', { datum: formatDate(quiz.dataAsOf) })}</p>
        </details>
      </header>

      <div className="promises-board">
        {state.phase === 'ask' && item && (
          <PromiseAskCard
            item={item}
            progress={progressLabel}
            onAnswer={(fulfilled) => dispatch({ type: 'ANSWER', fulfilled })}
          />
        )}

        {state.phase === 'feedback' && item && id && (
          <PromiseFeedbackCard
            item={item}
            tip={state.answers[id] as boolean}
            progress={progressLabel}
            onNext={() => dispatch({ type: 'NEXT' })}
            nextLabel={
              state.index + 1 >= n ? t('promises.next.finish') : t('promises.next.continue')
            }
          />
        )}

        {state.phase === 'done' && score && (
          <section className="promises-score" aria-labelledby="promises-score-title">
            <h2 id="promises-score-title">{t('promises.score.title')}</h2>
            <p className="promises-score__body">
              {t('promises.score.body', { correct: score.correct, wrong: score.wrong, n: score.total })}
            </p>
            <div className="promises-score__actions">
              <button type="button" className="btn btn--secondary" onClick={onRestart}>
                {t('restart.button')}
              </button>
              <button type="button" className="btn btn--primary" onClick={onExit}>
                {t('win.secondary')}
              </button>
            </div>

            <h3 className="promises-review__heading">{t('promises.review.title')}</h3>
            <ul className="promises-review-list">
              {state.order.map((itemId) => {
                const rev = byId.get(itemId);
                if (!rev) return null;
                return (
                  <li key={itemId}>
                    <PromiseReviewCard
                      item={rev}
                      tip={state.answers[itemId]}
                      expanded={expanded.has(itemId)}
                      onToggle={toggle}
                    />
                  </li>
                );
              })}
            </ul>
          </section>
        )}
      </div>

      <SourcesList quiz={quiz} />
    </>
  );
}
