import { NextResponse } from "next/server";
import { getSupabaseReqResClient } from "./supabase-utils/reqResClient";

export async function middleware(req) {
  const { supabase, response } = getSupabaseReqResClient({ request: req });

  const requestedPath = req.nextUrl.pathname;
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (requestedPath.startsWith("/tickets")) {
    if (!user) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  } else if (requestedPath === "/") {
    if (user) {
      return NextResponse.redirect(new URL("/tickets", req.url));
    }
  }

  return response.value;
}

export const config = {
  matcher: ["/((?!.*\\.).*)"],
};
