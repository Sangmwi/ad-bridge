"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart, BarChart3 } from "lucide-react";

type UserType = "creator" | "advertiser" | null;

export default function SignupPage() {
  const [userType, setUserType] = useState<UserType>(null);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-4xl">
        {/* Back to home */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[var(--neutral-600)] hover:text-[var(--primary)] mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>홈으로 돌아가기</span>
        </Link>

        {!userType ? (
          /* User Type Selection */
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-[var(--border)]">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-2 mb-6">
                <div className="w-12 h-12 rounded-lg bg-[var(--primary)] flex items-center justify-center">
                  <span className="text-white font-bold text-xl">A</span>
                </div>
                <span className="text-2xl font-bold">Ad-Bridge</span>
              </div>
              <h1 className="text-3xl font-bold mb-2">회원가입</h1>
              <p className="text-[var(--neutral-600)]">
                어떤 유형의 계정을 만드시겠습니까?
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Creator Option */}
              <button
                onClick={() => setUserType("creator")}
                className="p-8 rounded-xl border border-[var(--border)] hover:border-[var(--primary)] hover:shadow-md transition-all text-left group"
              >
                <div className="w-14 h-14 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center mb-6 group-hover:bg-[var(--primary)] group-hover:scale-105 transition-all">
                  <Heart className="w-7 h-7 text-[var(--primary)] group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-2xl font-bold mb-3">크리에이터</h3>
                <p className="text-[var(--neutral-600)] mb-4">
                  영향력으로 수익을 창출하고 싶은 인플루언서
                </p>
                <ul className="space-y-2 text-sm text-[var(--neutral-600)]">
                  <li>• 마이샵 생성 및 관리</li>
                  <li>• 캠페인 탐색 및 지원</li>
                  <li>• 투명한 수수료 추적</li>
                </ul>
              </button>

              {/* Advertiser Option */}
              <button
                onClick={() => setUserType("advertiser")}
                className="p-8 rounded-xl border border-[var(--border)] hover:border-[var(--primary)] hover:shadow-md transition-all text-left group"
              >
                <div className="w-14 h-14 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center mb-6 group-hover:bg-[var(--primary)] group-hover:scale-105 transition-all">
                  <BarChart3 className="w-7 h-7 text-[var(--primary)] group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-2xl font-bold mb-3">광고주</h3>
                <p className="text-[var(--neutral-600)] mb-4">
                  크리에이터와 함께 성장하고 싶은 브랜드
                </p>
                <ul className="space-y-2 text-sm text-[var(--neutral-600)]">
                  <li>• 캠페인 생성 및 관리</li>
                  <li>• 크리에이터 승인</li>
                  <li>• 실시간 성과 분석</li>
                </ul>
              </button>
            </div>

            <div className="mt-8 text-center text-sm text-[var(--neutral-600)]">
              이미 계정이 있으신가요?{" "}
              <Link
                href="/auth/login"
                className="text-[var(--primary)] font-semibold hover:underline"
              >
                로그인
              </Link>
            </div>
          </div>
        ) : (
          /* Signup Form */
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-[var(--border)]">
            <button
              onClick={() => setUserType(null)}
              className="inline-flex items-center gap-2 text-[var(--neutral-600)] hover:text-[var(--primary)] mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>뒤로 가기</span>
            </button>

            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">
                {userType === "creator" ? "크리에이터" : "광고주"} 회원가입
              </h1>
              <p className="text-[var(--neutral-600)]">
                정보를 입력하여 계정을 만드세요
              </p>
            </div>

            <form className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium mb-2"
                  >
                    이름
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    className="w-full px-4 py-3 rounded-lg border border-[var(--border)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 transition-all"
                    placeholder="홍"
                  />
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium mb-2"
                  >
                    성
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    className="w-full px-4 py-3 rounded-lg border border-[var(--border)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 transition-all"
                    placeholder="길동"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-2"
                >
                  이메일
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-3 rounded-lg border border-[var(--border)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 transition-all"
                  placeholder="your@email.com"
                />
              </div>

              {userType === "creator" && (
                <div>
                  <label
                    htmlFor="handle"
                    className="block text-sm font-medium mb-2"
                  >
                    핸들 (마이샵 URL)
                  </label>
                  <div className="flex items-center">
                    <span className="px-4 py-3 bg-[var(--neutral-100)] border border-r-0 border-[var(--border)] rounded-l-lg text-[var(--neutral-600)]">
                      ad-bridge.com/shop/
                    </span>
                    <input
                      type="text"
                      id="handle"
                      className="flex-1 px-4 py-3 rounded-r-lg border border-[var(--border)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 transition-all"
                      placeholder="your-handle"
                    />
                  </div>
                </div>
              )}

              {userType === "advertiser" && (
                <div>
                  <label
                    htmlFor="brandName"
                    className="block text-sm font-medium mb-2"
                  >
                    브랜드명
                  </label>
                  <input
                    type="text"
                    id="brandName"
                    className="w-full px-4 py-3 rounded-lg border border-[var(--border)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 transition-all"
                    placeholder="브랜드 이름을 입력하세요"
                  />
                </div>
              )}

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium mb-2"
                >
                  비밀번호
                </label>
                <input
                  type="password"
                  id="password"
                  className="w-full px-4 py-3 rounded-lg border border-[var(--border)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 transition-all"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium mb-2"
                >
                  비밀번호 확인
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  className="w-full px-4 py-3 rounded-lg border border-[var(--border)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 transition-all"
                  placeholder="••••••••"
                />
              </div>

              <label className="flex items-start gap-2 text-sm">
                <input type="checkbox" className="mt-1 rounded" />
                <span className="text-[var(--neutral-600)]">
                  <Link
                    href="#"
                    className="text-[var(--primary)] hover:underline"
                  >
                    이용약관
                  </Link>
                  과{" "}
                  <Link
                    href="#"
                    className="text-[var(--primary)] hover:underline"
                  >
                    개인정보처리방침
                  </Link>
                  에 동의합니다
                </span>
              </label>

              <Button
                type="submit"
                variant="default"
                size="lg"
                className="w-full mt-6"
              >
                회원가입
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
