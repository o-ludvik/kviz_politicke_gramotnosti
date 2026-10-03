import { Fragment, type MouseEvent } from 'react';
import { t } from '../../copy';

export function prefersReducedMotion(): boolean {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}

export function sourceAnchorId(n: number): string {
  return `zdroj-${n}`;
}

/**
 * Skok na položku v sekci zdrojů. Hash se nemění, protože hash patří routeru.
 */
export function jumpToSource(n: number): void {
  const target = document.getElementById(sourceAnchorId(n));
  if (!target) return;
  target.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'center' });
  target.focus({ preventScroll: true });
  target.classList.remove('is-highlighted');
  void target.offsetWidth; // restart animace při opakovaném kliknutí
  target.classList.add('is-highlighted');
  window.setTimeout(() => target.classList.remove('is-highlighted'), 2000);
}

export function SourceRef({ n }: { n: number }) {
  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    jumpToSource(n);
  };
  return (
    <a className="source-ref" href={`#${sourceAnchorId(n)}`} onClick={onClick} aria-label={t('source.ref.aria', { n })}>
      [{n}]
    </a>
  );
}

/** Prostý text, ve kterém se jen značky [n] mění na odkazy na zdroje. */
export function RichText({ text }: { text: string }) {
  const parts = text.split(/(\[\d+\])/);
  return (
    <>
      {parts.map((part, i) => {
        const m = part.match(/^\[(\d+)\]$/);
        return m ? <SourceRef key={i} n={Number(m[1])} /> : <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}
