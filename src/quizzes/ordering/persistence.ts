// Uložení rozehrané hry do localStorage (GDD kap. 6.9).

export type SavedState = {
  v: 1;
  order: string[];
  locked: string[];
  attempts: number;
  lastCheckedOrder: string[] | null;
  solved: boolean;
  revealed: boolean;
};

export type QuizProgress = 'notStarted' | 'inProgress' | 'solved';

export function storageKey(quizId: string): string {
  return `pg:quiz:${quizId}:v1`;
}

const isStringArray = (v: unknown): v is string[] =>
  Array.isArray(v) && v.every((x) => typeof x === 'string');

function sameIdSet(a: readonly string[], ids: ReadonlySet<string>): boolean {
  return a.length === ids.size && new Set(a).size === a.length && a.every((id) => ids.has(id));
}

/** Ověří tvar uloženého stavu; když jsou zadaná `itemIds`, i shodu s daty. */
export function parseSavedState(raw: unknown, itemIds?: readonly string[]): SavedState | null {
  if (typeof raw !== 'object' || raw === null) return null;
  const s = raw as Record<string, unknown>;
  if (s.v !== 1) return null;
  if (!isStringArray(s.order) || !isStringArray(s.locked)) return null;
  if (typeof s.attempts !== 'number' || !Number.isInteger(s.attempts) || s.attempts < 0) return null;
  if (s.lastCheckedOrder !== null && !isStringArray(s.lastCheckedOrder)) return null;
  if (typeof s.solved !== 'boolean' || typeof s.revealed !== 'boolean') return null;
  if (s.revealed && !s.solved) return null;

  if (itemIds) {
    const ids = new Set(itemIds);
    if (!sameIdSet(s.order, ids)) return null;
    if (!s.locked.every((id) => ids.has(id))) return null;
    if (s.lastCheckedOrder !== null && !sameIdSet(s.lastCheckedOrder, ids)) return null;
  }

  return {
    v: 1,
    order: s.order,
    locked: s.locked,
    attempts: s.attempts,
    lastCheckedOrder: s.lastCheckedOrder as string[] | null,
    solved: s.solved,
    revealed: s.revealed,
  };
}

export function loadState(quizId: string, itemIds?: readonly string[]): SavedState | null {
  try {
    const raw = localStorage.getItem(storageKey(quizId));
    if (raw === null) return null;
    return parseSavedState(JSON.parse(raw), itemIds);
  } catch {
    return null;
  }
}

export function saveState(quizId: string, state: SavedState): void {
  try {
    localStorage.setItem(storageKey(quizId), JSON.stringify(state));
  } catch {
    // Úložiště nemusí být dostupné (anonymní okno, plné úložiště); hra jede dál.
  }
}

export function clearState(quizId: string): void {
  try {
    localStorage.removeItem(storageKey(quizId));
  } catch {
    // viz saveState
  }
}

/** Stav pro dlaždici na domovské stránce (bez načítání dat kvízu). */
export function quizProgress(quizId: string): QuizProgress {
  const s = loadState(quizId);
  if (!s) return 'notStarted';
  return s.solved ? 'solved' : 'inProgress';
}
