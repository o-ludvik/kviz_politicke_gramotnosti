import type { OrderingQuiz } from '../data/schema';

/** Veřejné API složky `quizzes/<id>/index.ts`. */
export type QuizModule = {
  id: string;
  type: 'ordering';
  title: string;
  shortDescription: string;
  load: () => Promise<OrderingQuiz>;
};
