import type { SavedState } from './persistence';

export type GameState = SavedState;

export type Action =
  | { type: 'ANSWER'; fulfilled: boolean }
  | { type: 'NEXT' }
  | { type: 'RESTART'; order: string[] };

export function newGame(order: string[]): SavedState {
  return { v: 1, order, index: 0, answers: {}, phase: 'ask' };
}

export function currentId(s: GameState): string | undefined {
  return s.order[s.index];
}

export function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'ANSWER': {
      if (state.phase !== 'ask') return state;
      const id = currentId(state);
      if (!id || id in state.answers) return state;
      return {
        ...state,
        answers: { ...state.answers, [id]: action.fulfilled },
        phase: 'feedback',
      };
    }
    case 'NEXT': {
      if (state.phase !== 'feedback') return state;
      const next = state.index + 1;
      if (next >= state.order.length) {
        return { ...state, index: next, phase: 'done' };
      }
      return { ...state, index: next, phase: 'ask' };
    }
    case 'RESTART':
      return newGame(action.order);
  }
}
