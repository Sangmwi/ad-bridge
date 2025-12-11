"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function SelectRolePage() {
  const [role, setRole] = useState<"creator" | "advertiser" | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    handle: "",
    brandName: "",
    description: "",
  });
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      // 1. Update Profile Role
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ role: role })
        .eq("id", user.id);

      if (profileError) throw profileError;

      // 2. Insert Details based on Role
      if (role === "creator") {
        const { error: detailsError } = await supabase
          .from("creator_details")
          .insert({
            id: user.id,
            handle: formData.handle,
          });
        if (detailsError) throw detailsError;
        router.push("/creator/dashboard");
      } else if (role === "advertiser") {
        const { error: detailsError } = await supabase
          .from("advertiser_details")
          .insert({
            id: user.id,
            brand_name: formData.brandName,
            description: formData.description,
          });
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
        <button
          onClick={() => setRole(null)}
          className="text-sm text-gray-500 hover:text-gray-900 mb-6 flex items-center gap-1"
        >
          ← 다시 선택하기
        </button>

        <h2 className="text-2xl font-bold mb-6">
          {role === "creator" ? "크리에이터 프로필 설정" : "브랜드 정보 설정"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {role === "creator" ? (
            <div>
              <label className="block text-sm font-medium mb-2">
                핸들 (ID)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-gray-500">@</span>
                <input
                  type="text"
                  required
                  value={formData.handle}
                  onChange={(e) =>
                    setFormData({ ...formData, handle: e.target.value })
                  }
                  className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[var(--primary)] focus:outline-none"
                  placeholder="username"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                마이샵 주소로 사용됩니다.
              </p>
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
