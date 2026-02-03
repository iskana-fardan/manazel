import { AppBar, Box, Toolbar, Typography } from "@mui/material"

export default function Topbar() {
  return (
    <AppBar
      position="static"
      color="transparent"
      elevation={0}
      sx={{ borderBottom: "1px solid", borderColor: "divider" }}
    >
      <Toolbar>
        <Typography variant="h6">
          Admin Dashboard
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        <Typography variant="body2">
          Admin
        </Typography>
      </Toolbar>
    </AppBar>
  )
}
