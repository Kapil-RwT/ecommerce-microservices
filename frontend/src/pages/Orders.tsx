import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Loader2, Clock, CheckCircle2, XCircle, Truck, AlertTriangle } from 'lucide-react';
import { ordersApi } from '../api/orders';
import { useAuthStore } from '../store/authStore';
import type { Order } from '../types';

const STATUS_CONFIG: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  PENDING: { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100' },
  CONFIRMED: { icon: CheckCircle2, color: 'text-blue-600', bg: 'bg-blue-100' },
  PROCESSING: { icon: Package, color: 'text-indigo-600', bg: 'bg-indigo-100' },
  SHIPPED: { icon: Truck, color: 'text-purple-600', bg: 'bg-purple-100' },
  DELIVERED: { icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-100' },
  CANCELLED: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100' },
  FAILED: { icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-100' },
};

export default function Orders() {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    ordersApi
      .getByUserId(user.id)
      .then(({ data }) => {
        if (data.success) {
          setOrders(Array.isArray(data.data) ? data.data : []);
        }
      })
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <Package className="h-20 w-20 mx-auto text-gray-300" />
        <h2 className="mt-6 text-2xl font-bold text-gray-900">No orders yet</h2>
        <p className="mt-2 text-gray-500">Start shopping to see your orders here</p>
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
      <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
      <p className="text-gray-500 mt-1">{orders.length} order(s)</p>

      <div className="mt-6 space-y-4">
        {orders.map((order) => {
          const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING;
          const Icon = cfg.icon;

          return (
            <div key={order.id} className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <p className="text-sm text-gray-500">Order #{order.id}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${cfg.bg} ${cfg.color}`}>
                  <Icon className="h-4 w-4" />
                  {order.status}
                </div>
              </div>

              {order.items && order.items.length > 0 && (
                <div className="mt-4 border-t pt-4 space-y-2">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {item.productName || `Product #${item.productId}`} × {item.quantity}
                      </span>
                      <span className="font-medium">${item.subtotal.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-4 border-t pt-4 flex items-center justify-between">
                <span className="text-gray-600">Total</span>
                <span className="text-xl font-bold text-gray-900">
                  ${order.totalAmount.toFixed(2)}
                </span>
              </div>

              {order.shippingAddress && (
                <p className="mt-2 text-xs text-gray-400">Ship to: {order.shippingAddress}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
