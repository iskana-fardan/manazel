import { z } from 'zod';

export const fieldSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  nameArabic: z.string().optional(),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().optional(),
  icon: z.string().optional(),
  order: z.number().min(0, 'Order must be non-negative'),
});

export type FieldFormValues = z.infer<typeof fieldSchema>;
