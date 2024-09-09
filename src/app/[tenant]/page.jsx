import { Login } from "@/components/Login";
import { getSupabaseAdminClient } from "@/supabase-utils/adminClient";
import { notFound } from "next/navigation";

export default async function LoginPage({ searchParams, params }) {
  const supabaseAdmin = getSupabaseAdminClient();
  const { data, error } = await supabaseAdmin
    .from("tenants")
    .select("*")
    .eq("id", params.tenant)
    .single();
  if (error) {
    notFound();
  }
  const { name: tenantName } = data;
  const wantsMagicLink = searchParams.magicLink === "yes";

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Login
        isPasswordLogin={!wantsMagicLink}
        tenant={params.tenant}
        tenantName={tenantName}
      />
    </main>
  );
}
