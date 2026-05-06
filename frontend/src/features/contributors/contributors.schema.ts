import { z } from 'zod';

export const contributorSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  role: z.string().min(1, 'Role is required'),
  description: z.string().optional(),
  avatar: z.string().optional(),
  socials: z.object({
    github: z.string().optional(),
    instagram: z.string().optional(),
    website: z.string().optional(),
  }),
});

export type ContributorFormValues = z.infer<typeof contributorSchema>;
