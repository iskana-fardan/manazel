export type LevelSection = {
  _id?: string;
  slug: string;
  label: string;
  order: number;
  books: string[];
};

export type Roadmap = {
  _id: string;
  field: string;
  title: string;
  titleArabic?: string;
  description?: string;
  icon?: string;
  levels: LevelSection[];
  muthalaah: LevelSection[];
};
