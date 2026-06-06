'use server';

import { supabase } from '@/app/lib/supabase';

interface DeliveryFeeConfig {
  base_fee: number;
  additional_store_fee: number;
  long_distance_threshold_km: number;
  long_distance_fee: number;
  long_distance_threshold_2_km: number;
  long_distance_fee_2: number;
  first_order_free_enabled: boolean;
  late_night_multiplier: number;
  late_night_start_hour: number;
}

interface DeliveryFeeResult {
  fee: number;
  breakdown: {
    distanceFee: number;
    multiStoreFee: number;
    lateNightFee: number;
    firstOrderFree: boolean;
    farthestStoreDistance: number;
  };
}

function haversineDistance(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export async function getDeliveryFee(
  userLat: number,
  userLng: number,
  storeIds: string[],
  userId: string
): Promise<DeliveryFeeResult> {
  // Fetch delivery fee config
  const { data: config, error: configError } = await supabase
    .from('delivery_fee_config')
    .select('*')
    .eq('id', 1)
    .single();

  if (configError || !config) {
    console.error('Failed to fetch delivery_fee_config:', configError);
    return {
      fee: 0,
      breakdown: { distanceFee: 0, multiStoreFee: 0, lateNightFee: 0, firstOrderFree: false, farthestStoreDistance: 0 },
    };
  }

  const cfg = config as DeliveryFeeConfig;

  // Fetch store locations
  const { data: stores, error: storesError } = await supabase
    .from('stores')
    .select('id, location_lat, location_lng')
    .in('id', storeIds);

  if (storesError || !stores) {
    console.error('Failed to fetch store locations:', storesError);
    return {
      fee: 0,
      breakdown: { distanceFee: 0, multiStoreFee: 0, lateNightFee: 0, firstOrderFree: false, farthestStoreDistance: 0 },
    };
  }

  // Find distance to farthest store
  let farthestDistance = 0;
  for (const store of stores) {
    if (store.location_lat != null && store.location_lng != null) {
      const distance = haversineDistance(
        userLat, userLng,
        store.location_lat, store.location_lng
      );
      if (distance > farthestDistance) {
        farthestDistance = distance;
      }
    }
  }

  // Determine distance-based fee
  let distanceFee = cfg.base_fee;
  if (farthestDistance > cfg.long_distance_threshold_2_km) {
    distanceFee = cfg.long_distance_fee_2;
  } else if (farthestDistance > cfg.long_distance_threshold_km) {
    distanceFee = cfg.long_distance_fee;
  }

  // Multi-store surcharge (extra stores beyond the first)
  const numStores = new Set(storeIds).size;
  const multiStoreFee = numStores > 1 ? cfg.additional_store_fee * (numStores - 1) : 0;

  let totalFee = distanceFee + multiStoreFee;

  // First order free check
  let firstOrderFree = false;
  if (cfg.first_order_free_enabled) {
    const { count } = await supabase
      .from('orders')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (count === 0) {
      firstOrderFree = true;
      totalFee = 0;
    }
  }

  // Late night surcharge (after late_night_start_hour)
  let lateNightFee = 0;
  const currentHour = new Date().getHours();
  if (currentHour >= cfg.late_night_start_hour) {
    lateNightFee = totalFee * cfg.late_night_multiplier;
    totalFee += lateNightFee;
  }

  return {
    fee: Math.round(totalFee * 100) / 100,
    breakdown: {
      distanceFee,
      multiStoreFee,
      lateNightFee: Math.round(lateNightFee * 100) / 100,
      firstOrderFree,
      farthestStoreDistance: Math.round(farthestDistance * 100) / 100,
    },
  };
}