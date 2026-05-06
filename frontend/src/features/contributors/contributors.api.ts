import apiClient from '../../lib/api-client';
import type { ApiResponse, Contributor } from '../../types/api';
import type { ContributorFormValues } from './contributors.schema';

export const getContributors = async (): Promise<Contributor[]> => {
  const { data } = await apiClient.get<ApiResponse<Contributor[]>>('/contributors');
  return data.data;
};

export const createContributor = async (
  payload: ContributorFormValues,
): Promise<Contributor> => {
  const { data } = await apiClient.post<ApiResponse<Contributor>>(
    '/contributors',
    payload,
  );
  return data.data;
};

export const updateContributor = async (
  id: string,
  payload: ContributorFormValues,
): Promise<Contributor> => {
  const { data } = await apiClient.put<ApiResponse<Contributor>>(
    `/contributors/${id}`,
    payload,
  );
  return data.data;
};

export const deleteContributor = async (id: string): Promise<void> => {
  await apiClient.delete(`/contributors/${id}`);
};
