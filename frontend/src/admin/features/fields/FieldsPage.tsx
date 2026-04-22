import { Box, Stack } from "@mui/material";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import FieldHeader from "./FieldHeader";
import FieldsTable from "./FieldsTable";
import FieldDialog from "./FieldDialog";
import api from "../../services/api";
import type { Field } from "./fields.types";
import type { FieldFormValues } from "./field.schema";
import { useCreateField, useFields } from "../../../hooks/useFields";


export default function FieldsPage() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Field | null>(null);


  // ambil fields
  const { data: fields = [] } = useFields(); 

  // tambah field
  const createMutation = useCreateField();

  const updateMutation = useMutation({
    mutationFn: (payload: FieldFormValues) =>
      api.put(`/fields/${selected?._id}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fields"] });
      setOpen(false);
      setSelected(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/fields/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fields"] });
    },
  });

  const handleSubmit = (data: FieldFormValues) => {
    if (selected) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data, {
        onSuccess: () => {
          setOpen(false);
        }
      });
    }
  };

  return (
    <Box p={3}>
      <Stack spacing={3}>
        <FieldHeader
          onAdd={() => {
            setSelected(null);
            setOpen(true);
          }}
        />

        <FieldsTable
          fields={fields}
          onEdit={(field) => {
            setSelected(field);
            setOpen(true);
          }}
          onDelete={(field) => {
            if (confirm(`Delete ${field.name}?`)) {
              deleteMutation.mutate(field._id);
            }
          }}
        />

        <FieldDialog
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

