import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  TextField,
  Typography,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { loginSchema, type LoginFormValues } from '../../features/auth/auth.schema';
import { login } from '../../features/auth/auth.api';
import { extractErrorMessage } from '../../lib/extract-error-message';

export default function LoginPage() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: () => navigate('/admin', { replace: true }),
  });

  const onSubmit = (values: LoginFormValues) => {
    mutation.mutate(values);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: (theme) =>
          `linear-gradient(135deg, ${theme.palette.primary.main}22, ${theme.palette.background.default})`,
      }}
    >
      <Card sx={{ width: 400, borderRadius: 2, boxShadow: 6 }}>
        <CardContent>
          <Typography variant="h5" fontWeight={600} mb={3} textAlign="center">
            Admin Login
          </Typography>

          {mutation.isError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {extractErrorMessage(mutation.error)}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              margin="normal"
              {...register('email')}
              error={!!errors.email}
              helperText={errors.email?.message}
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              margin="normal"
              {...register('password')}
              error={!!errors.password}
              helperText={errors.password?.message}
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              sx={{ mt: 2, py: 1.2 }}
              disabled={mutation.isPending}
            >
              {mutation.isPending ? <CircularProgress size={22} /> : 'Login'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
