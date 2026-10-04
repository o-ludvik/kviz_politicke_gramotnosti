import { z } from 'zod';

export const actorSchema = z.object({
  name: z.string().min(1),
  role: z.string().optional(),
});

export const scandalSourceSchema = z.object({
  title: z.string().min(1),
  publisher: z.string().min(1),
  url: z.string().startsWith('https://'),
  date: z.string().optional(),
});

/** Jedna pozice nebo více povolených (remíza: např. [4, 5]). Vždy se normalizuje na pole. */
export const indexSchema = z
  .union([z.number().int().min(1), z.array(z.number().int().min(1)).min(1)])
  .transform((v): number[] => {
    const arr = Array.isArray(v) ? v : [v];
    return [...new Set(arr)].sort((a, b) => a - b);
  });

export const scandalSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  actors: z.array(actorSchema).min(1),
  shortDesc: z.string().min(1),
  longDesc: z.string().min(1),
  cost: z.string().min(1),
  index: indexSchema,
  sources: z.array(scandalSourceSchema).min(1),
});

function indexKey(index: readonly number[]): string {
  return index.join(',');
}

export const scandalsSchema = z
  .array(scandalSchema)
  .min(1)
  .superRefine((items, ctx) => {
    const ids = new Set<string>();
    for (const item of items) {
      if (ids.has(item.id)) {
        ctx.addIssue({ code: 'custom', message: `duplicitní id: ${item.id}` });
      }
      ids.add(item.id);
      for (const p of item.index) {
        if (p > items.length) {
          ctx.addIssue({
            code: 'custom',
            message: `${item.id}: index ${p} mimo 1..${items.length}`,
          });
        }
      }
    }

    // Remízové skupiny: stejná sada pozic, velikost skupiny = počet pozic; pozice pokrývají 1..N.
    const groups = new Map<string, { positions: number[]; count: number }>();
    for (const item of items) {
      const key = indexKey(item.index);
      const g = groups.get(key);
      if (g) g.count++;
      else groups.set(key, { positions: [...item.index], count: 1 });
    }

    const covered = new Set<number>();
    for (const [key, g] of groups) {
      if (g.count !== g.positions.length) {
        ctx.addIssue({
          code: 'custom',
          message: `index [${key}]: ${g.count} kauz vs ${g.positions.length} pozic (musí sedět)`,
        });
      }
      for (const p of g.positions) {
        if (covered.has(p)) {
          ctx.addIssue({ code: 'custom', message: `pozice ${p} je ve více neslučitelných skupinách` });
        }
        covered.add(p);
      }
    }
    for (let i = 1; i <= items.length; i++) {
      if (!covered.has(i)) {
        ctx.addIssue({ code: 'custom', message: `chybí pokrytí pozice ${i}` });
      }
    }
  });

export const orderingQuizSchema = z.object({
  id: z.string().min(1),
  type: z.literal('ordering'),
  title: z.string().min(1),
  shortDescription: z.string().min(1),
  estimatedMinutes: z.number().positive(),
  dataAsOf: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  axis: z.object({ top: z.string().min(1), bottom: z.string().min(1) }),
  revealAmounts: z.enum(['onComplete', 'onLock']),
  items: scandalsSchema,
  contextSources: z.array(scandalSourceSchema).default([]),
});

export type Actor = z.infer<typeof actorSchema>;
export type ScandalSource = z.infer<typeof scandalSourceSchema>;
export type Scandal = z.infer<typeof scandalSchema>;
/** Alias pro herní engine — položka řazení. */
export type OrderingItem = Scandal;
export type OrderingQuiz = z.infer<typeof orderingQuizSchema>;
