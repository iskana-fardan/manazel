import { useState } from 'react';
import { Box, Stack } from '@mui/material';
import ContributorHeader from './ContributorHeader';
import ContributorsTable from './ContributorsTable';
import ContributorDialog from './ContributorDialog';
import {
  useContributors,
  useCreateContributor,
  useUpdateContributor,
  useDeleteContributor,
} from '../../../features/contributors/use-contributors';
import type { Contributor } from '../../../types/api';
import type { ContributorFormValues } from '../../../features/contributors/contributors.schema';

export default function ContributorsPage() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Contributor | null>(null);

  const { data: contributors = [] } = useContributors();
  const createContributor = useCreateContributor();
  const updateContributor = useUpdateContributor();
  const deleteContributor = useDeleteContributor();

  const isPending = createContributor.isPending || updateContributor.isPending;

  const handleOpen = (contributor?: Contributor) => {
    setSelected(contributor ?? null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelected(null);
  };

  const handleSubmit = (formData: ContributorFormValues) => {
    if (selected) {
      updateContributor.mutate(
        { id: selected._id, payload: formData },
        { onSuccess: handleClose },
      );
    } else {
      createContributor.mutate(formData, { onSuccess: handleClose });
    }
  };

  return (
    <Box p={3}>
      <Stack spacing={3}>
        <ContributorHeader onAdd={() => handleOpen()} />

        <ContributorsTable
          contributors={contributors}
          onEdit={handleOpen}
          onDelete={(contributor) => {
            if (confirm(`Delete "${contributor.name}"?`)) {
              deleteContributor.mutate(contributor._id);
            }
          }}
        />

        <ContributorDialog
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
