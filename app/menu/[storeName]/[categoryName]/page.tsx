import { notFound } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import ProductListClient from "@/app/components/ProductListClient";
import { ProductOption } from "@/app/components/ProductModal";

type PageProps = {
  params: Promise<{ storeName: string; categoryName: string }>;
};

async function getStoreData(storeNameSlug: string) {
  const { data: allStores } = await supabase
    .from("stores")
    .select("id, name, active, is_open")
    .eq("active", true);

  if (!allStores) return null;

  // Match by slug: convert store name to slug and compare
  return allStores.find(
    (s) => s.name.toLowerCase().replace(/\s+/g, '-') === storeNameSlug
  ) ?? null;
}

async function getCategoryName(storeId: string, categorySlug: string) {
  const { data: allCats } = await supabase
    .from("product_categories")
    .select("name")
    .eq("store_id", storeId);

  if (!allCats) return null;

  // Match by slug: convert each category name to a slug and compare
  const match = allCats.find(
    (cat) => cat.name.toLowerCase().replace(/\s+/g, '-') === categorySlug
  );

  return match?.name ?? null;
}

async function getProducts(storeId: string, categoryName: string) {
  const { data } = await supabase
    .from("products")
    .select("id, name, price, image, category")
    .eq("store_id", storeId)
    .eq("category", categoryName)
    .order("name", { ascending: true });

  return data ?? [];
}

async function getProductOptionsMap(productIds: string[]): Promise<Record<string, ProductOption[]>> {
  if (productIds.length === 0) return {};

  // Fetch all questions for these products
  const { data: questions } = await supabase
    .from("product_questions")
    .select("id, product_id, question, required, multiple, order")
    .in("product_id", productIds)
    .order("order", { ascending: true });

  if (!questions || questions.length === 0) return {};

  // Fetch all options for these questions
  const questionIds = questions.map((q) => q.id);
  const { data: options } = await supabase
    .from("product_question_options")
    .select("id, question_id, label, price, order")
    .in("question_id", questionIds)
    .order("order", { ascending: true });

  // Group options by question_id
  const optionsByQuestionId: Record<string, { id: string; label: string; price: number | null }[]> = {};
  if (options) {
    options.forEach((opt) => {
      if (!optionsByQuestionId[opt.question_id]) {
        optionsByQuestionId[opt.question_id] = [];
      }
      optionsByQuestionId[opt.question_id].push({
        id: opt.id,
        label: opt.label,
        price: opt.price,
      });
    });
  }

  // Build the map: productId -> ProductOption[]
  const map: Record<string, ProductOption[]> = {};
  questions.forEach((q) => {
    if (!map[q.product_id]) {
      map[q.product_id] = [];
    }
    map[q.product_id].push({
      questionId: q.id,
      questionLabel: q.question,
      required: q.required ?? false,
      multiple: q.multiple ?? false,
      options: optionsByQuestionId[q.id] || [],
    });
  });

  return map;
}

export default async function CategoryProductsPage({ params }: PageProps) {
  const { storeName: rawStoreName, categoryName: rawCategoryName } = await params;
  const storeName = rawStoreName.toLowerCase();
  const categoryName = rawCategoryName.toLowerCase();
  const store = await getStoreData(storeName);

  if (!store) {
    notFound();
  }

  const resolvedCategory = await getCategoryName(store.id, categoryName);

  if (!resolvedCategory) {
    notFound();
  }

  const products = await getProducts(store.id, resolvedCategory);
  const productIds = products.map((p) => p.id);
  const productOptionsMap = await getProductOptionsMap(productIds);

  return (
    <ProductListClient
      products={products}
      storeId={store.id}
      storeName={store.name}
      categoryName={categoryName}
      storeNameSlug={storeName}
      resolvedCategory={resolvedCategory}
      productOptionsMap={productOptionsMap}
    />
  );
}