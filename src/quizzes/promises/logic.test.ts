import { describe, expect, it } from 'vitest';
import { scoreOf, seededRng, shuffleIds } from './logic';

describe('promises logic', () => {
  it('shuffleIds je deterministický se stejným seedem', () => {
    const ids = ['a', 'b', 'c', 'd', 'e'];
    expect(shuffleIds(ids, seededRng(42))).toEqual(shuffleIds(ids, seededRng(42)));
    expect(shuffleIds(ids, seededRng(1))).not.toEqual(shuffleIds(ids, seededRng(2)));
  });

  it('scoreOf počítá správně a špatně', () => {
    const fulfilled = new Map([
      ['a', true],
      ['b', false],
      ['c', true],
    ]);
    expect(scoreOf({ a: true, b: true, c: true }, fulfilled)).toEqual({
      correct: 2,
      wrong: 1,
      total: 3,
    });
  });
});
