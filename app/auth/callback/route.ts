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
        // 1. 프로필 조회
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("id, role")
          .eq("id", user.id)
          .single();

        // 프로필이 없으면 (PGRST116) 등록 페이지로
        if (profileError?.code === "PGRST116") {
          return NextResponse.redirect(`${origin}/auth/register`);
        }

        // 프로필 조회 실패 (다른 에러)
        if (profileError) {
          console.error("Profile select error:", profileError);
          return NextResponse.redirect(`${origin}/auth/auth-code-error`);
        }

        // 역할이 없으면 등록 페이지로
        if (!profile || !profile.role) {
          return NextResponse.redirect(`${origin}/auth/register`);
        }

        // 2. 역할에 따른 상세 정보 확인
        if (profile.role === "creator") {
          const { data: creator } = await supabase
            .from("creator_details")
            .select("id")
            .eq("id", user.id)
            .single();

          // 크리에이터 상세정보 있음 → 대시보드로
          if (creator) {
            return NextResponse.redirect(`${origin}/campaigns`);
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

        // 역할은 있지만 상세정보 없음 → register로 (프로필 입력 완료 필요)
        return NextResponse.redirect(`${origin}/auth/register`);
      }
    }
  }

  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
