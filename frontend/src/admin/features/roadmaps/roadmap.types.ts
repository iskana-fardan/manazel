export type Roadmap = {
  _id: string;
  field: string;
  title: string;
  levels: {
    slug: string;
    label: string;
    order: number;
    books: string[];
  }[];
  muthalaah: string[];
};