import { NextResponse } from "next/server";
import { getSupabaseReqResClient } from "./supabase-utils/reqResClient";

export async function middleware(req) {
  const { supabase, response } = getSupabaseReqResClient({ request: req });
  const requestedPath = req.nextUrl.pathname;
  const [tenant, ...restOfPath] = requestedPath.substring(1).split("/");
  if (!/[a-z0-9-_]+/.test(tenant)) {
    return NextResponse.rewrite(new URL("/not-found", req.url));
  }
  const applicationPath = "/" + restOfPath.join("/");
  console.log(tenant);
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (applicationPath.startsWith("/tickets")) {
    if (!user) {
      return NextResponse.redirect(new URL(`/${tenant}/`, req.url));
    }
  } else if (requestedPath === "/") {
    if (user) {
      return NextResponse.redirect(new URL(`/${tenant}/tickets`, req.url));
    }
  }

  return response.value;
}

export const config = {
  matcher: ["/((?!.*\\.).*)"],
};
