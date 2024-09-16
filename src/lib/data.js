import { getSupabaseCookiesUtilClient } from "@/supabase-utils/cookiesUtilCleint";

export async function fetchTenantById(tenant) {
  const supabase = getSupabaseCookiesUtilClient();
  try {
    const { data, error } = await supabase
      .from("tenants")
      .select("name, id")
      .eq("id", tenant)
      .single();
    if (error) {
      console.error("Error fetching recipe by tenant id", error);
    }
    return data;
  } catch (error) {
    console.error("Unexpected error fetching tenant by id:", error);
  }
}
