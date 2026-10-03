import { formatDate, t } from '../../copy';
import type { OrderingQuiz } from '../../data/schema';
import { sourceAnchorId } from './sourceLinks';

/** Sekce zdrojů. Skupiny jdou v pořadí z dat (abecedně), nikdy podle řešení. */
export function SourcesList({ quiz }: { quiz: OrderingQuiz }) {
  const byId = new Map(quiz.sources.map((s) => [s.id, s]));

  return (
    <section className="sources" aria-labelledby="sources-title">
      <h2 id="sources-title">{t('sources.title')}</h2>
      <p className="sources__asof">{t('sources.asOf', { datum: formatDate(quiz.dataAsOf) })}</p>
      {quiz.sourceGroups.map((group) => (
        <div className="sources__group" key={group.itemId ?? group.title}>
          <h3>{group.itemId ? group.title : t('sources.contextGroup')}</h3>
          <ul>
            {group.sourceIds.map((n) => {
              const s = byId.get(n);
              if (!s) return null;
              return (
                <li key={n} id={sourceAnchorId(n)} tabIndex={-1} className="sources__item">
                  <span className="sources__num">[{n}]</span>{' '}
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
              );
            })}
          </ul>
        </div>
      ))}
    </section>
  );
}
