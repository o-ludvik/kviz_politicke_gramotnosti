import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import data from '../../../quizzes/kolik-to-stalo/data.json';
import meta from '../../../quizzes/kolik-to-stalo/meta.json';
import { orderingQuizSchema, scandalsSchema } from '../../data/schema';
import { oneSolution, seededRng } from './logic';
import { OrderingQuiz } from './OrderingQuiz';
import { loadState, saveState, storageKey } from './persistence';

vi.mock('canvas-confetti', () => {
  const create = () => Object.assign(() => null, { reset: () => {} });
  return { default: Object.assign(() => null, { create, shapeFromText: () => ({}) }) };
});

const quiz = orderingQuizSchema.parse({ ...meta, items: scandalsSchema.parse(data) });
const solution = oneSolution(quiz.items);
const n = quiz.items.length;

function renderQuiz() {
  const onExit = vi.fn();
  const utils = render(<OrderingQuiz quiz={quiz} onExit={onExit} rng={seededRng(1)} />);
  return { ...utils, onExit };
}

function amountTexts() {
  return quiz.items.map((i) => i.cost);
}

function presetSolvedOrder() {
  saveState(quiz.id, {
    v: 2,
    order: solution,
    locked: [],
    attempts: 2,
    lastCheckedOrder: null,
    solved: false,
    revealed: false,
  });
}

