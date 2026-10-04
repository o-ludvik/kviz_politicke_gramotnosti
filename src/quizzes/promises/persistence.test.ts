import { describe, expect, it } from 'vitest';
import { parseSavedState } from './persistence';

const ids = ['a', 'b', 'c'];

describe('promises persistence', () => {
  it('přijme platný stav', () => {
    const saved = parseSavedState(
      { v: 1, order: ['b', 'a', 'c'], index: 1, answers: { b: true }, phase: 'ask' },
      ids,
    );
    expect(saved?.order).toEqual(['b', 'a', 'c']);
  });

  it('odmítne poškozený nebo nekompatibilní stav', () => {
    expect(parseSavedState(null, ids)).toBeNull();
    expect(parseSavedState({ v: 2, order: ids, index: 0, answers: {}, phase: 'ask' }, ids)).toBeNull();
    expect(
      parseSavedState({ v: 1, order: ['a', 'b'], index: 0, answers: {}, phase: 'ask' }, ids),
    ).toBeNull();
    expect(
      parseSavedState(
        { v: 1, order: ids, index: 0, answers: { a: true }, phase: 'ask' },
        ids,
      ),
    ).toBeNull();
  });
});
