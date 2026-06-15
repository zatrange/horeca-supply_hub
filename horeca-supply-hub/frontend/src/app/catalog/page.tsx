'use client';

import { useEffect, useState } from 'react';
import { useCartStore, Product } from '@/store/cartStore';
import { Search, Filter, ShoppingCart, Info } from 'lucide-react';
import Image from 'next/image';

export default function Catalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [maxPrice, setMaxPrice] = useState<number>(100);
  const addItem = useCartStore(state => state.addItem);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setUserRole(JSON.parse(userStr).role);
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/products`)
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        if (data.length > 0) {
          setMaxPrice(Math.max(...data.map((p: Product) => p.price)) + 10);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) && p.price <= maxPrice
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Product Catalog</h1>
        <p className="mt-2 text-gray-600">Browse and order from top HoReCa suppliers.</p>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-4 min-w-[300px]">
          <Filter className="h-5 w-5 text-gray-400" />
          <span className="text-sm text-gray-700 whitespace-nowrap">Max Price: ${maxPrice}</span>
          <input
            type="range"
            min="0"
            max={Math.max(...products.map(p => p.price), 100) + 10}
            step="1"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="text-center py-20">Loading products...</div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-20 text-gray-500 bg-white rounded-xl border border-dashed">No products found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-2xl shadow-sm border overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col">
              <div className="h-48 bg-gray-100 relative w-full overflow-hidden group">
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
                )}
                {product.stock === 0 && (
                  <div className="absolute inset-0 bg-white/70 flex items-center justify-center backdrop-blur-sm">
                    <span className="bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded border border-red-200">Out of Stock</span>
                  </div>
                )}
              </div>
              <div className="p-5 flex-grow flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{product.name}</h3>
                  <span className="text-lg font-extrabold text-primary-600">${product.price.toFixed(2)}</span>
                </div>
                <p className="text-sm text-gray-500 mb-4 line-clamp-2 flex-grow">{product.description}</p>
                
                <div className="space-y-4 mt-auto">
                  <div className="flex justify-between text-xs text-gray-500 bg-gray-50 p-2 rounded-md border">
                    <span>By: <span className="font-semibold text-gray-700">{product.supplier.name}</span></span>
                    <span>Stock: {product.stock}</span>
                  </div>
                  
                  {userRole !== 'SUPPLIER' && (
                    <button
                      onClick={() => addItem(product, 1)}
                      disabled={product.stock === 0}
                      className="w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
