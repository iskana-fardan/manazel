import { Box, Stack } from "@mui/material";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import BookHeader from "./BookHeader";
import api from "../../services/api";
import type { Book } from "./books.types";
import type { BookFormValues } from "./book.schema";
import BooksTable from "./BooksTable";
import BookDialog from "./BookDialog";
import { useBooks } from "../../../hooks/useBooks";


export default function BooksPage() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Book | null>(null);

  const { data: fields = [] } = useQuery({
    queryKey: ["fields"],
    queryFn: async () => {
      const { data } = await api.get("/fields");
      return data;
    },
  });


  const { data: books = [] } = useBooks();



  const createMutation = useMutation({
    mutationFn: (payload: BookFormValues) =>
      api.post("/books", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      setOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (payload: BookFormValues) =>
      api.put(`/books/${selected?._id}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      setOpen(false);
      setSelected(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/books/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
  });

  const handleSubmit = (data: BookFormValues) => {
    if (selected) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <Box p={3}>
      <Stack spacing={3}>
        <BookHeader
          onAdd={() => {
            setSelected(null);
            setOpen(true);
          }}
        />

        <BooksTable
          books={books}
          onEdit={(book) => {
            setSelected(book);
            setOpen(true);
          }}
          onDelete={(book) => {
            if (confirm(`Delete ${book.title}?`)) {
              deleteMutation.mutate(book._id);
            }
          }}
        />

        <BookDialog
          open={open}
          onClose={() => {
            setOpen(false);
            setSelected(null);
          }}
          onSubmit={handleSubmit}
          initialData={selected}
          fields={fields}
          loading={
            createMutation.isPending || updateMutation.isPending
          }
        />
      </Stack>
    </Box>
  );
}





