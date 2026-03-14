import { Minus, Plus, Trash2 } from 'lucide-react';
import type { CartItem } from '../types';
import { useCartStore } from '../store/cartStore';

export default function CartItemRow({ item }: { item: CartItem }) {
  const { updateQuantity, removeItem } = useCartStore();
  const price = item.product.discountPrice || item.product.price;

  return (
    <div className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm">
      <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
        🛍️
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 truncate">{item.product.name}</h3>
        <p className="text-sm text-gray-500">{item.product.brand}</p>
        <p className="text-indigo-600 font-bold mt-1">${price.toFixed(2)}</p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
          className="p-1 rounded hover:bg-gray-100 transition"
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="w-8 text-center font-medium">{item.quantity}</span>
        <button
          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
          className="p-1 rounded hover:bg-gray-100 transition"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <p className="font-bold text-gray-900 w-24 text-right">
        ${(price * item.quantity).toFixed(2)}
      </p>

      <button
        onClick={() => removeItem(item.product.id)}
        className="text-red-500 hover:text-red-700 p-1 transition"
      >
        <Trash2 className="h-5 w-5" />
      </button>
    </div>
  );
}
