import { createBrowserRouter } from "react-router-dom";
import RootLayout from "./layout";
import HomePage from "../pages/HomePage";
import AboutPage from "../pages/AboutPage";
import RoadmapDetailPage from "../features/roadmaps/Roadmap";
import CollaboratorsPage from "../pages/CollaboratorsPage";
import NotFoundPage from "../pages/NotFoundPage";
import { adminRoutes } from "../admin/routes";

export const router = createBrowserRouter([
    // ===============
    // PUBLIC ROUTES
    // ===============
    {
        element: <RootLayout/>,
        children: [
            {
                path: "/",
                element: <HomePage />
            },
            {
                path: "/tentang",
                element: <AboutPage />
            },
            {
                path: "/roadmap/:slug", // : artinya, bagian dari URL yg bersifat dinamis, 
                element: <RoadmapDetailPage/>                        // a.k.a apapun setelah roadmap akan ditangkap s
                                        // ebagai parameter bernama slug
            },
            {
                path: "/kolaborasi",
                element: <CollaboratorsPage/>
            },
            {
                path: "*",
                element: <NotFoundPage />
            },
        ]
    },

    // ===============
    // ADMIN ROUTES
    // ===============
    adminRoutes
])