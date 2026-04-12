import type { z } from "zod";
import { resourceSchema } from "./book.schema";

export type Resource = z.infer<typeof resourceSchema>

export interface Edition {
  publisher?: string;
  note?: string;
  label: string;
}

export interface Book {
  _id: string;
  title: string;
  titleArabic?: string;
  author: string;
  type?: string;
  level?: string;
  field?: string;
  description?: string;
  recommendedUsage?: string;
  resources?: Resource[];
  recommendedEditions?: Edition[];
  createdAt?: string;
}