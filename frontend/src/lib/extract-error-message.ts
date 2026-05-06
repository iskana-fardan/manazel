import axios from 'axios';

export function extractErrorMessage(
  error: unknown,
  fallback = 'Operation failed',
): string {
  if (axios.isAxiosError(error)) {
    const responseData = error.response?.data as
      | { message?: string }
      | undefined;
    return responseData?.message ?? error.message ?? fallback;
  }
  return fallback;
}
