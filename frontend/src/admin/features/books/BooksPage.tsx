import { useState } from 'react';
import { Box, Stack } from '@mui/material';
import BookHeader from './BookHeader';
import BooksTable from './BooksTable';
import BookDialog from './BookDialog';
import { useBooks, useCreateBook, useUpdateBook, useDeleteBook } from '../../../features/books/use-books';
import { useFields } from '../../../features/fields/use-fields';
import type { Book } from '../../../types/api';
import type { BookFormValues } from '../../../features/books/books.schema';

export default function BooksPage() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Book | null>(null);

  const { data: fields = [] } = useFields();
  const { data: books = [] } = useBooks();
  const createBook = useCreateBook();
  const updateBook = useUpdateBook();
  const deleteBook = useDeleteBook();

  const isPending = createBook.isPending || updateBook.isPending;

  const handleOpen = (book?: Book) => {
    setSelected(book ?? null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelected(null);
  };

  const handleSubmit = (formData: BookFormValues) => {
    if (selected) {
      updateBook.mutate(
        { id: selected._id, payload: formData },
        { onSuccess: handleClose },
      );
    } else {
      createBook.mutate(formData, { onSuccess: handleClose });
    }
  };

  return (
    <Box p={3}>
      <Stack spacing={3}>
        <BookHeader onAdd={() => handleOpen()} />

        <BooksTable
          books={books}
          onEdit={handleOpen}
          onDelete={(book) => {
            if (confirm(`Delete "${book.title}"?`)) {
              deleteBook.mutate(book._id);
            }
          }}
        />

        <BookDialog
          open={open}
          onClose={handleClose}
          onSubmit={handleSubmit}
          initialData={selected}
          fields={fields}
          loading={isPending}
        />
      </Stack>
    </Box>
  );
}
