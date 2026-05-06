import { z } from 'zod';

export const resourceSchema = z.object({
  label: z.string().min(1, 'Label is required'),
  type: z.enum(['pdf', 'audio', 'video']),
  url: z.url('Invalid URL'),
});

export const editionSchema = z.object({
  label: z.string().min(1, 'Edition label is required'),
  publisher: z.string().optional(),
  note: z.string().optional(),
});

export const bookSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  titleArabic: z.string().optional(),
  author: z.string().min(1, 'Author is required'),
  type: z.enum(['dars', 'muthalaah'], { message: 'Type is required' }),
  level: z.enum(['beginner', 'intermediate', 'advanced'], {
    message: 'Level is required',
  }),
  field: z.string().min(1, 'Field is required'),
  description: z.string().optional(),
  recommendedUsage: z.string().optional(),
  resources: z.array(resourceSchema).optional(),
  recommendedEditions: z.array(editionSchema).optional(),
});

export type BookFormValues = z.infer<typeof bookSchema>;
