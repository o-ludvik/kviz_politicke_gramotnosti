import { promiseItemsSchema, promisesQuizSchema } from '../../src/data/schema';
import type { QuizModule } from '../../src/quizzes/types';
import data from './data.json';
import fotky from './fotky_politiku.json';
import meta from './meta.json';

const fotoByName = new Map(fotky.map((f) => [f.jmeno, f]));

const items = promiseItemsSchema.parse(
  data.map((row) => {
    const foto = fotoByName.get(row.jmeno);
    if (!foto) throw new Error(`chybí fotka pro ${row.jmeno}`);
    return {
      ...row,
      foto: {
        url: foto.foto_url,
        atribuace: foto.atribuce,
        stranka_souboru: foto.stranka_souboru,
        licence: foto.licence,
      },
    };
  }),
);

/** Vstupní bod kvízu — meta + sliby + fotky. */
const quizModule: QuizModule = {
  id: meta.id,
  type: 'promises',
  title: meta.title,
  shortDescription: meta.shortDescription,
  load: async () => promisesQuizSchema.parse({ ...meta, items }),
};

export default quizModule;
