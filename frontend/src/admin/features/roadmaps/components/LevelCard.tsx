import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Button,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { useState } from "react";
import type { Book } from "../../books/books.types";
import { AddBookDialog } from "./AddBookDialog";

type Props = {
  label: string;
  bookIds: string[];
  allBooks: Book[];
  onAddBook: (bookId: string) => void;
  onRemoveBook: (bookId: string) => void;
  loading?: boolean;
};

export const LevelCard = ({
  label,
  bookIds,
  allBooks,
  onAddBook,
  onRemoveBook,
  loading,
}: Props) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const booksInLevel = bookIds
    .map((id) => allBooks.find((b) => b._id === id))
    .filter(Boolean) as Book[];

  return (
    <Box>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={1}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="subtitle1" fontWeight={600}>
            {label}
          </Typography>
          <Chip label={booksInLevel.length} size="small" />
        </Box>
        <Button
          startIcon={<AddIcon />}
          size="small"
          variant="outlined"
          onClick={() => setDialogOpen(true)}
        >
          Add Book
        </Button>
      </Box>

      {booksInLevel.length === 0 ? (
        <Typography
          color="text.secondary"
          variant="body2"
          sx={{ py: 2, textAlign: "center" }}
        >
          No books added yet.
        </Typography>
      ) : (
        <List dense disablePadding>
          {booksInLevel.map((book) => (
            <ListItem
              key={book._id}
              disableGutters
              secondaryAction={
                <IconButton
                  size="small"
                  edge="end"
                  onClick={() => onRemoveBook(book._id)}
                  color="error"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              }
            >
              <ListItemText primary={book.title} secondary={book.author} />
            </ListItem>
          ))}
        </List>
      )}

      <AddBookDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onAdd={onAddBook}
        books={allBooks}
        existingBookIds={bookIds}
        loading={loading}
      />
    </Box>
  );
};
