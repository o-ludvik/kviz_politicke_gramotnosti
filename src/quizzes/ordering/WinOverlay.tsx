import { useEffect, useRef, type KeyboardEvent } from 'react';
import { t } from '../../copy';
import { CoinRain } from './CoinRain';

type Props = {
  itemCount: number;
  attempts: number;
  celebrate: boolean;
  onReveal: () => void;
  onBack: () => void;
};

/** Modální dialog výhry (GDD kap. 6.6). */
export function WinOverlay({ itemCount, attempts, celebrate, onReveal, onBack }: Props) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = overflow;
    };
  }, []);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onReveal();
      return;
    }
    if (e.key !== 'Tab') return;
    const focusable = dialogRef.current?.querySelectorAll<HTMLElement>('button');
    if (!focusable?.length) return;
    const first = focusable[0]!;
    const last = focusable[focusable.length - 1]!;
    const active = document.activeElement;
    if (e.shiftKey && (active === first || active === headingRef.current)) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && active === last) {
      e.preventDefault();
      first.focus();
    }
  };

  return (
    <div className="overlay">
      <div
        ref={dialogRef}
        className="overlay__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="win-title"
        aria-describedby="win-body"
        onKeyDown={onKeyDown}
      >
        <h2 id="win-title" ref={headingRef} tabIndex={-1}>
          {t('win.title')}
        </h2>
        <div id="win-body">
          <p>{t('win.body', { n: itemCount })}</p>
          <p className="overlay__attempts">{t('check.attempts', { a: attempts })}</p>
        </div>
        <div className="overlay__actions">
          <button type="button" className="btn btn--primary" onClick={onReveal}>
            {t('win.primary')}
          </button>
          <button type="button" className="btn btn--secondary" onClick={onBack}>
            {t('win.secondary')}
          </button>
        </div>
      </div>
      {celebrate && <CoinRain />}
    </div>
  );
}
