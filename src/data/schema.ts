import { z } from 'zod';

export const personSchema = z.object({
  name: z.string().min(1),
  // Prázdná role je povolená: u Frakce ID je v podkladech řádek bez role.
  role: z.string(),
});

export const amountSchema = z.object({
  display: z.string().min(1),
  typeLabel: z.string().min(1),
  explanation: z.string().min(1),
  sortValueCzk: z.number(),
});

export const orderingItemSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  period: z.string().min(1),
  oneLiner: z.string().min(1),
  people: z.array(personSchema).min(1),
  rank: z.number().int().min(1),
  amount: amountSchema,
  detail: z.array(z.string().min(1)).min(1),
  legalStatus: z.string().min(1),
  sourceIds: z.array(z.number().int()).min(1),
});

export const sourceSchema = z.object({
  id: z.number().int().min(1),
  title: z.string().min(1),
  publisher: z.string().min(1),
  url: z.string().startsWith('https://'),
  date: z.string().optional(),
});

export const sourceGroupSchema = z.object({
  title: z.string().min(1),
  itemId: z.string().optional(),
  sourceIds: z.array(z.number().int()),
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
  items: z.array(orderingItemSchema),
  sourceGroups: z.array(sourceGroupSchema),
  sources: z.array(sourceSchema),
});

export type Person = z.infer<typeof personSchema>;
export type Amount = z.infer<typeof amountSchema>;
export type OrderingItem = z.infer<typeof orderingItemSchema>;
export type Source = z.infer<typeof sourceSchema>;
export type SourceGroup = z.infer<typeof sourceGroupSchema>;
export type OrderingQuiz = z.infer<typeof orderingQuizSchema>;

/** Značky [n] v textu. */
export const SOURCE_REF = /\[(\d+)\]/g;

export function refsIn(text: string): number[] {
  return [...text.matchAll(SOURCE_REF)].map((m) => Number(m[1]));
}
