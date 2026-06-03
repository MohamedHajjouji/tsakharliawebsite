'use client';

import { useState } from 'react';
import { getPublicImageUrl } from '@/app/lib/supabase';
import AddToCartButton from './AddToCartButton';
import { CartProvider, useCart } from './CartContext';
import CartDrawer from './CartDrawer';
import FloatingCartButton from './FloatingCartButton';
import ProductModal, { ProductOption } from './ProductModal';

interface Product {
  id: string;
  name: string;
  price: number | null;
  image: string | null;
  category: string | null;
}

interface ProductListClientProps {
  products: Product[];
  storeId: string;
  storeName: string;
  categoryName: string;
  storeNameSlug: string;
  resolvedCategory: string;
  /** Product options keyed by productId */
  productOptionsMap: Record<string, ProductOption[]>;
}

export default function ProductListClient({
  products,
  storeId,
  storeName,
  categoryName,
  storeNameSlug,
  resolvedCategory,
  productOptionsMap,
}: ProductListClientProps) {
  const [modalProduct, setModalProduct] = useState<Product | null>(null);

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
              {/* Back to Categories */}
              <a
                href={`/menu/${storeNameSlug}`}
                className="flex items-center justify-center w-10 h-10 rounded-xl transition-colors hover:bg-gray-100 flex-shrink-0"
                aria-label="Back to categories"
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
              </a>

              {/* Breadcrumb */}
              <div className="min-w-0 flex-1">
                <h1 className="text-lg font-bold truncate">
                  {resolvedCategory}
                </h1>
                <p className="text-xs text-gray-400 truncate">{storeName}</p>
              </div>

              {/* Product count */}
              <span className="text-xs font-semibold text-gray-400 flex-shrink-0">
                {products.length} {products.length === 1 ? 'item' : 'items'}
              </span>

              {/* Cart Toggle Button */}
              <CartHeaderButton />
            </div>
          </div>
        </header>

        {/* Product List */}
        <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full pb-24">
          {products.length === 0 ? (
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
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                No products yet
              </h2>
              <p className="text-gray-500">
                This category is empty. Check back soon!
              </p>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center gap-3 sm:gap-4 bg-white rounded-2xl border border-gray-100 p-3 sm:p-4 transition-all hover:shadow-md hover:border-gray-200"
                >
                  {/* Product Image */}
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                    {product.image ? (
                      <img
                        src={getPublicImageUrl(product.image) ?? ''}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg
                          className="w-10 h-10 text-gray-300"
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

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 text-sm sm:text-base leading-tight line-clamp-2">
                      {product.name}
                    </h3>
                    {product.category && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        {product.category}
                      </p>
                    )}
                  </div>

                  {/* Price & Add to Cart */}
                  <div className="flex-shrink-0 text-right flex flex-col items-end gap-2">
                    {product.price !== null && product.price !== undefined ? (
                      <p className="text-lg sm:text-xl font-black text-gray-900">
                        {Number(product.price).toFixed(2)}{' '}
                        <span className="text-xs font-bold text-gray-400">
                          MAD
                        </span>
                      </p>
                    ) : (
                      <p className="text-sm text-gray-400 font-medium">
                        Price TBD
                      </p>
                    )}
                    <AddToCartButton
                      productId={product.id}
                      storeId={storeId}
                      storeName={storeName}
                      name={product.name}
                      price={product.price}
                      image={product.image}
                      onClick={() => setModalProduct(product)}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>

        {/* Floating Cart Button */}
        <FloatingCartButton />

        <CartDrawer />

        {/* Product Modal */}
        {modalProduct && (
          <ProductModal
            product={modalProduct}
            options={productOptionsMap[modalProduct.id] || []}
            storeId={storeId}
            storeName={storeName}
            onClose={() => setModalProduct(null)}
          />
        )}
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