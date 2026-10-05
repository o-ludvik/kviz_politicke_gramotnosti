import { useEffect, useMemo, useReducer, useState } from 'react';
import { formatDate, t } from '../../copy';
import type { KdoQuiz as KdoQuizData, KdoVlada } from '../../data/schema';
import { KdoAskCard, KdoFeedbackCard, KdoReviewCard } from './KdoCard';
import { scoreOf, shuffleIds, type VladaId } from './logic';
import { clearState, loadState, saveState } from './persistence';
import { SourcesList } from './SourcesList';
import { currentId, newGame, reducer } from './state';

type Props = {
  quiz: KdoQuizData;
  onExit: () => void;
  rng?: () => number;
};

export function KdoQuiz({ quiz, onExit, rng = Math.random }: Props) {
  const items = quiz.items;
  const byId = useMemo(() => new Map(items.map((i) => [i.id, i])), [items]);
  const vladaById = useMemo(
    () => new Map(items.map((i) => [i.id, i.vlada] as const)),
    [items],
  );
  const ids = useMemo(() => items.map((i) => i.id), [items]);
  const vlady = quiz.vlady as readonly [KdoVlada, KdoVlada];

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
  const progressLabel = t('kdo.progress', {
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

  const score = state.phase === 'done' ? scoreOf(state.answers, vladaById) : null;

  return (
    <>
      <header className="quiz-header">
        <a className="back-link" href="#/">
          {t('quiz.back')}
        </a>
        <h1 tabIndex={-1}>{quiz.title}</h1>
        <p className="quiz-header__instructions">{t('kdo.instructions')}</p>
        <details className="methodology">
          <summary>{t('kdo.methodology.toggle')}</summary>
          <p>{quiz.methodology}</p>
          <p>{t('sources.asOf', { datum: formatDate(quiz.dataAsOf) })}</p>
        </details>
      </header>

      <div className="kdo-board">
        {state.phase === 'ask' && item && (
          <KdoAskCard
            item={item}
            vlady={vlady}
            progress={progressLabel}
            onAnswer={(vlada) => dispatch({ type: 'ANSWER', vlada })}
          />
        )}

        {state.phase === 'feedback' && item && id && (
          <KdoFeedbackCard
            item={item}
            tip={state.answers[id] as VladaId}
            vlady={vlady}
            progress={progressLabel}
            onNext={() => dispatch({ type: 'NEXT' })}
            nextLabel={
              state.index + 1 >= n ? t('kdo.next.finish') : t('kdo.next.continue')
            }
          />
        )}

        {state.phase === 'done' && score && (
          <section className="kdo-score" aria-labelledby="kdo-score-title">
            <h2 id="kdo-score-title">{t('kdo.score.title')}</h2>
            <p className="kdo-score__body">
              {t('kdo.score.body', { correct: score.correct, wrong: score.wrong, n: score.total })}
            </p>
            <div className="kdo-score__actions">
              <button type="button" className="btn btn--secondary" onClick={onRestart}>
                {t('restart.button')}
              </button>
              <button type="button" className="btn btn--primary" onClick={onExit}>
                {t('win.secondary')}
              </button>
            </div>

            <h3 className="kdo-review__heading">{t('kdo.review.title')}</h3>
            <ul className="kdo-review-list">
              {state.order.map((itemId) => {
                const rev = byId.get(itemId);
                if (!rev) return null;
                return (
                  <li key={itemId}>
                    <KdoReviewCard
                      item={rev}
                      tip={state.answers[itemId]}
                      vlady={vlady}
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
