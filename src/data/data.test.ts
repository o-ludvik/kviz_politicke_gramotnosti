import { describe, expect, it } from 'vitest';
import kdoModule from '../../quizzes/kdo-to-udelal/index';
import orderingData from '../../quizzes/kolik-to-stalo/data.json';
import orderingMeta from '../../quizzes/kolik-to-stalo/meta.json';
import promisesModule from '../../quizzes/politicke-sliby/index';
import {
  kdoQuizSchema,
  orderingQuizSchema,
  promisesQuizSchema,
  scandalsSchema,
  type KdoQuiz,
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

describe('data kvízu „ANO, nebo SPOLU?“', () => {
  let kdoQuiz: KdoQuiz;

  it('projdou schématem včetně log vlád', async () => {
    kdoQuiz = kdoQuizSchema.parse(await kdoModule.load());
    expect(kdoQuiz.items).toHaveLength(10);
    expect(kdoQuiz.vlady).toHaveLength(2);
  });

  it('má unikátní id a jen vlady ano/spolu', async () => {
    const quiz = kdoQuiz ?? kdoQuizSchema.parse(await kdoModule.load());
    expect(new Set(quiz.items.map((i) => i.id)).size).toBe(10);
    for (const item of quiz.items) {
      expect(['ano', 'spolu']).toContain(item.vlada);
      expect(item.kratky_popis.trim()).not.toBe('');
      expect(item.dlouhy_popis.trim()).not.toBe('');
      expect(item.kdo.trim()).not.toBe('');
      expect(item.zdroje.length).toBeGreaterThan(0);
    }
  });

  it('má vyvážené přiřazení 5× ano a 5× spolu', async () => {
    const quiz = kdoQuiz ?? kdoQuizSchema.parse(await kdoModule.load());
    expect(quiz.items.filter((i) => i.vlada === 'ano')).toHaveLength(5);
    expect(quiz.items.filter((i) => i.vlada === 'spolu')).toHaveLength(5);
  });

  it('všechny URL zdrojů začínají https://', async () => {
    const quiz = kdoQuiz ?? kdoQuizSchema.parse(await kdoModule.load());
    for (const item of quiz.items) {
      for (const s of item.zdroje) expect(s.url.startsWith('https://')).toBe(true);
    }
    for (const v of quiz.vlady) {
      expect(v.obrazekUrl.length).toBeGreaterThan(0);
      expect(v.stranka_souboru.startsWith('https://')).toBe(true);
    }
  });
});
