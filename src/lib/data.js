import { getSupabaseCookiesUtilClient } from "@/supabase-utils/cookiesUtilCleint";
import { delay } from "@/utils/constants";

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

export async function fetchTickets(tenant, page, itemsPerPage) {
  const supabase = getSupabaseCookiesUtilClient();
  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage - 1;
  try {
    const {
      data: tickets,
      count,
      error,
    } = await supabase
      .from("tickets")
      .select("*", { count: "exact" })
      .eq("tenant", tenant)
      .range(start, end);
    // await delay(2000);
    if (error) {
      console.error("Error fetching tickets:", error);
    }
    return { tickets, count, error };
  } catch (error) {
    console.error("Unexpected error fetching tickets:", error);
  }
}