describe('OrderingQuiz', () => {
  it('před vyřešením DOM neobsahuje částky', () => {
    const { container } = renderQuiz();
    const html = container.innerHTML;
    for (const text of amountTexts()) expect(html).not.toContain(text);
    expect(screen.getAllByRole('listitem').length).toBeGreaterThanOrEqual(n);
  });

  it('ani po kontrole se zamčenými kartami se částky neukážou', async () => {
    const user = userEvent.setup();
    const order = [...solution];
    [order[0], order[1]] = [order[1]!, order[0]!];
    saveState(quiz.id, { v: 2, order, locked: [], attempts: 0, lastCheckedOrder: null, solved: false, revealed: false });
    const { container } = renderQuiz();
    await user.click(screen.getByRole('button', { name: 'Zkontrolovat pořadí' }));
    expect(
      screen.getByText(`Správně máš ${n - 2} z ${n}. Zelené karty zůstanou na svém místě.`),
    ).toBeInTheDocument();
    expect(screen.getAllByText('Správně')).toHaveLength(n - 2);
    for (const text of amountTexts()) expect(container.innerHTML).not.toContain(text);
  });

  it('bez změny pořadí nejde kontrolovat znovu', async () => {
    const user = userEvent.setup();
    renderQuiz();
    const btn = screen.getByRole('button', { name: 'Zkontrolovat pořadí' });
    await user.click(btn);
    expect(btn).toHaveAttribute('aria-disabled', 'true');
    expect(screen.getByText('Nejdřív něco přesuň')).toBeInTheDocument();
    expect(screen.getByText('Počet kontrol: 1')).toBeInTheDocument();
    await user.click(btn);
    expect(screen.getByText('Počet kontrol: 1')).toBeInTheDocument();
  });

  it('tlačítka ▲ ▼ přesouvají kartu a oznámí novou pozici', async () => {
    const user = userEvent.setup();
    renderQuiz();
    const saved = loadState(quiz.id)!;
    const secondId = saved.order[1]!;
    const title = quiz.items.find((i) => i.id === secondId)!.name;
    await user.click(screen.getByRole('button', { name: `Posunout ${title} výš` }));
    expect(loadState(quiz.id)!.order[0]).toBe(secondId);
    expect(await screen.findByText(new RegExp(`${title} je teď na 1\\. místě\\.`))).toBeInTheDocument();
    expect(screen.getByRole('button', { name: `Posunout ${title} výš` })).toHaveAttribute('aria-disabled', 'true');
  });

  it('po vyřešení se objeví dialog, po „Ukázat částky“ jsou částky vidět a rolety přepínají aria-expanded', async () => {
    const user = userEvent.setup();
    presetSolvedOrder();
    renderQuiz();
    await user.click(screen.getByRole('button', { name: 'Zkontrolovat pořadí' }));

    const dialog = screen.getByRole('dialog', { name: 'Gratulujeme!' });
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(within(dialog).getByText(`Všech ${n} kauz máš ve správném pořadí.`)).toBeInTheDocument();
    expect(within(dialog).getByText('Počet kontrol: 3')).toBeInTheDocument();
    expect(document.activeElement).toBe(within(dialog).getByRole('heading', { name: 'Gratulujeme!' }));

    await user.click(within(dialog).getByRole('button', { name: 'Ukázat částky' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    for (const item of quiz.items) {
      expect(screen.getByText(item.cost)).toBeInTheDocument();
    }
    expect(screen.getByText('Klikni na kauzu a přečti si, odkud částka pochází.')).toBeInTheDocument();

    const toggle = screen.getByRole('button', { name: /Čapí hnízdo/ });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await user.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    const panel = document.getElementById(toggle.getAttribute('aria-controls')!)!;
    expect(panel).toBeVisible();
    expect(within(panel).getByText(/Období:/)).toBeInTheDocument();
    await user.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'false');

    expect(loadState(quiz.id)).toMatchObject({ solved: true, revealed: true });
    expect(screen.getByRole('button', { name: 'Zahrát znovu' })).toBeInTheDocument();
  });

  it('Esc v dialogu funguje jako „Ukázat částky“', async () => {
    const user = userEvent.setup();
    presetSolvedOrder();
    renderQuiz();
    await user.click(screen.getByRole('button', { name: 'Zkontrolovat pořadí' }));
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByText(quiz.items.find((i) => i.id === solution[0])!.cost)).toBeInTheDocument();
  });

  it('„Zahrát znovu“ po potvrzení smaže postup a znovu zamíchá', async () => {
    const user = userEvent.setup();
    saveState(quiz.id, {
      v: 2,
      order: solution,
      locked: solution,
      attempts: 4,
      lastCheckedOrder: solution,
      solved: true,
      revealed: true,
    });
    renderQuiz();
    const confirm = vi.spyOn(window, 'confirm').mockReturnValueOnce(false).mockReturnValueOnce(true);
    await user.click(screen.getByRole('button', { name: 'Zahrát znovu' }));
    expect(loadState(quiz.id)?.solved).toBe(true);
    await user.click(screen.getByRole('button', { name: 'Zahrát znovu' }));
    expect(confirm).toHaveBeenCalledWith('Opravdu začít znovu? Současný postup se smaže.');
    const state = loadState(quiz.id)!;
    expect(state).toMatchObject({ solved: false, revealed: false, attempts: 0, locked: [] });
    expect(state.order).not.toEqual(solution);
    expect(screen.getByRole('button', { name: 'Zkontrolovat pořadí' })).toBeInTheDocument();
    confirm.mockRestore();
  });

  it('sekce zdrojů je vidět i před vyřešením a je seskupená abecedně', () => {
    renderQuiz();
    const sources = screen.getByRole('region', { name: 'Zdroje' });
    const groups = within(sources).getAllByRole('heading', { level: 3 }).map((h) => h.textContent);
    const expected = [...quiz.items.map((i) => i.name)].sort((a, b) => a.localeCompare(b, 'cs'));
    expected.push('Politický kontext');
    expect(groups).toEqual(expected);
    const link = within(sources).getAllByRole('link')[0]!;
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('poškozený uložený stav vede k nové hře bez chyby', () => {
    localStorage.setItem(storageKey(quiz.id), '{"v":1,"order":["x"]}');
    expect(() => renderQuiz()).not.toThrow();
    expect(loadState(quiz.id)?.order).toHaveLength(n);
  });

  it('zamčená karta nemá úchyt ani tlačítka posunu', async () => {
    const user = userEvent.setup();
    const order = [...solution];
    [order[0], order[1]] = [order[1]!, order[0]!];
    saveState(quiz.id, { v: 2, order, locked: [], attempts: 0, lastCheckedOrder: null, solved: false, revealed: false });
    renderQuiz();
    await user.click(screen.getByRole('button', { name: 'Zkontrolovat pořadí' }));
    const lockedTitle = quiz.items.find((i) => i.id === order[5])!.name;
    expect(screen.queryByRole('button', { name: `Přetáhnout kartu ${lockedTitle}` })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: `Posunout ${lockedTitle} výš` })).not.toBeInTheDocument();
    // Dvě volné karty jsou v slotech 0 a 1; ▼ u první je prohodí přes nic zamčeného.
    const firstTitle = quiz.items.find((i) => i.id === order[0])!.name;
    await act(async () => {
      await user.click(screen.getByRole('button', { name: `Posunout ${firstTitle} níž` }));
    });
    expect(loadState(quiz.id)!.order).toEqual(solution);
  });
});
