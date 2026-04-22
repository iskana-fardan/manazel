import type { Roadmap } from "../admin/features/roadmaps/roadmap.types";
import api from "./apiClient";

export const getAllRoadmaps = async (): Promise<Roadmap[]> => {
  const { data } = await api.get("/roadmaps");
  return data;
};

export const getRoadmap = async (fieldSlug: string): Promise<Roadmap> => {
  const { data } = await api.get(`/roadmaps/${fieldSlug}`);
  return data;
};

export const createRoadmap = async (fieldSlug: string): Promise<Roadmap> => {
  const { data } = await api.post(`/roadmaps/${fieldSlug}`);
  return data;
};

export const addBookToSection = async (
  fieldSlug: string,
  section: "dars" | "muthalaah",
  levelSlug: string,
  bookId: string
): Promise<Roadmap> => {
  const { data } = await api.post(
    `/roadmaps/${fieldSlug}/${section}/${levelSlug}/books`,
    { bookId }
  );
  return data;
};

export const removeBookFromSection = async (
  fieldSlug: string,
  section: "dars" | "muthalaah",
  levelSlug: string,
  bookId: string
): Promise<Roadmap> => {
  const { data } = await api.delete(
    `/roadmaps/${fieldSlug}/${section}/${levelSlug}/books/${bookId}`
  );
  return data;
};
