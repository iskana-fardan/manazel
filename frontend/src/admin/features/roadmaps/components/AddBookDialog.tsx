import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItemButton,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import type { Book } from "../../../../types/api";

type Props = {
  open: boolean;
  onClose: () => void;
  onAdd: (bookId: string) => void;
  books: Book[];
  existingBookIds: string[];
  loading?: boolean;
};

export const AddBookDialog = ({
  open,
  onClose,
  onAdd,
  books,
  existingBookIds,
  loading,
}: Props) => {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  const filtered = books.filter(
    (b) =>
      !existingBookIds.includes(b._id) &&
      (b.title.toLowerCase().includes(search.toLowerCase()) ||
        b.author.toLowerCase().includes(search.toLowerCase()))
  );

  const handleClose = () => {
    setSearch("");
    setSelected(null);
    onClose();
  };

  const handleAdd = () => {
    if (selected) {
      onAdd(selected);
      handleClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Add Book</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          fullWidth
          placeholder="Search by title or author..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ mb: 2, mt: 1 }}
          size="small"
        />
        {filtered.length === 0 ? (
          <Typography color="text.secondary" align="center" py={3}>
            No books available
          </Typography>
        ) : (
          <List dense disablePadding>
            {filtered.map((book) => (
              <ListItemButton
                key={book._id}
                selected={selected === book._id}
                onClick={() => setSelected(book._id)}
                sx={{ borderRadius: 1 }}
              >
                <ListItemText primary={book.title} secondary={book.author} />
              </ListItemButton>
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleAdd}
          disabled={!selected || loading}
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};
