"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function SelectRolePage() {
  const [role, setRole] = useState<"creator" | "advertiser" | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [hasExistingRole, setHasExistingRole] = useState(false); // 이미 역할이 있는지 여부
  const [formData, setFormData] = useState({
    // Creator fields
    handle: "",
    bio: "",
    instagramUrl: "",
    youtubeUrl: "",
    tiktokUrl: "",
    followersCount: "",
    // Advertiser fields
    brandName: "",
    description: "",
  });
  const router = useRouter();
  const supabase = createClient();

  // 페이지 로드시 기존 프로필 확인
  useEffect(() => {
    const checkExistingProfile = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          router.push("/auth/login");
          return;
        }

        // 프로필에서 기존 역할 확인
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (profile?.role) {
          // 역할이 이미 있으면 자동으로 설정
          setRole(profile.role as "creator" | "advertiser");
          setHasExistingRole(true);
        }
      } catch (error) {
        console.error("Error checking profile:", error);
      } finally {
        setInitialLoading(false);
      }
    };

    checkExistingProfile();
  }, [supabase, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      // 1. Upsert Profile (insert or update)
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

      // 2. Upsert Details based on Role
      if (role === "creator") {
        const { error: detailsError } = await supabase
          .from("creator_details")
          .upsert(
            {
              id: user.id,
              handle: formData.handle,
              bio: formData.bio,
              instagram_url: formData.instagramUrl,
              youtube_url: formData.youtubeUrl,
              tiktok_url: formData.tiktokUrl,
              followers_count: parseInt(formData.followersCount) || 0,
            },
            {
              onConflict: "id",
            }
          );
        if (detailsError) throw detailsError;
        router.push("/campaigns");
      } else if (role === "advertiser") {
        const { error: detailsError } = await supabase
          .from("advertiser_details")
          .upsert(
            {
              id: user.id,
              brand_name: formData.brandName,
              description: formData.description,
            },
            {
              onConflict: "id",
            }
          );
        if (detailsError) throw detailsError;
        router.push("/advertiser/dashboard");
      }
    } catch (error) {
      console.error("Error updating role:", error);
      alert("설정 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 초기 로딩 중
  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!role) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <h1 className="text-3xl font-bold mb-8 text-center">
          어떤 목적으로 오셨나요?
        </h1>
        <div className="grid md:grid-cols-2 gap-6 w-full max-w-4xl">
          {/* Creator Card */}
          <div
            onClick={() => setRole("creator")}
            className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 cursor-pointer hover:border-[var(--primary)] hover:shadow-md transition-all group"
          >
            <div className="h-12 w-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-6 text-2xl group-hover:scale-110 transition-transform">
              🎨
            </div>
            <h3 className="text-xl font-bold mb-2">크리에이터</h3>
            <p className="text-gray-500">
              광고 캠페인을 찾아 홍보하고
              <br />
              수익을 창출하고 싶어요.
            </p>
          </div>

          {/* Advertiser Card */}
          <div
            onClick={() => setRole("advertiser")}
            className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 cursor-pointer hover:border-[var(--primary)] hover:shadow-md transition-all group"
          >
            <div className="h-12 w-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-6 text-2xl group-hover:scale-110 transition-transform">
              🏢
            </div>
            <h3 className="text-xl font-bold mb-2">광고주</h3>
            <p className="text-gray-500">
              우리 브랜드 제품을 홍보할
              <br />
              크리에이터를 찾고 있어요.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 w-full max-w-md">
        {/* 역할이 이미 설정되어 있지 않은 경우만 "다시 선택하기" 버튼 표시 */}
        {!hasExistingRole && (
          <button
            onClick={() => setRole(null)}
            className="text-sm text-gray-500 hover:text-gray-900 mb-6 flex items-center gap-1"
          >
            ← 다시 선택하기
          </button>
        )}

        <h2 className="text-2xl font-bold mb-6">
          {role === "creator" ? "크리에이터 프로필 설정" : "브랜드 정보 설정"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {role === "creator" ? (
            <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium mb-1">
                  핸들 (ID) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                  <span className="absolute left-4 top-3 text-gray-500">@</span>
                <input
                  type="text"
                  required
                  value={formData.handle}
                  onChange={(e) =>
                    setFormData({ ...formData, handle: e.target.value })
                  }
                    className="w-full pl-8 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-[var(--primary)] focus:outline-none"
                  placeholder="username"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  한 줄 소개
                </label>
                <input
                  type="text"
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-[var(--primary)] focus:outline-none"
                  placeholder="예: 패션과 뷰티를 사랑하는 크리에이터입니다."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  SNS 채널 링크 (최소 1개)
                </label>
                <div className="space-y-2">
                  <input
                    type="url"
                    value={formData.instagramUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, instagramUrl: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-[var(--primary)] focus:outline-none text-sm"
                    placeholder="인스타그램 주소 (https://instagram.com/...)"
                  />
                  <input
                    type="url"
                    value={formData.youtubeUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, youtubeUrl: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-[var(--primary)] focus:outline-none text-sm"
                    placeholder="유튜브 채널 주소"
                  />
                  <input
                    type="url"
                    value={formData.tiktokUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, tiktokUrl: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-[var(--primary)] focus:outline-none text-sm"
                    placeholder="틱톡 프로필 주소"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  총 팔로워 수 (합계)
                </label>
                <input
                  type="number"
                  value={formData.followersCount}
                  onChange={(e) =>
                    setFormData({ ...formData, followersCount: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-[var(--primary)] focus:outline-none"
                  placeholder="0"
                />
              </div>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">
                  브랜드/회사명
                </label>
                <input
                  type="text"
                  required
                  value={formData.brandName}
                  onChange={(e) =>
                    setFormData({ ...formData, brandName: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[var(--primary)] focus:outline-none"
                  placeholder="Ad-Bridge Inc."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  한 줄 소개
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[var(--primary)] focus:outline-none"
                  placeholder="어떤 브랜드인지 간단히 소개해주세요."
                  rows={3}
                />
              </div>
            </>
          )}

          <Button
            type="submit"
            size="lg"
            className="w-full mt-6"
            disabled={loading}
          >
            {loading ? "저장 중..." : "시작하기"}
          </Button>
        </form>
      </div>
    </div>
  );
}
