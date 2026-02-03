/**
 * Resource types (terbatas, biar gak string liar)
 */
export type ResourceType = "audio" | "pdf" | "video" | "link";

/**
 * Book usage context
 */
export type BookType = "dars" | "muthalaah";

/**
 * Edition label
 */
export type EditionLabel = "recommended" | "alternative";

/**
 * Resource (audio, pdf, dll)
 */
export interface BookResource {
  label: string;
  type: ResourceType;
  url: string;
}

/**
 * Recommended edition
 */
export interface RecommendedEdition {
  publisher: string;
  note: string;
  label: EditionLabel;
}

/**
 * Main book entity
 */
export interface Book {
  id: string;
  title: string;
  titleArabic: string;
  author: string;
  type: BookType;
  level: string;
  field: string; // bisa dipersempit ke FieldId nanti
  description: string;
  recommendedUsage: string;
  resources: BookResource[];
  recommendedEditions: RecommendedEdition[];
}
