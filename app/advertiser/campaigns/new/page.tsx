"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function NewCampaignPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    productName: "",
    price: "",
    description: "",
    imageUrl: "",
    targetUrl: "", // 판매 페이지 URL
    rewardType: "cps",
    rewardAmount: "",
    minFollowers: "0",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("로그인이 필요합니다");

      // 1. 제품 등록
      const { data: product, error: productError } = await supabase
        .from("products")
        .insert({
          advertiser_id: user.id,
          name: formData.productName,
          price: parseFloat(formData.price),
          description: formData.description,
          image_url: formData.imageUrl,
          target_url: formData.targetUrl, // DB 저장
        })
        .select()
        .single();

      if (productError) throw productError;

      // 2. 캠페인 등록
      const { error: campaignError } = await supabase.from("campaigns").insert({
        product_id: product.id,
        advertiser_id: user.id,
        reward_type: formData.rewardType,
        reward_amount: parseFloat(formData.rewardAmount),
        conditions: { min_followers: parseInt(formData.minFollowers) },
        status: "active",
      });

      if (campaignError) throw campaignError;

      alert("캠페인이 성공적으로 등록되었습니다!");
      router.push("/advertiser/dashboard");
    } catch (error) {
      console.error(error);
      alert("캠페인 등록 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/advertiser/dashboard"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>대시보드로 돌아가기</span>
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h1 className="text-2xl font-bold mb-6">새 캠페인 등록</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold border-b pb-2">제품 정보</h2>

              <div>
                <label className="block text-sm font-medium mb-1">제품명</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-[var(--primary)]"
                  value={formData.productName}
                  onChange={(e) =>
                    setFormData({ ...formData, productName: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  가격 (원)
                </label>
                <input
                  type="number"
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-[var(--primary)]"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  제품 이미지 URL
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-[var(--primary)]"
                  value={formData.imageUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, imageUrl: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  판매 페이지 URL (소비자가 구매할 곳)
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://myshop.com/products/123"
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-[var(--primary)]"
                  value={formData.targetUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, targetUrl: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  상세 설명
                </label>
                <textarea
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-[var(--primary)]"
                  rows={4}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-4 pt-6">
              <h2 className="text-lg font-semibold border-b pb-2">
                캠페인 조건
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    보상 방식
                  </label>
                  <select
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-[var(--primary)]"
                    value={formData.rewardType}
                    onChange={(e) =>
                      setFormData({ ...formData, rewardType: e.target.value })
                    }
                  >
                    <option value="cps">CPS (판매 건당)</option>
                    <option value="cpc">CPC (클릭 건당)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    보상 금액 (원)
                  </label>
                  <input
                    type="number"
                    required
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-[var(--primary)]"
                    value={formData.rewardAmount}
                    onChange={(e) =>
                      setFormData({ ...formData, rewardAmount: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  최소 팔로워 조건
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-[var(--primary)]"
                  value={formData.minFollowers}
                  onChange={(e) =>
                    setFormData({ ...formData, minFollowers: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="pt-6">
              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={loading}
              >
                {loading ? "등록 중..." : "캠페인 등록하기"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
