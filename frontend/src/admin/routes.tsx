import type { RouteObject } from "react-router-dom";
import AdminLayout from "./layout/AdminLayout";
import AdminGuard from "./routes/AdminGuard";

import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import BooksPage from "./features/books/BooksPage";

import RoadmapsPage from "./pages/RoadmapsPage";
import FieldsPage from "./features/fields/FieldsPage";
import ContributorsPage from "./features/contributors/ContributorsPage";

export const adminRoutes: RouteObject = {
  path: "/admin",
  children: [
    {
      path: "login",
      element: <LoginPage/>
    },
    {
      element: <AdminGuard/>,
      children: [
        {
          element: <AdminLayout/>,
          children: [
            { index: true, element: <DashboardPage/> },
            { path: "books", element: <BooksPage/> },
            { path: "roadmaps", element: <RoadmapsPage /> },
            { path: "fields", element: <FieldsPage /> },
            { path: "contributors", element: <ContributorsPage /> },
          ]
        }
      ]
    }
  ]
}