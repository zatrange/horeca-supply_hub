import Link from 'next/link';
import { ArrowRight, ChefHat, Truck, TrendingUp } from 'lucide-react';

export default function Home() {
  return (
    <div className="space-y-20">
      <section className="text-center space-y-8 pt-10">
        <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl">
          The Premier B2B Platform for <br className="hidden sm:block" />
          <span className="text-primary-600">HoReCa Supplies</span>
        </h1>
        <p className="max-w-2xl mx-auto text-xl text-gray-500">
          Connect your restaurant, hotel, or café with top-tier suppliers. Streamline your ordering process, manage inventory, and grow your business.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/catalog" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 transition-colors">
            Browse Catalog
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
          <Link href="/register" className="inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors">
            Become a Partner
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="bg-white p-8 rounded-2xl shadow-sm border text-center space-y-4 hover:shadow-md transition-shadow">
          <div className="mx-auto bg-primary-100 w-16 h-16 flex items-center justify-center rounded-full">
            <ChefHat className="h-8 w-8 text-primary-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">For Restaurants</h3>
          <p className="text-gray-500">Access thousands of fresh ingredients from verified suppliers with transparent pricing and real-time stock updates.</p>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-sm border text-center space-y-4 hover:shadow-md transition-shadow">
          <div className="mx-auto bg-accent-100 w-16 h-16 flex items-center justify-center rounded-full bg-orange-100">
            <Truck className="h-8 w-8 text-orange-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">For Suppliers</h3>
          <p className="text-gray-500">Manage your product catalog, receive instant orders, and expand your reach to new HoReCa businesses in your area.</p>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-sm border text-center space-y-4 hover:shadow-md transition-shadow">
          <div className="mx-auto bg-green-100 w-16 h-16 flex items-center justify-center rounded-full">
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Grow Together</h3>
          <p className="text-gray-500">Build long-lasting B2B relationships through a platform designed to make procurement seamless and efficient.</p>
        </div>
      </section>
    </div>
  );
}
