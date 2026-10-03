// Reducer hry (GDD kap. 11): akce MOVE, CHECK, REVEAL, RESTART volají čisté
// funkce z logic.ts. Uložitelná část stavu je SavedState, zbytek je přechodný.

import { check, moveAmongFree, sameOrder, type RankedItem } from './logic';
import type { SavedState } from './persistence';

export type CheckResult = { kind: 'progress'; correct: number } | { kind: 'noNew' };

export type GameState = SavedState & {
  lastResult: CheckResult | null;
  justLocked: string[];
  justRevealed: boolean;
  /** Výhra právě teď (spustí déšť korun), ne po obnovení stránky. */
  celebrate: boolean;
};

export type Action =
  | { type: 'MOVE'; fromSlot: number; toSlot: number }
  | { type: 'CHECK' }
  | { type: 'REVEAL' }
  | { type: 'RESTART'; order: string[] };

export function initialState(saved: SavedState): GameState {
  return { ...saved, lastResult: null, justLocked: [], justRevealed: false, celebrate: false };
}

export function newGame(order: string[]): SavedState {
  return { v: 1, order, locked: [], attempts: 0, lastCheckedOrder: null, solved: false, revealed: false };
}

export function toSaved(s: GameState): SavedState {
  const { v, order, locked, attempts, lastCheckedOrder, solved, revealed } = s;
  return { v, order, locked, attempts, lastCheckedOrder, solved, revealed };
}

export function canCheck(s: GameState): boolean {
  return !s.solved && !sameOrder(s.lastCheckedOrder, s.order);
}

export function makeReducer(items: readonly RankedItem[]) {
  return function reducer(state: GameState, action: Action): GameState {
    switch (action.type) {
      case 'MOVE': {
        if (state.solved) return state;
        const order = moveAmongFree(state.order, new Set(state.locked), action.fromSlot, action.toSlot);
        return sameOrder(order, state.order) ? state : { ...state, order, justLocked: [] };
      }
      case 'CHECK': {
        if (!canCheck(state)) return state;
        const { newlyLocked, allCorrect } = check(state.order, new Set(state.locked), items);
        const locked = [...state.locked, ...newlyLocked];
        return {
          ...state,
          locked,
          attempts: state.attempts + 1,
          lastCheckedOrder: [...state.order],
          solved: allCorrect,
          celebrate: allCorrect,
          justLocked: newlyLocked,
          lastResult: newlyLocked.length > 0 ? { kind: 'progress', correct: locked.length } : { kind: 'noNew' },
        };
      }
      case 'REVEAL':
        if (!state.solved || state.revealed) return state;
        return { ...state, revealed: true, justRevealed: true, celebrate: false };
      case 'RESTART':
        return initialState(newGame(action.order));
    }
  };
}
