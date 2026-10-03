import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { App } from './App';
import { saveState } from './quizzes/ordering/persistence';
import { parseHash } from './router';

describe('router', () => {
  it('rozpozná trasy', () => {
    expect(parseHash('')).toEqual({ name: 'home' });
    expect(parseHash('#/')).toEqual({ name: 'home' });
    expect(parseHash('#/kviz/kolik-to-stalo')).toEqual({ name: 'quiz', quizId: 'kolik-to-stalo' });
    expect(parseHash('#/neco')).toEqual({ name: 'notFound' });
  });
});

describe('domovská stránka', () => {
  it('ukazuje kvíz a dvě dlaždice „Připravujeme“', async () => {
    render(<App />);
    expect(screen.getByRole('heading', { level: 1, name: 'Politická gramotnost' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Hrát' })).toHaveAttribute('href', '#/kviz/kolik-to-stalo');
    expect(screen.getAllByText('Připravujeme')).toHaveLength(2);
    expect(await screen.findByText('10 kauz, asi 5 minut')).toBeInTheDocument();
    expect(screen.getByText(/Údaje platí ke 3\. 10\. 2026\./)).toBeInTheDocument();
  });

  it('tlačítko dlaždice odpovídá uloženému stavu', () => {
    const base = { v: 1 as const, order: ['a'], locked: [], attempts: 1, lastCheckedOrder: null };
    saveState('kolik-to-stalo', { ...base, solved: false, revealed: false });
    const { unmount } = render(<App />);
    expect(screen.getByRole('link', { name: 'Pokračovat' })).toBeInTheDocument();
    unmount();
    saveState('kolik-to-stalo', { ...base, solved: true, revealed: true });
    render(<App />);
    expect(screen.getByRole('link', { name: 'Zahrát znovu' })).toBeInTheDocument();
  });

  it('neznámá adresa přesměruje na výběr kvízů s hláškou', async () => {
    window.location.hash = '#/tohle-neexistuje';
    render(<App />);
    expect(await screen.findByText('Tahle stránka neexistuje, tak tě vracíme na výběr kvízů.')).toBeInTheDocument();
    expect(window.location.hash).toBe('#/');
  });

  it('kvíz se načte na své adrese', async () => {
    window.location.hash = '#/kviz/kolik-to-stalo';
    render(<App />);
    expect(await screen.findByRole('heading', { level: 1, name: 'Kolik to stálo stát?' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Všechny kvízy' })).toHaveAttribute('href', '#/');
  });
});
