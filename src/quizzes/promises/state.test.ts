import { describe, expect, it } from 'vitest';
import { newGame, reducer } from './state';

describe('promises state', () => {
  it('ANSWER → NEXT projde až do done', () => {
    let s = newGame(['a', 'b']);
    s = reducer(s, { type: 'ANSWER', fulfilled: true });
    expect(s.phase).toBe('feedback');
    expect(s.answers.a).toBe(true);
    s = reducer(s, { type: 'NEXT' });
    expect(s.phase).toBe('ask');
    expect(s.index).toBe(1);
    s = reducer(s, { type: 'ANSWER', fulfilled: false });
    s = reducer(s, { type: 'NEXT' });
    expect(s.phase).toBe('done');
    expect(Object.keys(s.answers)).toHaveLength(2);
  });

  it('RESTART vymaže odpovědi', () => {
    let s = newGame(['a']);
    s = reducer(s, { type: 'ANSWER', fulfilled: true });
    s = reducer(s, { type: 'RESTART', order: ['a'] });
    expect(s).toEqual(newGame(['a']));
  });
});
