import { Box } from "@mui/material"
import { Outlet } from "react-router-dom"
import Sidebar from "../components/Sidebar"
import Topbar from "../components/Topbar"

export default function AdminLayout() {
  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />

      <Box sx={{ flexGrow: 1 }}>
        <Topbar />

        <Box sx={{ p: 3 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}
