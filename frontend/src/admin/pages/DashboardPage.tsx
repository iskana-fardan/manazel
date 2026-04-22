import { Box, Grid, Typography } from "@mui/material";
import StatsSection from "../features/dashboard/StatsSection";
import RecentBooksTable from "../features/dashboard/RecentBooksTable";
import RecentContributorsTable from "../features/dashboard/RecentContributorsTable";

export default function DashboardPage() {
  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>
          Dashboard
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Overview of all data in the system.
        </Typography>
      </Box>

      <StatsSection />

      <Grid container spacing={3} sx={{ mt: 0.5 }}>
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
