import { formatDate, t } from '../../copy';
import type { OrderingQuiz } from '../../data/schema';

/** Sekce zdrojů seskupená podle kauz (abecedně), plus volitelný politický kontext. */
export function SourcesList({ quiz }: { quiz: OrderingQuiz }) {
  const groups = [...quiz.items]
    .sort((a, b) => a.name.localeCompare(b.name, 'cs'))
    .map((item) => ({ title: item.name, sources: item.sources }));

  if (quiz.contextSources.length > 0) {
    groups.push({ title: t('sources.contextGroup'), sources: quiz.contextSources });
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
                <span className="sources__publisher">
                  {', '}
                  {s.publisher}
                  {s.date && ` (${s.date})`}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}
