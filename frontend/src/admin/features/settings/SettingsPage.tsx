import { Box, Divider, Stack, Typography } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";

export default function SettingsPage() {
  return (
    <Box p={3}>
      <Stack spacing={3}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <SettingsIcon color="action" />
          <Typography variant="h5" fontWeight="bold">
            Settings
          </Typography>
        </Stack>

        <Divider />

        <Typography color="text.secondary">
          Settings configuration will be available here.
        </Typography>
      </Stack>
    </Box>
  );
}
