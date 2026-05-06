import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createBook, deleteBook, getBooks, updateBook } from './books.api';
import { booksKeys } from './books.keys';
import type { BookFormValues } from './books.schema';
import { extractErrorMessage } from '../../lib/extract-error-message';
import { useNotification } from '../../shared/notification/use-notification';

export const useBooks = () =>
  useQuery({
    queryKey: booksKeys.list(),
    queryFn: getBooks,
  });

export const useCreateBook = () => {
  const queryClient = useQueryClient();
  const { notify } = useNotification();

  return useMutation({
    mutationFn: createBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: booksKeys.all });
      notify('Book created', 'success');
    },
    onError: (error) => notify(extractErrorMessage(error), 'error'),
  });
};

export const useUpdateBook = () => {
  const queryClient = useQueryClient();
  const { notify } = useNotification();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: BookFormValues }) =>
      updateBook(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: booksKeys.all });
      notify('Book updated', 'success');
    },
    onError: (error) => notify(extractErrorMessage(error), 'error'),
  });
};

export const useDeleteBook = () => {
  const queryClient = useQueryClient();
  const { notify } = useNotification();

  return useMutation({
    mutationFn: deleteBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: booksKeys.all });
      notify('Book deleted', 'success');
    },
    onError: (error) => notify(extractErrorMessage(error), 'error'),
  });
};
