import { describe, expect, it } from 'vitest';
import raw from '../../data/quizzes/kolik-to-stalo.json';
import {
  check,
  correctSlotRange,
  countCorrect,
  isCorrectAt,
  moveAmongFree,
  seededRng,
  shuffle,
  stepAmongFree,
  type RankedItem,
} from './logic';

const items: RankedItem[] = raw.items.map(({ id, rank }) => ({ id, rank }));
const solution = [...items].sort((a, b) => a.rank - b.rank).map((i) => i.id);

describe('correctSlotRange a isCorrectAt', () => {
  it('tři karty s rank 7 patří do slotů 6–8', () => {
    expect(correctSlotRange(items, 7)).toEqual([6, 8]);
    expect(correctSlotRange(items, 1)).toEqual([0, 0]);
    expect(correctSlotRange(items, 10)).toEqual([9, 9]);
  });

  it('přijme kterékoli pořadí karet se stejným rank', () => {
    const ties = items.filter((i) => i.rank === 7);
    for (const item of ties) {
      for (const slot of [6, 7, 8]) expect(isCorrectAt(item, slot, items)).toBe(true);
      expect(isCorrectAt(item, 5, items)).toBe(false);
      expect(isCorrectAt(item, 9, items)).toBe(false);
    }
    const permuted = [...solution];
    [permuted[6], permuted[8]] = [permuted[8]!, permuted[6]!];
    expect(check(permuted, new Set(), items).allCorrect).toBe(true);
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
    expect(first.newlyLocked).toHaveLength(8);
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
