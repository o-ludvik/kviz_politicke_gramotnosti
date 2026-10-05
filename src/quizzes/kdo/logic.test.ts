import { describe, expect, it } from 'vitest';
import { scoreOf, seededRng, shuffleIds } from './logic';

describe('kdo logic', () => {
  it('shuffleIds je deterministický se stejným seedem', () => {
    const ids = ['a', 'b', 'c', 'd', 'e'];
    expect(shuffleIds(ids, seededRng(42))).toEqual(shuffleIds(ids, seededRng(42)));
    expect(shuffleIds(ids, seededRng(1))).not.toEqual(shuffleIds(ids, seededRng(2)));
  });

  it('scoreOf počítá správně a špatně', () => {
    const vlady = new Map([
      ['a', 'ano' as const],
      ['b', 'spolu' as const],
      ['c', 'ano' as const],
    ]);
    expect(scoreOf({ a: 'ano', b: 'ano', c: 'ano' }, vlady)).toEqual({
      correct: 2,
      wrong: 1,
      total: 3,
    });
  });
});
