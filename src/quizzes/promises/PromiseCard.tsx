import { t } from '../../copy';
import type { PromiseItem } from '../../data/schema';

function feedbackHeader(tip: boolean, truth: boolean): string {
  const correct = tip === truth;
  if (correct) return truth ? t('promises.feedback.header.correctYes') : t('promises.feedback.header.correctNo');
  return truth ? t('promises.feedback.header.wrongYes') : t('promises.feedback.header.wrongNo');
}

function PhotoQuote({ item }: { item: PromiseItem }) {
  return (
    <figure className="promise-card__hero">
      <img
        className="promise-card__photo"
        src={item.foto.url}
        alt={item.jmeno}
        width={600}
        height={600}
        loading="lazy"
        decoding="async"
      />
      <blockquote className="promise-card__quote">
        <p>„{item.prohlaseni}“</p>
        <footer>
          <cite>{item.zdroj_prohlaseni}</cite>
        </footer>
      </blockquote>
      {(item.foto.atribuace || item.foto.stranka_souboru) && (
        <figcaption className="promise-card__credit">
          {item.foto.atribuace ? (
            <a href={item.foto.stranka_souboru} target="_blank" rel="noopener noreferrer">
              {item.foto.atribuace}
              <span className="sr-only"> {t('sources.newTab')}</span>
            </a>
          ) : (
            <a href={item.foto.stranka_souboru} target="_blank" rel="noopener noreferrer">
              {t('promises.photo.source')}
              <span className="sr-only"> {t('sources.newTab')}</span>
            </a>
          )}
        </figcaption>
      )}
    </figure>
  );
}

function CardBody({ item, titleId }: { item: PromiseItem; titleId: string }) {
  return (
    <div className="promise-card__body">
      <p className="promise-card__meta">
        <span className="promise-card__name">{item.jmeno}</span>
        <span className="promise-card__party"> ({item.strana})</span>
      </p>
      <p className="promise-card__role">
        {item.funkce} · {item.obdobi}
      </p>
      <h2 className="promise-card__promise" id={titleId}>
        {item.slib}
      </h2>
      <p className="promise-card__desc">{item.popis}</p>
    </div>
  );
}

type AskProps = {
  item: PromiseItem;
  progress: string;
  onAnswer: (fulfilled: boolean) => void;
};

/** Karta otázky: fotka s prohlášením, slib + popis; tlačítka mimo kartu. */
export function PromiseAskCard({ item, progress, onAnswer }: AskProps) {
  const titleId = `promise-title-${item.id}`;
  return (
    <div className="promises-stage">
      <p className="promise-card__progress">{progress}</p>
      <article className="promise-card" aria-labelledby={titleId}>
        <PhotoQuote item={item} />
        <CardBody item={item} titleId={titleId} />
      </article>
      <div className="promise-card__actions" role="group" aria-label={t('promises.answer.group')}>
        <button type="button" className="btn btn--primary" onClick={() => onAnswer(true)}>
          {t('promises.answer.yes')}
        </button>
        <button type="button" className="btn btn--secondary" onClick={() => onAnswer(false)}>
          {t('promises.answer.no')}
        </button>
      </div>
    </div>
  );
}

type FeedbackProps = {
  item: PromiseItem;
  tip: boolean;
  progress: string;
  onNext: () => void;
  nextLabel: string;
};

/** Feedback: karta + panel vysunutý zprava s verdiktem a info. */
export function PromiseFeedbackCard({ item, tip, progress, onNext, nextLabel }: FeedbackProps) {
  const correct = tip === item.splnil;
  const titleId = `promise-title-${item.id}`;
  const panelId = `promise-panel-${item.id}`;
  return (
    <div className="promises-stage promises-stage--expanded">
      <p className="promise-card__progress">{progress}</p>
      <div className="promise-card-row">
        <article className="promise-card" aria-labelledby={titleId}>
          <PhotoQuote item={item} />
          <CardBody item={item} titleId={titleId} />
        </article>
        <aside
          className={`promise-panel ${correct ? 'promise-panel--correct' : 'promise-panel--wrong'}`}
          id={panelId}
          aria-live="polite"
        >
          <h3 className="promise-panel__header">{feedbackHeader(tip, item.splnil)}</h3>
          <div className="promise-panel__body">
            {item.info.split(/\n\n+/).map((para, i) => (
              <p key={i}>{para}</p>
            ))}
            <ul className="promise-card__sources">
              {item.zdroje.map((s) => (
                <li key={s.url}>
                  <a href={s.url} target="_blank" rel="noopener noreferrer">
                    {s.nazev}
                    <span className="sr-only"> {t('sources.newTab')}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
      <div className="promise-card__actions">
        <button type="button" className="btn btn--primary" onClick={onNext}>
          {nextLabel}
        </button>
      </div>
    </div>
  );
}

type ReviewProps = {
  item: PromiseItem;
  tip: boolean | undefined;
  expanded: boolean;
  onToggle: (id: string) => void;
};

/** Položka v přehledu po dohrání. */
export function PromiseReviewCard({ item, tip, expanded, onToggle }: ReviewProps) {
  const correct = tip !== undefined && tip === item.splnil;
  const titleId = `review-title-${item.id}`;
  const panelId = `review-panel-${item.id}`;
  return (
    <article
      className={`promise-review ${tip !== undefined ? (correct ? 'promise-review--correct' : 'promise-review--wrong') : ''}`}
    >
      <h3 className="promise-review__title" id={titleId}>
        <button
          type="button"
          className="promise-review__toggle"
          aria-expanded={expanded}
          aria-controls={panelId}
          onClick={() => onToggle(item.id)}
        >
          <span className="promise-review__mark" aria-hidden="true">
            {tip === undefined ? '·' : correct ? '✓' : '✗'}
          </span>
          <span>
            <span className="promise-review__who">{item.jmeno}</span>
            {' — '}
            {item.slib}
          </span>
        </button>
      </h3>
      {expanded && (
        <div className="promise-review__panel" id={panelId}>
          {tip !== undefined && (
            <p className={`promise-review__truth ${correct ? 'promise-review__truth--correct' : 'promise-review__truth--wrong'}`}>
              {feedbackHeader(tip, item.splnil)}
            </p>
          )}
          <p className="promise-review__quote">„{item.prohlaseni}“</p>
          <p className="promise-card__role">{item.zdroj_prohlaseni}</p>
          {item.info.split(/\n\n+/).map((para, i) => (
            <p key={i}>{para}</p>
          ))}
          <ul className="promise-card__sources">
            {item.zdroje.map((s) => (
              <li key={s.url}>
                <a href={s.url} target="_blank" rel="noopener noreferrer">
                  {s.nazev}
                  <span className="sr-only"> {t('sources.newTab')}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}
