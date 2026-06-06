'use server';

import { supabase } from '@/app/lib/supabase';
import { getDeliveryFee } from './deliveryFee';

interface SelectedOptionInput {
  questionId: string;
  questionLabel: string;
  optionId: string;
  optionLabel: string;
  optionPrice: number;
}

interface CartItemInput {
  productId: string;
  storeId: string;
  storeName: string;
  name: string;
  price: number | null;
  quantity: number;
  selectedOptions: SelectedOptionInput[];
  totalItemPrice: number;
  cartKey: string;
}

interface LocationInput {
  address: string;
  lat: number;
  lng: number;
}

interface PlaceOrderResult {
  success: boolean;
  orderId?: string;
  error?: string;
}

export async function placeOrder(
  items: CartItemInput[],
  location: LocationInput,
  customerName: string,
  clientUserId?: string
): Promise<PlaceOrderResult> {
  try {
    if (!items.length) {
      return { success: false, error: 'Cart is empty' };
    }

    if (!location.address) {
      return { success: false, error: 'Delivery address is required' };
    }

    if (!customerName) {
      return { success: false, error: 'Customer name is required' };
    }

    // Get the authenticated user (works for SMS/cookie auth, may fail for WhatsApp localStorage-only auth)
    const { data: userData } = await supabase.auth.getUser();
    const serverUserId = userData?.user?.id;

    // Fall back to client-provided userId if server can't read the session (WhatsApp flow)
    const userId = serverUserId || clientUserId;
    const userPhone = userData?.user?.phone;

    if (!userId) {
      console.error('User not authenticated: no server or client userId');
      return { success: false, error: 'You must verify your phone number before placing an order' };
    }

    const totalPrice = items.reduce(
      (sum, item) => sum + item.totalItemPrice * item.quantity,
      0
    );

    // Transform cart items to the jsonb format expected by create_order_with_items RPC
    const rpcItems = items.map((item) => ({
      product_id: item.productId,
      store_id: item.storeId,
      quantity: item.quantity,
      unit_price: item.totalItemPrice,
      selected_options:
        item.selectedOptions && item.selectedOptions.length > 0
          ? item.selectedOptions.map((opt) => ({
              question: opt.questionLabel,
              label: opt.optionLabel,
              price: opt.optionPrice,
            }))
          : [],
      item_type: 'product',
    }));

    // Build store notes so each store_order gets the customer name + phone
    const uniqueStoreIds = [...new Set(items.map((item) => item.storeId))];
    const storeNotes = uniqueStoreIds.map((storeId) => ({
      store_id: storeId,
      notes: `Customer: ${customerName} | Phone: ${userPhone || '(authenticated user)'}`,
    }));

    // Calculate delivery fee based on user location, stores, and config
    const storeIds = [...new Set(items.map((item) => item.storeId))];
    const { fee: deliveryFee } = await getDeliveryFee(
      location.lat,
      location.lng,
      storeIds,
      userId
    );

    // Call the database function that creates orders, order_items, and store_orders atomically
    const { data, error } = await supabase.rpc('create_order_with_items', {
      p_user_id: userId,
      p_total_price: totalPrice,
      p_delivery_fee: deliveryFee,
      p_delivery_lat: location.lat,
      p_delivery_lng: location.lng,
      p_delivery_address: location.address,
      p_items: rpcItems as unknown as Record<string, unknown>[],
      p_store_notes: storeNotes as unknown as Record<string, unknown>[],
    });

    if (error) {
      console.error('create_order_with_items RPC failed:', error);
      return { success: false, error: 'Failed to create order' };
    }

    // The function returns TABLE(v_order_id uuid) — data is an array like [{v_order_id: 'uuid'}]
    const orderId =
      Array.isArray(data) && data.length > 0
        ? (data[0] as Record<string, unknown>)?.v_order_id as string
        : undefined;

    return { success: true, orderId: orderId || '' };
  } catch (error) {
    console.error('Place order error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}