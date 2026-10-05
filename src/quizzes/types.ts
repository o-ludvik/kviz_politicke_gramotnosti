import type { AnyQuiz } from '../data/schema';

/** Veřejné API složky `quizzes/<id>/index.ts`. */
export type QuizModule = {
  id: string;
  type: 'ordering' | 'promises' | 'kdo';
  title: string;
  shortDescription: string;
  load: () => Promise<AnyQuiz>;
};
