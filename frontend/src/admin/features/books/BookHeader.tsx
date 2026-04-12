import { Stack, Typography, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

interface Props {
  onAdd: () => void;
}

const BookHeader = ({ onAdd }: Props) => {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
    >
      <Typography variant="h5" fontWeight={600}>
        Books Management
      </Typography>

      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={onAdd}
      >
        Add Book
      </Button>
    </Stack>
  );
};

export default BookHeader;
