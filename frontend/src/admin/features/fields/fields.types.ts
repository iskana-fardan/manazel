// ini types dari backend a.k.a sesuai backend
// sedangkan fields.types itu buat validasi dari frontend
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

