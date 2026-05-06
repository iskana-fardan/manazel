import { useState } from 'react';
import { Box, Stack } from '@mui/material';
import FieldHeader from './FieldHeader';
import FieldsTable from './FieldsTable';
import FieldDialog from './FieldDialog';
import {
  useFields,
  useCreateField,
  useUpdateField,
  useDeleteField,
} from '../../../features/fields/use-fields';
import type { Field } from '../../../types/api';
import type { FieldFormValues } from '../../../features/fields/fields.schema';

export default function FieldsPage() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Field | null>(null);

  const { data: fields = [] } = useFields();
  const createField = useCreateField();
  const updateField = useUpdateField();
  const deleteField = useDeleteField();

  const isPending = createField.isPending || updateField.isPending;

  const handleOpen = (field?: Field) => {
    setSelected(field ?? null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelected(null);
  };

  const handleSubmit = (formData: FieldFormValues) => {
    if (selected) {
      updateField.mutate(
        { id: selected._id, payload: formData },
        { onSuccess: handleClose },
      );
    } else {
      createField.mutate(formData, { onSuccess: handleClose });
    }
  };

  return (
    <Box p={3}>
      <Stack spacing={3}>
        <FieldHeader onAdd={() => handleOpen()} />

        <FieldsTable
          fields={fields}
          onEdit={handleOpen}
          onDelete={(field) => {
            if (confirm(`Delete "${field.name}"?`)) {
              deleteField.mutate(field._id);
            }
          }}
        />

        <FieldDialog
          open={open}
          onClose={handleClose}
          onSubmit={handleSubmit}
          initialData={selected}
          loading={isPending}
        />
      </Stack>
    </Box>
  );
}
