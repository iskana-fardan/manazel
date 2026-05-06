import apiClient from '../../lib/api-client';
import type { ApiResponse, Book } from '../../types/api';
import type { BookFormValues } from './books.schema';

export const getBooks = async (): Promise<Book[]> => {
  const { data } = await apiClient.get<ApiResponse<Book[]>>('/books');
  return data.data;
};

export const createBook = async (payload: BookFormValues): Promise<Book> => {
  const { data } = await apiClient.post<ApiResponse<Book>>('/books', payload);
  return data.data;
};

export const updateBook = async (
  id: string,
  payload: BookFormValues,
): Promise<Book> => {
  const { data } = await apiClient.put<ApiResponse<Book>>(
    `/books/${id}`,
    payload,
  );
  return data.data;
};

export const deleteBook = async (id: string): Promise<void> => {
  await apiClient.delete(`/books/${id}`);
};
