'use client';

import Link from 'next/link';
import { CartProvider, useCart } from './CartContext';
import CartDrawer from './CartDrawer';
import { getPublicImageUrl } from '@/app/lib/supabase';

interface Category {
  id: string;
  name: string;
  image_url: string | null;
  display_order: number | null;
}

interface StoreMenuClientProps {
  storeName: string;
  storeNameSlug: string;
  isOpen: boolean;
  opensAt: string | null;
  closesAt: string | null;
  categories: Category[];
}

export default function StoreMenuClient({
  storeName,
  storeNameSlug,
  isOpen,
  opensAt,
  closesAt,
  categories,
}: StoreMenuClientProps) {
  return (
    <CartProvider>
      <div
        className="flex flex-col min-h-screen"
        style={{ backgroundColor: '#FAFAFA', color: '#1A1A1A' }}
      >
        {/* Sticky Header */}
        <header
          className="sticky top-0 z-40 border-b border-gray-100"
          style={{ backgroundColor: 'rgba(255,255,255,0.95)' }}
        >
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center h-16 gap-3">
              {/* Back Button */}
              <Link
                href="/"
                className="flex items-center justify-center w-10 h-10 rounded-xl transition-colors hover:bg-gray-100 flex-shrink-0"
                aria-label="Go back"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
              </Link>

              {/* Store Info */}
              <div className="min-w-0 flex-1">
                <h1 className="text-lg font-bold truncate">{storeName}</h1>
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-full ${
                      isOpen
                        ? 'bg-green-50 text-green-700'
                        : 'bg-red-50 text-red-600'
                    }`}
                  >
                    <span className="relative flex h-2 w-2">
                      <span
                        className={`absolute inline-flex h-full w-full rounded-full ${
                          isOpen ? 'bg-green-500' : 'bg-red-500'
                        }`}
                      />
                    </span>
                    {isOpen ? 'Open' : 'Closed'}
                  </span>
                  {opensAt && closesAt && (
                    <span className="text-xs text-gray-400">
                      {opensAt.slice(0, 5)} – {closesAt.slice(0, 5)}
                    </span>
                  )}
                </div>
              </div>

              {/* Cart Button */}
              <CartHeaderButton />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
          {categories.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                No categories yet
              </h2>
              <p className="text-gray-500">
                This store hasn't added any categories. Check back soon!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
              {categories.map((cat) => {
                const catSlug = cat.name.toLowerCase().replace(/\s+/g, '-');
                return (
                  <Link
                    key={cat.id}
                    href={`/menu/${storeNameSlug}/${catSlug}`}
                    className="group relative bg-white rounded-2xl border border-gray-100 overflow-hidden transition-all duration-200 hover:shadow-lg hover:border-red-200 hover:-translate-y-0.5 active:scale-[0.98]"
                  >
                    {/* Category Image */}
                    <div className="aspect-square w-full overflow-hidden bg-gray-50">
                      {cat.image_url ? (
                        <img
                          src={getPublicImageUrl(cat.image_url) ?? ''}
                          alt={cat.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg
                            className="w-12 h-12 text-gray-300"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Category Info */}
                    <div className="p-3 sm:p-4">
                      <h3 className="font-bold text-sm sm:text-base text-gray-900 group-hover:text-red-600 transition-colors line-clamp-2">
                        {cat.name}
                      </h3>
                      <div className="mt-2 flex items-center text-xs font-semibold text-red-500 group-hover:gap-1 transition-all">
                        Browse
                        <svg
                          className="w-3.5 h-3.5 ml-0.5 transition-transform group-hover:translate-x-0.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </main>

        <CartDrawer />
      </div>
    </CartProvider>
  );
}

function CartHeaderButton() {
  const { totalItems, openCart } = useCart();

  return (
    <button
      onClick={openCart}
      className="relative flex items-center justify-center w-10 h-10 rounded-xl transition-colors hover:bg-gray-100 flex-shrink-0 cursor-pointer"
      aria-label={`Cart with ${totalItems} items`}
    >
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
        />
      </svg>
      {totalItems > 0 && (
        <span
          className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center text-white"
          style={{ backgroundColor: '#D02828' }}
        >
          {totalItems > 9 ? '9+' : totalItems}
        </span>
      )}
    </button>
  );
}