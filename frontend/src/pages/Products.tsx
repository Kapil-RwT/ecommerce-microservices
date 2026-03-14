import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Loader2, PackageX, SlidersHorizontal } from 'lucide-react';
import { productsApi } from '../api/products';
import ProductCard from '../components/ProductCard';
import type { Product } from '../types';

const CATEGORIES = ['All', 'Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Beauty'];

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      let res;
      if (search.trim()) {
        res = await productsApi.search(search, page);
      } else {
        res = await productsApi.getAll(page);
      }
      const data = res.data;
      if (data.success && data.data) {
        let items = data.data.content || [];
        if (selectedCategory !== 'All') {
          items = items.filter(
            (p) => p.category?.toLowerCase() === selectedCategory.toLowerCase()
          );
        }
        setProducts(items);
        setTotalPages(data.data.totalPages || 1);
      } else {
        setProducts([]);
      }
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [search, page, selectedCategory]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
    setSearchParams(search ? { search } : {});
  };

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setPage(0);
    if (cat !== 'All') {
      setSearchParams({ category: cat });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900">Products</h1>
      <p className="text-gray-500 mt-1">Discover our amazing collection</p>

      {/* Search + Filters */}
      <div className="mt-6 flex flex-col md:flex-row gap-4">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              placeholder="Search products..."
            />
          </div>
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-medium transition"
          >
            Search
          </button>
        </form>
      </div>

      {/* Categories */}
      <div className="mt-4 flex items-center gap-2 flex-wrap">
        <SlidersHorizontal className="h-4 w-4 text-gray-500" />
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
              selectedCategory === cat
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          <span className="ml-3 text-gray-500">Loading products...</span>
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-gray-500">
          <PackageX className="h-16 w-16 mb-4" />
          <p className="text-xl font-medium">No products found</p>
          <p className="mt-1">Try a different search or category</p>
        </div>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="px-4 py-2 rounded-lg bg-white border text-sm font-medium disabled:opacity-50 hover:bg-gray-50 transition"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {page + 1} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="px-4 py-2 rounded-lg bg-white border text-sm font-medium disabled:opacity-50 hover:bg-gray-50 transition"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
