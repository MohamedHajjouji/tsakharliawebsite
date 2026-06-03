'use client';

import { useCart } from './CartContext';

export default function FloatingCartButton() {
  const { totalItems, subtotal, openCart } = useCart();

  if (totalItems === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
      <button
        onClick={openCart}
        className="flex items-center gap-3 px-6 py-3.5 rounded-2xl shadow-2xl text-white font-bold text-sm transition-all duration-200 cursor-pointer animate-breathe"
        style={{
          backgroundColor: '#D02828',
          boxShadow: '0 8px 32px rgba(208, 40, 40, 0.45)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#B91C1C';
          e.currentTarget.style.transform = 'scale(1.04)';
          e.currentTarget.style.boxShadow = '0 10px 40px rgba(208, 40, 40, 0.55)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#D02828';
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 8px 32px rgba(208, 40, 40, 0.45)';
        }}
      >
        {/* Cart Icon */}
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

        <span>
          View Cart • {totalItems} {totalItems === 1 ? 'item' : 'items'}
        </span>

        <span className="pl-2 border-l border-white/30">
          {subtotal.toFixed(2)} MAD
        </span>
      </button>
    </div>
  );
}