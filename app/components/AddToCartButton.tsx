'use client';

import { useCart } from './CartContext';

interface AddToCartButtonProps {
  productId: string;
  storeId: string;
  storeName: string;
  name: string;
  price: number | null;
  image: string | null;
  onClick: () => void;
  viewOnly?: boolean;
}

export default function AddToCartButton({
  productId,
  storeId,
  storeName,
  name,
  price,
  image,
  onClick,
  viewOnly = false,
}: AddToCartButtonProps) {
  const { state } = useCart();

  // Count all cart items for this product (any variant)
  const inCartItems = state.items.filter((item) => item.productId === productId);
  const quantity = inCartItems.reduce((sum, item) => sum + item.quantity, 0);

  // View-only mode: show a "View" button
  if (viewOnly) {
    return (
      <button
        onClick={onClick}
        className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer touch-manipulation bg-white border border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
        <span>View</span>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`flex items-center bg-green-800  justify-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer touch-manipulation add-to-cart-btn ${
        quantity > 0 ? 'min-w-[80px] add-to-cart-btn--in-cart' : 'add-to-cart-btn--add'
      }`}
    >
      {quantity > 0 ? (
        <>
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span>{quantity}</span>
        </>
      ) : (
        <>
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          <span>Add</span>
        </>
      )}
    </button>
  );
}
