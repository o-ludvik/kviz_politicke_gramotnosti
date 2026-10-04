import { describe, expect, it } from 'vitest';
import orderingData from '../../quizzes/kolik-to-stalo/data.json';
import orderingMeta from '../../quizzes/kolik-to-stalo/meta.json';
import promisesModule from '../../quizzes/politicke-sliby/index';
import {
  orderingQuizSchema,
  promisesQuizSchema,
  scandalsSchema,
  type PromisesQuiz,
} from './schema';

const orderingItems = scandalsSchema.parse(orderingData);
const orderingQuiz = orderingQuizSchema.parse({ ...orderingMeta, items: orderingItems });

describe('data kvízu „Kolik to stálo stát?“', () => {
  it('projdou schématem', () => {
    expect(() => scandalsSchema.parse(orderingData)).not.toThrow();
    expect(() => orderingQuizSchema.parse({ ...orderingMeta, items: orderingItems })).not.toThrow();
  });

  it('má unikátní id a pokryté pozice 1..N', () => {
    expect(new Set(orderingQuiz.items.map((i) => i.id)).size).toBe(orderingQuiz.items.length);
    const covered = new Set(orderingQuiz.items.flatMap((i) => i.index));
    expect([...covered].sort((a, b) => a - b)).toEqual(
      Array.from({ length: orderingQuiz.items.length }, (_, i) => i + 1),
    );
  });

  it('normalizuje číslo i pole indexů', () => {
    const single = orderingQuiz.items.find((i) => i.id === 'covid-nakupy')!;
    expect(single.index).toEqual([1]);
    const tie = orderingQuiz.items.find((i) => i.id === 'dozimetr')!;
    expect(tie.index).toEqual([4, 5]);
  });

  it('shortDesc neobsahuje částku', () => {
    const money = /\d\s*(Kč|mil|mld|miliard|milion|€)/i;
    for (const item of orderingQuiz.items) {
      expect(item.shortDesc, item.id).not.toMatch(money);
    }
  });

  it('každá kauza má cost a alespoň jeden zdroj', () => {
    for (const item of orderingQuiz.items) {
      expect(item.cost.trim()).not.toBe('');
      expect(item.sources.length).toBeGreaterThan(0);
    }
  });

  it('všechny URL začínají https://', () => {
    for (const item of orderingQuiz.items) {
      for (const s of item.sources) expect(s.url.startsWith('https://')).toBe(true);
    }
    for (const s of orderingQuiz.contextSources) expect(s.url.startsWith('https://')).toBe(true);
  });
});

describe('data kvízu „Splnil, nebo nesplnil?“', () => {
  let promisesQuiz: PromisesQuiz;

  it('projdou schématem včetně fotek', async () => {
    promisesQuiz = promisesQuizSchema.parse(await promisesModule.load());
    expect(promisesQuiz.items).toHaveLength(22);
  });

  it('má 22 unikátních slibů s fotkou a prohlášením', async () => {
    const quiz = promisesQuiz ?? promisesQuizSchema.parse(await promisesModule.load());
    expect(new Set(quiz.items.map((i) => i.id)).size).toBe(22);
    for (const item of quiz.items) {
      expect(item.prohlaseni.trim()).not.toBe('');
      expect(item.foto.url.length).toBeGreaterThan(0);
      expect(item.zdroje.length).toBeGreaterThan(0);
    }
  });

  it('má alespoň jeden splněný a jeden nesplněný slib', async () => {
    const quiz = promisesQuiz ?? promisesQuizSchema.parse(await promisesModule.load());
    expect(quiz.items.some((i) => i.splnil)).toBe(true);
    expect(quiz.items.some((i) => !i.splnil)).toBe(true);
  });

  it('všechny URL zdrojů začínají https://', async () => {
    const quiz = promisesQuiz ?? promisesQuizSchema.parse(await promisesModule.load());
    for (const item of quiz.items) {
      for (const s of item.zdroje) expect(s.url.startsWith('https://')).toBe(true);
    }
    for (const s of quiz.contextSources) expect(s.url.startsWith('https://')).toBe(true);
  });
});
