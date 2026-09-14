import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="text-xl font-bold text-brand-600">
          ShopEasy
        </Link>

        <div className="flex items-center gap-6 text-sm font-medium">
          <Link to="/" className="hover:text-brand-600">
            Products
          </Link>

          {user && (
            <Link to="/orders" className="hover:text-brand-600">
              My Orders
            </Link>
          )}

          {isAdmin && (
            <Link to="/admin" className="hover:text-brand-600">
              Admin
            </Link>
          )}

          <Link to="/cart" className="relative hover:text-brand-600">
            Cart
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-brand-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-gray-500">Hi, {user.name.split(" ")[0]}</span>
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-md bg-gray-100 hover:bg-gray-200"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="px-3 py-1.5 rounded-md hover:bg-gray-100">
                Login
              </Link>
              <Link
                to="/register"
                className="px-3 py-1.5 rounded-md bg-brand-500 text-white hover:bg-brand-600"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
