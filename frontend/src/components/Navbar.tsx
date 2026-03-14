import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Package, Store, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const totalItems = useCartStore((s) => s.totalItems);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <nav className="bg-indigo-700 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <Store className="h-6 w-6" />
            ShopEase
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/products" className="hover:text-indigo-200 transition">
              Products
            </Link>

            {isAuthenticated && (
              <Link to="/orders" className="hover:text-indigo-200 transition flex items-center gap-1">
                <Package className="h-4 w-4" /> Orders
              </Link>
            )}

            <Link to="/cart" className="relative hover:text-indigo-200 transition">
              <ShoppingCart className="h-5 w-5" />
              {totalItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems()}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <span className="text-indigo-200 text-sm flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {user?.firstName}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-800 px-3 py-1.5 rounded text-sm transition"
                >
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="hover:text-indigo-200 px-3 py-1.5 text-sm transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-indigo-700 hover:bg-indigo-100 px-3 py-1.5 rounded text-sm font-medium transition"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {menuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link to="/products" onClick={() => setMenuOpen(false)} className="block py-2 hover:text-indigo-200">
              Products
            </Link>
            {isAuthenticated && (
              <Link to="/orders" onClick={() => setMenuOpen(false)} className="block py-2 hover:text-indigo-200">
                Orders
              </Link>
            )}
            <Link to="/cart" onClick={() => setMenuOpen(false)} className="block py-2 hover:text-indigo-200">
              Cart ({totalItems()})
            </Link>
            {isAuthenticated ? (
              <button onClick={handleLogout} className="block py-2 hover:text-indigo-200">
                Logout ({user?.firstName})
              </button>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)} className="block py-2 hover:text-indigo-200">
                  Login
                </Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="block py-2 hover:text-indigo-200">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
