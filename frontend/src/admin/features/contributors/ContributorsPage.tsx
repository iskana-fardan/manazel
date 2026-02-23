import { Box, Stack } from "@mui/material";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ContributorHeader from "./ContributorHeader";
import api from "../../services/api";
import type { Contributor } from "./contributors.types";
import type { ContributorFormValues } from "./contributor.schema";
import ContributorsTable from "./ContributorsTable";
import ContributorDialog from "./ContributorDialog";

export default function ContributorsPage() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Contributor | null>(null);

  const { data = [] } = useQuery<Contributor[]>({
    queryKey: ["contributors"],
    queryFn: async () => {
      const { data } = await api.get("/contributors");
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: (payload: ContributorFormValues) =>
      api.post("/contributors", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contributors"] });
      setOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (payload: ContributorFormValues) =>
      api.put(`/contributors/${selected?._id}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contributors"] });
      setOpen(false);
      setSelected(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/contributors/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contributors"] });
    },
  });

  const handleSubmit = (data: ContributorFormValues) => {
    if (selected) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <Box p={3}>
      <Stack spacing={3}>
        <ContributorHeader
          onAdd={() => {
            setSelected(null);
            setOpen(true);
          }}
        />

        <ContributorsTable
          contributors={data}
          onEdit={(contributor) => {
            setSelected(contributor);
            setOpen(true);
          }}
          onDelete={(contributor) => {
            if (confirm(`Delete ${contributor.name}?`)) {
              deleteMutation.mutate(contributor._id);
            }
          }}
        />

        <ContributorDialog
          open={open}
          onClose={() => {
            setOpen(false);
            setSelected(null);
          }}
          onSubmit={handleSubmit}
          initialData={selected}
          loading={
            createMutation.isPending || updateMutation.isPending
          }
        />
      </Stack>
    </Box>
  );
}
