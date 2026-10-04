import { describe, expect, it } from 'vitest';
import data from '../../../quizzes/kolik-to-stalo/data.json';
import { scandalsSchema } from '../../data/schema';
import {
  check,
  countCorrect,
  isCorrectAt,
  moveAmongFree,
  oneSolution,
  seededRng,
  shuffle,
  stepAmongFree,
  type RankedItem,
} from './logic';

const items: RankedItem[] = scandalsSchema.parse(data).map(({ id, index }) => ({ id, index }));
const solution = oneSolution(items);

describe('isCorrectAt', () => {
  it('karta s jednou pozicí patří jen do svého slotu', () => {
    const covid = items.find((i) => i.id === 'covid-nakupy')!;
    expect(isCorrectAt(covid, 0)).toBe(true);
    expect(isCorrectAt(covid, 1)).toBe(false);
  });

  it('remíza [4, 5] přijme obě pořadí', () => {
    const a = items.find((i) => i.id === 'capi-hnizdo')!;
    const b = items.find((i) => i.id === 'dozimetr')!;
    expect(a.index).toEqual([4, 5]);
    expect(b.index).toEqual([4, 5]);
    expect(isCorrectAt(a, 3)).toBe(true);
    expect(isCorrectAt(a, 4)).toBe(true);
    expect(isCorrectAt(b, 3)).toBe(true);
    expect(isCorrectAt(b, 4)).toBe(true);

    expect(check(solution, new Set(), items).allCorrect).toBe(true);
    const swapped = [...solution];
    [swapped[3], swapped[4]] = [swapped[4]!, swapped[3]!];
    expect(check(swapped, new Set(), items).allCorrect).toBe(true);
  });
});

describe('moveAmongFree', () => {
  const order = ['a', 'b', 'c', 'd', 'e'];

  it('bez zámků se chová jako obyčejný přesun', () => {
    expect(moveAmongFree(order, new Set(), 0, 3)).toEqual(['b', 'c', 'd', 'a', 'e']);
    expect(moveAmongFree(order, new Set(), 4, 1)).toEqual(['a', 'e', 'b', 'c', 'd']);
  });

  it('zamčenou kartu přeskočí a nechá ji na místě', () => {
    expect(moveAmongFree(order, new Set(['c']), 0, 4)).toEqual(['b', 'd', 'c', 'e', 'a']);
  });

  it('puštění nad zamčenou kartou skončí v nejbližším volném slotu ve směru pohybu', () => {
    expect(moveAmongFree(order, new Set(['c']), 0, 2)).toEqual(['b', 'd', 'c', 'a', 'e']);
    expect(moveAmongFree(order, new Set(['c']), 4, 2)).toEqual(['a', 'e', 'c', 'b', 'd']);
  });

  it('když ve směru pohybu volný slot není, použije opačnou stranu', () => {
    expect(moveAmongFree(order, new Set(['d', 'e']), 0, 4)).toEqual(['b', 'c', 'a', 'd', 'e']);
  });

  it('zamčenou kartou nejde pohnout', () => {
    expect(moveAmongFree(order, new Set(['a']), 0, 3)).toEqual(order);
  });

  it('nikdy nepohne zamčenou kartou (náhodný test)', () => {
    const rng = seededRng(42);
    const ids = items.map((i) => i.id);
    for (let round = 0; round < 50; round++) {
      let current = shuffle(items, rng);
      const locked = new Set(ids.filter(() => rng() < 0.35));
      const lockedSlots = new Map([...locked].map((id) => [id, current.indexOf(id)]));
      for (let move = 0; move < 20; move++) {
        const from = Math.floor(rng() * ids.length);
        const to = Math.floor(rng() * ids.length);
        current = moveAmongFree(current, locked, from, to);
        for (const [id, slot] of lockedSlots) expect(current[slot]).toBe(id);
        expect([...current].sort()).toEqual([...ids].sort());
      }
    }
  });
});

describe('stepAmongFree', () => {
  const order = ['a', 'b', 'c', 'd'];

  it('prohodí kartu s nejbližší volnou kartou a přeskočí zamčené', () => {
    expect(stepAmongFree(order, new Set(['c']), 3, -1)).toEqual(['a', 'd', 'c', 'b']);
    expect(stepAmongFree(order, new Set(['b', 'c']), 0, 1)).toEqual(['d', 'b', 'c', 'a']);
  });

  it('když volná karta v daném směru není, nic se nestane', () => {
    expect(stepAmongFree(order, new Set(['a']), 1, -1)).toEqual(order);
    expect(stepAmongFree(order, new Set(), 3, 1)).toEqual(order);
  });
});

describe('shuffle', () => {
  it('nikdy nevrátí vyřešený stav a nejvýš jedna karta je na správném místě', () => {
    for (let seed = 0; seed < 500; seed++) {
      const order = shuffle(items, seededRng(seed));
      expect(countCorrect(order, items)).toBeLessThanOrEqual(1);
      expect(check(order, new Set(), items).allCorrect).toBe(false);
      expect([...order].sort()).toEqual(items.map((i) => i.id).sort());
    }
  });

  it('se stejným seedem vrací stejný výsledek', () => {
    expect(shuffle(items, seededRng(7))).toEqual(shuffle(items, seededRng(7)));
  });
});

describe('check', () => {
  it('vrací nově zamčené karty a allCorrect', () => {
    const order = [...solution];
    // prohodí 1. a 2. místo, zbytek je správně
    [order[0], order[1]] = [order[1]!, order[0]!];
    const first = check(order, new Set(), items);
    expect(first.allCorrect).toBe(false);
    expect(first.newlyLocked).toHaveLength(items.length - 2);
    expect(first.newlyLocked).not.toContain(order[0]);

    const locked = new Set(first.newlyLocked);
    const second = check(order, locked, items);
    expect(second.newlyLocked).toEqual([]);

    const fixed = stepAmongFree(order, locked, 1, -1);
    const third = check(fixed, locked, items);
    expect(third.newlyLocked.sort()).toEqual([order[0], order[1]].sort());
    expect(third.allCorrect).toBe(true);
  });
});
