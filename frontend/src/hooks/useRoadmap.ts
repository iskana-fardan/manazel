import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addBookToSection,
  createRoadmap,
  getRoadmap,
  removeBookFromSection,
} from "../services/roadmaps.api";

export const useRoadmap = (fieldSlug: string) =>
  useQuery({
    queryKey: ["roadmap", fieldSlug],
    queryFn: () => getRoadmap(fieldSlug),
    enabled: !!fieldSlug,
    retry: false,
  });

export const useCreateRoadmap = (fieldSlug: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => createRoadmap(fieldSlug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roadmap", fieldSlug] });
    },
  });
};

export const useAddBookToSection = (fieldSlug: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      section,
      levelSlug,
      bookId,
    }: {
      section: "dars" | "muthalaah";
      levelSlug: string;
      bookId: string;
    }) => addBookToSection(fieldSlug, section, levelSlug, bookId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roadmap", fieldSlug] });
    },
  });
};

export const useRemoveBookFromSection = (fieldSlug: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      section,
      levelSlug,
      bookId,
    }: {
      section: "dars" | "muthalaah";
      levelSlug: string;
      bookId: string;
    }) => removeBookFromSection(fieldSlug, section, levelSlug, bookId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roadmap", fieldSlug] });
    },
  });
};
