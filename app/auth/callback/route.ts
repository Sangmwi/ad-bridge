import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // 상세 정보가 이미 있는지 확인
        const { data: creator } = await supabase
          .from("creator_details")
          .select("id")
          .eq("id", user.id)
          .single();

        const { data: advertiser } = await supabase
          .from("advertiser_details")
          .select("id")
          .eq("id", user.id)
          .single();

        // 상세 정보가 있으면 해당 대시보드로 이동
        if (creator) {
          return NextResponse.redirect(`${origin}/creator/dashboard`);
        }
        if (advertiser) {
          return NextResponse.redirect(`${origin}/advertiser/dashboard`);
        }

        // 상세 정보가 없으면 역할 선택 페이지로 이동
        return NextResponse.redirect(`${origin}/auth/select-role`);
      }
    }
  }

  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
