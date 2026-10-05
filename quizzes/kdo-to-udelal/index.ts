import { kdoItemsSchema, kdoQuizSchema } from '../../src/data/schema';
import type { QuizModule } from '../../src/quizzes/types';
import data from './data.json';
import anoImg from './images/ano.svg';
import spoluImg from './images/spolu.svg';
import meta from './meta.json';
import vladyRaw from './vlady.json';

const images: Record<string, string> = {
  'ano.svg': anoImg,
  'spolu.svg': spoluImg,
};

function sourceTitle(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

const items = kdoItemsSchema.parse(
  data.map((row) => ({
    id: row.id,
    nazev: row.nazev,
    vlada: row.vlada,
    datum: row.datum,
    kratky_popis: row.kratky_popis,
    dlouhy_popis: row.dlouhy_popis,
    kdo: row.kdo,
    zdroje: row.zdroje.map((url) => ({ title: sourceTitle(url), url })),
  })),
);

const vlady = vladyRaw.map((v) => {
  const url = images[v.obrazek];
  if (!url) throw new Error(`chybí obrázek ${v.obrazek}`);
  return { ...v, obrazekUrl: url };
});

/** Vstupní bod kvízu — meta + témata + loga vlád. */
const quizModule: QuizModule = {
  id: meta.id,
  type: 'kdo',
  title: meta.title,
  shortDescription: meta.shortDescription,
  load: async () => kdoQuizSchema.parse({ ...meta, items, vlady }),
};

export default quizModule;
