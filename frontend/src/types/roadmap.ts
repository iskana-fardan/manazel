import type { IconKey } from "../assets/icons/icon";

export interface Roadmap {
  id: string;          // harus sama dengan field id
  field: string;       // optional nanti bisa dipersempit
  title: string;
  titleArabic: string;
  description: string;
  icon: IconKey;
  levels: Level[];
  muthalaah: Muthalaah[];
}

export interface Level {
  id: string;
  label: string;
  order: number;
  dars: Dars[];
}

export interface Dars {
  id: string;
  bookId: string;
  affectsProgress: boolean;
}

export interface Muthalaah {
  id: string;
  bookId: string;
  label: string;
}
