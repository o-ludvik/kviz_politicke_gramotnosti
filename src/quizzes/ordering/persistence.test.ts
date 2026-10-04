import { describe, expect, it } from 'vitest';
import { clearState, loadState, quizProgress, saveState, storageKey, type SavedState } from './persistence';

const ranked = [
  { id: 'a', index: [1] },
  { id: 'b', index: [2] },
  { id: 'c', index: [3] },
];
const ids = ranked.map((i) => i.id);
const valid: SavedState = {
  v: 2,
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
    expect(loadState('q', ranked)).toEqual(valid);
    expect(quizProgress('q')).toBe('inProgress');
  });

  it('bez uloženého stavu vrací null', () => {
    expect(loadState('q', ranked)).toBeNull();
    expect(quizProgress('q')).toBe('notStarted');
  });

  it.each([
    ['nečitelný JSON', '{nope'],
    ['jiná verze', JSON.stringify({ ...valid, v: 1 })],
    ['chybějící pole', JSON.stringify({ v: 2, order: ids })],
    ['jiná sada id', JSON.stringify({ ...valid, order: ['a', 'b', 'x'], lastCheckedOrder: null })],
    ['duplicitní id', JSON.stringify({ ...valid, order: ['a', 'a', 'b'], lastCheckedOrder: null })],
    ['neznámé zamčené id', JSON.stringify({ ...valid, locked: ['x'] })],
    ['zámek mimo správný slot', JSON.stringify({ ...valid, locked: ['a'] })],
    ['záporný počet kontrol', JSON.stringify({ ...valid, attempts: -1 })],
    ['null', 'null'],
  ])('poškozený stav (%s) vede k nové hře bez chyby', (_, raw) => {
    localStorage.setItem(storageKey('q'), raw);
    expect(() => loadState('q', ranked)).not.toThrow();
    expect(loadState('q', ranked)).toBeNull();
  });

  it('přežije nedostupné úložiště', () => {
    const original = Storage.prototype.getItem;
    Storage.prototype.getItem = () => {
      throw new Error('SecurityError');
    };
    try {
      expect(loadState('q', ranked)).toBeNull();
    } finally {
      Storage.prototype.getItem = original;
    }
  });

  it('vyřešená hra se na domovské stránce hlásí jako dohraná', () => {
    saveState('q', { ...valid, order: ids, locked: ids, solved: true, revealed: true });
    expect(quizProgress('q')).toBe('solved');
  });

  it('clearState smaže i starý v1 klíč', () => {
    localStorage.setItem(`pg:quiz:q:v1`, '{}');
    saveState('q', valid);
    clearState('q');
    expect(localStorage.getItem(storageKey('q'))).toBeNull();
    expect(localStorage.getItem('pg:quiz:q:v1')).toBeNull();
  });
});
