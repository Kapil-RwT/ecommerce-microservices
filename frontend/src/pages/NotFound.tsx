import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
      <h1 className="text-8xl font-extrabold text-indigo-600">404</h1>
      <p className="mt-4 text-2xl font-bold text-gray-900">Page not found</p>
      <p className="mt-2 text-gray-500">The page you're looking for doesn't exist.</p>
      <Link
        to="/"
        className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3 rounded-lg transition"
      >
        Go Home
      </Link>
    </div>
  );
}
