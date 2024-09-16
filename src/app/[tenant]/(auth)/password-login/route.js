import { NextResponse } from "next/server";
import { getSupabaseCookiesUtilClient } from "@/supabase-utils/cookiesUtilCleint";
import { buildUrl } from "@/utils/url-helper";

export async function POST(request, { params }) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const tenantURL = (path) => buildUrl(path, params.tenant, request);
  const supabase = getSupabaseCookiesUtilClient();
  const { data: userData, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (
    error ||
    !userData ||
    !userData.user.app_metadata?.tenants.includes(params.tenant)
  ) {
    await supabase.auth.signOut();
    return NextResponse.redirect(tenantURL("/error?type=login-failed"), {
      status: 302,
    });
  }
  return NextResponse.redirect(tenantURL("/tickets"), {
    status: 302,
  });
}
