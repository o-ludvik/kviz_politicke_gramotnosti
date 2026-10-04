// Uložení rozehrané hry do localStorage (GDD kap. 6.9).

import type { RankedItem } from './logic';

export type SavedState = {
  v: 2;
  order: string[];
  locked: string[];
  attempts: number;
  lastCheckedOrder: string[] | null;
  solved: boolean;
  revealed: boolean;
};

export type QuizProgress = 'notStarted' | 'inProgress' | 'solved';

export function storageKey(quizId: string): string {
  return `pg:quiz:${quizId}:v2`;
}

const isStringArray = (v: unknown): v is string[] =>
  Array.isArray(v) && v.every((x) => typeof x === 'string');

function sameIdSet(a: readonly string[], ids: ReadonlySet<string>): boolean {
  return a.length === ids.size && new Set(a).size === a.length && a.every((id) => ids.has(id));
}

/** Zamčené karty musí sedět na některé ze svých povolených pozic. */
function locksMatchSolution(
  order: readonly string[],
  locked: readonly string[],
  items: readonly RankedItem[],
): boolean {
  const byId = new Map(items.map((i) => [i.id, i]));
  return locked.every((id) => {
    const item = byId.get(id);
    if (!item) return false;
    const slot = order.indexOf(id);
    return slot >= 0 && item.index.includes(slot + 1);
  });
}

/** Ověří tvar uloženého stavu; když jsou zadaná `items`, i shodu s daty a zámky. */
export function parseSavedState(raw: unknown, items?: readonly RankedItem[]): SavedState | null {
  if (typeof raw !== 'object' || raw === null) return null;
  const s = raw as Record<string, unknown>;
  if (s.v !== 2) return null;
  if (!isStringArray(s.order) || !isStringArray(s.locked)) return null;
  if (typeof s.attempts !== 'number' || !Number.isInteger(s.attempts) || s.attempts < 0) return null;
  if (s.lastCheckedOrder !== null && !isStringArray(s.lastCheckedOrder)) return null;
  if (typeof s.solved !== 'boolean' || typeof s.revealed !== 'boolean') return null;
  if (s.revealed && !s.solved) return null;

  if (items) {
    const ids = new Set(items.map((i) => i.id));
    if (!sameIdSet(s.order, ids)) return null;
    if (!s.locked.every((id) => ids.has(id))) return null;
    if (s.lastCheckedOrder !== null && !sameIdSet(s.lastCheckedOrder, ids)) return null;
    if (!locksMatchSolution(s.order, s.locked, items)) return null;
    if (s.solved && s.locked.length !== items.length) return null;
  }

  return {
    v: 2,
    order: s.order,
    locked: s.locked,
    attempts: s.attempts,
    lastCheckedOrder: s.lastCheckedOrder as string[] | null,
    solved: s.solved,
    revealed: s.revealed,
  };
}

export function loadState(quizId: string, items?: readonly RankedItem[]): SavedState | null {
  try {
    // Zahodit zastaralé uložení z doby před unikátními indexy.
    localStorage.removeItem(`pg:quiz:${quizId}:v1`);
    const raw = localStorage.getItem(storageKey(quizId));
    if (raw === null) return null;
    return parseSavedState(JSON.parse(raw), items);
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
    // Starší klíč z doby před změnou indexů / schématu.
    localStorage.removeItem(`pg:quiz:${quizId}:v1`);
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
