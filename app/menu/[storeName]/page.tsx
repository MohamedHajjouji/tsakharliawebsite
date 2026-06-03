import { notFound } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import StoreMenuClient from "@/app/components/StoreMenuClient";

type PageProps = {
  params: Promise<{ storeName: string }>;
};

async function getStoreData(storeNameSlug: string) {
  const { data: allStores } = await supabase
    .from("stores")
    .select("id, name, active, is_open, opens_at, closes_at")
    .eq("active", true);

  if (!allStores) return null;

  // Match by slug: convert store name to slug and compare
  return allStores.find(
    (s) => s.name.toLowerCase().replace(/\s+/g, '-') === storeNameSlug
  ) ?? null;
}

async function getCategories(storeId: string) {
  const { data: categories } = await supabase
    .from("product_categories")
    .select("id, name, image_url, display_order")
    .eq("store_id", storeId)
    .order("display_order", { ascending: true, nullsFirst: false })
    .order("name", { ascending: true });

  if (!categories) return [];

  // For categories without a specific image, use first product image from that category
  const enriched = await Promise.all(
    categories.map(async (cat) => {
      if (cat.image_url) return cat;

      const { data: product } = await supabase
        .from("products")
        .select("image")
        .eq("store_id", storeId)
        .eq("category", cat.name)
        .not("image", "is", null)
        .limit(1)
        .maybeSingle();

      return { ...cat, image_url: product?.image ?? null };
    })
  );

  return enriched;
}

export default async function StoreMenuPage({ params }: PageProps) {
  const { storeName: rawStoreName } = await params;
  const storeName = rawStoreName.toLowerCase();
  const store = await getStoreData(storeName);

  if (!store) {
    notFound();
  }

  const categories = await getCategories(store.id);

  return (
    <StoreMenuClient
      storeName={store.name}
      storeNameSlug={storeName}
      isOpen={store.is_open ?? false}
      opensAt={store.opens_at ?? null}
      closesAt={store.closes_at ?? null}
      categories={categories}
    />
  );
}
