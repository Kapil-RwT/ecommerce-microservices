import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { Toaster } from 'react-hot-toast';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Toaster position="top-right" />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="bg-gray-800 text-gray-400 text-center py-6 text-sm">
        <p>&copy; 2026 ShopEase — E-Commerce Microservices Platform</p>
        <p className="mt-1 text-gray-500">
          Built with Spring Boot, React, Docker &amp; Kafka
        </p>
      </footer>
    </div>
  );
}
