import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Store } from 'lucide-react';
import toast from 'react-hot-toast';
import { authApi } from '../api/auth';
import { useAuthStore } from '../store/authStore';

export default function Login() {
  const [form, setForm] = useState({ usernameOrEmail: '', password: '' });
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await authApi.login(form);
      if (data.success) {
        login(data.data.token, data.data.user);
        toast.success(`Welcome back, ${data.data.user.firstName}!`);
        navigate('/products');
      } else {
        toast.error(data.error || 'Login failed');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-indigo-600 font-bold text-2xl">
            <Store className="h-8 w-8" /> ShopEase
          </Link>
          <h1 className="mt-4 text-3xl font-bold text-gray-900">Welcome back</h1>
          <p className="mt-2 text-gray-500">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-sm space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username or Email
            </label>
            <input
              type="text"
              required
              value={form.usernameOrEmail}
              onChange={(e) => setForm({ ...form, usernameOrEmail: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-2.5 rounded-lg transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <>
                <LogIn className="h-5 w-5" /> Sign In
              </>
            )}
          </button>

          <p className="text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-600 hover:underline font-medium">
              Create one
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
