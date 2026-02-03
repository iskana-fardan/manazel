import { Box, Grid, Typography } from "@mui/material"
import StatCard from "../components/StatCard"

export default function DashboardPage() {
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Dashboard
      </Typography>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 , md: 3 }}>
          <StatCard label="Total Books" value={32} />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 , md: 3 }}>
          <StatCard label="Total Roadmaps" value={9} />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 , md: 3 }}>
          <StatCard label="Total Fields" value={7} />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 , md: 3 }}>
          <StatCard label="Last Update" value="Today" />
        </Grid>
      </Grid>
    </Box>
  )
}
