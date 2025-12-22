import { NavLink, Link } from "react-router-dom";

const Navbar = () => {
  const activeClass = "text-blue-600 font-semibold";
  const baseClass = "hover:text-blue-500 transition";

  return (
    <nav className="w-full border-b px-8 py-4 flex items-center">
      {/* LEFT - LOGO */}
      <div className="flex-1">
        <Link to="/" className="text-xl font-bold">
          📚 TokoPakEdi
        </Link>
      </div>

      {/* CENTER - MENU */}
      <div className="flex gap-8 flex-1 justify-center">
        <NavLink
          to="/products"
          className={({ isActive }) => (isActive ? activeClass : baseClass)}
        >
          Products
        </NavLink>

        <NavLink
          to="/about"
          className={({ isActive }) => (isActive ? activeClass : baseClass)}
        >
          About
        </NavLink>

        <NavLink
          to="/contact"
          className={({ isActive }) => (isActive ? activeClass : baseClass)}
        >
          Contact
        </NavLink>
      </div>

      {/* RIGHT - LOGIN
      <div className="flex-1 flex justify-end">
        <NavLink
          to="/login"
          className={({ isActive }) =>
            isActive
              ? "text-white bg-blue-600 px-4 py-2 rounded"
              : "border px-4 py-2 rounded hover:bg-gray-100"
          }
        >
          Login
        </NavLink>
      </div> */}
    </nav>
  );
};

export default Navbar;
