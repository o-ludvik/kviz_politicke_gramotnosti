import { describe, expect, it } from 'vitest';
import data from '../../quizzes/kolik-to-stalo/data.json';
import meta from '../../quizzes/kolik-to-stalo/meta.json';
import { orderingQuizSchema, scandalsSchema } from './schema';

const items = scandalsSchema.parse(data);
const quiz = orderingQuizSchema.parse({ ...meta, items });

describe('data kvízu „Kolik to stálo stát?“', () => {
  it('projdou schématem', () => {
    expect(() => scandalsSchema.parse(data)).not.toThrow();
    expect(() => orderingQuizSchema.parse({ ...meta, items })).not.toThrow();
  });

  it('má přesně 10 položek s unikátními id a indexy 1..N', () => {
    expect(quiz.items).toHaveLength(10);
    expect(new Set(quiz.items.map((i) => i.id)).size).toBe(10);
    expect(new Set(quiz.items.map((i) => i.index)).size).toBe(10);
    expect([...quiz.items.map((i) => i.index)].sort((a, b) => a - b)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });

  it('shortDesc neobsahuje částku', () => {
    const money = /\d\s*(Kč|mil|mld|miliard|milion|€)/i;
    for (const item of quiz.items) {
      expect(item.shortDesc, item.id).not.toMatch(money);
    }
  });

  it('každá kauza má cost a alespoň jeden zdroj', () => {
    for (const item of quiz.items) {
      expect(item.cost.trim()).not.toBe('');
      expect(item.sources.length).toBeGreaterThan(0);
    }
  });

  it('všechny URL začínají https://', () => {
    for (const item of quiz.items) {
      for (const s of item.sources) expect(s.url.startsWith('https://')).toBe(true);
    }
    for (const s of quiz.contextSources) expect(s.url.startsWith('https://')).toBe(true);
  });

  it('záložní kauza eDálnice v datech není', () => {
    expect(quiz.items.find((i) => i.id === 'edalnice')).toBeUndefined();
  });
});
