import * as React from "react";
import {
  AppBar,
  Avatar,
  CircularProgress,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { useColorMode } from "../../theme/useColorMode";
import { useLogout } from "../../features/auth/use-auth";

interface TopbarProps {
  drawerWidth: number;
  isMobile: boolean;
  onMenuClick: () => void;
}

function getPageTitle(pathname: string): string {
  if (pathname === "/admin") return "Dashboard";
  if (pathname.startsWith("/admin/fields")) return "Fields";
  if (pathname.startsWith("/admin/roadmaps")) return "Roadmaps";
  if (pathname.startsWith("/admin/books")) return "Books";
  if (pathname.startsWith("/admin/contributors")) return "Contributors";
  if (pathname.startsWith("/admin/settings")) return "Settings";
  return "Admin";
}

export default function Topbar({
  drawerWidth,
  isMobile,
  onMenuClick,
}: TopbarProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const { toggleColorMode } = useColorMode();
  const logoutMutation = useLogout();

  const pageTitle = getPageTitle(location.pathname);

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => navigate("/admin/login", { replace: true }),
    });
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: isMobile ? "100%" : `calc(100% - ${drawerWidth}px)`,
        ml: isMobile ? 0 : `${drawerWidth}px`,
        bgcolor: "background.paper",
        color: "text.primary",
        borderBottom: (t) => `1px solid ${t.palette.divider}`,
      }}
    >
      <Toolbar sx={{ gap: 0.5 }}>
        {isMobile && (
          <IconButton
            color="inherit"
            edge="start"
            onClick={onMenuClick}
            sx={{ mr: 1 }}
          >
            <MenuIcon />
          </IconButton>
        )}

        <Typography variant="h6" fontWeight={600} sx={{ flexGrow: 1 }}>
          {pageTitle}
        </Typography>

        <Tooltip
          title={theme.palette.mode === "dark" ? "Light mode" : "Dark mode"}
        >
          <IconButton color="inherit" onClick={toggleColorMode}>
            {theme.palette.mode === "dark" ? (
              <Brightness7Icon fontSize="small" />
            ) : (
              <Brightness4Icon fontSize="small" />
            )}
          </IconButton>
        </Tooltip>

        <Tooltip title="Account settings">
          <IconButton
            onClick={(e) => setAnchorEl(e.currentTarget)}
            size="small"
            sx={{ ml: 0.5 }}
          >
            <Avatar
              sx={{
                width: 34,
                height: 34,
                bgcolor: "primary.main",
                fontSize: 14,
                fontWeight: 700,
              }}
            >
              A
            </Avatar>
          </IconButton>
        </Tooltip>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          onClick={() => setAnchorEl(null)}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          slotProps={{
            paper: {
              elevation: 3,
              sx: { minWidth: 180, mt: 0.5, borderRadius: 2 },
            },
          }}
        >
          <MenuItem>
            <ListItemIcon>
              <AccountCircleIcon fontSize="small" />
            </ListItemIcon>
            Profile
          </MenuItem>
          <Divider />
          <MenuItem
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
            sx={{ color: "error.main" }}
          >
            <ListItemIcon>
              {logoutMutation.isPending ? (
                <CircularProgress size={16} color="error" />
              ) : (
                <LogoutIcon fontSize="small" color="error" />
              )}
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
