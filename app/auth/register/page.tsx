"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Heart, BarChart3, CheckCircle2 } from "lucide-react";
import LogoCol from "@/assets/logos/Ad-Bridge-logo-col.svg";
import { queryKeys } from "@/lib/queries/keys";

type Step = 1 | 2 | 3 | 4 | 5;
type Role = "creator" | "advertiser" | null;

export default function RegisterPage() {
  const [step, setStep] = useState<Step>(1);
  const [role, setRole] = useState<Role>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const router = useRouter();
  const queryClient = useQueryClient();
  const supabase = createClient();

  const [formData, setFormData] = useState({
    // Step 2: 기본 정보
    handle: "",
    // Step 3: 역할별 상세 정보
    // Creator
    bio: "",
    instagramUrl: "",
    youtubeUrl: "",
    tiktokUrl: "",
    followersCount: "",
    // Advertiser
    brandName: "",
    description: "",
    // Step 4: 약관 동의
    termsAgreed: false,
    privacyAgreed: false,
  });

  // 페이지 로드시 사용자 확인
  useEffect(() => {
    const checkUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          router.push("/auth/login");
          return;
        }

        // 이미 등록된 사용자인지 확인
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (profile?.role) {
          // 이미 등록된 사용자는 대시보드로
          if (profile.role === "creator") {
            router.push("/campaigns");
          } else if (profile.role === "advertiser") {
            router.push("/advertiser/dashboard");
          }
          return;
        }
      } catch (error) {
        console.error("Error checking user:", error);
      } finally {
        setInitialLoading(false);
      }
    };

    checkUser();
  }, [supabase, router]);

  const handleNext = () => {
    if (step < 5) {
      setStep((prev) => (prev + 1) as Step);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => (prev - 1) as Step);
    }
  };

  const handleSubmit = async () => {
    if (step !== 4) return;

    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      // 1. 프로필 생성
      const { error: profileError } = await supabase
        .from("profiles")
        .upsert(
          {
            id: user.id,
            email: user.email,
            role: role,
          },
          {
            onConflict: "id",
          }
        );

      if (profileError) throw profileError;

      // 2. 역할별 상세 정보 저장
      if (role === "creator") {
        const { error: detailsError } = await supabase
          .from("creator_details")
          .upsert(
            {
              id: user.id,
              handle: formData.handle,
              bio: formData.bio || null,
              instagram_url: formData.instagramUrl || null,
              youtube_url: formData.youtubeUrl || null,
              tiktok_url: formData.tiktokUrl || null,
              followers_count: parseInt(formData.followersCount) || 0,
            },
            {
              onConflict: "id",
            }
          );
        if (detailsError) throw detailsError;
      } else if (role === "advertiser") {
        const { error: detailsError } = await supabase
          .from("advertiser_details")
          .upsert(
            {
              id: user.id,
              brand_name: formData.brandName,
              description: formData.description || null,
            },
            {
              onConflict: "id",
            }
          );
        if (detailsError) throw detailsError;
      }

      // 3. React Query 캐시 무효화
      await queryClient.invalidateQueries({ queryKey: queryKeys.auth.user() });
      await queryClient.invalidateQueries({ queryKey: queryKeys.auth.profile() });

      // 4. 완료 페이지로 이동
      setStep(5);
    } catch (error) {
      console.error("Error registering:", error);
      alert("등록 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = () => {
    // React Query 캐시가 이미 무효화되었으므로, 전체 페이지 리로드를 통해
    // 서버 컴포넌트도 갱신되도록 함
    if (role === "creator") {
      window.location.href = "/campaigns";
    } else if (role === "advertiser") {
      window.location.href = "/advertiser/dashboard";
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <div
                key={s}
                className={`flex-1 h-2 rounded-full ${
                  s <= step ? "bg-primary" : "bg-neutral-200"
                }`}
              />
            ))}
          </div>
          <div className="flex justify-between text-xs text-neutral-500 mt-2">
            <span>역할 선택</span>
            <span>기본 정보</span>
            <span>상세 정보</span>
            <span>약관 동의</span>
            <span>완료</span>
          </div>
        </div>

        {/* Back Button */}
        {step > 1 && step < 5 && (
          <Link
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleBack();
            }}
            className="inline-flex items-center gap-2 text-neutral-600 hover:text-primary mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>이전</span>
          </Link>
        )}

        {/* Step 1: 역할 선택 */}
        {step === 1 && (
          <div className="bg-card rounded-2xl shadow-lg p-8 md:p-12 border border-border">
            <div className="text-center mb-12">
              <LogoCol width={180} height={180} className="mx-auto mb-6" />
              <h1 className="text-3xl md:text-4xl font-bold mb-2">회원가입</h1>
              <p className="text-neutral-600 text-lg">
                어떤 유형의 계정을 만드시겠습니까?
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <button
                onClick={() => {
                  setRole("creator");
                  handleNext();
                }}
                className="p-8 rounded-xl border-2 border-border hover:border-primary hover:shadow-lg transition-all text-left group bg-white"
              >
                <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:scale-110 transition-all">
                  <Heart className="w-7 h-7 text-primary group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-neutral-900">크리에이터</h3>
                <p className="text-neutral-600 mb-4 leading-relaxed">
                  영향력으로 수익을 창출하고 싶은 인플루언서
                </p>
                <ul className="space-y-2 text-sm text-neutral-600">
                  <li className="flex items-center gap-2">
                    <span className="text-primary">•</span>
                    <span>마이샵 생성 및 관리</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary">•</span>
                    <span>캠페인 탐색 및 지원</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary">•</span>
                    <span>투명한 수수료 추적</span>
                  </li>
                </ul>
              </button>

              <button
                onClick={() => {
                  setRole("advertiser");
                  handleNext();
                }}
                className="p-8 rounded-xl border-2 border-border hover:border-primary hover:shadow-lg transition-all text-left group bg-white"
              >
                <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:scale-110 transition-all">
                  <BarChart3 className="w-7 h-7 text-primary group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-neutral-900">광고주</h3>
                <p className="text-neutral-600 mb-4 leading-relaxed">
                  크리에이터와 함께 성장하고 싶은 브랜드
                </p>
                <ul className="space-y-2 text-sm text-neutral-600">
                  <li className="flex items-center gap-2">
                    <span className="text-primary">•</span>
                    <span>캠페인 생성 및 관리</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary">•</span>
                    <span>크리에이터 승인</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary">•</span>
                    <span>실시간 성과 분석</span>
                  </li>
                </ul>
              </button>
            </div>

            <div className="text-center text-sm text-neutral-600">
              이미 계정이 있으신가요?{" "}
              <Link href="/auth/login" className="text-primary font-semibold hover:underline">
                로그인
              </Link>
            </div>
          </div>
        )}

        {/* Step 2: 기본 정보 (닉네임/핸들) */}
        {step === 2 && (
          <div className="bg-card rounded-2xl shadow-lg p-8 md:p-12 border border-border">
            <h2 className="text-2xl font-bold mb-2">기본 정보</h2>
            <p className="text-neutral-600 mb-8">
              {role === "creator" ? "마이샵 URL에 사용될 핸들을 입력해주세요" : "브랜드명을 입력해주세요"}
            </p>

            <div className="space-y-6">
              {role === "creator" ? (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    핸들 (필수) <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center">
                    <span className="px-4 py-3 bg-neutral-100 border border-r-0 border-border rounded-l-lg text-neutral-600 text-sm">
                      ad-bridge.com/shop/
                    </span>
                    <input
                      type="text"
                      value={formData.handle}
                      onChange={(e) =>
                        setFormData({ ...formData, handle: e.target.value })
                      }
                      className="flex-1 px-4 py-3 rounded-r-lg border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                      placeholder="your-handle"
                      required
                    />
                  </div>
                  <p className="text-xs text-neutral-500 mt-1">
                    영문, 숫자, 하이픈(-)만 사용 가능합니다
                  </p>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    브랜드명 (필수) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.brandName}
                    onChange={(e) =>
                      setFormData({ ...formData, brandName: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-lg border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                    placeholder="브랜드 이름을 입력하세요"
                    required
                  />
                </div>
              )}

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  className="flex-1"
                >
                  이전
                </Button>
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={
                    (role === "creator" && !formData.handle) ||
                    (role === "advertiser" && !formData.brandName)
                  }
                  className="flex-1"
                >
                  다음
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: 역할별 상세 정보 */}
        {step === 3 && (
          <div className="bg-card rounded-2xl shadow-lg p-8 md:p-12 border border-border">
            <h2 className="text-2xl font-bold mb-2">상세 정보</h2>
            <p className="text-neutral-600 mb-8">
              {role === "creator"
                ? "크리에이터 프로필을 완성해주세요"
                : "브랜드 정보를 입력해주세요"}
            </p>

            <div className="space-y-6">
              {role === "creator" ? (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-2">한 줄 소개</label>
                    <input
                      type="text"
                      value={formData.bio}
                      onChange={(e) =>
                        setFormData({ ...formData, bio: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-lg border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                      placeholder="자신을 한 줄로 소개해주세요"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">팔로워 수</label>
                    <input
                      type="number"
                      value={formData.followersCount}
                      onChange={(e) =>
                        setFormData({ ...formData, followersCount: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-lg border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                      placeholder="0"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Instagram URL</label>
                    <input
                      type="url"
                      value={formData.instagramUrl}
                      onChange={(e) =>
                        setFormData({ ...formData, instagramUrl: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-lg border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                      placeholder="https://instagram.com/your-handle"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">YouTube URL</label>
                    <input
                      type="url"
                      value={formData.youtubeUrl}
                      onChange={(e) =>
                        setFormData({ ...formData, youtubeUrl: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-lg border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                      placeholder="https://youtube.com/@your-handle"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">TikTok URL</label>
                    <input
                      type="url"
                      value={formData.tiktokUrl}
                      onChange={(e) =>
                        setFormData({ ...formData, tiktokUrl: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-lg border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                      placeholder="https://tiktok.com/@your-handle"
                    />
                  </div>
                </>
              ) : (
                <div>
                  <label className="block text-sm font-medium mb-2">브랜드 설명</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-lg border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all min-h-[120px] resize-none"
                    placeholder="브랜드에 대해 설명해주세요"
                  />
                </div>
              )}

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  className="flex-1"
                >
                  이전
                </Button>
                <Button type="button" onClick={handleNext} className="flex-1">
                  다음
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: 약관 동의 */}
        {step === 4 && (
          <div className="bg-card rounded-2xl shadow-lg p-8 md:p-12 border border-border">
            <h2 className="text-2xl font-bold mb-2">약관 동의</h2>
            <p className="text-neutral-600 mb-8">
              서비스 이용을 위해 약관에 동의해주세요
            </p>

            <div className="space-y-4 mb-8">
              <label className="flex items-start gap-3 p-4 rounded-lg border border-border hover:border-primary/50 transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.termsAgreed}
                  onChange={(e) =>
                    setFormData({ ...formData, termsAgreed: e.target.checked })
                  }
                  className="mt-1 w-4 h-4 rounded border-border text-primary focus:ring-primary"
                />
                <div className="flex-1">
                  <span className="font-medium">
                    이용약관에 동의합니다 <span className="text-red-500">*</span>
                  </span>
                  <Link
                    href="/terms"
                    target="_blank"
                    className="text-primary hover:underline text-sm ml-2"
                  >
                    (전문 보기)
                  </Link>
                </div>
              </label>

              <label className="flex items-start gap-3 p-4 rounded-lg border border-border hover:border-primary/50 transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.privacyAgreed}
                  onChange={(e) =>
                    setFormData({ ...formData, privacyAgreed: e.target.checked })
                  }
                  className="mt-1 w-4 h-4 rounded border-border text-primary focus:ring-primary"
                />
                <div className="flex-1">
                  <span className="font-medium">
                    개인정보처리방침에 동의합니다 <span className="text-red-500">*</span>
                  </span>
                  <Link
                    href="/privacy"
                    target="_blank"
                    className="text-primary hover:underline text-sm ml-2"
                  >
                    (전문 보기)
                  </Link>
                </div>
              </label>
            </div>

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                className="flex-1"
              >
                이전
              </Button>
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={loading || !formData.termsAgreed || !formData.privacyAgreed}
                className="flex-1"
              >
                {loading ? "등록 중..." : "회원가입 완료"}
              </Button>
            </div>
          </div>
        )}

        {/* Step 5: 완료 */}
        {step === 5 && (
          <div className="bg-card rounded-2xl shadow-lg p-8 md:p-12 border border-border text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-2">회원가입 완료!</h2>
            <p className="text-neutral-600 mb-8">
              {role === "creator"
                ? "크리에이터 계정이 성공적으로 생성되었습니다."
                : "광고주 계정이 성공적으로 생성되었습니다."}
            </p>
            <Button onClick={handleComplete} size="lg" className="w-full">
              시작하기
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

