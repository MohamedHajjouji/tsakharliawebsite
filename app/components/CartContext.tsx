'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';

export interface SelectedOption {
  questionId: string;
  questionLabel: string;
  optionId: string;
  optionLabel: string;
  optionPrice: number;
}

export interface CartItem {
  productId: string;
  storeId: string;
  storeName: string;
  name: string;
  price: number | null;
  image: string | null;
  quantity: number;
  selectedOptions: SelectedOption[];
  totalItemPrice: number;
  cartKey: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  checkoutStep: 'cart' | 'info' | 'verification' | 'location';
  customerName: string;
  verifiedUserId: string;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: { cartKey: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { cartKey: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'CLEAR_ITEMS' }
  | { type: 'TOGGLE_CART' }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' }
  | { type: 'SET_CHECKOUT_STEP'; payload: 'cart' | 'info' | 'verification' | 'location' }
  | { type: 'SET_CUSTOMER_NAME'; payload: string }
  | { type: 'SET_VERIFIED_USER_ID'; payload: string };

interface CartContextType {
  state: CartState;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (cartKey: string) => void;
  updateQuantity: (cartKey: string, quantity: number) => void;
  clearCart: () => void;
  clearItems: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  setCheckoutStep: (step: 'cart' | 'info' | 'verification' | 'location') => void;
  setCustomerName: (name: string) => void;
  setVerifiedUserId: (id: string) => void;
  totalItems: number;
  subtotal: number;
  groupedByStore: Record<string, CartItem[]>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function generateCartKey(productId: string, selectedOptions: SelectedOption[]): string {
  if (!selectedOptions || selectedOptions.length === 0) return productId;
  const sorted = [...selectedOptions].sort((a, b) => a.optionId.localeCompare(b.optionId));
  const optsHash = sorted.map((o) => o.optionId).join('_');
  return `${productId}__${optsHash}`;
}

function calculateTotalItemPrice(basePrice: number | null, selectedOptions: SelectedOption[]): number {
  const optionsPrice = selectedOptions.reduce((sum, opt) => sum + (opt.optionPrice ?? 0), 0);
  return (basePrice ?? 0) + optionsPrice;
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingIdx = state.items.findIndex(
        (item) => item.cartKey === action.payload.cartKey
      );
      if (existingIdx >= 0) {
        return {
          ...state,
          items: state.items.map((item, idx) =>
            idx === existingIdx
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          ),
          isOpen: true,
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload }],
        isOpen: true,
      };
    }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter((item) => item.cartKey !== action.payload.cartKey),
      };
    case 'UPDATE_QUANTITY':
      if (action.payload.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter((item) => item.cartKey !== action.payload.cartKey),
        };
      }
      return {
        ...state,
        items: state.items.map((item) =>
          item.cartKey === action.payload.cartKey
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    case 'CLEAR_CART':
      return { ...state, items: [], isOpen: false, checkoutStep: 'cart', customerName: '', verifiedUserId: '' };
    case 'CLEAR_ITEMS':
      return { ...state, items: [], checkoutStep: 'cart' };
    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen };
    case 'OPEN_CART':
      return { ...state, isOpen: true };
    case 'CLOSE_CART':
      return { ...state, isOpen: false, checkoutStep: 'cart' };
    case 'SET_CHECKOUT_STEP':
      return { ...state, checkoutStep: action.payload };
    case 'SET_CUSTOMER_NAME': {
      try {
        localStorage.setItem('tsakharlia-customer-name', action.payload);
      } catch { /* ignore */ }
      return { ...state, customerName: action.payload };
    }
    case 'SET_VERIFIED_USER_ID':
      return { ...state, verifiedUserId: action.payload };
    default:
      return state;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    isOpen: false,
    checkoutStep: 'cart',
    customerName: '',
    verifiedUserId: '',
  });

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('tsakharlia-cart');
      if (saved) {
        const items = JSON.parse(saved) as CartItem[];
        items.forEach((item) => {
          dispatch({
            type: 'ADD_ITEM',
            payload: {
              ...item,
              quantity: item.quantity,
              cartKey:
                item.cartKey ||
                generateCartKey(item.productId, item.selectedOptions || []),
              selectedOptions: item.selectedOptions || [],
              totalItemPrice:
                item.totalItemPrice ??
                calculateTotalItemPrice(item.price, item.selectedOptions || []),
            },
          });
        });
        // Close cart on initial load
        dispatch({ type: 'CLOSE_CART' });
      }
    } catch {
      // Ignore parse errors
    }
  }, []);

  // Restore customer name from localStorage on mount
  useEffect(() => {
    try {
      const savedName = localStorage.getItem('tsakharlia-customer-name');
      if (savedName) {
        dispatch({ type: 'SET_CUSTOMER_NAME', payload: savedName });
      }
    } catch { /* ignore */ }
  }, []);

  // Persist cart to localStorage on changes
  useEffect(() => {
    localStorage.setItem('tsakharlia-cart', JSON.stringify(state.items));
  }, [state.items]);

  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    const cartKey = item.cartKey || generateCartKey(item.productId, item.selectedOptions);
    const totalItemPrice =
      item.totalItemPrice ?? calculateTotalItemPrice(item.price, item.selectedOptions);
    dispatch({
      type: 'ADD_ITEM',
      payload: { ...item, quantity: 1, cartKey, totalItemPrice },
    });
  };

  const removeItem = (cartKey: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { cartKey } });
  };

  const updateQuantity = (cartKey: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { cartKey, quantity } });
  };

  const clearCart = () => dispatch({ type: 'CLEAR_CART' });
  const clearItems = () => dispatch({ type: 'CLEAR_ITEMS' });
  const toggleCart = () => dispatch({ type: 'TOGGLE_CART' });
  const openCart = () => dispatch({ type: 'OPEN_CART' });
  const closeCart = () => dispatch({ type: 'CLOSE_CART' });
  const setCheckoutStep = (step: 'cart' | 'info' | 'verification' | 'location') =>
    dispatch({ type: 'SET_CHECKOUT_STEP', payload: step });
  const setCustomerName = (name: string) =>
    dispatch({ type: 'SET_CUSTOMER_NAME', payload: name });
  const setVerifiedUserId = (id: string) =>
    dispatch({ type: 'SET_VERIFIED_USER_ID', payload: id });

  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = state.items.reduce(
    (sum, item) => sum + item.totalItemPrice * item.quantity,
    0
  );

  const groupedByStore = state.items.reduce<Record<string, CartItem[]>>(
    (acc, item) => {
      if (!acc[item.storeName]) acc[item.storeName] = [];
      acc[item.storeName].push(item);
      return acc;
    },
    {}
  );

  return (
    <CartContext.Provider
      value={{
        state,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        clearItems,
        toggleCart,
        openCart,
        closeCart,
        setCheckoutStep,
        setCustomerName,
        setVerifiedUserId,
        totalItems,
        subtotal,
        groupedByStore,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}