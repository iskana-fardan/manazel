import { z } from "zod";

export const resourceType =  z.enum(["pdf", "audio", "video"])

export const resourceSchema = z.object({
  label: z.string().min(1, "Resource name is required"),
  type: resourceType,
  url: z.url("Invalid URL"),
});


export const editionSchema = z.object({
  label: z.string().min(1, "Edition label is required"),
  publisher: z.string().min(1, "Publisher name is required"),
  note: z.string().optional(),
});


export const levelEnum = z.enum([
    "beginner",
    "intermediate",
    "advanced",
]);

export const typeEnum = z.enum([
  "dars",
  "muthalaah",
]);

export const bookSchema = z.object({
  title: z.string().min(3, "Title is required"),

  titleArabic: z.string().optional(),

  author: z.string().min(3, "Author is required"),

  type: z.string().min(3, "Type is required"),

  level: z.string().min(3, "Author is required"),

  field: z.string().min(1, "Field is required"),

  description: z.string().optional(),

  recommendedUsage: z.string().optional(),

  resources: z.array(resourceSchema).optional(),

  recommendedEditions: z.array(editionSchema).optional(),
});


export type BookFormValues = z.infer<typeof bookSchema>;