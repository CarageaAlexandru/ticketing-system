import { getSupabaseAdminClient } from "@/supabase-utils/adminClient";
import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
import { buildUrl } from "@/utils/url-helper";

export async function POST(request, { params }) {
  const formData = await request.formData();
  const email = formData.get("email");
  const supabaseAdmin = getSupabaseAdminClient();
  const type = formData.get("type") === "recovery" ? "recovery" : "magiclink";
  const tenantURL = (path) => buildUrl(path, params.tenant, request);
  const { data: linkData, error } = await supabaseAdmin.auth.admin.generateLink(
    {
      email,
      type,
    },
  );

  if (error) {
    console.error(error);
    return NextResponse.redirect(tenantURL(`/error?type=${type}`), 302);
  }

  const { hashed_token } = linkData.properties;

  const constructedLink = new URL(
    `/verify?hashed_token=${hashed_token}&type=${type}`,
    request.url,
  );

  const transporter = nodemailer.createTransport({
    host: "localhost",
    port: 54325,
  });

  const initialSentence =
    type === "recovery"
      ? "Hi there, you requested a password change!"
      : "Hi there, this is a custom magic link email!";
  const secondSentenceEnding = type === "recovery" ? "change it" : "log in";

  await transporter.sendMail({
    from: "Your Company <your@mail.whatever>",
    to: email,
    subject: "Magic Link",
    html: `
    <h1>${initialSentence}</h1>
    <p>Click <a href="${constructedLink.toString()}">here</a> to ${secondSentenceEnding}.</p>
    `,
  });

  const thanksURL = tenantURL(`/magic-link-thanks?type=${type}`);
  return NextResponse.redirect(thanksURL, 302);
}
