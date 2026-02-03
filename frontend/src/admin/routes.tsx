import type { RouteObject } from "react-router-dom"
import AdminLayout from "./layout/AdminLayout"
import BooksPage from "./pages/BooksPage"
import DashboardPage from "./pages/DashboardPage"
import FieldsPage from "./pages/FieldsPage"
import RoadmapsPage from "./pages/RoadmapsPage"


export const adminRoutes: RouteObject = {
  path: "/admin",
  element: <AdminLayout />,
  children: [
    { index: true, element: <DashboardPage /> },
    { path: "books", element: <BooksPage /> },
    { path: "roadmaps", element: <RoadmapsPage /> },
    { path: "fields", element: <FieldsPage /> },
  ],
}
