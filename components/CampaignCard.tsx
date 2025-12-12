"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";

type Product = {
  name: string;
  price: number;
  image_url: string | null;
  description: string;
};

type Campaign = {
  id: string;
  reward_type: string;
  reward_amount: number;
  conditions: { min_followers: number };
  products: Product | Product[] | null;
};

export function CampaignCard({ campaign }: { campaign: Campaign }) {
  const supabase = createClient();
  const product = Array.isArray(campaign.products)
    ? campaign.products[0]
    : campaign.products;

  if (!product) return null;

  const handleApply = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return alert("로그인이 필요합니다");

      const { error } = await supabase.from("campaign_applications").insert({
        campaign_id: campaign.id,
        creator_id: user.id,
        status: "pending", // 승인 대기 상태로 신청
      });

      if (error) {
        if (error.code === "23505") {
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
    <div className="bg-white rounded-xl border border-[var(--border)] overflow-hidden hover:border-[var(--primary)] hover:shadow-md transition-all">
      <div className="aspect-video bg-[var(--neutral-100)] relative">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
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
        <h3 className="font-bold text-lg mb-2">{product.name}</h3>
        <p className="text-sm text-[var(--neutral-600)] mb-4 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-[var(--border)]">
          <div className="text-sm">
            <span className="text-[var(--neutral-600)]">가격:</span>
            <span className="font-semibold ml-2">
              ₩{product.price.toLocaleString()}
            </span>
          </div>
          <Button onClick={handleApply} size="sm">
            신청하기
          </Button>
        </div>
      </div>
    </div>
  );
}

