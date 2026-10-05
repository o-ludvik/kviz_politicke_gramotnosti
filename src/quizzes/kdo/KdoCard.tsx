import { useState, type DragEvent } from 'react';
import { formatDate, t } from '../../copy';
import type { KdoItem, KdoVlada } from '../../data/schema';
import type { VladaId } from './logic';

type AskProps = {
  item: KdoItem;
  vlady: readonly [KdoVlada, KdoVlada];
  progress: string;
  onAnswer: (vlada: VladaId) => void;
};

/** Otázka: téma nahoře, dvě drop zóny vlád dole (drag + click). */
export function KdoAskCard({ item, vlady, progress, onAnswer }: AskProps) {
  const titleId = `kdo-title-${item.id}`;
  const [over, setOver] = useState<VladaId | null>(null);

  const onDragStart = (e: DragEvent) => {
    e.dataTransfer.setData('text/plain', item.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const onDrop = (vlada: VladaId) => (e: DragEvent) => {
    e.preventDefault();
    setOver(null);
    onAnswer(vlada);
  };

  return (
    <div className="kdo-stage">
      <p className="kdo-progress">{progress}</p>
      <article
        className="kdo-topic"
        aria-labelledby={titleId}
        draggable
        onDragStart={onDragStart}
        aria-grabbed="false"
      >
        <h2 className="kdo-topic__title" id={titleId}>
          {item.nazev}
        </h2>
        <p className="kdo-topic__desc">{item.kratky_popis}</p>
        <p className="kdo-topic__hint">{t('kdo.drag.hint')}</p>
      </article>

      <div className="kdo-drops" role="group" aria-label={t('kdo.answer.group')}>
        {vlady.map((v) => (
          <button
            key={v.id}
            type="button"
            className={`kdo-drop ${over === v.id ? 'kdo-drop--over' : ''}`}
            onClick={() => onAnswer(v.id)}
            onDragOver={(e) => {
              e.preventDefault();
              e.dataTransfer.dropEffect = 'move';
              setOver(v.id);
            }}
            onDragLeave={() => setOver((cur) => (cur === v.id ? null : cur))}
            onDrop={onDrop(v.id)}
          >
            <img className="kdo-drop__logo" src={v.obrazekUrl} alt="" width={160} height={80} />
            <span className="kdo-drop__label">{v.label}</span>
            <span className="kdo-drop__popis">{v.popis}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

type FeedbackProps = {
  item: KdoItem;
  tip: VladaId;
  vlady: readonly [KdoVlada, KdoVlada];
  progress: string;
  onNext: () => void;
  nextLabel: string;
};

function vladaLabel(vlady: readonly KdoVlada[], id: VladaId): string {
  return vlady.find((v) => v.id === id)?.label ?? id.toUpperCase();
}

/** Feedback: verdikt + datum, kdo, dlouhý popis. */
export function KdoFeedbackCard({ item, tip, vlady, progress, onNext, nextLabel }: FeedbackProps) {
  const correct = tip === item.vlada;
  const titleId = `kdo-title-${item.id}`;
  const panelId = `kdo-panel-${item.id}`;
  return (
    <div className="kdo-stage kdo-stage--feedback">
      <p className="kdo-progress">{progress}</p>
      <article className="kdo-topic" aria-labelledby={titleId}>
        <h2 className="kdo-topic__title" id={titleId}>
          {item.nazev}
        </h2>
        <p className="kdo-topic__desc">{item.kratky_popis}</p>
      </article>
      <aside
        className={`kdo-panel ${correct ? 'kdo-panel--correct' : 'kdo-panel--wrong'}`}
        id={panelId}
        aria-live="polite"
      >
        <h3 className="kdo-panel__header">
          {correct ? t('kdo.feedback.correct') : t('kdo.feedback.wrong')}
        </h3>
        <div className="kdo-panel__body">
          {!correct && (
            <p className="kdo-panel__truth">
              {t('kdo.feedback.truth', { vlada: vladaLabel(vlady, item.vlada) })}
            </p>
          )}
          <p className="kdo-panel__meta">{t('kdo.meta.date', { datum: formatDate(item.datum) })}</p>
          <p className="kdo-panel__meta">{t('kdo.meta.who', { kdo: item.kdo })}</p>
          {item.dlouhy_popis.split(/\n\n+/).map((para, i) => (
            <p key={i}>{para}</p>
          ))}
          <ul className="kdo-sources">
            {item.zdroje.map((s) => (
              <li key={s.url}>
                <a href={s.url} target="_blank" rel="noopener noreferrer">
                  {s.title}
                  <span className="sr-only"> {t('sources.newTab')}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </aside>
      <div className="kdo-actions">
        <button type="button" className="btn btn--primary" onClick={onNext}>
          {nextLabel}
        </button>
      </div>
    </div>
  );
}

type ReviewProps = {
  item: KdoItem;
  tip: VladaId | undefined;
  vlady: readonly [KdoVlada, KdoVlada];
  expanded: boolean;
  onToggle: (id: string) => void;
};

/** Položka v přehledu po dohrání. */
export function KdoReviewCard({ item, tip, vlady, expanded, onToggle }: ReviewProps) {
  const correct = tip !== undefined && tip === item.vlada;
  const titleId = `kdo-review-title-${item.id}`;
  const panelId = `kdo-review-panel-${item.id}`;
  return (
    <article
      className={`kdo-review ${tip !== undefined ? (correct ? 'kdo-review--correct' : 'kdo-review--wrong') : ''}`}
    >
      <h3 className="kdo-review__title" id={titleId}>
        <button
          type="button"
          className="kdo-review__toggle"
          aria-expanded={expanded}
          aria-controls={panelId}
          onClick={() => onToggle(item.id)}
        >
          <span className="kdo-review__mark" aria-hidden="true">
            {tip === undefined ? '·' : correct ? '✓' : '✗'}
          </span>
          <span>{item.nazev}</span>
        </button>
      </h3>
      {expanded && (
        <div className="kdo-review__panel" id={panelId}>
          {tip !== undefined && (
            <p
              className={`kdo-review__truth ${correct ? 'kdo-review__truth--correct' : 'kdo-review__truth--wrong'}`}
            >
              {correct ? t('kdo.feedback.correct') : t('kdo.feedback.wrong')}
              {' — '}
              {t('kdo.feedback.truth', { vlada: vladaLabel(vlady, item.vlada) })}
            </p>
          )}
          <p className="kdo-panel__meta">{t('kdo.meta.date', { datum: formatDate(item.datum) })}</p>
          <p className="kdo-panel__meta">{t('kdo.meta.who', { kdo: item.kdo })}</p>
          {item.dlouhy_popis.split(/\n\n+/).map((para, i) => (
            <p key={i}>{para}</p>
          ))}
          <ul className="kdo-sources">
            {item.zdroje.map((s) => (
              <li key={s.url}>
                <a href={s.url} target="_blank" rel="noopener noreferrer">
                  {s.title}
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
