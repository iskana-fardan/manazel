import apiClient from '../../lib/api-client';
import type { ApiResponse, Book, Roadmap } from '../../types/api';

export const getAllRoadmaps = async (): Promise<Roadmap[]> => {
  const { data } = await apiClient.get<ApiResponse<Roadmap[]>>('/roadmaps');
  return data.data;
};

export const getRoadmap = async (fieldSlug: string): Promise<Roadmap> => {
  const { data } = await apiClient.get<ApiResponse<Roadmap>>(
    `/roadmaps/${fieldSlug}`,
  );
  return data.data;
};

export const createRoadmap = async (fieldSlug: string): Promise<Roadmap> => {
  const { data } = await apiClient.post<ApiResponse<Roadmap>>(
    `/roadmaps/${fieldSlug}`,
  );
  return data.data;
};

export const addBookToSection = async (
  fieldSlug: string,
  section: 'dars' | 'muthalaah',
  levelSlug: string,
  bookId: string,
): Promise<Roadmap> => {
  const { data } = await apiClient.post<ApiResponse<Roadmap>>(
    `/roadmaps/${fieldSlug}/${section}/${levelSlug}/books`,
    { bookId },
  );
  return data.data;
};

export const removeBookFromSection = async (
  fieldSlug: string,
  section: 'dars' | 'muthalaah',
  levelSlug: string,
  bookId: string,
): Promise<Roadmap> => {
  const { data } = await apiClient.delete<ApiResponse<Roadmap>>(
    `/roadmaps/${fieldSlug}/${section}/${levelSlug}/books/${bookId}`,
  );
  return data.data;
};

// ── Pure utilities used by the public roadmap page ────────────────────────────

export function getBooksForLevel(
  roadmap: Roadmap,
  levelSlug: string,
  booksMap: Map<string, Book>,
): Book[] {
  const level = roadmap.levels.find((l) => l.slug === levelSlug);
  if (!level) return [];
  return level.books.map((id) => booksMap.get(id)).filter(Boolean) as Book[];
}

export function getBooksForMuthalaah(
  roadmap: Roadmap,
  booksMap: Map<string, Book>,
): Book[] {
  return roadmap.muthalaah.flatMap((section) =>
    section.books.map((id) => booksMap.get(id)).filter(Boolean),
  ) as Book[];
}
