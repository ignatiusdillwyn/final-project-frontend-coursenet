import { createBrowserRouter } from "react-router-dom";
// Layout
import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";

//Middleware
import Middleware from "./Middleware";

//Pages
import Home from "../pages/Home";
import About from "../pages/About";
import Contact from "../pages/Contact";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Products from "../pages/Products";
import UpdateProduct from "../pages/UpdateProduct";
import AddProduct from "../pages/AddProduct";

const router = createBrowserRouter([
    {
        element: (
            <Middleware>
                <MainLayout />
            </Middleware>
        ),
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
                path: "/addProduct",
                element: <AddProduct />
            },
            {
                path: "/about",
                element: <About />
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
],
    // --- PERUBAHAN ADA DI BAGIAN BAWAH INI (KOMA DAN OBJEK KONFIGURASI) ---
    {
        basename: '/final-project/dist'
    }
    // ---------------------------------------------------------------------
)

export default router;