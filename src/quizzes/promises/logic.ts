/** Čisté funkce herní logiky kvízu typu „sliby“. */

export type Rng = () => number;

/** Seedovatelný generátor (mulberry32) pro testy. */
export function seededRng(seed: number): Rng {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Fisher–Yates nad id položek. */
export function shuffleIds(ids: readonly string[], rng: Rng): string[] {
  const next = [...ids];
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [next[i], next[j]] = [next[j] as string, next[i] as string];
  }
  return next;
}

export type Score = { correct: number; wrong: number; total: number };

/** Spočítá skóre z tipů vůči skutečnému plnění. */
export function scoreOf(
  answers: Readonly<Record<string, boolean>>,
  fulfilledById: ReadonlyMap<string, boolean>,
): Score {
  let correct = 0;
  let wrong = 0;
  for (const [id, tip] of Object.entries(answers)) {
    const actual = fulfilledById.get(id);
    if (actual === undefined) continue;
    if (tip === actual) correct++;
    else wrong++;
  }
  return { correct, wrong, total: correct + wrong };
}
