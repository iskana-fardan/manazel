import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import AdminLayout from './layout/AdminLayout';
import AdminGuard from './routes/AdminGuard';

const LoginPage = lazy(() => import('./pages/LoginPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const BooksPage = lazy(() => import('./features/books/BooksPage'));
const RoadmapsPage = lazy(() => import('./features/roadmaps/RoadmapsPage'));
const FieldsPage = lazy(() => import('./features/fields/FieldsPage'));
const ContributorsPage = lazy(
  () => import('./features/contributors/ContributorsPage'),
);
const SettingsPage = lazy(() => import('./features/settings/SettingsPage'));

export const adminRoutes: RouteObject = {
  path: '/admin',
  children: [
    { path: 'login', element: <LoginPage /> },
    {
      element: <AdminGuard />,
      children: [
        {
          element: <AdminLayout />,
          children: [
            { index: true, element: <DashboardPage /> },
            { path: 'books', element: <BooksPage /> },
            { path: 'roadmaps', element: <RoadmapsPage /> },
            { path: 'fields', element: <FieldsPage /> },
            { path: 'contributors', element: <ContributorsPage /> },
            { path: 'settings', element: <SettingsPage /> },
          ],
        },
      ],
    },
  ],
};
