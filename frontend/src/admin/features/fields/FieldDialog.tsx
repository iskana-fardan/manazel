import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  CircularProgress,
} from "@mui/material";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { fieldSchema, type FieldFormValues } from "../../../features/fields/fields.schema";
import type { Field } from "../../../types/api";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: FieldFormValues) => void;
  initialData?: Field | null;
  loading?: boolean;
}

export default function FieldDialog({
  open,
  onClose,
  onSubmit,
  initialData,
  loading,
}: Props) {

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FieldFormValues>({
    resolver: zodResolver(fieldSchema), // “Setiap kali form disubmit, validasinya pakai schema ini.”
    defaultValues: {
      name: "",
      nameArabic: "",
      slug: "",
      description: "",
      icon: "",
      order: 0,
    },
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData); // “Isi ulang semua value form dengan data ini.”
    } else {
      reset({
        name: "",
        nameArabic: "",
        slug: "",
        description: "",
        icon: "",
        order: 0,
      });
    }
  }, [initialData, reset]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {initialData ? "Edit Field" : "Add Field"}
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Name"
              {...register("name")}
              error={!!errors.name}
              helperText={errors.name?.message}
              fullWidth
            />

            <TextField
              label="Arabic Name"
              {...register("nameArabic")}
              fullWidth
            />

            <TextField
              label="Slug"
              {...register("slug")}
              error={!!errors.slug}
              helperText={errors.slug?.message}
              fullWidth
            />

            <TextField
              label="Description"
              {...register("description")}
              multiline
              rows={3}
            />

            <TextField
              label="Icon"
              {...register("icon")}
            />

            <TextField
              label="Order"
              type="number"
              {...register("order", { valueAsNumber: true })}
              error={!!errors.order}
              helperText={errors.order?.message}
            />

          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : initialData ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
