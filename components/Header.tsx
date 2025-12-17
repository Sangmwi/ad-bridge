"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut, User, LayoutDashboard } from "lucide-react";
import LogoRow from "@/assets/logos/Ad-Bridge-logo-row.svg";
import { signOut } from "@/app/actions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUserProfile } from "@/lib/queries/auth";
import { useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import { queryKeys } from "@/lib/queries/keys";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: profile, isLoading } = useUserProfile();
  const queryClient = useQueryClient();
  const user = profile?.user || null;
  const role = profile?.role || null;

  const handleSignOut = async () => {
    // 1. 클라이언트 사이드에서도 로그아웃
    const supabase = createClient();
    await supabase.auth.signOut();

    // 2. React Query 캐시 무효화
    await queryClient.invalidateQueries({ queryKey: queryKeys.auth.user() });
    await queryClient.invalidateQueries({ queryKey: queryKeys.auth.profile() });
    await queryClient.clear(); // 모든 쿼리 캐시 클리어

    // 3. 서버 사이드 로그아웃 및 리다이렉트
    await signOut();
  };

  // 역할에 따른 메뉴 아이템 설정
  const menuItems = [
    { name: "캠페인 탐색", href: "/campaigns" },
  ];

  if (role === "creator") {
    menuItems.push({ name: "내 캠페인", href: "/creator/my-campaigns" });
  } else if (role === "advertiser") {
    menuItems.push({ name: "대시보드", href: "/advertiser/dashboard" });
    }

  const getRoleText = () => {
    if (role === "advertiser") return "광고주";
    if (role === "creator") return "크리에이터";
    return "";
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-border">
      <nav className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-xl text-foreground"
          >
            <LogoRow width={140} height={35} />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:gap-x-8">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-neutral-600 hover:text-primary transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop CTA & Profile */}
          <div className="min-w-35 hidden md:flex md:items-center md:gap-x-3 md:justify-end">
            {isLoading ? (
              <div className="w-9 h-9 rounded-full bg-neutral-100 animate-pulse" />
            ) : user ? (
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="rounded-full overflow-hidden p-0 h-9 w-9 focus:ring-0"
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarImage
                        src={user.user_metadata?.avatar_url}
                        alt={user.email}
                      />
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
                        {user.email?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56 p-2 hidden md:block bg-white/80 backdrop-blur-lg"
                  align="end"
                  forceMount
                >
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium text-neutral-900 truncate">
                      {user.email}
                    </p>
                    {role && (
                      <p className="text-xs text-neutral-500 mt-0.5">
                        {getRoleText()}
                      </p>
                    )}
                  </div>

                  <DropdownMenuSeparator className="my-1 bg-neutral-100" />

                  {/* 역할별 추가 메뉴 */}
                  {role === "creator" && (
                    <DropdownMenuItem asChild className="focus:bg-primary/5 focus:text-primary cursor-pointer">
                      <Link href="/creator/my-campaigns" className="w-full flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        <span>내 캠페인</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {role === "advertiser" && (
                    <DropdownMenuItem asChild className="focus:bg-primary/5 focus:text-primary cursor-pointer">
                      <Link href="/advertiser/dashboard" className="w-full flex items-center">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>대시보드</span>
                      </Link>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuSeparator className="my-1 bg-neutral-100" />

                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="focus:bg-neutral-50 focus:text-neutral-600 cursor-pointer w-full flex items-center px-2 py-1.5 text-xs text-neutral-500 transition-colors"
                >
                    <LogOut className="mr-2 h-3.5 w-3.5" />
                    <span>로그아웃</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
                <Link href="/auth/login">
                  <Button size="sm">로그인/가입</Button>
                </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-neutral-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">메뉴 열기</span>
              {mobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border mt-2 space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block px-3 py-2 text-base font-medium text-neutral-600 hover:text-primary hover:bg-neutral-50 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}

            <div className="pt-4 mt-4 border-t border-border">
              {isLoading ? (
                <div className="px-3 py-2">
                  <div className="h-10 bg-neutral-100 rounded-md animate-pulse" />
                </div>
              ) : user ? (
                <div className="space-y-3 px-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-neutral-900 truncate">
                      {user.email}
                    </span>
                    <span className="text-xs text-neutral-500 bg-neutral-100 px-2 py-1 rounded-full">
                      {getRoleText()}
                    </span>
                  </div>
                  
                  <button
                    type="button"
                    onClick={async () => {
                      setMobileMenuOpen(false);
                      await handleSignOut();
                    }}
                    className="w-full flex items-center justify-center gap-2 h-10 text-sm font-medium text-neutral-500 border border-border rounded-md hover:bg-neutral-50 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    로그아웃
                  </button>
                </div>
              ) : (
                <div className="space-y-2 px-3">
                  <Link
                    href="/auth/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block"
                  >
                    <Button className="w-full">로그인/가입</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
