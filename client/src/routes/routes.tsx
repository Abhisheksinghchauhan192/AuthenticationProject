import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from '../pages/Login';
import Layout from "../components/Layout";
import HomePage from "../pages/Homepage";
import Register from "../pages/Register";
import ProtectedRoute from "../components/ProtectedRoute";
import ErrorPage from '../pages/ErrorPage'

const routes = [
    {
        path: '/',
        element: (
            <ProtectedRoute>
                <Layout />
            </ProtectedRoute>
        ),
        errorElement:<ErrorPage />,
        children: [
            {
                index: true, // This makes it the default route for '/'
                element: <HomePage />
            }
        ]
    },
    {
        path: '/login',
        element: <Login />
    },
    {
        path: '/register',
        element: <Register />
    }
];

const router = createBrowserRouter(routes);

export { router };
