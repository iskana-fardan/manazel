import apiClient from '../../lib/api-client';
import type { ApiResponse, Field } from '../../types/api';
import type { FieldFormValues } from './fields.schema';

export const getFields = async (): Promise<Field[]> => {
  const { data } = await apiClient.get<ApiResponse<Field[]>>('/fields');
  return data.data;
};

export const createField = async (payload: FieldFormValues): Promise<Field> => {
  const { data } = await apiClient.post<ApiResponse<Field>>('/fields', payload);
  return data.data;
};

export const updateField = async (
  id: string,
  payload: FieldFormValues,
): Promise<Field> => {
  const { data } = await apiClient.put<ApiResponse<Field>>(
    `/fields/${id}`,
    payload,
  );
  return data.data;
};

export const deleteField = async (id: string): Promise<void> => {
  await apiClient.delete(`/fields/${id}`);
};
