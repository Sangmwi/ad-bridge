import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const supabase = await createClient();

  // 서버 사이드에서 로그아웃 (쿠키 삭제)
  await supabase.auth.signOut();

  // 메인 페이지로 리다이렉트
  return NextResponse.redirect(`${requestUrl.origin}/`);
}

