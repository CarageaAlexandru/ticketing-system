import { NextResponse } from "next/server";
import { getSupabaseCookiesUtilClient } from "@/supabase-utils/cookiesUtilCleint";
import { buildUrl } from "@/utils/url-helper";

export async function GET(request, { params }) {
  const supabase = getSupabaseCookiesUtilClient();
  await supabase.auth.signOut();
  return NextResponse.redirect(buildUrl("/", params.tenant, request));
}
