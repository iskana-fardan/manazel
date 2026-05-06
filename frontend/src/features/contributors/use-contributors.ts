import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createContributor,
  deleteContributor,
  getContributors,
  updateContributor,
} from './contributors.api';
import { contributorsKeys } from './contributors.keys';
import type { ContributorFormValues } from './contributors.schema';
import { extractErrorMessage } from '../../lib/extract-error-message';
import { useNotification } from '../../shared/notification/use-notification';

export const useContributors = () =>
  useQuery({
    queryKey: contributorsKeys.list(),
    queryFn: getContributors,
  });

export const useCreateContributor = () => {
  const queryClient = useQueryClient();
  const { notify } = useNotification();

  return useMutation({
    mutationFn: createContributor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contributorsKeys.all });
      notify('Contributor added', 'success');
    },
    onError: (error) => notify(extractErrorMessage(error), 'error'),
  });
};

export const useUpdateContributor = () => {
  const queryClient = useQueryClient();
  const { notify } = useNotification();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: ContributorFormValues;
    }) => updateContributor(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contributorsKeys.all });
      notify('Contributor updated', 'success');
    },
    onError: (error) => notify(extractErrorMessage(error), 'error'),
  });
};

export const useDeleteContributor = () => {
  const queryClient = useQueryClient();
  const { notify } = useNotification();

  return useMutation({
    mutationFn: deleteContributor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contributorsKeys.all });
      notify('Contributor removed', 'success');
    },
    onError: (error) => notify(extractErrorMessage(error), 'error'),
  });
};
