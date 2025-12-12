import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 1. 로그인하지 않은 사용자 처리
  if (
    !user &&
    !request.nextUrl.pathname.startsWith("/auth") &&
    request.nextUrl.pathname !== "/"
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  // 2. 로그인한 사용자의 프로필 완료 여부 확인
  if (
    user &&
    !request.nextUrl.pathname.startsWith("/auth") &&
    request.nextUrl.pathname !== "/"
  ) {
    // 프로필 확인
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    // 역할이 없으면 select-role로 리다이렉트
    if (!profile || !profile.role) {
      const url = request.nextUrl.clone();
      url.pathname = "/auth/select-role";
      return NextResponse.redirect(url);
    }

    // 역할은 있지만 상세 정보가 없는지 확인
    if (profile.role === "creator") {
      const { data: creator } = await supabase
        .from("creator_details")
        .select("id")
        .eq("id", user.id)
        .single();

      if (!creator) {
        const url = request.nextUrl.clone();
        url.pathname = "/auth/select-role";
        return NextResponse.redirect(url);
      }
    } else if (profile.role === "advertiser") {
      const { data: advertiser } = await supabase
        .from("advertiser_details")
        .select("id")
        .eq("id", user.id)
        .single();

      if (!advertiser) {
        const url = request.nextUrl.clone();
        url.pathname = "/auth/select-role";
        return NextResponse.redirect(url);
      }
    }
  }

  return supabaseResponse;
}
