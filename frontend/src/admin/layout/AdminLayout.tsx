import * as React from "react";
import { Box, CssBaseline, useMediaQuery, useTheme } from "@mui/material";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const drawerWidth = 240;

export default function AdminLayout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <CssBaseline />

      {/* Sidebar */}
      <Sidebar
        drawerWidth={drawerWidth}
        isMobile={isMobile}
        mobileOpen={mobileOpen}
        onClose={handleDrawerToggle}
      />

      {/* RIGHT SIDE WRAPPER */}
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        
        {/* Topbar */}
        <Topbar
          drawerWidth={drawerWidth}
          isMobile={isMobile}
          onMenuClick={handleDrawerToggle}
        />

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flex: 1,
            mt:5,
            p: 3,
            width: '100%',
            overflow: "auto",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
