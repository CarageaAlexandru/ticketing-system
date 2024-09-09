import { getSupabaseCookiesUtilClient } from "@/supabase-utils/cookiesUtilCleint";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { currentPassword, newPassword } = await request.json();

    const supabase = getSupabaseCookiesUtilClient();

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;

    return NextResponse.json(
      { message: "Password updated successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating password:", error);
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
