'use client';

import { useState, useMemo } from 'react';
import { getPublicImageUrl } from '@/app/lib/supabase';
import { SelectedOption, useCart } from './CartContext';

export interface ProductOption {
  questionId: string;
  questionLabel: string;
  required: boolean;
  multiple: boolean;
  options: {
    id: string;
    label: string;
    price: number | null;
  }[];
}

interface ProductModalProps {
  product: {
    id: string;
    name: string;
    price: number | null;
    image: string | null;
    category: string | null;
  };
  options: ProductOption[];
  storeId: string;
  storeName: string;
  onClose: () => void;
}

export default function ProductModal({
  product,
  options,
  storeId,
  storeName,
  onClose,
}: ProductModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string[]>>({});
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const { addItem, state } = useCart();

  const handleSingleSelect = (questionId: string, optionId: string) => {
    setSelectedOptions((prev) => ({ ...prev, [questionId]: [optionId] }));
    setValidationErrors([]);
  };

  const handleMultiToggle = (questionId: string, optionId: string) => {
    setSelectedOptions((prev) => {
      const current = prev[questionId] || [];
      const next = current.includes(optionId)
        ? current.filter((id) => id !== optionId)
        : [...current, optionId];
      return { ...prev, [questionId]: next };
    });
    setValidationErrors([]);
  };

  const { selectedOptionsArray, totalItemPrice } = useMemo(() => {
    const selected: SelectedOption[] = [];
    options.forEach((opt) => {
      const selectedIds = selectedOptions[opt.questionId] || [];
      selectedIds.forEach((optionId) => {
        const o = opt.options.find((x) => x.id === optionId);
        if (o) {
          selected.push({
            questionId: opt.questionId,
            questionLabel: opt.questionLabel,
            optionId: o.id,
            optionLabel: o.label,
            optionPrice: o.price ?? 0,
          });
        }
      });
    });
    const basePrice = product.price ?? 0;
    const optionsPrice = selected.reduce((sum, s) => sum + s.optionPrice, 0);
    return { selectedOptionsArray: selected, totalItemPrice: (basePrice + optionsPrice) * quantity };
  }, [selectedOptions, options, product.price, quantity]);

  const handleAddToCart = () => {
    const errors: string[] = [];
    options.forEach((opt) => {
      if (opt.required) {
        const selected = selectedOptions[opt.questionId];
        if (!selected || selected.length === 0) {
          errors.push(`"${opt.questionLabel}" is required`);
        }
      }
    });

    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    const cartKey =
      selectedOptionsArray.length > 0
        ? `${product.id}__${[...selectedOptionsArray]
            .sort((a, b) => a.optionId.localeCompare(b.optionId))
            .map((o) => o.optionId)
            .join('_')}`
        : product.id;

    addItem({
      productId: product.id,
      storeId,
      storeName,
      name: product.name,
      price: product.price,
      image: product.image,
      selectedOptions: selectedOptionsArray,
      totalItemPrice: totalItemPrice / quantity,
      cartKey,
    });

    onClose();
  };

  // Determine if all required options are met
  const canAdd = options.every((opt) => {
    if (!opt.required) return true;
    const sel = selectedOptions[opt.questionId];
    return sel && sel.length > 0;
  });

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
        style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
        onClick={onClose}
      >
        {/* Modal */}
        <div
          className="bg-white w-full sm:max-w-lg max-h-[85vh] sm:rounded-2xl overflow-y-auto shadow-2xl animate-slide-up"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header with image */}
          <div className="relative">
            <div className="w-full h-48 sm:h-56 bg-gray-100 flex items-center justify-center overflow-hidden">
              {product.image ? (
                <img
                  src={getPublicImageUrl(product.image) ?? ''}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <svg
                  className="w-16 h-16 text-gray-300"
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
              )}
            </div>
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md transition-colors hover:bg-white cursor-pointer"
            >
              <svg
                className="w-5 h-5 text-gray-700"
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
          <div className="px-5 py-4 space-y-4">
            {/* Product Name & Price */}
            <div>
              <h2 className="text-xl font-extrabold text-gray-900">{product.name}</h2>
              {product.price !== null && product.price !== undefined ? (
                <p className="text-2xl font-black text-gray-900 mt-1">
                  {Number(product.price).toFixed(2)}{' '}
                  <span className="text-sm font-bold text-gray-400">MAD</span>
                </p>
              ) : (
                <p className="text-sm text-gray-400 font-medium mt-1">Price TBD</p>
              )}
            </div>

            {/* Options */}
            {options.length > 0 && (
              <div className="space-y-4 border-t border-gray-100 pt-4">
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  Customize
                </p>
                {options.map((opt) => (
                  <div key={opt.questionId} className="space-y-2">
                    <h4 className="text-sm font-bold text-gray-800">
                      {opt.questionLabel}
                      {opt.required && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                      {opt.multiple && (
                        <span className="text-xs text-gray-400 ml-2">(choose all that apply)</span>
                      )}
                    </h4>
                    <div className="space-y-1.5">
                      {opt.options.map((o) => {
                        const isSelected = (selectedOptions[opt.questionId] || []).includes(
                          o.id
                        );
                        return (
                          <label
                            key={o.id}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border cursor-pointer transition-all ${
                              isSelected
                                ? 'border-red-300 bg-red-50/50'
                                : 'border-gray-200 bg-white hover:border-gray-300'
                            }`}
                          >
                            <input
                              type={opt.multiple ? 'checkbox' : 'radio'}
                              name={opt.questionId}
                              checked={isSelected}
                              onChange={() =>
                                opt.multiple
                                  ? handleMultiToggle(opt.questionId, o.id)
                                  : handleSingleSelect(opt.questionId, o.id)
                              }
                              className="w-4 h-4 accent-[#D02828] shrink-0"
                            />
                            <span className="flex-1 text-sm font-medium text-gray-700">
                              {o.label}
                            </span>
                            {o.price !== null && o.price > 0 && (
                              <span className="text-xs font-bold text-gray-500">
                                +{Number(o.price).toFixed(2)} MAD
                              </span>
                            )}
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Validation Errors */}
            {validationErrors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 space-y-1">
                {validationErrors.map((err, i) => (
                  <p key={i} className="text-sm font-medium text-red-700">
                    {err}
                  </p>
                ))}
              </div>
            )}

            {/* Quantity & Total */}
            <div className="border-t border-gray-100 pt-4 space-y-3">
              {/* Quantity */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">Quantity</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:border-red-400 hover:text-red-500 transition-colors cursor-pointer"
                    disabled={quantity <= 1}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <span className="w-10 text-center font-bold text-gray-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:border-red-400 hover:text-red-500 transition-colors cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Total */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <span className="text-sm font-bold text-gray-900">Total</span>
                <span className="text-xl font-black text-gray-900">
                  {totalItemPrice.toFixed(2)}{' '}
                  <span className="text-xs font-bold text-gray-400">MAD</span>
                </span>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={!canAdd}
              className="w-full py-3.5 rounded-xl text-white font-bold text-sm transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#D02828' }}
              onMouseEnter={(e) => {
                if (canAdd) {
                  e.currentTarget.style.backgroundColor = '#B91C1C';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(208, 40, 40, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#D02828';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {canAdd ? `Add to Cart — ${totalItemPrice.toFixed(2)} MAD` : 'Select Required Options'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}