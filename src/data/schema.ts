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

export const scandalSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  actors: z.array(actorSchema).min(1),
  shortDesc: z.string().min(1),
  longDesc: z.string().min(1),
  cost: z.string().min(1),
  index: z.number().int().min(1),
  sources: z.array(scandalSourceSchema).min(1),
});

export const scandalsSchema = z
  .array(scandalSchema)
  .min(1)
  .superRefine((items, ctx) => {
    const ids = new Set<string>();
    const indexes = new Set<number>();
    for (const item of items) {
      if (ids.has(item.id)) {
        ctx.addIssue({ code: 'custom', message: `duplicitní id: ${item.id}` });
      }
      ids.add(item.id);
      if (indexes.has(item.index)) {
        ctx.addIssue({ code: 'custom', message: `duplicitní index: ${item.index}` });
      }
      indexes.add(item.index);
    }
    for (let i = 1; i <= items.length; i++) {
      if (!indexes.has(i)) {
        ctx.addIssue({ code: 'custom', message: `chybí index ${i}` });
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
