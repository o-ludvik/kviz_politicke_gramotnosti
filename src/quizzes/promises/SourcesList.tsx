import { formatDate, t } from '../../copy';
import type { PromisesQuiz } from '../../data/schema';

type ListedSource = { title: string; url: string; publisher?: string; date?: string };

/** Sekce zdrojů seskupená podle slibu, plus volitelný kontext. */
export function SourcesList({ quiz }: { quiz: PromisesQuiz }) {
  const groups: { title: string; sources: ListedSource[] }[] = [...quiz.items]
    .sort((a, b) => a.slib.localeCompare(b.slib, 'cs'))
    .map((item) => ({
      title: `${item.jmeno}: ${item.slib}`,
      sources: item.zdroje.map((s) => ({ title: s.nazev, url: s.url })),
    }));

  if (quiz.contextSources.length > 0) {
    groups.push({
      title: t('sources.contextGroup'),
      sources: quiz.contextSources.map((s) => ({
        title: s.title,
        url: s.url,
        publisher: s.publisher,
        date: s.date,
      })),
    });
  }

  return (
    <section className="sources" aria-labelledby="sources-title">
      <h2 id="sources-title">{t('sources.title')}</h2>
      <p className="sources__asof">{t('sources.asOf', { datum: formatDate(quiz.dataAsOf) })}</p>
      {groups.map((group) => (
        <div className="sources__group" key={group.title}>
          <h3>{group.title}</h3>
          <ul>
            {group.sources.map((s) => (
              <li key={s.url} className="sources__item">
                <a href={s.url} target="_blank" rel="noopener noreferrer">
                  {s.title}
                  <span className="sr-only"> {t('sources.newTab')}</span>
                </a>
                {s.publisher && (
                  <span className="sources__publisher">
                    {', '}
                    {s.publisher}
                    {s.date && ` (${s.date})`}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}
