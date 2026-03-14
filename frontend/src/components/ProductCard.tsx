import { Link } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Product } from '../types';
import { useCartStore } from '../store/cartStore';

const CATEGORY_IMAGES: Record<string, string> = {
  Electronics: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop',
  Clothing: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
  Books: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=300&fit=crop',
  Home: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&h=300&fit=crop',
  Sports: 'https://images.unsplash.com/photo-1461896836934-bd45ba7c88d4?w=400&h=300&fit=crop',
};

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop';

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const imgSrc = product.imageUrl || CATEGORY_IMAGES[product.category] || FALLBACK_IMG;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <Link
      to={`/products/${product.id}`}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group flex flex-col"
    >
      <div className="relative overflow-hidden">
        <img
          src={imgSrc}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMG; }}
        />
        {product.featured && (
          <span className="absolute top-2 left-2 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded">
            FEATURED
          </span>
        )}
        {product.discountPrice && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            SALE
          </span>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <p className="text-xs text-indigo-600 font-medium uppercase tracking-wide">
          {product.brand}
        </p>
        <h3 className="font-semibold text-gray-900 mt-1 line-clamp-1">{product.name}</h3>
        <p className="text-gray-500 text-sm mt-1 line-clamp-2 flex-1">{product.description}</p>

        {product.rating != null && (
          <div className="flex items-center gap-1 mt-2">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="text-sm text-gray-600">
              {product.rating.toFixed(1)}
              {product.reviewCount != null && (
                <span className="text-gray-400"> ({product.reviewCount})</span>
              )}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between mt-3 pt-3 border-t">
          <div>
            {product.discountPrice ? (
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-gray-900">
                  ${product.discountPrice.toFixed(2)}
                </span>
                <span className="text-sm text-gray-400 line-through">
                  ${product.price.toFixed(2)}
                </span>
              </div>
            ) : (
              <span className="text-lg font-bold text-gray-900">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>
          <button
            onClick={handleAdd}
            className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-lg transition"
            title="Add to cart"
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>
      </div>
    </Link>
  );
}
