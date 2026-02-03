import type { IconKey } from "../../assets/icons/icon";
import rawFields from "./fields.json";

interface Field {
    id: string;
    slug: string;
    name: string;
    nameArabic: string;
    description: string;
    icon: IconKey;
    order: number;
}



export const fields = rawFields as Field[]

export const getFieldBySlug = (slug?:string) => fields.find(f => f.slug === slug)


// as Field = type assertion (paksaan ke TypeScript)
// Artinya lo bilang ke TS:
// “Gue yakin data ini bentuknya sesuai interface Field. Percaya aja.”