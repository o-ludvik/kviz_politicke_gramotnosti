// Čisté funkce herní logiky kvízu typu „řazení“.

/** `index` je 1-based seznam povolených pozic (jedna nebo víc při remíze). */
export type RankedItem = { id: string; index: readonly number[] };

export function primaryIndex(item: RankedItem): number {
  return Math.min(...item.index);
}

export type Rng = () => number;

/** Seedovatelný generátor (mulberry32) pro testy a reprodukovatelné míchání. */
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

export function arrayMove<T>(arr: readonly T[], from: number, to: number): T[] {
  const next = [...arr];
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved as T);
  return next;
}

/** Indexy slotů, ve kterých leží volné (nezamčené) karty. */
export function freeSlotsOf(order: readonly string[], locked: ReadonlySet<string>): number[] {
  return order.map((_, i) => i).filter((i) => !locked.has(order[i] as string));
}

/**
 * Nejbližší volný slot k `target`. Když je `target` sám volný, vrátí ho.
 * Jinak hledá dál ve směru pohybu; když tam nic není, na opačné straně.
 */
export function nearestFreeSlot(
  freeSlots: readonly number[],
  target: number,
  direction: 'towardTop' | 'towardBottom',
): number | undefined {
  if (freeSlots.includes(target)) return target;
  const below = freeSlots.filter((s) => s > target);
  const above = freeSlots.filter((s) => s < target);
  const nearestBelow = below.length ? Math.min(...below) : undefined;
  const nearestAbove = above.length ? Math.max(...above) : undefined;
  return direction === 'towardBottom'
    ? (nearestBelow ?? nearestAbove)
    : (nearestAbove ?? nearestBelow);
}

/**
 * Přesune kartu ze slotu `fromSlot` směrem ke slotu `toSlot` jen po volných
 * slotech. Zamčené karty zůstanou vždy na místě.
 */
export function moveAmongFree(
  order: readonly string[],
  locked: ReadonlySet<string>,
  fromSlot: number,
  toSlot: number,
): string[] {
  const freeSlots = freeSlotsOf(order, locked);
  const from = freeSlots.indexOf(fromSlot);
  if (from < 0 || toSlot < 0 || toSlot >= order.length || fromSlot === toSlot) return [...order];
  const direction = toSlot > fromSlot ? 'towardBottom' : 'towardTop';
  const targetSlot = nearestFreeSlot(freeSlots, toSlot, direction);
  if (targetSlot === undefined) return [...order];
  const to = freeSlots.indexOf(targetSlot);
  const moved = arrayMove(
    freeSlots.map((i) => order[i] as string),
    from,
    to,
  );
  const next = [...order];
  freeSlots.forEach((slot, k) => {
    next[slot] = moved[k] as string;
  });
  return next;
}

/** Slot nejbližší volné karty nad (`-1`) nebo pod (`+1`) daným slotem. */
export function neighbourFreeSlot(
  order: readonly string[],
  locked: ReadonlySet<string>,
  slot: number,
  step: -1 | 1,
): number | undefined {
  for (let i = slot + step; i >= 0 && i < order.length; i += step) {
    if (!locked.has(order[i] as string)) return i;
  }
  return undefined;
}

/** Posun tlačítky ▲ ▼: prohození s nejbližší volnou kartou v daném směru. */
export function stepAmongFree(
  order: readonly string[],
  locked: ReadonlySet<string>,
  slot: number,
  step: -1 | 1,
): string[] {
  const target = neighbourFreeSlot(order, locked, slot, step);
  if (target === undefined || locked.has(order[slot] as string)) return [...order];
  return moveAmongFree(order, locked, slot, target);
}

/** Karta je správně, když leží v některé z povolených pozic (`index` je 1-based). */
export function isCorrectAt(item: RankedItem, slot: number): boolean {
  return item.index.includes(slot + 1);
}

export function countCorrect(order: readonly string[], items: readonly RankedItem[]): number {
  const byId = new Map(items.map((i) => [i.id, i]));
  return order.filter((id, slot) => {
    const item = byId.get(id);
    return item !== undefined && isCorrectAt(item, slot);
  }).length;
}

export function check(
  order: readonly string[],
  locked: ReadonlySet<string>,
  items: readonly RankedItem[],
): { newlyLocked: string[]; allCorrect: boolean } {
  const byId = new Map(items.map((i) => [i.id, i]));
  const newlyLocked: string[] = [];
  let correct = 0;
  order.forEach((id, slot) => {
    const item = byId.get(id);
    if (!item || !isCorrectAt(item, slot)) return;
    correct++;
    if (!locked.has(id)) newlyLocked.push(id);
  });
  return { newlyLocked, allCorrect: correct === order.length };
}

/**
 * Zamíchá karty tak, aby nebylo vyřešeno a na správném místě byla nejvýš
 * jedna karta.
 */
export function shuffle(items: readonly RankedItem[], rng: Rng): string[] {
  const ids = items.map((i) => i.id);
  for (let attempt = 0; attempt < 1000; attempt++) {
    const next = [...ids];
    for (let i = next.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [next[i], next[j]] = [next[j] as string, next[i] as string];
    }
    if (countCorrect(next, items) <= 1) return next;
  }
  // Pojistka: obrácené řešení (pro běžná data nikdy nenastane).
  return [...items].sort((a, b) => primaryIndex(b) - primaryIndex(a)).map((i) => i.id);
}

/** Jedno platné pořadí (u remíz bere nejnižší volnou povolenou pozici). */
export function oneSolution(items: readonly RankedItem[]): string[] {
  const sorted = [...items].sort(
    (a, b) => primaryIndex(a) - primaryIndex(b) || a.id.localeCompare(b.id),
  );
  const result: string[] = new Array(items.length);
  const used = new Set<number>();
  for (const item of sorted) {
    const slot = item.index.map((p) => p - 1).find((s) => !used.has(s));
    if (slot === undefined) throw new Error(`no free slot for ${item.id}`);
    used.add(slot);
    result[slot] = item.id;
  }
  return result;
}

export function sameOrder(a: readonly string[] | null, b: readonly string[]): boolean {
  return a !== null && a.length === b.length && a.every((id, i) => id === b[i]);
}
