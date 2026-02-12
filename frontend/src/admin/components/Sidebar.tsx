import {
  Box,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CategoryIcon from "@mui/icons-material/Category";
import MapIcon from "@mui/icons-material/Map";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import PeopleIcon from "@mui/icons-material/People";
import SettingsIcon from "@mui/icons-material/Settings";
import { NavLink, useLocation } from "react-router-dom";


interface SidebarProps {
  drawerWidth: number;
  isMobile: boolean;
  mobileOpen: boolean;
  onClose: () => void;
}


const menuItems = [
  { label: "Dashboard", icon: DashboardIcon, path: "/admin" },
  { label: "Fields", icon: CategoryIcon, path: "/admin/fields" },
  { label: "Roadmaps", icon: MapIcon, path: "/admin/roadmaps" },
  { label: "Books", icon: AutoStoriesIcon, path: "/admin/books" },
  { label: "Contributors", icon: PeopleIcon, path: "/admin/contributors" },
  { label: "Settings", icon: SettingsIcon, path: "/admin/settings" },
];

export default function Sidebar({
  drawerWidth,
  isMobile,
  mobileOpen,
  onClose,
}:SidebarProps) {
  const location = useLocation();

  const drawerContent = (
    <>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        sx={{ my: 3 }}
      >
        <Typography variant="h6" fontWeight="bold">
          Peta Ilmu Islam
        </Typography>
        <Typography>Admin Panel</Typography>
      </Box>

      <Divider />

      <List sx={{ py: 2, px: 1 }}>
        {menuItems.map((item) => {
          const isActive =
            item.path === "/admin"
              ? location.pathname === "/admin"
              : location.pathname.startsWith(item.path);

          return (
            <ListItemButton
              disableRipple
              key={item.path}
              component={NavLink}
              to={item.path}
              selected={isActive}
              onClick={isMobile ? onClose : undefined}
              sx={{
                borderRadius: 1,
                mb: 0.5,
              }}
            >
              <ListItemIcon>
                <item.icon />
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          );
        })}
      </List>
    </>
  );

  return (
    <Drawer
      variant={isMobile ? "temporary" : "permanent"}
      open={isMobile ? mobileOpen : true}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
}
