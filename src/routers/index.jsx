import { createBrowserRouter } from "react-router-dom";
// Layout
import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";

//Pages
import Home from "../pages/Home";
import About from "../pages/About";
import BookDetail from "../pages/BookDetail";
import Contact from "../pages/Contact";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Products from "../pages/Products";
import UpdateProduct from "../pages/UpdateProduct";

const router = createBrowserRouter([
    {
        element: <MainLayout />,
        children: [
            {
                path: "/",
                element: <Home />
            },
            {
                path: "/products",
                element: <Products />
            },
            {
                path: "/updateProduct/:id",
                element: <UpdateProduct />
            },
            {
                path: "/about",
                element: <About />
            },
            {
                path: "/books/:id",
                element: <BookDetail />
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