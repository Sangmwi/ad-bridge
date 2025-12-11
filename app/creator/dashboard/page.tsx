"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { createClient } from "@/utils/supabase/client";

type Campaign = {
  id: string;
  reward_type: string;
  reward_amount: number;
  conditions: { min_followers: number };
  products: {
    name: string;
    price: number;
    image_url: string | null;
    description: string;
  };
};

export default function CreatorDashboard() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    const { data, error } = await supabase
      .from("campaigns")
      .select(
        `
        *,
        products (*)
      `,
      )
      .eq("status", "active");

    if (error) {
      console.error(error);
    } else {
      setCampaigns(data || []);
    }
    setLoading(false);
  };

  const handleApply = async (campaignId: string) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return alert("로그인이 필요합니다");

      const { error } = await supabase.from("campaign_applications").insert({
        campaign_id: campaignId,
        creator_id: user.id,
        status: "approved", // MVP 테스트를 위해 즉시 승인 처리
      });

      if (error) {
        if (error.code === "23505") {
          // Unique violation
          alert("이미 신청한 캠페인입니다.");
        } else {
          throw error;
        }
      } else {
        alert("신청이 완료되었습니다! 광고주의 승인을 기다려주세요.");
      }
    } catch (error) {
      console.error(error);
      alert("신청 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-3">캠페인 탐색</h1>
          <p className="text-lg text-[var(--neutral-600)]">
            내 마이샵에 담을 상품을 찾아보세요.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-8 h-8 border-4 border-[var(--neutral-200)] border-t-[var(--primary)] rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {campaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="bg-white rounded-xl border border-[var(--border)] overflow-hidden hover:border-[var(--primary)] hover:shadow-md transition-all"
              >
                <div className="aspect-video bg-[var(--neutral-100)] relative">
                  {campaign.products.image_url ? (
                    <img
                      src={campaign.products.image_url}
                      alt={campaign.products.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[var(--neutral-400)]">
                      No Image
                    </div>
                  )}
                  <div className="absolute top-3 right-3 bg-[var(--primary)] text-white text-xs px-3 py-1.5 rounded-lg font-semibold">
                    {campaign.reward_type === "cps" ? "판매당" : "클릭당"} ₩
                    {campaign.reward_amount.toLocaleString()}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="font-bold text-lg mb-2">
                    {campaign.products.name}
                  </h3>
                  <p className="text-sm text-[var(--neutral-600)] mb-4 line-clamp-2">
                    {campaign.products.description}
                  </p>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-[var(--border)]">
                    <div className="text-sm">
                      <span className="text-[var(--neutral-600)]">가격:</span>
                      <span className="font-semibold ml-2">
                        ₩{campaign.products.price.toLocaleString()}
                      </span>
                    </div>
                    <Button onClick={() => handleApply(campaign.id)} size="sm">
                      신청하기
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && campaigns.length === 0 && (
          <div className="text-center py-20 rounded-xl border-2 border-dashed border-[var(--border)]">
            <p className="text-[var(--neutral-600)]">
              현재 모집 중인 캠페인이 없습니다.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
