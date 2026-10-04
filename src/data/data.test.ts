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

  it('má unikátní id a pokryté pozice 1..N', () => {
    expect(new Set(quiz.items.map((i) => i.id)).size).toBe(quiz.items.length);
    const covered = new Set(quiz.items.flatMap((i) => i.index));
    expect([...covered].sort((a, b) => a - b)).toEqual(
      Array.from({ length: quiz.items.length }, (_, i) => i + 1),
    );
  });

  it('normalizuje číslo i pole indexů', () => {
    const single = quiz.items.find((i) => i.id === 'covid-nakupy')!;
    expect(single.index).toEqual([1]);
    const tie = quiz.items.find((i) => i.id === 'dozimetr')!;
    expect(tie.index).toEqual([4, 5]);
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
});
