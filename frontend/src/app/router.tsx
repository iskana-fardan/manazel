import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import RootLayout from './layout';
import { adminRoutes } from '../admin/routes';

// Public route components — lazy loaded
const HomePage = lazy(() => import('../pages/HomePage'));
const AboutPage = lazy(() => import('../pages/AboutPage'));
const RoadmapDetailPage = lazy(() => import('../features/roadmaps/Roadmap'));
const CollaboratorsPage = lazy(() => import('../pages/CollaboratorsPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

export const router = createBrowserRouter([
  // ── Public ────────────────────────────────────────────────────────────────
  {
    element: <RootLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/tentang', element: <AboutPage /> },
      { path: '/roadmap/:slug', element: <RoadmapDetailPage /> },
      { path: '/kolaborasi', element: <CollaboratorsPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },

  // ── Admin ─────────────────────────────────────────────────────────────────
  adminRoutes,
]);
