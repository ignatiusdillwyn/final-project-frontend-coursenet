import { createBrowserRouter } from "react-router-dom";
// Layout
import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";

//Pages
import Home from "../pages/Home";
import About from "../pages/About";
import BookCreate from "../pages/BookCreate";
import BookDetail from "../pages/BookDetail";
import Books from "../pages/Books";
import Contact from "../pages/Contact";
import Login from "../pages/Login";
import Register from "../pages/Register";

const router = createBrowserRouter([
    {
        element: <MainLayout />,
        children: [
            {
                path: "/",
                element: <Home />
            },
            {
                path: "/about",
                element: <About />
            },
            {
                path: "/bookCreate",
                element: <BookCreate />
            },
            {
                path: "/books/:id",
                element: <BookDetail />
            },
            {
                path: "/books",
                element: <Books />
            },
            {
                path: "/contact",
                element: <Contact />
            },
            {
                path: "/home",
                element: <Home />
            },
        ],
    },
    {
        element: <AuthLayout />,
        children: [
            {
                path: "/login",
                element: <Login />
            },
            {
                path: "/register",
                element: <Register />
            },
        ]
    }
])

export default router;