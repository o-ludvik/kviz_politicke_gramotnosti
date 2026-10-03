import { orderingQuizSchema, type OrderingQuiz } from '../data/schema';

export type QuizRegistryEntry = {
  id: string;
  type: 'ordering';
  status: 'active' | 'comingSoon';
  title: string;
  shortDescription: string;
  load?: () => Promise<OrderingQuiz>;
};

/** Data kvízu se načítají dynamicky a ověří se schématem. */
const loadOrdering = (importer: () => Promise<{ default: unknown }>) => async () =>
  orderingQuizSchema.parse((await importer()).default);

export const registry: QuizRegistryEntry[] = [
  {
    id: 'kolik-to-stalo',
    type: 'ordering',
    status: 'active',
    title: 'Kolik to stálo stát?',
    shortDescription: 'Seřaď 10 politických kauz podle toho, kolik stály veřejné rozpočty.',
    load: loadOrdering(() => import('../data/quizzes/kolik-to-stalo.json')),
  },
  // Ukázkové dlaždice (GDD kap. 5); vlastník je přepíše nebo smaže.
  {
    id: 'kdo-je-kdo-ve-vlade',
    type: 'ordering',
    status: 'comingSoon',
    title: 'Kdo je kdo ve vládě',
    shortDescription: 'Ukázková dlaždice připravovaného kvízu.',
  },
  {
    id: 'jak-vznika-zakon',
    type: 'ordering',
    status: 'comingSoon',
    title: 'Jak vzniká zákon',
    shortDescription: 'Ukázková dlaždice připravovaného kvízu.',
  },
];

export function findQuiz(id: string): QuizRegistryEntry | undefined {
  return registry.find((q) => q.id === id && q.status === 'active' && q.load);
}
