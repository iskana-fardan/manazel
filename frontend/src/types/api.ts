// Single source of truth for all API shapes and domain types.
// All feature-level type files re-export from here.

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string | null;
  meta?: { count: number; [key: string]: unknown };
}

// ── Fields ────────────────────────────────────────────────────────────────────

export interface Field {
  _id: string;
  name: string;
  nameArabic?: string;
  slug: string;
  description?: string;
  icon?: string;
  order?: number;
  createdAt?: string;
}

// ── Books ─────────────────────────────────────────────────────────────────────

export type ResourceType = 'pdf' | 'audio' | 'video';
export type BookType = 'dars' | 'muthalaah';
export type BookLevel = 'beginner' | 'intermediate' | 'advanced';

export interface Resource {
  label: string;
  type: ResourceType;
  url: string;
}

export interface Edition {
  label: string;
  publisher?: string;
  note?: string;
}

export interface Book {
  _id: string;
  title: string;
  titleArabic?: string;
  author: string;
  type?: BookType;
  level?: BookLevel;
  field?: string;
  description?: string;
  recommendedUsage?: string;
  resources?: Resource[];
  recommendedEditions?: Edition[];
  createdAt?: string;
}

// ── Contributors ──────────────────────────────────────────────────────────────

export interface Contributor {
  _id: string;
  name: string;
  role: string;
  description?: string;
  avatar?: string;
  socials: {
    github?: string;
    instagram?: string;
    website?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

// ── Roadmaps ──────────────────────────────────────────────────────────────────

export interface LevelSection {
  _id?: string;
  slug: string;
  label: string;
  order: number;
  books: string[];
}

export interface Roadmap {
  _id: string;
  field: string;
  title: string;
  titleArabic?: string;
  description?: string;
  icon?: string;
  levels: LevelSection[];
  muthalaah: LevelSection[];
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export interface Admin {
  _id: string;
  email: string;
}
