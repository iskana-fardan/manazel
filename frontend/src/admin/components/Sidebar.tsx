import {
  Box,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  alpha,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CategoryIcon from "@mui/icons-material/Category";
import MapIcon from "@mui/icons-material/Map";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import PeopleIcon from "@mui/icons-material/People";
import SettingsIcon from "@mui/icons-material/Settings";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { NavLink, useLocation } from "react-router-dom";

interface SidebarProps {
  drawerWidth: number;
  isMobile: boolean;
  mobileOpen: boolean;
  onClose: () => void;
}

const NAV_ITEMS = [
  { label: "Dashboard", icon: DashboardIcon, path: "/admin" },
  { label: "Fields", icon: CategoryIcon, path: "/admin/fields" },
  { label: "Roadmaps", icon: MapIcon, path: "/admin/roadmaps" },
  { label: "Books", icon: AutoStoriesIcon, path: "/admin/books" },
  { label: "Contributors", icon: PeopleIcon, path: "/admin/contributors" },
];

const BOTTOM_ITEMS = [
  { label: "Settings", icon: SettingsIcon, path: "/admin/settings" },
];

type NavItem = (typeof NAV_ITEMS)[0];

function NavButton({
  item,
  active,
  onClick,
}: {
  item: NavItem;
  active: boolean;
  onClick?: () => void;
}) {
  return (
    <ListItemButton
      disableRipple
      component={NavLink}
      to={item.path}
      selected={active}
      onClick={onClick}
      sx={{
        borderRadius: 2,
        mb: 0.5,
        px: 1.5,
        py: 0.9,
        color: active ? "primary.main" : "text.secondary",
        "&.Mui-selected": {
          bgcolor: (t) => alpha(t.palette.primary.main, 0.1),
          color: "primary.main",
          "& .MuiListItemIcon-root": { color: "primary.main" },
          "&:hover": { bgcolor: (t) => alpha(t.palette.primary.main, 0.16) },
        },
        "&:hover": {
          bgcolor: (t) => alpha(t.palette.primary.main, 0.06),
          color: "text.primary",
          "& .MuiListItemIcon-root": { color: "text.primary" },
        },
      }}
    >
      <ListItemIcon
        sx={{ minWidth: 36, color: active ? "primary.main" : "text.secondary" }}
      >
        <item.icon fontSize="small" />
      </ListItemIcon>
      <ListItemText
        primary={item.label}
        slotProps={{
          primary: { variant: "body2", fontWeight: active ? 600 : 400 },
        }}
      />
    </ListItemButton>
  );
}

export default function Sidebar({
  drawerWidth,
  isMobile,
  mobileOpen,
  onClose,
}: SidebarProps) {
  const location = useLocation();

  const isActive = (path: string) =>
    path === "/admin"
      ? location.pathname === "/admin"
      : location.pathname.startsWith(path);

  const drawerContent = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Branding */}
      <Box sx={{ px: 2.5, py: 2.5 }}>
        <Box display="flex" alignItems="center" gap={1.5}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 2,
              bgcolor: "primary.main",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <MenuBookIcon sx={{ color: "#fff", fontSize: 20 }} />
          </Box>
          <Box>
            <Typography variant="body2" fontWeight={700} lineHeight={1.3}>
              Peta Ilmu Islam
            </Typography>
            <Typography variant="caption" color="text.secondary" lineHeight={1}>
              Admin Panel
            </Typography>
          </Box>
        </Box>
      </Box>

      <Divider />

      {/* Main nav */}
      <List sx={{ px: 1.5, py: 2, flex: 1 }}>
        <Typography
          variant="caption"
          color="text.disabled"
          sx={{
            px: 1,
            mb: 1,
            display: "block",
            textTransform: "uppercase",
            letterSpacing: 0.8,
            fontWeight: 600,
          }}
        >
          Menu
        </Typography>
        {NAV_ITEMS.map((item) => (
          <NavButton
            key={item.path}
            item={item}
            active={isActive(item.path)}
            onClick={isMobile ? onClose : undefined}
          />
        ))}
      </List>

      <Divider />

      {/* Bottom nav */}
      <List sx={{ px: 1.5, py: 1.5 }}>
        {BOTTOM_ITEMS.map((item) => (
          <NavButton
            key={item.path}
            item={item}
            active={isActive(item.path)}
            onClick={isMobile ? onClose : undefined}
          />
        ))}
      </List>
    </Box>
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
          borderRight: (t) => `1px solid ${t.palette.divider}`,
          boxShadow: "none",
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
}
