import { createClient, SupabaseClient } from "@supabase/supabase-js";

let supabaseInstance: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient {
  if (supabaseInstance) return supabaseInstance;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing Supabase environment variables. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local"
    );
  }

  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  return supabaseInstance;
}

export const supabase = new Proxy({} as SupabaseClient, {
  get(_, prop) {
    return (getSupabaseClient() as any)[prop];
  },
});

/**
 * Convert a Supabase Storage path to a public URL.
 * Handles paths like "products/foo.png", "default/wings.png", or null.
 */
export function getPublicImageUrl(path: string | null): string | null {
  if (!path) return null;
  // If it's already a full URL, return as-is
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const client = getSupabaseClient();
  const { data } = client.storage.from("images").getPublicUrl(path);
  return data?.publicUrl ?? null;
}