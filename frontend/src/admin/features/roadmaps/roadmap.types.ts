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
  levels: LevelSection[];
  muthalaah: LevelSection[];
};
