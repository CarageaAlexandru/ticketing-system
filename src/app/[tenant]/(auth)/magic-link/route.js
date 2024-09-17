import { NextResponse } from "next/server";
import { buildUrl } from "@/utils/url-helper";
import { sendOTPLink } from "@/utils/sendOTPLink";

export async function POST(request, { params }) {
  const { tenant } = params;
  const formData = await request.formData();
  const email = formData.get("email");
  const type = formData.get("type") === "recovery" ? "recovery" : "magiclink";
  const errorURL = buildUrl(`/error?type=${type}`, tenant, request);
  const thanksUrl = buildUrl(
    `/magic-link-thanks?type=${type}`,
    params.tenant,
    request,
  );
  const otpSuccess = await sendOTPLink(email, type, tenant, request);
  if (!otpSuccess) {
    return NextResponse.redirect(errorURL, 302);
  } else {
    return NextResponse.redirect(thanksUrl, 302);
  }
}
