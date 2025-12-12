import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // 1. 프로필 확인 및 생성
        const { data: profile } = await supabase
          .from("profiles")
          .select("id, role")
          .eq("id", user.id)
          .single();

        // 프로필이 없으면 생성 (첫 로그인)
        if (!profile) {
          await supabase.from("profiles").insert({
            id: user.id,
            email: user.email,
            role: null,
          });
          // 역할 선택 페이지로 이동
          return NextResponse.redirect(`${origin}/auth/select-role`);
        }

        // 2. 역할이 설정되어 있는 경우, 상세 정보 확인
        if (profile.role) {
          if (profile.role === "creator") {
            const { data: creator } = await supabase
              .from("creator_details")
              .select("id")
              .eq("id", user.id)
              .single();

            // 크리에이터 상세정보 있음 → 대시보드로
            if (creator) {
              return NextResponse.redirect(`${origin}/creator/dashboard`);
            }
          } else if (profile.role === "advertiser") {
            const { data: advertiser } = await supabase
              .from("advertiser_details")
              .select("id")
              .eq("id", user.id)
              .single();

            // 광고주 상세정보 있음 → 대시보드로
            if (advertiser) {
              return NextResponse.redirect(`${origin}/advertiser/dashboard`);
            }
          }

          // 역할은 있지만 상세정보 없음 → select-role로 (프로필 입력 완료 필요)
          return NextResponse.redirect(`${origin}/auth/select-role`);
        }

        // 3. 역할이 없는 경우 → 역할 선택 페이지로
        return NextResponse.redirect(`${origin}/auth/select-role`);
      }
    }
  }

  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
