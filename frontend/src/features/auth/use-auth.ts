import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logout } from './auth.api';
import { authKeys } from './auth.keys';
import { extractErrorMessage } from '../../lib/extract-error-message';
import { useNotification } from '../../shared/notification/use-notification';

export const useLogout = () => {
  const queryClient = useQueryClient();
  const { notify } = useNotification();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: authKeys.me });
    },
    onError: (error) => notify(extractErrorMessage(error), 'error'),
  });
};
