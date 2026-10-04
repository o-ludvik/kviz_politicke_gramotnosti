import { orderingQuizSchema, scandalsSchema } from '../../src/data/schema';
import type { QuizModule } from '../../src/quizzes/types';
import data from './data.json';
import meta from './meta.json';

/** Vstupní bod kvízu — meta + načtení scandals z data.json. */
const quizModule: QuizModule = {
  id: meta.id,
  type: 'ordering',
  title: meta.title,
  shortDescription: meta.shortDescription,
  load: async () =>
    orderingQuizSchema.parse({
      ...meta,
      items: scandalsSchema.parse(data),
    }),
};

export default quizModule;
