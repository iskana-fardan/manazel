import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  CircularProgress,
} from "@mui/material";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { bookSchema, type BookFormValues } from "../../../features/books/books.schema";
import type { Book } from "../../../types/api";
import type { Field } from "../../../types/api";

import BookFormFields from "./components/BookFormFields";
import ResourceFields from "./components/ResourceFields";
import EditionFields from "./components/EditionFields";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: BookFormValues) => void;
  initialData?: Book | null;
  loading?: boolean;
  fields: Field[];
}

export default function BookDialog({
  open,
  onClose,
  onSubmit,
  initialData,
  loading,
  fields,
}: Props) {

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<BookFormValues>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      title: "",
      titleArabic: "",
      author: "",
      field: "",
      level: "beginner",
      type: "dars",
      resources: [],
      recommendedEditions: [],
    },
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {initialData ? "Edit Book" : "Add Book"}
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Stack spacing={2} mt={1}>

            <BookFormFields
              register={register}
              errors={errors}
              fields={fields}
              control={control}
            />

            <ResourceFields
              control={control}
              register={register}
            />

            <EditionFields
              control={control}
              register={register}
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
            {loading ? (
              <CircularProgress size={20} />
            ) : initialData ? (
              "Update"
            ) : (
              "Create"
            )}
          </Button>

        </DialogActions>
      </form>
    </Dialog>
  );
}