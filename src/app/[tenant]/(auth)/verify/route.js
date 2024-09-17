import { NextResponse } from "next/server";
import { getSupabaseCookiesUtilClient } from "@/supabase-utils/cookiesUtilCleint";
import { buildUrl } from "@/utils/url-helper";

export async function GET(request, { params }) {
  const { searchParams } = new URL(request.url);
  const hashed_token = searchParams.get("hashed_token");
  const isRecovery = searchParams.get("type") === "recovery";
  const isSignUp = searchParams.get("type") === "signup";

  const tenantURL = (path) => buildUrl(path, params.tenant, request);
  const getRedirect = (path) => NextResponse.redirect(tenantURL(path));

  const supabase = getSupabaseCookiesUtilClient();

  let verifyType = "magiclink";
  if (isRecovery) verifyType = "recovery";
  else if (isSignUp) verifyType = "signup";

  const { error } = await supabase.auth.verifyOtp({
    type: verifyType,
    token_hash: hashed_token,
  });

  if (error) {
    getRedirect("/error?type=invalid_magiclink");
  } else {
    if (isRecovery) {
      return getRedirect("/tickets/change-password");
    } else {
      return getRedirect("/tickets");
    }
  }
}
