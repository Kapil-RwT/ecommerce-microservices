import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Truck, Headphones, Zap } from 'lucide-react';

const FEATURES = [
  { icon: Truck, title: 'Free Shipping', desc: 'On orders over $50' },
  { icon: ShieldCheck, title: 'Secure Payment', desc: 'SSL encrypted checkout' },
  { icon: Headphones, title: '24/7 Support', desc: 'Dedicated customer service' },
  { icon: Zap, title: 'Fast Delivery', desc: '2-3 business days' },
];

const CATEGORIES = [
  { name: 'Electronics', emoji: '💻', color: 'bg-blue-50 hover:bg-blue-100' },
  { name: 'Clothing', emoji: '👕', color: 'bg-pink-50 hover:bg-pink-100' },
  { name: 'Books', emoji: '📚', color: 'bg-amber-50 hover:bg-amber-100' },
  { name: 'Home', emoji: '🏠', color: 'bg-green-50 hover:bg-green-100' },
  { name: 'Sports', emoji: '⚽', color: 'bg-purple-50 hover:bg-purple-100' },
  { name: 'Beauty', emoji: '✨', color: 'bg-rose-50 hover:bg-rose-100' },
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-700 via-indigo-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-24 flex flex-col items-center text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
            Shop Smarter,
            <br />
            <span className="text-indigo-200">Not Harder</span>
          </h1>
          <p className="mt-6 text-lg text-indigo-200 max-w-xl">
            Discover thousands of products at unbeatable prices. Fast delivery,
            secure payments, and exceptional customer service.
          </p>
          <div className="mt-8 flex gap-4">
            <Link
              to="/products"
              className="bg-white text-indigo-700 font-semibold px-8 py-3 rounded-lg hover:bg-indigo-50 transition flex items-center gap-2"
            >
              Browse Products <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              to="/register"
              className="border-2 border-white text-white font-semibold px-8 py-3 rounded-lg hover:bg-white/10 transition"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {FEATURES.map((f) => (
            <div key={f.title} className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm">
              <div className="bg-indigo-100 p-3 rounded-lg">
                <f.icon className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{f.title}</p>
                <p className="text-gray-500 text-xs">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.map((c) => (
            <Link
              key={c.name}
              to={`/products?category=${c.name}`}
              className={`${c.color} rounded-xl p-6 text-center transition-all duration-200 hover:scale-105`}
            >
              <span className="text-4xl">{c.emoji}</span>
              <p className="mt-2 font-medium text-gray-800">{c.name}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h2 className="text-3xl font-bold">Ready to Start Shopping?</h2>
          <p className="mt-3 text-gray-400">
            Join thousands of happy customers today.
          </p>
          <Link
            to="/register"
            className="inline-block mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3 rounded-lg transition"
          >
            Sign Up Free
          </Link>
        </div>
      </section>
    </div>
  );
}
