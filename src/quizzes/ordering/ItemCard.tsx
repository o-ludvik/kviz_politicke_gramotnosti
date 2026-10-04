import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState, type CSSProperties } from 'react';
import { t } from '../../copy';
import type { OrderingItem } from '../../data/schema';

type Props = {
  item: OrderingItem;
  slot: number;
  locked: boolean;
  /** Karta právě zamčená poslední kontrolou (animace „cvaknutí“). */
  justLocked: boolean;
  showAmount: boolean;
  /** Pořadí karty pro postupné orazítkování; `null` = bez animace. */
  stampDelayIndex: number | null;
  expandable: boolean;
  expanded: boolean;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onToggle: (id: string) => void;
  onStep: (id: string, step: -1 | 1) => void;
};

export function ItemCard({
  item,
  slot,
  locked,
  justLocked,
  showAmount,
  stampDelayIndex,
  expandable,
  expanded,
  canMoveUp,
  canMoveDown,
  onToggle,
  onStep,
}: Props) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } =
    useSortable({
      id: item.id,
      // Zamčená karta zůstává cílem (aby šlo pustit kartu „nad ní“), ale nejde chytit.
      disabled: { draggable: locked, droppable: false },
      attributes: { roleDescription: 'přesouvatelná karta' },
    });

  const [peopleOpen, setPeopleOpen] = useState(false);
  const titleId = `card-title-${item.id}`;
  const peopleId = `card-people-${item.id}`;
  const panelId = `card-panel-${item.id}`;
  const position = slot + 1;

  const style: CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  const className = [
    'card',
    locked && 'card--locked',
    justLocked && 'card--just-locked',
    isDragging && 'card--dragging',
    expandable && 'card--expandable',
    expanded && 'card--expanded',
  ]
    .filter(Boolean)
    .join(' ');

  const srPosition = <span className="sr-only">{t('card.slot.aria', { pozice: position, název: '' })}</span>;

  return (
    <article
      ref={setNodeRef}
      style={style}
      className={className}
      aria-labelledby={titleId}
      // aria-disabled se dědí na potomky, proto ho odhalená karta s roletou nemá.
      aria-disabled={(locked && !expandable) || undefined}
      data-card-id={item.id}
    >
      <div className="card__top">
        <div className="card__lead-col">
          {locked ? (
            <span className="card__check" aria-hidden="true">
              <CheckIcon />
            </span>
          ) : (
            <button
              type="button"
              className="card__handle"
              ref={setActivatorNodeRef}
              {...attributes}
              {...listeners}
              aria-label={t('card.handle.aria', { název: item.name })}
            >
              <GripIcon />
            </button>
          )}
        </div>

        <div className="card__main">
          <h3 className="card__title" id={titleId}>
            {expandable ? (
              <button
                type="button"
                className="card__toggle"
                aria-expanded={expanded}
                aria-controls={panelId}
                onClick={() => onToggle(item.id)}
              >
                {srPosition}
                <span>{item.name}</span>
                <ChevronIcon />
              </button>
            ) : (
              <>
                {srPosition}
                {item.name}
              </>
            )}
          </h3>

          {locked && <p className="card__status">{t('card.locked')}</p>}

          <div className="card__body">
            <p className="card__oneliner">{item.shortDesc}</p>

            <div className="card__people">
              <span className="card__people-label">{t('card.people')}:</span>{' '}
              <span className="card__names">{item.actors.map((p) => p.name).join(', ')}</span>{' '}
              <button
                type="button"
                className="card__people-toggle"
                aria-expanded={peopleOpen}
                aria-controls={peopleId}
                onClick={() => setPeopleOpen((o) => !o)}
              >
                {t('card.people.toggle')}
              </button>
              <ul id={peopleId} className="card__roles" hidden={!peopleOpen}>
                {item.actors.map((p) => (
                  <li key={p.name}>
                    {p.name}
                    {p.role && <span className="card__role"> – {p.role}</span>}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {showAmount && (
          <div className="card__amount">
            <div
              className={stampDelayIndex === null ? 'stamp' : 'stamp stamp--animate'}
              style={stampDelayIndex === null ? undefined : ({ '--i': stampDelayIndex } as CSSProperties)}
            >
              {item.cost}
            </div>
          </div>
        )}

        {!locked && (
          <div className="card__moves">
            <button
              type="button"
              className="move-btn"
              aria-label={t('card.up.aria', { název: item.name })}
              aria-disabled={!canMoveUp || undefined}
              data-move="up"
              onClick={() => canMoveUp && onStep(item.id, -1)}
            >
              <ArrowIcon dir="up" />
            </button>
            <button
              type="button"
              className="move-btn"
              aria-label={t('card.down.aria', { název: item.name })}
              aria-disabled={!canMoveDown || undefined}
              data-move="down"
              onClick={() => canMoveDown && onStep(item.id, 1)}
            >
              <ArrowIcon dir="down" />
            </button>
          </div>
        )}
      </div>

      {expandable && (
        <div className="card__panel" id={panelId} hidden={!expanded}>
          {expanded &&
            item.longDesc.split(/\n\n+/).map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          {expanded && item.sources.length > 0 && (
            <>
              <h4>{t('detail.sources')}</h4>
              <ul className="card__source-list">
                {item.sources.map((s) => (
                  <li key={s.url}>
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
            </>
          )}
        </div>
      )}
    </article>
  );
}

function GripIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
      {[5, 10, 15].flatMap((y) =>
        [7, 13].map((x) => <circle key={`${x}-${y}`} cx={x} cy={y} r="1.6" fill="currentColor" />),
      )}
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="11" fill="currentColor" />
      <path d="M7 12.5l3.2 3.2L17 9" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowIcon({ dir }: { dir: 'up' | 'down' }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <path d={dir === 'up' ? 'M8 4l6 7H2z' : 'M8 12L2 5h12z'} fill="currentColor" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg className="card__chevron" width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" focusable="false">
      <path d="M4 7l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
