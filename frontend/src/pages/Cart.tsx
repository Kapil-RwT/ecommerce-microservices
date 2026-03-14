import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import CartItemRow from '../components/CartItemRow';

export default function Cart() {
  const { items, totalPrice, clearCart } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <ShoppingBag className="h-20 w-20 mx-auto text-gray-300" />
        <h2 className="mt-6 text-2xl font-bold text-gray-900">Your cart is empty</h2>
        <p className="mt-2 text-gray-500">Looks like you haven't added anything yet</p>
        <Link
          to="/products"
          className="inline-block mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3 rounded-lg transition"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
        <button
          onClick={clearCart}
          className="text-red-500 hover:text-red-700 text-sm font-medium transition"
        >
          Clear Cart
        </button>
      </div>

      <div className="mt-6 space-y-3">
        {items.map((item) => (
          <CartItemRow key={item.product.id} item={item} />
        ))}
      </div>

      <div className="mt-8 bg-white p-6 rounded-xl shadow-sm">
        <div className="flex items-center justify-between text-lg">
          <span className="text-gray-700">Subtotal</span>
          <span className="font-bold text-gray-900">${totalPrice().toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between text-sm text-gray-500 mt-2">
          <span>Shipping</span>
          <span>{totalPrice() >= 50 ? 'FREE' : '$5.99'}</span>
        </div>
        <hr className="my-4" />
        <div className="flex items-center justify-between text-xl">
          <span className="font-bold text-gray-900">Total</span>
          <span className="font-bold text-gray-900">
            ${(totalPrice() + (totalPrice() >= 50 ? 0 : 5.99)).toFixed(2)}
          </span>
        </div>

        <Link
          to="/checkout"
          className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
        >
          Proceed to Checkout <ArrowRight className="h-5 w-5" />
        </Link>

        <Link
          to="/products"
          className="block mt-3 text-center text-indigo-600 hover:underline text-sm"
        >
          ← Continue Shopping
        </Link>
      </div>
    </div>
  );
}
