import { Stack, Typography, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

interface Props {
  onAdd: () => void;
}

const FieldHeader = ({ onAdd }: Props) => {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
    >
      <Typography variant="h5" fontWeight={600}>
        Fields Management
      </Typography>

      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={onAdd}
      >
        Add Field
      </Button>
    </Stack>
  );
};

export default FieldHeader;
