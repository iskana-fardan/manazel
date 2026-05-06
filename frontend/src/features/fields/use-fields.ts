import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createField, deleteField, getFields, updateField } from './fields.api';
import { fieldsKeys } from './fields.keys';
import type { FieldFormValues } from './fields.schema';
import { extractErrorMessage } from '../../lib/extract-error-message';
import { useNotification } from '../../shared/notification/use-notification';

export const useFields = () =>
  useQuery({
    queryKey: fieldsKeys.list(),
    queryFn: getFields,
  });

export const useCreateField = () => {
  const queryClient = useQueryClient();
  const { notify } = useNotification();

  return useMutation({
    mutationFn: createField,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: fieldsKeys.all });
      notify('Field created', 'success');
    },
    onError: (error) => notify(extractErrorMessage(error), 'error'),
  });
};

export const useUpdateField = () => {
  const queryClient = useQueryClient();
  const { notify } = useNotification();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: FieldFormValues }) =>
      updateField(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: fieldsKeys.all });
      notify('Field updated', 'success');
    },
    onError: (error) => notify(extractErrorMessage(error), 'error'),
  });
};

export const useDeleteField = () => {
  const queryClient = useQueryClient();
  const { notify } = useNotification();

  return useMutation({
    mutationFn: deleteField,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: fieldsKeys.all });
      notify('Field deleted', 'success');
    },
    onError: (error) => notify(extractErrorMessage(error), 'error'),
  });
};
