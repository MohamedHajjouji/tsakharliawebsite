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
}

export default function AddToCartButton({
  productId,
  storeId,
  storeName,
  name,
  price,
  image,
  onClick,
}: AddToCartButtonProps) {
  const { state } = useCart();

  // Count all cart items for this product (any variant)
  const inCartItems = state.items.filter((item) => item.productId === productId);
  const quantity = inCartItems.reduce((sum, item) => sum + item.quantity, 0);

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