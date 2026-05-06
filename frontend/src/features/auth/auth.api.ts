import apiClient from '../../lib/api-client';
import type { Admin, ApiResponse } from '../../types/api';
import type { LoginFormValues } from './auth.schema';

export const getMe = async (): Promise<Admin> => {
  const { data } = await apiClient.get<ApiResponse<Admin>>('/auth/me');
  return data.data;
};

export const login = async (
  credentials: LoginFormValues,
): Promise<{ admin: Admin }> => {
  const { data } = await apiClient.post<ApiResponse<{ admin: Admin }>>(
    '/auth/login',
    credentials,
  );
  return data.data;
};

export const logout = async (): Promise<void> => {
  await apiClient.post('/auth/logout');
};
