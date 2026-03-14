import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, Star, ArrowLeft, Loader2, Minus, Plus, Package } from 'lucide-react';
import toast from 'react-hot-toast';
import { productsApi } from '../api/products';
import { useCartStore } from '../store/cartStore';
import type { Product } from '../types';

const FALLBACK_IMG =
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=400&fit=crop';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    productsApi
      .getById(Number(id))
      .then(({ data }) => {
        if (data.success) setProduct(data.data);
      })
      .catch(() => toast.error('Failed to load product'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <Package className="h-16 w-16 mx-auto text-gray-400" />
        <h2 className="mt-4 text-2xl font-bold text-gray-900">Product not found</h2>
        <Link to="/products" className="mt-4 inline-block text-indigo-600 hover:underline">
          ← Back to products
        </Link>
      </div>
    );
  }

  const price = product.discountPrice || product.price;

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) addItem(product);
    toast.success(`${qty}× ${product.name} added to cart`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Link to="/products" className="inline-flex items-center gap-1 text-indigo-600 hover:underline text-sm mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to Products
      </Link>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Image */}
        <div className="bg-white rounded-xl overflow-hidden shadow-sm">
          <img
            src={product.imageUrl || FALLBACK_IMG}
            alt={product.name}
            className="w-full h-96 object-cover"
            onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMG; }}
          />
        </div>

        {/* Details */}
        <div>
          <span className="text-sm text-indigo-600 font-medium uppercase tracking-wide">
            {product.brand}
          </span>
          <h1 className="text-3xl font-bold text-gray-900 mt-1">{product.name}</h1>

          {product.rating != null && (
            <div className="flex items-center gap-2 mt-3">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${
                      star <= Math.round(product.rating!)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {product.rating.toFixed(1)} ({product.reviewCount || 0} reviews)
              </span>
            </div>
          )}

          <div className="mt-6">
            {product.discountPrice ? (
              <div className="flex items-center gap-3">
                <span className="text-4xl font-bold text-gray-900">
                  ${product.discountPrice.toFixed(2)}
                </span>
                <span className="text-xl text-gray-400 line-through">
                  ${product.price.toFixed(2)}
                </span>
                <span className="bg-red-100 text-red-700 text-sm font-medium px-2 py-1 rounded">
                  {Math.round(((product.price - product.discountPrice) / product.price) * 100)}%
                  OFF
                </span>
              </div>
            ) : (
              <span className="text-4xl font-bold text-gray-900">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>

          <p className="mt-6 text-gray-600 leading-relaxed">{product.description}</p>

          <div className="mt-6 space-y-3">
            {product.category && (
              <p className="text-sm text-gray-500">
                <span className="font-medium text-gray-700">Category:</span> {product.category}
              </p>
            )}
            {product.sku && (
              <p className="text-sm text-gray-500">
                <span className="font-medium text-gray-700">SKU:</span> {product.sku}
              </p>
            )}
          </div>

          {/* Quantity + Add to Cart */}
          <div className="mt-8 flex items-center gap-4">
            <div className="flex items-center border rounded-lg">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="p-3 hover:bg-gray-50 transition"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-12 text-center font-medium">{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="p-3 hover:bg-gray-50 transition"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-lg transition flex items-center justify-center gap-2"
            >
              <ShoppingCart className="h-5 w-5" /> Add to Cart — ${(price * qty).toFixed(2)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
