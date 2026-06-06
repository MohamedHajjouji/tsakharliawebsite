'use client';

import { useState, useEffect } from 'react';
import { useCart, CartItem, SelectedOption } from './CartContext';
import { getPublicImageUrl, supabase } from '@/app/lib/supabase';
import LocationPicker from './LocationPicker';
import PhoneVerification from './PhoneVerification';
import { placeOrder } from '@/app/actions/placeOrder';
import { getDeliveryFee } from '@/app/actions/deliveryFee';

export default function CartDrawer() {
  const {
    state,
    removeItem,
    updateQuantity,
    clearCart,
    clearItems,
    closeCart,
    totalItems,
    subtotal,
    groupedByStore,
    setCheckoutStep,
    setCustomerName,
    setVerifiedUserId,
  } = useCart();

  const [orderStatus, setOrderStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [deliveryFee, setDeliveryFee] = useState<number | null>(null);
  const [deliveryFeeBreakdown, setDeliveryFeeBreakdown] = useState<{
    distanceFee: number;
    multiStoreFee: number;
    lateNightFee: number;
    firstOrderFree: boolean;
    farthestStoreDistance: number;
  } | null>(null);
  const [isCalculatingFee, setIsCalculatingFee] = useState(false);

  // Customer Info form state (Step 1)
  const [name, setName] = useState('');
  const [infoError, setInfoError] = useState('');

  const [isCheckingAuth, setIsCheckingAuth] = useState(false);

  const handleProceedToCheckout = async () => {
    setIsCheckingAuth(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id;
      if (userId) {
        // Already verified — store userId and skip verification
        setVerifiedUserId(userId);
        if (state.customerName) {
          // Has name from previous session — skip info too
          setCheckoutStep('location');
        } else {
          setCheckoutStep('info');
        }
      } else {
        setCheckoutStep('info');
      }
    } catch {
      setCheckoutStep('info');
    }
    setIsCheckingAuth(false);
  };

  const handleContinueToVerification = () => {
    setInfoError('');
    if (!name.trim()) {
      setInfoError('Please enter your full name');
      return;
    }
    setCustomerName(name.trim());

    // If the user was already authenticated, skip verification
    if (state.verifiedUserId) {
      setCheckoutStep('location');
    } else {
      setCheckoutStep('verification');
    }
  };

  const handleVerified = (_phone: string, userId: string) => {
    setVerifiedUserId(userId);
    setCheckoutStep('location');
  };

  const handleLocationChange = async (lat: number, lng: number) => {
    if (isCalculatingFee) return;
    setIsCalculatingFee(true);

    const storeIds = [...new Set(state.items.map((item) => item.storeId))];
    const userId = state.verifiedUserId;

    try {
      const result = await getDeliveryFee(lat, lng, storeIds, userId);
      setDeliveryFee(result.fee);
      setDeliveryFeeBreakdown(result.breakdown);
    } catch {
      setDeliveryFee(null);
      setDeliveryFeeBreakdown(null);
    }
    setIsCalculatingFee(false);
  };

  const handlePlaceOrder = async (location: {
    address: string;
    lat: number;
    lng: number;
  }) => {
    setOrderStatus('submitting');
    setErrorMessage('');

    const result = await placeOrder(state.items, location, state.customerName, state.verifiedUserId);

    if (result.success) {
      setOrderStatus('success');
      clearItems();
    } else {
      setOrderStatus('error');
      setErrorMessage(result.error || 'Failed to place order');
    }
  };

  const handleClose = () => {
    setOrderStatus('idle');
    setErrorMessage('');
    setInfoError('');
    closeCart();
  };

  return (
    <>
      {/* Backdrop */}
      {state.isOpen && (
        <div
          className="fixed inset-0 z-50 transition-opacity duration-300"
          style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
          onClick={handleClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full z-50 w-full sm:w-[420px] flex flex-col shadow-2xl transition-transform duration-300 ease-out ${
          state.isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ backgroundColor: '#FFFFFF' }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4 border-b"
          style={{ borderColor: '#F3F4F6' }}
        >
          <div>
            <h2 className="text-lg font-extrabold" style={{ color: '#1A1A1A' }}>
              {state.checkoutStep === 'cart' && 'Your Cart'}
              {state.checkoutStep === 'info' && 'Your Details'}
              {state.checkoutStep === 'verification' && 'Verify Phone'}
              {state.checkoutStep === 'location' && 'Delivery Location'}
            </h2>
            <p className="text-xs" style={{ color: '#9CA3AF' }}>
              {state.checkoutStep === 'cart' && `${totalItems} ${totalItems === 1 ? 'item' : 'items'}`}
              {state.checkoutStep === 'info' && 'Step 1 of 3'}
              {state.checkoutStep === 'verification' && 'Step 2 of 3'}
              {state.checkoutStep === 'location' && 'Step 3 of 3'}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors cursor-pointer"
            style={{ color: '#6B7280' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#F3F4F6';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        {state.items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
            {orderStatus === 'success' ? (
              <div className="w-full max-w-xs">
                <div
                  className="w-20 h-20 rounded-3xl flex items-center justify-center mb-5 mx-auto"
                  style={{ backgroundColor: '#ECFDF5' }}
                >
                  <svg
                    className="w-10 h-10"
                    style={{ color: '#059669' }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3
                  className="text-xl font-extrabold mb-2"
                  style={{ color: '#1A1A1A' }}
                >
                  Order Placed!
                </h3>
                <p style={{ color: '#6B7280' }} className="text-sm leading-relaxed mb-6">
                  Your order has been received and is being processed. Thank you!
                </p>

                {/* Download App CTA */}
                <div
                  className="rounded-2xl p-5 mb-4"
                  style={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB' }}
                >
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <svg className="w-5 h-5" style={{ color: '#D02828' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span className="text-sm font-bold" style={{ color: '#1A1A1A' }}>
                      Track Your Order
                    </span>
                  </div>
                  <p style={{ color: '#6B7280' }} className="text-xs leading-relaxed mb-4">
                    Download the Tsakhar Lia app to track your order in real time and get delivery updates.
                  </p>
                  <a
                    href="/download"
                    className="block w-full py-3 rounded-xl text-white font-bold text-sm text-center transition-all duration-200 cursor-pointer"
                    style={{ backgroundColor: '#D02828' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#B91C1C';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                      e.currentTarget.style.boxShadow = '0 4px 16px rgba(208, 40, 40, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#D02828';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    Download the App
                  </a>
                </div>

                <button
                  onClick={handleClose}
                  className="w-full py-2.5 text-xs font-semibold transition-colors cursor-pointer"
                  style={{ color: '#9CA3AF' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#6B7280';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#9CA3AF';
                  }}
                >
                  Browse Menu
                </button>
              </div>
            ) : (
              <>
                <div
                  className="w-20 h-20 rounded-3xl flex items-center justify-center mb-5"
                  style={{ backgroundColor: '#F3F4F6' }}
                >
                  <svg
                    className="w-10 h-10"
                    style={{ color: '#D1D5DB' }}
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
                <h3
                  className="text-xl font-extrabold mb-2"
                  style={{ color: '#1A1A1A' }}
                >
                  Your cart is empty
                </h3>
                <p style={{ color: '#6B7280' }} className="text-sm leading-relaxed">
                  Browse the menu and add items to get started.
                </p>
                <button
                  onClick={handleClose}
                  className="mt-6 px-8 py-3 rounded-xl text-white font-bold text-sm transition-all cursor-pointer"
                  style={{ backgroundColor: '#D02828' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#B91C1C';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#D02828';
                  }}
                >
                  Browse Menu
                </button>
              </>
            )}
          </div>
        ) : state.checkoutStep === 'info' ? (
          /* Step 1: Customer Info (Full Name) */
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
              <p className="text-sm text-gray-500">
                Please enter your full name to continue with your order.
              </p>

              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: '#374151' }}>
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full px-4 py-3 rounded-xl border text-sm transition-all outline-none"
                  style={{
                    backgroundColor: '#F9FAFB',
                    borderColor: infoError ? '#EF4444' : '#E5E7EB',
                    color: '#1A1A1A',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#D02828';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(208,40,40,0.08)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = infoError ? '#EF4444' : '#E5E7EB';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
              </div>

              {infoError && (
                <div className="px-4 py-3 rounded-xl text-sm font-medium" style={{ backgroundColor: '#FEF2F2', color: '#991B1B' }}>
                  {infoError}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-5 py-4 border-t space-y-3" style={{ borderColor: '#F3F4F6' }}>
              <button
                onClick={handleContinueToVerification}
                className="w-full py-3.5 rounded-xl text-white font-bold text-sm transition-all duration-200 cursor-pointer"
                style={{ backgroundColor: '#D02828' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#B91C1C';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(208, 40, 40, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#D02828';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Continue to Verification
              </button>
              <button
                onClick={() => setCheckoutStep('cart')}
                className="w-full py-2.5 text-xs font-semibold transition-colors cursor-pointer"
                style={{ color: '#9CA3AF' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#6B7280';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#9CA3AF';
                }}
              >
                Back to Cart
              </button>
            </div>
          </div>
        ) : state.checkoutStep === 'verification' ? (
          /* Step 2: Phone Verification */
          <PhoneVerification
            fullName={state.customerName}
            onVerified={handleVerified}
            onCancel={() => setCheckoutStep('info')}
          />
        ) : state.checkoutStep === 'location' ? (
          /* Step 3: Location Picker */
          <div className="flex-1 overflow-y-auto">
            {/* Order Summary */}
            <div className="px-5 py-4 border-b" style={{ borderColor: '#F3F4F6' }}>
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-semibold" style={{ color: '#1A1A1A' }}>
                  Order Summary
                </span>
                <span className="text-sm font-bold" style={{ color: '#D02828' }}>
                  {totalItems} {totalItems === 1 ? 'item' : 'items'}
                </span>
              </div>
              <div className="space-y-1">
                {state.items.map((item) => (
                  <div
                    key={item.cartKey}
                    className="flex justify-between text-sm"
                  >
                    <span style={{ color: '#6B7280' }}>
                      {item.quantity}× {item.name}
                    </span>
                    <span className="font-medium" style={{ color: '#1A1A1A' }}>
                      {(item.totalItemPrice * item.quantity).toFixed(2)} MAD
                    </span>
                  </div>
                ))}
              </div>
              {/* Delivery Fee */}
              {deliveryFee !== null && (
                <div
                  className="flex justify-between items-center mt-2 pt-2 border-t text-sm"
                  style={{ borderColor: '#F3F4F6' }}
                >
                  <span style={{ color: '#6B7280' }}>Delivery Fee</span>
                  {deliveryFeeBreakdown?.firstOrderFree ? (
                    <span className="font-bold" style={{ color: '#059669' }}>FREE (First Order)</span>
                  ) : (
                    <span className="font-medium" style={{ color: '#1A1A1A' }}>
                      {deliveryFee.toFixed(2)} MAD
                    </span>
                  )}
                </div>
              )}
              {isCalculatingFee && (
                <div
                  className="flex justify-between items-center mt-2 pt-2 border-t text-sm"
                  style={{ borderColor: '#F3F4F6' }}
                >
                  <span style={{ color: '#9CA3AF' }}>Calculating delivery...</span>
                  <span style={{ color: '#9CA3AF' }}>—</span>
                </div>
              )}
              <div
                className="flex justify-between items-center mt-3 pt-3 border-t font-bold"
                style={{ borderColor: '#F3F4F6', color: '#1A1A1A' }}
              >
                <span>Total</span>
                <span className="text-lg">
                  {(subtotal + (deliveryFee ?? 0)).toFixed(2)} MAD
                </span>
              </div>
            </div>

            <LocationPicker
              onConfirm={handlePlaceOrder}
              onLocationChange={handleLocationChange}
              onCancel={() => setCheckoutStep('verification')}
            />

            {orderStatus === 'error' && (
              <div className="px-5 pb-4">
                <div
                  className="px-4 py-3 rounded-xl text-sm font-medium"
                  style={{ backgroundColor: '#FEF2F2', color: '#991B1B' }}
                >
                  {errorMessage}
                </div>
              </div>
            )}

            {orderStatus === 'submitting' && (
              <div className="px-5 pb-4 text-center">
                <div
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium"
                  style={{ backgroundColor: '#FEF2F2', color: '#D02828' }}
                >
                  <svg
                    className="animate-spin w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Placing your order...
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Cart Items View */
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
              {Object.entries(groupedByStore).map(([storeName, items]) => (
                <div key={storeName}>
                  <h3
                    className="text-xs font-bold uppercase tracking-wider mb-3"
                    style={{ color: '#9CA3AF' }}
                  >
                    {storeName}
                  </h3>
                  <div className="space-y-3">
                    {items.map((item) => (
                      <CartLineItem
                        key={item.cartKey}
                        item={item}
                        onRemove={() => removeItem(item.cartKey)}
                        onUpdateQuantity={(qty) => updateQuantity(item.cartKey, qty)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div
              className="px-5 py-4 border-t space-y-3"
              style={{ borderColor: '#F3F4F6' }}
            >
              <div className="flex justify-between items-center">
                <span className="text-sm" style={{ color: '#6B7280' }}>
                  Subtotal
                </span>
                <span
                  className="text-lg font-extrabold"
                  style={{ color: '#1A1A1A' }}
                >
                  {subtotal.toFixed(2)} MAD
                </span>
              </div>

              <button
                onClick={handleProceedToCheckout}
                disabled={isCheckingAuth}
                className="w-full py-3.5 rounded-xl text-white font-bold text-sm transition-all duration-200 cursor-pointer disabled:opacity-70"
                style={{ backgroundColor: '#D02828' }}
                onMouseEnter={(e) => {
                  if (!isCheckingAuth) {
                    e.currentTarget.style.backgroundColor = '#B91C1C';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow =
                      '0 4px 16px rgba(208, 40, 40, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#D02828';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {isCheckingAuth ? (
                  <span className="inline-flex items-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Checking...
                  </span>
                ) : (
                  'Proceed to Checkout'
                )}
              </button>

              <button
                onClick={clearCart}
                className="w-full py-2.5 text-xs font-semibold transition-colors cursor-pointer"
                style={{ color: '#9CA3AF' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#EF4444';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#9CA3AF';
                }}
              >
                Clear Cart
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function CartLineItem({
  item,
  onRemove,
  onUpdateQuantity,
}: {
  item: CartItem;
  onRemove: () => void;
  onUpdateQuantity: (qty: number) => void;
}) {
  return (
    <div
      className="flex gap-3 bg-gray-50 rounded-2xl p-3"
      style={{ backgroundColor: '#F9FAFB' }}
    >
      {/* Product Image */}
      <div
        className="w-16 h-16 rounded-xl overflow-hidden bg-white flex-shrink-0 border"
        style={{ borderColor: '#F3F4F6' }}
      >
        {item.image ? (
          <img
            src={getPublicImageUrl(item.image) ?? ''}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg
              className="w-6 h-6"
              style={{ color: '#D1D5DB' }}
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
        <h4 className="text-sm font-bold truncate" style={{ color: '#1A1A1A' }}>
          {item.name}
        </h4>

        {/* Selected Options */}
        {item.selectedOptions && item.selectedOptions.length > 0 && (
          <div className="mt-0.5 space-y-0.5">
            {item.selectedOptions.map((opt, idx) => (
              <p key={idx} className="text-xs" style={{ color: '#9CA3AF' }}>
                {opt.optionLabel}
                {opt.optionPrice > 0 && ` (+${opt.optionPrice.toFixed(2)} MAD)`}
              </p>
            ))}
          </div>
        )}

        <p className="text-sm font-semibold mt-0.5" style={{ color: '#D02828' }}>
          {item.totalItemPrice.toFixed(2)} MAD
        </p>

        {/* Quantity Controls */}
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() => onUpdateQuantity(item.quantity - 1)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-all cursor-pointer"
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E5E7EB',
              color: '#374151',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#D02828';
              e.currentTarget.style.color = '#D02828';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#E5E7EB';
              e.currentTarget.style.color = '#374151';
            }}
          >
            −
          </button>
          <span className="w-8 text-center text-sm font-bold" style={{ color: '#1A1A1A' }}>
            {item.quantity}
          </span>
          <button
            onClick={() => onUpdateQuantity(item.quantity + 1)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-all cursor-pointer"
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E5E7EB',
              color: '#374151',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#D02828';
              e.currentTarget.style.color = '#D02828';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#E5E7EB';
              e.currentTarget.style.color = '#374151';
            }}
          >
            +
          </button>

          {/* Remove */}
          <button
            onClick={onRemove}
            className="ml-auto w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
            style={{ color: '#D1D5DB' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#FEF2F2';
              e.currentTarget.style.color = '#EF4444';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#D1D5DB';
            }}
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
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}