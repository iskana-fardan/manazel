import  { Stack, Typography, Button } from '@mui/material';
import AddIcon from "@mui/icons-material/Add";

interface Props {
    onAdd: () => void;
}

const ContributorHeader = ({ onAdd }: Props) => {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
    >
      <Typography variant="h5" fontWeight={600}>
        Contributors Management
      </Typography>

      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={onAdd}
      >
        Add Contributor
      </Button>
    </Stack>
  );
}

export default ContributorHeader