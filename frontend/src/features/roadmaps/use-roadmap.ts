import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  addBookToSection,
  createRoadmap,
  getRoadmap,
  removeBookFromSection,
} from './roadmaps.api';
import { roadmapsKeys } from './roadmaps.keys';
import { extractErrorMessage } from '../../lib/extract-error-message';
import { useNotification } from '../../shared/notification/use-notification';

export const useRoadmap = (fieldSlug: string) =>
  useQuery({
    queryKey: roadmapsKeys.detail(fieldSlug),
    queryFn: () => getRoadmap(fieldSlug),
    enabled: !!fieldSlug,
    retry: false,
  });

export const useCreateRoadmap = (fieldSlug: string) => {
  const queryClient = useQueryClient();
  const { notify } = useNotification();

  return useMutation({
    mutationFn: () => createRoadmap(fieldSlug),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: roadmapsKeys.detail(fieldSlug),
      });
      notify('Roadmap created', 'success');
    },
    onError: (error) => notify(extractErrorMessage(error), 'error'),
  });
};

export const useAddBookToSection = (fieldSlug: string) => {
  const queryClient = useQueryClient();
  const { notify } = useNotification();

  return useMutation({
    mutationFn: ({
      section,
      levelSlug,
      bookId,
    }: {
      section: 'dars' | 'muthalaah';
      levelSlug: string;
      bookId: string;
    }) => addBookToSection(fieldSlug, section, levelSlug, bookId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: roadmapsKeys.detail(fieldSlug),
      });
    },
    onError: (error) => notify(extractErrorMessage(error), 'error'),
  });
};

export const useRemoveBookFromSection = (fieldSlug: string) => {
  const queryClient = useQueryClient();
  const { notify } = useNotification();

  return useMutation({
    mutationFn: ({
      section,
      levelSlug,
      bookId,
    }: {
      section: 'dars' | 'muthalaah';
      levelSlug: string;
      bookId: string;
    }) => removeBookFromSection(fieldSlug, section, levelSlug, bookId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: roadmapsKeys.detail(fieldSlug),
      });
    },
    onError: (error) => notify(extractErrorMessage(error), 'error'),
  });
};
