import { Box, Grid, Typography } from "@mui/material";
import StatsSection from "../features/dashboard/StatsSection";
import RecentBooksTable from "../features/dashboard/RecentBooksTable";
import RecentContributorsTable from "../features/dashboard/RecentContributorsTable";

export default function DashboardPage() {
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Dashboard
      </Typography>

      <StatsSection />

      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid size={{ xs: 12, lg: 7 }}>
          <RecentBooksTable />
        </Grid>
        <Grid size={{ xs: 12, lg: 5 }}>
          <RecentContributorsTable />
        </Grid>
      </Grid>
    </Box>
  );
}
