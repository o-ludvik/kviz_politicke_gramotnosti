import { describe, expect, it } from 'vitest';
import { loadState, quizProgress, saveState, storageKey, type SavedState } from './persistence';

const ids = ['a', 'b', 'c'];
const valid: SavedState = {
  v: 1,
  order: ['b', 'a', 'c'],
  locked: ['c'],
  attempts: 2,
  lastCheckedOrder: ['b', 'a', 'c'],
  solved: false,
  revealed: false,
};

describe('persistence', () => {
  it('uloží a načte platný stav', () => {
    saveState('q', valid);
    expect(loadState('q', ids)).toEqual(valid);
    expect(quizProgress('q')).toBe('inProgress');
  });

  it('bez uloženého stavu vrací null', () => {
    expect(loadState('q', ids)).toBeNull();
    expect(quizProgress('q')).toBe('notStarted');
  });

  it.each([
    ['nečitelný JSON', '{nope'],
    ['jiná verze', JSON.stringify({ ...valid, v: 2 })],
    ['chybějící pole', JSON.stringify({ v: 1, order: ids })],
    ['jiná sada id', JSON.stringify({ ...valid, order: ['a', 'b', 'x'], lastCheckedOrder: null })],
    ['duplicitní id', JSON.stringify({ ...valid, order: ['a', 'a', 'b'], lastCheckedOrder: null })],
    ['neznámé zamčené id', JSON.stringify({ ...valid, locked: ['x'] })],
    ['záporný počet kontrol', JSON.stringify({ ...valid, attempts: -1 })],
    ['null', 'null'],
  ])('poškozený stav (%s) vede k nové hře bez chyby', (_, raw) => {
    localStorage.setItem(storageKey('q'), raw);
    expect(() => loadState('q', ids)).not.toThrow();
    expect(loadState('q', ids)).toBeNull();
  });

  it('přežije nedostupné úložiště', () => {
    const original = Storage.prototype.getItem;
    Storage.prototype.getItem = () => {
      throw new Error('SecurityError');
    };
    try {
      expect(loadState('q', ids)).toBeNull();
    } finally {
      Storage.prototype.getItem = original;
    }
  });

  it('vyřešená hra se na domovské stránce hlásí jako dohraná', () => {
    saveState('q', { ...valid, solved: true, revealed: true, locked: ids });
    expect(quizProgress('q')).toBe('solved');
  });
});
