import { useEffect, useState } from 'react';
import { t } from '../copy';
import { quizProgress as kdoProgress } from '../quizzes/kdo/persistence';
import { quizProgress as orderingProgress } from '../quizzes/ordering/persistence';
import { quizProgress as promisesProgress } from '../quizzes/promises/persistence';
import { registry, type QuizRegistryEntry } from '../quizzes/registry';

type Meta = { count: number; minutes: number };

function progressOf(entry: QuizRegistryEntry) {
  if (entry.type === 'promises') return promisesProgress(entry.id);
  if (entry.type === 'kdo') return kdoProgress(entry.id);
  return orderingProgress(entry.id);
}

function metaLabel(entry: QuizRegistryEntry, meta: Meta): string {
  if (entry.type === 'promises') return t('home.card.meta.promises', { n: meta.count, m: meta.minutes });
  if (entry.type === 'kdo') return t('home.card.meta.kdo', { n: meta.count, m: meta.minutes });
  return t('home.card.meta', { n: meta.count, m: meta.minutes });
}

export function HomePage() {
  return (
    <>
      <header className="home-header">
        <h1 tabIndex={-1}>{t('home.title')}</h1>
        <p className="lead">{t('home.lead')}</p>
      </header>
      <ul className="quiz-list">
        {registry.map((entry) => (
          <li key={entry.id}>
            <QuizTile entry={entry} />
          </li>
        ))}
      </ul>
    </>
  );
}

function QuizTile({ entry }: { entry: QuizRegistryEntry }) {
  const [meta, setMeta] = useState<Meta | null>(null);

  useEffect(() => {
    let alive = true;
    entry
      .load()
      .then((q) => alive && setMeta({ count: q.items.length, minutes: q.estimatedMinutes }))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [entry]);

  const titleId = `tile-${entry.id}`;
  const progress = progressOf(entry);
  const label =
    progress === 'solved'
      ? t('home.card.again')
      : progress === 'inProgress'
        ? t('home.card.resume')
        : t('home.card.start');
  const metaText = meta ? metaLabel(entry, meta) : ' ';

  return (
    <article className="tile" aria-labelledby={titleId}>
      <h2 id={titleId}>{entry.title}</h2>
      <p className="tile__desc">{entry.shortDescription}</p>
      <div className="tile__foot">
        <p className="tile__meta">{metaText}</p>
        <a className="btn btn--primary" href={`#/kviz/${entry.id}`} aria-describedby={titleId}>
          {label}
        </a>
      </div>
    </article>
  );
}
