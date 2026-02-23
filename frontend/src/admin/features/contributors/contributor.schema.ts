import { z } from "zod";

export const contributorSchema = z.object({
  name: z.string().min(1, "Name is required"),
  role: z.string().min(1, "Role is required"),
  description: z.string().optional(),
  avatar: z.string("Avatar must be a valid URL").optional(),
  socials: z.object({
    github: z.string("Invalid GitHub URL").optional(),
    instagram: z.string("Invalid Instagram URL").optional(),
    website: z.string("Invalid Website URL").optional(),
  }),
});

export type ContributorFormValues = z.infer<typeof contributorSchema>;