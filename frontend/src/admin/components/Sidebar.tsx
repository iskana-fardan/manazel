import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material"
import { NavLink, useLocation } from "react-router-dom"

const menuItems = [
  { label: "Dashboard", path: "/admin" },
  { label: "Books", path: "/admin/books" },
  { label: "Roadmaps", path: "/admin/roadmaps" },
  { label: "Fields", path: "/admin/fields" },
]

export default function Sidebar() {
  const location = useLocation()

  return (
    <Box
      sx={{
        width: 240,
        height: "100vh",
        borderRight: "1px solid",
        borderColor: "divider",
        p: 2,
      }}
    >
      <Typography variant="h6" sx={{ mb: 3 }}>
        Admin Panel
      </Typography>

      <List>
        {menuItems.map(item => {
          const isActive =
            item.path === "/admin"
              ? location.pathname === "/admin"
              : location.pathname.startsWith(item.path)

          return (
            <ListItemButton
              key={item.path}
              component={NavLink}
              to={item.path}
              selected={isActive}
              sx={{
                borderRadius: 1,
                mb: 0.5,
              }}
            >
              <ListItemText primary={item.label} />
            </ListItemButton>
          )
        })}
      </List>
    </Box>
  )
}
