import { describe, expect, it } from 'vitest';
import raw from './quizzes/kolik-to-stalo.json';
import { orderingQuizSchema, refsIn } from './schema';

const quiz = orderingQuizSchema.parse(raw);

describe('data kvízu „Kolik to stálo stát?“', () => {
  it('projdou schématem', () => {
    expect(() => orderingQuizSchema.parse(raw)).not.toThrow();
  });

  it('má přesně 10 položek s unikátními id', () => {
    expect(quiz.items).toHaveLength(10);
    expect(new Set(quiz.items.map((i) => i.id)).size).toBe(10);
  });

  it('rank tvoří platné soutěžní číslování', () => {
    for (const item of quiz.items) {
      const better = quiz.items.filter((i) => i.rank < item.rank).length;
      expect(item.rank, item.id).toBe(1 + better);
    }
  });

  it('každé [n] v textech existuje v sources a v sourceIds položky', () => {
    const ids = new Set(quiz.sources.map((s) => s.id));
    for (const item of quiz.items) {
      for (const text of [...item.detail, item.legalStatus]) {
        for (const n of refsIn(text)) {
          expect(ids.has(n), `${item.id}: [${n}] chybí v sources`).toBe(true);
          expect(item.sourceIds, `${item.id}: [${n}] chybí v sourceIds`).toContain(n);
        }
      }
    }
  });

  it('každý zdroj je použitý a patří do skupiny', () => {
    const used = new Set(quiz.items.flatMap((i) => i.sourceIds));
    const grouped = new Set(quiz.sourceGroups.flatMap((g) => g.sourceIds));
    for (const s of quiz.sources) {
      expect(grouped.has(s.id), `[${s.id}] není v žádné skupině`).toBe(true);
      const inContext = quiz.sourceGroups.some((g) => !g.itemId && g.sourceIds.includes(s.id));
      expect(used.has(s.id) || inContext, `[${s.id}] není použitý`).toBe(true);
    }
    expect(new Set(quiz.sources.map((s) => s.id)).size).toBe(quiz.sources.length);
  });

  it('zdroje [57] a [58] jsou ve skupině Politický kontext na konci', () => {
    const last = quiz.sourceGroups.at(-1);
    expect(last?.title).toBe('Politický kontext');
    expect(last?.itemId).toBeUndefined();
    expect(last?.sourceIds).toEqual([57, 58]);
  });

  it('skupiny zdrojů jdou v pořadí položek (abecedně), ne podle řešení', () => {
    const groupIds = quiz.sourceGroups.filter((g) => g.itemId).map((g) => g.itemId);
    expect(groupIds).toEqual(quiz.items.map((i) => i.id));
  });

  it('částky mají vyplněné zobrazení, typ a vysvětlení', () => {
    for (const item of quiz.items) {
      expect(item.amount.display.trim()).not.toBe('');
      expect(item.amount.typeLabel.trim()).not.toBe('');
      expect(item.amount.explanation.trim()).not.toBe('');
    }
  });

  it('oneLiner neobsahuje částku', () => {
    const money = /\d\s*(Kč|mil|mld|miliard|milion|€)/i;
    for (const item of quiz.items) {
      expect(item.oneLiner, item.id).not.toMatch(money);
    }
  });

  it('všechny URL začínají https://', () => {
    for (const s of quiz.sources) expect(s.url.startsWith('https://')).toBe(true);
  });

  it('záložní kauza eDálnice v datech není', () => {
    expect(quiz.items.find((i) => i.id === 'edalnice')).toBeUndefined();
  });
});
