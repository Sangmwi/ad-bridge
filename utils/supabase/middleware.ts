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

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  // Legacy route redirect: creator dashboard was renamed to the public campaigns explore page
  if (path === "/creator/dashboard") {
    return NextResponse.redirect(new URL("/campaigns", request.url));
  }

  // 1. 공용 경로 정의 (로그인 없이 접근 가능)
  // - / : 랜딩 페이지
  // - /auth/* : 로그인, 회원가입 등 인증 관련
  // - /campaigns : 공용 캠페인 탐색
  // - /cl/* : 트래킹 링크
  // - /api/* : API 라우트 (필요 시 내부에서 별도 검증)
  const isPublicPath =
    path === "/" ||
    path.startsWith("/auth") ||
    path.startsWith("/campaigns") ||
    path.startsWith("/cl") ||
    path.startsWith("/api") ||
    path.match(/\.(ico|svg|png|jpg|jpeg)$/); // 정적 파일

  // 2. 비로그인 사용자 접근 제어
  if (!user && !isPublicPath) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    url.searchParams.set("next", path); // 로그인 후 돌아올 경로 저장
    return NextResponse.redirect(url);
  }

  // 3. 로그인 사용자 처리
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    // 3-1. 역할(Role) 미설정 사용자 -> 역할 선택 페이지로 강제 이동
    // (단, 로그아웃 등 auth 관련 로직은 제외)
    if (
      !profile?.role &&
      !path.startsWith("/auth")
    ) {
      return NextResponse.redirect(new URL("/auth/select-role", request.url));
    }

    // 3-2. 역할이 이미 설정된 사용자가 역할 선택 페이지 접근 시 -> 홈으로
    if (profile?.role && path.startsWith("/auth/select-role")) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // 3-3. 역할별 경로 접근 제어 (RBAC)
    if (profile?.role === "creator") {
      // 크리에이터가 광고주 페이지 접근 시 차단
      if (path.startsWith("/advertiser")) {
        return NextResponse.redirect(new URL("/", request.url));
      }
      // 루트 경로 리다이렉트
      if (path === "/dashboard" || path === "/creator") {
        return NextResponse.redirect(new URL("/creator/my-campaigns", request.url));
      }
    } else if (profile?.role === "advertiser") {
      // 광고주가 크리에이터 전용 페이지 접근 시 차단
      if (path.startsWith("/creator")) {
        return NextResponse.redirect(new URL("/", request.url));
      }
      // 루트 경로 리다이렉트
      if (path === "/dashboard" || path === "/advertiser") {
        return NextResponse.redirect(new URL("/advertiser/dashboard", request.url));
      }
    }
  }

  return supabaseResponse;
}
