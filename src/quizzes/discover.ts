import type { OrderingQuiz } from '../data/schema';
import type { QuizModule } from './types';

export type QuizRegistryEntry = {
  id: string;
  type: 'ordering';
  title: string;
  shortDescription: string;
  load: () => Promise<OrderingQuiz>;
};

const modules = import.meta.glob<{ default: QuizModule }>('../../quizzes/*/index.ts', {
  eager: true,
});

/** Kvízy nalezené ve složkách `quizzes/<id>/` při sestavení. */
export const registry: QuizRegistryEntry[] = Object.values(modules)
  .map((m) => m.default)
  .filter((m): m is QuizModule => Boolean(m?.id && m.load))
  .map(({ id, type, title, shortDescription, load }) => ({
    id,
    type,
    title,
    shortDescription,
    load,
  }))
  .sort((a, b) => a.title.localeCompare(b.title, 'cs'));

export function findQuiz(id: string): QuizRegistryEntry | undefined {
  return registry.find((q) => q.id === id);
}
