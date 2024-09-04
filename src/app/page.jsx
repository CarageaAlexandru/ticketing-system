import { getSupabaseCookiesUtilClient } from "@/supabase-utils/cookiesUtilCleint";
import { Login } from "@/components/Login";

export default async function LoginPage({ searchParams }) {
  const supabase = getSupabaseCookiesUtilClient();
  const wantsMagicLink = searchParams.magicLink === "yes";

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Login isPasswordLogin={!wantsMagicLink} />
    </main>
  );
}
