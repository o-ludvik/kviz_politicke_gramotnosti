import type { VladaId } from './logic';

export type Phase = 'ask' | 'feedback' | 'done';

export type SavedState = {
  v: 1;
  order: string[];
  index: number;
  answers: Record<string, VladaId>;
  phase: Phase;
};

export type QuizProgress = 'notStarted' | 'inProgress' | 'solved';

export function storageKey(quizId: string): string {
  return `pg:quiz:${quizId}:kdo:v1`;
}

const isStringArray = (v: unknown): v is string[] =>
  Array.isArray(v) && v.every((x) => typeof x === 'string');

function sameIdSet(a: readonly string[], ids: ReadonlySet<string>): boolean {
  return a.length === ids.size && new Set(a).size === a.length && a.every((id) => ids.has(id));
}

const phases: readonly Phase[] = ['ask', 'feedback', 'done'];
const vlady: readonly VladaId[] = ['ano', 'spolu'];

/** Ověří tvar uloženého stavu; když jsou zadaná `ids`, i shodu s daty. */
export function parseSavedState(raw: unknown, ids?: readonly string[]): SavedState | null {
  if (typeof raw !== 'object' || raw === null) return null;
  const s = raw as Record<string, unknown>;
  if (s.v !== 1) return null;
  if (!isStringArray(s.order)) return null;
  if (typeof s.index !== 'number' || !Number.isInteger(s.index) || s.index < 0) return null;
  if (typeof s.answers !== 'object' || s.answers === null || Array.isArray(s.answers)) return null;
  if (typeof s.phase !== 'string' || !phases.includes(s.phase as Phase)) return null;

  const answers: Record<string, VladaId> = {};
  for (const [k, v] of Object.entries(s.answers as Record<string, unknown>)) {
    if (typeof v !== 'string' || !vlady.includes(v as VladaId)) return null;
    answers[k] = v as VladaId;
  }

  if (ids) {
    const idSet = new Set(ids);
    if (!sameIdSet(s.order, idSet)) return null;
    if (s.index > s.order.length) return null;
    if (!Object.keys(answers).every((id) => idSet.has(id))) return null;
    if (s.phase === 'done' && Object.keys(answers).length !== ids.length) return null;
    if (s.phase === 'feedback') {
      const current = s.order[s.index];
      if (!current || !(current in answers)) return null;
    }
    if (s.phase === 'ask' && s.index < s.order.length) {
      const current = s.order[s.index];
      if (current && current in answers) return null;
    }
  }

  return { v: 1, order: s.order, index: s.index, answers, phase: s.phase as Phase };
}

export function loadState(quizId: string, ids?: readonly string[]): SavedState | null {
  try {
    const raw = localStorage.getItem(storageKey(quizId));
    if (raw === null) return null;
    return parseSavedState(JSON.parse(raw), ids);
  } catch {
    return null;
  }
}

export function saveState(quizId: string, state: SavedState): void {
  try {
    localStorage.setItem(storageKey(quizId), JSON.stringify(state));
  } catch {
    // Úložiště nemusí být dostupné; hra jede dál.
  }
}

export function clearState(quizId: string): void {
  try {
    localStorage.removeItem(storageKey(quizId));
  } catch {
    // viz saveState
  }
}

/** Stav pro dlaždici na domovské stránce. */
export function quizProgress(quizId: string): QuizProgress {
  const s = loadState(quizId);
  if (!s) return 'notStarted';
  return s.phase === 'done' ? 'solved' : 'inProgress';
}
