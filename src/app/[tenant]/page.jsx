import { Login } from "@/components/Login";
import { getSupabaseAdminClient } from "@/supabase-utils/adminClient";
import { notFound } from "next/navigation";
import { FORM_TYPES } from "@/app/[tenant]/formTypes";

export default async function LoginPage({ searchParams, params }) {
  const tenant = params.tenant;
  const supabaseAdmin = getSupabaseAdminClient();
  const { data, error } = await supabaseAdmin
    .from("tenants")
    .select("*")
    .eq("id", tenant)
    .single();

  if (error) {
    console.log(`@error (${tenant})`, error);
    notFound();
  }
  const { name: tenantName, domain: tenantDomain, id: tenantID } = data;
  const wantsMagicLink = searchParams.magicLink === "yes";
  let formType = FORM_TYPES.PASSWORD_LOGIN;
  if (wantsMagicLink) {
    formType = FORM_TYPES.MAGIC_LINK;
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Login
        formType={formType}
        tenant={tenant}
        tenantName={tenantName}
        tenantDomain={tenantDomain}
        tenantID={tenantID}
      />
    </main>
  );
}
