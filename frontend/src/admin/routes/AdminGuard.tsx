import { useQuery } from '@tanstack/react-query';
import { Box, CircularProgress } from '@mui/material';
import { Navigate, Outlet } from 'react-router-dom';
import { getMe } from '../../features/auth/auth.api';
import { authKeys } from '../../features/auth/auth.keys';

export default function AdminGuard() {
  const { isLoading, isError } = useQuery({
    queryKey: authKeys.me,
    queryFn: getMe,
    retry: false,
    staleTime: Infinity,
  });

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return isError ? <Navigate to="/admin/login" replace /> : <Outlet />;
}
