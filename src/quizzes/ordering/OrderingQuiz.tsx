import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type Announcements,
  type DragEndEvent,
} from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, type SortingStrategy } from '@dnd-kit/sortable';
import { useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { formatDate, t } from '../../copy';
import type { OrderingQuiz as OrderingQuizData } from '../../data/schema';
import { ItemCard } from './ItemCard';
import { moveAmongFree, neighbourFreeSlot, shuffle } from './logic';
import { clearState, loadState, saveState } from './persistence';
import { SourcesList } from './SourcesList';
import { canCheck, initialState, makeReducer, newGame, toSaved } from './state';
import { WinOverlay } from './WinOverlay';

type Props = {
  quiz: OrderingQuizData;
  onExit: () => void;
  /** Generátor náhodných čísel pro míchání (testy podstrčí seedovaný). */
  rng?: () => number;
};

/**
 * Náhled přesunu během přetahování: karty se rozestaví tak, jak budou po
 * puštění podle moveAmongFree, i když mají různou výšku.
 */
function amongFreeStrategy(order: readonly string[], locked: ReadonlySet<string>): SortingStrategy {
  return ({ rects, activeIndex, overIndex, index }) => {
    const first = rects[0];
    const current = rects[index];
    if (!first || !current || index === activeIndex) return null;
    const preview = moveAmongFree(order, locked, activeIndex, overIndex);
    const newIndex = preview.indexOf(order[index] as string);
    if (newIndex === index) return { x: 0, y: 0, scaleX: 1, scaleY: 1 };
    const second = rects[1];
    const gap = second ? second.top - (first.top + first.height) : 0;
    let y = first.top;
    for (let k = 0; k < newIndex; k++) {
      const r = rects[order.indexOf(preview[k] as string)];
      if (!r) return null;
      y += r.height + gap;
    }
    return { x: 0, y: y - current.top, scaleX: 1, scaleY: 1 };
  };
}

/** Text pro aria-live, který se přečte, i když se opakuje. */
function useAnnouncer() {
  const [message, setMessage] = useState('');
  const toggle = useRef(false);
  const announce = (text: string) => {
    toggle.current = !toggle.current;
    setMessage(toggle.current ? text : `${text} `);
  };
  return [message, announce] as const;
}

export function OrderingQuiz({ quiz, onExit, rng = Math.random }: Props) {
  const items = quiz.items;
  const itemIds = useMemo(() => items.map((i) => i.id), [items]);
  const byId = useMemo(() => new Map(items.map((i) => [i.id, i])), [items]);
  const reducer = useMemo(() => makeReducer(items), [items]);

  const [state, dispatch] = useReducer(reducer, undefined, () =>
    initialState(loadState(quiz.id, items) ?? newGame(shuffle(items, rng))),
  );
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [moveMessage, announceMove] = useAnnouncer();
  const pendingMove = useRef<string | null>(null);
  const revealHintRef = useRef<HTMLParagraphElement>(null);
  const listRef = useRef<HTMLOListElement>(null);

  const locked = useMemo(() => new Set(state.locked), [state.locked]);
  const titleOf = (id: string) => byId.get(id)?.name ?? id;
  const positionOf = (id: string | number) => state.order.indexOf(String(id)) + 1;

  useEffect(() => {
    saveState(quiz.id, toSaved(state));
  }, [quiz.id, state]);

  // Ohlášení nové pozice po přesunu.
  useEffect(() => {
    const id = pendingMove.current;
    if (!id) return;
    pendingMove.current = null;
    announceMove(t('live.moved', { název: titleOf(id), pozice: positionOf(id) }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.order]);

  useEffect(() => {
    if (state.justRevealed) revealHintRef.current?.focus();
  }, [state.justRevealed]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const strategy = useMemo(() => amongFreeStrategy(state.order, locked), [state.order, locked]);

  const move = (fromSlot: number, toSlot: number) => {
    const id = state.order[fromSlot];
    if (id === undefined) return;
    pendingMove.current = id;
    dispatch({ type: 'MOVE', fromSlot, toSlot });
  };

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over) return;
    const from = state.order.indexOf(String(active.id));
    const to = state.order.indexOf(String(over.id));
    if (from !== to) move(from, to);
  };

  const onStep = (id: string, step: -1 | 1) => {
    const from = state.order.indexOf(id);
    const to = neighbourFreeSlot(state.order, locked, from, step);
    if (to === undefined) return;
    move(from, to);
    // Fokus zůstává na stejném tlačítku karty i po přesunu v DOM.
    requestAnimationFrame(() => {
      const btn = listRef.current?.querySelector<HTMLButtonElement>(
        `[data-card-id="${id}"] [data-move="${step === -1 ? 'up' : 'down'}"]`,
      );
      if (btn && document.activeElement !== btn) btn.focus();
    });
  };

  const onRestart = () => {
    if (!window.confirm(t('restart.confirm'))) return;
    clearState(quiz.id);
    setExpanded(new Set());
    dispatch({ type: 'RESTART', order: shuffle(items, rng) });
    listRef.current?.closest('main')?.querySelector<HTMLElement>('h1')?.focus();
  };

  const toggle = (id: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const announcements: Announcements = {
    onDragStart: ({ active }) =>
      t('dnd.start', { název: titleOf(String(active.id)), pozice: positionOf(active.id) }),
    onDragMove: () => undefined,
    onDragOver: ({ active, over }) =>
      over ? t('dnd.over', { název: titleOf(String(active.id)), pozice: positionOf(over.id) }) : undefined,
    onDragEnd: () => undefined,
    onDragCancel: ({ active }) =>
      t('dnd.cancel', { název: titleOf(String(active.id)), pozice: positionOf(active.id) }),
  };

  const checkEnabled = canCheck(state);
  const n = items.length;
  let statusText = '';
  if (state.lastResult?.kind === 'progress') statusText = t('check.result', { k: state.lastResult.correct, n });
  else if (state.lastResult?.kind === 'noNew') statusText = t('check.noNew');

  const showAmountFor = (id: string) =>
    state.revealed || (quiz.revealAmounts === 'onLock' && locked.has(id));

  return (
    <>
      <QuizHeader quiz={quiz} />
      <div className="quiz-board">
        {state.revealed && (
          <p className="reveal-hint" ref={revealHintRef} tabIndex={-1}>
            {t('reveal.hint')}
          </p>
        )}

        <p className="axis-label axis-label--top">{quiz.axis.top}</p>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={onDragEnd}
          accessibility={{
            announcements,
            screenReaderInstructions: { draggable: t('dnd.instructions') },
          }}
        >
          <SortableContext items={state.order} strategy={strategy} disabled={state.solved}>
            <ol className="slots" ref={listRef}>
              {state.order.map((id, slot) => {
                const item = byId.get(id);
                if (!item) return null;
                const isLocked = locked.has(id);
                return (
                  <li className="slot" key={id}>
                    <span className="slot__num" aria-hidden="true">
                      {slot + 1}
                    </span>
                    <ItemCard
                      item={item}
                      slot={slot}
                      locked={isLocked}
                      justLocked={state.justLocked.includes(id)}
                      showAmount={showAmountFor(id)}
                      stampDelayIndex={
                        state.justRevealed ? slot : state.justLocked.includes(id) && showAmountFor(id) ? 0 : null
                      }
                      expandable={state.revealed}
                      expanded={expanded.has(id)}
                      canMoveUp={!isLocked && neighbourFreeSlot(state.order, locked, slot, -1) !== undefined}
                      canMoveDown={!isLocked && neighbourFreeSlot(state.order, locked, slot, 1) !== undefined}
                      onToggle={toggle}
                      onStep={onStep}
                    />
                  </li>
                );
              })}
            </ol>
          </SortableContext>
        </DndContext>

        <p className="axis-label axis-label--bottom">{quiz.axis.bottom}</p>

        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {moveMessage}
        </div>
      </div>

      <div className="check-bar">
        <div className="check-bar__inner">
          <div className="check-bar__status">
            <p aria-live="polite" aria-atomic="true" className="check-bar__message">
              {statusText}
            </p>
            {state.attempts > 0 && <p className="check-bar__attempts">{t('check.attempts', { a: state.attempts })}</p>}
          </div>
          {state.revealed ? (
            <button type="button" className="btn btn--secondary" onClick={onRestart}>
              {t('restart.button')}
            </button>
          ) : (
            <div className="check-bar__action">
              <button
                type="button"
                className="btn btn--primary"
                aria-disabled={!checkEnabled || undefined}
                aria-describedby={!checkEnabled ? 'check-hint' : undefined}
                onClick={() => checkEnabled && dispatch({ type: 'CHECK' })}
              >
                {t('check.button')}
              </button>
              {!checkEnabled && !state.solved && (
                <span id="check-hint" className="check-bar__hint">
                  {t('check.disabledHint')}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      <SourcesList quiz={quiz} />

      {state.solved && !state.revealed && (
        <WinOverlay
          itemCount={n}
          attempts={state.attempts}
          celebrate={state.celebrate}
          onReveal={() => dispatch({ type: 'REVEAL' })}
          onBack={onExit}
        />
      )}
    </>
  );
}

function QuizHeader({ quiz }: { quiz: OrderingQuizData }) {
  return (
    <header className="quiz-header">
      <a className="back-link" href="#/">
        {t('quiz.back')}
      </a>
      <h1 tabIndex={-1}>{quiz.title}</h1>
      <p className="quiz-header__instructions">{t('quiz.instructions')}</p>
      <details className="methodology">
        <summary>{t('quiz.methodology.toggle')}</summary>
        <p>{t('quiz.methodology.body')}</p>
        <p>{t('sources.asOf', { datum: formatDate(quiz.dataAsOf) })}</p>
      </details>
    </header>
  );
}
