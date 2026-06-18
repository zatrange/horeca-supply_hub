'use client';

import { useCartStore } from '@/store/cartStore';
import { Minus, Plus, Trash2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import api from '@/lib/axios';

export default function Cart() {
  const { items, updateQuantity, removeItem, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const total = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const handlePlaceOrder = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const res = await api.post('/orders', {
        items: items.map(item => ({
          productId: item.product.id,
          quantity: item.quantity
        }))
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      clearCart();
      router.push('/orders');
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-dashed">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Looks like you haven't added any products to your cart yet.</p>
        <Link href="/catalog" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700">
          Browse Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Your Cart</h1>
        <p className="mt-2 text-gray-600">Review your items before placing the order.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-grow space-y-4">
          {items.map((item) => (
            <div key={item.product.id} className="bg-white p-4 rounded-xl shadow-sm border flex items-center gap-4">
              <div className="h-24 w-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                {item.product.imageUrl ? (
                  <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Image</div>
                )}
              </div>
              
              <div className="flex-grow">
                <div className="flex justify-between">
                  <h3 className="text-lg font-bold text-gray-900">{item.product.name}</h3>
                  <button onClick={() => removeItem(item.product.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
                <p className="text-sm text-gray-500 mb-2">By: {item.product.supplier.name}</p>
                <div className="flex justify-between items-end">
                  <div className="text-lg font-bold text-primary-600">${item.product.price.toFixed(2)}</div>
                  
                  <div className="flex items-center border rounded-lg bg-gray-50">
                    <button 
                      onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                      className="p-2 text-gray-600 hover:text-primary-600"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="px-4 font-medium text-gray-900 w-12 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.product.id, Math.min(item.product.stock, item.quantity + 1))}
                      className="p-2 text-gray-600 hover:text-primary-600"
                      disabled={item.quantity >= item.product.stock}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="w-full lg:w-96">
          <div className="bg-white p-6 rounded-2xl shadow-sm border sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({items.length} items)</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>Calculated by supplier</span>
              </div>
              <div className="pt-4 border-t flex justify-between">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-2xl font-extrabold text-primary-600">${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Processing...' : 'Place Order'}
              {!loading && <ArrowRight className="ml-2 h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
