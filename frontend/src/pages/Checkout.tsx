import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CreditCard, Loader2, ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { ordersApi } from '../api/orders';

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('CREDIT_CARD');

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <ShoppingBag className="h-20 w-20 mx-auto text-gray-300" />
        <h2 className="mt-6 text-2xl font-bold text-gray-900">Nothing to checkout</h2>
        <Link
          to="/products"
          className="inline-block mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3 rounded-lg transition"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Please sign in to checkout</h2>
        <Link
          to="/login"
          className="inline-block mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3 rounded-lg transition"
        >
          Sign In
        </Link>
      </div>
    );
  }

  const subtotal = totalPrice();
  const shipping = subtotal >= 50 ? 0 : 5.99;
  const total = subtotal + shipping;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) {
      toast.error('Please enter a shipping address');
      return;
    }

    setLoading(true);
    try {
      const { data } = await ordersApi.create({
        userId: user!.id,
        items: items.map((i) => ({
          productId: i.product.id,
          quantity: i.quantity,
        })),
        shippingAddress: address,
        paymentMethod,
      });

      if (data.success) {
        clearCart();
        toast.success('Order placed successfully!');
        navigate('/orders');
      } else {
        toast.error(data.error || 'Failed to place order');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>

      <form onSubmit={handlePlaceOrder} className="mt-8 grid md:grid-cols-3 gap-8">
        {/* Left: Shipping + Payment */}
        <div className="md:col-span-2 space-y-6">
          {/* Shipping */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h2>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              placeholder="123 Main St, City, State, ZIP Code"
            />
          </div>

          {/* Payment */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h2>
            <div className="space-y-3">
              {[
                { value: 'CREDIT_CARD', label: 'Credit Card', icon: '💳' },
                { value: 'DEBIT_CARD', label: 'Debit Card', icon: '💳' },
                { value: 'UPI', label: 'UPI', icon: '📱' },
                { value: 'NET_BANKING', label: 'Net Banking', icon: '🏦' },
                { value: 'COD', label: 'Cash on Delivery', icon: '💵' },
              ].map((pm) => (
                <label
                  key={pm.value}
                  className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition ${
                    paymentMethod === pm.value
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={pm.value}
                    checked={paymentMethod === pm.value}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="accent-indigo-600"
                  />
                  <span>{pm.icon}</span>
                  <span className="font-medium">{pm.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Order Summary */}
        <div>
          <div className="bg-white p-6 rounded-xl shadow-sm sticky top-24">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {items.map((item) => (
                <div key={item.product.id} className="flex justify-between text-sm">
                  <span className="text-gray-600 truncate pr-2">
                    {item.product.name} × {item.quantity}
                  </span>
                  <span className="font-medium text-gray-900 flex-shrink-0">
                    ${((item.product.discountPrice || item.product.price) * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            <hr className="my-4" />
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span className="text-gray-600">Shipping</span>
              <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
            </div>
            <hr className="my-4" />
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <CreditCard className="h-5 w-5" /> Place Order — ${total.toFixed(2)}
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
