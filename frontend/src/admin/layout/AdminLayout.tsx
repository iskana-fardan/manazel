import * as React from "react";
import { Box, CssBaseline, useMediaQuery, useTheme } from "@mui/material";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

import type { ReactNode } from "react";

interface AdminLayoutProps {
  children: ReactNode;
}

const drawerWidth = 240;

export default function AdminLayout({ children }:AdminLayoutProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      <Topbar
        drawerWidth={drawerWidth}
        isMobile={isMobile}
        onMenuClick={handleDrawerToggle}
      />

      <Sidebar
        drawerWidth={drawerWidth}
        isMobile={isMobile}
        mobileOpen={mobileOpen}
        onClose={handleDrawerToggle}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          width: isMobile ? "100%" : `calc(100% - ${drawerWidth}px)`,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
