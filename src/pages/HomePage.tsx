import { useEffect, useState } from 'react';
import { t } from '../copy';
import { quizProgress } from '../quizzes/ordering/persistence';
import { registry, type QuizRegistryEntry } from '../quizzes/registry';

type Meta = { count: number; minutes: number };

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
  const active = entry.status === 'active' && entry.load;

  useEffect(() => {
    let alive = true;
    if (entry.status === 'active')
      entry
        .load?.()
        .then((q) => alive && setMeta({ count: q.items.length, minutes: q.estimatedMinutes }))
        .catch(() => {});
    return () => {
      alive = false;
    };
  }, [entry]);

  const titleId = `tile-${entry.id}`;

  if (!active) {
    return (
      <article className="tile tile--soon" aria-labelledby={titleId}>
        <div className="tile__head">
          <h2 id={titleId}>{entry.title}</h2>
          <span className="tile__soon">{t('home.card.comingSoon')}</span>
        </div>
      </article>
    );
  }

  const progress = quizProgress(entry.id);
  const label =
    progress === 'solved' ? t('home.card.again') : progress === 'inProgress' ? t('home.card.resume') : t('home.card.start');

  return (
    <article className="tile" aria-labelledby={titleId}>
      <h2 id={titleId}>{entry.title}</h2>
      <p className="tile__desc">{entry.shortDescription}</p>
      <div className="tile__foot">
        <p className="tile__meta">{meta ? t('home.card.meta', { n: meta.count, m: meta.minutes }) : ' '}</p>
        <a className="btn btn--primary" href={`#/kviz/${entry.id}`} aria-describedby={titleId}>
          {label}
        </a>
      </div>
    </article>
  );
}
